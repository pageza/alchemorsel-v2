#!/bin/bash

{
echo "🧪 Simple Recipe Generation Test"
echo "================================"

# Backend URL
BACKEND_URL="http://localhost:8080"

# Login credentials
EMAIL="test@test.com"
PASSWORD="password123"

echo "1. Logging in as $EMAIL..."

# Login and get JWT
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

# Extract JWT token
JWT=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$JWT" ]; then
    echo "❌ Login failed. Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Login successful, JWT obtained"

# Array of test queries
queries=(
    "spicy pasta"
    "chocolate cookies"
    "green smoothie"
    "chicken stir fry"
    "homemade pizza"
    "banana bread"
    "vegetable soup"
    "beef tacos"
    "quinoa bowl"
    "blueberry pancakes"
)

echo ""
echo "2. Generating 10 recipes..."
echo "=========================="

# Clear previous logs
docker logs alchemorsel-v2-backend-1 --since 1m > /dev/null 2>&1

for i in "${!queries[@]}"; do
    query="${queries[i]}"
    echo "[$((i+1))/10] Generating: $query"
    
    # Generate recipe
    RECIPE_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/v1/llm/query" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $JWT" \
      -d "{\"query\":\"$query\",\"intent\":\"generate\"}")
    
    # Check if successful
    if echo "$RECIPE_RESPONSE" | grep -q '"name"'; then
        echo "  ✅ Success"
    else
        echo "  ❌ Failed: $(echo "$RECIPE_RESPONSE" | head -c 100)..."
    fi
    
    # Wait 2 seconds between requests
    sleep 2
done

echo ""
echo "3. Analyzing logs..."
echo "==================="

# Get logs from the last 5 minutes
docker logs alchemorsel-v2-backend-1 --since 5m > /tmp/recipe_test_logs.txt

# Count parsing results
echo "Parsing Results:"
echo "---------------"
SUCCESS_COUNT=$(grep -c "CUSTOM FORMAT PARSED SUCCESSFULLY" /tmp/recipe_test_logs.txt 2>/dev/null || echo "0")
FAILURE_COUNT=$(grep -c "FAILED TO PARSE CUSTOM FORMAT" /tmp/recipe_test_logs.txt 2>/dev/null || echo "0")
ATTEMPT_COUNT=$(grep -c "Attempting to parse Custom Structured Format" /tmp/recipe_test_logs.txt 2>/dev/null || echo "0")

echo "Total parsing attempts: $ATTEMPT_COUNT"
echo "Successful parses:      $SUCCESS_COUNT"
echo "Failed parses:          $FAILURE_COUNT"

if [ $ATTEMPT_COUNT -gt 0 ]; then
    SUCCESS_RATE=$(echo "scale=1; $SUCCESS_COUNT * 100 / $ATTEMPT_COUNT" | bc -l 2>/dev/null || echo "N/A")
    echo "Success rate:           $SUCCESS_RATE%"
fi

echo ""
echo "Raw DeepSeek Responses:"
echo "----------------------"
grep -A 20 "RAW DEEPSEEK RESPONSE:" /tmp/recipe_test_logs.txt | grep -E "(NAME:|DESCRIPTION:|INGREDIENTS:|INSTRUCTIONS:)" | head -20

echo ""
echo "Sample Successful JSON:"
echo "----------------------"
grep "CUSTOM FORMAT PARSED SUCCESSFULLY" /tmp/recipe_test_logs.txt | head -1 | sed 's/.*CUSTOM FORMAT PARSED SUCCESSFULLY: //' | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print('Fields found:', ', '.join(data.keys()))
    if 'name' in data:
        print('Sample name:', data['name'][:50] + '...' if len(str(data['name'])) > 50 else data['name'])
    if 'ingredients' in data and isinstance(data['ingredients'], list):
        print('Ingredients count:', len(data['ingredients']))
    if 'instructions' in data and isinstance(data['instructions'], list):
        print('Instructions count:', len(data['instructions']))
except:
    print('Could not parse JSON')
"

echo ""
echo "Failure Analysis:"
echo "----------------"
if grep -q "FAILED TO PARSE CUSTOM FORMAT" /tmp/recipe_test_logs.txt; then
    echo "Sample failure content:"
    grep -A 5 "FAILED TO PARSE CUSTOM FORMAT" /tmp/recipe_test_logs.txt | head -10
else
    echo "No parsing failures found"
fi

echo ""
echo "Full logs saved to: /tmp/recipe_test_logs.txt"
echo "🏁 Test completed!"

# Save this output to a timestamped file
} | tee "recipe_test_output_$(date +%Y%m%d_%H%M%S).txt"