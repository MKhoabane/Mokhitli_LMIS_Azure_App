# AWS Amplify Deployment Guide

This repository can be connected to **AWS Amplify Hosting** without changing the existing LMIS structure.

## What This Integration Does

- deploys the React frontend from `frontend/` using Amplify Hosting
- keeps the existing Express backend in `backend/` unchanged
- uses `VITE_API_BASE_URL` so the Amplify-hosted frontend can talk to the live LMIS API

## What This Integration Does Not Do

- it does not move the backend into Amplify
- it does not replace the current Docker, cPanel, VPS, or Azure deployment paths
- it does not change the current backend authentication or database architecture

## Files Added For Amplify

- `amplify.yml`
- `frontend/.env.amplify.example`

## Recommended Architecture

Use:

- **Amplify Hosting** for the frontend
- **existing backend hosting** for the Express API, such as:
  - Docker/VPS
  - cPanel Node.js hosting
  - Azure App Service

Example:

- frontend: `https://master.ds7319uksh7nr.amplifyapp.com`
- backend API: `https://api.your-domain.example/api`

## Configure The Frontend API URL

The frontend already reads:

```bash
VITE_API_BASE_URL
```

from [api.ts](file:///c:/Users/Khoabane/Documents/Khoabane/LMIS/frontend/src/services/api.ts).

In Amplify Hosting, set:

```bash
VITE_API_BASE_URL=https://api.your-domain.example/api
```

If you later place the frontend and backend behind the same domain with a reverse proxy, you can use:

```bash
VITE_API_BASE_URL=/api
```

## Connect The Repo To Amplify

1. Open AWS Amplify Hosting.
2. Choose **New app** -> **Host web app**.
3. Connect the repository that contains this LMIS project.
4. Keep the repository root as the app root.
5. Amplify will detect [amplify.yml](file:///c:/Users/Khoabane/Documents/Khoabane/LMIS/amplify.yml) and build the frontend from `frontend/`.

## Amplify Environment Variables

Add this environment variable in Amplify:

```bash
VITE_API_BASE_URL=https://api.your-domain.example/api
```

If you use preview branches, set the same variable for each branch environment.

## SPA Rewrites

Because this is a React single-page app, configure the following rewrite rule in Amplify Hosting:

- **Source address**: `</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|svg|txt|webp|woff|woff2|map)$)([^.]+$)/>`
- **Target address**: `/index.html`
- **Type**: `200 (Rewrite)`

This ensures routes like `/employer/company-management` load correctly on refresh.

## Backend Requirements

Your backend still needs to be deployed separately and publicly reachable.

The backend should already be configured with:

- `APP_BASE_URL`
- `CORS_ORIGIN`
- `JWT_SECRET`
- database settings
- Redis settings

When the frontend is hosted on Amplify, make sure the backend `CORS_ORIGIN` includes the Amplify app domain or your Amplify custom domain.

Example:

```bash
CORS_ORIGIN=https://master.ds7319uksh7nr.amplifyapp.com,https://lmis.your-domain.example
```

## Local Safety

This Amplify integration is non-destructive:

- no backend code path is replaced
- no existing deployment path is removed
- no existing repo folder is moved

## Verification

After Amplify deploys the frontend:

1. Open the Amplify app URL
2. Confirm the login page loads
3. Test a request that hits the backend API
4. Check the backend health endpoint directly:

```bash
curl https://api.your-domain.example/api/health
```
