const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
require('dotenv').config();

const BrowserManager = require('../../helpers/browser');
const AuthHelper = require('../../helpers/auth');

describe('Admin Authentication Flow', () => {
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

  test('should login as admin and access admin dashboard', async () => {
    try {
      // Use seeded admin credentials
      const adminUser = {
        email: 'admin@alchemorsel.com',
        password: 'AdminPass123!'
      };

      const loginSuccess = await auth.login(adminUser.email, adminUser.password);
      assert.ok(loginSuccess, 'Admin should be able to login');

      // Verify admin navigation link is visible
      const adminNavExists = await browser.elementExists('[data-testid="nav-admin"]');
      assert.ok(adminNavExists, 'Admin navigation link should be visible for admin users');

      // Navigate to admin dashboard
      await browser.clickElement('[data-testid="nav-admin"]');
      await browser.waitForNavigation();

      // Verify we're on admin dashboard
      const currentUrl = browser.getCurrentUrl();
      assert.ok(currentUrl.includes('/admin'), 'Should navigate to admin dashboard');

      // Verify admin dashboard elements
      const adminDashboard = await browser.elementExists('[data-testid="admin-dashboard"]');
      assert.ok(adminDashboard, 'Admin dashboard should be accessible');

    } catch (error) {
      await browser.screenshotOnFailure('admin-auth', error);
      throw error;
    }
  });

  test('should prevent non-admin users from accessing admin routes', async () => {
    try {
      // Login as regular user
      const regularUser = {
        email: 'cook@alchemorsel.com',
        password: 'CookPass123!'
      };

      const loginSuccess = await auth.login(regularUser.email, regularUser.password);
      assert.ok(loginSuccess, 'Regular user should be able to login');

      // Verify admin navigation link is NOT visible
      const adminNavExists = await browser.elementExists('[data-testid="nav-admin"]');
      assert.ok(!adminNavExists, 'Admin navigation link should not be visible for regular users');

      // Try to access admin dashboard directly
      await browser.navigateToUrl('/admin');
      
      // Should be redirected to dashboard or login
      const currentUrl = browser.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/dashboard') || currentUrl.includes('/login'),
        'Non-admin users should be redirected from admin routes'
      );

    } catch (error) {
      await browser.screenshotOnFailure('non-admin-access', error);
      throw error;
    }
  });

  test('should show admin tools in user dropdown for admin users', async () => {
    try {
      // Login as admin
      const adminUser = {
        email: 'admin@alchemorsel.com',
        password: 'AdminPass123!'
      };

      await auth.login(adminUser.email, adminUser.password);

      // Navigate to profile page
      await browser.clickElement('[data-testid="user-avatar"]');
      await browser.clickElement('[data-testid="view-profile"]');
      await browser.waitForNavigation();

      // Verify admin tools section exists
      const adminToolsExists = await browser.elementExists('text=Administrative Tools');
      assert.ok(adminToolsExists, 'Admin tools section should be visible on profile page');

      // Verify admin dashboard access button
      const adminAccessBtn = await browser.elementExists('text=Access Admin Dashboard');
      assert.ok(adminAccessBtn, 'Admin dashboard access button should be present');

    } catch (error) {
      await browser.screenshotOnFailure('admin-profile-tools', error);
      throw error;
    }
  });

  test('should handle admin role validation properly', async () => {
    try {
      // Login as moderator
      const moderatorUser = {
        email: 'moderator@alchemorsel.com',
        password: 'ModPass123!'
      };

      const loginSuccess = await auth.login(moderatorUser.email, moderatorUser.password);
      assert.ok(loginSuccess, 'Moderator should be able to login');

      // Check if moderator has admin tools access
      await browser.navigateToUrl('/profile');
      
      const adminToolsExists = await browser.elementExists('text=Administrative Tools');
      assert.ok(adminToolsExists, 'Moderators should have access to admin tools');

      // Try to access admin dashboard
      await browser.navigateToUrl('/admin');
      
      const currentUrl = browser.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/admin') || currentUrl.includes('/dashboard'),
        'Moderator access to admin dashboard should be controlled by backend'
      );

    } catch (error) {
      await browser.screenshotOnFailure('moderator-access', error);
      throw error;
    }
  });
});