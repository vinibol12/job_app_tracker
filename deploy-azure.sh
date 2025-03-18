#!/bin/bash

# Exit on error
set -e

# Configuration variables
RESOURCE_GROUP="job-app-tracker-rg"
LOCATION="newzealandnorth"
APP_NAME="job-app-tracker"
STATIC_APP_NAME="${APP_NAME}-static"
BACKEND_APP_NAME="${APP_NAME}-api"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if resource exists
resource_exists() {
    az resource show --resource-group $1 --name $2 --resource-type $3 2>/dev/null
    return $?
}

# Create Resource Group if it doesn't exist
echo -e "${GREEN}Checking/Creating Resource Group...${NC}"
if ! az group show --name $RESOURCE_GROUP &>/dev/null; then
    echo -e "${YELLOW}Resource group doesn't exist. Creating...${NC}"
    az group create --name $RESOURCE_GROUP --location $LOCATION
else
    echo -e "${YELLOW}Resource group already exists. Skipping creation.${NC}"
fi

# Create App Service Plan if it doesn't exist
echo -e "${GREEN}Checking/Creating App Service Plan...${NC}"
if ! resource_exists $RESOURCE_GROUP "${APP_NAME}-plan" "Microsoft.Web/serverfarms"; then
    echo -e "${YELLOW}App Service Plan doesn't exist. Creating...${NC}"
    az appservice plan create \
        --name "${APP_NAME}-plan" \
        --resource-group $RESOURCE_GROUP \
        --sku B1 \
        --is-linux
else
    echo -e "${YELLOW}App Service Plan already exists. Skipping creation.${NC}"
fi

# Create Backend Web App if it doesn't exist
echo -e "${GREEN}Checking/Creating Backend Web App...${NC}"
if ! resource_exists $RESOURCE_GROUP $BACKEND_APP_NAME "Microsoft.Web/sites"; then
    echo -e "${YELLOW}Backend Web App doesn't exist. Creating...${NC}"
    az webapp create \
        --resource-group $RESOURCE_GROUP \
        --plan "${APP_NAME}-plan" \
        --name $BACKEND_APP_NAME \
        --runtime "DOTNETCORE:8.0"
else
    echo -e "${YELLOW}Backend Web App already exists. Skipping creation.${NC}"
fi

# Create Static Web App if it doesn't exist
echo -e "${GREEN}Checking/Creating Static Web App...${NC}"
if ! resource_exists $RESOURCE_GROUP $STATIC_APP_NAME "Microsoft.Web/staticSites"; then
    echo -e "${YELLOW}Static Web App doesn't exist. Creating...${NC}"
    az staticwebapp create \
        --name $STATIC_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --location eastasia \
        --sku Free
else
    echo -e "${YELLOW}Static Web App already exists. Skipping creation.${NC}"
fi

# Configure HTTPS settings for backend
echo -e "${GREEN}Configuring HTTPS settings...${NC}"
az webapp update \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --https-only false

# Configure always-on settings for backend
echo -e "${GREEN}Configuring always-on settings...${NC}"
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --always-on true

# Configure Backend App Settings
echo -e "${GREEN}Configuring Backend App Settings...${NC}"
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --settings \
    ASPNETCORE_ENVIRONMENT="Production" \
    CORS__AllowedOrigins="https://*.azurestaticapps.net"

# Build and Deploy Backend
echo -e "${GREEN}Building and deploying backend...${NC}"
dotnet publish JobTracker.Api/JobTracker.Api.csproj -c Release -o ./publish/backend
cd publish/backend
zip -r backend.zip .
az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --src backend.zip
cd ../..

echo -e "${GREEN}Deployment completed!${NC}"
echo -e "${GREEN}Frontend URL: https://${STATIC_APP_NAME}.azurestaticapps.net${NC}"
echo -e "${GREEN}Backend URL: http://${BACKEND_APP_NAME}.azurewebsites.net${NC}" 