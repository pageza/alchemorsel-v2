package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/pageza/alchemorsel-v2/backend/internal/service"
)

func main() {
	fmt.Println("🧪 Custom Structured Format Consistency Test")
	fmt.Println("============================================")

	// Initialize LLM service
	llmService, err := service.NewLLMService()
	if err != nil {
		log.Fatalf("Failed to create LLM service: %v", err)
	}

	// Test queries
	queries := []string{
		"spicy pasta with vegetables",
		"chocolate chip cookies", 
		"healthy green smoothie",
		"chicken stir fry",
		"homemade pizza",
		"banana bread",
		"vegetable soup",
		"beef tacos",
		"asian noodle salad",
		"blueberry pancakes",
		"grilled salmon",
		"quinoa bowl",
		"mushroom risotto",
		"apple pie",
		"curry chicken",
		"avocado toast",
		"seafood paella",
		"chocolate cake",
		"greek salad",
		"breakfast burrito",
	}

	results := make([]map[string]interface{}, 0)
	successCount := 0
	failureCount := 0
	fieldCounts := make(map[string]int)

	fmt.Printf("Testing %d recipe queries...\n\n", len(queries))

	for i, query := range queries {
		fmt.Printf("[%d/%d] Testing: %s\n", i+1, len(queries), query)
		
		// Generate basic recipe (no dietary restrictions for consistency)
		draft, err := llmService.GenerateBasicRecipe(context.Background(), query, []string{}, []string{}, "test-user")
		
		if err != nil {
			fmt.Printf("  ❌ Failed: %v\n", err)
			failureCount++
			continue
		}

		fmt.Printf("  ✅ Success: %s\n", draft.Name)
		successCount++

		// Convert draft to map for analysis
		draftJSON, _ := json.Marshal(draft)
		var draftMap map[string]interface{}
		json.Unmarshal(draftJSON, &draftMap)
		results = append(results, draftMap)

		// Count fields
		for field := range draftMap {
			if field != "id" && field != "user_id" && field != "created_at" && field != "updated_at" {
				fieldCounts[field]++
			}
		}
	}

	fmt.Println("\n📊 Analysis Results")
	fmt.Println("===================")
	fmt.Printf("✅ Successful: %d/%d (%.1f%%)\n", successCount, len(queries), float64(successCount)/float64(len(queries))*100)
	fmt.Printf("❌ Failed:     %d/%d (%.1f%%)\n", failureCount, len(queries), float64(failureCount)/float64(len(queries))*100)

	if successCount > 0 {
		fmt.Printf("\n📋 Field Consistency:\n")
		for field, count := range fieldCounts {
			percentage := float64(count) / float64(successCount) * 100
			fmt.Printf("  %-15s: %2d/%2d (%.1f%%)\n", field, count, successCount, percentage)
		}

		fmt.Printf("\n🔍 Sample Recipe Structure:\n")
		if len(results) > 0 {
			sample := results[0]
			for field, value := range sample {
				if field == "id" || field == "user_id" || field == "created_at" || field == "updated_at" {
					continue
				}
				
				switch v := value.(type) {
				case []interface{}:
					fmt.Printf("  %-15s: [array with %d items]\n", field, len(v))
					if len(v) > 0 {
						fmt.Printf("                   Example: \"%v\"\n", v[0])
					}
				case string:
					if len(v) > 50 {
						fmt.Printf("  %-15s: \"%s...\"\n", field, v[:47])
					} else {
						fmt.Printf("  %-15s: \"%s\"\n", field, v)
					}
				default:
					fmt.Printf("  %-15s: %v\n", field, v)
				}
			}
		}

		// Check for missing critical fields
		fmt.Printf("\n⚠️  Field Coverage Analysis:\n")
		criticalFields := []string{"name", "description", "ingredients", "instructions", "prep_time", "cook_time", "servings", "difficulty"}
		
		for _, field := range criticalFields {
			count := fieldCounts[field]
			percentage := float64(count) / float64(successCount) * 100
			status := "✅"
			if percentage < 100 {
				status = "⚠️ "
			}
			if percentage < 50 {
				status = "❌"
			}
			fmt.Printf("  %s %-15s: %2d/%2d (%.1f%%)\n", status, field, count, successCount, percentage)
		}

		// Save detailed results
		resultsJSON, _ := json.MarshalIndent(results, "", "  ")
		err := os.WriteFile("recipe_consistency_results.json", resultsJSON, 0644)
		if err != nil {
			fmt.Printf("\n⚠️  Failed to save results: %v\n", err)
		} else {
			fmt.Printf("\n💾 Detailed results saved to: recipe_consistency_results.json\n")
		}
	}

	fmt.Println("\n🏁 Test completed!")
}