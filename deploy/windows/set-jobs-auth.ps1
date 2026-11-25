# Publishes the JobWatch partner dashboard at https://<your>.ts.net/jobs/ behind a login + password (HTTP basic auth over HTTPS).
# Run in PowerShell as Administrator from the repo root:
#   powershell -ExecutionPolicy Bypass -File .\deploy\windows\set-jobs-auth.ps1
# The password is typed here (hidden), hashed with Caddy and stored only as a hash in deploy\windows\jobs-auth.caddy (git-ignored).
# Only /partner/ of the JobWatch server (port 8080) is reachable this way; your own dashboard stays Tailscale-only.
param([string]$User = 'partner')
$ErrorActionPreference = 'Stop'
$here  = Split-Path -Parent $MyInvocation.MyCommand.Path
$caddy = Join-Path $here 'bin\caddy.exe'
if (-not (Test-Path $caddy)) { throw "caddy.exe not found at $caddy (run install.ps1 first)." }

function Read-Plain($prompt) {
  $s = Read-Host $prompt -AsSecureString
  $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }
}
$p1 = Read-Plain "Password for user '$User' (min 12 characters)"
$p2 = Read-Plain 'Repeat password'
if ($p1 -ne $p2) { throw 'Passwords do not match.' }
if ($p1.Length -lt 12) { throw 'Use at least 12 characters: this page is reachable from the internet.' }

$hash = (& $caddy hash-password --plaintext $p1).Trim()
if (-not $hash.StartsWith('$2')) { throw "Unexpected hash output: $hash" }

$file = Join-Path $here 'jobs-auth.caddy'
@"
redir /jobs /jobs/ 308
handle_path /jobs/* {
	basicauth {
		$User $hash
	}
	rewrite * /partner{uri}
	reverse_proxy 127.0.0.1:8080
}
"@ | Set-Content $file -Encoding ASCII

& $caddy validate --config (Join-Path $here 'Caddyfile.funnel') --adapter caddyfile 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Remove-Item $file -Force; throw 'Caddy rejected the config, nothing was changed.' }

Write-Host 'Restarting the stack so Caddy loads the new config...'
Stop-ScheduledTask Portfolio-Stack -ErrorAction SilentlyContinue
Start-Sleep 6
Start-ScheduledTask Portfolio-Stack
Start-Sleep 15
$ts = try { (& tailscale status --json | ConvertFrom-Json).Self.DNSName.TrimEnd('.') } catch { '<your>.ts.net' }
Write-Host ""
Write-Host "Done. Address:  https://$ts/jobs/   (login: $User, the password you just typed)"
