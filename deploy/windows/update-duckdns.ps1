# Updates the DuckDNS record to this network's current public IP.
$ErrorActionPreference = 'Stop'
$here  = Split-Path -Parent $MyInvocation.MyCommand.Path
$token = (Get-Content (Join-Path $here 'duckdns.token') -Raw).Trim()
$domain = if ($env:DOMAIN) { $env:DOMAIN -replace '\.duckdns\.org$','' } else { 'shyshka' }
# ip= left empty: DuckDNS uses the address the request comes from
$r = Invoke-RestMethod -UseBasicParsing "https://www.duckdns.org/update?domains=$domain&token=$token&ip="
Add-Content (Join-Path $here 'logs\duckdns.log') "$(Get-Date -Format s) $r"
