"""Helpdesk ticket system demo: FastAPI + SQLite.

Public-demo hygiene built in: no passwords (demo identities only), input limits,
per-IP rate limits, row caps, and the whole database resets every DEMO_RESET_HOURS.
"""
import asyncio
import os
import secrets
import sqlite3
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager, contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Literal, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

DB_PATH = os.getenv("DB_PATH", "tickets.db")
RESET_HOURS = float(os.getenv("DEMO_RESET_HOURS", "24"))  # 0 disables auto-reset
TRUST_PROXY = os.getenv("TRUST_PROXY", "0") == "1"
MAX_TICKETS = int(os.getenv("MAX_TICKETS", "300"))
MAX_USERS = int(os.getenv("MAX_USERS", "200"))
WRITE_LIMIT = int(os.getenv("WRITE_LIMIT", "40"))  # writes per hour per IP
STATIC = Path(__file__).parent / "static"

Status = Literal["open", "in_progress", "resolved", "closed"]
Priority = Literal["low", "normal", "high", "urgent"]
SLA_HOURS = {"urgent": 2, "high": 8, "normal": 24, "low": 72}
AGENT_NAME = "Demo Agent"

_writes: dict[str, deque] = defaultdict(deque)


def now() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.isoformat(timespec="seconds")


@contextmanager
def db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with db() as c:
        c.executescript(
            """
            DROP TABLE IF EXISTS comments; DROP TABLE IF EXISTS tickets;
            DROP TABLE IF EXISTS sessions; DROP TABLE IF EXISTS users;
            CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL);
            CREATE TABLE sessions(token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id));
            CREATE TABLE tickets(
                id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL,
                status TEXT NOT NULL, priority TEXT NOT NULL, created_by INTEGER NOT NULL REFERENCES users(id),
                assignee TEXT, created_at TEXT NOT NULL, due_at TEXT NOT NULL);
            CREATE TABLE comments(
                id INTEGER PRIMARY KEY, ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
                author TEXT NOT NULL, body TEXT NOT NULL, internal INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
            """
        )
        c.execute("INSERT INTO users(id,name,role) VALUES (1,?, 'agent')", (AGENT_NAME,))
        c.execute("INSERT INTO users(id,name,role) VALUES (2,'Alice (sample)', 'customer')")
        samples = [
            ("VPN drops every 30 minutes", "Since Monday the VPN disconnects on the office Wi-Fi.", "in_progress", "high", 5),
            ("Request: new laptop for onboarding", "New colleague starts on the 1st, needs a laptop and accounts.", "open", "normal", 2),
            ("Printer on floor 2 offline", "Shows offline for everyone since this morning.", "open", "urgent", 1),
            ("Shared mailbox access", "Please add me to the finance shared mailbox.", "resolved", "low", 30),
            ("Wi-Fi password rotation", "Guest Wi-Fi password should be rotated quarterly.", "closed", "low", 60),
        ]
        for i, (title, desc, status, prio, age_h) in enumerate(samples, start=1):
            created = now() - timedelta(hours=age_h)
            due = created + timedelta(hours=SLA_HOURS[prio])
            c.execute(
                "INSERT INTO tickets(id,title,description,status,priority,created_by,assignee,created_at,due_at)"
                " VALUES (?,?,?,?,?,2,?,?,?)",
                (i, title, desc, status, prio, AGENT_NAME if status != "open" else None, iso(created), iso(due)),
            )
        c.execute(
            "INSERT INTO comments(ticket_id,author,body,internal,created_at) VALUES (1,?,?,0,?)",
            (AGENT_NAME, "Looking into the VPN gateway logs, will update shortly.", iso(now() - timedelta(hours=4))),
        )
        c.execute(
            "INSERT INTO comments(ticket_id,author,body,internal,created_at) VALUES (1,?,?,1,?)",
            (AGENT_NAME, "Internal: MTU mismatch suspected on the new firewall.", iso(now() - timedelta(hours=3))),
        )


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    task = None
    if RESET_HOURS > 0:

        async def reset_loop():
            while True:
                await asyncio.sleep(RESET_HOURS * 3600)
                init_db()

        task = asyncio.create_task(reset_loop())
    yield
    if task:
        task.cancel()


app = FastAPI(title="Helpdesk demo", docs_url=None, redoc_url=None, lifespan=lifespan)


def client_ip(request: Request) -> str:
    if TRUST_PROXY:
        fwd = request.headers.get("x-forwarded-for", "")
        if fwd:
            return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check_write_limit(request: Request) -> None:
    ip, t = client_ip(request), time.monotonic()
    q = _writes[ip]
    while q and t - q[0] > 3600:
        q.popleft()
    if len(q) >= WRITE_LIMIT:
        raise HTTPException(429, "Too many actions, try again later")
    q.append(t)


def current_user(authorization: str = Header(default="")) -> dict:
    token = authorization.removeprefix("Bearer ").strip()
    with db() as c:
        row = c.execute(
            "SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?", (token,)
        ).fetchone()
    if not row:
        raise HTTPException(401, "Not logged in")
    return dict(row)


def require_agent(user: dict = Depends(current_user)) -> dict:
    if user["role"] != "agent":
        raise HTTPException(403, "Agents only")
    return user


def ticket_dict(row: sqlite3.Row, names: dict) -> dict:
    d = dict(row)
    d["created_by_name"] = names.get(d["created_by"], "?")
    d["overdue"] = d["status"] in ("open", "in_progress") and d["due_at"] < iso(now())
    return d


def load_ticket(c: sqlite3.Connection, ticket_id: int, user: dict) -> sqlite3.Row:
    row = c.execute("SELECT * FROM tickets WHERE id=?", (ticket_id,)).fetchone()
    # customers get 404 (not 403) for other people's tickets: don't reveal existence
    if not row or (user["role"] != "agent" and row["created_by"] != user["id"]):
        raise HTTPException(404, "Ticket not found")
    return row


class LoginIn(BaseModel):
    role: Literal["customer", "agent"]


class TicketIn(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=3, max_length=2000)
    priority: Priority = "normal"


class CommentIn(BaseModel):
    body: str = Field(min_length=1, max_length=2000)
    internal: bool = False


class TicketPatch(BaseModel):
    status: Optional[Status] = None
    priority: Optional[Priority] = None
    assign_to_me: Optional[bool] = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/login")
def login(body: LoginIn, request: Request):
    check_write_limit(request)
    token = secrets.token_urlsafe(24)
    with db() as c:
        if body.role == "agent":
            user = c.execute("SELECT * FROM users WHERE role='agent'").fetchone()
        else:
            if c.execute("SELECT COUNT(*) FROM users").fetchone()[0] >= MAX_USERS:
                raise HTTPException(503, "Demo is full, it resets soon")
            name = f"Guest-{secrets.token_hex(2)}"
            cur = c.execute("INSERT INTO users(name,role) VALUES (?, 'customer')", (name,))
            user = c.execute("SELECT * FROM users WHERE id=?", (cur.lastrowid,)).fetchone()
        c.execute("INSERT INTO sessions(token,user_id) VALUES (?,?)", (token, user["id"]))
    return {"token": token, "name": user["name"], "role": user["role"]}


@app.get("/api/tickets")
def list_tickets(status: Optional[Status] = None, user: dict = Depends(current_user)):
    sql, args = "SELECT * FROM tickets", []
    where = []
    if user["role"] != "agent":
        where.append("created_by=?")
        args.append(user["id"])
    if status:
        where.append("status=?")
        args.append(status)
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY id DESC"
    with db() as c:
        names = {r["id"]: r["name"] for r in c.execute("SELECT id,name FROM users")}
        return [ticket_dict(r, names) for r in c.execute(sql, args)]


@app.post("/api/tickets", status_code=201)
def create_ticket(body: TicketIn, request: Request, user: dict = Depends(current_user)):
    check_write_limit(request)
    created = now()
    due = created + timedelta(hours=SLA_HOURS[body.priority])
    with db() as c:
        if c.execute("SELECT COUNT(*) FROM tickets").fetchone()[0] >= MAX_TICKETS:
            raise HTTPException(503, "Demo is full, it resets soon")
        cur = c.execute(
            "INSERT INTO tickets(title,description,status,priority,created_by,created_at,due_at)"
            " VALUES (?,?,'open',?,?,?,?)",
            (body.title.strip(), body.description.strip(), body.priority, user["id"], iso(created), iso(due)),
        )
    return {"id": cur.lastrowid}


@app.get("/api/tickets/{ticket_id}")
def get_ticket(ticket_id: int, user: dict = Depends(current_user)):
    with db() as c:
        row = load_ticket(c, ticket_id, user)
        names = {r["id"]: r["name"] for r in c.execute("SELECT id,name FROM users")}
        sql = "SELECT * FROM comments WHERE ticket_id=?"
        if user["role"] != "agent":
            sql += " AND internal=0"  # customers never see internal notes
        comments = [dict(r) for r in c.execute(sql + " ORDER BY id", (ticket_id,))]
        return {**ticket_dict(row, names), "comments": comments}


@app.post("/api/tickets/{ticket_id}/comments", status_code=201)
def add_comment(ticket_id: int, body: CommentIn, request: Request, user: dict = Depends(current_user)):
    check_write_limit(request)
    if body.internal and user["role"] != "agent":
        raise HTTPException(403, "Agents only")
    with db() as c:
        load_ticket(c, ticket_id, user)
        c.execute(
            "INSERT INTO comments(ticket_id,author,body,internal,created_at) VALUES (?,?,?,?,?)",
            (ticket_id, user["name"], body.body.strip(), int(body.internal), iso(now())),
        )
    return {"ok": True}


@app.patch("/api/tickets/{ticket_id}")
def update_ticket(ticket_id: int, body: TicketPatch, request: Request, user: dict = Depends(require_agent)):
    check_write_limit(request)
    with db() as c:
        row = load_ticket(c, ticket_id, user)
        status = body.status or row["status"]
        priority = body.priority or row["priority"]
        due = row["due_at"]
        if body.priority:
            due = iso(datetime.fromisoformat(row["created_at"]) + timedelta(hours=SLA_HOURS[priority]))
        assignee = user["name"] if body.assign_to_me else row["assignee"]
        c.execute(
            "UPDATE tickets SET status=?, priority=?, due_at=?, assignee=? WHERE id=?",
            (status, priority, due, assignee, ticket_id),
        )
    return {"ok": True}


@app.get("/api/stats")
def stats(_: dict = Depends(require_agent)):
    with db() as c:
        by_status = {s: 0 for s in ("open", "in_progress", "resolved", "closed")}
        for r in c.execute("SELECT status, COUNT(*) n FROM tickets GROUP BY status"):
            by_status[r["status"]] = r["n"]
        overdue = c.execute(
            "SELECT COUNT(*) FROM tickets WHERE status IN ('open','in_progress') AND due_at < ?", (iso(now()),)
        ).fetchone()[0]
    return {"by_status": by_status, "overdue": overdue}


@app.get("/")
def index():
    return FileResponse(STATIC / "index.html")
