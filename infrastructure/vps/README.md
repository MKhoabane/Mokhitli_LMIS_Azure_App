# VPS Deployment

This folder contains a simple Docker-based deployment path for a Linux VPS.

## Included Files

- `deploy.sh`: builds and starts the production Docker stack
- `qcto-lmis.service`: optional systemd unit for boot-time startup

## Recommended Layout

Clone the repository to `/opt/qcto-lmis`, then:

1. Copy `infrastructure/docker/.env.production.example` to `infrastructure/docker/.env.production`
2. Update database credentials and secrets
3. Run `sh infrastructure/vps/deploy.sh`
4. Install `infrastructure/nginx/lmis.conf` or use the bundled Docker Nginx service

## systemd

If you want the stack to start on boot:

1. Copy `qcto-lmis.service` to `/etc/systemd/system/`
2. Run `sudo systemctl daemon-reload`
3. Run `sudo systemctl enable --now qcto-lmis.service`
