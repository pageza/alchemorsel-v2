#!/bin/bash

# Version management script for Alchemorsel
# Supports semantic versioning (major.minor.patch)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VERSION_FILE="$PROJECT_ROOT/VERSION"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Get current version
get_current_version() {
    if [[ -f "$VERSION_FILE" ]]; then
        cat "$VERSION_FILE"
    else
        echo "0.0.0"
    fi
}

# Validate version format
validate_version() {
    local version="$1"
    if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        error "Invalid version format: $version (expected: major.minor.patch)"
    fi
}

# Compare versions
version_gt() {
    test "$(printf '%s\n' "$@" | sort -V | head -n 1)" != "$1"
}

# Bump version
bump_version() {
    local bump_type="$1"
    local current_version
    current_version="$(get_current_version)"
    
    IFS='.' read -ra VERSION_PARTS <<< "$current_version"
    local major="${VERSION_PARTS[0]}"
    local minor="${VERSION_PARTS[1]}"
    local patch="${VERSION_PARTS[2]}"
    
    case "$bump_type" in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            error "Invalid bump type: $bump_type (expected: major, minor, patch)"
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Set version in all relevant files
set_version() {
    local version="$1"
    validate_version "$version"
    
    log "Setting version to $version"
    
    # Update VERSION file
    echo "$version" > "$VERSION_FILE"
    
    # Update docker-compose.yml
    if [[ -f "$PROJECT_ROOT/docker-compose.yml" ]]; then
        sed -i.bak "s/image: alchemorsel\/\([^:]*\):.*/image: alchemorsel\/\1:v$version/g" "$PROJECT_ROOT/docker-compose.yml"
        sed -i.bak "s/version=v[0-9.]*/version=v$version/g" "$PROJECT_ROOT/docker-compose.yml"
        rm -f "$PROJECT_ROOT/docker-compose.yml.bak"
        log "Updated docker-compose.yml"
    fi
    
    # Update package.json files
    if [[ -f "$PROJECT_ROOT/frontend/package.json" ]]; then
        sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$version\"/g" "$PROJECT_ROOT/frontend/package.json"
        rm -f "$PROJECT_ROOT/frontend/package.json.bak"
        log "Updated frontend/package.json"
    fi
    
    if [[ -f "$PROJECT_ROOT/ui-tests/package.json" ]]; then
        sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$version\"/g" "$PROJECT_ROOT/ui-tests/package.json"
        rm -f "$PROJECT_ROOT/ui-tests/package.json.bak"
        log "Updated ui-tests/package.json"
    fi
    
    log "Version set to $version successfully"
}

# Create git tag
create_tag() {
    local version="$1"
    local tag="v$version"
    
    if git rev-parse "$tag" >/dev/null 2>&1; then
        warn "Tag $tag already exists"
        return 0
    fi
    
    log "Creating git tag: $tag"
    git tag -a "$tag" -m "Release $tag"
    
    log "Tag $tag created successfully"
    log "Push with: git push origin $tag"
}

# Generate changelog
generate_changelog() {
    local version="$1"
    local previous_tag
    local changelog_file="$PROJECT_ROOT/CHANGELOG.md"
    
    # Get the previous tag
    previous_tag=$(git describe --tags --abbrev=0 HEAD~1 2>/dev/null || echo "")
    
    log "Generating changelog for version $version"
    
    {
        echo "# Changelog"
        echo ""
        echo "## [$version] - $(date +%Y-%m-%d)"
        echo ""
        
        if [[ -n "$previous_tag" ]]; then
            echo "### Changes since $previous_tag"
            echo ""
            git log --pretty=format:"- %s (%h)" "$previous_tag"..HEAD | grep -v "^$"
        else
            echo "### Initial Release"
            echo ""
            echo "- Initial release of Alchemorsel v2"
        fi
        
        echo ""
        echo ""
        
        # Append existing changelog if it exists
        if [[ -f "$changelog_file" ]] && [[ $(head -n 1 "$changelog_file") == "# Changelog" ]]; then
            tail -n +3 "$changelog_file"
        fi
    } > "${changelog_file}.tmp"
    
    mv "${changelog_file}.tmp" "$changelog_file"
    log "Changelog updated: $changelog_file"
}

# Show usage
usage() {
    cat << EOF
Usage: $0 <command> [options]

Commands:
    current                 Show current version
    bump <type>            Bump version (major, minor, patch)
    set <version>          Set specific version
    tag [version]          Create git tag for version
    changelog [version]    Generate changelog for version
    release <type>         Full release process (bump, tag, changelog)

Examples:
    $0 current             # Show current version
    $0 bump patch          # Bump patch version (1.0.0 -> 1.0.1)
    $0 bump minor          # Bump minor version (1.0.1 -> 1.1.0)
    $0 bump major          # Bump major version (1.1.0 -> 2.0.0)
    $0 set 1.2.3          # Set version to 1.2.3
    $0 tag                # Create tag for current version
    $0 tag 1.2.3          # Create tag for specific version
    $0 release patch      # Full patch release process
EOF
}

# Main command handling
main() {
    case "${1:-}" in
        current)
            get_current_version
            ;;
        bump)
            if [[ $# -ne 2 ]]; then
                error "Usage: $0 bump <major|minor|patch>"
            fi
            local new_version
            new_version=$(bump_version "$2")
            set_version "$new_version"
            echo "$new_version"
            ;;
        set)
            if [[ $# -ne 2 ]]; then
                error "Usage: $0 set <version>"
            fi
            set_version "$2"
            ;;
        tag)
            local version="${2:-$(get_current_version)}"
            create_tag "$version"
            ;;
        changelog)
            local version="${2:-$(get_current_version)}"
            generate_changelog "$version"
            ;;
        release)
            if [[ $# -ne 2 ]]; then
                error "Usage: $0 release <major|minor|patch>"
            fi
            local new_version
            new_version=$(bump_version "$2")
            set_version "$new_version"
            generate_changelog "$new_version"
            
            log "Release $new_version prepared successfully!"
            log ""
            log "Next steps:"
            log "1. Review the changes in CHANGELOG.md"
            log "2. Commit the version bump: git add -A && git commit -m 'chore: release v$new_version'"
            log "3. Create the tag: $0 tag $new_version"
            log "4. Push: git push origin main && git push origin v$new_version"
            ;;
        *)
            usage
            exit 1
            ;;
    esac
}

# Ensure we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    error "This script must be run from within a git repository"
fi

main "$@"