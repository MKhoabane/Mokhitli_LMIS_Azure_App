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

- `infrastructure/docker/`
- `infrastructure/nginx/`
- `infrastructure/azure/`
- `infrastructure/vps/`
- `infrastructure/ci-cd/`
