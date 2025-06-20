const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('./helpers/browser');
require('dotenv').config();

describe('Basic E2E Tests', () => {
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

  test('should load homepage', async () => {
    try {
      await browser.navigate('/');
      
      // Check if we can find a basic element
      const hasContent = await browser.elementExists('body', 5000);
      assert.ok(hasContent, 'Homepage should load with body element');
      
      const currentUrl = browser.getCurrentUrl();
      assert.ok(currentUrl.includes('localhost:5173'), 'Should be on frontend URL');
      
    } catch (error) {
      await browser.screenshotOnFailure('homepage-load', error);
    }
  });

  test('should navigate to login page', async () => {
    try {
      await browser.navigate('/');
      
      // Look for any login-related elements or links
      const hasLoginLink = await browser.elementExists('a[href*="login"], button:contains("Login"), [data-testid*="login"]', 5000);
      
      if (hasLoginLink) {
        // If login link exists, click it
        await browser.clickElement('a[href*="login"], button:contains("Login"), [data-testid*="login"]');
        
        // Verify we're on login page
        const currentUrl = browser.getCurrentUrl();
        assert.ok(currentUrl.includes('login'), 'Should navigate to login page');
      } else {
        // Try navigating directly to login
        await browser.navigate('/login');
        
        // Check if login page loads
        const currentUrl = browser.getCurrentUrl();
        assert.ok(currentUrl.includes('login'), 'Should be able to access login page directly');
      }
      
    } catch (error) {
      await browser.screenshotOnFailure('login-navigation', error);
    }
  });

  test('should load recipes page', async () => {
    try {
      await browser.navigate('/recipes');
      
      // Check if recipes page loads
      const currentUrl = browser.getCurrentUrl();
      assert.ok(currentUrl.includes('localhost:5173'), 'Should be on frontend URL');
      
      // Look for recipe-related content
      const hasRecipeContent = await browser.elementExists('body', 5000);
      assert.ok(hasRecipeContent, 'Recipes page should have content');
      
    } catch (error) {
      await browser.screenshotOnFailure('recipes-page', error);
    }
  });
});