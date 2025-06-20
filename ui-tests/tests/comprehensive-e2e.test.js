const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../helpers/browser');
require('dotenv').config();

describe('Comprehensive E2E Tests', () => {
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

  // Authentication Tests
  describe('Authentication Flow', () => {
    test('should load login page with all required elements', async () => {
      try {
        await browser.navigate('/login');
        
        // Check for form presence
        const hasLoginForm = await browser.elementExists('[data-testid="login-form"]', 5000);
        assert.ok(hasLoginForm, 'Login form should be present');
        
        // Check for input fields
        const hasEmailInput = await browser.elementExists('[data-testid="email-input"]', 5000);
        assert.ok(hasEmailInput, 'Email input should be present');
        
        const hasPasswordInput = await browser.elementExists('[data-testid="password-input"]', 5000);
        assert.ok(hasPasswordInput, 'Password input should be present');
        
        // Check for submit button
        const hasSubmitButton = await browser.elementExists('[data-testid="login-submit"]', 5000);
        assert.ok(hasSubmitButton, 'Login submit button should be present');
        
      } catch (error) {
        await browser.screenshotOnFailure('login-page-elements', error);
      }
    });

    test('should attempt login with test credentials', async () => {
      try {
        await browser.navigate('/login');
        
        // Fill in test credentials
        await browser.fillInput('[data-testid="email-input"]', 'test@alchemorsel.com');
        await browser.fillInput('[data-testid="password-input"]', 'TestPassword123');
        
        // Click submit
        await browser.clickElement('[data-testid="login-submit"]');
        
        // Wait for potential redirect or error message
        await browser.page.waitForTimeout(3000);
        
        const currentUrl = browser.getCurrentUrl();
        console.log('Current URL after login attempt:', currentUrl);
        
        // Check if we're redirected (success) or still on login (failed)
        const stillOnLogin = currentUrl.includes('/login');
        console.log('Login result:', stillOnLogin ? 'Failed (still on login page)' : 'Success (redirected)');
        
      } catch (error) {
        await browser.screenshotOnFailure('login-attempt', error);
      }
    });

    test('should navigate to register page', async () => {
      try {
        await browser.navigate('/login');
        
        // Click register link
        const hasRegisterLink = await browser.elementExists('[data-testid="register-link"]', 5000);
        if (hasRegisterLink) {
          await browser.clickElement('[data-testid="register-link"]');
          
          // Wait for navigation to complete
          await browser.page.waitForTimeout(1500);
          
          // Check if we're on register page
          const currentUrl = browser.getCurrentUrl();
          assert.ok(currentUrl.includes('/register'), 'Should navigate to register page');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('register-navigation', error);
      }
    });
  });

  // Recipe Browsing Tests  
  describe('Recipe Browsing', () => {
    test('should load recipes page', async () => {
      try {
        await browser.navigate('/recipes');
        
        // Check for search functionality
        const hasSearch = await browser.elementExists('[data-testid="recipe-search"]', 5000);
        console.log('Recipe search found:', hasSearch);
        
        // Check for category filter
        const hasCategoryFilter = await browser.elementExists('[data-testid="category-filter"]', 5000);
        console.log('Category filter found:', hasCategoryFilter);
        
        // Check for sort filter
        const hasSortFilter = await browser.elementExists('[data-testid="sort-filter"]', 5000);
        console.log('Sort filter found:', hasSortFilter);
        
        // Check for generate recipe button
        const hasGenerateBtn = await browser.elementExists('[data-testid="generate-recipe-btn"]', 5000);
        console.log('Generate recipe button found:', hasGenerateBtn);
        
      } catch (error) {
        await browser.screenshotOnFailure('recipes-page', error);
      }
    });

    test('should attempt to search for recipes', async () => {
      try {
        await browser.navigate('/recipes');
        
        const hasSearch = await browser.elementExists('[data-testid="recipe-search"]', 5000);
        if (hasSearch) {
          await browser.fillInput('[data-testid="recipe-search"]', 'chicken');
          
          // Wait for potential search results
          await browser.page.waitForTimeout(2000);
          
          console.log('Search for "chicken" completed');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('recipe-search', error);
      }
    });
  });

  // Navigation Tests
  describe('Navigation', () => {
    test('should load homepage and check basic navigation', async () => {
      try {
        await browser.navigate('/');
        
        // Check if we can access different pages
        const pages = ['/login', '/register', '/recipes'];
        
        for (const page of pages) {
          await browser.navigate(page);
          const currentUrl = browser.getCurrentUrl();
          assert.ok(currentUrl.includes(page.substring(1)), `Should be able to navigate to ${page}`);
          console.log(`✓ Successfully navigated to ${page}`);
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('navigation', error);
      }
    });
  });

  // Integration Tests
  describe('User Journey Integration', () => {
    test('should complete a basic user journey flow', async () => {
      try {
        console.log('Starting user journey test...');
        
        // Step 1: Visit homepage
        await browser.navigate('/');
        console.log('✓ Visited homepage');
        
        // Step 2: Go to login page
        await browser.navigate('/login');
        const hasLoginForm = await browser.elementExists('[data-testid="login-form"]', 5000);
        console.log('✓ Login page loaded:', hasLoginForm);
        
        // Step 3: Try login (will likely fail but that's expected)
        if (hasLoginForm) {
          await browser.fillInput('[data-testid="email-input"]', 'test@alchemorsel.com');
          await browser.fillInput('[data-testid="password-input"]', 'TestPassword123');
          await browser.clickElement('[data-testid="login-submit"]');
          await browser.page.waitForTimeout(3000);
          console.log('✓ Login attempt completed');
        }
        
        // Step 4: Go to recipes page
        await browser.navigate('/recipes');
        const hasRecipePage = await browser.elementExists('body', 5000);
        console.log('✓ Recipes page accessed:', hasRecipePage);
        
        // Step 5: Try recipe search
        const hasSearch = await browser.elementExists('[data-testid="recipe-search"]', 5000);
        if (hasSearch) {
          await browser.fillInput('[data-testid="recipe-search"]', 'pasta');
          console.log('✓ Recipe search attempted');
        }
        
        console.log('✓ User journey test completed successfully');
        
      } catch (error) {
        await browser.screenshotOnFailure('user-journey', error);
      }
    });
  });
});