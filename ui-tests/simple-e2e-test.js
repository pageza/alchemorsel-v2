/**
 * Simple E2E Test to verify core functionality with fresh test users
 */

const BrowserManager = require('./helpers/browser');

async function runBasicTests() {
  const browser = new BrowserManager();
  
  try {
    console.log('🚀 Starting E2E tests with fresh test users...\n');
    
    await browser.launch();
    
    // Test 1: Check if frontend is accessible
    console.log('📋 Test 1: Frontend accessibility');
    await browser.navigate('/');
    const url = browser.getCurrentUrl();
    console.log(`✅ Accessed: ${url}`);
    
    // Test 2: Navigate to login page
    console.log('\n📋 Test 2: Login page access');
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const loginFormExists = await browser.elementExists('form, .login-form, input[type="email"]');
    console.log(`${loginFormExists ? '✅' : '❌'} Login form found: ${loginFormExists}`);
    
    // Test 3: Try logging in with verified test user
    console.log('\n📋 Test 3: Login with verified test user');
    if (loginFormExists) {
      try {
        // Fill login form with basic selectors
        const emailInput = await browser.elementExists('input[type="email"], input[name="email"]');
        const passwordInput = await browser.elementExists('input[type="password"], input[name="password"]');
        
        if (emailInput && passwordInput) {
          await browser.fillInput('input[type="email"], input[name="email"]', 'admin@example.com');
          await browser.fillInput('input[type="password"], input[name="password"]', 'testpassword123');
          
          // Submit form
          await browser.clickElement('button[type="submit"], .login-btn, button:contains("Login")');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const currentUrl = browser.getCurrentUrl();
          const loggedIn = currentUrl.includes('/dashboard') || currentUrl.includes('/profile') || !currentUrl.includes('/login');
          console.log(`${loggedIn ? '✅' : '❌'} Login successful: ${loggedIn} (URL: ${currentUrl})`);
          
          if (loggedIn) {
            // Test 4: Check dashboard accessibility
            console.log('\n📋 Test 4: Dashboard access after login');
            await browser.navigate('/dashboard');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const dashboardExists = await browser.elementExists('.dashboard, .dashboard-container, h1, .main-content');
            console.log(`${dashboardExists ? '✅' : '❌'} Dashboard accessible: ${dashboardExists}`);
            
            // Test 5: Check generate recipe page
            console.log('\n📋 Test 5: AI recipe generation access');
            await browser.navigate('/generate');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const generateFormExists = await browser.elementExists('form, textarea, input[type="text"]');
            console.log(`${generateFormExists ? '✅' : '❌'} Generate recipe form accessible: ${generateFormExists}`);
          }
        } else {
          console.log('❌ Login form inputs not found');
        }
      } catch (error) {
        console.log(`❌ Login test failed: ${error.message}`);
      }
    }
    
    // Test 6: User registration test
    console.log('\n📋 Test 6: User registration flow');
    await browser.navigate('/register');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const registerFormExists = await browser.elementExists('form, .register-form, input[type="email"]');
    console.log(`${registerFormExists ? '✅' : '❌'} Register form found: ${registerFormExists}`);
    
    if (registerFormExists) {
      try {
        const uniqueEmail = `test.${Date.now()}@example.com`;
        const uniqueUsername = `testuser${Date.now()}`;
        
        // Fill registration form
        await browser.fillInput('input[name="name"], input[placeholder*="name"]', 'Test User Registration');
        await browser.fillInput('input[name="email"], input[type="email"]', uniqueEmail);
        await browser.fillInput('input[name="username"], input[placeholder*="username"]', uniqueUsername);
        await browser.fillInput('input[name="password"], input[type="password"]', 'testpassword123');
        
        // Look for confirm password field
        const confirmPasswordExists = await browser.elementExists('input[name="confirmPassword"], input[name="confirm_password"]');
        if (confirmPasswordExists) {
          await browser.fillInput('input[name="confirmPassword"], input[name="confirm_password"]', 'testpassword123');
        }
        
        console.log(`📝 Attempting to register user: ${uniqueEmail}`);
        
        // Submit registration
        await browser.clickElement('button[type="submit"], .register-btn, button:contains("Register")');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const currentUrl = browser.getCurrentUrl();
        const registrationSuccess = currentUrl.includes('/dashboard') || currentUrl.includes('/login') || !currentUrl.includes('/register');
        console.log(`${registrationSuccess ? '✅' : '❌'} Registration completed: ${registrationSuccess} (URL: ${currentUrl})`);
        
      } catch (error) {
        console.log(`❌ Registration test failed: ${error.message}`);
      }
    }
    
    // Test 7: Test unverified user access restrictions
    console.log('\n📋 Test 7: Unverified user email verification enforcement');
    
    // First logout if logged in
    await browser.navigate('/');
    const logoutButton = await browser.elementExists('[data-testid="logout"], button:contains("Logout"), .logout-btn');
    if (logoutButton) {
      await browser.clickElement('[data-testid="logout"], button:contains("Logout"), .logout-btn');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Login with unverified user
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await browser.fillInput('input[type="email"], input[name="email"]', 'unverified@example.com');
    await browser.fillInput('input[type="password"], input[name="password"]', 'testpassword123');
    await browser.clickElement('button[type="submit"], .login-btn, button:contains("Login")');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Try to access AI generation
    await browser.navigate('/generate');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = browser.getCurrentUrl();
    const verificationEnforced = !currentUrl.includes('/generate') || await browser.elementExists('.verification-required, .email-verify-prompt');
    console.log(`${verificationEnforced ? '✅' : '❌'} Email verification enforced: ${verificationEnforced}`);
    
    console.log('\n🎉 E2E test suite completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the tests
runBasicTests().catch(console.error);