# Docker

This folder contains the production Docker deployment package for LMIS.

## Included Files

- `Dockerfile.production`: multi-stage image that builds the frontend and serves it through the backend
- `docker-compose.production.yml`: production stack for app, PostgreSQL, Redis, and Nginx using a prebuilt application image
- `nginx.production.conf`: reverse-proxy configuration for the Docker stack
- `start-production.sh`: startup script that can run DB migrations and seeds
- `wait-for-db.js`: PostgreSQL readiness helper
- `.env.production.example`: example production environment values

## Usage

1. Build and publish the app image from `Dockerfile.production`, or use the GitHub Actions pipeline
2. Copy `.env.production.example` to `.env.production`
3. Update `APP_IMAGE`, secrets, and database values
4. Run:
3. Run:

```bash
docker compose --env-file .env.production -f infrastructure/docker/docker-compose.production.yml up -d
