# AdGuard Home on the mini PC: network-wide DNS filtering + dashboard, reachable ONLY through Tailscale (and the LAN for DNS).
# Run in PowerShell as Administrator from the repo root, in two steps:
#   1)  powershell -ExecutionPolicy Bypass -File .\homelab\adguard.ps1
#       -> downloads AdGuard Home, opens the firewall for Tailscale, starts the setup wizard on port 3001
#       -> finish the wizard in a browser from your laptop/phone (it is on Tailscale): http://<tailscale-ip>:3001
#   2)  powershell -ExecutionPolicy Bypass -File .\homelab\adguard.ps1 -Finish
#       -> stops the wizard process and installs AdGuard Home as a Windows service (starts at boot)
# Port 3000 is taken by Grafana, so the dashboard lives on 3001. Nothing is exposed to the internet.
param([switch]$Finish, [string]$TailscaleIp = '')
$ErrorActionPreference = 'Stop'
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Run this script in an elevated (Administrator) PowerShell.'
}
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$root = 'C:\ProgramData\homelab\AdGuardHome'
$exe  = Join-Path $root 'AdGuardHome.exe'
$ts   = if ($TailscaleIp) { $TailscaleIp } else { try { (& tailscale ip -4 2>$null | Select-Object -First 1) } catch { '' } }
if (-not $ts) { $ts = '<tailscale-ip>' }

function Stop-AdGuard {
  Get-Process AdGuardHome -ErrorAction SilentlyContinue | Stop-Process -Force
  Start-Sleep 2
}

if (-not $Finish) {
  # 1. Is port 53 free? (another DNS server would make AdGuard fail to start)
  $p53 = Get-NetUDPEndpoint -LocalPort 53 -ErrorAction SilentlyContinue
  if ($p53) {
    $names = $p53 | ForEach-Object { (Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName } | Sort-Object -Unique
    Write-Warning "UDP port 53 is already in use by: $($names -join ', '). Stop it first, otherwise AdGuard Home cannot serve DNS."
    if ((Read-Host 'Continue anyway? (y/N)') -ne 'y') { return }
  }

  # 2. Download the latest release (zip is small, ~25 MB)
  if (-not (Test-Path $exe)) {
    Write-Host 'Downloading AdGuard Home...'
    $rel = Invoke-RestMethod 'https://api.github.com/repos/AdguardTeam/AdGuardHome/releases/latest' -Headers @{ 'User-Agent' = 'homelab-installer' }
    $asset = $rel.assets | Where-Object { $_.name -eq 'AdGuardHome_windows_amd64.zip' } | Select-Object -First 1
    if (-not $asset) { throw 'Windows amd64 asset not found in the latest release.' }
    $zip = Join-Path $env:TEMP 'AdGuardHome.zip'
    Invoke-WebRequest $asset.browser_download_url -OutFile $zip -UseBasicParsing
    $tmp = Join-Path $env:TEMP 'agh-extract'
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
    Expand-Archive $zip $tmp -Force
    New-Item -ItemType Directory -Force $root | Out-Null
    Copy-Item (Join-Path $tmp 'AdGuardHome\*') $root -Recurse -Force
    Remove-Item $zip, $tmp -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  installed $($rel.tag_name) to $root"
  }

  # 3. Firewall: dashboard only for Tailscale; DNS for Tailscale + the local network
  Get-NetFirewallRule -DisplayName 'AdGuard*' -ErrorAction SilentlyContinue | Remove-NetFirewallRule
  New-NetFirewallRule -DisplayName 'AdGuard UI 3001 (Tailscale only)' -Direction Inbound -Protocol TCP -LocalPort 3001 -RemoteAddress 100.64.0.0/10 -Action Allow -Profile Any | Out-Null
  New-NetFirewallRule -DisplayName 'AdGuard DNS TCP (Tailscale+LAN)' -Direction Inbound -Protocol TCP -LocalPort 53 -RemoteAddress 100.64.0.0/10, LocalSubnet -Action Allow -Profile Any | Out-Null
  New-NetFirewallRule -DisplayName 'AdGuard DNS UDP (Tailscale+LAN)' -Direction Inbound -Protocol UDP -LocalPort 53 -RemoteAddress 100.64.0.0/10, LocalSubnet -Action Allow -Profile Any | Out-Null

  # 4. Start the setup wizard on 3001 (only if not configured yet)
  if (Test-Path (Join-Path $root 'AdGuardHome.yaml')) {
    Write-Host 'AdGuardHome.yaml already exists: the wizard is not needed. Run again with -Finish to (re)install the service.'
    return
  }
  Stop-AdGuard
  Start-Process $exe -ArgumentList '-w', "`"$root`"", '--web-addr', '0.0.0.0:3001' -WindowStyle Hidden
  Start-Sleep 3
  Write-Host ''
  Write-Host "Setup wizard: http://${ts}:3001   (open it from your laptop/phone with Tailscale on)"
  Write-Host '  Step 1 ("Admin web interface"): any interface, port 3001  <- keep 3001, NOT 3000 (Grafana)'
  Write-Host '  Step 1 ("DNS server"): any interface, port 53'
  Write-Host '  Step 2: choose an admin username and a strong password (not shared in chat)'
  Write-Host 'When the wizard is finished, run this script again with -Finish.'
  return
}

# ---- -Finish: switch from the wizard process to a Windows service ----
if (-not (Test-Path (Join-Path $root 'AdGuardHome.yaml'))) { throw 'AdGuardHome.yaml not found: finish the setup wizard first.' }
Stop-AdGuard
$prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
& $exe -s uninstall 2>&1 | Out-Null
& $exe -s install 2>&1 | Write-Host
& $exe -s start 2>&1 | Write-Host
$ErrorActionPreference = $prev
Start-Sleep 4

Write-Host "`n== Checks =="
$svc = Get-Service AdGuardHome -ErrorAction SilentlyContinue
"service           : " + $(if ($svc) { $svc.Status } else { 'NOT INSTALLED' })
$dns = Get-NetUDPEndpoint -LocalPort 53 -ErrorAction SilentlyContinue
"DNS  UDP 53       : " + $(if ($dns) { 'listening' } else { 'NOT listening' })
$web = Get-NetTCPConnection -State Listen -LocalPort 3001 -ErrorAction SilentlyContinue
"UI   TCP 3001     : " + $(if ($web) { 'listening' } else { 'NOT listening' })
try { $r = Resolve-DnsName example.com -Server 127.0.0.1 -ErrorAction Stop | Select-Object -First 1; "test lookup       : OK ($($r.IPAddress))" } catch { "test lookup       : FAILED ($($_.Exception.Message))" }
Write-Host ''
Write-Host "Dashboard: http://${ts}:3001"
Write-Host 'To use it from your phone/laptop anywhere: Tailscale admin console -> DNS -> Add nameserver -> Custom ->'
Write-Host "  $ts  -> enable 'Override local DNS'. Only devices on your tailnet are affected."
