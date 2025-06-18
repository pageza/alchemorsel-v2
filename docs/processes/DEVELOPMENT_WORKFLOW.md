# 🔄 Development Workflow Process

**Standard development process for Alchemorsel - from issue to production**

## 🎯 **Overview**

This document defines the step-by-step process for implementing changes to Alchemorsel, ensuring quality, testing, and proper CI/CD integration.

## 📋 **Process Flow**

```
Issue Identification → Branch Creation → Write Tests → Code Implementation 
→ Local Testing → Code Review → CI Pipeline → Merge → Monitor
```

---

## 🚀 **Step-by-Step Workflow**

### **Step 1: Issue Identification & Planning** 📝

#### **For Bugs** 🐛
1. **Check existing issues** in `project-docs/tracking/BUGS.md`
2. **Create new bug entry** if not exists:
   - Assign unique ID (BUG-XXX)
   - Set priority (Critical/High/Medium/Low)
   - Document reproduction steps
   - Define acceptance criteria
3. **Update status** to "🔄 Active"

#### **For Features** 🚀
1. **Check existing features** in `project-docs/tracking/FEATURES.md`
2. **Create new feature entry** if not exists:
   - Assign unique ID (FEATURE-XXX)
   - Set priority and MVP classification
   - Document requirements and user stories
   - Define acceptance criteria
3. **Update status** to "📋 Planning"

#### **For Patches** 🩹
1. **Check existing patches** in `project-docs/tracking/PATCHES.md`
2. **Create new patch entry** for quick fixes:
   - Assign unique ID (PATCH-XXX)
   - Ensure scope is < 4 hours
   - Document minimal requirements
3. **Update status** to "🔄 Ready"

### **Step 2: Branch Creation** 🌿

```bash
# Ensure you're on main branch and up to date
git checkout main
git pull origin main

# Create new branch with descriptive name
git checkout -b type/issue-id-brief-description

# Examples:
git checkout -b bug/profile-edit-form-broken
git checkout -b feature/recipe-image-generation
git checkout -b patch/welcome-message-personalization
```

**Branch Naming Convention:**
- `bug/bug-id-description` - Bug fixes
- `feature/feature-id-description` - New features  
- `patch/patch-id-description` - Quick fixes
- `improve/improve-id-description` - Infrastructure improvements
- `hotfix/critical-issue-description` - Critical production fixes

### **Step 3: Write Tests First** 🧪

**⚠️ CRITICAL: Always write tests before implementation code**

#### **For Backend Changes:**
```bash
# Create/update unit tests
touch backend/internal/service/service_name_test.go

# Create/update integration tests  
touch backend/internal/api/endpoint_name_test.go

# Example test structure:
func TestFeatureFunction(t *testing.T) {
    // Arrange: Set up test data
    // Act: Execute the function
    // Assert: Verify expected outcomes
}
```

#### **For Frontend Changes:**
```bash
# Create/update component tests
touch frontend/src/components/ComponentName.test.ts

# Create/update E2E tests
touch ui-tests/specs/feature-name.spec.ts

# Example component test:
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

#### **Test Requirements:**
- [ ] **Unit tests** for all new functions/methods
- [ ] **Integration tests** for API endpoints
- [ ] **Component tests** for UI components
- [ ] **E2E tests** for complete user workflows
- [ ] **Edge case testing** for error conditions

### **Step 4: Run Tests (Expecting Failure)** ❌

```bash
# Backend tests
cd backend
make test

# Frontend tests  
cd frontend
npm run test:unit

# E2E tests
npm run test:e2e

# Expected Result: Tests should FAIL initially
# This confirms tests are actually testing the new functionality
```

### **Step 5: Implement Code Changes** 💻

#### **Implementation Guidelines:**
- [ ] **Minimal changes** - only modify what's necessary
- [ ] **Follow existing patterns** - maintain consistency
- [ ] **Add proper error handling**
- [ ] **Include logging where appropriate**
- [ ] **Update documentation** if APIs change
- [ ] **Follow security best practices**

#### **Code Quality Checklist:**
- [ ] **No hardcoded values** - use configuration
- [ ] **Proper TypeScript types** in frontend
- [ ] **Go error handling** in backend
- [ ] **Consistent naming conventions**
- [ ] **Comments for complex logic**
- [ ] **No console.log statements** in production code

### **Step 6: Local Testing Cycle** 🔄

#### **6.1 Run Tests After Implementation**
```bash
# Backend tests
cd backend
make test

# Frontend tests
cd frontend  
npm run test:unit
npm run type-check

# Linting
npm run lint

# Expected Result: All tests should PASS
```

#### **6.2 Manual Testing**
```bash
# Start local development environment
docker-compose up

# Test the specific functionality:
# 1. Navigate to affected features
# 2. Test normal use cases
# 3. Test edge cases and error conditions
# 4. Verify acceptance criteria are met
```

#### **6.3 Iteration Loop**
```
🔄 If tests fail or manual testing reveals issues:
   1. Fix the code
   2. Re-run tests
   3. Repeat until all tests pass AND manual testing succeeds
```

### **Step 7: Pre-Commit Validation** ✅

```bash
# Final validation before committing
cd backend
make lint      # Go linting
make test      # All backend tests

cd frontend
npm run lint   # ESLint
npm run type-check  # TypeScript validation
npm run test:unit   # Unit tests
npm run build  # Production build test

# E2E tests (if applicable to your changes)
npm run test:e2e
```

**All checks must pass before proceeding!**

### **Step 8: Commit & Push** 📤

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "type: brief description

- Detailed change 1
- Detailed change 2  
- Fixes: #issue-id

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote branch
git push origin branch-name
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `patch:` - Small improvements
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `docs:` - Documentation updates

### **Step 9: Create Pull Request** 🔀

```bash
# Create PR using GitHub CLI (if available)
gh pr create --title "Type: Brief Description" --body "
## Summary
- Brief description of changes
- Links to related issues/tracking

## Test Plan
- [ ] Unit tests pass
- [ ] Integration tests pass  
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project conventions
- [ ] Tests written and passing
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or documented)

🤖 Generated with [Claude Code](https://claude.ai/code)
"
```

**PR Requirements:**
- [ ] **Descriptive title and description**
- [ ] **Link to tracking issue** (BUG-XXX, FEATURE-XXX, etc.)
- [ ] **Test plan documented**
- [ ] **Screenshots** for UI changes
- [ ] **Breaking changes** documented

### **Step 10: CI Pipeline Monitoring** 🔍

#### **Monitor CI Execution:**
1. **Check GitHub Actions** status immediately after PR creation
2. **Review test results** in CI logs
3. **Monitor for any failures** or warnings

#### **If CI Fails:** ❌
```bash
# 1. Review CI logs to identify failure
# 2. Fix issues locally
# 3. Run failed tests locally to verify fix
# 4. Commit and push fixes
# 5. Monitor CI again until passing
```

#### **CI Success Criteria:** ✅
- [ ] **All unit tests pass**
- [ ] **All integration tests pass**
- [ ] **Linting passes** (frontend & backend)
- [ ] **Type checking passes** (TypeScript)
- [ ] **Build succeeds** for production
- [ ] **Security scans pass**
- [ ] **No critical vulnerabilities**

### **Step 11: Code Review Process** 👥

#### **Self-Review Checklist:**
- [ ] **Review your own PR** before requesting review
- [ ] **Check diff** for unintended changes
- [ ] **Verify tests are included**
- [ ] **Confirm CI is passing**

#### **Addressing Review Feedback:**
```bash
# Make requested changes
# Commit additional fixes
git commit -m "address review feedback: specific changes"
git push origin branch-name

# CI will automatically re-run
```

### **Step 12: Merge & Cleanup** 🎉

#### **After PR Approval:**
1. **Ensure CI is passing** on latest commit
2. **Squash and merge** (preferred) or merge commit
3. **Delete feature branch** after merge
4. **Update tracking documentation**

```bash
# After merge, clean up local branches
git checkout main
git pull origin main
git branch -d branch-name
```

#### **Update Tracking Documentation:**
1. **Update status** in tracking files:
   - `BUGS.md`: Change status to "✅ Resolved"
   - `FEATURES.md`: Change status to "✅ Complete"  
   - `PATCHES.md`: Change status to "✅ Complete"
2. **Add completion date**
3. **Note any follow-up work needed**

### **Step 13: Production Monitoring** 📊

#### **Post-Deployment Verification:**
- [ ] **Monitor error rates** for 24 hours after deployment
- [ ] **Check application logs** for new errors
- [ ] **Verify feature works** in production environment
- [ ] **Monitor performance metrics**

#### **If Issues Arise:**
1. **Create hotfix branch** if critical
2. **Follow abbreviated process** for urgent fixes
3. **Document lessons learned**

---

## 🚨 **Special Workflows**

### **Hotfix Process** 🔥
For critical production issues:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-description

# 2. Implement minimal fix
# 3. Test thoroughly but quickly
# 4. Create PR with "HOTFIX" label
# 5. Request immediate review
# 6. Deploy as soon as CI passes
```

### **Feature Flag Workflow** 🏳️
For large features requiring gradual rollout:

```bash
# 1. Implement feature behind feature flag
# 2. Deploy with flag disabled
# 3. Enable for testing/staging
# 4. Gradually enable for production users
# 5. Remove flag after full rollout
```

---

## 📊 **Quality Gates**

### **Required for All Changes:**
- [ ] Tests written and passing locally
- [ ] Code review approved
- [ ] CI pipeline passes completely
- [ ] No new security vulnerabilities
- [ ] Documentation updated (if needed)

### **Additional for Features:**
- [ ] E2E tests cover new functionality
- [ ] Performance impact assessed
- [ ] Accessibility considerations addressed
- [ ] Mobile compatibility verified

### **Additional for Bug Fixes:**
- [ ] Root cause identified and documented
- [ ] Regression tests added
- [ ] Related code areas reviewed
- [ ] Verification in production-like environment

---

## 🔧 **Tools & Commands Reference**

### **Backend Development:**
```bash
make run          # Start development server
make test         # Run all tests
make lint         # Run linting
make build        # Build for production
make dev          # Hot reload development
```

### **Frontend Development:**
```bash
npm run dev       # Start development server
npm run test:unit # Run unit tests
npm run test:e2e  # Run E2E tests
npm run lint      # Run ESLint
npm run type-check # TypeScript checking
npm run build     # Build for production
```

### **Full Stack:**
```bash
docker-compose up # Start all services
docker-compose down # Stop all services
docker-compose logs # View logs
```

---

**This workflow ensures quality, consistency, and reliability in all code changes to Alchemorsel. Follow these steps for every change, regardless of size.**