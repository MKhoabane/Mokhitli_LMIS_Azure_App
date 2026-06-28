# Azure

This folder contains Azure App Service deployment assets for the production LMIS container image.

## Included Files

- `deploy-webapp.ps1`: creates or updates a Linux App Service for the container image
- `appservice-settings.example.env`: example application settings for App Service

## Notes

- The App Service package expects an already built container image in a registry
- Use Azure Database for PostgreSQL instead of an in-container database for production
- Set `RUN_DB_SETUP=false` when your schema and seed steps are handled by CI/CD or a one-time release task
