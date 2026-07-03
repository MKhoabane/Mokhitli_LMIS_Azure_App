# Mokhitli LMIS™
Commercial Learner Management System

## QCTO Enterprise Suite

Mokhitli LMIS is positioned to evolve into a QCTO-aligned enterprise platform spanning backend services, role-based portals, mobile access, large-scale PostgreSQL data modeling, and cloud-native infrastructure.

### Scope

- Backend: Authentication, User Management, RBAC, Learner Management, Programme Management, Qualification Management, LMS, Assessment Engine, EISA, Workplace Learning, Certificates, Reporting, Finance, CRM, Audit, Notifications, AI, REST API
- Frontend: Admin Portal, Learner Portal, Facilitator Portal, Assessor Portal, Moderator Portal, Employer Portal, Parent Portal, Mobile App
- Database: PostgreSQL with 250+ tables
- Infrastructure: Docker, Kubernetes, Redis, RabbitMQ, ElasticSearch, Azure, CI/CD

### Scaffolded Repository Layout

- Backend modules: `backend/src/modules/`
- Frontend portals: `frontend/src/portals/`
- Mobile features: `mobile/app/src/main/java/com/example/lmis/features/`
- Database domains and assets: `db/`
- Infrastructure assets: `infrastructure/`

See `docs/qcto-enterprise-suite.md` for the full structure and scaffold mapping.

## Website Deployment

Build the frontend for production from `frontend/`:

```bash
npm install
npm run build
```

The production website files are generated in `frontend/dist/`.

For same-origin website deployment with the Node backend:

1. Build the frontend into `frontend/dist/`
2. Start the backend from `backend/`
3. Open the deployed backend URL in a browser

The backend serves `frontend/dist/` automatically when a production build exists, and the frontend uses `VITE_API_BASE_URL` or `/api` by default.

Example frontend environment:

```bash
VITE_API_BASE_URL=/api
```

Production deployment assets are available in:

- `amplify.yml`
- `infrastructure/docker/`
- `infrastructure/cpanel/`
- `infrastructure/nginx/`
- `infrastructure/azure/`
- `infrastructure/vps/`
- `infrastructure/ci-cd/`

### Production-Ready Deployment

The recommended website deployment path is the multi-stage production image in `infrastructure/docker/Dockerfile.production`.

This production path now supports:

- Express serving the built frontend from `frontend/dist`
- environment-based CORS via `APP_BASE_URL` and `CORS_ORIGIN`
- proxy-aware hosting via `TRUST_PROXY`
- `DATABASE_URL` or separate PostgreSQL variables
- Redis host configuration
- required `JWT_SECRET` enforcement in production

Quick start:

1. Copy `infrastructure/docker/.env.production.example` to `infrastructure/docker/.env.production`
2. Set:
   - `APP_BASE_URL`
   - `CORS_ORIGIN`
   - `JWT_SECRET`
   - database credentials
3. Build the production image:

```bash
docker build -f infrastructure/docker/Dockerfile.production -t qcto-lmis-app:latest .
```

4. Launch the website stack:

```bash
docker compose --env-file infrastructure/docker/.env.production -f infrastructure/docker/docker-compose.production.yml up -d
```

5. Verify:

```bash
curl https://your-domain.example/api/health
```

See `docs/website-deployment.md` for the full deployment guide.

## cPanel Hosting

For cPanel hosts that support the Node.js Application Manager, use the cPanel-specific deployment path documented in `docs/cpanel-deployment.md`.

## AWS Amplify Hosting

For AWS Amplify Hosting, use the root `amplify.yml` file and the guide in `docs/amplify-deployment.md`.

This path keeps the current LMIS repository structure intact:

- Amplify Hosting builds and serves the frontend from `frontend/`
- the existing Express backend remains deployed separately
- the frontend connects to the live backend through `VITE_API_BASE_URL`
