# Website Deployment Guide

This project is ready to be deployed as a website using the production container flow in `infrastructure/docker/`.

## Recommended Path

Use the multi-stage production image in `infrastructure/docker/Dockerfile.production`.

It:

- builds the React frontend,
- copies the compiled frontend into `frontend/dist`,
- runs the Express backend as the website server,
- exposes the application on port `5000`.

## Required Environment Variables

Set these before deploying:

```bash
APP_ENV=production
APP_BASE_URL=https://your-domain.example
CORS_ORIGIN=https://your-domain.example
TRUST_PROXY=true
JWT_SECRET=replace-with-a-long-random-secret
RELEASE_VERSION=manual
```

For PostgreSQL, use either:

```bash
DATABASE_URL=postgres://user:password@host:5432/database
DB_SSL=no-verify
```

or the separate variables:

```bash
PGUSER=postgres
PGPASSWORD=change-me
PGDATABASE=qcto_lmis
PGHOST=db
PGPORT=5432
DB_SSL=false
```

Optional Redis settings:

```bash
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Docker Deployment

1. Copy `infrastructure/docker/.env.production.example` to `infrastructure/docker/.env.production`
2. Set your real domain, database credentials, and `JWT_SECRET`
3. Build or publish the production image:

```bash
docker build -f infrastructure/docker/Dockerfile.production -t qcto-lmis-app:latest .
```

4. Start the website stack:

```bash
docker compose --env-file infrastructure/docker/.env.production -f infrastructure/docker/docker-compose.production.yml up -d
```

5. Verify the deployment:

```bash
curl https://your-domain.example/api/health
```

Expected response fields include:

- `status`
- `environment`
- `releaseVersion`
- `frontendBuild`

## Azure Or VPS

This repository already includes deployment automation for:

- Azure App Service in `infrastructure/azure/`
- VPS Docker deployment in `infrastructure/vps/`
- CI/CD pipelines in `.github/workflows/`

The production pipeline expects the image built from `infrastructure/docker/Dockerfile.production`.

## Website Notes

- The backend serves the frontend build automatically when `frontend/dist/index.html` exists.
- The frontend talks to `/api` by default, which is correct for same-origin website hosting.
- The backend now supports environment-based CORS, proxy awareness, `DATABASE_URL`, Redis host configuration, and production JWT secret enforcement.
