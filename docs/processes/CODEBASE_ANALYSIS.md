# 🔍 Codebase Analysis Process

**Systematic discovery and analysis of existing code patterns before implementation**

## 🎯 **Purpose**

Before implementing any feature or fix, this process guides AI assistants and developers through systematic codebase analysis to understand existing patterns, dependencies, and integration points.

## 📊 **Analysis Categories**

### **🏗️ Architecture Discovery**

#### **Frontend Component Analysis**
```bash
# 1. Find existing similar components
find frontend/src/components -name "*.vue" | grep -i "recipe\|profile\|auth"

# 2. Analyze component patterns
grep -r "defineComponent\|setup(" frontend/src/components/

# 3. Check state management patterns  
find frontend/src/stores -name "*.ts" | head -5

# 4. Review service patterns
find frontend/src/services -name "*.ts" | head -5
```

#### **Backend Service Analysis**
```bash
# 1. Find related handlers
find backend/internal/api -name "*.go" | grep -i "recipe\|profile\|auth"

# 2. Check service layer patterns
find backend/internal/service -name "*.go" | head -5

# 3. Review model structures
find backend/internal/models -name "*.go" | head -5

# 4. Database migration patterns
ls backend/migrations/ | tail -5
```

### **🔗 Integration Point Discovery**

#### **API Endpoint Analysis**
```bash
# 1. Find existing endpoints for similar features
grep -r "router\|gin\|POST\|GET" backend/internal/api/ | grep -i "recipe\|profile"

# 2. Check authentication middleware usage
grep -r "middleware\|auth" backend/internal/api/

# 3. Review request/response patterns
grep -r "bind\|JSON\|c.JSON" backend/internal/api/
```

#### **Database Schema Analysis**
```bash
# 1. Check existing table structures
grep -r "CREATE TABLE\|ALTER TABLE" backend/migrations/

# 2. Find related foreign keys and relationships
grep -r "REFERENCES\|FOREIGN KEY" backend/migrations/

# 3. Review index patterns
grep -r "CREATE INDEX" backend/migrations/
```

## 🔍 **Systematic Analysis Workflow**

### **Step 1: Component Identification** 📋

#### **For New Features:**
1. **Identify similar existing features** in the codebase
2. **Map component relationships**:
   - Which components communicate?
   - What data flows between them?
   - Which services are involved?
3. **Document integration points**:
   - API endpoints
   - Database tables
   - State management stores

#### **For Bug Fixes:**
1. **Locate the broken functionality**:
   - Find related files using error messages
   - Trace code execution path
   - Identify upstream/downstream dependencies
2. **Understand the expected behavior**:
   - Review related tests
   - Check similar working functionality
   - Analyze user flow

### **Step 2: Pattern Recognition** 🧩

#### **Frontend Patterns to Discover:**
```typescript
// Component structure patterns
export default defineComponent({
  name: 'ComponentName',
  props: { /* props pattern */ },
  setup(props) {
    // State management pattern
    // API call patterns  
    // Event handling patterns
  }
})

// Service call patterns
const { data, error, loading } = await apiService.method()

// Store usage patterns
const store = useStore()
```

#### **Backend Patterns to Discover:**
```go
// Handler patterns
func (h *Handler) MethodName(c *gin.Context) {
    // Input validation patterns
    // Service call patterns
    // Response patterns
}

// Service patterns  
func (s *Service) MethodName(input Type) (output Type, error) {
    // Business logic patterns
    // Database call patterns
    // Error handling patterns
}

// Model patterns
type ModelName struct {
    // Field patterns
    // Validation patterns
    // Relationship patterns
}
```

### **Step 3: Dependency Mapping** 🗺️

#### **Create Dependency Graph:**
```yaml
feature_name:
  frontend_dependencies:
    - components: ["ComponentA", "ComponentB"]
    - services: ["api.service", "auth.service"]  
    - stores: ["recipe.store", "auth.store"]
    - composables: ["useAuth", "useRecipes"]
  
  backend_dependencies:
    - handlers: ["recipe.go", "auth.go"]
    - services: ["recipe.service", "auth.service"]
    - models: ["Recipe", "User", "Profile"]
    - middleware: ["auth.middleware"]
  
  database_dependencies:
    - tables: ["recipes", "users", "profiles"]
    - migrations: ["001_create_recipes.sql"]
    - indexes: ["idx_recipe_user"]
  
  external_dependencies:
    - apis: ["DeepSeek", "AWS S3"]
    - services: ["Redis", "PostgreSQL"]
```

### **Step 4: Test Pattern Analysis** 🧪

#### **Existing Test Patterns:**
```bash
# Frontend test patterns
find frontend/src -name "*.test.ts" -o -name "*.spec.ts" | head -5

# Backend test patterns  
find backend -name "*_test.go" | head -5

# E2E test patterns
find ui-tests -name "*.test.js" | head -5
```

#### **Test Structure Discovery:**
```typescript
// Frontend test patterns
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup patterns
  })
  
  it('should behavior', () => {
    // Test patterns
  })
})
```

```go
// Backend test patterns
func TestFunctionName(t *testing.T) {
    // Setup patterns
    // Test patterns  
    // Assertion patterns
}
```

## 📝 **Analysis Output Template**

### **Codebase Analysis Report:**
```markdown
# Codebase Analysis: [FEATURE/BUG NAME]

## 🔍 **Discovery Summary**
- **Similar Features Found**: [List existing similar features]
- **Integration Points**: [List API endpoints, components, services]
- **Dependencies**: [List all dependencies discovered]

## 🏗️ **Architecture Patterns**
### Frontend Patterns:
- **Component Structure**: [Describe pattern used]
- **State Management**: [Describe store patterns]  
- **API Integration**: [Describe service patterns]

### Backend Patterns:
- **Handler Structure**: [Describe handler patterns]
- **Service Layer**: [Describe service patterns]
- **Data Models**: [Describe model patterns]

## 🔗 **Integration Requirements**
### Files to Modify:
- **Frontend**: [List specific files and why]
- **Backend**: [List specific files and why]  
- **Database**: [List migrations needed]

### Files to Create:
- **New Components**: [List with rationale]
- **New Services**: [List with rationale]
- **New Tests**: [List test files needed]

## 🧪 **Testing Strategy**
### Existing Test Patterns:
- **Unit Tests**: [Describe patterns found]
- **Integration Tests**: [Describe patterns found]
- **E2E Tests**: [Describe patterns found]

### Tests to Implement:
- **New Unit Tests**: [List specific tests needed]
- **Modified Tests**: [List tests to update]
- **New E2E Tests**: [List end-to-end scenarios]

## ⚠️ **Potential Risks**
- **Breaking Changes**: [List potential breaking changes]
- **Dependencies**: [List dependency conflicts]
- **Performance**: [List performance considerations]

## 🎯 **Implementation Strategy**
1. **Order of Implementation**: [Step-by-step approach]
2. **Rollback Plan**: [How to undo changes if needed]
3. **Testing Approach**: [Testing order and strategy]
```

## 🚀 **Quick Analysis Commands**

### **Fast Component Discovery:**
```bash
# Find components by feature area
find frontend/src -name "*.vue" | grep -i "$FEATURE_NAME"

# Find related API endpoints  
grep -r "$FEATURE_NAME\|$COMPONENT_NAME" backend/internal/api/

# Find related database tables
grep -r "$FEATURE_NAME\|$COMPONENT_NAME" backend/migrations/

# Find existing tests
find . -name "*test*" -o -name "*spec*" | grep -i "$FEATURE_NAME"
```

### **Pattern Extraction:**
```bash
# Extract component patterns
head -20 frontend/src/components/[SimilarComponent].vue

# Extract service patterns  
head -30 backend/internal/service/[similar_service].go

# Extract test patterns
head -20 frontend/src/components/__tests__/[similar_test].ts
```

## 🔄 **Integration with Development Workflow**

### **When to Use This Process:**
1. **Before IMPLEMENTATION_GENERATOR**: To understand what artifacts to generate
2. **During INTAKE_PARSER**: To identify files affected and dependencies  
3. **Before coding**: To understand patterns to follow
4. **During debugging**: To trace execution flow

### **Output Feeds Into:**
- **IMPLEMENTATION_GENERATOR**: Provides concrete file lists and patterns
- **DEVELOPMENT_WORKFLOW**: Provides implementation strategy
- **Test Planning**: Provides test patterns and requirements

---

**This systematic analysis ensures implementation follows existing patterns and doesn't break existing functionality.**