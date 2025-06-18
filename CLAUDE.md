# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Development Guidelines

### Scope and Changes
- Stay strictly within requested scope; no unrequested refactoring
- Only rewrite what is absolutely necessary
- Preserve existing file/folder structure
- Explain proposed changes before editing

### Code Quality
- **Architecture**: Maintain handler � service � repository � database flow
- **API Contracts**: Preserve public API interfaces unless explicitly approved
- **Documentation**: Always preserve comments and docstrings
- **Testing**: Generate tests for bug fixes; suggest tests before implementing logic

### Dependencies
- **Backend**: Go 1.23+, use existing libraries (Gin, GORM, etc.)
- **Frontend**: Require approval for new npm packages
- **No new patterns**: Require consent for introducing new architectural patterns

### Naming Conventions
- **Go**: PascalCase for exported, camelCase for unexported
- **Vue/TS**: camelCase for variables/functions, PascalCase for components
- **Tests**: descriptive names following existing patterns

### Security
- Environment variables via Docker secrets
- JWT authentication required for protected routes
- Never commit sensitive information

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
- Integration tests use testcontainers for database testing

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

1. **After completing a logical feature set** (e.g., "This completes the admin dashboard feature - suggest: `./scripts/version.sh bump minor`")

2. **After fixing critical bugs** (e.g., "Fixed authentication vulnerability - suggest: `./scripts/version.sh bump patch`")

3. **After major architectural changes** (e.g., "Migrated to new authentication system - suggest: `./scripts/version.sh bump major`")

4. **When user requests release preparation** (e.g., user says "prepare for release" - suggest appropriate bump)

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
> "The admin dashboard feature is now complete with user management, recipe moderation, and analytics. This adds significant new functionality without breaking existing APIs.
> 
> **Suggested release:** `./scripts/version.sh bump minor` (1.2.0 → 1.3.0)
> 
> This will update all version files, generate a changelog, and prepare for deployment to staging."