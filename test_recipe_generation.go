package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

type TestRequest struct {
	Query  string `json:"query"`
	Intent string `json:"intent"`
}

type TestResult struct {
	RequestNum int    `json:"request_num"`
	Query      string `json:"query"`
	Success    bool   `json:"success"`
	Error      string `json:"error,omitempty"`
	Recipe     map[string]interface{} `json:"recipe,omitempty"`
	RawLog     string `json:"raw_log,omitempty"`
}

func main() {
	// Test queries to generate variety
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

	backendURL := "http://localhost:8080/api/v1/llm/query"
	
	// You'll need to get a valid JWT token - this is a placeholder
	jwtToken := os.Getenv("TEST_JWT_TOKEN")
	if jwtToken == "" {
		fmt.Println("ERROR: Please set TEST_JWT_TOKEN environment variable with a valid JWT token")
		fmt.Println("You can get this by logging into the app and copying the token from browser dev tools")
		os.Exit(1)
	}

	results := make([]TestResult, 0, 20)
	
	fmt.Println("🧪 Starting Recipe Generation Consistency Test")
	fmt.Println("================================================")
	
	for i, query := range queries {
		fmt.Printf("Test %d/20: Generating '%s'...\n", i+1, query)
		
		result := TestResult{
			RequestNum: i + 1,
			Query:      query,
		}
		
		// Create request
		reqBody := TestRequest{
			Query:  query,
			Intent: "generate",
		}
		
		jsonData, err := json.Marshal(reqBody)
		if err != nil {
			result.Success = false
			result.Error = fmt.Sprintf("Failed to marshal request: %v", err)
			results = append(results, result)
			continue
		}
		
		// Make HTTP request
		req, err := http.NewRequest("POST", backendURL, bytes.NewBuffer(jsonData))
		if err != nil {
			result.Success = false
			result.Error = fmt.Sprintf("Failed to create request: %v", err)
			results = append(results, result)
			continue
		}
		
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", jwtToken))
		
		client := &http.Client{Timeout: 60 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			result.Success = false
			result.Error = fmt.Sprintf("Request failed: %v", err)
			results = append(results, result)
			continue
		}
		defer resp.Body.Close()
		
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			result.Success = false
			result.Error = fmt.Sprintf("Failed to read response: %v", err)
			results = append(results, result)
			continue
		}
		
		if resp.StatusCode != http.StatusOK {
			result.Success = false
			result.Error = fmt.Sprintf("HTTP %d: %s", resp.StatusCode, string(body))
			results = append(results, result)
			continue
		}
		
		// Parse response
		var response map[string]interface{}
		if err := json.Unmarshal(body, &response); err != nil {
			result.Success = false
			result.Error = fmt.Sprintf("Failed to parse JSON response: %v", err)
			result.RawLog = string(body)
			results = append(results, result)
			continue
		}
		
		// Extract recipe from response
		if recipe, ok := response["recipe"].(map[string]interface{}); ok {
			result.Success = true
			result.Recipe = recipe
		} else {
			result.Success = false
			result.Error = "No recipe found in response"
			result.RawLog = string(body)
		}
		
		results = append(results, result)
		
		// Small delay between requests
		time.Sleep(2 * time.Second)
	}
	
	fmt.Println("\n📊 Analysis Results")
	fmt.Println("===================")
	
	// Analyze results
	successCount := 0
	fieldConsistency := make(map[string]int)
	errors := make(map[string]int)
	
	for _, result := range results {
		if result.Success {
			successCount++
			
			// Check field consistency
			for field := range result.Recipe {
				fieldConsistency[field]++
			}
		} else {
			errorType := strings.Split(result.Error, ":")[0]
			errors[errorType]++
		}
	}
	
	fmt.Printf("✅ Success Rate: %d/20 (%.1f%%)\n", successCount, float64(successCount)/20*100)
	
	if successCount > 0 {
		fmt.Printf("\n📋 Field Consistency (out of %d successful recipes):\n", successCount)
		for field, count := range fieldConsistency {
			percentage := float64(count) / float64(successCount) * 100
			fmt.Printf("  %-15s: %d/%-2d (%.1f%%)\n", field, count, successCount, percentage)
		}
	}
	
	if len(errors) > 0 {
		fmt.Printf("\n❌ Error Breakdown:\n")
		for errorType, count := range errors {
			fmt.Printf("  %-30s: %d\n", errorType, count)
		}
	}
	
	// Save detailed results to file
	resultsJSON, _ := json.MarshalIndent(results, "", "  ")
	err := os.WriteFile("recipe_test_results.json", resultsJSON, 0644)
	if err != nil {
		fmt.Printf("\n⚠️  Failed to save results to file: %v\n", err)
	} else {
		fmt.Printf("\n💾 Detailed results saved to: recipe_test_results.json\n")
	}
	
	// Show sample successful recipe structure
	if successCount > 0 {
		fmt.Printf("\n🔍 Sample Recipe Structure:\n")
		for _, result := range results {
			if result.Success {
				fmt.Printf("Recipe: %s\n", result.Query)
				for field, value := range result.Recipe {
					switch v := value.(type) {
					case []interface{}:
						fmt.Printf("  %-15s: [array with %d items]\n", field, len(v))
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
				break // Just show the first successful one
			}
		}
	}
	
	fmt.Println("\n🏁 Test completed!")
}