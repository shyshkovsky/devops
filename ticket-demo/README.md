# Helpdesk ticket demo

FastAPI + SQLite + a single-page UI. Demo identities (no passwords): **customer** sees
only their own tickets; **agent** sees all tickets, internal notes, SLA/overdue and stats.
The whole database resets every `DEMO_RESET_HOURS` (default 24).

## Run on Windows without Docker (works right now)
```powershell
cd ticket-demo
py -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8081
```
Open http://localhost:8081 (or http://IP_мініпк:8081 from another device in your LAN).
Allow it through Windows Firewall for the private network only:
```powershell
New-NetFirewallRule -DisplayName "Ticket demo 8081 (LAN)" -Direction Inbound -Protocol TCP -LocalPort 8081 -RemoteAddress LocalSubnet -Action Allow
```

## Autostart on boot (Task Scheduler, runs even when nobody is logged in)
```powershell
$a = New-ScheduledTaskAction -Execute "$PWD\.venv\Scripts\python.exe" -Argument "-m uvicorn app.main:app --host 0.0.0.0 --port 8081" -WorkingDirectory "$PWD"
$t = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -TaskName "TicketDemo" -Action $a -Trigger $t -User "SYSTEM" -RunLevel Highest
```

## Docker (later, on the Ubuntu VM)
```yaml
  tickets:
    build: ./ticket-demo
    restart: unless-stopped
    environment: [TRUST_PROXY=1]
    ports: ["127.0.0.1:8081:8000"]   # or proxy through Nginx on its own port/subdomain
```

## Settings (env vars)
`DEMO_RESET_HOURS` (24, 0 = off) · `TRUST_PROXY` (1 behind Nginx) · `WRITE_LIMIT` (40 writes/hour/IP) ·
`MAX_TICKETS` (300) · `MAX_USERS` (200) · `DB_PATH`.

## Before exposing to the internet
Put it behind Nginx with HTTPS and set `TRUST_PROXY=1`. Don't forward port 8081 straight from the router.
