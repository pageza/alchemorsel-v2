# Backend Documentation Index

**Version**: 1.3.0  
**Last Updated**: 2025-06-27  
**Framework**: Go + Gin + PostgreSQL + Redis

## Documentation Structure

### 🌐 API Endpoints
RESTful API documentation:

#### Authentication Endpoints
- [POST /api/v1/auth/register](./endpoints/auth/register.md) - User registration
- [POST /api/v1/auth/login](./endpoints/auth/login.md) - User login
- [POST /api/v1/auth/verify-email](./endpoints/auth/verify-email.md) - Email verification
- [POST /api/v1/auth/forgot-password](./endpoints/auth/forgot-password.md) - Password reset request
- [POST /api/v1/auth/reset-password](./endpoints/auth/reset-password.md) - Password reset

#### Recipe Endpoints
- [GET /api/v1/recipes](./endpoints/recipes/list.md) - List/search recipes
- [GET /api/v1/recipes/:id](./endpoints/recipes/get.md) - Get recipe details
- [POST /api/v1/recipes](./endpoints/recipes/create.md) - Create recipe
- [PUT /api/v1/recipes/:id](./endpoints/recipes/update.md) - Update recipe
- [DELETE /api/v1/recipes/:id](./endpoints/recipes/delete.md) - Delete recipe

#### Recipe Interaction Endpoints
- [POST /api/v1/recipes/:id/favorite](./endpoints/recipes/favorite.md) - Add to favorites
- [DELETE /api/v1/recipes/:id/favorite](./endpoints/recipes/unfavorite.md) - Remove from favorites
- [GET /api/v1/recipes/similar](./endpoints/recipes/similar.md) - Find similar recipes

#### LLM/AI Endpoints
- [POST /api/v1/llm/query](./endpoints/llm/query.md) - AI recipe generation

#### Profile Endpoints
- [GET /api/v1/profile](./endpoints/profile/get.md) - Get user profile
- [PUT /api/v1/profile](./endpoints/profile/update.md) - Update user profile
- [POST /api/v1/profile/picture](./endpoints/profile/upload-picture.md) - Upload profile picture

#### Admin Endpoints
- [GET /api/v1/admin/users](./endpoints/admin/users.md) - User management
- [GET /api/v1/admin/recipes](./endpoints/admin/recipes.md) - Recipe moderation
- [GET /api/v1/admin/analytics](./endpoints/admin/analytics.md) - Platform analytics

#### Feedback Endpoints
- [POST /api/v1/feedback](./endpoints/feedback/create.md) - Submit user feedback

### 🏗️ Services
Business logic layer:

#### Core Services
- [Auth Service](./services/auth.md) - Authentication and authorization
- [Recipe Service](./services/recipe.md) - Recipe management
- [LLM Service](./services/llm.md) - AI integration
- [Profile Service](./services/profile.md) - User profile management
- [Email Service](./services/email.md) - Email operations
- [Embedding Service](./services/embedding.md) - Vector embeddings

#### Support Services
- [Feedback Service](./services/feedback.md) - User feedback handling
- [Analytics Service](./services/analytics.md) - Platform analytics
- [Storage Service](./services/storage.md) - File storage (S3)

### 🗄️ Models
Data models and database schema:

#### Core Models
- [User Model](./models/user.md) - User account data
- [UserProfile Model](./models/user-profile.md) - User profile information
- [Recipe Model](./models/recipe.md) - Recipe data with embeddings
- [RecipeFavorite Model](./models/recipe-favorite.md) - User recipe favorites

#### Dietary Models
- [DietaryPreference Model](./models/dietary-preference.md) - Dietary preferences
- [Allergen Model](./models/allergen.md) - Allergen information

#### Support Models
- [Feedback Model](./models/feedback.md) - User feedback
- [EmailVerification Model](./models/email-verification.md) - Email verification tokens

### 🔧 Infrastructure
System architecture and utilities:

#### Database
- [Database Configuration](./database/config.md) - PostgreSQL setup
- [Migrations](./database/migrations.md) - Database schema evolution
- [pgvector Integration](./database/pgvector.md) - Vector database setup
- [Redis Configuration](./database/redis.md) - Cache and session storage

#### Middleware
- [Auth Middleware](./middleware/auth.md) - JWT authentication
- [CORS Middleware](./middleware/cors.md) - Cross-origin requests
- [Rate Limiting](./middleware/rate-limit.md) - API rate limiting
- [Error Handling](./middleware/error.md) - Global error handling
- [Email Verification Middleware](./middleware/email-verification.md) - Email verification checks

#### Configuration
- [Environment Configuration](./config/environment.md) - Environment variables
- [Secrets Management](./config/secrets.md) - Secure configuration
- [Storage Configuration](./config/storage.md) - AWS S3 setup
- [Email Configuration](./config/email.md) - SMTP configuration

### 🤖 AI Integration
LLM and embedding systems:

#### LLM Integration
- [DeepSeek Integration](./ai/deepseek.md) - DeepSeek API integration
- [OpenAI Integration](./ai/openai.md) - OpenAI API integration
- [Recipe Generation](./ai/recipe-generation.md) - AI recipe creation
- [Nutrition Calculation](./ai/nutrition.md) - AI nutrition analysis

#### Vector Embeddings
- [Embedding Generation](./ai/embeddings.md) - Recipe embedding creation
- [Similarity Search](./ai/similarity.md) - Vector-based recipe matching
- [pgvector Optimization](./ai/pgvector-optimization.md) - Vector database tuning

#### Safety & Quality
- [Dietary Safety Rules](./ai/dietary-safety.md) - AI safety guidelines
- [Content Moderation](./ai/moderation.md) - AI content filtering
- [Quality Assurance](./ai/quality.md) - AI output validation

### 🔐 Security
Security implementation:

#### Authentication & Authorization
- [JWT Implementation](./security/jwt.md) - Token-based authentication
- [Password Security](./security/passwords.md) - Password hashing and policies
- [Session Management](./security/sessions.md) - User session handling

#### API Security
- [Input Validation](./security/validation.md) - Request validation
- [SQL Injection Prevention](./security/sql-injection.md) - Database security
- [XSS Prevention](./security/xss.md) - Cross-site scripting protection
- [CSRF Protection](./security/csrf.md) - Cross-site request forgery

#### Data Protection
- [Data Encryption](./security/encryption.md) - Data at rest encryption
- [Secrets Management](./security/secrets.md) - Secure credential storage
- [Audit Logging](./security/audit.md) - Security event logging

### 📊 Monitoring & Observability
System monitoring and debugging:

#### Logging
- [Application Logging](./monitoring/logging.md) - Structured logging
- [Error Tracking](./monitoring/errors.md) - Error monitoring
- [Performance Logging](./monitoring/performance.md) - Performance metrics

#### Metrics
- [API Metrics](./monitoring/api-metrics.md) - Endpoint performance
- [Database Metrics](./monitoring/database-metrics.md) - Database performance
- [Business Metrics](./monitoring/business-metrics.md) - Application metrics

#### Health Checks
- [Health Endpoints](./monitoring/health.md) - System health monitoring
- [Database Health](./monitoring/database-health.md) - Database connectivity
- [External Service Health](./monitoring/external-health.md) - Third-party services

### 🧪 Testing
Backend testing strategy:

#### Test Types
- [Unit Tests](./testing/unit-tests.md) - Service and handler tests
- [Integration Tests](./testing/integration-tests.md) - Database integration
- [API Tests](./testing/api-tests.md) - Endpoint testing
- [Load Tests](./testing/load-tests.md) - Performance testing

#### Test Infrastructure
- [Test Database](./testing/test-database.md) - Test database setup
- [Test Utilities](./testing/utilities.md) - Testing helpers
- [Mock Services](./testing/mocks.md) - Service mocking

## Architecture Overview

### Clean Architecture Layers
```
┌─────────────────────────────────────┐
│              HTTP Layer             │  ← API handlers, middleware
├─────────────────────────────────────┤
│            Service Layer            │  ← Business logic
├─────────────────────────────────────┤
│           Repository Layer          │  ← Data access (future)
├─────────────────────────────────────┤
│            Database Layer           │  ← PostgreSQL + Redis
└─────────────────────────────────────┘
```

### Directory Structure
```
backend/
├── cmd/                 # Application entry points
│   ├── api/            # Main API server
│   ├── migrate/        # Database migration tool
│   └── seed_*/         # Database seeding tools
├── internal/           # Private application code
│   ├── api/           # HTTP handlers and routes
│   ├── service/       # Business logic layer
│   ├── models/        # Data models
│   ├── database/      # Database utilities
│   ├── middleware/    # HTTP middleware
│   └── server/        # Server setup
├── migrations/         # Database migrations
├── config/            # Configuration management
└── scripts/           # Utility scripts
```

### Technology Stack
- **Language**: Go 1.23+
- **Web Framework**: Gin
- **Database**: PostgreSQL 15+ with pgvector
- **Cache**: Redis 7+
- **ORM**: GORM
- **Authentication**: JWT tokens
- **File Storage**: AWS S3
- **AI Integration**: DeepSeek/OpenAI APIs
- **Email**: SMTP (Gmail)

### Development Commands
```bash
# Run development server
make run

# Run tests
make test

# Run with hot reload
make dev

# Build binary
make build

# Database migrations
make migrate

# Lint code
make lint
```

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=alchemorsel

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Services
DEEPSEEK_API_KEY=your_key
OPENAI_API_KEY=your_key

# AWS S3
AWS_REGION=us-east-1
S3_BUCKET_NAME=alchemorsel-assets

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_password

# Security
JWT_SECRET=your_jwt_secret
```

## Quick Start Guide

### Development Setup
1. Install Go 1.23+
2. Install PostgreSQL with pgvector
3. Install Redis
4. Clone repository and install dependencies:
   ```bash
   cd backend
   go mod download
   ```
5. Set up environment variables
6. Run migrations: `make migrate`
7. Start server: `make run`

### API Testing
- Swagger documentation: `http://localhost:8080/swagger`
- Health check: `http://localhost:8080/health`
- API base URL: `http://localhost:8080/api/v1`

### Database Setup
1. Create PostgreSQL database
2. Enable pgvector extension
3. Run migrations to create tables
4. Optional: Seed test data

## Related Documentation
- [Frontend Documentation](../frontend/README.md)
- [Deployment Guide](../ci-cd/deployment.md)
- [API Reference](./api/openapi.yaml)
- [Project Architecture](../PROJECT_STRUCTURE.md)