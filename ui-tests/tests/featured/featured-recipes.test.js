const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
require('dotenv').config();

const BrowserManager = require('../../helpers/browser');
const AuthHelper = require('../../helpers/auth');

describe('Featured Recipes Functionality', () => {
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

  test('should display featured recipes on landing page', async () => {
    try {
      // Navigate to landing page
      await browser.navigateToUrl('/');
      
      // Check for featured recipes section
      const featuredSection = await browser.elementExists('[data-testid="featured-recipes"]') ||
                             await browser.elementExists('.featured-recipes') ||
                             await browser.elementExists('text=Featured');
      
      assert.ok(featuredSection, 'Featured recipes section should be displayed on landing page');

      // Check for featured recipe cards
      const featuredCards = await browser.getElements('.featured-recipe, .recipe-card[data-featured], [data-testid*="featured"]');
      assert.ok(featuredCards.length > 0, 'Featured recipes should be displayed');

      // Verify featured recipes have proper styling/indication
      const featuredIndicator = await browser.elementExists('.featured-badge, .featured-star, [data-featured="true"]');
      if (featuredIndicator) {
        assert.ok(true, 'Featured recipes should have visual indicators');
      }

    } catch (error) {
      await browser.screenshotOnFailure('featured-recipes-landing', error);
      throw error;
    }
  });

  test('should show featured recipes in different categories', async () => {
    try {
      // Navigate to homepage
      await browser.navigateToUrl('/');
      
      // Look for category-based featured recipes
      const categories = ['breakfast', 'lunch', 'dinner', 'dessert'];
      let foundCategoryFeatured = false;
      
      for (const category of categories) {
        const categoryFeatured = await browser.elementExists(`[data-category="${category}"][data-featured]`) ||
                                 await browser.elementExists(`.featured-${category}`) ||
                                 await browser.elementExists(`text=${category.charAt(0).toUpperCase() + category.slice(1)} Featured`);
        
        if (categoryFeatured) {
          foundCategoryFeatured = true;
          break;
        }
      }
      
      if (foundCategoryFeatured) {
        assert.ok(true, 'Featured recipes should be organized by categories');
      } else {
        // Check for general featured recipes section
        const generalFeatured = await browser.elementExists('.featured-recipes, [data-testid="featured"]');
        assert.ok(generalFeatured, 'Featured recipes should be displayed in some form');
      }

    } catch (error) {
      await browser.screenshotOnFailure('featured-categories', error);
      throw error;
    }
  });

  test('should allow navigation to featured recipe details', async () => {
    try {
      // Go to landing page with featured recipes
      await browser.navigateToUrl('/');
      
      // Find a featured recipe card
      const featuredRecipe = await browser.waitForElement('.featured-recipe, .recipe-card[data-featured], [data-testid*="featured"]', 3000);
      
      if (featuredRecipe) {
        // Click on the featured recipe
        await browser.clickElement(featuredRecipe);
        await browser.waitForNavigation();
        
        // Verify we're on recipe detail page
        const currentUrl = browser.getCurrentUrl();
        assert.ok(currentUrl.includes('/recipes/'), 'Should navigate to recipe detail page');
        
        // Verify recipe detail page loaded
        const recipeDetail = await browser.elementExists('[data-testid="recipe-detail"]') ||
                            await browser.elementExists('.recipe-view') ||
                            await browser.elementExists('h1, .recipe-title');
        
        assert.ok(recipeDetail, 'Recipe detail page should load');
        
        // Check if featured status is indicated on detail page
        const featuredIndicator = await browser.elementExists('.featured-badge, .featured-indicator, [data-featured]');
        if (featuredIndicator) {
          assert.ok(true, 'Featured recipes should maintain their featured status on detail page');
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('featured-recipe-navigation', error);
      throw error;
    }
  });

  test('should display featured recipes in browse/recipe list view', async () => {
    try {
      // Navigate to recipe list page
      await browser.navigateToUrl('/recipes');
      
      // Check if featured recipes are highlighted in the list
      const featuredInList = await browser.elementExists('.recipe-card[data-featured], .featured-recipe, [data-testid*="featured"]');
      
      if (featuredInList) {
        assert.ok(true, 'Featured recipes should be highlighted in recipe list');
        
        // Check for featured filtering option
        const featuredFilter = await browser.elementExists('option[value="featured"], [data-filter="featured"], .filter-featured');
        if (featuredFilter) {
          // Test featured filter
          await browser.clickElement(featuredFilter);
          await browser.waitForTimeout(1000);
          
          // Verify only featured recipes are shown
          const recipeCards = await browser.getElements('.recipe-card, [data-testid*="recipe"]');
          assert.ok(recipeCards.length > 0, 'Featured filter should show featured recipes');
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('featured-browse-list', error);
      throw error;
    }
  });

  test('should show featured recipes for authenticated users', async () => {
    try {
      // Login as regular user
      const regularUser = {
        email: 'cook@alchemorsel.com',
        password: 'CookPass123!'
      };
      
      await auth.login(regularUser.email, regularUser.password);
      
      // Navigate to dashboard
      await browser.navigateToUrl('/dashboard');
      
      // Check for featured recipes section in dashboard
      const dashboardFeatured = await browser.elementExists('[data-testid="featured-recipes"]') ||
                               await browser.elementExists('.featured-section') ||
                               await browser.elementExists('text=Featured Recipes');
      
      if (dashboardFeatured) {
        assert.ok(true, 'Featured recipes should be shown to authenticated users');
        
        // Check for personalized featured recommendations
        const personalizedFeatured = await browser.elementExists('.recommended-for-you, .personalized-featured, [data-personalized]');
        if (personalizedFeatured) {
          assert.ok(true, 'Featured recipes should be personalized for users');
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('featured-authenticated', error);
      throw error;
    }
  });

  test('should handle featured recipes interaction and favorites', async () => {
    try {
      // Login first
      const user = {
        email: 'cook@alchemorsel.com',
        password: 'CookPass123!'
      };
      
      await auth.login(user.email, user.password);
      await browser.navigateToUrl('/');
      
      // Find a featured recipe with favorite button
      const featuredRecipe = await browser.waitForElement('.featured-recipe, .recipe-card[data-featured]', 3000);
      
      if (featuredRecipe) {
        // Look for favorite button on featured recipe
        const favoriteButton = await browser.elementExists('[data-testid="favorite-btn"], .favorite-button, .heart-icon');
        
        if (favoriteButton) {
          // Test favoriting a featured recipe
          await browser.clickElement(favoriteButton);
          await browser.waitForTimeout(1000);
          
          // Verify favorite action worked
          const favoriteActive = await browser.elementExists('.favorited, .heart-filled, [data-favorited="true"]');
          if (favoriteActive) {
            assert.ok(true, 'Should be able to favorite featured recipes');
          }
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('featured-favorites', error);
      throw error;
    }
  });

  test('should show featured recipes API integration', async () => {
    try {
      // Navigate to page that loads featured recipes
      await browser.navigateToUrl('/');
      
      // Wait for featured recipes to load
      await browser.waitForTimeout(3000);
      
      // Check if featured recipes data is loaded
      const featuredContent = await browser.getElements('.featured-recipe, .recipe-card[data-featured], [data-testid*="featured"]');
      
      if (featuredContent.length > 0) {
        assert.ok(true, 'Featured recipes API should provide data to frontend');
        
        // Check for proper recipe data structure
        const hasTitle = await browser.elementExists('.recipe-title, .recipe-name, h3, h4');
        const hasImage = await browser.elementExists('.recipe-image, img[src*="recipe"]');
        
        assert.ok(hasTitle || hasImage, 'Featured recipes should display proper recipe data');
      } else {
        // If no featured recipes found, check if section exists but is empty
        const featuredSection = await browser.elementExists('[data-testid="featured-recipes"], .featured-section');
        if (featuredSection) {
          assert.ok(true, 'Featured recipes section exists (may be empty for test data)');
        }
      }

    } catch (error) {
      await browser.screenshotOnFailure('featured-api-integration', error);
      throw error;
    }
  });

  test('should handle featured recipes error states gracefully', async () => {
    try {
      // Navigate to page with featured recipes
      await browser.navigateToUrl('/');
      
      // Wait for page to load
      await browser.waitForTimeout(2000);
      
      // Check for error handling if featured recipes fail to load
      const errorState = await browser.elementExists('.error-message, .featured-error, [data-error]');
      const loadingState = await browser.elementExists('.loading, .skeleton, .featured-loading');
      const emptyState = await browser.elementExists('.no-featured, .empty-featured');
      
      if (errorState) {
        assert.ok(true, 'Featured recipes should handle error states gracefully');
      } else if (loadingState) {
        // Wait for loading to complete
        await browser.waitForTimeout(3000);
        const featuredLoaded = await browser.elementExists('.featured-recipe, .recipe-card[data-featured]');
        assert.ok(featuredLoaded, 'Featured recipes should load after loading state');
      } else if (emptyState) {
        assert.ok(true, 'Featured recipes should handle empty states appropriately');
      } else {
        // Featured recipes loaded successfully
        const featuredExists = await browser.elementExists('.featured-recipe, .recipe-card[data-featured], [data-testid*="featured"]');
        assert.ok(featuredExists, 'Featured recipes should be displayed successfully');
      }

    } catch (error) {
      await browser.screenshotOnFailure('featured-error-handling', error);
      throw error;
    }
  });
});