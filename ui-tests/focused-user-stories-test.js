/**
 * Focused User Stories Test
 * Tests admin and regular user stories systematically
 */

const BrowserManager = require('./helpers/browser');

async function testUserStories() {
  const browser = new BrowserManager();
  const results = {
    admin: { passed: 0, failed: 0, tests: [] },
    user: { passed: 0, failed: 0, tests: [] },
    total: { passed: 0, failed: 0, tests: 0 }
  };

  async function runTest(category, testName, testFunc) {
    results.total.tests++;
    try {
      const success = await testFunc();
      if (success) {
        console.log(`✅ ${testName}`);
        results[category].passed++;
        results.total.passed++;
      } else {
        console.log(`❌ ${testName}`);
        results[category].failed++;
        results.total.failed++;
      }
      results[category].tests.push({ name: testName, success });
    } catch (error) {
      console.log(`❌ ${testName} - Error: ${error.message}`);
      results[category].failed++;
      results.total.failed++;
      results[category].tests.push({ name: testName, success: false, error: error.message });
    }
  }

  async function login(email, password) {
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await browser.fillInput('[data-testid="email-input"]', email);
    await browser.fillInput('[data-testid="password-input"]', password);
    await browser.clickElement('[data-testid="login-submit"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return browser.getCurrentUrl().includes('/dashboard');
  }

  async function logout() {
    // Clear browser state to ensure clean logout
    await browser.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await browser.page.deleteCookie(...(await browser.page.cookies()));
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  try {
    console.log('🚀 FOCUSED USER STORIES TEST');
    console.log('=============================\n');
    
    await browser.launch();

    // Admin User Tests
    console.log('🔰 ADMIN USER TESTS');
    console.log('===================');
    
    await runTest('admin', 'ADMIN-001: Admin can login successfully', async () => {
      return await login('admin@example.com', 'testpassword123');
    });

    await runTest('admin', 'ADMIN-002: Admin can access dashboard', async () => {
      const url = browser.getCurrentUrl();
      return url.includes('/dashboard');
    });

    await runTest('admin', 'ADMIN-003: Admin can access profile page', async () => {
      await browser.navigate('/profile');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return browser.getCurrentUrl().includes('/profile');
    });

    await runTest('admin', 'ADMIN-004: Admin can access AI generation', async () => {
      await browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const hasAccess = browser.getCurrentUrl().includes('/generate');
      const hasForm = await browser.elementExists('form, textarea, input[type="text"]', 5000);
      return hasAccess && hasForm;
    });

    await runTest('admin', 'ADMIN-005: Admin can browse recipes', async () => {
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return browser.getCurrentUrl().includes('/recipes');
    });

    await runTest('admin', 'ADMIN-006: Admin can access favorites', async () => {
      await browser.navigate('/favorites');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return browser.getCurrentUrl().includes('/favorites');
    });

    // Regular User Tests
    console.log('\n👤 REGULAR USER TESTS');
    console.log('=====================');
    
    // Logout admin user first
    console.log('🔄 Logging out admin user...');
    await logout();

    await runTest('user', 'USER-001: Regular user can login', async () => {
      return await login('john.doe@example.com', 'testpassword123');
    });

    await runTest('user', 'USER-002: Regular user can access dashboard', async () => {
      const url = browser.getCurrentUrl();
      return url.includes('/dashboard');
    });

    await runTest('user', 'USER-003: Regular user can view profile', async () => {
      await browser.navigate('/profile');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const hasAccess = browser.getCurrentUrl().includes('/profile');
      const hasProfile = await browser.elementExists('.profile, h1, .user-info', 5000);
      return hasAccess && hasProfile;
    });

    await runTest('user', 'USER-004: Regular user can access AI generation (verified)', async () => {
      await browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const hasAccess = browser.getCurrentUrl().includes('/generate');
      const hasForm = await browser.elementExists('form, textarea, input[type="text"]', 5000);
      return hasAccess && hasForm;
    });

    await runTest('user', 'USER-005: Regular user can browse recipes', async () => {
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const hasAccess = browser.getCurrentUrl().includes('/recipes');
      const hasRecipes = await browser.elementExists('.recipe-card, .recipe-preview-card, .recipe-list', 5000);
      return hasAccess && hasRecipes;
    });

    await runTest('user', 'USER-006: Regular user can access favorites', async () => {
      await browser.navigate('/favorites');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const hasAccess = browser.getCurrentUrl().includes('/favorites');
      const hasFavoritesInterface = await browser.elementExists('.favorites-container, .recipe-grid, h1', 5000);
      return hasAccess && hasFavoritesInterface;
    });

    // Unverified User Tests  
    console.log('\n🚫 UNVERIFIED USER TESTS');
    console.log('========================');
    
    // Logout regular user first
    console.log('🔄 Logging out regular user...');
    await logout();

    await runTest('user', 'UNVERIFIED-001: Unverified user can login', async () => {
      return await login('unverified@example.com', 'testpassword123');
    });

    await runTest('user', 'UNVERIFIED-002: Unverified user blocked from AI generation', async () => {
      await browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const url = browser.getCurrentUrl();
      const blocked = !url.includes('/generate');
      const hasVerificationPrompt = await browser.elementExists('.verification-required, .email-verify', 3000);
      return blocked || hasVerificationPrompt;
    });

    // Public Access Tests
    console.log('\n🌐 PUBLIC ACCESS TESTS');
    console.log('======================');
    
    // Logout unverified user first
    console.log('🔄 Logging out unverified user...');
    await logout();

    await runTest('user', 'PUBLIC-001: Visitor can access landing page', async () => {
      await browser.navigate('/');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const navigation = await browser.elementExists('nav, .navigation, .navbar', 5000);
      const content = await browser.elementExists('.hero, h1, .featured-section', 5000);
      return navigation && content;
    });

    await runTest('user', 'PUBLIC-002: Visitor can access login page', async () => {
      await browser.navigate('/login');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const loginForm = await browser.elementExists('form, .login-form', 5000);
      const emailField = await browser.elementExists('[data-testid="email-input"]', 5000);
      return loginForm && emailField;
    });

    await runTest('user', 'PUBLIC-003: Visitor can access registration page', async () => {
      await browser.navigate('/register');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const registerForm = await browser.elementExists('form, .register-form', 5000);
      const emailField = await browser.elementExists('[data-testid="email-input"]', 5000);
      return registerForm && emailField;
    });

    await runTest('user', 'PUBLIC-004: Visitor cannot access protected pages', async () => {
      await browser.navigate('/dashboard');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const url = browser.getCurrentUrl();
      return url.includes('/login') || !url.includes('/dashboard');
    });

    // Print Results
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    console.log(`Admin Tests: ${results.admin.passed}/${results.admin.passed + results.admin.failed} passed`);
    console.log(`User Tests: ${results.user.passed}/${results.user.passed + results.user.failed} passed`);
    console.log(`Total: ${results.total.passed}/${results.total.tests} tests passed`);
    console.log(`Success Rate: ${Math.round((results.total.passed / results.total.tests) * 100)}%`);

    const passRate = (results.total.passed / results.total.tests) * 100;
    if (passRate >= 80) {
      console.log('\n🎯 MVP STATUS: READY - Core user stories functional');
    } else if (passRate >= 60) {
      console.log('\n⚠️ MVP STATUS: NEEDS WORK - Some issues remain');
    } else {
      console.log('\n🚨 MVP STATUS: CRITICAL ISSUES - Major gaps exist');
    }

    return results;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the focused test
testUserStories().catch(console.error);