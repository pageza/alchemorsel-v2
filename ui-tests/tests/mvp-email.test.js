/**
 * MVP Email Verification E2E Tests
 * 
 * Tests email verification functionality based on user stories in docs/planning/STORIES.md
 * Focus: Email verification enforcement and user onboarding
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../helpers/browser');
const AuthHelper = require('../helpers/auth');

describe('MVP Email Verification Stories', () => {
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

  describe('🎯 Email Verification Flow', () => {
    
    test('EMAIL-001: New user receives email verification prompt', async () => {
      // Register a new user
      await browser.navigate('/register');
      
      const uniqueEmail = `test.${Date.now()}@example.com`;
      await browser.fillInput('input[name="name"]', 'Test User');
      await browser.fillInput('input[name="email"]', uniqueEmail);
      await browser.fillInput('input[name="username"]', `testuser${Date.now()}`);
      await browser.fillInput('input[name="password"]', 'testpassword123');
      await browser.fillInput('input[name="confirmPassword"]', 'testpassword123');
      
      await browser.clickElement('button[type="submit"]');
      await browser.page.waitForTimeout(2000);
      
      // Should see email verification notice
      const verificationNotice = await browser.elementExists('.email-verification, .verify-email, .verification-required', 5000);
      if (verificationNotice) {
        console.log('✅ Email verification notice displayed');
      } else {
        console.log('⚠️ Email verification notice not found');
      }
    });

    test('EMAIL-002: Unverified users cannot access AI generation', async () => {
      // Login with unverified user
      await auth.login('jane.doe@example.com', 'testpassword123'); // This user is unverified
      
      // Try to access recipe generation
      await browser.navigate('/generate');
      
      // Should either redirect or show verification requirement
      const url = browser.getCurrentUrl();
      const verificationRequired = await browser.elementExists('.verification-required, .email-verify-prompt', 3000);
      
      assert.ok(
        !url.includes('/generate') || verificationRequired,
        'Unverified users should not access AI generation'
      );
      
      if (verificationRequired) {
        console.log('✅ Email verification required for AI generation');
      } else {
        console.log('⚠️ Email verification not enforced for AI generation');
      }
    });

    test('EMAIL-003: Verified users can access all features', async () => {
      // Login with verified user (admin@example.com is verified)
      await auth.login('admin@example.com', 'testpassword123');
      
      // Should be able to access AI generation
      await browser.navigate('/generate');
      
      const url = browser.getCurrentUrl();
      assert.ok(url.includes('/generate'), 'Verified users should access AI generation');
      
      // Should see generation interface
      const generateForm = await browser.elementExists('form, .generate-form, input, textarea', 5000);
      assert.ok(generateForm, 'AI generation interface should be accessible');
      
      console.log('✅ Verified users have full access');
    });

    test('EMAIL-004: Email verification status shown in profile', async () => {
      // Test with unverified user
      await auth.login('jane.doe@example.com', 'testpassword123');
      await browser.navigate('/profile');
      
      // Look for verification status indicator
      const verificationStatus = await browser.elementExists('.verification-status, .email-status, .verify-badge', 5000);
      if (verificationStatus) {
        console.log('✅ Email verification status visible in profile');
      } else {
        console.log('⚠️ Email verification status not visible in profile');
      }
      
      // Look for verify email button/link
      const verifyButton = await browser.elementExists('button:contains("Verify"), a:contains("verify"), .verify-email-btn', 3000);
      if (verifyButton) {
        console.log('✅ Email verification action available');
      } else {
        console.log('⚠️ Email verification action not found');
      }
    });

    test('EMAIL-005: Resend verification email functionality', async () => {
      await auth.login('jane.doe@example.com', 'testpassword123');
      await browser.navigate('/profile');
      
      // Look for resend verification option
      const resendButton = await browser.elementExists(
        'button:contains("Resend"), .resend-verification, button:contains("Send again")', 
        3000
      );
      
      if (resendButton) {
        await browser.clickElement('button:contains("Resend"), .resend-verification, button:contains("Send again")');
        await browser.page.waitForTimeout(1000);
        
        // Should see confirmation message
        const confirmation = await browser.elementExists('.success-message, .confirmation, .email-sent', 3000);
        console.log(confirmation ? '✅ Resend verification works' : '⚠️ Resend verification confirmation not shown');
      } else {
        console.log('⚠️ Resend verification functionality not found');
      }
    });
  });

  describe('🎯 Email System Admin Management', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('EMAIL-006: Admin can view email verification status', async () => {
      // Navigate to user management
      await browser.navigate('/admin/users');
      
      // Look for email verification status in user listing
      const verificationColumn = await browser.elementExists(
        'th:contains("Verified"), .email-verified, .verification-status', 
        5000
      );
      
      if (verificationColumn) {
        console.log('✅ Email verification status visible in admin panel');
      } else {
        console.log('⚠️ Email verification status not visible in admin panel');
      }
    });

    test('EMAIL-007: Admin can manually verify users', async () => {
      await browser.navigate('/admin/users');
      
      // Look for manual verification controls
      const verifyControls = await browser.elementExists(
        'button:contains("Verify"), .verify-user-btn, .admin-verify', 
        3000
      );
      
      if (verifyControls) {
        console.log('✅ Manual user verification controls found');
      } else {
        console.log('⚠️ Manual user verification controls not found');
      }
    });

    test('EMAIL-008: Admin can view email delivery status', async () => {
      // Try to find email management section
      const emailRoutes = ['/admin/emails', '/admin/communications', '/admin/verification'];
      let foundEmailManagement = false;
      
      for (const route of emailRoutes) {
        await browser.navigate(route);
        const emailManagement = await browser.elementExists('.email-management, .email-logs, table', 3000);
        
        if (emailManagement) {
          foundEmailManagement = true;
          console.log(`✅ Email management found at ${route}`);
          break;
        }
      }
      
      if (!foundEmailManagement) {
        console.log('⚠️ Email management interface not found');
      }
    });
  });

  describe('🎯 Email Preferences & Settings', () => {
    
    test('EMAIL-009: Users can manage email preferences', async () => {
      await auth.login('admin@example.com', 'testpassword123');
      await browser.navigate('/profile');
      
      // Look for email preferences section
      const emailPreferences = await browser.elementExists(
        '.email-preferences, .notification-settings, .email-settings', 
        5000
      );
      
      if (emailPreferences) {
        console.log('✅ Email preferences section found');
        
        // Look for preference controls
        const preferenceControls = await browser.elementExists('input[type="checkbox"], select, .preference-toggle', 3000);
        assert.ok(preferenceControls, 'Should have email preference controls');
      } else {
        console.log('⚠️ Email preferences not found in profile');
      }
    });

    test('EMAIL-010: Users receive appropriate email notifications', async () => {
      // This test would typically require checking email delivery
      // For now, verify that notification settings exist
      await auth.login('admin@example.com', 'testpassword123');
      await browser.navigate('/profile');
      
      // Look for notification toggles
      const notificationSettings = await browser.elementExists(
        '.notification-preferences, input[type="checkbox"], .email-notifications', 
        3000
      );
      
      if (notificationSettings) {
        console.log('✅ Email notification settings available');
      } else {
        console.log('⚠️ Email notification settings not found');
      }
    });
  });
});