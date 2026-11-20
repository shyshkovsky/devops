# Publishes the site through Tailscale Funnel: works without any router access.
# Run in PowerShell as Administrator (after install.ps1):
#   powershell -ExecutionPolicy Bypass -File .\setup-funnel.ps1
# Result: https://<hostname>.<your-tailnet>.ts.net  (site)  and  ...ts.net:8443  (ticket demo)
param([string]$Hostname = 'shyshka')
$ErrorActionPreference = 'Stop'
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Run this script in an elevated (Administrator) PowerShell.'
}
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Tailscale
$ts = Join-Path $env:ProgramFiles 'Tailscale\tailscale.exe'
if (-not (Test-Path $ts)) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) { throw 'winget not found. Install Tailscale from tailscale.com/download/windows and run this again.' }
  $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  winget install -e --id Tailscale.Tailscale --accept-package-agreements --accept-source-agreements
  $ErrorActionPreference = $prev
  if (-not (Test-Path $ts)) { throw 'Tailscale was installed but not found. Open a new PowerShell window and run this again.' }
}

# native tools print progress to stderr, which must not be fatal
$ErrorActionPreference = 'Continue'

# 2. Log in (prints a URL: open it on your phone and sign in; the command continues by itself)
& $ts up
if ($LASTEXITCODE -ne 0) { throw 'tailscale up failed' }
& $ts set --hostname=$Hostname

# 3. Switch the stack to the loopback-only Caddy config and restart it cleanly
New-Item -ItemType File -Force (Join-Path $here 'funnel.mode') | Out-Null
& (Join-Path $here 'stop-all.ps1')
Start-ScheduledTask -TaskName 'Portfolio-Stack'
Start-Sleep -Seconds 15
try { (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8088/api/health).Content } catch { Write-Warning 'Local check failed: see logs\caddy.log.err' }

# 4. Publish. The first time, Tailscale prints a URL to enable Funnel/HTTPS for your account: open it, approve, and it continues.
& $ts funnel --bg 8088
& $ts funnel --bg --https=8443 8089
& $ts funnel status
Write-Host 'Done. Open the https://...ts.net address shown above from your phone (mobile data).' -ForegroundColor Green
