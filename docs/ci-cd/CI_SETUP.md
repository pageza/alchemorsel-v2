# 🔧 CI/CD Pipeline Setup Guide

This document provides comprehensive instructions for setting up the GitHub Actions CI/CD pipeline for the Alchemorsel project.

## 📋 Overview

Our CI/CD pipeline includes:
- ✅ **Backend Testing**: Go unit tests, integration tests, and API testing
- ✅ **Frontend Testing**: Vue.js unit tests, TypeScript checking, and linting
- ✅ **E2E Testing**: Puppeteer-based browser automation tests
- ✅ **Security Scanning**: Dependency vulnerabilities and code security analysis
- ✅ **Code Quality**: SonarCloud analysis and CodeQL scanning
- ✅ **Automated Deployment**: Staging and production deployments
- ✅ **Dependency Management**: Automated dependency updates with Dependabot

## 🔐 Required GitHub Secrets

Before the CI pipeline can run successfully, you need to configure these secrets in your GitHub repository:

### Repository Settings → Secrets and Variables → Actions

#### API Keys & Services
```bash
DEEPSEEK_API_KEY              # DeepSeek API key for LLM services
OPENAI_API_KEY                # OpenAI API key for embeddings
CODECOV_TOKEN                 # Code coverage reporting
SONAR_TOKEN                   # SonarCloud code quality analysis
```

#### AWS Configuration (for S3 profile pictures)
```bash
AWS_ACCESS_KEY_ID             # AWS access key
AWS_SECRET_ACCESS_KEY         # AWS secret key
AWS_REGION                    # AWS region (e.g., us-east-1)
S3_BUCKET_NAME                # S3 bucket for profile pictures
```

#### Staging Environment
```bash
STAGING_TEST_USER_EMAIL       # Test user email for staging E2E tests
STAGING_TEST_USER_PASSWORD    # Test user password for staging E2E tests
KUBE_CONFIG_STAGING           # Base64 encoded kubeconfig for staging (if using Kubernetes)
```

#### Production Environment
```bash
KUBE_CONFIG_PRODUCTION        # Base64 encoded kubeconfig for production (if using Kubernetes)
```

#### Notifications (Optional)
```bash
SLACK_WEBHOOK_URL             # Slack webhook for deployment notifications
DISCORD_WEBHOOK_URL           # Discord webhook for notifications
```

## 🛠️ Setup Instructions

### 1. Enable GitHub Actions

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Actions** → **General**
3. Ensure "Allow all actions and reusable workflows" is selected
4. Save the settings

### 2. Configure Secrets

For each secret listed above:

1. Go to **Settings** → **Secrets and Variables** → **Actions**
2. Click **"New repository secret"**
3. Enter the secret name and value
4. Click **"Add secret"**

### 3. Set Up External Services

#### SonarCloud Setup
1. Go to [SonarCloud.io](https://sonarcloud.io)
2. Sign in with your GitHub account
3. Import your repository
4. Copy the project key and organization from SonarCloud
5. Update `sonar-project.properties` with your values:
   ```properties
   sonar.projectKey=your-project-key
   sonar.organization=your-organization
   ```
6. Generate a SonarCloud token and add it as `SONAR_TOKEN` secret

#### Codecov Setup
1. Go to [Codecov.io](https://codecov.io)
2. Sign in with your GitHub account
3. Add your repository
4. Copy the upload token
5. Add it as `CODECOV_TOKEN` secret

### 4. Configure Branch Protection

1. Go to **Settings** → **Branches**
2. Click **"Add rule"** for your main branch (master/main)
3. Configure these settings:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require linear history
   - Select these status checks:
     - `Backend Tests`
     - `Frontend Tests`
     - `E2E Tests`
     - `PR Validation`
     - `Code Quality Analysis`

## 🚀 Workflow Overview

### Main CI Workflow (`.github/workflows/ci.yml`)

Triggers on:
- Push to `main`, `master`, or `develop` branches
- Pull requests to these branches
- Manual workflow dispatch

**Jobs:**
1. **Backend Tests** - Go unit tests, integration tests, linting
2. **Frontend Tests** - Vue.js unit tests, TypeScript checking, ESLint
3. **E2E Tests** - Puppeteer browser automation (depends on backend/frontend)
4. **Security Scan** - Trivy vulnerability scanning
5. **Performance Tests** - Lighthouse CI (conditional)
6. **Deploy** - Conditional deployment (main branch only)

### PR Checks Workflow (`.github/workflows/pr-checks.yml`)

Triggers on:
- Pull request events (opened, synchronize, reopened)

**Jobs:**
1. **PR Validation** - Title format, sensitive files, commit messages
2. **Dependency Check** - Security vulnerability scanning
3. **Code Quality** - SonarCloud and CodeQL analysis
4. **Performance Impact** - Bundle size analysis (conditional)

### Deployment Workflow (`.github/workflows/deploy.yml`)

Triggers on:
- Push to `main`/`master` branches
- Git tags starting with `v`
- Manual workflow dispatch

**Jobs:**
1. **Build Images** - Docker image building and pushing
2. **Deploy Staging** - Staging environment deployment
3. **Deploy Production** - Production deployment (with approval)
4. **Notify** - Success/failure notifications

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: `go test ./...`
- **Integration Tests**: Database and service integration
- **API Tests**: HTTP endpoint testing
- **Coverage**: Minimum 80% code coverage required

### Frontend Testing
- **Unit Tests**: Vue component testing with Vitest
- **Type Checking**: TypeScript compilation validation
- **Linting**: ESLint with Vue.js best practices
- **Build Tests**: Production build validation

### E2E Testing
- **Browser Automation**: Puppeteer with Chrome headless
- **User Journeys**: Complete workflows from login to recipe management
- **Cross-browser**: Chrome, Firefox support
- **Screenshots**: Failure screenshot capture
- **Retry Logic**: Automatic retry for flaky tests

## 📊 Monitoring & Quality Gates

### Quality Gates
- All tests must pass (100% success rate)
- Code coverage ≥ 80%
- No high/critical security vulnerabilities
- SonarCloud quality gate passed
- Performance budget not exceeded

### Monitoring
- **Test Results**: GitHub Actions summary and artifacts
- **Coverage Reports**: Codecov integration
- **Security**: Trivy and CodeQL scanning results
- **Performance**: Lighthouse CI reports
- **Dependencies**: Dependabot alerts and PRs

## 🔄 Deployment Strategy

### Staging Deployment
- **Trigger**: Push to `develop` branch or manual dispatch
- **Environment**: `staging.alchemorsel.com`
- **Strategy**: Rolling deployment
- **Tests**: Smoke tests + E2E validation

### Production Deployment
- **Trigger**: Push to `main`/`master` or tagged release
- **Environment**: `alchemorsel.com`
- **Strategy**: Blue-green deployment
- **Approval**: Manual approval required
- **Rollback**: Automatic rollback on health check failure

## 🚨 Troubleshooting

### Common Issues

#### Tests Failing
1. Check test logs in GitHub Actions
2. Verify all secrets are configured
3. Ensure database services are healthy
4. Check for environment-specific issues

#### Deployment Failures
1. Verify Kubernetes credentials
2. Check resource quotas and limits
3. Validate environment variables
4. Review health check endpoints

#### Security Scan Failures
1. Update vulnerable dependencies
2. Fix code security issues reported by CodeQL
3. Address Trivy container vulnerabilities

### Debug Commands

```bash
# Run tests locally
cd backend && make test
cd frontend && npm run test:unit
cd ui-tests && npm test

# Check dependencies
cd frontend && npm audit
cd backend && govulncheck ./...

# Lint code
cd backend && make lint
cd frontend && npm run lint
```

## 📈 Performance Optimization

### CI Performance
- **Caching**: Node.js and Go module caching enabled
- **Parallel Jobs**: Tests run in parallel when possible
- **Artifact Reuse**: Build artifacts shared between jobs
- **Matrix Strategy**: Multiple Node.js/Go versions tested

### Test Performance
- **Database**: Testcontainers for isolated testing
- **Browser**: Headless Chrome with optimized flags
- **Retries**: Smart retry logic for flaky tests
- **Cleanup**: Automatic resource cleanup

## 🔧 Customization

### Adding New Tests
1. Add test files following naming conventions
2. Update workflow files if needed
3. Configure any new environment variables
4. Update documentation

### Environment Variables
Update workflows and add new secrets as needed:
```yaml
env:
  NEW_VARIABLE: ${{ secrets.NEW_SECRET }}
```

### Notification Channels
Configure additional notification channels in the deploy workflow:
```yaml
- name: Notify Teams
  run: |
    curl -X POST -H "Content-Type: application/json" \
      -d '{"text":"Deployment completed"}' \
      ${{ secrets.TEAMS_WEBHOOK_URL }}
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [Codecov Documentation](https://docs.codecov.com/)
- [Trivy Security Scanner](https://trivy.dev/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

---

**🎉 Congratulations!** Your CI/CD pipeline is now configured for comprehensive testing, security scanning, and automated deployment of the Alchemorsel application.