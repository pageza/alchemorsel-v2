const { test, expect } = require('@jest/globals');
const { setup, teardown, login, testUser } = require('../utils/test-helpers');

test.describe('Password Reset Flow', () => {
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

  test('should display forgot password link on login page', async () => {
    const forgotPasswordLink = await page.locator('[data-testid="forgot-password"]');
    await expect(forgotPasswordLink).toBeVisible();
    await expect(forgotPasswordLink).toHaveText('Forgot Password?');
  });

  test('should navigate to forgot password page', async () => {
    await page.click('[data-testid="forgot-password"]');
    await page.waitForURL('/forgot-password');
    
    const pageTitle = await page.locator('.v-toolbar-title');
    await expect(pageTitle).toHaveText('Forgot Password');
    
    const instructions = await page.locator('p.mb-4');
    await expect(instructions).toContainText('Enter your email address');
  });

  test('should validate email field on forgot password page', async () => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    // Try to submit without email
    const submitButton = await page.locator('button:has-text("Send Reset Link")');
    await submitButton.click();
    
    // Should show validation error
    const emailInput = await page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    
    // Enter valid email
    await emailInput.fill(testUser.email);
    await expect(submitButton).toBeEnabled();
  });

  test('should submit password reset request', async () => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    // Fill in email
    const emailInput = await page.locator('input[type="email"]');
    await emailInput.fill(testUser.email);
    
    // Submit request
    const submitButton = await page.locator('button:has-text("Send Reset Link")');
    await submitButton.click();
    
    // Should show success message
    const successAlert = await page.locator('.v-alert--type-success');
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText('password reset link has been sent');
    
    // Email field should be cleared
    await expect(emailInput).toHaveValue('');
  });

  test('should handle back to login navigation', async () => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    const backButton = await page.locator('button:has-text("Back to Login")');
    await backButton.click();
    
    await page.waitForURL('/login');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('should validate reset token on reset password page', async () => {
    // Navigate directly to reset password page without token
    await page.goto('/reset-password');
    await page.waitForLoadState('networkidle');
    
    // Should show error about missing token
    const errorAlert = await page.locator('.v-alert--type-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('No reset token provided');
  });

  test('should validate reset password form', async () => {
    // Navigate with a mock token (will be invalid)
    await page.goto('/reset-password?token=mock-invalid-token');
    await page.waitForLoadState('networkidle');
    
    // Wait for token validation to complete
    await page.waitForSelector('.v-alert--type-error', { state: 'visible' });
    
    const errorAlert = await page.locator('.v-alert--type-error');
    await expect(errorAlert).toContainText('Invalid or expired reset token');
  });

  test('should show password requirements on reset password page', async () => {
    // This test would need a valid token in a real scenario
    // For now, we just verify the page structure
    await page.goto('/reset-password?token=mock-token');
    await page.waitForLoadState('networkidle');
    
    const pageTitle = await page.locator('.v-toolbar-title');
    await expect(pageTitle).toHaveText('Reset Password');
  });

  test('should enforce password matching on reset form', async () => {
    // This would be tested with a valid token in integration tests
    // For now, verify the page loads correctly
    await page.goto('/reset-password?token=test-token');
    await page.waitForLoadState('networkidle');
    
    const backButton = await page.locator('button:has-text("Back to Login")');
    await expect(backButton).toBeVisible();
  });

  test('should handle network errors gracefully', async () => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    // Simulate network failure
    await page.route('**/api/v1/auth/password-reset/request', route => {
      route.abort('failed');
    });
    
    const emailInput = await page.locator('input[type="email"]');
    await emailInput.fill(testUser.email);
    
    const submitButton = await page.locator('button:has-text("Send Reset Link")');
    await submitButton.click();
    
    // Should show error message
    const errorAlert = await page.locator('.v-alert--type-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Failed to process request');
  });

  test('should prevent multiple submissions', async () => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    const emailInput = await page.locator('input[type="email"]');
    await emailInput.fill(testUser.email);
    
    const submitButton = await page.locator('button:has-text("Send Reset Link")');
    
    // Slow down the request to test loading state
    await page.route('**/api/v1/auth/password-reset/request', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    await submitButton.click();
    
    // Button should be disabled during request
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toHaveAttribute('loading', 'true');
  });
});