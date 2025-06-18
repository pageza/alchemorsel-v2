const { test, expect } = require('@jest/globals');
const { setup, teardown, login, testUser } = require('../utils/test-helpers');

test.describe('Email Verification Flow', () => {
  let browser;
  let page;

  test.beforeAll(async () => {
    ({ browser, page } = await setup());
  });

  test.afterAll(async () => {
    await teardown(browser);
  });

  test.beforeEach(async () => {
    // Always start from login page for consistency
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display email verification page with token', async () => {
    await page.goto('/verify-email?token=test-token');
    await page.waitForLoadState('networkidle');
    
    const pageTitle = await page.locator('.v-toolbar-title');
    await expect(pageTitle).toHaveText('Email Verification');
    
    // Should show loading initially
    const loadingText = await page.locator('p:has-text("Verifying your email")');
    await expect(loadingText).toBeVisible();
  });

  test('should handle missing verification token', async () => {
    await page.goto('/verify-email');
    await page.waitForLoadState('networkidle');
    
    // Should show error about missing token
    const errorIcon = await page.locator('.v-icon.mdi-alert-circle');
    await expect(errorIcon).toBeVisible();
    
    const errorMessage = await page.locator('p:has-text("No verification token provided")');
    await expect(errorMessage).toBeVisible();
  });

  test('should handle invalid verification token', async () => {
    await page.goto('/verify-email?token=invalid-token-123');
    await page.waitForLoadState('networkidle');
    
    // Wait for verification to complete
    await page.waitForSelector('.v-icon.mdi-alert-circle', { state: 'visible' });
    
    const errorTitle = await page.locator('h3:has-text("Verification Failed")');
    await expect(errorTitle).toBeVisible();
    
    const errorMessage = await page.locator('p:has-text("Invalid or expired verification token")');
    await expect(errorMessage).toBeVisible();
  });

  test('should show email verification banner when logged in', async () => {
    // Mock unverified user login
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'test-token',
          user_id: 'test-user-id',
          email_verified: false
        })
      });
    });

    await page.route('**/api/v1/profile', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          profile: {
            id: 'test-user-id',
            email: testUser.email,
            username: testUser.username,
            email_verified: false
          }
        })
      });
    });

    // Login
    await page.fill('[data-testid="email-input"] input', testUser.email);
    await page.fill('[data-testid="password-input"] input', testUser.password);
    await page.click('[data-testid="login-submit"]');
    
    await page.waitForURL('/dashboard');
    
    // Should show email verification banner
    const banner = await page.locator('.email-verification-banner');
    await expect(banner).toBeVisible();
    
    const bannerText = await page.locator('strong:has-text("Verify your email address")');
    await expect(bannerText).toBeVisible();
    
    const resendButton = await page.locator('button:has-text("Resend Email")');
    await expect(resendButton).toBeVisible();
  });

  test('should resend verification email', async () => {
    // Setup unverified user session
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test-token');
    });

    await page.route('**/api/v1/profile', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          profile: {
            id: 'test-user-id',
            email: testUser.email,
            username: testUser.username,
            email_verified: false
          }
        })
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Mock resend endpoint
    let resendCalled = false;
    await page.route('**/api/v1/auth/email-verification/resend', route => {
      resendCalled = true;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Verification email sent'
        })
      });
    });
    
    // Click resend button
    const resendButton = await page.locator('button:has-text("Resend Email")');
    await resendButton.click();
    
    // Should show loading state
    await expect(resendButton).toHaveAttribute('loading', 'true');
    
    // Verify API was called
    await page.waitForTimeout(500); // Wait for request
    expect(resendCalled).toBe(true);
  });

  test('should dismiss verification banner', async () => {
    // Setup unverified user session
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test-token');
    });

    await page.route('**/api/v1/profile', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          profile: {
            id: 'test-user-id',
            email: testUser.email,
            username: testUser.username,
            email_verified: false
          }
        })
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Should show banner
    const banner = await page.locator('.email-verification-banner');
    await expect(banner).toBeVisible();
    
    // Close banner
    const closeButton = await page.locator('.email-verification-banner .v-alert__close');
    await closeButton.click();
    
    // Banner should be hidden
    await expect(banner).not.toBeVisible();
  });

  test('should not show banner for verified users', async () => {
    // Setup verified user session
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test-token');
    });

    await page.route('**/api/v1/profile', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          profile: {
            id: 'test-user-id',
            email: testUser.email,
            username: testUser.username,
            email_verified: true,
            email_verified_at: new Date().toISOString()
          }
        })
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Should NOT show verification banner
    const banner = await page.locator('.email-verification-banner');
    await expect(banner).not.toBeVisible();
  });

  test('should navigate after successful verification', async () => {
    // Mock successful verification
    await page.route('**/api/v1/auth/email-verification/verify', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Email verified successfully'
        })
      });
    });

    await page.goto('/verify-email?token=valid-token');
    await page.waitForLoadState('networkidle');
    
    // Wait for success state
    await page.waitForSelector('.v-icon.mdi-check-circle', { state: 'visible' });
    
    const successTitle = await page.locator('h3:has-text("Email Verified Successfully!")');
    await expect(successTitle).toBeVisible();
    
    // Should show navigation button
    const dashboardButton = await page.locator('button:has-text("Go to Dashboard")');
    await expect(dashboardButton).toBeVisible();
    
    // Test navigation when not logged in
    await dashboardButton.click();
    await page.waitForURL('/login');
  });

  test('should handle verification errors gracefully', async () => {
    // Mock network error
    await page.route('**/api/v1/auth/email-verification/verify', route => {
      route.abort('failed');
    });

    await page.goto('/verify-email?token=test-token');
    await page.waitForLoadState('networkidle');
    
    // Should show error state
    await page.waitForSelector('.v-icon.mdi-alert-circle', { state: 'visible' });
    
    const errorTitle = await page.locator('h3:has-text("Verification Failed")');
    await expect(errorTitle).toBeVisible();
  });
});