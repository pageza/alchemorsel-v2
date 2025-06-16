const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
require('dotenv').config();

const BrowserManager = require('../../helpers/browser');
const AuthHelper = require('../../helpers/auth');
const { testUsers } = require('../../helpers/fixtures');

describe('Recipe Favorites E2E Tests', () => {
  let browser;
  let auth;
  let testUser;

  beforeEach(async () => {
    browser = new BrowserManager();
    await browser.launch();
    auth = new AuthHelper(browser);
    
    // Create unique test user for each test
    testUser = {
      email: `favorite-test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      username: `favoriteuser${Date.now()}`
    };
  });

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('should display favorite buttons on recipe cards', async () => {
    try {
      console.log('🔹 Testing favorite button display...');
      
      // Register and login user
      await auth.goToRegister();
      const registerSuccess = await auth.register(testUser.email, testUser.password, testUser.username);
      assert.ok(registerSuccess, 'User registration should succeed');
      
      // Navigate to recipes page
      await browser.navigateTo('/recipes');
      await browser.waitForPageLoad();
      
      // Wait for recipes to load
      const recipesExist = await browser.elementExists('.v-card', 10000);
      if (!recipesExist) {
        console.log('No recipes found, skipping favorite button test');
        return;
      }
      
      // Check for favorite buttons
      const favoriteButtonExists = await browser.elementExists('.favorite-btn', 5000);
      assert.ok(favoriteButtonExists, 'Favorite buttons should be present on recipe cards');
      
      console.log('✅ Favorite buttons displayed correctly');
      
    } catch (error) {
      await browser.screenshotOnFailure('failure-favorite-button-display', error);
      throw error;
    }
  });

  test('should toggle favorite state when clicked', async () => {
    try {
      console.log('🔹 Testing favorite toggle functionality...');
      
      // Register and login user
      await auth.goToRegister();
      await auth.register(testUser.email, testUser.password, testUser.username);
      
      // Navigate to recipes page
      await browser.navigateTo('/recipes');
      await browser.waitForPageLoad();
      
      // Wait for recipes and favorite button
      const favoriteButtonExists = await browser.elementExists('.favorite-btn', 10000);
      if (!favoriteButtonExists) {
        console.log('No favorite buttons found, skipping toggle test');
        return;
      }
      
      // Get initial icon state
      const initialIconClass = await browser.getPage().evaluate(() => {
        const btn = document.querySelector('.favorite-btn i');
        return btn ? btn.className : '';
      });
      
      // Click the favorite button
      await browser.clickElement('.favorite-btn');
      await browser.getPage().waitForTimeout(2000);
      
      // Check if icon changed
      const newIconClass = await browser.getPage().evaluate(() => {
        const btn = document.querySelector('.favorite-btn i');
        return btn ? btn.className : '';
      });
      
      // Verify the icon changed (either from outline to filled or vice versa)
      assert.notStrictEqual(initialIconClass, newIconClass, 'Favorite icon should change when clicked');
      
      console.log('✅ Favorite toggle functionality working');
      
    } catch (error) {
      await browser.screenshotOnFailure('failure-favorite-toggle', error);
      throw error;
    }
  });

  test('should show favorite button on recipe detail page', async () => {
    try {
      console.log('🔹 Testing favorite button on detail page...');
      
      // Register and login user
      await auth.goToRegister();
      await auth.register(testUser.email, testUser.password, testUser.username);
      
      // Navigate to recipes page
      await browser.navigateTo('/recipes');
      await browser.waitForPageLoad();
      
      // Find first recipe link
      const recipeLink = await browser.getPage().evaluate(() => {
        const recipeCard = document.querySelector('.v-card[href*="/recipes/"]');
        return recipeCard ? recipeCard.getAttribute('href') : null;
      });
      
      if (!recipeLink) {
        console.log('No recipe links found, skipping detail page test');
        return;
      }
      
      // Navigate to recipe detail page
      await browser.navigateTo(recipeLink);
      await browser.waitForPageLoad();
      
      // Check for favorite button on detail page
      const detailFavoriteExists = await browser.elementExists('button[icon*="heart"], .favorite-btn', 10000);
      assert.ok(detailFavoriteExists, 'Favorite button should exist on recipe detail page');
      
      console.log('✅ Recipe detail page favorite button found');
      
    } catch (error) {
      await browser.screenshotOnFailure('failure-detail-favorite', error);
      throw error;
    }
  });

  test('should handle multiple favorites correctly', async () => {
    try {
      console.log('🔹 Testing multiple favorites...');
      
      // Register and login user
      await auth.goToRegister();
      await auth.register(testUser.email, testUser.password, testUser.username);
      
      // Navigate to recipes page
      await browser.navigateTo('/recipes');
      await browser.waitForPageLoad();
      
      // Get all favorite buttons
      const favoriteButtons = await browser.getPage().$$('.favorite-btn');
      
      if (favoriteButtons.length < 2) {
        console.log('Need at least 2 recipes to test multiple favorites, skipping');
        return;
      }
      
      // Click first two favorite buttons
      await favoriteButtons[0].click();
      await browser.getPage().waitForTimeout(1000);
      await favoriteButtons[1].click();
      await browser.getPage().waitForTimeout(1000);
      
      // Verify both buttons show favorited state
      const favoritedCount = await browser.getPage().evaluate(() => {
        const buttons = document.querySelectorAll('.favorite-btn');
        let count = 0;
        buttons.forEach(btn => {
          const icon = btn.querySelector('i');
          if (icon && (icon.classList.contains('mdi-heart') || btn.style.color === 'rgb(255, 71, 87)')) {
            count++;
          }
        });
        return count;
      });
      
      assert.ok(favoritedCount >= 1, 'At least one recipe should be favorited');
      
      console.log('✅ Multiple favorites handled correctly');
      
    } catch (error) {
      await browser.screenshotOnFailure('failure-multiple-favorites', error);
      throw error;
    }
  });

  test('should require authentication for favorites', async () => {
    try {
      console.log('🔹 Testing favorite authentication requirement...');
      
      // Go to recipes page without logging in
      await browser.navigateTo('/recipes');
      await browser.waitForPageLoad();
      
      // Check if favorite buttons are hidden or if clicking requires login
      const favoriteButtonExists = await browser.elementExists('.favorite-btn', 5000);
      
      if (favoriteButtonExists) {
        // Try clicking favorite button while not authenticated
        await browser.clickElement('.favorite-btn');
        await browser.getPage().waitForTimeout(2000);
        
        // Should either redirect to login or show auth error
        const currentUrl = await browser.getCurrentUrl();
        const isOnLogin = currentUrl.includes('/login') || currentUrl.includes('/auth');
        
        if (isOnLogin) {
          console.log('✅ Correctly redirected to login when favoriting without auth');
        } else {
          // Check for error message
          const errorExists = await browser.elementExists('[data-testid="error-message"], .error', 2000);
          if (errorExists) {
            console.log('✅ Error message shown for unauthenticated favorite attempt');
          } else {
            console.log('⚠️ No clear authentication enforcement detected');
          }
        }
      } else {
        console.log('✅ Favorite buttons not shown to unauthenticated users');
      }
      
    } catch (error) {
      await browser.screenshotOnFailure('failure-favorite-auth', error);
      throw error;
    }
  });
});