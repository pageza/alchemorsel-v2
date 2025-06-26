#!/bin/bash

# Simple Production Deployment Script
# Usage: ./scripts/deploy-simple.sh [version]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.production-simple.yml"
ENV_FILE=".env.production"
BACKUP_DIR="/opt/alchemorsel/backups"

# Function to log messages
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "Don't run this script as root. Use a user with docker permissions."
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    error "Docker is not running or you don't have permission to access it."
fi

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    error "Environment file $ENV_FILE not found. Copy .env.production.template and configure it."
fi

# Get version parameter
VERSION=${1:-$(date +%Y%m%d-%H%M%S)}
log "Deploying version: $VERSION"

# Load environment variables
set -a
source "$ENV_FILE"
set +a

# Set image versions
export BACKEND_IMAGE="pageza/backend:${VERSION}"
export FRONTEND_IMAGE="pageza/frontend:${VERSION}"
export APP_VERSION="$VERSION"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to backup database
backup_database() {
    log "Creating database backup..."
    
    # Get the current timestamp
    BACKUP_FILE="$BACKUP_DIR/postgres_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Create backup using docker exec
    if docker ps --filter "name=alchemorsel-postgres" --filter "status=running" | grep -q alchemorsel-postgres; then
        docker exec alchemorsel-postgres pg_dump -U postgres alchemorsel_production > "$BACKUP_FILE" 2>/dev/null || {
            warn "Database backup failed, but continuing with deployment..."
        }
        
        if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
            success "Database backed up to: $BACKUP_FILE"
            
            # Keep only last 5 backups
            ls -t "$BACKUP_DIR"/postgres_backup_*.sql | tail -n +6 | xargs -r rm
        else
            warn "Backup file is empty or failed to create"
        fi
    else
        warn "PostgreSQL container not running, skipping backup"
    fi
}

# Function to pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    
    docker pull "$BACKEND_IMAGE" || error "Failed to pull backend image: $BACKEND_IMAGE"
    docker pull "$FRONTEND_IMAGE" || error "Failed to pull frontend image: $FRONTEND_IMAGE"
    
    success "Images pulled successfully"
}

# Function to perform health check
health_check() {
    log "Performing health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check backend health
    for i in {1..10}; do
        if curl -f -s http://localhost:8080/api/health >/dev/null; then
            success "Backend health check passed"
            break
        elif [ $i -eq 10 ]; then
            error "Backend health check failed after 10 attempts"
        else
            log "Backend health check attempt $i/10 failed, retrying in 10 seconds..."
            sleep 10
        fi
    done
    
    # Check frontend health
    for i in {1..10}; do
        if curl -f -s http://localhost:3000 >/dev/null; then
            success "Frontend health check passed"
            break
        elif [ $i -eq 10 ]; then
            error "Frontend health check failed after 10 attempts"
        else
            log "Frontend health check attempt $i/10 failed, retrying in 10 seconds..."
            sleep 10
        fi
    done
    
    success "All health checks passed!"
}

# Function to deploy
deploy() {
    log "Starting deployment..."
    
    # Stop existing containers gracefully
    if [ -f "$COMPOSE_FILE" ]; then
        log "Stopping existing containers..."
        docker-compose -f "$COMPOSE_FILE" down --timeout 30 || warn "Some containers may not have stopped gracefully"
    fi
    
    # Start new containers
    log "Starting new containers..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    success "Containers started"
}

# Function to rollback
rollback() {
    warn "Rolling back to previous version..."
    
    # Get the most recent backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/postgres_backup_*.sql 2>/dev/null | head -n1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log "Restoring database from: $LATEST_BACKUP"
        docker exec -i alchemorsel-postgres psql -U postgres alchemorsel_production < "$LATEST_BACKUP" || {
            error "Database rollback failed"
        }
        success "Database restored"
    else
        warn "No database backup found for rollback"
    fi
    
    # Restart with previous images
    docker-compose -f "$COMPOSE_FILE" down --timeout 30
    docker-compose -f "$COMPOSE_FILE" up -d
    
    success "Rollback completed"
}

# Main deployment process
main() {
    log "Starting simple production deployment for Alchemorsel"
    log "Version: $VERSION"
    log "Backend Image: $BACKEND_IMAGE"
    log "Frontend Image: $FRONTEND_IMAGE"
    
    # Create backup
    backup_database
    
    # Pull new images
    pull_images
    
    # Deploy
    deploy
    
    # Health check
    if health_check; then
        success "🎉 Deployment completed successfully!"
        log "Application is available at:"
        log "  Frontend: http://localhost:3000"
        log "  Backend API: http://localhost:8080/api"
        log "  Health Check: http://localhost:8080/api/health"
    else
        error "Deployment failed health checks, rolling back..."
        rollback
        exit 1
    fi
}

# Trap for cleanup on script exit
cleanup() {
    if [ $? -ne 0 ]; then
        error "Deployment failed. Check logs with: docker-compose -f $COMPOSE_FILE logs"
    fi
}

trap cleanup EXIT

# Handle command line arguments
case "${1:-deploy}" in
    "rollback")
        rollback
        ;;
    "status")
        docker-compose -f "$COMPOSE_FILE" ps
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" logs -f "${2:-}"
        ;;
    "health")
        health_check
        ;;
    *)
        main
        ;;
esac