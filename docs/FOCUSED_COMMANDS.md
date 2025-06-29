# 🎯 Focused Development Commands

**Purpose**: Quick commands for targeted development using granular documentation metadata  
**Version**: 1.3.0  
**Created**: 2025-06-27

## 🚀 Quick Command Patterns

### Component-Focused Commands
Use these patterns to tell Claude exactly what to work on:

#### **Page Commands**
```
"FIX PAGE LoginView" 
"ENHANCE PAGE RecipeGeneratorView"
"UPDATE PAGE DashboardView"
"DEBUG PAGE EditProfileView"
```

#### **Component Commands**
```
"FIX COMPONENT RecipeCard"
"ENHANCE COMPONENT AppNavbar" 
"UPDATE COMPONENT EmailVerificationBanner"
"DEBUG COMPONENT ForkRecipeModal"
```

#### **Feature Commands**
```
"FIX FEATURE auth"
"ENHANCE FEATURE recipes" 
"UPDATE FEATURE profiles"
"DEBUG FEATURE admin"
```

#### **Backend Commands**
```
"FIX ENDPOINT /api/v1/auth/login"
"ENHANCE SERVICE recipe"
"UPDATE MODEL user"
"DEBUG MIDDLEWARE auth"
```

## 🔍 Command Processing Workflow

When you use a focused command, Claude will:

### 1. **Parse Command Structure**
- Extract: `ACTION` + `TYPE` + `TARGET`
- Examples:
  - `FIX PAGE LoginView` → Action: FIX, Type: PAGE, Target: LoginView
  - `ENHANCE COMPONENT RecipeCard` → Action: ENHANCE, Type: COMPONENT, Target: RecipeCard

### 2. **Locate Documentation**
- **PAGE**: Look in `docs/frontend/pages/{Target}.md`
- **COMPONENT**: Look in `docs/frontend/components/{Target}.md`
- **FEATURE**: Look in `docs/frontend/features/{Target}/README.md`
- **ENDPOINT**: Look in `docs/backend/endpoints/{path}/{Target}.md`
- **SERVICE**: Look in `docs/backend/services/{Target}.md`
- **MODEL**: Look in `docs/backend/models/{Target}.md`

### 3. **Extract Metadata**
From the documentation, gather:
- **File Location**: Exact path to the component/file
- **Dependencies**: Required services, components, stores
- **Current Version**: For rollback planning
- **Known Issues**: Existing problems
- **Testing Info**: Test files and coverage
- **Related Components**: Dependencies and integrations

### 4. **Execute Focused Analysis**
- Read the target file(s)
- Understand current implementation
- Identify the specific issue or enhancement area
- Plan targeted solution

### 5. **Implement with Context**
- Make precise changes to the identified component
- Update related documentation
- Run relevant tests
- Update version tracking

## 📋 Command Reference

### **FIX Commands**
Address bugs and issues in specific components:

```bash
# Frontend Fixes
FIX PAGE LoginView                    # Fix login page issues
FIX COMPONENT RecipeCard             # Fix recipe card problems
FIX FEATURE auth                     # Fix authentication system

# Backend Fixes  
FIX ENDPOINT /api/v1/auth/login      # Fix login API endpoint
FIX SERVICE recipe                   # Fix recipe service logic
FIX MODEL user                       # Fix user data model
```

**Claude Actions**:
1. Read component documentation for known issues
2. Locate exact file paths from metadata
3. Analyze current implementation
4. Identify and fix the specific problem
5. Update documentation with fix details

### **ENHANCE Commands**
Add new functionality or improve existing features:

```bash
# Frontend Enhancements
ENHANCE PAGE DashboardView           # Add dashboard features
ENHANCE COMPONENT AppNavbar          # Improve navigation
ENHANCE FEATURE recipes              # Add recipe capabilities

# Backend Enhancements
ENHANCE ENDPOINT /api/v1/recipes     # Improve recipe API
ENHANCE SERVICE llm                  # Add AI capabilities
ENHANCE MODEL recipe                 # Extend recipe model
```

**Claude Actions**:
1. Read component documentation for enhancement opportunities
2. Understand current capabilities and limitations
3. Plan enhancement within existing architecture
4. Implement new functionality
5. Update documentation and tests

### **UPDATE Commands**
Modify existing functionality or migrate to new patterns:

```bash
# Frontend Updates
UPDATE PAGE RecipeDetailView         # Update page implementation
UPDATE COMPONENT NotificationToast   # Update component behavior
UPDATE FEATURE profiles              # Update profile system

# Backend Updates
UPDATE SERVICE auth                  # Update authentication logic
UPDATE MODEL dietary                 # Update dietary models
UPDATE MIDDLEWARE cors               # Update CORS settings
```

**Claude Actions**:
1. Read current implementation from documentation
2. Understand existing patterns and dependencies
3. Plan backward-compatible updates
4. Implement changes preserving existing functionality
5. Update version tracking and documentation

### **DEBUG Commands**
Investigate and troubleshoot specific issues:

```bash
# Frontend Debugging
DEBUG PAGE RecipeGeneratorView       # Debug AI generation page
DEBUG COMPONENT FeedbackModal        # Debug modal issues
DEBUG FEATURE search                 # Debug search functionality

# Backend Debugging
DEBUG ENDPOINT /api/v1/llm/query     # Debug AI generation API
DEBUG SERVICE embedding              # Debug vector embeddings
DEBUG MIDDLEWARE rate-limit          # Debug rate limiting
```

**Claude Actions**:
1. Read component documentation for debugging context
2. Examine current implementation and recent changes
3. Check related test files and error patterns
4. Identify potential root causes
5. Provide debugging steps and fixes

## 🎯 Advanced Command Patterns

### **Multi-Component Commands**
```bash
"FIX FLOW auth login"                # Fix complete login flow
"ENHANCE FLOW recipe creation"       # Enhance recipe creation process
"DEBUG FLOW ai generation"           # Debug AI generation workflow
```

### **Integration Commands**
```bash
"FIX INTEGRATION frontend backend auth"     # Fix auth integration
"UPDATE INTEGRATION recipes ai"             # Update recipe-AI integration
"DEBUG INTEGRATION payment stripe"          # Debug payment integration
```

### **Performance Commands**
```bash
"OPTIMIZE PAGE RecipeListView"       # Optimize page performance
"OPTIMIZE COMPONENT RecipeCard"      # Optimize component rendering
"OPTIMIZE ENDPOINT /api/v1/recipes"  # Optimize API performance
```

## 🔧 Command Execution Examples

### Example 1: Fix Login Page
```
User: "FIX PAGE LoginView"

Claude Process:
1. Read docs/frontend/pages/LoginView.md
2. Extract metadata:
   - Location: frontend/src/views/LoginView.vue
   - Dependencies: auth.service.ts, auth.store.ts, useAuth.ts
   - Known Issues: None currently identified
   - Tests: ui-tests/tests/auth/login.test.js
3. Read LoginView.vue file
4. Analyze auth service integration
5. Identify and fix specific issues
6. Update documentation if needed
```

### Example 2: Enhance Recipe Card
```
User: "ENHANCE COMPONENT RecipeCard favoriting animation"

Claude Process:
1. Read docs/frontend/components/RecipeCard.md
2. Extract metadata:
   - Location: frontend/src/components/RecipeCard.vue
   - Dependencies: recipe.service.ts, auth.store.ts
   - Current Features: Recipe display, favoriting toggle
   - Future Enhancements: Listed in documentation
3. Read RecipeCard.vue implementation
4. Add smooth animation to favorite toggle
5. Update component documentation
6. Update tests if needed
```

### Example 3: Debug AI Generation
```
User: "DEBUG ENDPOINT /api/v1/llm/query rate limiting"

Claude Process:
1. Read docs/backend/endpoints/llm/query.md
2. Extract metadata:
   - Location: backend/internal/api/llm.go:QueryHandler
   - Dependencies: llm.service, auth.middleware
   - Rate Limits: 10 requests per hour
   - Known Issues: Listed in documentation
3. Read LLM handler and rate limiting middleware
4. Analyze rate limiting implementation
5. Identify potential issues
6. Provide debugging steps and fixes
```

## 🚀 Integration with Existing Workflow

### Quick Commands vs. Full Process
- **Quick Commands**: For small, targeted changes to specific components
- **Full Systematic Process**: For complex features spanning multiple components

### When to Use Quick Commands
✅ **Good for**:
- Single component bug fixes
- Small feature enhancements
- Performance optimizations
- Debugging specific issues
- Component refactoring

❌ **Not suitable for**:
- New feature development spanning multiple components
- Major architectural changes
- Database schema modifications
- Breaking API changes

### Command to Process Escalation
If a quick command reveals complexity requiring the full process:

```
"This change affects multiple components. Escalating to full systematic process."
→ Switch to INTAKE_PARSER.md workflow
```

## 📝 Documentation Auto-Updates

When using focused commands, Claude will automatically:
1. **Update component documentation** with changes made
2. **Increment version numbers** for significant modifications
3. **Add to known issues** if new problems discovered
4. **Update future enhancements** list based on user requests
5. **Cross-reference related components** that may be affected

---

**This focused command system leverages our granular documentation to enable precise, efficient development targeting specific components while maintaining comprehensive context awareness.**