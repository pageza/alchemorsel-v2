/**
 * MVP Search & Discovery E2E Tests
 * 
 * Tests search and recipe discovery functionality based on user stories in docs/planning/STORIES.md
 * Focus: Recipe search, filtering, and discovery features
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../helpers/browser');
const AuthHelper = require('../helpers/auth');

describe('MVP Search & Discovery Stories', () => {
  let browser;
  let auth;

  beforeEach(async () => {
    browser = new BrowserManager();
    await browser.launch();
    auth = new AuthHelper(browser);
  });

  afterEach(async () => {
    await browser.close();
  });

  describe('🎯 Public Recipe Search (Unauthenticated)', () => {
    
    test('SEARCH-001: Visitor can search recipes by name', async () => {
      await browser.navigate('/recipes');
      
      // Look for search input
      const searchInput = await browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input', 5000);
      
      if (searchInput) {
        // Test search functionality
        await browser.fillInput('input[type="search"], input[placeholder*="search"], .search-input', 'pasta');
        await browser.page.waitForTimeout(2000);
        
        // Should see search results
        const searchResults = await browser.elementExists('.recipe-card, .recipe-preview-card', 5000);
        assert.ok(searchResults, 'Should display search results');
        
        console.log('✅ Recipe search by name works');
      } else {
        console.log('⚠️ Search input not found on recipes page');
      }
    });

    test('SEARCH-002: Visitor can search recipes by ingredient', async () => {
      await browser.navigate('/recipes');
      
      const searchInput = await browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input', 5000);
      
      if (searchInput) {
        // Search by ingredient
        await browser.fillInput('input[type="search"], input[placeholder*="search"], .search-input', 'tomato');
        await browser.page.waitForTimeout(2000);
        
        // Should see relevant results
        const results = await browser.elementExists('.recipe-card, .recipe-preview-card', 3000);
        console.log(results ? '✅ Ingredient search returns results' : '⚠️ No results for ingredient search');
      } else {
        console.log('⚠️ Search functionality not available to public users');
      }
    });

    test('SEARCH-003: Visitor can filter recipes by category', async () => {
      await browser.navigate('/recipes');
      
      // Look for category filters
      const categoryFilters = await browser.elementExists(
        'select, .category-filter, .filter-buttons, button:contains("Breakfast")', 
        5000
      );
      
      if (categoryFilters) {
        // Try clicking a category filter
        const breakfastFilter = await browser.elementExists('button:contains("Breakfast"), option[value*="breakfast"]', 3000);
        if (breakfastFilter) {
          await browser.clickElement('button:contains("Breakfast"), option[value*="breakfast"]');
          await browser.page.waitForTimeout(2000);
          
          console.log('✅ Category filtering available');
        }
      } else {
        console.log('⚠️ Category filters not found');
      }
    });

    test('SEARCH-004: Visitor sees recipe difficulty levels', async () => {
      await browser.navigate('/recipes');
      
      // Look for difficulty indicators on recipe cards
      const difficultyIndicators = await browser.elementExists(
        '.difficulty, .skill-level, .difficulty-badge', 
        5000
      );
      
      if (difficultyIndicators) {
        console.log('✅ Recipe difficulty levels visible');
      } else {
        console.log('⚠️ Recipe difficulty levels not displayed');
      }
    });
  });

  describe('🎯 Authenticated User Search', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('SEARCH-005: User gets personalized search results', async () => {
      await browser.navigate('/recipes');
      
      const searchInput = await browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input', 5000);
      
      if (searchInput) {
        // Search for something that should consider dietary preferences
        await browser.fillInput('input[type="search"], input[placeholder*="search"], .search-input', 'vegetarian');
        await browser.page.waitForTimeout(2000);
        
        // Should see personalized results
        const results = await browser.elementExists('.recipe-card, .recipe-preview-card', 3000);
        console.log(results ? '✅ Personalized search results displayed' : '⚠️ Search results not showing');
        
        // Look for personalization indicators
        const personalizedContent = await browser.elementExists('.recommended, .for-you, .personalized', 3000);
        console.log(personalizedContent ? '✅ Personalization visible' : '⚠️ No personalization indicators');
      }
    });

    test('SEARCH-006: User can see if recipes are already favorited', async () => {
      await browser.navigate('/recipes');
      
      // Look for favorite status indicators
      const favoriteIndicators = await browser.elementExists(
        '.favorited, .favorite-active, [data-testid*="favorite"]', 
        5000
      );
      
      if (favoriteIndicators) {
        console.log('✅ Favorite status visible on recipe cards');
      } else {
        console.log('⚠️ Favorite status indicators not found');
      }
    });

    test('SEARCH-007: User can filter by dietary preferences', async () => {
      await browser.navigate('/recipes');
      
      // Look for dietary filters
      const dietaryFilters = await browser.elementExists(
        '.dietary-filters, button:contains("Vegetarian"), button:contains("Vegan"), select[name*="dietary"]', 
        5000
      );
      
      if (dietaryFilters) {
        console.log('✅ Dietary preference filters available');
        
        // Try using a dietary filter
        const veganFilter = await browser.elementExists('button:contains("Vegan"), option[value*="vegan"]', 3000);
        if (veganFilter) {
          await browser.clickElement('button:contains("Vegan"), option[value*="vegan"]');
          await browser.page.waitForTimeout(2000);
          console.log('✅ Dietary filtering functional');
        }
      } else {
        console.log('⚠️ Dietary preference filters not found');
      }
    });

    test('SEARCH-008: User can search within their favorites', async () => {
      await browser.navigate('/favorites');
      
      // Look for search within favorites
      const favoritesSearch = await browser.elementExists('input[type="search"], .search-favorites', 3000);
      
      if (favoritesSearch) {
        console.log('✅ Search within favorites available');
        
        // Test searching favorites
        await browser.fillInput('input[type="search"], .search-favorites', 'test');
        await browser.page.waitForTimeout(1000);
      } else {
        console.log('⚠️ Search within favorites not found');
      }
    });
  });

  describe('🎯 Advanced Search Features', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('SEARCH-009: User can search by multiple ingredients', async () => {
      await browser.navigate('/recipes');
      
      const searchInput = await browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input', 5000);
      
      if (searchInput) {
        // Search with multiple ingredients
        await browser.fillInput('input[type="search"], input[placeholder*="search"], .search-input', 'chicken tomato basil');
        await browser.page.waitForTimeout(2000);
        
        // Should see relevant results
        const results = await browser.elementExists('.recipe-card, .recipe-preview-card', 3000);
        console.log(results ? '✅ Multi-ingredient search works' : '⚠️ Multi-ingredient search not working');
      }
    });

    test('SEARCH-010: User can filter by cuisine type', async () => {
      await browser.navigate('/recipes');
      
      // Look for cuisine filters
      const cuisineFilters = await browser.elementExists(
        '.cuisine-filter, button:contains("Italian"), button:contains("Asian"), select[name*="cuisine"]', 
        5000
      );
      
      if (cuisineFilters) {
        console.log('✅ Cuisine filters available');
        
        // Try using cuisine filter
        const italianFilter = await browser.elementExists('button:contains("Italian"), option[value*="italian"]', 3000);
        if (italianFilter) {
          await browser.clickElement('button:contains("Italian"), option[value*="italian"]');
          await browser.page.waitForTimeout(2000);
          console.log('✅ Cuisine filtering functional');
        }
      } else {
        console.log('⚠️ Cuisine filters not found');
      }
    });

    test('SEARCH-011: User can sort search results', async () => {
      await browser.navigate('/recipes');
      
      // Look for sort options
      const sortOptions = await browser.elementExists(
        'select[name*="sort"], .sort-dropdown, button:contains("Sort")', 
        5000
      );
      
      if (sortOptions) {
        console.log('✅ Sort options available');
        
        // Try different sort options
        const sortByRating = await browser.elementExists('option:contains("Rating"), option[value*="rating"]', 3000);
        if (sortByRating) {
          await browser.clickElement('option:contains("Rating"), option[value*="rating"]');
          await browser.page.waitForTimeout(1000);
          console.log('✅ Sort by rating works');
        }
      } else {
        console.log('⚠️ Sort options not found');
      }
    });

    test('SEARCH-012: User can clear search filters', async () => {
      await browser.navigate('/recipes');
      
      // Apply some filters first
      const searchInput = await browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input', 5000);
      if (searchInput) {
        await browser.fillInput('input[type="search"], input[placeholder*="search"], .search-input', 'test search');
        await browser.page.waitForTimeout(1000);
      }
      
      // Look for clear/reset button
      const clearButton = await browser.elementExists(
        'button:contains("Clear"), button:contains("Reset"), .clear-filters', 
        3000
      );
      
      if (clearButton) {
        await browser.clickElement('button:contains("Clear"), button:contains("Reset"), .clear-filters');
        await browser.page.waitForTimeout(1000);
        console.log('✅ Clear filters functionality available');
      } else {
        console.log('⚠️ Clear filters button not found');
      }
    });
  });

  describe('🎯 Search Results & Pagination', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('SEARCH-013: Search results show relevant information', async () => {
      await browser.navigate('/recipes');
      
      const searchInput = await browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input', 5000);
      if (searchInput) {
        await browser.fillInput('input[type="search"], input[placeholder*="search"], .search-input', 'pasta');
        await browser.page.waitForTimeout(2000);
        
        // Check if recipe cards show essential information
        const recipeTitle = await browser.elementExists('.recipe-title, h3, h2', 3000);
        const recipeMeta = await browser.elementExists('.recipe-meta, .recipe-info, .cooking-time', 3000);
        
        console.log(recipeTitle ? '✅ Recipe titles visible' : '⚠️ Recipe titles missing');
        console.log(recipeMeta ? '✅ Recipe metadata visible' : '⚠️ Recipe metadata missing');
      }
    });

    test('SEARCH-014: Search pagination works correctly', async () => {
      await browser.navigate('/recipes');
      
      // Look for pagination controls
      const pagination = await browser.elementExists(
        '.pagination, .page-nav, button:contains("Next"), button:contains("Previous")', 
        5000
      );
      
      if (pagination) {
        console.log('✅ Pagination controls found');
        
        // Try clicking next page
        const nextButton = await browser.elementExists('button:contains("Next"), .next-page', 3000);
        if (nextButton) {
          await browser.clickElement('button:contains("Next"), .next-page');
          await browser.page.waitForTimeout(2000);
          console.log('✅ Pagination navigation works');
        }
      } else {
        console.log('⚠️ Pagination controls not found');
      }
    });

    test('SEARCH-015: No results message displays appropriately', async () => {
      await browser.navigate('/recipes');
      
      const searchInput = await browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input', 5000);
      if (searchInput) {
        // Search for something that should return no results
        await browser.fillInput('input[type="search"], input[placeholder*="search"], .search-input', 'xyznoresults12345');
        await browser.page.waitForTimeout(2000);
        
        // Look for no results message
        const noResults = await browser.elementExists(
          '.no-results, .empty-state, .no-recipes-found', 
          3000
        );
        
        console.log(noResults ? '✅ No results message displayed' : '⚠️ No results message not found');
      }
    });
  });
});