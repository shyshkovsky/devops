# One-time setup on the Windows home server. Run in PowerShell as Administrator:
#   .\install.ps1                  # install and start everything, DNS untouched
#   .\install.ps1 -EnableDuckDns   # additionally point shyshka.duckdns.org at this PC (cut-over)
param([switch]$EnableDuckDns)
$ErrorActionPreference = 'Stop'
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Run this script in an elevated (Administrator) PowerShell.'
}
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = (Resolve-Path (Join-Path $here '..\..')).Path
New-Item -ItemType Directory -Force (Join-Path $here 'logs'), (Join-Path $here 'bin') | Out-Null

# 1. Python
$pyCmd = Get-Command py -ErrorAction SilentlyContinue
if (-not $pyCmd) { $pyCmd = Get-Command python -ErrorAction SilentlyContinue }
if (-not $pyCmd) {
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements
    $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
    $pyCmd = Get-Command py -ErrorAction SilentlyContinue
    if (-not $pyCmd) { $pyCmd = Get-Command python -ErrorAction SilentlyContinue }
  }
  if (-not $pyCmd) { throw 'Python 3.11+ not found. Install it from python.org (tick "Add to PATH"), then run this again.' }
}
$venv = Join-Path $here '.venv'
if (-not (Test-Path "$venv\Scripts\python.exe")) {
  if ($pyCmd.Name -like 'py*') { & $pyCmd.Source -3 -m venv $venv } else { & $pyCmd.Source -m venv $venv }
}
& "$venv\Scripts\python.exe" -m pip install --upgrade pip
& "$venv\Scripts\python.exe" -m pip install -r "$repo\backend\requirements.txt" -r "$repo\contact-service\requirements.txt" -r "$repo\ticket-demo\requirements.txt"

# 2. Caddy (official download endpoint)
$caddy = Join-Path $here 'bin\caddy.exe'
if (-not (Test-Path $caddy)) {
  Invoke-WebRequest -UseBasicParsing 'https://caddyserver.com/api/download?os=windows&arch=amd64' -OutFile $caddy
}
& $caddy version

# 3. Secrets file for the contact form
$envFile = Join-Path $repo 'contact-service\.env'
if (-not (Test-Path $envFile)) {
  Copy-Item (Join-Path $repo 'contact-service\.env.example') $envFile
  Write-Host "Created $envFile - open it and fill in the Telegram and SMTP values, then restart the task." -ForegroundColor Yellow
}

# 4. Firewall (the services behind Caddy listen on 127.0.0.1 only)
foreach ($p in 80, 443, 8081) {
  $n = "Portfolio TCP $p"
  if (-not (Get-NetFirewallRule -DisplayName $n -ErrorAction SilentlyContinue)) {
    New-NetFirewallRule -DisplayName $n -Direction Inbound -Protocol TCP -LocalPort $p -Action Allow -Profile Any | Out-Null
  }
}

# 5. Never sleep
powercfg /change standby-timeout-ac 0; powercfg /change hibernate-timeout-ac 0; powercfg /hibernate off

# 6. Scheduled tasks
$ps = (Get-Command powershell.exe).Source
$stack = New-ScheduledTaskAction -Execute $ps -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$here\start-all.ps1`""
$set = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 5 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Unregister-ScheduledTask -TaskName 'Portfolio-Stack' -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName 'Portfolio-Stack' -Action $stack -Trigger (New-ScheduledTaskTrigger -AtStartup) -Settings $set -User 'SYSTEM' -RunLevel Highest | Out-Null
Start-ScheduledTask -TaskName 'Portfolio-Stack'

if ($EnableDuckDns) {
  $tokenFile = Join-Path $here 'duckdns.token'
  if (-not (Test-Path $tokenFile)) {
    $t = Read-Host 'DuckDNS token (from duckdns.org, stored only on this PC)'
    Set-Content -Path $tokenFile -Value $t.Trim() -NoNewline
    icacls $tokenFile /inheritance:r /grant:r 'SYSTEM:(R)' 'Administrators:(R)' | Out-Null
  }
  $dns = New-ScheduledTaskAction -Execute $ps -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$here\update-duckdns.ps1`""
  $trg = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)
  Unregister-ScheduledTask -TaskName 'Portfolio-DuckDNS' -Confirm:$false -ErrorAction SilentlyContinue
  Register-ScheduledTask -TaskName 'Portfolio-DuckDNS' -Action $dns -Trigger $trg -User 'SYSTEM' -RunLevel Highest | Out-Null
  Start-ScheduledTask -TaskName 'Portfolio-DuckDNS'
  Write-Host 'DuckDNS updater enabled: the domain now points at this PC.' -ForegroundColor Green
} else {
  Write-Host 'DNS NOT changed. Test http://localhost:8088 first, then run: .\install.ps1 -EnableDuckDns' -ForegroundColor Cyan
}
