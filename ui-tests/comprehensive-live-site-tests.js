/**
 * Comprehensive Live Site E2E Tests
 * 
 * Tests all implemented user stories and flows using screenshots
 * for verification and documentation.
 */

const puppeteer = require('puppeteer');
const { TEST_USER } = require('./test-user-credentials');
const fs = require('fs');
const path = require('path');

// Test configuration
const CONFIG = {
  baseUrl: 'http://localhost:8175', // Via proxy to live site
  timeout: 20000,
  screenshotDir: './screenshots/comprehensive-tests',
  viewport: { width: 1200, height: 800 }
};

// Ensure screenshot directory exists
if (!fs.existsSync(CONFIG.screenshotDir)) {
  fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
}

class LiveSiteE2ETests {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
  }

  async setup() {
    console.log('🚀 Setting up browser for live site testing...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport(CONFIG.viewport);
    
    // Set longer timeout for navigation
    this.page.setDefaultNavigationTimeout(CONFIG.timeout);
    this.page.setDefaultTimeout(CONFIG.timeout);
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async takeScreenshot(name, description = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${name}.png`;
    const filepath = path.join(CONFIG.screenshotDir, filename);
    
    await this.page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot: ${filename} - ${description}`);
    
    return { filename, filepath, description };
  }

  async addTestResult(testName, passed, screenshot, error = null) {
    this.testResults.push({
      testName,
      passed,
      screenshot,
      error: error?.message,
      timestamp: new Date().toISOString()
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
    if (error) console.log(`   Error: ${error.message}`);
  }

  async runAllTests() {
    try {
      await this.setup();
      
      console.log('🧪 Starting comprehensive live site E2E tests...');
      console.log(`🎯 Testing: ${CONFIG.baseUrl}`);
      
      // Authentication Flow Tests
      await this.testLandingPageAccess();
      await this.testLoginFlow();
      await this.testDashboardAccess();
      await this.testProfileManagement();
      
      // Core Feature Tests  
      await this.testRecipeGeneration();
      await this.testRecipeBrowsing();
      await this.testRecipeFavorites();
      await this.testFeedbackSystem();
      
      // Email Verification Tests
      await this.testEmailVerificationBanner();
      
      // Admin Features (if accessible)
      await this.testAdminAccess();
      
      // Generate test report
      await this.generateTestReport();
      
    } catch (error) {
      console.error('💥 Test suite failed:', error);
      await this.takeScreenshot('suite-failure', 'Test suite failure');
    } finally {
      await this.teardown();
    }
  }

  async testLandingPageAccess() {
    try {
      console.log('📋 Testing: Landing page access for unauthenticated users');
      
      await this.page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle2' });
      const screenshot = await this.takeScreenshot('landing-page', 'Landing page load');
      
      // Check for key landing page elements
      const title = await this.page.title();
      const hasLoginButton = await this.page.$('a[href*="login"]') !== null;
      const hasSignUpButton = await this.page.$('a[href*="register"]') !== null;
      
      const passed = title.includes('Alchemorsel') || hasLoginButton || hasSignUpButton;
      await this.addTestResult('Landing Page Access', passed, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('landing-page-error', 'Landing page error');
      await this.addTestResult('Landing Page Access', false, screenshot, error);
    }
  }

  async testLoginFlow() {
    try {
      console.log('📋 Testing: User authentication flow');
      
      await this.page.goto(`${CONFIG.baseUrl}/login`, { waitUntil: 'networkidle2' });
      let screenshot = await this.takeScreenshot('login-page', 'Login page loaded');
      
      // Fill login form
      await this.page.waitForSelector('[data-testid="email-input"]', { timeout: 10000 });
      await this.page.click('[data-testid="email-input"]');
      await this.page.type('[data-testid="email-input"]', TEST_USER.email);
      
      await this.page.click('[data-testid="password-input"]');
      await this.page.type('[data-testid="password-input"]', TEST_USER.password);
      
      screenshot = await this.takeScreenshot('login-form-filled', 'Login form filled');
      
      // Submit login
      await this.page.click('[data-testid="login-submit"]');
      
      // Wait for navigation with longer timeout
      try {
        await this.page.waitForFunction(
          () => window.location.pathname.includes('dashboard') || window.location.pathname === '/',
          { timeout: 15000 }
        );
      } catch (navError) {
        console.log('⏳ Navigation timeout, checking current state...');
      }
      
      screenshot = await this.takeScreenshot('post-login', 'After login submission');
      
      // Check if login was successful
      const currentUrl = this.page.url();
      const isLoggedIn = currentUrl.includes('dashboard') || 
                       await this.page.$('text=Dashboard') !== null ||
                       await this.page.$('text=Generate Recipe') !== null;
      
      await this.addTestResult('User Login Flow', isLoggedIn, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('login-flow-error', 'Login flow error');
      await this.addTestResult('User Login Flow', false, screenshot, error);
    }
  }

  async testDashboardAccess() {
    try {
      console.log('📋 Testing: Dashboard access and display');
      
      await this.page.goto(`${CONFIG.baseUrl}/dashboard`, { waitUntil: 'networkidle2' });
      const screenshot = await this.takeScreenshot('dashboard-page', 'Dashboard loaded');
      
      // Check for dashboard elements
      const hasDashboardTitle = await this.page.$('text=Dashboard') !== null;
      const hasUserInfo = await this.page.$(`text=${TEST_USER.username}`) !== null;
      const hasRecipeStats = await this.page.$('text=Recipes Created') !== null ||
                            await this.page.$('text=Total Recipes') !== null;
      
      const passed = hasDashboardTitle || hasUserInfo || hasRecipeStats;
      await this.addTestResult('Dashboard Access', passed, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('dashboard-error', 'Dashboard access error');
      await this.addTestResult('Dashboard Access', false, screenshot, error);
    }
  }

  async testProfileManagement() {
    try {
      console.log('📋 Testing: Profile management functionality');
      
      await this.page.goto(`${CONFIG.baseUrl}/profile`, { waitUntil: 'networkidle2' });
      let screenshot = await this.takeScreenshot('profile-page', 'Profile page loaded');
      
      // Check profile elements
      const hasProfileInfo = await this.page.$(`text=${TEST_USER.username}`) !== null;
      const hasEditButton = await this.page.$('button:has-text("Edit")') !== null ||
                           await this.page.$('a[href*="edit"]') !== null;
      
      let editPageWorks = false;
      if (hasEditButton) {
        try {
          await this.page.click('button:has-text("Edit"), a[href*="edit"]');
          await this.page.waitForTimeout(2000);
          screenshot = await this.takeScreenshot('profile-edit', 'Profile edit page');
          editPageWorks = await this.page.$('input[type="text"]') !== null;
        } catch (editError) {
          console.log('⚠️ Edit profile navigation failed:', editError.message);
        }
      }
      
      const passed = hasProfileInfo && (hasEditButton || editPageWorks);
      await this.addTestResult('Profile Management', passed, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('profile-error', 'Profile management error');
      await this.addTestResult('Profile Management', false, screenshot, error);
    }
  }

  async testRecipeGeneration() {
    try {
      console.log('📋 Testing: AI recipe generation functionality');
      
      await this.page.goto(`${CONFIG.baseUrl}/generate`, { waitUntil: 'networkidle2' });
      let screenshot = await this.takeScreenshot('recipe-generator', 'Recipe generator page');
      
      // Check for recipe generation elements
      const hasPromptInput = await this.page.$('textarea, input[type="text"]') !== null;
      const hasGenerateButton = await this.page.$('button:has-text("Generate")') !== null;
      
      if (hasPromptInput && hasGenerateButton) {
        try {
          // Try filling and generating a simple recipe
          await this.page.click('textarea, input[type="text"]');
          await this.page.type('textarea, input[type="text"]', 'Simple pasta recipe');
          
          screenshot = await this.takeScreenshot('recipe-prompt-filled', 'Recipe prompt filled');
          
          await this.page.click('button:has-text("Generate")');
          await this.page.waitForTimeout(3000); // Wait for generation
          
          screenshot = await this.takeScreenshot('recipe-generation-result', 'Recipe generation result');
        } catch (genError) {
          console.log('⚠️ Recipe generation interaction failed:', genError.message);
        }
      }
      
      const passed = hasPromptInput && hasGenerateButton;
      await this.addTestResult('Recipe Generation', passed, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('recipe-gen-error', 'Recipe generation error');
      await this.addTestResult('Recipe Generation', false, screenshot, error);
    }
  }

  async testRecipeBrowsing() {
    try {
      console.log('📋 Testing: Recipe browsing and search');
      
      await this.page.goto(`${CONFIG.baseUrl}/recipes`, { waitUntil: 'networkidle2' });
      const screenshot = await this.takeScreenshot('recipe-browsing', 'Recipe browsing page');
      
      // Check for recipe browsing elements
      const hasRecipeCards = await this.page.$('.recipe-card, [data-testid*="recipe"]') !== null;
      const hasSearchInput = await this.page.$('input[placeholder*="search"], input[type="search"]') !== null;
      const hasRecipeList = await this.page.$('h1, h2, h3') !== null; // Any recipe titles
      
      const passed = hasRecipeCards || hasSearchInput || hasRecipeList;
      await this.addTestResult('Recipe Browsing', passed, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('recipe-browse-error', 'Recipe browsing error');
      await this.addTestResult('Recipe Browsing', false, screenshot, error);
    }
  }

  async testRecipeFavorites() {
    try {
      console.log('📋 Testing: Recipe favorites functionality');
      
      await this.page.goto(`${CONFIG.baseUrl}/favorites`, { waitUntil: 'networkidle2' });
      const screenshot = await this.takeScreenshot('favorites-page', 'Favorites page');
      
      // Check for favorites elements
      const hasFavoritesSection = await this.page.$('text=Favorites') !== null ||
                                 await this.page.$('text=Favorite') !== null;
      const hasRecipeCards = await this.page.$('.recipe-card, [data-testid*="recipe"]') !== null;
      const hasEmptyState = await this.page.$('text=No favorites') !== null ||
                          await this.page.$('text=no recipes') !== null;
      
      const passed = hasFavoritesSection || hasRecipeCards || hasEmptyState;
      await this.addTestResult('Recipe Favorites', passed, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('favorites-error', 'Favorites functionality error');
      await this.addTestResult('Recipe Favorites', false, screenshot, error);
    }
  }

  async testFeedbackSystem() {
    try {
      console.log('📋 Testing: Feedback system functionality');
      
      // Look for feedback button (usually a floating action button)
      await this.page.goto(`${CONFIG.baseUrl}/dashboard`, { waitUntil: 'networkidle2' });
      
      const feedbackButton = await this.page.$('button:has-text("Feedback"), [data-testid*="feedback"]');
      let screenshot = await this.takeScreenshot('feedback-button-search', 'Looking for feedback button');
      
      if (feedbackButton) {
        await feedbackButton.click();
        await this.page.waitForTimeout(1000);
        
        screenshot = await this.takeScreenshot('feedback-modal', 'Feedback modal opened');
        
        // Check for feedback form elements
        const hasTypeSelect = await this.page.$('select, [role="combobox"]') !== null;
        const hasTitleInput = await this.page.$('input[placeholder*="title"], input[label*="title"]') !== null;
        const hasDescriptionArea = await this.page.$('textarea') !== null;
        
        const passed = hasTypeSelect || hasTitleInput || hasDescriptionArea;
        await this.addTestResult('Feedback System', passed, screenshot);
      } else {
        await this.addTestResult('Feedback System', false, screenshot, new Error('Feedback button not found'));
      }
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('feedback-error', 'Feedback system error');
      await this.addTestResult('Feedback System', false, screenshot, error);
    }
  }

  async testEmailVerificationBanner() {
    try {
      console.log('📋 Testing: Email verification system');
      
      await this.page.goto(`${CONFIG.baseUrl}/dashboard`, { waitUntil: 'networkidle2' });
      const screenshot = await this.takeScreenshot('email-verification-check', 'Checking email verification status');
      
      // Since our test user is verified, we shouldn't see verification banner
      const hasVerificationBanner = await this.page.$('text=verify', 'text=Verify') !== null;
      const hasVerifiedIndicator = await this.page.$('text=verified', 'text=Verified') !== null;
      
      // For verified user, we expect NO verification banner
      const passed = !hasVerificationBanner || hasVerifiedIndicator;
      await this.addTestResult('Email Verification Status', passed, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('verification-error', 'Email verification error');
      await this.addTestResult('Email Verification Status', false, screenshot, error);
    }
  }

  async testAdminAccess() {
    try {
      console.log('📋 Testing: Admin functionality access');
      
      await this.page.goto(`${CONFIG.baseUrl}/admin`, { waitUntil: 'networkidle2' });
      const screenshot = await this.takeScreenshot('admin-access', 'Admin access attempt');
      
      // Check if admin panel is accessible (depends on user permissions)
      const hasAdminContent = await this.page.$('text=Admin', 'text=Management') !== null;
      const isAccessDenied = await this.page.$('text=Access Denied', 'text=403', 'text=Unauthorized') !== null;
      
      // For regular test user, we expect either no access or limited access
      const passed = isAccessDenied || hasAdminContent;
      await this.addTestResult('Admin Access', passed, screenshot);
      
    } catch (error) {
      const screenshot = await this.takeScreenshot('admin-error', 'Admin access error');
      await this.addTestResult('Admin Access', false, screenshot, error);
    }
  }

  async generateTestReport() {
    const report = {
      testSuite: 'Comprehensive Live Site E2E Tests',
      timestamp: new Date().toISOString(),
      baseUrl: CONFIG.baseUrl,
      testUser: {
        email: TEST_USER.email,
        username: TEST_USER.username,
        isEmailVerified: TEST_USER.isEmailVerified
      },
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(t => t.passed).length,
        failed: this.testResults.filter(t => !t.passed).length,
        successRate: `${Math.round((this.testResults.filter(t => t.passed).length / this.testResults.length) * 100)}%`
      },
      results: this.testResults
    };

    const reportPath = path.join(CONFIG.screenshotDir, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 TEST REPORT SUMMARY');
    console.log('========================');
    console.log(`📍 Base URL: ${CONFIG.baseUrl}`);
    console.log(`👤 Test User: ${TEST_USER.email}`);
    console.log(`📈 Success Rate: ${report.summary.successRate}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`📂 Screenshots: ${CONFIG.screenshotDir}`);
    console.log(`📄 Full Report: ${reportPath}`);
    
    return report;
  }
}

// Run tests if called directly
if (require.main === module) {
  const testSuite = new LiveSiteE2ETests();
  testSuite.runAllTests()
    .then(() => {
      console.log('🎉 Test suite completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = LiveSiteE2ETests;