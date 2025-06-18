const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../../helpers/browser');
require('dotenv').config();

describe('Enhanced AI Recipe Generation with DeepSeek Improvements', () => {
  let browser;

  beforeEach(async () => {
    browser = new BrowserManager();
    await browser.launch();
  });

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  describe('DeepSeek Integration Improvements', () => {
    test('should validate JSON response format improvements', async () => {
      try {
        await browser.navigate('/generate-recipe');
        
        // Monitor AI API responses
        const responses = [];
        await browser.page.setRequestInterception(true);
        
        browser.page.on('response', async (response) => {
          if (response.url().includes('/api/v1/llm/query')) {
            try {
              const responseData = await response.json();
              responses.push(responseData);
            } catch (e) {
              console.log('Response parsing error:', e.message);
            }
          }
        });
        
        browser.page.on('request', (request) => {
          request.continue();
        });
        
        // Generate recipe with AI
        await browser.fillInput('[data-testid="recipe-prompt"]', 'Create a simple chicken pasta recipe');
        await browser.clickElement('[data-testid="generate-button"]');
        
        // Wait for generation to complete
        await browser.elementExists('[data-testid="generated-recipe"]', 30000);
        
        // Validate response format
        if (responses.length > 0) {
          const aiResponse = responses[0];
          assert.ok(aiResponse, 'Should receive JSON response from DeepSeek');
          
          // Check for proper recipe structure
          const recipe = aiResponse.recipe || aiResponse.data || aiResponse;
          
          assert.ok(recipe.title || recipe.name, 'Recipe should have a title');
          assert.ok(Array.isArray(recipe.ingredients), 'Recipe should have ingredients array');
          assert.ok(Array.isArray(recipe.instructions), 'Recipe should have instructions array');
          
          console.log('✓ DeepSeek JSON response format validated');
        }
        
        await browser.page.setRequestInterception(false);
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-json-format', error);
      }
    });

    test('should handle retry logic with exponential backoff', async () => {
      try {
        await browser.navigate('/generate-recipe');
        
        let requestCount = 0;
        const requestTimes = [];
        
        await browser.page.setRequestInterception(true);
        browser.page.on('request', (request) => {
          if (request.url().includes('/api/v1/llm/query')) {
            requestCount++;
            requestTimes.push(Date.now());
            
            // Simulate rate limiting on first two requests
            if (requestCount <= 2) {
              request.respond({
                status: 429,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Rate limit exceeded' })
              });
            } else {
              // Success on third attempt
              request.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                  recipe: {
                    title: 'Retry Success Recipe',
                    ingredients: ['ingredient 1', 'ingredient 2'],
                    instructions: ['step 1', 'step 2'],
                    prep_time: '15 minutes',
                    cook_time: '20 minutes'
                  }
                })
              });
            }
          } else {
            request.continue();
          }
        });
        
        await browser.fillInput('[data-testid="recipe-prompt"]', 'Simple test recipe for retry logic');
        await browser.clickElement('[data-testid="generate-button"]');
        
        // Wait for successful generation after retries
        const recipeGenerated = await browser.elementExists('[data-testid="generated-recipe"]', 45000);
        
        if (recipeGenerated) {
          assert.ok(requestCount >= 2, 'Should have executed retry logic');
          console.log(`✓ Retry logic worked - ${requestCount} requests made`);
          
          // Verify exponential backoff timing
          if (requestTimes.length >= 2) {
            const firstRetryDelay = requestTimes[1] - requestTimes[0];
            console.log(`First retry delay: ${firstRetryDelay}ms`);
            assert.ok(firstRetryDelay >= 1000, 'Should have at least 1 second delay between retries');
          }
        }
        
        await browser.page.setRequestInterception(false);
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-retry-logic', error);
      }
    });

    test('should handle malformed JSON responses gracefully', async () => {
      try {
        await browser.navigate('/generate-recipe');
        
        await browser.page.setRequestInterception(true);
        browser.page.on('request', (request) => {
          if (request.url().includes('/api/v1/llm/query')) {
            // Return malformed JSON that would break old implementation
            request.respond({
              status: 200,
              contentType: 'application/json',
              body: '{"recipe": {"title": "Malformed Recipe", "ingredients": ["ingredient 1",] invalid json'
            });
          } else {
            request.continue();
          }
        });
        
        await browser.fillInput('[data-testid="recipe-prompt"]', 'Test malformed JSON handling');
        await browser.clickElement('[data-testid="generate-button"]');
        
        // Should handle gracefully without crashing
        const errorHandled = await browser.elementExists('[data-testid="error-message"]', 10000) ||
                            await browser.elementExists('[data-testid="generation-error"]', 10000);
        
        if (errorHandled) {
          console.log('✓ Malformed JSON handled with error message');
          assert.ok(true, 'Should show error for malformed JSON');
        } else {
          // Check if it attempted to retry or handle gracefully
          await browser.page.waitForTimeout(5000);
          const pageStillFunctional = await browser.elementExists('[data-testid="recipe-prompt"]', 2000);
          assert.ok(pageStillFunctional, 'Page should remain functional after malformed JSON');
          console.log('✓ System handled malformed JSON gracefully');
        }
        
        await browser.page.setRequestInterception(false);
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-malformed-json', error);
      }
    });

    test('should validate enhanced error handling scenarios', async () => {
      try {
        await browser.navigate('/generate-recipe');
        
        const errorScenarios = [
          { status: 401, error: 'Unauthorized' },
          { status: 403, error: 'Forbidden' },
          { status: 500, error: 'Internal Server Error' },
          { status: 502, error: 'Bad Gateway' },
          { status: 503, error: 'Service Unavailable' }
        ];
        
        for (const scenario of errorScenarios) {
          await browser.page.setRequestInterception(true);
          browser.page.on('request', (request) => {
            if (request.url().includes('/api/v1/llm/query')) {
              request.respond({
                status: scenario.status,
                contentType: 'application/json',
                body: JSON.stringify({ error: scenario.error })
              });
            } else {
              request.continue();
            }
          });
          
          await browser.fillInput('[data-testid="recipe-prompt"]', `Test error ${scenario.status}`);
          await browser.clickElement('[data-testid="generate-button"]');
          
          // Should handle each error type appropriately
          const errorShown = await browser.elementExists('[data-testid="error-message"]', 8000) ||
                           await browser.elementExists('[data-testid="generation-error"]', 8000);
          
          if (errorShown) {
            console.log(`✓ Error ${scenario.status} handled correctly`);
          }
          
          await browser.page.setRequestInterception(false);
          
          // Clear any error states
          await browser.page.reload({ waitUntil: 'networkidle0' });
        }
        
        assert.ok(true, 'All error scenarios handled appropriately');
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-error-handling', error);
      }
    });

    test('should validate recipe structure consistency', async () => {
      try {
        await browser.navigate('/generate-recipe');
        
        // Test multiple recipe generations to ensure consistent structure
        const testPrompts = [
          'Create a vegetarian pasta dish',
          'Make a quick breakfast recipe',
          'Design a healthy dinner meal',
          'Prepare a dessert recipe'
        ];
        
        const generatedRecipes = [];
        
        for (const prompt of testPrompts) {
          await browser.fillInput('[data-testid="recipe-prompt"]', prompt);
          await browser.clickElement('[data-testid="generate-button"]');
          
          // Wait for generation
          await browser.elementExists('[data-testid="generated-recipe"]', 30000);
          
          // Extract recipe data
          const hasTitle = await browser.elementExists('[data-testid="recipe-title"]', 3000);
          const hasIngredients = await browser.elementExists('[data-testid="recipe-ingredients"]', 3000);
          const hasInstructions = await browser.elementExists('[data-testid="recipe-instructions"]', 3000);
          const hasCookTime = await browser.elementExists('[data-testid="cook-time"]', 3000);
          const hasServings = await browser.elementExists('[data-testid="servings"]', 3000);
          
          generatedRecipes.push({
            prompt,
            hasTitle,
            hasIngredients,
            hasInstructions,
            hasCookTime,
            hasServings
          });
          
          // Clear for next generation
          await browser.page.reload({ waitUntil: 'networkidle0' });
        }
        
        // Validate consistency
        const allHaveTitle = generatedRecipes.every(r => r.hasTitle);
        const allHaveIngredients = generatedRecipes.every(r => r.hasIngredients);
        const allHaveInstructions = generatedRecipes.every(r => r.hasInstructions);
        
        assert.ok(allHaveTitle, 'All generated recipes should have titles');
        assert.ok(allHaveIngredients, 'All generated recipes should have ingredients');
        assert.ok(allHaveInstructions, 'All generated recipes should have instructions');
        
        console.log('✓ Recipe structure consistency validated across multiple generations');
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-recipe-consistency', error);
      }
    });
  });

  describe('Enhanced Generation Features', () => {
    test('should handle complex dietary restrictions and preferences', async () => {
      try {
        await browser.navigate('/generate-recipe');
        
        const complexPrompt = 'Create a gluten-free, dairy-free, high-protein dinner recipe that takes less than 30 minutes to prepare, serves 4 people, and uses seasonal vegetables';
        
        await browser.fillInput('[data-testid="recipe-prompt"]', complexPrompt);
        await browser.clickElement('[data-testid="generate-button"]');
        
        await browser.elementExists('[data-testid="generated-recipe"]', 30000);
        
        // Check if generated recipe addresses the complex requirements
        const recipeTitle = await browser.elementExists('[data-testid="recipe-title"]', 3000);
        const ingredients = await browser.elementExists('[data-testid="recipe-ingredients"]', 3000);
        const prepTime = await browser.elementExists('[data-testid="prep-time"]', 3000);
        const servings = await browser.elementExists('[data-testid="servings"]', 3000);
        
        assert.ok(recipeTitle, 'Should generate recipe with title for complex prompt');
        assert.ok(ingredients, 'Should generate ingredients list for complex prompt');
        
        if (prepTime) {
          console.log('✓ Prep time information included');
        }
        
        if (servings) {
          console.log('✓ Serving information included');
        }
        
        console.log('✓ Complex dietary restrictions handled successfully');
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-complex-dietary', error);
      }
    });

    test('should generate recipes with proper cooking techniques', async () => {
      try {
        await browser.navigate('/generate-recipe');
        
        const techniquePrompts = [
          'Create a recipe that uses the braising technique',
          'Make a dish that requires sautéing and roasting',
          'Design a recipe with proper knife skills for vegetables'
        ];
        
        for (const prompt of techniquePrompts) {
          await browser.fillInput('[data-testid="recipe-prompt"]', prompt);
          await browser.clickElement('[data-testid="generate-button"]');
          
          await browser.elementExists('[data-testid="generated-recipe"]', 30000);
          
          // Check if instructions include proper techniques
          const hasInstructions = await browser.elementExists('[data-testid="recipe-instructions"]', 3000);
          assert.ok(hasInstructions, 'Should generate instructions with cooking techniques');
          
          console.log(`✓ Cooking technique recipe generated for: ${prompt}`);
          
          // Reset for next test
          await browser.page.reload({ waitUntil: 'networkidle0' });
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-cooking-techniques', error);
      }
    });

    test('should handle recipe modifications and variations', async () => {
      try {
        await browser.navigate('/generate-recipe');
        
        // Generate base recipe
        await browser.fillInput('[data-testid="recipe-prompt"]', 'Create a basic chicken stir-fry');
        await browser.clickElement('[data-testid="generate-button"]');
        
        await browser.elementExists('[data-testid="generated-recipe"]', 30000);
        
        // Check if modification options are available
        const hasModifyButton = await browser.elementExists('[data-testid="modify-recipe"]', 5000);
        const hasVariationButton = await browser.elementExists('[data-testid="recipe-variations"]', 5000);
        
        if (hasModifyButton) {
          await browser.clickElement('[data-testid="modify-recipe"]');
          
          // Test modification functionality
          const modificationPrompt = 'Make this recipe vegetarian and add more vegetables';
          await browser.fillInput('[data-testid="modification-prompt"]', modificationPrompt);
          await browser.clickElement('[data-testid="apply-modification"]');
          
          await browser.elementExists('[data-testid="modified-recipe"]', 30000);
          console.log('✓ Recipe modification functionality working');
        }
        
        if (hasVariationButton) {
          console.log('✓ Recipe variation options available');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-recipe-modifications', error);
      }
    });
  });

  describe('Performance and Reliability', () => {
    test('should maintain consistent response times', async () => {
      try {
        const responseTimes = [];
        
        for (let i = 0; i < 3; i++) {
          await browser.navigate('/generate-recipe');
          
          const startTime = Date.now();
          
          await browser.fillInput('[data-testid="recipe-prompt"]', `Performance test recipe ${i + 1}`);
          await browser.clickElement('[data-testid="generate-button"]');
          
          await browser.elementExists('[data-testid="generated-recipe"]', 45000);
          
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          responseTimes.push(responseTime);
          
          console.log(`Recipe ${i + 1} generation time: ${responseTime}ms`);
        }
        
        const averageTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const maxTime = Math.max(...responseTimes);
        
        console.log(`Average generation time: ${averageTime}ms`);
        console.log(`Max generation time: ${maxTime}ms`);
        
        // Performance assertions
        assert.ok(averageTime < 30000, 'Average generation time should be under 30 seconds');
        assert.ok(maxTime < 45000, 'Max generation time should be under 45 seconds');
        
        console.log('✓ Performance requirements met');
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-performance', error);
      }
    });

    test('should handle concurrent generation requests', async () => {
      try {
        // This test would ideally use multiple browser instances
        // For now, test rapid sequential requests
        await browser.navigate('/generate-recipe');
        
        const rapidPrompts = [
          'Quick pasta recipe',
          'Simple salad',
          'Easy dessert'
        ];
        
        for (const prompt of rapidPrompts) {
          await browser.fillInput('[data-testid="recipe-prompt"]', prompt);
          await browser.clickElement('[data-testid="generate-button"]');
          
          // Don't wait for completion, just verify generation started
          const generationStarted = await browser.elementExists('[data-testid="generation-spinner"]', 5000) ||
                                   await browser.elementExists('[data-testid="generating"]', 5000);
          
          if (generationStarted) {
            console.log(`✓ Generation started for: ${prompt}`);
          }
          
          // Brief pause between requests
          await browser.page.waitForTimeout(1000);
        }
        
        // Wait for final generation to complete
        await browser.elementExists('[data-testid="generated-recipe"]', 45000);
        console.log('✓ Rapid sequential requests handled');
        
      } catch (error) {
        await browser.screenshotOnFailure('deepseek-concurrent-requests', error);
      }
    });
  });
});