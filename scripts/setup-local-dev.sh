#!/bin/bash

# Local development setup with comprehensive testing enforcement
# Run this once after cloning the repo

set -e

echo "🚀 Setting up Alchemorsel local development environment..."

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "📦 Installing pre-commit..."
    pip install pre-commit
fi

# Install pre-commit hooks
echo "🪝 Installing pre-commit hooks..."
pre-commit install
pre-commit install --hook-type commit-msg

# Setup Git hooks for additional checks
echo "🔗 Setting up Git hooks..."
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

# Pre-push hook to run comprehensive tests before pushing
echo "🧪 Running comprehensive tests before push..."

# Check if we're on protected branch
protected_branch='master|main'
current_branch=$(git rev-parse --abbrev-ref HEAD)

if [[ "$current_branch" =~ $protected_branch ]]; then
    echo "❌ Direct push to protected branch '$current_branch' is not allowed."
    echo "Please create a feature branch and submit a PR."
    exit 1
fi

# Run full test suite
echo "🔍 Running backend tests..."
cd backend && go test ./... && cd ..

echo "🔍 Running frontend tests..."
cd frontend && npm run test:unit -- --run && cd ..

echo "🔍 Running E2E tests..."
cd ui-tests && npm run test:basic && cd ..

echo "✅ All tests passed. Push allowed."
EOF

chmod +x .git/hooks/pre-push

# Create secrets baseline for detect-secrets
echo "🔐 Creating secrets baseline..."
if ! [ -f .secrets.baseline ]; then
    detect-secrets scan --baseline .secrets.baseline
fi

# Setup backend environment
echo "🐹 Setting up Go environment..."
cd backend
if [ ! -f go.mod ]; then
    echo "❌ go.mod not found in backend directory"
    exit 1
fi
go mod download
go mod verify

# Install golangci-lint if not present
if ! command -v golangci-lint &> /dev/null; then
    echo "📦 Installing golangci-lint..."
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
fi

cd ..

# Setup frontend environment
echo "🟢 Setting up Node.js environment..."
cd frontend
if [ ! -f package.json ]; then
    echo "❌ package.json not found in frontend directory"
    exit 1
fi
npm ci
cd ..

# Setup UI tests environment
echo "🧪 Setting up UI tests environment..."
cd ui-tests
if [ ! -f package.json ]; then
    echo "❌ package.json not found in ui-tests directory"
    exit 1
fi
npm ci
cd ..

echo ""
echo "✅ Local development environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Copy .env.example to .env and configure your environment"
echo "   2. Run 'docker-compose up postgres redis' to start databases"
echo "   3. Run 'make dev' in backend/ directory to start backend"
echo "   4. Run 'npm run dev' in frontend/ directory to start frontend"
echo ""
echo "🔒 Protection measures active:"
echo "   • Pre-commit hooks will run on every commit"
echo "   • Pre-push hooks will run comprehensive tests"
echo "   • Direct pushes to master/main are blocked"
echo "   • Secrets detection is enabled"
echo ""
echo "🧪 To run tests manually:"
echo "   Backend:  cd backend && make test"
echo "   Frontend: cd frontend && npm run test:unit"
echo "   E2E:      cd ui-tests && npm run test:comprehensive"
echo "   All:      ./scripts/test-all.sh"