# Supervisor: starts the 3 Python services and Caddy, restarts any that die.
# Run by the "Portfolio-Stack" scheduled task at boot (SYSTEM), or by hand for testing.
$ErrorActionPreference = 'Stop'
$here  = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo  = (Resolve-Path (Join-Path $here '..\..')).Path
$py    = Join-Path $here '.venv\Scripts\python.exe'
$caddy = Join-Path $here 'bin\caddy.exe'
$logs  = Join-Path $here 'logs'
New-Item -ItemType Directory -Force $logs, (Join-Path $here 'data') | Out-Null

# Only one supervisor at a time (the boot task and a manual run would fight over the ports)
$script:stackMutex = New-Object System.Threading.Mutex($false, 'Global\PortfolioStack')
if (-not $script:stackMutex.WaitOne(0)) {
  Write-Host 'The stack is already running (scheduled task Portfolio-Stack). Stop it first: Stop-ScheduledTask Portfolio-Stack'
  exit 0
}

# Load contact-service\.env (KEY=VALUE lines) into this process; children inherit it
$envFile = Join-Path $repo 'contact-service\.env'
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$' -and -not $_.TrimStart().StartsWith('#')) {
      [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], 'Process')
    }
  }
}
$env:TRUST_PROXY = '1'
$env:DOMAIN      = if ($env:DOMAIN) { $env:DOMAIN } else { 'shyshka.duckdns.org' }
$env:SITE_ROOT   = Join-Path $repo 'frontend'
$env:XDG_DATA_HOME   = Join-Path $here 'data'     # where Caddy keeps its certificates
$env:XDG_CONFIG_HOME = Join-Path $here 'data'

$services = @(
  @{ Name='backend'; File=$py;    Args="-m uvicorn main:app --app-dir `"$repo\backend`" --host 127.0.0.1 --port 8000"; Dir=$repo },
  @{ Name='contact'; File=$py;    Args="-m uvicorn app.main:app --host 127.0.0.1 --port 8002"; Dir=(Join-Path $repo 'contact-service') },
  @{ Name='tickets'; File=$py;    Args="-m uvicorn app.main:app --host 127.0.0.1 --port 8003"; Dir=(Join-Path $repo 'ticket-demo') },
  @{ Name='caddy';   File=$caddy; Args="run --config `"$here\Caddyfile`" --adapter caddyfile"; Dir=$here }
)
foreach ($s in $services) { if (-not (Test-Path $s.File)) { throw "Missing $($s.File). Run install.ps1 first." } }

$procs = @{}
function Start-Svc($s) {
  $out = Join-Path $logs "$($s.Name).log"
  $procs[$s.Name] = Start-Process -FilePath $s.File -ArgumentList $s.Args -WorkingDirectory $s.Dir `
    -WindowStyle Hidden -PassThru -RedirectStandardOutput $out -RedirectStandardError "$out.err"
}
try {
  foreach ($s in $services) { Start-Svc $s }
  while ($true) {
    Start-Sleep -Seconds 15
    foreach ($s in $services) {
      if ($procs[$s.Name].HasExited) { Start-Svc $s }
    }
  }
} finally {
  foreach ($p in $procs.Values) { if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } }
}
