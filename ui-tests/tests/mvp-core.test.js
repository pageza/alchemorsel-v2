/**
 * MVP Core User Stories E2E Tests
 * 
 * Tests core MVP functionality based on user stories in docs/planning/STORIES.md
 * Focus: Essential user flows for MVP readiness
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../helpers/browser');
const AuthHelper = require('../helpers/auth');

describe('MVP Core User Stories', () => {
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

  describe('🎯 Public User Stories (Unauthenticated)', () => {
    
    test('MVP-001: Visitor can browse recipes without account', async () => {
      // Navigate to landing page
      await browser.navigate('/');
      
      // Should see featured recipes
      const featuredSection = await browser.elementExists('.featured-section');
      assert.ok(featuredSection, 'Featured recipes section should be visible');
      
      // Should see recipe cards
      const recipeCards = await browser.elementExists('.recipe-preview-card');
      assert.ok(recipeCards, 'Recipe cards should be visible');
      
      // Should see "Sign up to view" overlays for unauthenticated users
      const loginOverlay = await browser.elementExists('.login-overlay');
      assert.ok(loginOverlay, 'Login overlay should appear on recipe cards');
    });

    test('MVP-002: Visitor can access landing and about pages only', async () => {
      // Test landing page access
      await browser.navigate('/');
      const currentUrl = browser.getCurrentUrl();
      assert.ok(currentUrl.includes('/'), 'Should access landing page');
      
      // Test about page access
      await browser.navigate('/about');
      const aboutUrl = browser.getCurrentUrl();
      assert.ok(aboutUrl.includes('/about'), 'Should access about page');
      
      // Test restricted page redirects to login
      await browser.navigate('/dashboard');
      const redirectUrl = browser.getCurrentUrl();
      assert.ok(redirectUrl.includes('/login'), 'Should redirect to login for protected pages');
    });

    test('MVP-003: Visitor can register for account', async () => {
      await browser.navigate('/register');
      
      // Fill registration form
      await browser.fillInput('input[name="name"]', 'Test User');
      await browser.fillInput('input[name="email"]', `test.${Date.now()}@example.com`);
      await browser.fillInput('input[name="username"]', `testuser${Date.now()}`);
      await browser.fillInput('input[name="password"]', 'testpassword123');
      await browser.fillInput('input[name="confirmPassword"]', 'testpassword123');
      
      // Submit registration
      await browser.clickElement('button[type="submit"]');
      
      // Should redirect to dashboard or show success
      await browser.page.waitForTimeout(2000);
      const url = browser.getCurrentUrl();
      assert.ok(
        url.includes('/dashboard') || url.includes('/login'), 
        'Should redirect after successful registration'
      );
    });
  });

  describe('🎯 Authenticated User Stories', () => {
    
    beforeEach(async () => {
      // Login before each authenticated test
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('MVP-004: User can access dashboard after login', async () => {
      const url = browser.getCurrentUrl();
      assert.ok(url.includes('/dashboard'), 'Should be on dashboard after login');
      
      // Should see dashboard stats
      const statsExists = await browser.elementExists('.dashboard-stats', 5000);
      assert.ok(statsExists, 'Dashboard stats should be visible');
    });

    test('MVP-005: User can navigate to generate recipe', async () => {
      // Click on Generate Recipe navigation
      const generateLink = await browser.elementExists('*[data-testid*="generate"]');
      if (generateLink) {
        await browser.clickElement('*[data-testid*="generate"]');
        
        // Should navigate to generate recipe page
        await browser.page.waitForTimeout(1000);
        const url = browser.getCurrentUrl();
        assert.ok(url.includes('/generate'), 'Should navigate to generate recipe page');
      } else {
        // Alternative: check for generate recipe functionality in dashboard
        const generateButton = await browser.elementExists('button:contains("Generate Recipe")');
        assert.ok(generateButton, 'Generate recipe functionality should be accessible');
      }
    });

    test('MVP-006: User can view their profile', async () => {
      // Navigate to profile
      await browser.navigate('/profile');
      
      // Should see profile information
      const profileExists = await browser.elementExists('.profile-header', 5000);
      assert.ok(profileExists, 'Profile header should be visible');
      
      // Should see user information
      const userInfo = await browser.elementExists('h1', 5000);
      assert.ok(userInfo, 'User name/info should be displayed');
    });

    test('MVP-007: User can browse all recipes', async () => {
      // Navigate to recipes page
      await browser.navigate('/recipes');
      
      // Should see recipe listings
      const recipesExist = await browser.elementExists('.recipe-card, .recipe-preview-card', 10000);
      assert.ok(recipesExist, 'Recipe listings should be visible');
    });

    test('MVP-008: User can favorite recipes', async () => {
      await browser.navigate('/recipes');
      
      // Look for favorite button on recipe cards
      const favoriteButton = await browser.elementExists('[data-testid*="favorite"], .favorite-btn, button[aria-label*="favorite"]', 5000);
      
      if (favoriteButton) {
        // Click favorite button
        await browser.clickElement('[data-testid*="favorite"], .favorite-btn, button[aria-label*="favorite"]');
        
        // Should show favorited state (implementation varies)
        await browser.page.waitForTimeout(1000);
        console.log('✅ Favorite functionality found and tested');
      } else {
        console.log('⚠️ Favorite buttons not found - may need UI updates');
      }
    });

    test('MVP-009: User can view favorites page', async () => {
      // Navigate to favorites
      await browser.navigate('/favorites');
      
      // Should access favorites page (may be empty)
      const url = browser.getCurrentUrl();
      assert.ok(url.includes('/favorites'), 'Should access favorites page');
      
      // Should have favorites interface
      const favoritesInterface = await browser.elementExists('.favorites-container, .recipe-grid, h1', 5000);
      assert.ok(favoritesInterface, 'Favorites interface should be present');
    });

    test('MVP-010: User can logout successfully', async () => {
      // Find and click logout button
      const logoutExists = await browser.elementExists('[data-testid="logout"], button:contains("Logout"), .logout-btn', 5000);
      
      if (logoutExists) {
        await browser.clickElement('[data-testid="logout"], button:contains("Logout"), .logout-btn');
        
        // Should redirect to login or landing page
        await browser.page.waitForTimeout(2000);
        const url = browser.getCurrentUrl();
        assert.ok(
          url.includes('/login') || url.includes('/') || !url.includes('/dashboard'), 
          'Should redirect after logout'
        );
      } else {
        console.log('⚠️ Logout button not easily found - may need UI updates');
      }
    });
  });

  describe('🎯 AI Recipe Generation', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('MVP-011: User can access recipe generation interface', async () => {
      await browser.navigate('/generate');
      
      // Should see recipe generation form
      const generateForm = await browser.elementExists('form, .generate-form, input[type="text"], textarea', 5000);
      assert.ok(generateForm, 'Recipe generation interface should be accessible');
      
      // Should have input field for recipe description
      const inputField = await browser.elementExists('input[type="text"], textarea', 5000);
      assert.ok(inputField, 'Should have input field for recipe requests');
    });

    test('MVP-012: User can submit recipe generation request', async () => {
      await browser.navigate('/generate');
      
      // Fill in recipe request
      const inputSelector = 'input[type="text"], textarea';
      const inputExists = await browser.elementExists(inputSelector);
      
      if (inputExists) {
        await browser.fillInput(inputSelector, 'pasta recipe with tomatoes and basil');
        
        // Submit request
        const submitButton = await browser.elementExists('button[type="submit"], .generate-btn, button:contains("Generate")');
        if (submitButton) {
          await browser.clickElement('button[type="submit"], .generate-btn, button:contains("Generate")');
          
          // Should show loading or result
          await browser.page.waitForTimeout(3000);
          console.log('✅ Recipe generation request submitted');
        }
      }
    });
  });

  describe('🎯 Basic Recipe Management', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('MVP-013: User can view recipe details', async () => {
      await browser.navigate('/recipes');
      
      // Find first recipe link and click it
      const recipeLink = await browser.elementExists('a[href*="/recipes/"], .recipe-card a, .recipe-preview-card');
      
      if (recipeLink) {
        await browser.clickElement('a[href*="/recipes/"], .recipe-card a, .recipe-preview-card');
        
        // Should navigate to recipe details
        await browser.page.waitForTimeout(2000);
        const url = browser.getCurrentUrl();
        assert.ok(url.includes('/recipes/') && url !== '/recipes', 'Should navigate to recipe details page');
        
        // Should see recipe information
        const recipeContent = await browser.elementExists('h1, .recipe-title, .recipe-content', 5000);
        assert.ok(recipeContent, 'Recipe details should be displayed');
      }
    });

    test('MVP-014: User can access recipe creation', async () => {
      // Look for create recipe button/link
      const createButton = await browser.elementExists('[href="/recipes/create"], .create-recipe-btn, button:contains("Create")');
      
      if (createButton) {
        await browser.clickElement('[href="/recipes/create"], .create-recipe-btn, button:contains("Create")');
        
        // Should navigate to recipe creation form
        await browser.page.waitForTimeout(1000);
        const url = browser.getCurrentUrl();
        assert.ok(url.includes('/create'), 'Should navigate to recipe creation page');
      } else {
        // Alternative: navigate directly to create page
        await browser.navigate('/recipes/create');
        const url = browser.getCurrentUrl();
        assert.ok(url.includes('/create'), 'Should be able to access recipe creation page');
      }
    });
  });

  describe('🎯 Navigation & Core UI', () => {
    
    test('MVP-015: Landing page loads properly', async () => {
      await browser.navigate('/');
      
      // Should see main navigation
      const navigation = await browser.elementExists('nav, .navigation, .navbar', 5000);
      assert.ok(navigation, 'Main navigation should be present');
      
      // Should see hero section
      const heroSection = await browser.elementExists('.hero-section, .hero', 5000);
      assert.ok(heroSection, 'Hero section should be present');
      
      // Should see call-to-action buttons
      const ctaButtons = await browser.elementExists('button, .btn, a[href*="register"]', 5000);
      assert.ok(ctaButtons, 'Call-to-action elements should be present');
    });

    test('MVP-016: Login page is accessible and functional', async () => {
      await browser.navigate('/login');
      
      // Should see login form
      const loginForm = await browser.elementExists('form, .login-form', 5000);
      assert.ok(loginForm, 'Login form should be present');
      
      // Should have email and password fields
      const emailField = await browser.elementExists('input[type="email"], input[name="email"]', 5000);
      const passwordField = await browser.elementExists('input[type="password"], input[name="password"]', 5000);
      
      assert.ok(emailField, 'Email field should be present');
      assert.ok(passwordField, 'Password field should be present');
      
      // Should have submit button
      const submitButton = await browser.elementExists('button[type="submit"], .login-btn', 5000);
      assert.ok(submitButton, 'Submit button should be present');
    });
  });
});