#!/bin/bash

# 🚀 Alchemorsel Deployment Script
# Use this script to deploy Alchemorsel on your EC2 instance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Alchemorsel Deployment Script${NC}"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if secrets directory exists
if [ ! -d "secrets" ]; then
    echo -e "${RED}❌ Secrets directory not found!${NC}"
    echo "Please create the secrets directory and populate it with the required secrets."
    echo "See docs/DEPLOYMENT_SECRETS.md for details."
    exit 1
fi

# Check critical secrets
echo -e "${YELLOW}🔍 Checking critical secrets...${NC}"
critical_secrets=("deepseek_api_key.txt" "jwt_secret.txt" "db_password.txt")
for secret in "${critical_secrets[@]}"; do
    if [[ ! -s "secrets/$secret" ]]; then
        echo -e "${RED}❌ Critical secret missing: secrets/$secret${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ secrets/$secret${NC}"
    fi
done

# Pull latest images
echo -e "${YELLOW}📥 Pulling latest Docker images...${NC}"
docker pull alchemorsel/frontend:v1.2.0
docker pull alchemorsel/backend:v1.2.0
docker pull ankane/pgvector:latest
docker pull redis:latest

# Stop any existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.production.yml down || true

# Start the application
echo -e "${YELLOW}🚀 Starting Alchemorsel application...${NC}"
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
if docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Alchemorsel deployed successfully!${NC}"
    echo ""
    echo "🌐 Your application should be available at:"
    echo "   Frontend: http://$(curl -s ipinfo.io/ip):80"
    echo "   Backend API: http://$(curl -s ipinfo.io/ip):8080"
    echo ""
    echo "📊 Check service status:"
    docker-compose -f docker-compose.production.yml ps
else
    echo -e "${RED}❌ Deployment failed. Check logs:${NC}"
    docker-compose -f docker-compose.production.yml logs
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"