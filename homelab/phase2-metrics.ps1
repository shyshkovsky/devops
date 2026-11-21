# Homelab phase 2: metrics for the mini PC (windows_exporter -> Prometheus -> Grafana dashboard).
# Everything listens on 127.0.0.1 only. Run in PowerShell as Administrator from the repo root:
#   powershell -ExecutionPolicy Bypass -File .\homelab\phase2-metrics.ps1
# Safe to run again. Requires phase1.ps1 (Grafana) to be installed.
$ErrorActionPreference = 'Stop'
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Run this script in an elevated (Administrator) PowerShell.'
}
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$base = Join-Path $env:ProgramData 'homelab'
$prom = Join-Path $base 'prometheus'
$dash = Join-Path $base 'dashboards'
New-Item -ItemType Directory -Force $prom, $dash, (Join-Path $base 'downloads') | Out-Null

function Get-GithubAsset([string]$Repo, [string]$Pattern) {
  $rel = Invoke-RestMethod -UseBasicParsing "https://api.github.com/repos/$Repo/releases/latest"
  $a = $rel.assets | Where-Object { $_.name -like $Pattern } | Select-Object -First 1
  if (-not $a) { throw "No asset matching $Pattern in the latest release of $Repo" }
  $out = Join-Path (Join-Path $base 'downloads') $a.name
  if (-not (Test-Path $out)) { Invoke-WebRequest -UseBasicParsing $a.browser_download_url -OutFile $out }
  return $out
}

# 1. windows_exporter (Windows service, loopback only)
if (-not (Get-Service windows_exporter -ErrorAction SilentlyContinue)) {
  $msi = Get-GithubAsset 'prometheus-community/windows_exporter' 'windows_exporter-*-amd64.msi'
  $p = Start-Process msiexec.exe -Wait -PassThru -ArgumentList @('/i', "`"$msi`"", 'ENABLED_COLLECTORS=cpu,cs,logical_disk,memory,net,os,system,service', 'LISTEN_ADDR=127.0.0.1', 'LISTEN_PORT=9182', '/qn')
  if ($p.ExitCode -notin 0, 3010) { throw "windows_exporter MSI failed with exit code $($p.ExitCode)" }
  Start-Sleep -Seconds 5
}

# 2. Prometheus (scheduled task at boot, loopback only, 90 days of history)
if (-not (Test-Path (Join-Path $prom 'prometheus.exe'))) {
  $zip = Get-GithubAsset 'prometheus/prometheus' 'prometheus-*.windows-amd64.zip'
  $tmp = Join-Path $base 'downloads\prom-extract'
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
  Expand-Archive $zip $tmp -Force
  $inner = Get-ChildItem $tmp -Directory | Select-Object -First 1
  Copy-Item (Join-Path $inner.FullName '*') $prom -Recurse -Force
}
Set-Content -Path (Join-Path $prom 'prometheus.yml') -Encoding ASCII -Value @'
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: windows
    static_configs:
      - targets: ['127.0.0.1:9182']
  - job_name: prometheus
    static_configs:
      - targets: ['127.0.0.1:9090']
'@
Stop-ScheduledTask -TaskName 'Homelab-Prometheus' -ErrorAction SilentlyContinue
Get-Process prometheus -ErrorAction SilentlyContinue | Stop-Process -Force
$promArgs = '--config.file="{0}\prometheus.yml" --storage.tsdb.path="{0}\data" --storage.tsdb.retention.time=90d --web.listen-address=127.0.0.1:9090' -f $prom
$act = New-ScheduledTaskAction -Execute (Join-Path $prom 'prometheus.exe') -Argument $promArgs -WorkingDirectory $prom
$set = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 5 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Unregister-ScheduledTask -TaskName 'Homelab-Prometheus' -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName 'Homelab-Prometheus' -Action $act -Trigger (New-ScheduledTaskTrigger -AtStartup) -Settings $set -User 'SYSTEM' -RunLevel Highest | Out-Null
Start-ScheduledTask -TaskName 'Homelab-Prometheus'

# 3. Grafana: data source + dashboard (provisioning files, then restart the service)
$gsvc = Get-CimInstance Win32_Service -Filter "Name='Grafana'" -ErrorAction SilentlyContinue
if (-not $gsvc) { throw 'Grafana service not found. Run homelab\phase1.ps1 first.' }
$cands = @()
$exe = ($gsvc.PathName -replace '^\s*"?([^"]+?\.exe)"?.*$', '$1')
$d = Split-Path $exe
while ($d -and ($cands.Count -lt 4)) { $cands += $d; $d = Split-Path $d }
$cands += (Join-Path $env:ProgramFiles 'GrafanaLabs\grafana')
$root = $cands | Where-Object { Test-Path (Join-Path $_ 'conf\defaults.ini') } | Select-Object -First 1
if (-not $root) { throw "Could not find the Grafana folder (looked in: $($cands -join '; '))." }
$prov = Join-Path $root 'conf\provisioning'
New-Item -ItemType Directory -Force (Join-Path $prov 'datasources'), (Join-Path $prov 'dashboards') | Out-Null
Set-Content -Path (Join-Path $prov 'datasources\homelab.yaml') -Encoding ASCII -Value @'
apiVersion: 1
datasources:
  - name: Prometheus
    uid: prometheus
    type: prometheus
    access: proxy
    url: http://127.0.0.1:9090
    isDefault: true
'@
Set-Content -Path (Join-Path $prov 'dashboards\homelab.yaml') -Encoding ASCII -Value ("apiVersion: 1`nproviders:`n  - name: homelab`n    folder: Homelab`n    type: file`n    options:`n      path: $dash`n")
Copy-Item (Join-Path $here 'dashboards\*.json') $dash -Force
Restart-Service Grafana
Start-Sleep -Seconds 10

# 4. Checks
function Test-Url($u) { try { return (Invoke-WebRequest -UseBasicParsing $u -TimeoutSec 10).Content } catch { return $null } }
$m = Test-Url 'http://127.0.0.1:9182/metrics'
if (-not $m) { Write-Warning 'windows_exporter does not answer on 127.0.0.1:9182' }
else {
  foreach ($name in 'windows_cpu_time_total', 'windows_memory_available_bytes', 'windows_cs_physical_memory_bytes', 'windows_logical_disk_size_bytes', 'windows_net_bytes_received_total') {
    if ($m -notmatch [regex]::Escape($name)) { Write-Warning "Metric $name is missing: the dashboard panel that uses it will be empty." }
  }
}
Get-NetTCPConnection -State Listen -LocalPort 9182, 9090 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort | Format-Table -AutoSize | Out-String | Write-Host
if (Test-Url 'http://127.0.0.1:9090/-/ready') { Write-Host 'Prometheus: ready' -ForegroundColor Green } else { Write-Warning 'Prometheus is not ready yet (check Get-ScheduledTask Homelab-Prometheus)' }
$ts = Join-Path $env:ProgramFiles 'Tailscale\tailscale.exe'
$ip = '<tailscale-ip>'
if (Test-Path $ts) { $ip = (& $ts ip -4 | Select-Object -First 1) }
Write-Host "Open Grafana: http://${ip}:3000  ->  Dashboards -> Homelab -> Mini PC (data appears after a minute)" -ForegroundColor Green
