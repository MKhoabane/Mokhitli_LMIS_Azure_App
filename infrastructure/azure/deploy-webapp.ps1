param(
  [string]$ResourceGroup = "qcto-lmis-rg",
  [string]$Location = "westeurope",
  [string]$PlanName = "qcto-lmis-plan",
  [string]$WebAppName = "qcto-lmis-app",
  [string]$ContainerImage = "your-registry/qcto-lmis-app:latest",
  [string]$AppSettingsFile = ".\\appservice-settings.example.env"
)

$ErrorActionPreference = "Stop"

Write-Host "Creating resource group..."
az group create --name $ResourceGroup --location $Location | Out-Null

Write-Host "Creating Linux App Service plan..."
az appservice plan create `
  --name $PlanName `
  --resource-group $ResourceGroup `
  --location $Location `
  --is-linux `
  --sku B1 | Out-Null

Write-Host "Creating web app from container image..."
az webapp create `
  --name $WebAppName `
  --resource-group $ResourceGroup `
  --plan $PlanName `
  --deployment-container-image-name $ContainerImage | Out-Null

if (Test-Path $AppSettingsFile) {
  Write-Host "Applying app settings from $AppSettingsFile..."
  $settings = Get-Content $AppSettingsFile |
    Where-Object { $_ -and -not $_.StartsWith('#') } |
    ForEach-Object { $_.Trim() }

  if ($settings.Count -gt 0) {
    az webapp config appsettings set `
      --name $WebAppName `
      --resource-group $ResourceGroup `
      --settings $settings | Out-Null
  }
}

Write-Host "Enabling Always On..."
az webapp config set `
  --name $WebAppName `
  --resource-group $ResourceGroup `
  --generic-configurations '{"alwaysOn": true}' | Out-Null

Write-Host "Azure App Service deployment configuration completed."
