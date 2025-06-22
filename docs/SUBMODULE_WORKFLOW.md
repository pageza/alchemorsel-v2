# Submodule-First Push Workflow

## 🛡️ Enforcement System Overview

This project enforces a **submodule-first push order** to ensure CI reliability and prevent integration issues. The system uses multiple enforcement layers:

1. **Pre-commit Hook** - Prevents commits with unpushed submodules
2. **Smart Push Script** - Automates correct push order
3. **CI Validation** - Verifies submodule push status

## 🚀 Quick Start

### One-Time Setup
```bash
# Install enforcement system
./scripts/setup-submodule-enforcement.sh
```

### Daily Development
```bash
# Use smart push for all pushes (recommended)
./scripts/smart-push.sh

# Or use with auto-commit
./scripts/smart-push.sh -c "feat: add new feature"

# Dry run to see what would happen
./scripts/smart-push.sh --dry-run
```

## 📋 Workflow Rules

### ✅ **REQUIRED ORDER:**
1. **Push submodules first** (backend, frontend)
2. **Update root repo** with new submodule commits
3. **Push root repo** last

### ❌ **BLOCKED SCENARIOS:**
- Committing root repo with unpushed submodule changes
- Pushing root repo before submodules are pushed
- Referencing submodule commits that don't exist on remote

## 🔧 Tools & Scripts

### **Smart Push Script** (`./scripts/smart-push.sh`)
**Purpose:** Automate correct push order with safety checks

**Options:**
```bash
./scripts/smart-push.sh [OPTIONS] [COMMIT_MESSAGE]

-h, --help          Show help message
-d, --dry-run       Show what would be pushed without pushing
-f, --force         Force push submodules (use with caution)
-v, --verbose       Show detailed output
-c, --commit        Auto-commit staged changes before pushing
-m, --message MSG   Commit message (implies --commit)
```

**Examples:**
```bash
# Basic push with safety checks
./scripts/smart-push.sh

# Auto-commit and push everything
./scripts/smart-push.sh -c "feat: implement user authentication"

# See what would happen without actually pushing
./scripts/smart-push.sh --dry-run --verbose

# Force push submodules (emergency use only)
./scripts/smart-push.sh --force
```

### **Pre-commit Hook** (`.git/hooks/pre-commit`)
**Purpose:** Block commits that would violate push order

**Behavior:**
- ✅ **Allows** commits with no submodule changes
- ✅ **Allows** commits where all submodules are pushed
- ❌ **Blocks** commits with unpushed submodule changes
- 💡 **Guides** you to fix issues with helpful messages

**Sample Output:**
```bash
🚫 COMMIT BLOCKED: Unpushed submodules detected!

📋 Submodules requiring push:
   • backend
   • frontend

🔧 Required workflow:
   1. Push submodules first:
      cd backend && git push
      cd frontend && git push
   2. Then commit/push root repo:
      git commit && git push

💡 Or use the smart push script: ./scripts/smart-push.sh
```

## 🎯 Example Workflows

### **Feature Development**
```bash
# 1. Work in submodules
cd backend
git checkout -b feature/new-api
# ... make changes ...
git commit -m "feat: add user management API"

cd ../frontend  
git checkout -b feature/user-ui
# ... make changes ...
git commit -m "feat: add user management UI"

# 2. Use smart push to handle everything
cd ..
./scripts/smart-push.sh -c "feat: complete user management feature"
```

### **Bug Fix**
```bash
# 1. Fix in submodule
cd backend
git checkout -b fix/auth-bug
# ... fix the bug ...
git commit -m "fix: resolve authentication token expiry"

# 2. Smart push handles the order
cd ..
./scripts/smart-push.sh -c "fix: resolve authentication issue"
```

### **Manual Step-by-Step**
```bash
# 1. Push submodules first
cd backend && git push
cd ../frontend && git push

# 2. Update root repo
cd ..
git add backend frontend
git commit -m "feat: update submodules with new features"

# 3. Push root repo
git push
```

## 🔍 Troubleshooting

### **"Unpushed submodules detected"**
```bash
# Check which submodules need pushing
./scripts/smart-push.sh --dry-run

# Push them manually
cd backend && git push
cd frontend && git push

# Or use smart push
./scripts/smart-push.sh
```

### **"Branch doesn't exist on remote"**
```bash
# Push branch with upstream tracking
cd backend
git push -u origin feature/my-branch

# Or let smart push handle it
cd ..
./scripts/smart-push.sh
```

### **"Permission denied" on scripts**
```bash
# Make scripts executable
chmod +x scripts/*.sh .githooks/*

# Or re-run setup
./scripts/setup-submodule-enforcement.sh
```

### **CI Fails After Push**
```bash
# Check if submodules were pushed correctly
git submodule status

# Verify remote has the commits
cd backend && git log --oneline origin/main -3
cd frontend && git log --oneline origin/main -3

# Re-run smart push if needed
./scripts/smart-push.sh
```

## 🎛️ Advanced Configuration

### **Disable Enforcement (Not Recommended)**
```bash
# Temporarily disable pre-commit hook
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled

# Re-enable later
mv .git/hooks/pre-commit.disabled .git/hooks/pre-commit
```

### **Custom Hook Integration**
If you have existing pre-commit hooks:
```bash
# Backup existing hook
cp .git/hooks/pre-commit .git/hooks/pre-commit.original

# Merge with our hook manually
# Edit .git/hooks/pre-commit to include both checks
```

### **CI Integration**
The Fast CI pipeline includes submodule validation:
```yaml
# Automatic validation in .github/workflows/ci.yml
- name: Validate submodule push status
  run: |
    # Ensures all submodule commits exist on remote
    git submodule update --init --recursive
```

## 🏗️ Architecture Benefits

### **Why This Matters:**
1. **CI Reliability** - Prevents "commit not found" errors in CI
2. **Team Coordination** - Forces proper integration testing
3. **Deployment Safety** - Ensures deployable state integrity
4. **Git History** - Maintains clean, traceable history

### **What It Prevents:**
- ❌ CI failures due to missing submodule commits
- ❌ Broken deployments with missing dependencies  
- ❌ Team confusion from orphaned commits
- ❌ Integration issues from untested combinations

### **How It Helps:**
- ✅ Automatic correct ordering
- ✅ Early error detection  
- ✅ Guided problem resolution
- ✅ Consistent team workflow

## 📚 Tags & References

**Implementation Tags:**
- `SUBMODULE-ENFORCEMENT-2025-A` - Pre-commit validation system
- `SUBMODULE-ENFORCEMENT-2025-B` - Automated push orchestration  
- `SUBMODULE-ENFORCEMENT-2025-C` - Installation and setup automation

**Related Documentation:**
- [CI_OPTIMIZATION_SUMMARY.md](./CI_OPTIMIZATION_SUMMARY.md) - CI pipeline architecture
- [LINTING_FIXES.md](./LINTING_FIXES.md) - Code quality automation