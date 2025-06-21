/**
 * Verify Test User Login - Quick verification that the test user works
 */

const { TEST_USER } = require('./test-user-credentials');

async function verifyTestUser() {
  const puppeteer = require('puppeteer');
  
  console.log('🚀 Starting test user verification...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('📱 Navigating to login page...');
    await page.goto(TEST_USER.loginUrl, { waitUntil: 'networkidle2' });
    
    console.log('📝 Filling login form...');
    await page.waitForSelector('[data-testid="email-input"]', { timeout: 10000 });
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    
    console.log('🔐 Submitting login...');
    await page.click('[data-testid="login-submit"]');
    
    console.log('⏳ Waiting for redirect to dashboard...');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    console.log('✅ Login successful! Verifying dashboard elements...');
    
    // Check for dashboard elements
    await page.waitForSelector('text=Dashboard', { timeout: 5000 });
    await page.waitForSelector('text=Recipe Generation', { timeout: 5000 });
    
    // Check username display
    const usernameElement = await page.waitForSelector('text=puppeteer-tester', { timeout: 5000 });
    if (usernameElement) {
      console.log('✅ Username displayed correctly on dashboard');
    }
    
    console.log('🎉 Test user verification SUCCESSFUL!');
    console.log(`📧 Email: ${TEST_USER.email}`);
    console.log(`🔑 Password: ${TEST_USER.password}`);
    console.log(`👤 Username: ${TEST_USER.username}`);
    console.log(`✉️ Email Verified: ${TEST_USER.isEmailVerified}`);
    
    // Take screenshot for verification
    await page.screenshot({ path: './ui-tests/screenshots/test-user-dashboard.png' });
    console.log('📸 Screenshot saved: ./ui-tests/screenshots/test-user-dashboard.png');
    
  } catch (error) {
    console.error('❌ Test user verification FAILED:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run verification if called directly
if (require.main === module) {
  verifyTestUser()
    .then(() => {
      console.log('✅ Verification complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyTestUser };