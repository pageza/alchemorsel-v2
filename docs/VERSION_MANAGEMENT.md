# Version Management

This document describes the version management system for Alchemorsel v2.

## Overview

The project uses semantic versioning (MAJOR.MINOR.PATCH) with automated tools for version bumping, tagging, and release management.

## Version Files

- **`VERSION`** - Single source of truth for the current version
- **`frontend/package.json`** - Frontend package version (synced with VERSION)
- **`ui-tests/package.json`** - UI tests package version (synced with VERSION)
- **`docker-compose.yml`** - Docker image tags (synced with VERSION)

## Scripts

### `scripts/version.sh`

Main version management script with the following commands:

```bash
# Show current version
./scripts/version.sh current

# Bump version
./scripts/version.sh bump patch    # 1.0.0 -> 1.0.1
./scripts/version.sh bump minor    # 1.0.1 -> 1.1.0
./scripts/version.sh bump major    # 1.1.0 -> 2.0.0

# Set specific version
./scripts/version.sh set 1.2.3

# Create git tag
./scripts/version.sh tag [version]

# Generate changelog
./scripts/version.sh changelog [version]

# Full release process (bump + changelog)
./scripts/version.sh release patch
```

### `scripts/set-version.sh`

Sets environment variables for Docker Compose:

```bash
# Set version for Docker Compose
source scripts/set-version.sh
source scripts/set-version.sh 1.2.3  # specific version

# Then use with override file
docker compose -f docker-compose.yml -f docker-compose.override.yml up
```

## GitHub Actions Workflows

### Version Bump Workflow (`.github/workflows/version-bump.yml`)

Manual workflow for creating releases:

1. **Trigger**: Manual dispatch with version bump type (patch/minor/major)
2. **Actions**:
   - Bumps version in all files
   - Generates changelog
   - Creates git commit and tag
   - Pushes changes to repository

### Release Workflow (`.github/workflows/release.yml`)

Automated workflow triggered by git tags:

1. **Trigger**: Git tags starting with `v*`
2. **Actions**:
   - Builds Docker images with proper versioning
   - Creates GitHub release with generated changelog
   - Publishes to GitHub Container Registry

### CI Workflow (`.github/workflows/ci.yml`)

Enhanced with version validation:

1. **Version Check**: Validates VERSION file format and consistency
2. **Testing**: Runs all tests with version validation as prerequisite

### Deploy Workflow (`.github/workflows/deploy.yml`)

Enhanced with dynamic versioning:

1. **Version Detection**: Reads VERSION file for deployment tags
2. **Docker Tags**: Uses semantic version tags alongside branch/SHA tags

## Release Process

### Automated Release (Recommended)

1. Go to GitHub Actions → "Version Bump and Release"
2. Select version bump type (patch/minor/major)
3. Choose whether to create release and push tag
4. Run workflow

This will:
- Bump version in all files
- Generate changelog
- Create git tag
- Trigger automatic Docker builds
- Create GitHub release

### Manual Release

1. **Bump version**:
   ```bash
   ./scripts/version.sh bump patch
   ```

2. **Review changes**:
   ```bash
   git diff
   cat CHANGELOG.md
   ```

3. **Commit and tag**:
   ```bash
   git add -A
   git commit -m "chore: release v$(cat VERSION)"
   ./scripts/version.sh tag
   ```

4. **Push**:
   ```bash
   git push origin main
   git push origin v$(cat VERSION)
   ```

## Docker Versioning

### Development

Use environment variables for dynamic versioning:

```bash
# Set version environment
source scripts/set-version.sh

# Use override file for dynamic tags
docker compose -f docker-compose.yml -f docker-compose.override.yml up
```

### Production

Docker images are tagged with:
- Semantic version (e.g., `v1.2.3`)
- Major.minor version (e.g., `v1.2`)
- Branch name for development
- Git SHA for uniqueness
- `latest` for main branch

## Best Practices

1. **Always use the version script** for version changes
2. **Test before releasing** - use the CI pipeline
3. **Follow semantic versioning**:
   - PATCH: Bug fixes
   - MINOR: New features (backward compatible)
   - MAJOR: Breaking changes
4. **Review changelogs** before publishing releases
5. **Use automated workflows** to ensure consistency

## Troubleshooting

### Version Mismatch

If package.json versions don't match VERSION file:

```bash
# Fix all version mismatches
./scripts/version.sh set $(cat VERSION)
```

### Failed Release

If a release fails:

1. Check GitHub Actions logs
2. Verify all tests pass
3. Ensure version format is correct
4. Check Docker build logs

### Rollback

To rollback a release:

```bash
# Reset to previous version
git reset --hard HEAD~1
git tag -d v1.2.3  # delete local tag
git push origin :v1.2.3  # delete remote tag
```