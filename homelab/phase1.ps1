# Homelab phase 1 (needs NO virtualization): folder layout on the spare SSDs, Jellyfin, Grafana.
# Run in PowerShell as Administrator from the repo root:
#   powershell -ExecutionPolicy Bypass -File .\homelab\phase1.ps1
#   powershell -ExecutionPolicy Bypass -File .\homelab\phase1.ps1 -Drives E,H,I
# Nothing is formatted or deleted. Services are reachable only through Tailscale (100.64.0.0/10).
param([string[]]$Drives = @('E', 'H', 'I'))
$ErrorActionPreference = 'Stop'
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Run this script in an elevated (Administrator) PowerShell.'
}
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) { throw 'winget not found (install "App Installer" from the Microsoft Store).' }

# 1. Plan the spare SSDs by size: smallest = backups, largest = media, middle = data
$vols = @(foreach ($d in $Drives) {
  $v = Get-Volume -DriveLetter $d -ErrorAction SilentlyContinue
  if ($v) { [pscustomobject]@{ Letter = $d; SizeGB = [int]($v.Size / 1GB); FreeGB = [int]($v.SizeRemaining / 1GB) } }
  else { Write-Warning "Drive ${d}: not found, skipping" }
})
$vols = @($vols | Sort-Object SizeGB)
if ($vols.Count -eq 0) { throw 'None of the given drives exist. Pass the right letters with -Drives.' }
$backup = $vols[0].Letter
$media  = $vols[$vols.Count - 1].Letter
$data   = if ($vols.Count -ge 3) { $vols[1].Letter } else { $media }

$vols | Format-Table -AutoSize | Out-String | Write-Host
Write-Host "  media   -> ${media}:\media    (Jellyfin library)"
Write-Host "  data    -> ${data}:\data      (future Nextcloud, containers, VMs)"
Write-Host "  backups -> ${backup}:\backups"
if ((Read-Host 'Create these folders and install Jellyfin + Grafana? (y/N)') -ne 'y') { Write-Host 'Cancelled.'; return }

foreach ($p in "${media}:\media\movies", "${media}:\media\shows", "${media}:\media\music", "${data}:\data", "${backup}:\backups") {
  New-Item -ItemType Directory -Force $p | Out-Null
}

# 2. Install (winget prints progress on stderr, which must not be fatal)
function Install-Pkg([string[]]$Ids) {
  $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  try {
    foreach ($id in $Ids) {
      & winget install -e --id $id --accept-package-agreements --accept-source-agreements
      if ($LASTEXITCODE -eq 0) { return $id }
      & winget list -e --id $id | Out-Null
      if ($LASTEXITCODE -eq 0) { return $id }   # already installed
    }
  } finally { $ErrorActionPreference = $prev }
  return $null
}
$jf = Install-Pkg @('Jellyfin.Server')
$gr = Install-Pkg @('GrafanaLabs.Grafana.OSS', 'GrafanaLabs.Grafana.Enterprise')
if (-not $jf) { Write-Warning 'Jellyfin was not installed (see the winget output above).' }
if (-not $gr) { Write-Warning 'Grafana was not installed (see the winget output above).' }

# 3. Firewall: only Tailscale addresses may connect
foreach ($r in @(@('Jellyfin (Tailscale only)', 8096), @('Grafana (Tailscale only)', 3000))) {
  if (-not (Get-NetFirewallRule -DisplayName $r[0] -ErrorAction SilentlyContinue)) {
    New-NetFirewallRule -DisplayName $r[0] -Direction Inbound -Protocol TCP -LocalPort $r[1] -RemoteAddress '100.64.0.0/10' -Action Allow -Profile Any | Out-Null
  }
}

# 4. Summary
$ts = Join-Path $env:ProgramFiles 'Tailscale\tailscale.exe'
$ip = '<tailscale-ip>'
if (Test-Path $ts) { $ip = (& $ts ip -4 | Select-Object -First 1) }
Get-Service | Where-Object { $_.Name -match 'jellyfin|grafana' } | Select-Object Name, Status, StartType | Format-Table -AutoSize | Out-String | Write-Host
Write-Host "Jellyfin: http://${ip}:8096   (first-run wizard: add libraries from ${media}:\media\...)" -ForegroundColor Green
Write-Host "Grafana : http://${ip}:3000   (login admin / admin, change the password at once)" -ForegroundColor Green
Write-Host 'If a service is missing above, start the app from the Start menu once and tell me what you see.'
