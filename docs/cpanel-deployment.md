# cPanel Deployment Guide

This project can be deployed to a cPanel host if the hosting plan supports the **Node.js Application Manager**.

## What The cPanel Package Contains

- `backend/`
- `frontend/dist/`
- `db/`
- `infrastructure/cpanel/.env.example`
- this guide

## cPanel Requirements

- Node.js application support in cPanel
- Shell access or cPanel terminal access
- PostgreSQL connection details for production
- Redis connection details if Redis-backed features are enabled

## Upload Steps

1. Upload the cPanel package zip to your hosting account.
2. Extract it into a directory outside `public_html`, for example:

```text
/home/your-cpanel-user/lmis
```

3. In cPanel, open **Setup Node.js App**.
4. Create the app with:
   - **Node.js version**: `20.x` if available
   - **Application mode**: `Production`
   - **Application root**: `lmis/backend`
   - **Application URL**: your chosen domain or subdomain
   - **Application startup file**: `src/app.js`

## Install Dependencies

Open the cPanel terminal or SSH and run:

```bash
cd ~/lmis/backend
npm install --omit=dev
```

## Required Environment Variables

Set these in the Node.js app environment section in cPanel:

```bash
NODE_ENV=production
APP_ENV=production
PORT=3000
APP_BASE_URL=https://your-domain.example
CORS_ORIGIN=https://your-domain.example
TRUST_PROXY=true
JWT_SECRET=replace-with-a-long-random-secret
RELEASE_VERSION=cpanel
DATABASE_URL=postgres://user:password@host:5432/database
DB_SSL=no-verify
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=
```

If your host gives separate PostgreSQL values instead of `DATABASE_URL`, set:

```bash
PGUSER=postgres
PGPASSWORD=change-me
PGDATABASE=qcto_lmis
PGHOST=your-db-host
PGPORT=5432
DB_SSL=false
```

## Frontend Behavior

The backend automatically serves the production frontend from `frontend/dist`.

This works in the cPanel package because:

- the app runs from `backend/src/app.js`
- the built frontend is packaged in `frontend/dist`
- the existing relative path resolution remains valid

## Restarting The App

After changing environment variables or uploading updates:

1. Use the restart button in **Setup Node.js App**, or
2. If your host supports Passenger restarts, run:

```bash
mkdir -p ~/lmis/backend/tmp
touch ~/lmis/backend/tmp/restart.txt
```

## Health Check

After deployment, verify:

```bash
curl https://your-domain.example/api/health
```

Expected response includes:

- `status: ok`
- `environment: production`
- `frontendBuild: true`

## Important Notes

- This cPanel package is for **Node.js hosting**, not plain static hosting.
- Do not upload local `node_modules`.
- Do not upload your local `.env.production` file with secrets unless they are the real production values you intend to use.
