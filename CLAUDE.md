# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚡ **Quick Start for AI Assistants**

### 🎯 **Focused Commands** (For Targeted Work)
**For specific component work, use focused commands:**
- **`FIX PAGE LoginView`** - Target specific page issues
- **`ENHANCE COMPONENT RecipeCard`** - Improve specific components  
- **`DEBUG FEATURE auth`** - Troubleshoot feature areas
- **`UPDATE ENDPOINT /api/v1/auth/login`** - Modify specific APIs

📋 **See [docs/FOCUSED_COMMANDS.md](./docs/FOCUSED_COMMANDS.md) for complete command reference**

### 🔄 **Systematic Process** (For Complex Work)
**For multi-component or new feature work, use the systematic process:**
1. 📥 **[docs/processes/INTAKE_PARSER.md](./docs/processes/INTAKE_PARSER.md)** - Parse and classify the request
2. 🔍 **[docs/processes/CODEBASE_ANALYSIS.md](./docs/processes/CODEBASE_ANALYSIS.md)** - Understand existing patterns  
3. Follow the remaining systematic process below ⬇️

### 🤔 **Decision Tree**
- **Single component issue?** → Use **Focused Commands**
- **Multiple components/new feature?** → Use **Systematic Process**
- **Not sure?** → Start with **Focused Commands**, escalate if needed

## 🗺️ **Navigation Guide**
**For comprehensive project navigation, start with [DOCUMENTATION_HUB.md](./DOCUMENTATION_HUB.md)**

- **Targeted component work?** → Use [Focused Commands](./docs/FOCUSED_COMMANDS.md)
- **Need to implement something?** → Follow the [Systematic Development Process](#systematic-development-process)
- **Understanding specific components?** → See [Granular Documentation](./docs/GRANULAR_DOCUMENTATION_INDEX.md)
- **Understanding architecture?** → Continue reading below
- **Quick reference?** → See [Development Commands](#development-commands)

## Project Overview

Alchemorsel is a recipe management application with AI-powered recipe generation. The project consists of:
- **Backend**: Go REST API with Gin, PostgreSQL (with pgvector), Redis, and LLM integration
- **Frontend**: Vue 3 + TypeScript with Vuetify, Pinia, and Axios
- **Containerized**: Docker Compose setup with all services

## Architecture

### Backend (Go)
- **Entry Point**: `backend/cmd/api/main.go`
- **Structure**: Clean architecture with layers:
  - `internal/api/`: HTTP handlers and routes
  - `internal/service/`: Business logic layer
  - `internal/models/`: Data models
  - `internal/database/`: Database utilities
  - `internal/middleware/`: HTTP middleware
- **Database**: PostgreSQL with pgvector for recipe embeddings
- **Cache**: Redis for session storage
- **LLM**: Integration with DeepSeek/OpenAI for recipe generation
- **Storage**: AWS S3 for profile pictures

### Frontend (Vue 3)
- **Framework**: Vue 3 with Composition API + TypeScript
- **UI**: Vuetify 3 components
- **State**: Pinia stores for auth, recipes, notifications
- **Services**: Axios-based API communication
- **Structure**:
  - `src/stores/`: Pinia state management
  - `src/services/`: API service layer
  - `src/views/`: Page components
  - `src/components/`: Reusable components
  - `src/composables/`: Vue composables

## Development Commands

### Backend
```bash
cd backend
make run              # Run development server
make test             # Run all tests
make lint             # Run golangci-lint
make build            # Build binary
make dev              # Run with hot reload (air)
```

### Frontend
```bash
cd frontend
npm run dev           # Start development server
npm run build         # Build for production
npm run test:unit     # Run unit tests with Vitest
npm run lint          # Run ESLint
npm run type-check    # TypeScript type checking
npm run format        # Format with Prettier
```

### Docker
```bash
docker-compose up     # Start all services
docker-compose up frontend backend  # Start specific services
```

## 🔄 **Systematic Development Process**

**IMPORTANT: When given any task (bug fix, feature request, improvement), ALWAYS follow this systematic process:**

### **Step 1: Parse the Request** 📥
Use **[docs/processes/INTAKE_PARSER.md](./docs/processes/INTAKE_PARSER.md)**:
- Classify as bug/feature/patch/improvement
- Extract requirements and acceptance criteria
- Discover affected files using systematic commands
- Determine priority and scope

### **Step 2: Analyze the Codebase** 🔍
Use **[docs/processes/CODEBASE_ANALYSIS.md](./docs/processes/CODEBASE_ANALYSIS.md)**:
- Find existing similar patterns
- Map dependencies and integration points
- Understand existing architecture patterns
- Identify tests to follow as examples

### **Step 3: Generate Implementation Plan** 🏭
Use **[docs/processes/IMPLEMENTATION_GENERATOR.md](./docs/processes/IMPLEMENTATION_GENERATOR.md)**:
- Create tracking entry in appropriate docs/tracking/ file
- Generate test specifications
- Create code templates based on existing patterns
- Plan implementation sequence

### **Step 4: Prepare for Implementation** 🚀
Use **[docs/processes/READY_TO_IMPLEMENT.md](./docs/processes/READY_TO_IMPLEMENT.md)**:
- Consolidate all requirements into actionable plan
- Create detailed execution checklist
- Verify all prerequisites are met

### **Step 5: Verify Environment** 🔧
Use **[docs/processes/ENVIRONMENT_CHECKLIST.md](./docs/processes/ENVIRONMENT_CHECKLIST.md)**:
- Check database connectivity and schema
- Verify API services are running
- Confirm dependencies are installed
- Validate configuration and secrets

### **Step 6: Execute Implementation** 🔄
Use **[docs/processes/DEVELOPMENT_WORKFLOW.md](./docs/processes/DEVELOPMENT_WORKFLOW.md)**:
- Follow Test-Driven Development approach
- Write failing tests first
- Implement to make tests pass
- Follow existing code patterns

### **Step 7: Verify Completion** ✅
Use **[docs/processes/COMPLETION_VERIFICATION.md](./docs/processes/COMPLETION_VERIFICATION.md)**:
- Validate all acceptance criteria are met
- Run comprehensive test suite
- Check for regressions
- Update tracking documents

### **Process Commands:**
```bash
# Quick environment check before starting
./scripts/environment-check.sh

# Run comprehensive tests
./scripts/test-all.sh

# Verify completion
./scripts/completion-check.sh [ITEM-ID]
```

### **⚠️ CRITICAL: Process Enforcement**
- **NEVER skip steps**: Each step builds on the previous one
- **ALWAYS follow the sequence**: Shortcuts lead to incomplete or broken implementations
- **Use TodoWrite**: Track your progress through each step
- **Verify before proceeding**: Don't move to next step until current step is complete
- **Document everything**: Each step should update relevant tracking documents

**Example Implementation Flow:**
```
User: "Fix the profile edit form not loading user data"
↓
1. INTAKE_PARSER: Classify as BUG-XXX, extract acceptance criteria
2. CODEBASE_ANALYSIS: Find ProfileEditView.vue, profile.service.ts patterns
3. IMPLEMENTATION_GENERATOR: Create test templates, tracking entry
4. READY_TO_IMPLEMENT: Consolidate into execution plan
5. ENVIRONMENT_CHECKLIST: Verify dev environment is healthy
6. DEVELOPMENT_WORKFLOW: Write failing tests, implement fix
7. COMPLETION_VERIFICATION: Validate all criteria met, tests pass
```

---

## Development Guidelines

### Scope and Changes
- **Follow the process**: ALWAYS use the systematic development process above
- Stay strictly within requested scope; no unrequested refactoring
- Only rewrite what is absolutely necessary
- Preserve existing file/folder structure
- Use CODEBASE_ANALYSIS.md to understand existing patterns before making changes

### Code Quality
- **Architecture**: Maintain handler → service → repository → database flow
- **API Contracts**: Preserve public API interfaces unless explicitly approved
- **Documentation**: Always preserve comments and docstrings
- **Pattern Consistency**: Follow existing patterns discovered in codebase analysis
- **Testing**: ALWAYS write tests first using TDD approach

### Dependencies
- **Backend**: Go 1.23+, use existing libraries (Gin, GORM, etc.)
- **Frontend**: Require approval for new npm packages
- **Pattern Discovery**: Use CODEBASE_ANALYSIS.md to find existing patterns before introducing new ones
- **Integration Points**: Always check existing integration patterns

### Naming Conventions
- **Go**: PascalCase for exported, camelCase for unexported
- **Vue/TS**: camelCase for variables/functions, PascalCase for components
- **Tests**: descriptive names following existing patterns

### Security
- Environment variables via Docker secrets
- JWT authentication required for protected routes
- Never commit sensitive information

### Documentation & Tracking
- **Always update tracking documents**: Mark progress in appropriate docs/tracking/ file
- **Create tracking entries**: Use IMPLEMENTATION_GENERATOR.md to create proper tracking entries
- **Update user stories**: Mark implementation status in docs/planning/STORIES.md when relevant
- **Document decisions**: Update process docs if workflow improvements are discovered

### Process Adherence
- **Use TodoWrite**: Track your implementation progress with todo list
- **Follow TDD**: Write tests first, then implement
- **Verify completion**: Use COMPLETION_VERIFICATION.md before marking work done
- **Update status**: Change tracking document status from "in_progress" to "completed"

## API Structure

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login with JWT

### Recipes
- `GET /api/v1/recipes` - List recipes (supports search with pgvector)
- `POST /api/v1/recipes/:id/favorite` - Add to favorites
- `DELETE /api/v1/recipes/:id/favorite` - Remove from favorites

### LLM
- `POST /api/v1/llm/query` - Generate recipe with AI (authenticated)

## Database
- PostgreSQL with pgvector extension for embedding-based search
- Migrations in `backend/migrations/`
- Models in `backend/internal/models/`

## Testing
- **Backend**: `go test ./...` - standard Go testing
- **Frontend**: `npm run test:unit` - Vitest unit tests
- **E2E**: `cd ui-tests && npm run test:comprehensive`
- **All Tests**: `./scripts/test-all.sh` - comprehensive test runner
- Integration tests use testcontainers for database testing

### Test-Driven Development
**ALWAYS write tests first** following existing patterns found in codebase analysis:
1. Write failing tests that capture acceptance criteria
2. Run tests to confirm they fail
3. Implement minimal code to make tests pass
4. Refactor while keeping tests green

## Version Management & Release Guidelines

### Semantic Versioning Rules
Claude should suggest version bumps based on the type of changes made:

**PATCH (x.y.Z)** - Bug fixes and minor improvements:
- Bug fixes that don't affect API
- Documentation updates
- Configuration changes
- Performance improvements without API changes
- UI/UX polish without functional changes
- Test additions/fixes

**MINOR (x.Y.0)** - New features (backward compatible):
- New API endpoints
- New frontend features/pages
- New database fields (non-breaking)
- New optional configuration options
- Enhanced existing functionality
- New middleware or services

**MAJOR (X.0.0)** - Breaking changes:
- API endpoint changes that break clients
- Database schema changes requiring migration
- Removal of features or endpoints
- Changes to authentication/authorization flow
- Configuration format changes
- Frontend routing changes that break bookmarks

### When to Suggest Version Bumps
Claude should proactively suggest version bumps and releases when:

1. **After COMPLETION_VERIFICATION passes** for feature sets
2. **After fixing critical bugs** with full test coverage
3. **After major architectural changes** that pass all quality gates
4. **When user requests release preparation**

**Process Integration:**
- Only suggest version bumps AFTER completion verification is successful
- Include completion verification results in version bump suggestion
- Reference tracking document items that were completed
- Use docs/processes/VERSION_MANAGEMENT.md for detailed guidance

### Version Bump Commands
```bash
# Suggest the appropriate command based on changes:
./scripts/version.sh bump patch    # For bug fixes
./scripts/version.sh bump minor    # For new features  
./scripts/version.sh bump major    # For breaking changes

# Or use GitHub Actions for automation:
# Go to Actions → "Version Bump and Release" → Select bump type
```

### Release Communication
When suggesting a version bump, Claude should:
1. **Summarize the changes** that warrant the bump
2. **Suggest the appropriate bump type** with reasoning
3. **Provide the exact command** to run
4. **Mention next steps** (testing, review, deployment)

Example:
> "Completed FEATURE-003: Admin Dashboard with full implementation verification:
> 
> **Completion Status:**
> - ✅ All acceptance criteria met (user management, recipe moderation, analytics)
> - ✅ Test suite passes (unit, integration, E2E)
> - ✅ No regressions detected
> - ✅ Code quality gates passed
> - ✅ Tracking document updated to completed status
> 
> **Changes:** Adds significant new functionality without breaking existing APIs.
> 
> **Suggested release:** `./scripts/version.sh bump minor` (1.2.0 → 1.3.0)
> 
> This will update all version files, generate a changelog, and prepare for deployment to staging."