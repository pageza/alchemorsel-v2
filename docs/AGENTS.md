# Alchemorsel-v2 Git Workflow Guide

## 📦 Repository Structure
- Root Repository: `alchemorsel-v2` (main monorepo)
- Submodules:
  - `alchemorsel-v2-frontend`
  - `alchemorsel-v2-backend`

## ⚠️ Important Git Workflow Rules

### 1. Submodule Changes
- NEVER push submodule changes through the main repository
- ALWAYS push submodule changes directly to their respective repositories:
  ```bash
  # For frontend changes
  cd frontend
  git add .
  git commit -m "your commit message"
  git push origin <branch-name>

  # For backend changes
  cd backend
  git add .
  git commit -m "your commit message"
  git push origin <branch-name>
  ```

### 2. Main Repository Changes
- ONLY push changes that affect the root level of the project
- This includes:
  - `docker-compose.yml`
  - Root level documentation
  - CI/CD configurations
  - Project-wide scripts
  - Submodule reference updates

### 3. Submodule Reference Updates
When submodules are updated, update their references in the main repo:
```bash
# After pushing changes to submodules
cd /path/to/alchemorsel-v2
git add frontend backend
git commit -m "chore: update submodule references"
git push origin main
```

## 🚫 Common Mistakes to Avoid
1. DO NOT commit submodule changes through the main repository
2. DO NOT create PRs for submodule changes in the main repository
3. DO NOT mix submodule and main repository changes in the same commit

## ✅ Correct Workflow Example
1. Make changes to frontend code:
   ```bash
   cd frontend
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   # Create PR in frontend repository
   ```

2. Make changes to backend code:
   ```bash
   cd backend
   git checkout -b feature/new-api
   # Make changes
   git add .
   git commit -m "feat: add new API endpoint"
   git push origin feature/new-api
   # Create PR in backend repository
   ```

3. Update main repository (only if needed):
   ```bash
   cd /path/to/alchemorsel-v2
   git checkout -b chore/update-submodules
   git add frontend backend
   git commit -m "chore: update submodule references"
   git push origin chore/update-submodules
   # Create PR in main repository
   ```

## 🔄 Submodule Management
- To initialize submodules:
  ```bash
  git submodule update --init --recursive
  ```

- To update submodules to their latest commits:
  ```bash
  git submodule update --remote
  ```

## 📝 Pull Request Guidelines
- Frontend changes: Create PRs in `alchemorsel-v2-frontend`
- Backend changes: Create PRs in `alchemorsel-v2-backend`
- Main repository changes: Create PRs in `alchemorsel-v2`

## 🎯 Best Practices
1. Always work in feature branches
2. Keep submodule changes separate from main repository changes
3. Update submodule references only after submodule changes are merged
4. Use clear commit messages that indicate which part of the system is being changed
5. Regularly pull and update submodules to stay in sync with the team

## 🆘 Troubleshooting
If you encounter issues with submodules:
1. Ensure you're in the correct directory
2. Check if submodules are properly initialized
3. Verify you have the correct permissions for each repository
4. Make sure you're pushing to the correct remote repository 