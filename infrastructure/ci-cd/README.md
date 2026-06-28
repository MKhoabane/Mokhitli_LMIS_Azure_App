# CI/CD

GitHub Actions automation lives in:

- `.github/workflows/staging-deploy.yml`
- `.github/workflows/production-deploy.yml`
- `.github/workflows/tag-release.yml`

## GitHub Environments

Create two GitHub environments:

- `staging`
- `production`

Recommended protection rules:

1. Require reviewers for both environments
2. Use a shorter wait timer for `staging` and a stricter wait timer for `production`
3. Restrict deployment branches to `master`
4. Store environment-specific secrets in the matching environment instead of repository-wide where possible

Recommended release approval model:

- `staging`: at least 1 reviewer
- `production`: at least 2 reviewers or a designated release manager

## Workflow

### Staging

1. Runs backend tests
2. Runs frontend tests and production build
3. Builds the production Docker image from `infrastructure/docker/Dockerfile.production`
4. Pushes the image to GitHub Container Registry as:
   - `ghcr.io/<owner>/qcto-lmis-app:sha-<commit>`
   - `ghcr.io/<owner>/qcto-lmis-app:latest`
5. Deploys that immutable `sha-<commit>` image to staging targets
6. Runs smoke tests against the deployed staging URL

### Production

1. Runs manually with `workflow_dispatch`
2. Verifies that the selected production database already has all required schema migrations applied
3. Promotes a previously staged `sha-<commit>` image to production, or rolls back to an older one
4. Deploys the chosen image tag to Azure App Service and/or a VPS
5. Runs smoke tests against the deployed production URL

### Tagged Releases

1. Push a tag like `v1.0.0`
2. Run `.github/workflows/tag-release.yml`
3. Generate release notes from the tag range
4. Open an automated pull request that updates `CHANGELOG.md`
5. Publish a GitHub Release using the generated notes

## Required Secrets

### Registry

- `GHCR_USERNAME`: account or bot user that can pull from GHCR
- `GHCR_READ_TOKEN`: token with package read access for Azure or VPS pulls

### Azure Deployment

- `AZURE_CREDENTIALS`: service principal JSON for `azure/login`
- `STAGING_AZURE_RESOURCE_GROUP`: staging resource group
- `STAGING_AZURE_WEBAPP_NAME`: staging App Service name
- `STAGING_AZURE_APP_SETTINGS`: optional staging app settings
- `STAGING_AZURE_BASE_URL`: staging site base URL for smoke tests
- `AZURE_RESOURCE_GROUP`: target resource group
- `AZURE_WEBAPP_NAME`: target App Service name
- `AZURE_APP_SETTINGS`: optional space-separated `KEY=VALUE` pairs for app settings
- `PRODUCTION_AZURE_BASE_URL`: production site base URL for smoke tests
- `PRODUCTION_AZURE_DB_HOST`: production PostgreSQL host for migration gating
- `PRODUCTION_AZURE_DB_PORT`: production PostgreSQL port for migration gating
- `PRODUCTION_AZURE_DB_NAME`: production PostgreSQL database name for migration gating
- `PRODUCTION_AZURE_DB_USER`: production PostgreSQL user for migration gating
- `PRODUCTION_AZURE_DB_PASSWORD`: production PostgreSQL password for migration gating

### VPS Deployment

- `STAGING_VPS_HOST`: staging server hostname or IP
- `STAGING_VPS_PORT`: staging SSH port, for example `22`
- `STAGING_VPS_USERNAME`: staging SSH user
- `STAGING_VPS_SSH_KEY`: staging private key used by GitHub Actions
- `STAGING_VPS_APP_DIR`: absolute path to the staging repo checkout, for example `/opt/qcto-lmis-staging`
- `STAGING_VPS_BASE_URL`: staging site base URL for smoke tests
- `VPS_HOST`: server hostname or IP
- `VPS_PORT`: SSH port, for example `22`
- `VPS_USERNAME`: SSH user
- `VPS_SSH_KEY`: private key used by GitHub Actions
- `VPS_APP_DIR`: absolute path to the checked-out repo on the server, for example `/opt/qcto-lmis`
- `PRODUCTION_VPS_BASE_URL`: production site base URL for smoke tests
- `PRODUCTION_VPS_DB_HOST`: production PostgreSQL host for migration gating
- `PRODUCTION_VPS_DB_PORT`: production PostgreSQL port for migration gating
- `PRODUCTION_VPS_DB_NAME`: production PostgreSQL database name for migration gating
- `PRODUCTION_VPS_DB_USER`: production PostgreSQL user for migration gating
- `PRODUCTION_VPS_DB_PASSWORD`: production PostgreSQL password for migration gating

## Repository Variables

- `DEPLOY_STAGING_TO_AZURE`: set to `true` to auto-deploy Azure staging on pushes to `master`
- `DEPLOY_STAGING_TO_VPS`: set to `true` to auto-deploy VPS staging on pushes to `master`

## Manual Runs

### Staging

Use `workflow_dispatch` on `staging-deploy.yml` and choose one of:

- `all`
- `azure`
- `vps`
- `none`

### Production

Use `workflow_dispatch` on `production-deploy.yml` and provide:

- `release_action`: `deploy` or `rollback`
- `deploy_target`: `all`, `azure`, or `vps`
- `release_image_tag`: the immutable tag to deploy, such as `sha-1234abcd`

### Tags

Push a tag such as:

- `v1.0.0`
- `v1.1.0`
- `v1.1.1`

## Notes

- The VPS host must already contain `infrastructure/docker/.env.production`
- The staging VPS should use its own `.env.production` values, domain, and database
- Azure App Service resources must already exist, or be created from the scripts in `infrastructure/azure/`
- The smoke test script is `infrastructure/ci-cd/smoke-test.mjs`
- The release note generator is `infrastructure/ci-cd/generate-release-notes.mjs`
- The pipeline deploys immutable `sha-<commit>` images to keep releases traceable
- Rollback is done by manually running `production-deploy.yml` with `release_action=rollback` and a previous `sha-<commit>` tag
- Production deployment is blocked until the selected target database passes `backend/scripts/checkMigrationsApplied.js`
- Tagged releases now open a changelog pull request instead of pushing directly to the protected default branch
