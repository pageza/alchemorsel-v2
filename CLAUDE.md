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
- **Architecture**: Maintain handler ’ service ’ repository ’ database flow
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