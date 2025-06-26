#!/bin/bash

# Blue-Green Traffic Switching Script
# Usage: ./scripts/switch-traffic.sh [blue|green|status]

set -e

NGINX_CONFIG="/etc/nginx/sites-available/alchemorsel"
CURRENT_ENV_FILE="/opt/alchemorsel/current-environment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display current environment
show_status() {
    if [ -f "$CURRENT_ENV_FILE" ]; then
        CURRENT=$(cat "$CURRENT_ENV_FILE")
        echo -e "${GREEN}Current active environment: ${CURRENT}${NC}"
    else
        echo -e "${YELLOW}No current environment file found${NC}"
    fi
    
    # Check if services are running
    echo -e "\n${BLUE}Service Status:${NC}"
    if docker ps --filter "name=alchemorsel-backend-blue" --filter "status=running" | grep -q alchemorsel-backend-blue; then
        echo -e "  ${GREEN}✓${NC} Blue backend running (port 8080)"
    else
        echo -e "  ${RED}✗${NC} Blue backend not running"
    fi
    
    if docker ps --filter "name=alchemorsel-frontend-blue" --filter "status=running" | grep -q alchemorsel-frontend-blue; then
        echo -e "  ${GREEN}✓${NC} Blue frontend running (port 3000)"
    else
        echo -e "  ${RED}✗${NC} Blue frontend not running"
    fi
    
    if docker ps --filter "name=alchemorsel-backend-green" --filter "status=running" | grep -q alchemorsel-backend-green; then
        echo -e "  ${GREEN}✓${NC} Green backend running (port 8081)"
    else
        echo -e "  ${RED}✗${NC} Green backend not running"
    fi
    
    if docker ps --filter "name=alchemorsel-frontend-green" --filter "status=running" | grep -q alchemorsel-frontend-green; then
        echo -e "  ${GREEN}✓${NC} Green frontend running (port 3001)"
    else
        echo -e "  ${RED}✗${NC} Green frontend not running"
    fi
}

# Function to perform health check
health_check() {
    local env=$1
    local backend_port=$2
    local frontend_port=$3
    
    echo -e "${BLUE}Performing health check for ${env} environment...${NC}"
    
    # Check backend health
    if curl -f -s "http://localhost:${backend_port}/api/health" > /dev/null; then
        echo -e "  ${GREEN}✓${NC} Backend health check passed"
    else
        echo -e "  ${RED}✗${NC} Backend health check failed"
        return 1
    fi
    
    # Check frontend
    if curl -f -s "http://localhost:${frontend_port}" > /dev/null; then
        echo -e "  ${GREEN}✓${NC} Frontend health check passed"
    else
        echo -e "  ${RED}✗${NC} Frontend health check failed"
        return 1
    fi
    
    echo -e "${GREEN}All health checks passed for ${env} environment${NC}"
    return 0
}

# Function to switch traffic
switch_to_env() {
    local target_env=$1
    local backend_port=""
    local frontend_port=""
    
    if [ "$target_env" = "blue" ]; then
        backend_port="8080"
        frontend_port="3000"
    elif [ "$target_env" = "green" ]; then
        backend_port="8081"
        frontend_port="3001"
    else
        echo -e "${RED}Error: Invalid environment. Use 'blue' or 'green'${NC}"
        exit 1
    fi
    
    # Perform health check before switching
    if ! health_check "$target_env" "$backend_port" "$frontend_port"; then
        echo -e "${RED}Health check failed. Aborting traffic switch.${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Switching traffic to ${target_env} environment...${NC}"
    
    # Create nginx configuration for the target environment
    cat > "/tmp/alchemorsel-nginx.conf" << EOF
server {
    listen 80;
    server_name alchemorsel.com www.alchemorsel.com;
    
    # Frontend
    location / {
        proxy_pass http://localhost:${frontend_port};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:${backend_port};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF
    
    # Update nginx configuration
    sudo cp "/tmp/alchemorsel-nginx.conf" "$NGINX_CONFIG"
    sudo nginx -t
    sudo systemctl reload nginx
    
    # Update current environment file
    echo "$target_env" | sudo tee "$CURRENT_ENV_FILE" > /dev/null
    
    echo -e "${GREEN}Traffic successfully switched to ${target_env} environment${NC}"
    echo -e "${BLUE}Frontend: http://localhost:${frontend_port}${NC}"
    echo -e "${BLUE}Backend API: http://localhost:${backend_port}/api${NC}"
}

# Main script logic
case "${1:-status}" in
    "blue")
        switch_to_env "blue"
        ;;
    "green")
        switch_to_env "green"
        ;;
    "status")
        show_status
        ;;
    *)
        echo -e "${YELLOW}Usage: $0 [blue|green|status]${NC}"
        echo -e "  ${BLUE}blue${NC}   - Switch traffic to blue environment"
        echo -e "  ${BLUE}green${NC}  - Switch traffic to green environment"
        echo -e "  ${BLUE}status${NC} - Show current status (default)"
        exit 1
        ;;
esac