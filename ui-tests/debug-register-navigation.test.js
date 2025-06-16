const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('./helpers/browser');
require('dotenv').config();

describe('Debug Register Navigation', () => {
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

  test('should debug register link navigation issue', async () => {
    try {
      console.log('🔍 Starting register navigation debug...');
      
      // Navigate to login page
      await browser.navigate('/login');
      console.log('✓ On login page');
      
      // Check if register link exists
      const hasRegisterLink = await browser.elementExists('[data-testid="register-link"]', 5000);
      console.log(`Register link found: ${hasRegisterLink}`);
      
      if (hasRegisterLink) {
        // Get current URL before click
        const urlBeforeClick = browser.getCurrentUrl();
        console.log(`URL before click: ${urlBeforeClick}`);
        
        // Take screenshot before click
        await browser.screenshot('before-register-click');
        
        // Click register link
        console.log('Clicking register link...');
        await browser.clickElement('[data-testid="register-link"]');
        
        // Wait a bit for potential navigation
        await browser.page.waitForTimeout(2000);
        
        // Get URL after click
        const urlAfterClick = browser.getCurrentUrl();
        console.log(`URL after click: ${urlAfterClick}`);
        
        // Take screenshot after click
        await browser.screenshot('after-register-click');
        
        // Check if URL changed
        if (urlBeforeClick === urlAfterClick) {
          console.log('❌ URL did not change - navigation failed');
          
          // Check if any errors occurred
          const errors = await browser.page.evaluate(() => {
            const errorElements = document.querySelectorAll('.error, .el-message--error, [class*="error"]');
            return Array.from(errorElements).map(el => el.textContent);
          });
          
          if (errors.length > 0) {
            console.log('Errors found on page:', errors);
          }
          
          // Check console errors
          const consoleLogs = [];
          browser.page.on('console', (msg) => {
            if (msg.type() === 'error') {
              consoleLogs.push(msg.text());
            }
          });
          
          // Try direct navigation to register as comparison
          console.log('Trying direct navigation to /register...');
          await browser.navigate('/register');
          const directNavUrl = browser.getCurrentUrl();
          console.log(`Direct navigation URL: ${directNavUrl}`);
          
          if (directNavUrl.includes('/register')) {
            console.log('✓ Direct navigation to /register works');
            await browser.screenshot('direct-register-navigation');
          } else {
            console.log('❌ Direct navigation to /register also fails');
          }
          
        } else {
          console.log('✓ URL changed successfully');
          
          if (urlAfterClick.includes('/register')) {
            console.log('✅ Successfully navigated to register page');
          } else {
            console.log(`⚠️ Navigated but not to register page: ${urlAfterClick}`);
          }
        }
      } else {
        console.log('❌ Register link not found');
        
        // Check what links are available
        const allLinks = await browser.page.evaluate(() => {
          const links = document.querySelectorAll('a, button[data-testid*="link"], [data-testid*="link"]');
          return Array.from(links).map(link => ({
            text: link.textContent.trim(),
            href: link.href || 'no href',
            testId: link.getAttribute('data-testid') || 'no test-id',
            tagName: link.tagName
          }));
        });
        
        console.log('All links found on page:', allLinks);
      }
      
    } catch (error) {
      console.error('Debug test error:', error);
      await browser.screenshot('debug-error');
      throw error;
    }
  });
});