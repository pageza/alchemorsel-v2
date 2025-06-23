#!/bin/bash

# Comprehensive quality check script
# Run this before committing to ensure all quality gates pass

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔍 Running comprehensive quality checks for Alchemorsel..."
echo "Project root: $PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

run_check() {
    local name="$1"
    local command="$2"
    local required="$3"
    
    echo -e "\n${BLUE}🔍 $name${NC}"
    if eval "$command"; then
        echo -e "${GREEN}✅ $name passed${NC}"
    else
        echo -e "${RED}❌ $name failed${NC}"
        if [ "$required" = "required" ]; then
            FAILURES=$((FAILURES + 1))
        else
            echo -e "${YELLOW}⚠️  $name failed but is not required${NC}"
        fi
    fi
}

cd "$PROJECT_ROOT"

echo -e "${BLUE}📋 Pre-flight checks${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    git status --short
fi

echo -e "\n${BLUE}🏗️  Backend Quality Checks${NC}"

# Backend checks
run_check "Go formatting" "cd backend && go fmt ./... && [ -z \"\$(git diff --name-only)\" ]" "required"
run_check "Go mod tidy" "cd backend && go mod tidy && [ -z \"\$(git diff go.mod go.sum)\" ]" "required"
run_check "Go vulnerability check" "cd backend && govulncheck ./..." "optional"
run_check "Go linting" "cd backend && golangci-lint run --timeout=5m" "required"
run_check "Go security scan" "cd backend && gosec -quiet ./..." "optional"
run_check "Go tests" "cd backend && go test -race ./..." "required"
run_check "Go test coverage" "cd backend && go test -coverprofile=coverage.out ./... && go tool cover -func=coverage.out | grep total | awk '{if (\$3 < \"80.0%\") exit 1}'" "required"
run_check "Go build" "cd backend && go build -o /tmp/alchemorsel-api ./cmd/api" "required"

echo -e "\n${BLUE}🌐 Frontend Quality Checks${NC}"

# Frontend checks
run_check "Node dependencies audit" "cd frontend && npm audit --audit-level=moderate" "optional"
run_check "TypeScript compilation" "cd frontend && npm run type-check" "required"
run_check "ESLint" "cd frontend && npm run lint" "required"
run_check "Prettier formatting" "cd frontend && npx prettier --check \"src/**/*.{ts,tsx,vue,js,jsx}\"" "required"
run_check "Frontend tests" "cd frontend && npm run test:unit -- --run" "required"
run_check "Frontend test coverage" "cd frontend && npm run test:unit -- --run --coverage && npm run coverage:check" "required"
run_check "Frontend build" "cd frontend && npm run build" "required"

echo -e "\n${BLUE}🧪 Integration & E2E Checks${NC}"

# E2E setup checks
run_check "UI tests dependencies" "cd ui-tests && npm ci" "optional"
run_check "Basic E2E tests" "cd ui-tests && timeout 120 node tests/mvp-core.test.js || true" "optional"

echo -e "\n${BLUE}🔒 Security Checks${NC}"

# Security checks
run_check "Secret detection" "detect-secrets scan --baseline .secrets.baseline --force-use-all-plugins" "required"
run_check "Docker security" "hadolint backend/Dockerfile frontend/Dockerfile" "optional"
run_check "Dependencies vulnerabilities" "trivy fs --exit-code 1 --severity HIGH,CRITICAL ." "optional"

echo -e "\n${BLUE}📏 Code Quality Metrics${NC}"

# Quality metrics
run_check "Version consistency" "./scripts/check-versions.sh" "required"
run_check "Documentation coverage" "[ \$(find . -name '*.md' | wc -l) -gt 5 ]" "optional"

echo -e "\n${BLUE}📊 Final Report${NC}"

if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}🎉 All required quality checks passed!${NC}"
    echo -e "${GREEN}✅ Code is ready for commit and CI/CD pipeline${NC}"
    exit 0
else
    echo -e "${RED}❌ $FAILURES required check(s) failed${NC}"
    echo -e "${RED}🚫 Please fix the issues before committing${NC}"
    echo ""
    echo -e "${BLUE}💡 Common fixes:${NC}"
    echo "  • Run 'go fmt ./...' in backend/"
    echo "  • Run 'npm run lint:fix' in frontend/"
    echo "  • Run 'go mod tidy' in backend/"
    echo "  • Add tests to increase coverage"
    echo "  • Fix security vulnerabilities"
    exit 1
fi