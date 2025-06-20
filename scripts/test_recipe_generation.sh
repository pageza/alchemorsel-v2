#!/bin/bash

# Test script to verify recipe generation works without JSON parsing errors

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (parent of scripts)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root for consistency
cd "$PROJECT_ROOT"

# Login first to get a token (assuming test user exists)
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@alchemorsel.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "Failed to get authentication token"
    echo "Login response: $LOGIN_RESPONSE"
    exit 1
fi

echo "Got token: ${TOKEN:0:20}..."

# Test recipe generation
echo "Testing recipe generation..."
RECIPE_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/llm/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"A simple pasta dish","intent":"generate","skip_similar_check":true}')

echo "Recipe generation response:"
echo $RECIPE_RESPONSE | jq .

# Check if the response contains an error
ERROR=$(echo $RECIPE_RESPONSE | jq -r '.error // empty')
if [ ! -z "$ERROR" ]; then
    echo "ERROR: Recipe generation failed with: $ERROR"
    exit 1
else
    echo "SUCCESS: Recipe generation completed without errors"
fi