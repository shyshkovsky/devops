# Windows home-server deployment (no Docker, no VM)

Runs the whole portfolio on a Windows PC: **Caddy** (automatic HTTPS) in front of the FastAPI
backend, the contact service and the ticket demo. Services listen on 127.0.0.1 only; only
Caddy is exposed (80, 443, 8081).

## Steps (PowerShell as Administrator, in this folder)
1. `.\install.ps1` - installs Python deps and Caddy, registers a boot task, starts everything. DNS is not touched.
2. Fill in `..\..\contact-service\.env` (Telegram token + chat id, SMTP app password), then
   `Stop-ScheduledTask Portfolio-Stack; Start-ScheduledTask Portfolio-Stack`.
3. Check locally: <http://localhost:8088> (site) and <http://localhost:8089> (ticket demo).
4. Router: forward TCP 80, 443 and 8081 to this PC (reserve its IP in DHCP).
5. Cut-over: `.\install.ps1 -EnableDuckDns` and paste the DuckDNS token. Caddy requests the certificate by itself
   within a minute or two. Verify from a phone on mobile data (testing from inside the LAN may not work).

## Operations
- Logs: `logs\*.log`, `logs\*.log.err`
- Restart: `Stop-ScheduledTask Portfolio-Stack; Start-ScheduledTask Portfolio-Stack`
- Update the site: `git pull`, then restart the task
- Never commit `contact-service\.env` or `duckdns.token` (both are ignored by git)

## No router access? Use Tailscale Funnel
If you cannot forward ports, skip steps 4-5 above and run (as Administrator, after `install.ps1`):
```powershell
powershell -ExecutionPolicy Bypass -File .\setup-funnel.ps1
```
It installs Tailscale, asks you to sign in (a URL is printed), switches Caddy to loopback-only listeners and
publishes the site at `https://shyshka.<tailnet>.ts.net` and the ticket demo at `...ts.net:8443`.
`stop-all.ps1` stops everything cleanly. Funnel mode is a file switch: delete `funnel.mode` and restart the task to go back.
