# Makes everything come back by itself after a reboot / power cut (no login needed):
#   - JobWatch dashboard server (serve.py)           -> task JobWatch-Serve   (at boot, restarts if it dies)
#   - JobWatch full collection (both profiles)       -> task JobWatch-Full    (twice a day)
#   - JobWatch quick Djinni check (both profiles)    -> task JobWatch-Djinni  (every 30 min)
#   - Windows services (AdGuard, Grafana, Jellyfin, exporter, Tailscale) -> Automatic + restart on failure
# Run in PowerShell as Administrator:
#   powershell -ExecutionPolicy Bypass -File .\homelab\autostart.ps1
#   powershell -ExecutionPolicy Bypass -File .\homelab\autostart.ps1 -JobWatch E:\jobwatch
# The tasks run as SYSTEM with their own virtualenv (E:\jobwatch\.venv), so they do not depend on who is logged in.
param([string]$JobWatch = 'E:\jobwatch')
$ErrorActionPreference = 'Stop'
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Run this script in an elevated (Administrator) PowerShell.'
}
if (-not (Test-Path (Join-Path $JobWatch 'jobwatch.py'))) { throw "jobwatch.py not found in $JobWatch (use -JobWatch <folder>)." }

# 1. A dedicated virtualenv for JobWatch (SYSTEM cannot see packages installed for your user account)
$venvPy = Join-Path $JobWatch '.venv\Scripts\python.exe'
if (-not (Test-Path $venvPy)) {
  $py = $null
  foreach ($v in '3.12', '3.13', '3.11') {
    $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    & py "-$v" -c 'import sys' 2>$null | Out-Null
    $ok = ($LASTEXITCODE -eq 0); $ErrorActionPreference = $prev
    if ($ok) { $py = @('py', "-$v"); break }
  }
  if (-not $py) { $cmd = Get-Command python -ErrorAction SilentlyContinue; if ($cmd) { $py = @($cmd.Source) } }
  if (-not $py) { throw 'Python not found.' }
  Write-Host "Creating virtualenv in $JobWatch\.venv ..."
  $exe = $py[0]; $rest = @(); if ($py.Count -gt 1) { $rest = $py[1..($py.Count - 1)] }
  $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  & $exe @rest -m venv (Join-Path $JobWatch '.venv') 2>&1 | Write-Host
  $ErrorActionPreference = $prev
}
$prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
& $venvPy -m pip install --quiet --only-binary=:all: -r (Join-Path $JobWatch 'requirements.txt') 2>&1 | Write-Host
$ErrorActionPreference = $prev
if ($LASTEXITCODE -ne 0) { throw 'pip install failed.' }

# 2. Scheduled tasks (SYSTEM, no login required)
function Set-Task($name, $action, $triggers, $settings) {
  Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction SilentlyContinue
  Register-ScheduledTask -TaskName $name -Action $action -Trigger $triggers -Settings $settings -User 'SYSTEM' -RunLevel Highest | Out-Null
  Write-Host "  task $name registered"
}
$common = @{ AllowStartIfOnBatteries = $true; DontStopIfGoingOnBatteries = $true; StartWhenAvailable = $true; ExecutionTimeLimit = (New-TimeSpan -Seconds 0) }

# the dashboard server: starts at boot and restarts if it crashes
$serve = New-ScheduledTaskAction -Execute $venvPy -Argument 'serve.py' -WorkingDirectory $JobWatch
$sset  = New-ScheduledTaskSettingsSet @common -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -MultipleInstances IgnoreNew
Set-Task 'JobWatch-Serve' $serve @(New-ScheduledTaskTrigger -AtStartup) $sset

# collection runs (cmd /c is only used to append the output to a log file)
function Run-Action($args2, $log) {
  New-ScheduledTaskAction -Execute 'cmd.exe' -WorkingDirectory $JobWatch `
    -Argument ('/c ""{0}" jobwatch.py {1} >> {2} 2>&1"' -f $venvPy, $args2, $log)
}
$full = @(
  (Run-Action ''        'jobwatch.log'),
  (Run-Action 'partner' 'jobwatch_partner.log')
)
$rset = New-ScheduledTaskSettingsSet @common -MultipleInstances IgnoreNew
$t1 = New-ScheduledTaskTrigger -Daily -At '07:30'
$t2 = New-ScheduledTaskTrigger -Daily -At '19:30'
Unregister-ScheduledTask -TaskName 'JobWatch-Full' -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName 'JobWatch-Full' -Action $full -Trigger @($t1, $t2) -Settings $rset -User 'SYSTEM' -RunLevel Highest | Out-Null
Write-Host '  task JobWatch-Full registered (07:30 and 19:30)'

$quick = @(
  (Run-Action '--djinni-only'         'jobwatch.log'),
  (Run-Action 'partner --djinni-only' 'jobwatch_partner.log')
)
$tq = New-ScheduledTaskTrigger -Once -At (Get-Date).Date -RepetitionInterval (New-TimeSpan -Minutes 30) -RepetitionDuration (New-TimeSpan -Days 3650)
Unregister-ScheduledTask -TaskName 'JobWatch-Djinni' -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName 'JobWatch-Djinni' -Action $quick -Trigger $tq -Settings $rset -User 'SYSTEM' -RunLevel Highest | Out-Null
Write-Host '  task JobWatch-Djinni registered (every 30 min)'

# 3. Windows services: start automatically, restart after a failure
$svcNames = 'AdGuardHome', 'Grafana', 'grafana', 'Jellyfin', 'JellyfinServer', 'windows_exporter', 'Tailscale'
foreach ($n in $svcNames | Select-Object -Unique) {
  $s = Get-Service -Name $n -ErrorAction SilentlyContinue
  if (-not $s) { continue }
  Set-Service -Name $s.Name -StartupType Automatic
  & sc.exe failure $s.Name reset= 86400 actions= restart/60000/restart/60000/restart/60000 | Out-Null
  if ($s.Status -ne 'Running') { Start-Service $s.Name -ErrorAction SilentlyContinue }
  Write-Host "  service $($s.Name): Automatic + restart on failure"
}

# 4. Make sure the machine never sleeps, and a quick report
powercfg /change standby-timeout-ac 0 | Out-Null
powercfg /change hibernate-timeout-ac 0 | Out-Null
Start-ScheduledTask JobWatch-Serve
Start-Sleep 3

Write-Host "`n== Autostart report =="
'Portfolio-Stack', 'Portfolio-DuckDNS', 'Homelab-Prometheus', 'JobWatch-Serve', 'JobWatch-Full', 'JobWatch-Djinni' | ForEach-Object {
  $t = Get-ScheduledTask -TaskName $_ -ErrorAction SilentlyContinue
  $trig = if ($t) { ($t.Triggers | ForEach-Object { $_.CimClass.CimClassName -replace 'MSFT_Task|Trigger', '' }) -join ',' } else { '' }
  '{0,-20} {1,-10} {2}' -f $_, $(if ($t) { $t.State } else { 'MISSING' }), $trig
}
Get-Service AdGuardHome, Grafana, Jellyfin*, windows_exporter, Tailscale -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType | Format-Table -AutoSize
try { 'JobWatch API: ' + (Invoke-WebRequest http://localhost:8080/api/apps -UseBasicParsing -TimeoutSec 5).StatusCode } catch { 'JobWatch API: not answering yet' }
