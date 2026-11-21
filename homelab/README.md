# Homelab on the Windows mini PC

Phase 1 (no virtualization needed): `phase1.ps1` creates the folder layout on the spare SSDs and installs
Jellyfin (media server) and Grafana (dashboards). Both are reachable only through Tailscale; only the
portfolio is published on the internet (Tailscale Funnel).

Next phases: AdGuard Home as DNS (set as the Tailscale nameserver, because the router is not accessible),
Prometheus + windows_exporter for Grafana, then Docker / VMs once virtualization is enabled in the BIOS.

Phase 2: `phase2-metrics.ps1` installs windows_exporter and Prometheus (loopback only, 90 days of history)
and provisions a "Mini PC" dashboard in Grafana (`dashboards/mini-pc.json`).

## AdGuard Home (DNS filtering, dashboard on :3001, Tailscale only)

```powershell
powershell -ExecutionPolicy Bypass -File .\homelab\adguard.ps1          # download, firewall, setup wizard on :3001
# finish the wizard from a device on Tailscale: http://<tailscale-ip>:3001
powershell -ExecutionPolicy Bypass -File .\homelab\adguard.ps1 -Finish  # install as a Windows service
```

Then in the Tailscale admin console: DNS -> Add nameserver -> the mini PC's Tailscale IP -> Override local DNS.
DNS filtering does not block YouTube / YouTube Music in-app ads (they use the same domains as the video).
