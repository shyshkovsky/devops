# Stops the whole stack, including child processes that a plain Stop would leave behind.
# Run in PowerShell as Administrator.
$ErrorActionPreference = 'Continue'
Stop-ScheduledTask -TaskName 'Portfolio-Stack' -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Get-Process caddy -ErrorAction SilentlyContinue | ForEach-Object { & taskkill /PID $_.Id /T /F | Out-Null }
# the venv python.exe is a launcher; the real interpreter is its child and owns the port
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in 8000, 8002, 8003 -and $_.LocalAddress -eq '127.0.0.1' } |
  ForEach-Object { & taskkill /PID $_.OwningProcess /T /F | Out-Null }
Write-Host 'Stack stopped.'
