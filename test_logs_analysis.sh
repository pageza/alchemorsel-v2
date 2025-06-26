#!/bin/bash

echo "🧪 Recipe Generation Log Analysis Script"
echo "========================================"
echo ""
echo "This script will generate 10 test recipes and analyze the consistency"
echo "of the Custom Structured Format parsing from Docker logs."
echo ""

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

echo "📝 Test queries prepared:"
for i in "${!queries[@]}"; do
    echo "  $((i+1)). ${queries[i]}"
done
echo ""

echo "⚠️  MANUAL STEP REQUIRED:"
echo "----------------------------------------"
echo "Please perform the following steps manually:"
echo ""
echo "1. Open your browser and go to the recipe generation page"
echo "2. For each query listed above, generate a recipe"
echo "3. Wait 2-3 seconds between each generation"
echo "4. After all 10 recipes are generated, run this command:"
echo ""
echo "   docker logs alchemorsel-v2-backend-1 --since 10m | grep -E '(CUSTOM FORMAT PARSED|FAILED TO PARSE|Successfully parsed Custom Structured Format)'"
echo ""
echo "5. Then run this analysis command:"
echo ""
echo "   docker logs alchemorsel-v2-backend-1 --since 10m > /tmp/test_logs.txt && bash $(basename $0) analyze"
echo ""

if [ "$1" = "analyze" ]; then
    echo "📊 Analyzing logs from /tmp/test_logs.txt..."
    
    if [ ! -f "/tmp/test_logs.txt" ]; then
        echo "❌ Log file not found. Please run the docker logs command first."
        exit 1
    fi
    
    # Count successes and failures
    success_count=$(grep -c "CUSTOM FORMAT PARSED SUCCESSFULLY" /tmp/test_logs.txt 2>/dev/null || echo "0")
    failure_count=$(grep -c "FAILED TO PARSE CUSTOM FORMAT" /tmp/test_logs.txt 2>/dev/null || echo "0")
    parsing_attempts=$(grep -c "Attempting to parse Custom Structured Format" /tmp/test_logs.txt 2>/dev/null || echo "0")
    
    echo ""
    echo "📈 Results Summary:"
    echo "==================="
    echo "Total parsing attempts: $parsing_attempts"
    echo "Successful parses:      $success_count"
    echo "Failed parses:          $failure_count"
    
    if [ $parsing_attempts -gt 0 ]; then
        success_rate=$(echo "scale=1; $success_count * 100 / $parsing_attempts" | bc -l 2>/dev/null || echo "N/A")
        echo "Success rate:           $success_rate%"
    fi
    
    echo ""
    echo "🔍 Sample Parsing Logs:"
    echo "======================="
    grep -A 2 -B 1 "Successfully parsed Custom Structured Format" /tmp/test_logs.txt | head -20
    
    echo ""
    echo "❌ Failure Analysis:"
    echo "==================="
    grep -A 3 -B 1 "FAILED TO PARSE CUSTOM FORMAT" /tmp/test_logs.txt | head -20
    
    echo ""
    echo "📋 Field Analysis:"
    echo "=================="
    echo "Extracting field counts from successful parses..."
    
    # Extract JSON objects from successful parses
    grep "CUSTOM FORMAT PARSED SUCCESSFULLY" /tmp/test_logs.txt | sed 's/.*CUSTOM FORMAT PARSED SUCCESSFULLY: //' > /tmp/parsed_recipes.json
    
    if [ -s /tmp/parsed_recipes.json ]; then
        echo "Sample successful JSON structure:"
        head -1 /tmp/parsed_recipes.json | python3 -m json.tool 2>/dev/null || echo "Could not format JSON"
    else
        echo "No successful JSON parses found in logs"
    fi
    
    echo ""
    echo "🏁 Analysis complete!"
    echo "Check the full logs with: less /tmp/test_logs.txt"
    
else
    echo "Ready to start! Generate the recipes manually, then run:"
    echo "  bash $(basename $0) analyze"
fi