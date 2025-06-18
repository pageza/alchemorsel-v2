#!/bin/bash

# Set version environment variable script
# Usage: source scripts/set-version.sh [version]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VERSION_FILE="$PROJECT_ROOT/VERSION"

# Get version from argument or VERSION file
if [ -n "$1" ]; then
    VERSION="$1"
elif [ -f "$VERSION_FILE" ]; then
    VERSION=$(cat "$VERSION_FILE")
else
    VERSION="1.2.0"
fi

# Export the version
export ALCHEMORSEL_VERSION="v$VERSION"

echo "✅ Set ALCHEMORSEL_VERSION=$ALCHEMORSEL_VERSION"
echo ""
echo "You can now run:"
echo "  docker compose up    # Uses version from docker-compose.yml" 
echo "  docker compose -f docker-compose.yml -f docker-compose.override.yml up    # Uses dynamic version"