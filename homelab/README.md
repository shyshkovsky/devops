# Homelab on the Windows mini PC

Phase 1 (no virtualization needed): `phase1.ps1` creates the folder layout on the spare SSDs and installs
Jellyfin (media server) and Grafana (dashboards). Both are reachable only through Tailscale; only the
portfolio is published on the internet (Tailscale Funnel).

Next phases: AdGuard Home as DNS (set as the Tailscale nameserver, because the router is not accessible),
Prometheus + windows_exporter for Grafana, then Docker / VMs once virtualization is enabled in the BIOS.
