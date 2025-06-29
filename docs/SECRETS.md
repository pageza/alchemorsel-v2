# 🔐 Alchemorsel Secrets & Environment Variables

This document describes all the secrets and environment variables required by the Alchemorsel application. **DO NOT** commit actual secret values to this file or any other file in the repository.

## 📋 Required Environment Variables

### 🗄️ Database Configuration
- **`DB_HOST`** - PostgreSQL database host (e.g., `postgres` for Docker, `localhost` for local)
- **`DB_USER`** - PostgreSQL database username
- **`DB_PASSWORD`** - PostgreSQL database password
- **`DB_NAME`** - PostgreSQL database name
- **`DB_PORT`** - PostgreSQL database port (default: 5432)
- **`DB_SSLMODE`** - PostgreSQL SSL mode (default: `disable` for development)

### 🔐 Authentication & Security
- **`JWT_SECRET`** - Secret key for JWT token generation and validation (use a strong, random string)
- **`APP_SECRET`** - Application secret for general encryption needs
- **`SESSION_SECRET`** - Secret key for session management

### 🤖 AI/LLM Integration
- **`DEEPSEEK_API_KEY`** - API key for DeepSeek LLM service (for recipe generation)
- **`OPENAI_API_KEY`** - API key for OpenAI services (for DALL-E 3 image generation)
- **`LLM_API_URL`** - Base URL for LLM API (default: `https://api.deepseek.com`)
- **`OPENAI_API_URL`** - Base URL for OpenAI API (default: `https://api.openai.com`)

### 📧 Email Service (Gmail SMTP)
- **`SMTP_HOST`** - SMTP server host (e.g., `smtp.gmail.com`)
- **`SMTP_PORT`** - SMTP server port (e.g., `587` for TLS)
- **`SMTP_USERNAME`** - Gmail email address for sending emails
- **`SMTP_PASSWORD`** - Gmail app-specific password (NOT regular password)
- **`SMTP_FROM`** - From email address (usually same as SMTP_USERNAME)
- **`SMTP_FROM_NAME`** - Display name for sent emails (e.g., `Alchemorsel`)

### ☁️ AWS S3 Storage
- **`AWS_ACCESS_KEY_ID`** - AWS access key for S3 operations
- **`AWS_SECRET_ACCESS_KEY`** - AWS secret access key
- **`AWS_REGION`** - AWS region for S3 bucket (e.g., `us-east-1`)
- **`S3_BUCKET_NAME`** - S3 bucket name for storing images
- **`S3_ENDPOINT`** - Custom S3 endpoint (optional, for S3-compatible services)

### 🔄 Redis Cache
- **`REDIS_HOST`** - Redis server host (e.g., `redis` for Docker, `localhost` for local)
- **`REDIS_PORT`** - Redis server port (default: 6379)
- **`REDIS_PASSWORD`** - Redis password (optional, if Redis requires authentication)
- **`REDIS_DB`** - Redis database number (default: 0)

### 🌐 Application Configuration
- **`APP_ENV`** - Application environment (`development`, `staging`, `production`)
- **`API_PORT`** - Backend API server port (default: 8080)
- **`FRONTEND_URL`** - Frontend application URL (for CORS and email links)
- **`BACKEND_URL`** - Backend API URL (for frontend API calls)
- **`APP_NAME`** - Application name (default: `Alchemorsel`)

### 📊 Monitoring & Analytics (Optional)
- **`SENTRY_DSN`** - Sentry error tracking DSN (optional)
- **`OTEL_EXPORTER_OTLP_ENDPOINT`** - OpenTelemetry endpoint (optional)
- **`LOG_LEVEL`** - Application log level (`debug`, `info`, `warn`, `error`)

## 📁 Secret Files in `/secrets` Directory

The application expects these files to be present in the `/secrets` directory when running with Docker:

### Required Files
1. **`db_password.txt`** - PostgreSQL database password
2. **`jwt_secret.txt`** - JWT secret key
3. **`deepseek_api_key.txt`** - DeepSeek API key
4. **`openai_api_key.txt`** - OpenAI API key for DALL-E 3
5. **`smtp_password.txt`** - Gmail app-specific password
6. **`aws_access_key_id.txt`** - AWS access key
7. **`aws_secret_access_key.txt`** - AWS secret key

### Optional Files
8. **`redis_password.txt`** - Redis password (if authentication enabled)
9. **`sentry_dsn.txt`** - Sentry DSN (if error tracking enabled)

## 🐳 Docker Compose Configuration

The `docker-compose.yml` file reads secrets from the `/secrets` directory and injects them as environment variables. Example structure:

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  # ... other secrets

services:
  backend:
    secrets:
      - db_password
      - jwt_secret
      # ... other secrets
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret
      # ... other environment variables
```

## 🔒 Security Best Practices

1. **Never commit secrets** to version control
2. **Use strong, random values** for all secrets
3. **Rotate secrets regularly** in production
4. **Use different secrets** for each environment
5. **Restrict access** to secret files and environment variables
6. **Use app-specific passwords** for Gmail (not regular passwords)
7. **Enable 2FA** on all service accounts (AWS, Gmail, etc.)

## 🚀 Setting Up Secrets

### Development Environment
1. Create a `/secrets` directory in the project root
2. Add each secret as a text file with the appropriate name
3. Ensure proper file permissions (readable by Docker)

### Production Environment
1. Use a secure secret management service (AWS Secrets Manager, HashiCorp Vault, etc.)
2. Inject secrets through environment variables or mounted volumes
3. Never store production secrets on developer machines

## 📝 Example Secret Generation

### Generate JWT Secret
```bash
openssl rand -base64 32 > secrets/jwt_secret.txt
```

### Generate App Secret
```bash
openssl rand -hex 32 > secrets/app_secret.txt
```

## ⚠️ Important Notes

- Gmail SMTP requires an **app-specific password**, not your regular Gmail password
- AWS credentials should have **minimal required permissions** (S3 read/write only)
- Database passwords should be **strong and unique**
- API keys should be **kept confidential** and regenerated if compromised
- All production secrets should be **different from development secrets**

---

**Last Updated**: 2025-06-29  
**Security Contact**: admin@alchemorsel.com