# Azure

This folder contains Azure App Service deployment assets for the production LMIS container image.

## Included Files

- `deploy-webapp.ps1`: creates or updates a Linux App Service for the container image
- `appservice-settings.example.env`: example application settings for App Service

## App Service Naming

Azure App Service names are used in the default `azurewebsites.net` hostname, so they must use:

- letters
- numbers
- hyphens

Do not use underscores or spaces.

Example valid name:

```text
mokhitli-lmis-full-system
```

## Notes

- The App Service package expects an already built container image in a registry
- Use Azure Database for PostgreSQL instead of an in-container database for production
- Set `RUN_DB_SETUP=false` when your schema and seed steps are handled by CI/CD or a one-time release task

## Example

```powershell
pwsh -File .\infrastructure\azure\deploy-webapp.ps1 `
  -ResourceGroup LMIS `
  -Location southafricanorth `
  -PlanName mokhitli-lmis-plan `
  -WebAppName MokhitliLMISFullSystem `
  -ContainerImage ghcr.io/mkhoabane/qcto-lmis-app:latest
```

The script will normalize invalid characters such as underscores before creating the App Service.
