/**
 * Test User Credentials for Puppeteer E2E Testing
 * 
 * This file contains the credentials for a verified test user
 * that has been inserted into the production database specifically
 * for automated testing purposes.
 */

const TEST_USER = {
  // Email verified test user credentials
  email: 'puppeteer.test@alchemorsel.com',
  password: 'testpassword123',
  username: 'puppeteer-tester',
  
  // User details
  name: 'Puppeteer Test User',
  bio: 'Automated test user for Puppeteer E2E testing',
  
  // Verification status
  isEmailVerified: true,
  
  // Test data
  dietaryPreferences: ['vegetarian'],
  allergens: ['nuts'],
  
  // Database info (for reference only)
  userId: '01d95e6d-7902-4428-9fb9-d54f583f107f',
  
  // Test URLs
  loginUrl: 'http://test.app.alchemorsel.com/login',
  dashboardUrl: 'http://test.app.alchemorsel.com/dashboard'
};

// Export for use in test files
module.exports = { TEST_USER };

/**
 * Usage Example:
 * 
 * const { TEST_USER } = require('./test-user-credentials');
 * 
 * // Login test user
 * await page.goto(TEST_USER.loginUrl);
 * await page.fill('[data-testid="email-input"]', TEST_USER.email);
 * await page.fill('[data-testid="password-input"]', TEST_USER.password);
 * await page.click('[data-testid="login-submit"]');
 * 
 * // Verify logged in to dashboard
 * await page.waitForURL(TEST_USER.dashboardUrl);
 */