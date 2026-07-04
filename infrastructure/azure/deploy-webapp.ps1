param(
  [string]$ResourceGroup = "qcto-lmis-rg",
  [string]$Location = "westeurope",
  [string]$PlanName = "mokhitli-lmis-plan",
  [string]$WebAppName = "mokhitli-lmis-full-system",
  [string]$ContainerImage = "your-registry/qcto-lmis-app:latest",
  [string]$AppSettingsFile = ".\\appservice-settings.example.env"
)

$ErrorActionPreference = "Stop"

function ConvertTo-AzureWebAppName {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name
  )

  $normalized = $Name.ToLowerInvariant()
  $normalized = [Regex]::Replace($normalized, '[^a-z0-9-]', '-')
  $normalized = [Regex]::Replace($normalized, '-{2,}', '-').Trim('-')

  if ([string]::IsNullOrWhiteSpace($normalized)) {
    throw "WebAppName '$Name' becomes empty after sanitization. Use letters, numbers, and hyphens."
  }

  if ($normalized.Length -lt 2) {
    throw "WebAppName '$normalized' is too short for Azure App Service. Use at least 2 characters."
  }

  if ($normalized.Length -gt 60) {
    $normalized = $normalized.Substring(0, 60).Trim('-')
  }

  if ([string]::IsNullOrWhiteSpace($normalized) -or $normalized.Length -lt 2) {
    throw "WebAppName '$Name' could not be normalized to a valid Azure App Service name."
  }

  return $normalized
}

$ResolvedWebAppName = ConvertTo-AzureWebAppName -Name $WebAppName

if ($ResolvedWebAppName -ne $WebAppName) {
  Write-Host "Normalized WebAppName '$WebAppName' to '$ResolvedWebAppName' for Azure App Service compatibility."
}

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
  --name $ResolvedWebAppName `
  --resource-group $ResourceGroup `
  --plan $PlanName `
  --deployment-container-image-name $ContainerImage | Out-Null

Write-Host "Applying baseline App Service settings..."
$baselineSettings = @(
  "WEBSITES_PORT=5000",
  "PORT=5000",
  "NODE_ENV=production",
  "APP_ENV=production",
  "TRUST_PROXY=true",
  "RUN_DB_SETUP=false"
)

az webapp config appsettings set `
  --name $ResolvedWebAppName `
  --resource-group $ResourceGroup `
  --settings $baselineSettings | Out-Null

if (Test-Path $AppSettingsFile) {
  Write-Host "Applying app settings from $AppSettingsFile..."
  $settings = Get-Content $AppSettingsFile |
    Where-Object { $_ -and -not $_.StartsWith('#') } |
    ForEach-Object { $_.Trim() }

  if ($settings.Count -gt 0) {
    az webapp config appsettings set `
      --name $ResolvedWebAppName `
      --resource-group $ResourceGroup `
      --settings $settings | Out-Null
  }
}

Write-Host "Enabling Always On..."
az webapp config set `
  --name $ResolvedWebAppName `
  --resource-group $ResourceGroup `
  --generic-configurations '{"alwaysOn": true,"healthCheckPath":"/api/health"}' | Out-Null

Write-Host "Azure App Service deployment configuration completed for $ResolvedWebAppName."
