# Database Structure

This directory now treats SQL migrations and seed scripts as the source of truth for the normalized PostgreSQL model.
Each active backend domain owns its SQL under `db/domains/<domain>/tables` and `db/domains/<domain>/seeds`.

## Workflow

- Apply schema changes from the ordered domain folders in `db/domains/*/tables`
- Load development reference and sample data from the ordered domain folders in `db/domains/*/seeds`
- Use `db/schema.sql` as a consolidated schema snapshot for inspection or fresh bootstrap

## Commands

Run these from `backend/`:

```bash
npm run db:migrate
npm run db:seed
npm run db:snapshot
```

The active load plan reads only from the ordered domain folders. The root `db/migrations` and `db/seeds` folders are retained only as placeholders for compatibility.
The backend repository layer no longer creates tables or seeds data at runtime. It only executes module-specific queries and falls back to in-memory enterprise data when PostgreSQL is unavailable.
