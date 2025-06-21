/**
 * E2E test using the correct selectors from frontend code
 */

const BrowserManager = require('./helpers/browser');

async function runCorrectFlow() {
  const browser = new BrowserManager();
  
  try {
    console.log('🚀 Starting E2E test with correct selectors...\n');
    
    await browser.launch();
    
    // Test 1: Login with existing verified user
    console.log('📋 Test 1: Login with admin@example.com');
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Use the correct data-testid selectors from LoginView.vue
    await browser.fillInput('[data-testid="email-input"] input', 'admin@example.com');
    await browser.fillInput('[data-testid="password-input"] input', 'testpassword123');
    
    console.log('✅ Form filled, clicking submit button...');
    await browser.clickElement('[data-testid="login-submit"]');
    
    // Wait for response and check result
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const afterLoginUrl = browser.getCurrentUrl();
    const loginSuccessful = afterLoginUrl.includes('/dashboard');
    console.log(`${loginSuccessful ? '✅' : '❌'} Login result: ${loginSuccessful} (URL: ${afterLoginUrl})`);
    
    if (!loginSuccessful) {
      console.log('❌ Login failed, taking screenshot...');
      await browser.screenshot('login-failed');
      
      // Check for error messages
      const errorExists = await browser.elementExists('.el-message--error, .error-message, .alert-error');
      if (errorExists) {
        console.log('⚠️ Error message found on page');
      }
    }
    
    if (loginSuccessful) {
      // Test 2: Navigate to protected pages
      console.log('\n📋 Test 2: Testing protected page access');
      
      const protectedPages = [
        { path: '/dashboard', name: 'Dashboard' },
        { path: '/profile', name: 'Profile' },
        { path: '/generate', name: 'AI Generation' },
        { path: '/recipes', name: 'Recipes' },
        { path: '/favorites', name: 'Favorites' }
      ];
      
      for (const page of protectedPages) {
        await browser.navigate(page.path);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const url = browser.getCurrentUrl();
        const accessible = url.includes(page.path);
        console.log(`  ${page.name}: ${accessible ? '✅' : '❌'} (${url})`);
      }
      
      // Test 3: Test AI recipe generation (if verified user)
      console.log('\n📋 Test 3: Testing AI recipe generation');
      await browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generateFormExists = await browser.elementExists('form, textarea, input');
      if (generateFormExists) {
        console.log('✅ Recipe generation form accessible');
        
        // Try to submit a recipe generation request
        const textInput = await browser.elementExists('textarea, input[type="text"]');
        if (textInput) {
          await browser.fillInput('textarea, input[type="text"]', 'pasta with tomatoes and basil');
          console.log('✅ Recipe request filled');
          
          const submitButton = await browser.elementExists('button[type="submit"], .generate-btn, button:contains("Generate")');
          if (submitButton) {
            await browser.clickElement('button[type="submit"], .generate-btn, button:contains("Generate")');
            console.log('✅ Recipe generation submitted');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      } else {
        console.log('❌ Recipe generation form not found');
      }
      
      // Test 4: Logout
      console.log('\n📋 Test 4: Testing logout');
      const logoutButton = await browser.elementExists('[data-testid="logout"], .logout-btn, button:contains("Logout")');
      if (logoutButton) {
        await browser.clickElement('[data-testid="logout"], .logout-btn, button:contains("Logout")');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const loggedOut = browser.getCurrentUrl().includes('/login') || browser.getCurrentUrl() === 'http://localhost:5173/';
        console.log(`${loggedOut ? '✅' : '❌'} Logout successful: ${loggedOut}`);
      } else {
        console.log('⚠️ Logout button not found');
      }
    }
    
    // Test 5: User registration
    console.log('\n📋 Test 5: Testing user registration');
    await browser.navigate('/register');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const uniqueEmail = `test.${Date.now()}@example.com`;
    const uniqueUsername = `testuser${Date.now()}`;
    
    // Use correct data-testid selectors from RegisterView.vue
    try {
      await browser.fillInput('[data-testid="email-input"] input', uniqueEmail);
      await browser.fillInput('[data-testid="username-input"] input', uniqueUsername);
      await browser.fillInput('[data-testid="fullname-input"] input', 'Test User Registration');
      await browser.fillInput('[data-testid="password-input"] input', 'TestPassword123!');
      
      console.log(`📝 Registration form filled for: ${uniqueEmail}`);
      
      // Click submit button
      await browser.clickElement('[data-testid="register-submit"]');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const afterRegisterUrl = browser.getCurrentUrl();
      const registrationSuccessful = !afterRegisterUrl.includes('/register');
      console.log(`${registrationSuccessful ? '✅' : '❌'} Registration result: ${registrationSuccessful} (URL: ${afterRegisterUrl})`);
      
      if (!registrationSuccessful) {
        await browser.screenshot('registration-failed');
      }
      
    } catch (error) {
      console.log(`❌ Registration failed: ${error.message}`);
      await browser.screenshot('registration-error');
    }
    
    // Test 6: Unverified user restrictions
    console.log('\n📋 Test 6: Testing unverified user restrictions');
    
    // Login with unverified user
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await browser.fillInput('[data-testid="email-input"] input', 'unverified@example.com');
    await browser.fillInput('[data-testid="password-input"] input', 'testpassword123');
    await browser.clickElement('[data-testid="login-submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const unverifiedLoginUrl = browser.getCurrentUrl();
    const unverifiedLoginSuccess = unverifiedLoginUrl.includes('/dashboard');
    console.log(`${unverifiedLoginSuccess ? '✅' : '❌'} Unverified user login: ${unverifiedLoginSuccess}`);
    
    if (unverifiedLoginSuccess) {
      // Try to access AI generation
      await browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generateUrl = browser.getCurrentUrl();
      const verificationEnforced = !generateUrl.includes('/generate') || await browser.elementExists('.verification-required, .email-verify');
      console.log(`${verificationEnforced ? '✅' : '❌'} Email verification enforced for AI generation: ${verificationEnforced}`);
    }
    
    console.log('\n🎉 E2E test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await browser.screenshot('test-error');
  } finally {
    await browser.close();
  }
}

// Run the test
runCorrectFlow().catch(console.error);