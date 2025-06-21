#!/bin/bash

# Version consistency checker for pre-commit
# Ensures all version files are synchronized

set -e

echo "🔍 Checking version consistency..."

# Check if VERSION file exists
if [ ! -f VERSION ]; then
    echo "❌ VERSION file not found"
    exit 1
fi

VERSION=$(cat VERSION)
if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
    echo "❌ Invalid version format in VERSION file: $VERSION"
    echo "Expected format: major.minor.patch (e.g., 1.2.3)"
    exit 1
fi

echo "✅ VERSION file valid: $VERSION"

# Check package.json files
VERSION_MISMATCH=false

if [ -f frontend/package.json ]; then
    FRONTEND_VERSION=$(grep '"version"' frontend/package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
    if [ "$FRONTEND_VERSION" != "$VERSION" ]; then
        echo "❌ Frontend package.json version ($FRONTEND_VERSION) differs from VERSION file ($VERSION)"
        VERSION_MISMATCH=true
    else
        echo "✅ Frontend package.json version matches"
    fi
fi

if [ -f ui-tests/package.json ]; then
    UI_VERSION=$(grep '"version"' ui-tests/package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
    if [ "$UI_VERSION" != "$VERSION" ]; then
        echo "❌ UI tests package.json version ($UI_VERSION) differs from VERSION file ($VERSION)"
        VERSION_MISMATCH=true
    else
        echo "✅ UI tests package.json version matches"
    fi
fi

if [ "$VERSION_MISMATCH" = true ]; then
    echo ""
    echo "🔧 To fix version mismatches, run: ./scripts/version.sh sync"
    exit 1
fi

echo "✅ All versions are consistent"