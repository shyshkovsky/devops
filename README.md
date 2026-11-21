# Oleksandr Zhebchuk · IT Support & Systems Engineering

> A hands-on portfolio project and a place to explore my work across IT support, systems administration, networking, and DevOps.

[![Portfolio](https://img.shields.io/badge/Portfolio-shyshka.duckdns.org-ff3d00?style=flat-square)](https://shyshka.duckdns.org)
[![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?style=flat-square&logo=python&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Containers-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

## About this project

This repository powers my multilingual portfolio website. It presents my experience supporting business users and maintaining the systems they rely on, alongside selected infrastructure and automation work.

The site is built as a small service stack: a static HTML/CSS/JavaScript frontend is served by Nginx, while a FastAPI backend provides the health endpoint. Docker Compose runs the services together. GitHub Actions runs the backend checks and builds the container image; a separate deployment workflow can update the hosted instance when its server secrets are configured.

## What you can explore

- **IT support:** L1–L3 user support, workstation and peripheral troubleshooting, software setup, and account administration.
- **Systems:** Windows Server, Active Directory, Microsoft 365, DNS/DHCP, Linux, and virtualization.
- **Networking:** Cisco and MikroTik, TCP/IP, LAN/WAN, VPN, VLAN, firewalls, and VoIP.
- **Automation and delivery:** Python, Bash, Docker Compose, Nginx, and GitHub Actions.
- **Portfolio:** English, Ukrainian, Czech, Polish, and German language options.

## Architecture

```text
Browser
  ├── Nginx :80
  │    ├── Static portfolio files
  │    ├── POST /api/contact ──> contact service  (email + Telegram notification)
  │    └── /api/*            ──> FastAPI :8000
  └── Nginx :8081 ──> helpdesk ticket demo (FastAPI + SQLite)
```

## Run locally

Requirements: Docker and Docker Compose.

```bash
git clone https://github.com/shyshkovsky/devops.git
cd devops
docker compose up --build
```

Open the portfolio at [http://localhost](http://localhost). The backend health endpoint is available through Nginx at [http://localhost/api/health](http://localhost/api/health).

### Contact form and ticket demo

Copy `contact-service/.env.example` to `contact-service/.env` and fill in the Telegram bot token and chat id
and the SMTP credentials (never commit `.env`). Without it the site still runs; the form just reports a delivery
error. The ticket demo is available at [http://localhost:8081](http://localhost:8081) and resets itself every 24 hours.

To stop the services, press `Ctrl+C` and run:

```bash
docker compose down
```

## Project layout

```text
backend/                 FastAPI service and checks
contact-service/         Contact form backend: SMTP email + Telegram bot
ticket-demo/             Helpdesk ticket system demo (own README)
frontend/                Multilingual portfolio interface
nginx/default.conf       Static hosting and API reverse proxy
docker-compose.yml       Local service orchestration
.github/workflows/       Continuous integration and optional deployment
```

## Connect

- **Portfolio:** [shyshka.duckdns.org](https://shyshka.duckdns.org)
- **Email:** [kinagshyshkovsky@gmail.com](mailto:kinagshyshkovsky@gmail.com)
- **LinkedIn:** [linkedin.com/in/shyshkovsky](https://www.linkedin.com/in/shyshkovsky/)
- **GitHub:** [@shyshkovsky](https://github.com/shyshkovsky)
