#!/bin/bash

# Setup Script: Install submodule-first push enforcement
# SUBMODULE-ENFORCEMENT-2025-C: Installation and setup automation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BOLD}🛡️ Setting up Submodule-First Push Enforcement${NC}"
echo

# Check if we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Get the repo root
REPO_ROOT=$(git rev-parse --show-toplevel)
echo -e "${BLUE}📁 Repository root: $REPO_ROOT${NC}"

# Install pre-commit hook
echo -e "${BLUE}🔧 Installing pre-commit hook...${NC}"

if [ -f "$REPO_ROOT/.git/hooks/pre-commit" ]; then
    echo -e "${YELLOW}⚠️  Existing pre-commit hook found${NC}"
    echo -e "${BLUE}💾 Backing up existing hook to pre-commit.backup${NC}"
    mv "$REPO_ROOT/.git/hooks/pre-commit" "$REPO_ROOT/.git/hooks/pre-commit.backup"
fi

# Copy our pre-commit hook
cp "$REPO_ROOT/.githooks/pre-commit" "$REPO_ROOT/.git/hooks/pre-commit"
chmod +x "$REPO_ROOT/.git/hooks/pre-commit"

echo -e "${GREEN}✅ Pre-commit hook installed${NC}"

# Make smart-push script executable
echo -e "${BLUE}🔧 Setting up smart-push script...${NC}"
chmod +x "$REPO_ROOT/scripts/smart-push.sh"

# Create convenient alias
if [ -f "$REPO_ROOT/.git/hooks/post-checkout" ]; then
    echo -e "${YELLOW}⚠️  Existing post-checkout hook found${NC}"
else
    cat > "$REPO_ROOT/.git/hooks/post-checkout" << 'EOF'
#!/bin/bash
# Auto-setup smart-push alias after checkout
if [ -f "scripts/smart-push.sh" ]; then
    alias push='./scripts/smart-push.sh'
fi
EOF
    chmod +x "$REPO_ROOT/.git/hooks/post-checkout"
    echo -e "${GREEN}✅ Post-checkout hook created for smart-push alias${NC}"
fi

# Test the setup
echo
echo -e "${BLUE}🧪 Testing enforcement setup...${NC}"

# Test pre-commit hook
if [ -x "$REPO_ROOT/.git/hooks/pre-commit" ]; then
    echo -e "${GREEN}✅ Pre-commit hook is executable${NC}"
else
    echo -e "${RED}❌ Pre-commit hook setup failed${NC}"
    exit 1
fi

# Test smart-push script
if [ -x "$REPO_ROOT/scripts/smart-push.sh" ]; then
    echo -e "${GREEN}✅ Smart-push script is executable${NC}"
else
    echo -e "${RED}❌ Smart-push script setup failed${NC}"
    exit 1
fi

# Setup complete
echo
echo -e "${GREEN}🎉 Submodule enforcement setup complete!${NC}"
echo
echo -e "${BOLD}📋 What's been installed:${NC}"
echo -e "   • ${GREEN}Pre-commit hook${NC} - Blocks commits with unpushed submodules"
echo -e "   • ${GREEN}Smart-push script${NC} - Automatically pushes in correct order"
echo
echo -e "${BOLD}🚀 Usage:${NC}"
echo -e "   • ${YELLOW}Automatic:${NC} Pre-commit hook prevents incorrect push order"
echo -e "   • ${YELLOW}Manual:${NC} Use ${BLUE}./scripts/smart-push.sh${NC} for safe pushing"
echo -e "   • ${YELLOW}Help:${NC} Run ${BLUE}./scripts/smart-push.sh --help${NC} for options"
echo
echo -e "${BOLD}💡 Pro Tips:${NC}"
echo -e "   • Use ${BLUE}./scripts/smart-push.sh -d${NC} for dry-run to see what would happen"
echo -e "   • Use ${BLUE}./scripts/smart-push.sh -c \"commit message\"${NC} to auto-commit and push"
echo -e "   • Hook will guide you if you try to push incorrectly"
echo