# Comprehensive CI/CD Setup for Alchemorsel

## 🛡️ Quality Protection Strategy

This document outlines our multi-layered quality protection strategy designed to prevent any issues from reaching production.

## 🏗️ Protection Layers

### Layer 1: Local Development Protection

**Pre-commit Hooks** (`.pre-commit-config.yaml`)
- ✅ Code formatting (Go fmt, Prettier)
- ✅ Linting (golangci-lint, ESLint)
- ✅ Type checking (TypeScript)
- ✅ Unit tests execution
- ✅ Security scanning (detect-secrets)
- ✅ Version consistency checks

**Pre-push Hooks**
- ✅ Comprehensive test suite execution
- ✅ Integration tests
- ✅ Protected branch validation

**Setup Command:**
```bash
./scripts/setup-local-dev.sh
```

### Layer 2: Pull Request Protection

**Strict CI Pipeline** (`.github/workflows/strict-ci.yml`)
- ✅ Quality gates enforcement
- ✅ Code coverage thresholds (80% minimum)
- ✅ Security vulnerability scanning
- ✅ SonarCloud analysis
- ✅ Bundle size validation
- ✅ Integration test execution

**Required Checks:**
- All unit tests must pass
- Code coverage ≥ 80%
- No high/critical security vulnerabilities
- SonarCloud quality gate passed
- All linting rules satisfied

### Layer 3: Continuous Integration

**Main CI Pipeline** (`.github/workflows/ci.yml`)
- ✅ Multi-environment testing
- ✅ Cross-platform compatibility
- ✅ Performance benchmarking
- ✅ E2E test execution
- ✅ Build artifact generation

### Layer 4: Continuous Deployment

**Deployment Pipeline** (`.github/workflows/deploy.yml`)
- ✅ Docker image building and pushing to Docker Hub
- ✅ Semantic versioning
- ✅ Blue-green deployment strategy
- ✅ Automated rollback on failure
- ✅ Production smoke tests

## 🐳 Docker Hub vs GitHub Container Registry

### Docker Hub (✅ Selected)
**Pros:**
- Industry standard, universal access
- Better for public distribution
- Established ecosystem and tooling
- Familiar to most developers
- Better integration with deployment tools

**Cons:**
- Rate limits on free tier (100 pulls/6h for anonymous, 200/6h for authenticated)
- Requires separate authentication from GitHub
- Additional cost for private repositories

### GitHub Container Registry (Alternative)
**Pros:**
- Seamless GitHub integration
- Free for public repositories
- No rate limits for GitHub Actions
- OCI-compliant

**Cons:**
- Newer service, less established
- Requires GitHub authentication
- Less universal than Docker Hub

## 🔧 Setup Instructions

### 1. Local Development Setup

```bash
# Install pre-commit hooks and development environment
./scripts/setup-local-dev.sh

# Run quality checks manually
./scripts/quality-check.sh
```

### 2. GitHub Secrets Configuration

Required secrets for CI/CD:

```
# Docker Hub
DOCKERHUB_TOKEN=<your-docker-hub-access-token>

# SonarCloud
SONAR_TOKEN=<your-sonarcloud-token>

# Code Coverage - using local coverage tracking instead of Codecov

# API Keys (for testing)
DEEPSEEK_API_KEY=<test-api-key>
OPENAI_API_KEY=<test-api-key>

# AWS (for testing)
AWS_ACCESS_KEY_ID=<test-access-key>
AWS_SECRET_ACCESS_KEY=<test-secret-key>
AWS_REGION=us-west-2
S3_BUCKET_NAME=<test-bucket>

# Test Users
STAGING_TEST_USER_EMAIL=test@alchemorsel.com
STAGING_TEST_USER_PASSWORD=TestPassword123
```

### 3. SonarCloud Setup

1. Connect your repository to SonarCloud
2. Configure project key: `alchemorsel-v2`
3. Set organization: `pageza`
4. Configure quality gate thresholds in `sonar-project.properties`

### 4. Branch Protection Rules

Configure these rules in GitHub repository settings:

**master/main branch:**
- ✅ Require pull request reviews (2 reviewers)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ✅ Restrict pushes to administrators only

**Required Status Checks:**
- `quality-gates`
- `backend-quality`
- `frontend-quality`
- `sonarcloud`
- `security-scans`
- `integration-tests`

## 🚀 Deployment Process

### Automatic Deployment
1. **Push to master/main** → Triggers deployment pipeline
2. **Quality gates pass** → Docker images built and pushed
3. **Staging deployment** → Automatic deployment to staging
4. **Staging tests pass** → Production deployment approved
5. **Production deployment** → Blue-green deployment strategy
6. **Smoke tests pass** → Traffic switched to new version

### Manual Deployment
```bash
# Trigger deployment workflow manually
gh workflow run deploy.yml -f environment=production -f force_deploy=false
```

### Emergency Rollback
```bash
# Quick rollback to previous version
kubectl rollout undo deployment/alchemorsel-backend -n production
kubectl rollout undo deployment/alchemorsel-frontend -n production
```

## 📊 Quality Metrics & Monitoring

### Coverage Requirements
- **Backend:** Minimum 80% line coverage
- **Frontend:** Minimum 80% line coverage
- **Integration:** Minimum 70% path coverage

### Performance Thresholds
- **Bundle Size:** Maximum 2MB for frontend
- **Build Time:** Maximum 10 minutes for full pipeline
- **Test Execution:** Maximum 5 minutes per test suite

### Security Standards
- **Vulnerabilities:** Zero high/critical vulnerabilities allowed
- **Dependencies:** Monthly security audits
- **Secrets:** Automated secret detection on every commit

## 🔍 Monitoring & Alerts

### GitHub Actions Monitoring
- Build success/failure notifications
- Performance regression alerts
- Security vulnerability alerts

### Production Monitoring
- Health check endpoints
- Error rate monitoring
- Performance metrics
- Uptime monitoring

## 🛠️ Troubleshooting

### Common Issues

**Pre-commit hooks failing:**
```bash
# Update hooks
pre-commit autoupdate
pre-commit run --all-files
```

**Coverage below threshold:**
```bash
# Check coverage details
cd backend && go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

**Docker build failures:**
```bash
# Test locally
docker build -t test-backend ./backend
docker build -t test-frontend ./frontend
```

**SonarCloud integration issues:**
```bash
# Validate sonar configuration
sonar-scanner -Dsonar.verbose=true
```

### Emergency Procedures

**Pipeline Failure:**
1. Check GitHub Actions logs
2. Run `./scripts/quality-check.sh` locally
3. Fix issues and re-run pipeline
4. Contact team if critical production issue

**Production Issues:**
1. Immediate rollback if needed
2. Check application logs
3. Verify infrastructure health
4. Apply hotfix through emergency process

## 📈 Continuous Improvement

### Monthly Reviews
- Pipeline performance analysis
- Quality metrics review
- Security posture assessment
- Developer experience feedback

### Quarterly Updates
- Dependency updates
- Tool version upgrades
- Process optimization
- Team training

---

## 🎯 Success Metrics

**Quality Improvements:**
- ✅ 99%+ pipeline success rate
- ✅ < 1 hour from PR to merge
- ✅ Zero production incidents from quality issues
- ✅ 80%+ code coverage maintained

**Developer Experience:**
- ✅ < 10 minutes local test execution
- ✅ Clear error messages and feedback
- ✅ Automated fixing where possible
- ✅ Comprehensive documentation