#!/bin/bash

# 🔒 Alchemorsel SSL Deployment Script
# Sets up HTTPS with Let's Encrypt SSL certificates

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔒 Alchemorsel SSL Deployment Script${NC}"
echo "=================================================="

# Check if domain is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Domain name required!${NC}"
    echo "Usage: $0 <your-domain.com> [email]"
    echo "Example: $0 alchemorsel.com admin@alchemorsel.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@$1"}

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Domain: $DOMAIN"
echo "   Email: $EMAIL"
echo ""

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root or with sudo${NC}"
   exit 1
fi

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

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update

# Install Certbot and Nginx
echo -e "${YELLOW}🔧 Installing Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# Stop any existing containers to free up ports
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down || true
docker-compose -f docker-compose.production.yml down || true
docker-compose -f docker-compose.ssl.yml down || true

# Get SSL certificate
echo -e "${YELLOW}🔐 Obtaining SSL certificate for $DOMAIN...${NC}"
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" || {
    echo -e "${RED}❌ Failed to obtain SSL certificate. Check your domain DNS settings.${NC}"
    exit 1
}

# Create nginx config from template
echo -e "${YELLOW}📝 Creating Nginx SSL configuration...${NC}"
export DOMAIN
envsubst '$DOMAIN' < config/nginx-ssl.template > config/nginx-ssl.conf

# Verify the configuration was created
if [ ! -f "config/nginx-ssl.conf" ]; then
    echo -e "${RED}❌ Failed to create nginx configuration${NC}"
    exit 1
fi

# Pull latest images
echo -e "${YELLOW}📥 Pulling latest Docker images...${NC}"
docker pull alchemorsel/frontend:v1.2.0
docker pull alchemorsel/backend:v1.2.0
docker pull ankane/pgvector:latest
docker pull redis:latest
docker pull nginx:alpine

# Start the application with SSL
echo -e "${YELLOW}🚀 Starting Alchemorsel with SSL...${NC}"
docker-compose -f docker-compose.ssl.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 15

# Test SSL certificate
echo -e "${YELLOW}🔍 Testing SSL certificate...${NC}"
if curl -s "https://$DOMAIN/health" > /dev/null; then
    echo -e "${GREEN}✅ SSL certificate is working!${NC}"
else
    echo -e "${YELLOW}⚠️  SSL test failed, but services might still be starting...${NC}"
fi

# Set up auto-renewal
echo -e "${YELLOW}🔄 Setting up automatic certificate renewal...${NC}"
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f $(pwd)/docker-compose.ssl.yml restart nginx-proxy") | crontab -

# Configure firewall
echo -e "${YELLOW}🛡️  Configuring firewall...${NC}"
ufw --force enable
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP (redirects to HTTPS)
ufw allow 443/tcp  # HTTPS

# Check if services are running
if docker-compose -f docker-compose.ssl.yml ps | grep -q "Up"; then
    echo ""
    echo -e "${GREEN}🎉 SSL deployment successful!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Your secure application is available at:${NC}"
    echo "   https://$DOMAIN"
    echo "   https://www.$DOMAIN"
    echo ""
    echo -e "${BLUE}📊 Service Status:${NC}"
    docker-compose -f docker-compose.ssl.yml ps
    echo ""
    echo -e "${BLUE}🔐 SSL Certificate Info:${NC}"
    certbot certificates
    echo ""
    echo -e "${GREEN}✅ Auto-renewal configured via crontab${NC}"
    echo -e "${GREEN}✅ Firewall configured for HTTPS${NC}"
else
    echo -e "${RED}❌ SSL deployment failed. Check logs:${NC}"
    docker-compose -f docker-compose.ssl.yml logs
    exit 1
fi

echo ""
echo -e "${GREEN}🔒 Your Alchemorsel application is now secure with HTTPS!${NC}"