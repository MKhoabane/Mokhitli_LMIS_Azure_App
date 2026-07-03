# Public Upload Package

This repository can be uploaded to a live host as a production Docker bundle.

## Included In The Package

- `backend/`
- `frontend/`
- `db/`
- `infrastructure/docker/`
- `.dockerignore`
- `README.md`
- `docs/website-deployment.md`

## On The Live Server

1. Extract the zip file.
2. Copy `infrastructure/docker/.env.production.example` to `infrastructure/docker/.env.production`
3. Set the real values for:
   - `APP_BASE_URL`
   - `CORS_ORIGIN`
   - `JWT_SECRET`
   - `DATABASE_URL` or the `PG*` values
   - SSL certificate paths if Nginx TLS is used
4. Build the application image:

```bash
docker build -f infrastructure/docker/Dockerfile.production -t qcto-lmis-app:latest .
```

5. Start the public stack:

```bash
docker compose --env-file infrastructure/docker/.env.production -f infrastructure/docker/docker-compose.production.yml up -d
```

6. Verify the site:

```bash
curl https://your-domain.example/api/health
```

## Notes

- Do not upload local `node_modules` folders.
- Do not upload local secrets unless they are the real production values you intend to use.
- The packaged Docker flow builds the frontend and serves it through the Express backend.
