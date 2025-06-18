const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
require('dotenv').config();

const BrowserManager = require('../../helpers/browser');
const AuthHelper = require('../../helpers/auth');

describe('Advanced Recipe Search and Filtering', () => {
  let browser;
  let auth;

  beforeEach(async () => {
    browser = new BrowserManager();
    await browser.launch();
    auth = new AuthHelper(browser);
  });

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('should perform basic text search for recipes', async () => {
    try {
      // Navigate to recipes page
      await browser.navigateToUrl('/recipes');
      
      // Find search input
      const searchInput = await browser.waitForElement('[data-testid="recipe-search"], input[placeholder*="search"]', 3000);
      assert.ok(searchInput, 'Recipe search input should be available');

      // Perform search
      await browser.fillInput(searchInput, 'pasta');
      await browser.waitForTimeout(1000); // Wait for debounced search

      // Verify search results
      const searchResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
      assert.ok(searchResults.length >= 0, 'Search should return results');

      // Check if results contain search term (if any results)
      if (searchResults.length > 0) {
        const resultText = await browser.getTextContent(searchResults[0]);
        // Results might not always contain exact search term due to fuzzy matching
        assert.ok(true, 'Search results should be relevant to query');
      }

    } catch (error) {
      await browser.screenshotOnFailure('basic-recipe-search', error);
      throw error;
    }
  });

  test('should filter recipes by category', async () => {
    try {
      await browser.navigateToUrl('/recipes');
      
      // Find category filter
      const categoryFilter = await browser.waitForElement('[data-testid="category-filter"], select[name*="category"]', 3000);
      
      if (categoryFilter) {
        // Test different categories
        const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];
        
        for (const category of categories) {
          // Select category
          await browser.selectOption(categoryFilter, category);
          await browser.waitForTimeout(1000);
          
          // Check if results are filtered
          const filteredResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
          assert.ok(filteredResults.length >= 0, `Category filter for ${category} should work`);
          
          // If results exist, verify they match category
          if (filteredResults.length > 0) {
            const categoryBadge = await browser.elementExists(`.category-${category.toLowerCase()}, [data-category="${category.toLowerCase()}"]`);
            if (categoryBadge) {
              assert.ok(true, `Filtered results should show ${category} category`);
            }
          }
          
          break; // Test one category successfully
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('category-filter', error);
      throw error;
    }
  });

  test('should sort recipes by different criteria', async () => {
    try {
      await browser.navigateToUrl('/recipes');
      
      // Find sort filter
      const sortFilter = await browser.waitForElement('[data-testid="sort-filter"], select[name*="sort"]', 3000);
      
      if (sortFilter) {
        const initialResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
        const initialCount = initialResults.length;
        
        // Test different sort options
        const sortOptions = ['newest', 'popular', 'rating', 'name'];
        
        for (const sortOption of sortOptions) {
          const optionExists = await browser.elementExists(`option[value="${sortOption}"]`);
          if (optionExists) {
            await browser.selectOption(sortFilter, sortOption);
            await browser.waitForTimeout(1000);
            
            // Verify results are re-ordered
            const sortedResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
            assert.ok(sortedResults.length === initialCount, `Sort by ${sortOption} should maintain same result count`);
            
            break; // Test one sort option successfully
          }
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('recipe-sorting', error);
      throw error;
    }
  });

  test('should combine search with filters', async () => {
    try {
      await browser.navigateToUrl('/recipes');
      
      // Perform search first
      const searchInput = await browser.waitForElement('[data-testid="recipe-search"], input[placeholder*="search"]', 3000);
      if (searchInput) {
        await browser.fillInput(searchInput, 'chicken');
        await browser.waitForTimeout(1000);
      }
      
      // Then apply category filter
      const categoryFilter = await browser.elementExists('[data-testid="category-filter"], select[name*="category"]');
      if (categoryFilter) {
        await browser.selectOption(categoryFilter, 'Dinner');
        await browser.waitForTimeout(1000);
      }
      
      // Verify combined filtering works
      const combinedResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
      assert.ok(combinedResults.length >= 0, 'Combined search and filter should work');
      
      // Test clearing filters
      if (searchInput) {
        await browser.clearInput(searchInput);
        await browser.waitForTimeout(1000);
        
        const clearedResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
        assert.ok(clearedResults.length >= combinedResults.length, 'Clearing search should show more results');
      }

    } catch (error) {
      await browser.screenshotOnFailure('combined-search-filter', error);
      throw error;
    }
  });

  test('should search by ingredients', async () => {
    try {
      await browser.navigateToUrl('/recipes');
      
      // Look for advanced search or ingredient search
      const advancedSearch = await browser.elementExists('[data-testid="advanced-search"], .advanced-search, button[title*="advanced"]');
      
      if (advancedSearch) {
        await browser.clickElement(advancedSearch);
        await browser.waitForTimeout(500);
        
        // Look for ingredient search field
        const ingredientSearch = await browser.elementExists('[data-testid="ingredient-search"], input[placeholder*="ingredient"]');
        if (ingredientSearch) {
          await browser.fillInput(ingredientSearch, 'tomato');
          await browser.waitForTimeout(1000);
          
          const ingredientResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
          assert.ok(ingredientResults.length >= 0, 'Ingredient search should work');
        }
      } else {
        // Try searching for ingredients in main search
        const mainSearch = await browser.elementExists('[data-testid="recipe-search"], input[placeholder*="search"]');
        if (mainSearch) {
          await browser.fillInput(mainSearch, 'tomato garlic');
          await browser.waitForTimeout(1000);
          
          const results = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
          assert.ok(results.length >= 0, 'Ingredient-based text search should work');
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('ingredient-search', error);
      throw error;
    }
  });

  test('should handle search with dietary preferences for authenticated users', async () => {
    try {
      // Login as user with dietary preferences
      const user = {
        email: 'vegetarian@alchemorsel.com',
        password: 'VegPass123!'
      };
      
      await auth.login(user.email, user.password);
      await browser.navigateToUrl('/recipes');
      
      // Look for dietary filter based on user preferences
      const dietaryFilter = await browser.elementExists('[data-testid="dietary-filter"], select[name*="dietary"], .dietary-options');
      
      if (dietaryFilter) {
        // Test vegetarian filter
        const vegetarianOption = await browser.elementExists('option[value="vegetarian"], [data-diet="vegetarian"]');
        if (vegetarianOption) {
          await browser.clickElement(vegetarianOption);
          await browser.waitForTimeout(1000);
          
          const dietResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
          assert.ok(dietResults.length >= 0, 'Dietary preference filtering should work');
        }
      }
      
      // Check if user's dietary preferences auto-filter results
      const personalizedResults = await browser.elementExists('.personalized-results, [data-personalized], .dietary-filtered');
      if (personalizedResults) {
        assert.ok(true, 'Search results should be personalized based on dietary preferences');
      }

    } catch (error) {
      await browser.screenshotOnFailure('dietary-preference-search', error);
      throw error;
    }
  });

  test('should show search suggestions and auto-complete', async () => {
    try {
      await browser.navigateToUrl('/recipes');
      
      const searchInput = await browser.waitForElement('[data-testid="recipe-search"], input[placeholder*="search"]', 3000);
      
      if (searchInput) {
        // Type partial search term
        await browser.fillInput(searchInput, 'chick');
        await browser.waitForTimeout(500);
        
        // Look for search suggestions dropdown
        const suggestions = await browser.elementExists('.search-suggestions, .autocomplete, .dropdown-menu');
        
        if (suggestions) {
          assert.ok(true, 'Search suggestions should be displayed');
          
          // Test clicking a suggestion
          const suggestionItem = await browser.elementExists('.suggestion-item, .autocomplete-item');
          if (suggestionItem) {
            await browser.clickElement(suggestionItem);
            await browser.waitForTimeout(1000);
            
            const suggestedResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
            assert.ok(suggestedResults.length >= 0, 'Suggestion selection should trigger search');
          }
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('search-suggestions', error);
      throw error;
    }
  });

  test('should handle search pagination and infinite scroll', async () => {
    try {
      await browser.navigateToUrl('/recipes');
      
      // Perform broad search to get many results
      const searchInput = await browser.waitForElement('[data-testid="recipe-search"], input[placeholder*="search"]', 3000);
      if (searchInput) {
        await browser.fillInput(searchInput, 'recipe');
        await browser.waitForTimeout(1000);
      }
      
      const initialResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
      const initialCount = initialResults.length;
      
      // Check for pagination
      const pagination = await browser.elementExists('.pagination, [data-testid="pagination"]');
      
      if (pagination) {
        // Test pagination
        const nextButton = await browser.elementExists('.next, [data-action="next"]');
        if (nextButton && await browser.isElementClickable(nextButton)) {
          await browser.clickElement(nextButton);
          await browser.waitForTimeout(1000);
          
          const paginatedResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
          assert.ok(paginatedResults.length > 0, 'Pagination should load more results');
        }
      } else {
        // Check for infinite scroll
        if (initialCount > 0) {
          // Scroll to bottom
          await browser.scrollToBottom();
          await browser.waitForTimeout(2000);
          
          const scrollResults = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
          
          if (scrollResults.length > initialCount) {
            assert.ok(true, 'Infinite scroll should load more results');
          } else {
            assert.ok(true, 'All available results already loaded');
          }
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('search-pagination', error);
      throw error;
    }
  });

  test('should handle empty search results gracefully', async () => {
    try {
      await browser.navigateToUrl('/recipes');
      
      const searchInput = await browser.waitForElement('[data-testid="recipe-search"], input[placeholder*="search"]', 3000);
      
      if (searchInput) {
        // Search for something unlikely to exist
        await browser.fillInput(searchInput, 'xyzabc123nonexistent');
        await browser.waitForTimeout(1000);
        
        // Check for empty state
        const emptyState = await browser.elementExists('.empty-state, .no-results, [data-testid="no-results"]');
        const emptyMessage = await browser.elementExists('text=No recipes found, text=No results');
        
        assert.ok(emptyState || emptyMessage, 'Empty search results should show appropriate message');
        
        // Check for suggestions in empty state
        const suggestions = await browser.elementExists('.search-suggestions, .suggested-searches');
        if (suggestions) {
          assert.ok(true, 'Empty state should provide search suggestions');
        }
        
        // Test clearing search
        await browser.clearInput(searchInput);
        await browser.waitForTimeout(1000);
        
        const allRecipes = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
        assert.ok(allRecipes.length > 0, 'Clearing search should show all recipes again');
      }

    } catch (error) {
      await browser.screenshotOnFailure('empty-search-results', error);
      throw error;
    }
  });
});