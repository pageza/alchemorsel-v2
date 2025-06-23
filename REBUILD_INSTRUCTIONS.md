# 🔄 System Rebuild & Restart Instructions

## Current Status
- ✅ Access Control & Security: Completed
- ✅ Rate Limiting System: Completed  
- ✅ UI Framework Migration: Completed
- ✅ Frontend & Backend: Ready for testing

## 🛠️ Full System Rebuild & Restart

### 1. Stop Existing Services
```bash
# Stop all running containers
cd /workspaces/alchemorsel-v2
docker-compose down

# Optional: Clean up everything (removes volumes/data)
# docker-compose down -v --remove-orphans
```

### 2. Rebuild Backend
```bash
cd /workspaces/alchemorsel-v2/backend

# Clean build
go mod tidy
go build -o api-server ./cmd/api

# Verify build success
echo "Backend build status: $?"
```

### 3. Rebuild Frontend
```bash
cd /workspaces/alchemorsel-v2/frontend

# Install dependencies (if needed)
npm install

# Build production version
npm run build

# Verify build success  
echo "Frontend build status: $?"
```

### 4. Start All Services
```bash
cd /workspaces/alchemorsel-v2

# Start all services with rebuild
docker-compose up --build -d

# Check service status
docker-compose ps
```

### 5. Verify Services are Running
```bash
# Check logs for any errors
docker-compose logs backend
docker-compose logs frontend
docker-compose logs redis
docker-compose logs postgres

# Test endpoints
curl http://localhost:8080/health
curl http://localhost:5173  # or your frontend port
```

## 🧪 Manual Testing Checklist

### **Access Control Testing**
1. **Unauthenticated Access**:
   - ✅ Can visit: `http://localhost:5173/` (Landing)
   - ✅ Can visit: `http://localhost:5173/about` (About)
   - ❌ Blocked from: `/recipes`, `/generate`, `/dashboard` (should redirect to landing)

2. **Authentication Flow**:
   - ✅ Register new account: `/register`
   - ✅ Login: `/login`
   - ✅ Access dashboard after login: `/dashboard`

### **Rate Limiting Testing**
1. **Recipe Generation**:
   - ✅ Generate 1 recipe - should work
   - ✅ Generate 2 recipes - should work
   - ❌ Generate 3rd recipe - should be blocked with rate limit message
   - ✅ Check rate limit indicator shows 0/2 remaining

2. **Recipe Modification**:
   - ✅ Edit same recipe 10 times - should work
   - ❌ Edit same recipe 11th time - should be blocked
   - ✅ Check rate limit indicator shows usage

### **UI/UX Testing**
1. **Vuetify Components**:
   - ✅ Login form uses Vuetify (v-btn, v-text-field, etc.)
   - ✅ Register form uses Vuetify  
   - ✅ Navigation uses Vuetify (v-app-bar, v-menu)
   - ✅ No Element Plus components visible

2. **Rate Limit Indicators**:
   - ✅ Recipe Generator shows rate limit card
   - ✅ Recipe Create/Edit shows rate limit card
   - ✅ Progress bars show green → yellow → red
   - ✅ Reset time countdown displayed

### **Backend API Testing**
```bash
# Test rate limit endpoints (need auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/v1/rate-limits/recipe-creation

curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/v1/rate-limits/recipe-modification/RECIPE_ID
```

## 🚨 Common Issues & Solutions

### **Redis Connection Issues**
```bash
# Check Redis is running
docker-compose ps redis

# Check Redis logs
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### **Rate Limiting Not Working**
```bash
# Check backend logs for Redis errors
docker-compose logs backend | grep -i redis

# Verify Redis keys are being set
docker-compose exec redis redis-cli
> KEYS rate_limit:*
```

### **Frontend Build Issues**
```bash
# Clear node_modules and rebuild
cd /workspaces/alchemorsel-v2/frontend
rm -rf node_modules
npm install
npm run build
```

### **Authentication Issues**
```bash
# Check JWT secret is set
docker-compose exec backend env | grep JWT

# Verify database connection
docker-compose logs postgres
```

## 📊 Expected Test Results

After rebuild, you should see:
- ✅ Landing page loads without authentication
- ✅ Authentication required for all app features
- ✅ Rate limiting active with visual indicators
- ✅ Vuetify-only UI components
- ✅ Email verification enforced for recipe generation
- ✅ Clean, consistent Material Design interface

## 🎯 Next Steps After Testing

1. **If tests pass**: Ready for dietary restrictions bug fix (final MVP blocker)
2. **If issues found**: Debug specific failing tests above
3. **Production preparation**: Environment configuration and deployment setup

---

**Note**: The system now has only 1 remaining critical blocker: the dietary restrictions safety bug. Once that's fixed, the MVP will be 100% ready for production deployment.# CI test for Redis password fix
