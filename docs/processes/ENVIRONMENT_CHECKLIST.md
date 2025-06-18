# 🔧 Development Environment Checklist

**Systematic verification of development environment health before implementation**

## 🎯 **Purpose**

This checklist ensures the development environment is properly configured and all services are healthy before beginning any implementation work. Prevents wasted time debugging environment issues during development.

## 🔍 **Quick Health Check**

### **One-Command Environment Check:**
```bash
# Run comprehensive environment check
./scripts/environment-check.sh

# Expected output: All services ✅ HEALTHY
```

## 📋 **Detailed Environment Verification**

### **🐳 Docker Services Health**

#### **Check Container Status:**
```bash
# 1. Verify all containers are running
docker-compose ps

# Expected: All services showing "Up" status
# ✅ backend_app    Up    0.0.0.0:8080->8080/tcp
# ✅ postgres       Up    0.0.0.0:5432->5432/tcp  
# ✅ redis          Up    0.0.0.0:6379->6379/tcp
```

#### **Service Health Verification:**
```bash
# 2. Test PostgreSQL connection
docker-compose exec postgres psql -U alchemorsel -d alchemorsel -c "SELECT 1;"

# Expected: Should return "1" without errors

# 3. Test Redis connection  
docker-compose exec redis redis-cli ping

# Expected: Should return "PONG"

# 4. Check backend API health
curl -f http://localhost:8080/health

# Expected: {"status": "healthy", "timestamp": "..."}
```

### **🗄️ Database Health**

#### **Schema Verification:**
```bash
# 1. Check migration status
cd backend && make migrate-status

# Expected: All migrations applied, no pending

# 2. Verify critical tables exist
docker-compose exec postgres psql -U alchemorsel -d alchemorsel -c "\dt"

# Expected tables: users, recipes, profiles, etc.

# 3. Check sample data exists  
docker-compose exec postgres psql -U alchemorsel -d alchemorsel -c "SELECT COUNT(*) FROM users;"

# Expected: > 0 (sample users exist)
```

#### **Database Content Verification:**
```bash
# 1. Check user accounts
docker-compose exec postgres psql -U alchemorsel -d alchemorsel -c "SELECT email FROM users LIMIT 3;"

# Expected: Sample user emails

# 2. Check recipe data
docker-compose exec postgres psql -U alchemorsel -d alchemorsel -c "SELECT COUNT(*) FROM recipes;"

# Expected: > 0 (sample recipes exist)
```

### **🔐 Configuration & Secrets**

#### **Environment Variables:**
```bash
# 1. Check required secrets exist
ls -la secrets/

# Expected files:
# ✅ deepseek_api_key.txt
# ✅ openai_api_key.txt  
# ✅ jwt_secret.txt
# ✅ db_password.txt
# ✅ smtp_* files (if email features needed)

# 2. Verify secrets are not empty
for file in secrets/*.txt; do
  if [ -s "$file" ]; then
    echo "✅ $file has content"
  else
    echo "❌ $file is empty"
  fi
done
```

#### **API Key Validation:**
```bash
# 1. Test DeepSeek API key (if available)
DEEPSEEK_KEY=$(cat secrets/deepseek_api_key.txt)
curl -H "Authorization: Bearer $DEEPSEEK_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"test"}],"max_tokens":5}' \
     https://api.deepseek.com/chat/completions

# Expected: Valid JSON response (not 401 error)

# 2. Test OpenAI API key (if available)  
OPENAI_KEY=$(cat secrets/openai_api_key.txt)
curl -H "Authorization: Bearer $OPENAI_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"test"}],"max_tokens":5}' \
     https://api.openai.com/v1/chat/completions

# Expected: Valid JSON response (not 401 error)
```

### **🚀 Backend Service Health**

#### **Go Environment:**
```bash
# 1. Verify Go version
go version

# Expected: go1.21+ or compatible version

# 2. Check Go modules
cd backend && go mod verify

# Expected: "all modules verified"

# 3. Test backend compilation
cd backend && go build -o /tmp/test-build ./cmd/api

# Expected: No compilation errors
```

#### **API Endpoints Health:**
```bash
# 1. Health endpoint
curl -f http://localhost:8080/health

# 2. Auth endpoints (public)
curl -f http://localhost:8080/api/v1/auth/health

# 3. Check CORS configuration
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS http://localhost:8080/api/v1/auth/login

# Expected: CORS headers in response
```

### **🎨 Frontend Service Health**

#### **Node.js Environment:**
```bash
# 1. Verify Node.js version
node --version

# Expected: v18+ or compatible version

# 2. Check npm/dependency status
cd frontend && npm ls --depth=0

# Expected: No major dependency issues

# 3. Test frontend compilation
cd frontend && npm run build --dry-run

# Expected: No compilation errors
```

#### **Development Server:**
```bash
# 1. Test dev server startup
cd frontend && timeout 10s npm run dev &
sleep 5 && curl -f http://localhost:5173

# Expected: HTML content returned

# 2. Test TypeScript compilation
cd frontend && npm run type-check

# Expected: No type errors

# 3. Test linting
cd frontend && npm run lint

# Expected: No critical linting errors
```

### **🧪 Testing Environment**

#### **Test Dependencies:**
```bash
# 1. Backend test dependencies
cd backend && go test -v ./... -dry-run

# Expected: Tests can be discovered and prepared

# 2. Frontend test dependencies  
cd frontend && npm run test:unit --dry-run

# Expected: Test runner starts without errors

# 3. E2E test dependencies
cd ui-tests && npm ls puppeteer

# Expected: Puppeteer is installed
```

#### **Test Database:**
```bash
# 1. Test database setup capability
cd backend && TEST_DB=true go test ./internal/database -v

# Expected: Test database can be created and migrated

# 2. Test data fixtures
cd backend && go test ./internal/testhelpers -v

# Expected: Test fixtures can be loaded
```

## ✅ **Environment Health Checklist**

### **Pre-Implementation Verification:**
```markdown
## 🔧 **Environment Status**: [TIMESTAMP]

### Docker Services:
- [ ] **PostgreSQL**: ✅ Running and accessible
- [ ] **Redis**: ✅ Running and responding to ping
- [ ] **Backend API**: ✅ Health endpoint responding
- [ ] **All containers**: ✅ Status "Up" in docker-compose ps

### Database Health:
- [ ] **Migrations**: ✅ All applied, none pending
- [ ] **Schema**: ✅ All expected tables exist
- [ ] **Sample Data**: ✅ Users and recipes exist
- [ ] **Connections**: ✅ Can connect and query

### Configuration:
- [ ] **Secrets**: ✅ All required secret files exist and have content
- [ ] **API Keys**: ✅ External API keys are valid (if tested)
- [ ] **Environment**: ✅ All required env vars are set

### Backend Service:
- [ ] **Go Environment**: ✅ Correct Go version installed
- [ ] **Dependencies**: ✅ Go modules verified and clean
- [ ] **Compilation**: ✅ Code compiles without errors
- [ ] **API Endpoints**: ✅ Critical endpoints responding

### Frontend Service:
- [ ] **Node.js Environment**: ✅ Correct Node version installed
- [ ] **Dependencies**: ✅ npm dependencies installed and healthy
- [ ] **Compilation**: ✅ TypeScript compiles without errors
- [ ] **Development Server**: ✅ Can start and serve content

### Testing Environment:
- [ ] **Test Dependencies**: ✅ All test frameworks available
- [ ] **Test Database**: ✅ Test DB setup works
- [ ] **E2E Setup**: ✅ Browser automation tools ready
```

## 🚨 **Common Environment Issues**

### **Database Issues:**
```bash
# Problem: PostgreSQL not responding
docker-compose restart postgres
docker-compose logs postgres

# Problem: Migration conflicts
cd backend && make migrate-down && make migrate-up

# Problem: No sample data
cd backend && make seed-dev
```

### **API Service Issues:**
```bash
# Problem: Backend won't start
docker-compose logs backend
# Check for port conflicts, missing secrets

# Problem: CORS errors
# Verify CORS configuration in backend/internal/middleware/cors.go

# Problem: API key errors  
# Check secrets/ files are not empty and contain valid keys
```

### **Frontend Issues:**
```bash
# Problem: Frontend won't compile
cd frontend && rm -rf node_modules package-lock.json
npm install

# Problem: TypeScript errors
cd frontend && npm run type-check
# Fix type errors before proceeding

# Problem: Dev server won't start
# Check for port 5173 conflicts
lsof -i :5173
```

## 🔄 **Integration with Development Workflow**

### **When to Run This Checklist:**
1. **Before starting any implementation** (every time)
2. **After environment changes** (Docker updates, dependency changes)  
3. **When debugging mysterious failures** (environment drift)
4. **Before running tests** (ensure clean environment)

### **Automated Execution:**
```bash
# Create environment check script
cat > scripts/environment-check.sh << 'EOF'
#!/bin/bash
echo "🔧 Alchemorsel Environment Health Check"
echo "======================================"

# [Include all the check commands above]

echo "✅ Environment check complete"
EOF

chmod +x scripts/environment-check.sh
```

---

**This systematic environment verification prevents implementation failures due to environment issues and ensures consistent development conditions.**