"""Contact form service: email (SMTP) + Telegram bot notification."""
import asyncio
import logging
import os
import smtplib
import time
from collections import defaultdict, deque
from email.message import EmailMessage

import httpx
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

log = logging.getLogger("contact")
logging.basicConfig(level=logging.INFO)

DRY_RUN = os.getenv("DRY_RUN", "0") == "1"
TRUST_PROXY = os.getenv("TRUST_PROXY", "0") == "1"  # set to 1 behind nginx
RATE_LIMIT = int(os.getenv("RATE_LIMIT", "5"))  # messages per window per IP
RATE_WINDOW = int(os.getenv("RATE_WINDOW_SECONDS", "3600"))

TG_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TG_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
MAIL_TO = os.getenv("MAIL_TO", SMTP_USER)

app = FastAPI(title="Contact service", docs_url=None, redoc_url=None)
_hits: dict[str, deque] = defaultdict(deque)


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    company: str = Field(default="", max_length=120)
    message: str = Field(min_length=5, max_length=4000)
    website: str = ""  # honeypot: real users leave it empty


def client_ip(request: Request) -> str:
    if TRUST_PROXY:
        fwd = request.headers.get("x-forwarded-for", "")
        if fwd:
            return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limited(ip: str) -> bool:
    now = time.monotonic()
    q = _hits[ip]
    while q and now - q[0] > RATE_WINDOW:
        q.popleft()
    if len(q) >= RATE_LIMIT:
        return True
    q.append(now)
    return False


def format_text(m: ContactIn) -> str:
    lines = [f"Name: {m.name}", f"Email: {m.email}"]
    if m.company:
        lines.append(f"Company: {m.company}")
    lines += ["", m.message]
    return "\n".join(lines)


def _send_email_sync(m: ContactIn) -> None:
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio contact: {m.name}"
    msg["From"] = SMTP_USER
    msg["To"] = MAIL_TO
    msg["Reply-To"] = str(m.email)
    msg.set_content(format_text(m))
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASSWORD)
        s.send_message(msg)


async def send_email(m: ContactIn) -> bool:
    if DRY_RUN:
        log.info("[dry-run] email:\n%s", format_text(m))
        return True
    if not (SMTP_USER and SMTP_PASSWORD and MAIL_TO):
        log.warning("email not configured")
        return False
    try:
        await asyncio.to_thread(_send_email_sync, m)
        return True
    except Exception:
        log.exception("email failed")
        return False


async def send_telegram(m: ContactIn) -> bool:
    text = "New portfolio message\n\n" + format_text(m)
    if DRY_RUN:
        log.info("[dry-run] telegram:\n%s", text)
        return True
    if not (TG_TOKEN and TG_CHAT_ID):
        log.warning("telegram not configured")
        return False
    try:
        # plain text (no parse_mode) so user input can't break formatting
        async with httpx.AsyncClient(timeout=10) as c:
            r = await c.post(
                f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
                json={"chat_id": TG_CHAT_ID, "text": text[:4000]},
            )
            r.raise_for_status()
        return True
    except Exception as e:
        # don't log the URL: it contains the bot token
        log.error("telegram failed: %s", type(e).__name__)
        return False


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/contact")
async def contact(m: ContactIn, request: Request):
    if m.website:  # bot filled the honeypot: pretend success, send nothing
        return {"ok": True}
    if rate_limited(client_ip(request)):
        raise HTTPException(429, "Too many messages, try again later")
    email_ok, tg_ok = await asyncio.gather(send_email(m), send_telegram(m))
    if not (email_ok or tg_ok):
        raise HTTPException(502, "Could not deliver the message")
    return {"ok": True}
