#!/bin/bash

# 🧪 Alchemorsel Complete Test Runner
# This script runs all tests in the project

set -e  # Exit on any error

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (parent of scripts)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root
cd "$PROJECT_ROOT"

echo "🧪 ALCHEMORSEL COMPLETE TEST RUNNER"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
BACKEND_RESULT=0
FRONTEND_RESULT=0
E2E_RESULT=0

echo -e "\n${BLUE}📊 Starting comprehensive test execution...${NC}"

# Function to print section headers
print_section() {
    echo -e "\n${YELLOW}$1${NC}"
    echo "$(printf '=%.0s' {1..50})"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_section "🔧 Backend Tests (Go)"

if [ -d "backend" ]; then
    cd "$PROJECT_ROOT/backend"
    
    # Check if secrets exist, otherwise use test keys
    if [ -f "../secrets/deepseek_api_key.txt" ] && [ -f "../secrets/openai_api_key.txt" ]; then
        echo "✅ Using API keys from secrets files"
        DEEPSEEK_API_KEY="$(cat ../secrets/deepseek_api_key.txt)"
        OPENAI_API_KEY="$(cat ../secrets/openai_api_key.txt)"
    else
        echo "⚠️  Secrets files not found, using test keys"
        DEEPSEEK_API_KEY="test-deepseek-key"
        OPENAI_API_KEY="test-openai-key"
    fi
    
    echo "🚀 Running backend tests..."
    if DEEPSEEK_API_KEY="$DEEPSEEK_API_KEY" OPENAI_API_KEY="$OPENAI_API_KEY" go test -v ./...; then
        echo -e "${GREEN}✅ Backend tests PASSED${NC}"
        BACKEND_RESULT=1
    else
        echo -e "${RED}❌ Backend tests FAILED${NC}"
        BACKEND_RESULT=0
    fi
    
    cd "$PROJECT_ROOT"
else
    echo -e "${RED}❌ Backend directory not found${NC}"
fi

print_section "🎨 Frontend Tests (Vue.js)"

if [ -d "frontend" ]; then
    cd "$PROJECT_ROOT/frontend"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm ci
    fi
    
    echo "🔍 Running TypeScript type checking..."
    if npm run type-check; then
        echo -e "${GREEN}✅ TypeScript check PASSED${NC}"
    else
        echo -e "${RED}❌ TypeScript check FAILED${NC}"
        FRONTEND_RESULT=0
    fi
    
    echo "🧹 Running ESLint..."
    if npm run lint; then
        echo -e "${GREEN}✅ ESLint PASSED${NC}"
    else
        echo -e "${RED}❌ ESLint FAILED${NC}"
        FRONTEND_RESULT=0
    fi
    
    echo "🧪 Running unit tests..."
    if npm run test:unit; then
        echo -e "${GREEN}✅ Frontend unit tests PASSED${NC}"
        FRONTEND_RESULT=1
    else
        echo -e "${RED}❌ Frontend unit tests FAILED${NC}"
        FRONTEND_RESULT=0
    fi
    
    cd "$PROJECT_ROOT"
else
    echo -e "${RED}❌ Frontend directory not found${NC}"
fi

print_section "🌐 E2E Tests (Puppeteer)"

if [ -d "ui-tests" ]; then
    cd "$PROJECT_ROOT/ui-tests"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing E2E test dependencies..."
        npm ci
    fi
    
    # Check if environment file exists
    if [ ! -f ".env" ]; then
        echo "⚙️  Creating E2E test environment file..."
        cat > .env << EOF
BASE_URL=http://localhost:5173
API_BASE_URL=http://localhost:8080
HEADLESS=true
SCREENSHOT_ON_FAILURE=true
TEST_USER_EMAIL=test@alchemorsel.com
TEST_USER_PASSWORD=TestPassword123
EOF
    fi
    
    echo "🤖 Running E2E browser tests..."
    if node tests/comprehensive-e2e.test.js; then
        echo -e "${GREEN}✅ E2E tests PASSED${NC}"
        E2E_RESULT=1
    else
        echo -e "${RED}❌ E2E tests FAILED${NC}"
        E2E_RESULT=0
    fi
    
    cd "$PROJECT_ROOT"
else
    echo -e "${RED}❌ UI tests directory not found${NC}"
fi

print_section "📊 Test Results Summary"

echo "Backend Tests:   $([ $BACKEND_RESULT -eq 1 ] && echo -e "${GREEN}✅ PASSED${NC}" || echo -e "${RED}❌ FAILED${NC}")"
echo "Frontend Tests:  $([ $FRONTEND_RESULT -eq 1 ] && echo -e "${GREEN}✅ PASSED${NC}" || echo -e "${RED}❌ FAILED${NC}")"
echo "E2E Tests:       $([ $E2E_RESULT -eq 1 ] && echo -e "${GREEN}✅ PASSED${NC}" || echo -e "${RED}❌ FAILED${NC}")"

TOTAL_PASSED=$((BACKEND_RESULT + FRONTEND_RESULT + E2E_RESULT))
TOTAL_TESTS=3

echo ""
echo "Overall Result: $TOTAL_PASSED/$TOTAL_TESTS test suites passed"

if [ $TOTAL_PASSED -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Ready for deployment! 🚀${NC}"
    exit 0
else
    echo -e "${RED}💥 Some tests failed. Please check the output above.${NC}"
    exit 1
fi