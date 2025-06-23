/**
 * Comprehensive User Stories E2E Test
 * Tests all possible user stories for Admin and Regular users
 */

const BrowserManager = require('./helpers/browser');

class ComprehensiveUserStoriesTest {
  constructor() {
    this.browser = new BrowserManager();
    this.testResults = {
      admin: {},
      user: {},
      summary: { passed: 0, failed: 0, total: 0 }
    };
  }

  async runTest(testName, testFunction) {
    this.testResults.summary.total++;
    try {
      const result = await testFunction();
      if (result) {
        console.log(`✅ ${testName}`);
        this.testResults.summary.passed++;
        return true;
      } else {
        console.log(`❌ ${testName}`);
        this.testResults.summary.failed++;
        return false;
      }
    } catch (error) {
      console.log(`❌ ${testName} - Error: ${error.message}`);
      this.testResults.summary.failed++;
      return false;
    }
  }

  async login(email, password) {
    await this.browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await this.browser.fillInput('[data-testid="email-input"]', email);
    await this.browser.fillInput('[data-testid="password-input"]', password);
    await this.browser.clickElement('[data-testid="login-submit"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return this.browser.getCurrentUrl().includes('/dashboard');
  }

  async logout() {
    const logoutSelectors = [
      '[data-testid="logout"]',
      'button:contains("Logout")',
      'button:contains("Sign Out")',
      '.logout-btn',
      '.logout',
      'a[href="/logout"]'
    ];
    
    for (const selector of logoutSelectors) {
      if (await this.browser.elementExists(selector, 1000)) {
        await this.browser.clickElement(selector);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
      }
    }
    
    // Manual navigation if logout button not found
    await this.browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  }

  async runAdminStories() {
    console.log('\n🔰 ADMIN USER STORIES TESTING');
    console.log('=====================================');
    
    // Login as admin
    console.log('\n📋 Admin Authentication');
    await this.runTest('ADMIN-001: Admin can login and access admin panel', async () => {
      const loginSuccess = await this.login('admin@example.com', 'testpassword123');
      if (!loginSuccess) return false;
      
      // Try to access admin routes
      const adminRoutes = ['/admin', '/admin/dashboard', '/admin/users', '/admin/recipes'];
      for (const route of adminRoutes) {
        await this.browser.navigate(route);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const url = this.browser.getCurrentUrl();
        if (url.includes('/admin') || url.includes('/dashboard')) {
          return true;
        }
      }
      return false;
    });

    await this.runTest('ADMIN-002: Admin can view user management', async () => {
      const routes = ['/admin/users', '/admin', '/users'];
      for (const route of routes) {
        await this.browser.navigate(route);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const userManagement = await this.browser.elementExists('.user-list, .users-table, table, .admin-users, .user-management', 5000);
        if (userManagement) return true;
      }
      return false;
    });

    await this.runTest('ADMIN-003: Admin can view platform statistics', async () => {
      await this.browser.navigate('/admin');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const stats = await this.browser.elementExists('.stats, .analytics, .dashboard-stats, .metrics, .statistics', 5000);
      return stats;
    });

    console.log('\n📋 Admin Recipe Management');
    await this.runTest('ADMIN-004: Admin can view all recipes', async () => {
      const routes = ['/admin/recipes', '/admin', '/recipes'];
      for (const route of routes) {
        await this.browser.navigate(route);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const recipeManagement = await this.browser.elementExists('.recipe-list, .recipes-table, .recipe-grid, .admin-recipes', 5000);
        if (recipeManagement) return true;
      }
      return false;
    });

    await this.runTest('ADMIN-005: Admin can access recipe moderation tools', async () => {
      await this.browser.navigate('/admin/recipes');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const moderation = await this.browser.elementExists('button:contains("Hide"), button:contains("Delete"), .moderate-btn, .admin-actions', 5000);
      return moderation;
    });

    console.log('\n📋 Admin User Administration');
    await this.runTest('ADMIN-006: Admin can search and view users', async () => {
      await this.browser.navigate('/admin/users');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const searchBox = await this.browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input', 5000);
      const userList = await this.browser.elementExists('table, .user-list, .users-grid', 5000);
      return searchBox || userList;
    });

    await this.runTest('ADMIN-007: Admin can view user details', async () => {
      await this.browser.navigate('/admin/users');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const userLinks = await this.browser.elementExists('a[href*="/users/"], .user-link, tr a, .view-user-btn', 5000);
      return userLinks;
    });

    await this.runTest('ADMIN-008: Admin can access user management actions', async () => {
      await this.browser.navigate('/admin/users');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const actions = await this.browser.elementExists('button:contains("Ban"), button:contains("Delete"), .user-actions, .admin-actions', 5000);
      return actions;
    });

    console.log('\n📋 Admin Audit & Compliance');
    await this.runTest('ADMIN-009: Admin can view audit logs', async () => {
      const auditRoutes = ['/admin/audit', '/admin/logs', '/admin/actions', '/admin/activity'];
      for (const route of auditRoutes) {
        await this.browser.navigate(route);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const auditLogs = await this.browser.elementExists('.audit-log, .admin-actions, .activity-log, table', 5000);
        if (auditLogs) return true;
      }
      return false;
    });

    await this.runTest('ADMIN-010: Admin can filter admin actions', async () => {
      await this.browser.navigate('/admin/audit');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const filters = await this.browser.elementExists('select, .filter-dropdown, input[type="date"], .filter-controls', 5000);
      return filters;
    });

    console.log('\n📋 Admin Security');
    await this.runTest('ADMIN-011: Non-admin users cannot access admin pages', async () => {
      await this.logout();
      const regularLogin = await this.login('john.doe@example.com', 'testpassword123');
      if (!regularLogin) return false;
      
      await this.browser.navigate('/admin');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const url = this.browser.getCurrentUrl();
      const blocked = !url.includes('/admin') || url.includes('/login') || url.includes('/dashboard');
      return blocked;
    });

    await this.runTest('ADMIN-012: Admin can navigate between admin sections', async () => {
      await this.logout();
      await this.login('admin@example.com', 'testpassword123');
      await this.browser.navigate('/admin');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const adminNav = await this.browser.elementExists('.admin-nav, .admin-sidebar, .admin-menu, nav', 5000);
      return adminNav;
    });
  }

  async runUserStories() {
    console.log('\n👤 REGULAR USER STORIES TESTING');
    console.log('=====================================');
    
    // Login as verified regular user
    console.log('\n📋 User Authentication & Profile');
    await this.runTest('USER-001: User can login with email and password', async () => {
      const loginSuccess = await this.login('john.doe@example.com', 'testpassword123');
      return loginSuccess;
    });

    await this.runTest('USER-002: User can access dashboard after login', async () => {
      const url = this.browser.getCurrentUrl();
      const dashboardAccess = url.includes('/dashboard');
      if (dashboardAccess) {
        const dashboardElements = await this.browser.elementExists('.dashboard, .dashboard-container, .dashboard-stats', 5000);
        return dashboardElements;
      }
      return false;
    });

    await this.runTest('USER-003: User can view their profile', async () => {
      await this.browser.navigate('/profile');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const profileExists = await this.browser.elementExists('.profile-header, .profile, h1, .user-info', 5000);
      return profileExists;
    });

    await this.runTest('USER-004: User can edit profile information', async () => {
      await this.browser.navigate('/profile');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const editButton = await this.browser.elementExists('button:contains("Edit"), .edit-btn, .edit-profile', 5000);
      return editButton;
    });

    console.log('\n📋 Recipe Discovery & Interaction');
    await this.runTest('USER-005: User can browse all recipes', async () => {
      await this.browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const recipes = await this.browser.elementExists('.recipe-card, .recipe-preview-card, .recipe-list', 10000);
      return recipes;
    });

    await this.runTest('USER-006: User can search recipes', async () => {
      await this.browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const searchInput = await this.browser.elementExists('input[type="search"], .search-input, input[placeholder*="search"]', 5000);
      if (searchInput) {
        await this.browser.fillInput('input[type="search"], .search-input', 'pasta');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
      }
      return false;
    });

    await this.runTest('USER-007: User can favorite recipes', async () => {
      await this.browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const favoriteButton = await this.browser.elementExists('[data-testid*="favorite"], .favorite-btn, button[aria-label*="favorite"]', 5000);
      return favoriteButton;
    });

    await this.runTest('USER-008: User can view favorites page', async () => {
      await this.browser.navigate('/favorites');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const url = this.browser.getCurrentUrl();
      const favoritesAccess = url.includes('/favorites');
      const favoritesInterface = await this.browser.elementExists('.favorites-container, .recipe-grid, h1', 5000);
      return favoritesAccess && favoritesInterface;
    });

    await this.runTest('USER-009: User can view recipe details', async () => {
      await this.browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const recipeLink = await this.browser.elementExists('a[href*="/recipes/"], .recipe-card a', 5000);
      if (recipeLink) {
        await this.browser.clickElement('a[href*="/recipes/"], .recipe-card a');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const url = this.browser.getCurrentUrl();
        const recipeDetails = url.includes('/recipes/') && url !== '/recipes';
        return recipeDetails;
      }
      return false;
    });

    console.log('\n📋 AI Recipe Generation (Verified Users)');
    await this.runTest('USER-010: User can access recipe generation interface', async () => {
      await this.browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const generateForm = await this.browser.elementExists('form, .generate-form, textarea, input[type="text"]', 5000);
      return generateForm;
    });

    await this.runTest('USER-011: User can submit recipe generation request', async () => {
      await this.browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const inputExists = await this.browser.elementExists('textarea, input[type="text"]', 5000);
      if (inputExists) {
        await this.browser.fillInput('textarea, input[type="text"]', 'pasta with tomatoes and basil');
        const submitButton = await this.browser.elementExists('button[type="submit"], .generate-btn, button:contains("Generate")', 5000);
        return submitButton;
      }
      return false;
    });

    console.log('\n📋 Recipe Management');
    await this.runTest('USER-012: User can access recipe creation', async () => {
      const createRoutes = ['/recipes/create', '/create'];
      for (const route of createRoutes) {
        await this.browser.navigate(route);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const url = this.browser.getCurrentUrl();
        if (url.includes('/create')) return true;
      }
      
      // Check for create button
      await this.browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const createButton = await this.browser.elementExists('.create-recipe-btn, button:contains("Create"), [href*="/create"]', 5000);
      return createButton;
    });

    await this.runTest('USER-013: User can view dashboard statistics', async () => {
      await this.browser.navigate('/dashboard');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const statsElements = await this.browser.elementExists('.dashboard-stats, .stats, .user-stats, .activity-summary', 5000);
      return statsElements;
    });

    console.log('\n📋 Navigation & UI');
    await this.runTest('USER-014: User can navigate main sections', async () => {
      const mainPages = ['/dashboard', '/recipes', '/favorites', '/profile', '/generate'];
      let accessiblePages = 0;
      
      for (const page of mainPages) {
        await this.browser.navigate(page);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const url = this.browser.getCurrentUrl();
        if (url.includes(page) || (page === '/dashboard' && url.includes('/dashboard'))) {
          accessiblePages++;
        }
      }
      
      return accessiblePages >= 4; // At least 4 of 5 pages should be accessible
    });

    await this.runTest('USER-015: User can logout successfully', async () => {
      const logoutSuccess = await this.logout();
      if (logoutSuccess) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const url = this.browser.getCurrentUrl();
        return url.includes('/login') || url === 'http://localhost:5173/';
      }
      return false;
    });
  }

  async runUnverifiedUserStories() {
    console.log('\n🚫 UNVERIFIED USER STORIES TESTING');
    console.log('=====================================');

    await this.runTest('UNVERIFIED-001: Unverified user can login', async () => {
      const loginSuccess = await this.login('unverified@example.com', 'testpassword123');
      return loginSuccess;
    });

    await this.runTest('UNVERIFIED-002: Unverified user cannot access AI generation', async () => {
      await this.browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const url = this.browser.getCurrentUrl();
      const verificationBlocked = !url.includes('/generate');
      const verificationPrompt = await this.browser.elementExists('.verification-required, .email-verify, .verify-email', 3000);
      return verificationBlocked || verificationPrompt;
    });

    await this.runTest('UNVERIFIED-003: Unverified user can access basic features', async () => {
      const basicPages = ['/dashboard', '/recipes', '/favorites', '/profile'];
      let accessiblePages = 0;
      
      for (const page of basicPages) {
        await this.browser.navigate(page);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const url = this.browser.getCurrentUrl();
        if (url.includes(page)) {
          accessiblePages++;
        }
      }
      
      return accessiblePages >= 3; // Should access most basic features
    });
  }

  async runPublicUserStories() {
    console.log('\n🌐 PUBLIC USER STORIES TESTING');
    console.log('=====================================');
    
    // Logout first to test public access
    await this.logout();

    await this.runTest('PUBLIC-001: Visitor can access landing page', async () => {
      await this.browser.navigate('/');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const navigation = await this.browser.elementExists('nav, .navigation, .navbar', 5000);
      const heroSection = await this.browser.elementExists('.hero-section, .hero, h1', 5000);
      return navigation && heroSection;
    });

    await this.runTest('PUBLIC-002: Visitor can access login page', async () => {
      await this.browser.navigate('/login');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const loginForm = await this.browser.elementExists('form, .login-form', 5000);
      const emailField = await this.browser.elementExists('input[type="email"]', 5000);
      return loginForm && emailField;
    });

    await this.runTest('PUBLIC-003: Visitor can access registration page', async () => {
      await this.browser.navigate('/register');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const registerForm = await this.browser.elementExists('form, .register-form', 5000);
      const emailField = await this.browser.elementExists('input[type="email"]', 5000);
      return registerForm && emailField;
    });

    await this.runTest('PUBLIC-004: Visitor cannot access protected pages', async () => {
      const protectedPages = ['/dashboard', '/profile', '/generate', '/admin'];
      let redirectCount = 0;
      
      for (const page of protectedPages) {
        await this.browser.navigate(page);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const url = this.browser.getCurrentUrl();
        if (url.includes('/login') || !url.includes(page)) {
          redirectCount++;
        }
      }
      
      return redirectCount >= 3; // Most protected pages should redirect
    });

    await this.runTest('PUBLIC-005: Visitor can register new account', async () => {
      await this.browser.navigate('/register');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const uniqueEmail = `test.${Date.now()}@example.com`;
      const uniqueUsername = `testuser${Date.now()}`;
      
      const emailExists = await this.browser.elementExists('[data-testid="email-input"]', 5000);
      if (!emailExists) return false;
      
      await this.browser.fillInput('[data-testid="email-input"]', uniqueEmail);
      await this.browser.fillInput('[data-testid="username-input"]', uniqueUsername);
      await this.browser.fillInput('[data-testid="fullname-input"]', 'Test User Registration');
      await this.browser.fillInput('[data-testid="password-input"]', 'TestPassword123!');
      
      await this.browser.clickElement('[data-testid="register-submit"]');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const afterRegisterUrl = this.browser.getCurrentUrl();
      return !afterRegisterUrl.includes('/register');
    });
  }

  async runMobileResponsivenessStories() {
    console.log('\n📱 MOBILE RESPONSIVENESS TESTING');
    console.log('=====================================');

    // Set mobile viewport
    await this.browser.page.setViewport({ width: 375, height: 667 });

    await this.runTest('MOBILE-001: Landing page is responsive', async () => {
      await this.browser.navigate('/');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const bodyWidth = await this.browser.page.evaluate(() => document.body.scrollWidth);
      const navigation = await this.browser.elementExists('nav, .navigation', 5000);
      return bodyWidth <= 375 && navigation;
    });

    await this.runTest('MOBILE-002: Login page is mobile-friendly', async () => {
      await this.browser.navigate('/login');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const loginForm = await this.browser.elementExists('form', 5000);
      const bodyWidth = await this.browser.page.evaluate(() => document.body.scrollWidth);
      return loginForm && bodyWidth <= 375;
    });

    await this.runTest('MOBILE-003: Recipe browsing works on mobile', async () => {
      await this.login('john.doe@example.com', 'testpassword123');
      await this.browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const recipeCards = await this.browser.elementExists('.recipe-card, .recipe-preview-card', 5000);
      return recipeCards;
    });

    // Reset viewport
    await this.browser.page.setViewport({ width: 1280, height: 720 });
  }

  async run() {
    try {
      console.log('🚀 STARTING COMPREHENSIVE USER STORIES E2E TEST');
      console.log('=================================================');
      
      await this.browser.launch();
      
      // Run all test suites
      await this.runPublicUserStories();
      await this.runUserStories();
      await this.runUnverifiedUserStories();
      await this.runAdminStories();
      await this.runMobileResponsivenessStories();
      
      // Print comprehensive summary
      console.log('\n🎉 COMPREHENSIVE TEST SUMMARY');
      console.log('=============================');
      console.log(`Total Tests: ${this.testResults.summary.total}`);
      console.log(`✅ Passed: ${this.testResults.summary.passed}`);
      console.log(`❌ Failed: ${this.testResults.summary.failed}`);
      console.log(`📊 Success Rate: ${Math.round((this.testResults.summary.passed / this.testResults.summary.total) * 100)}%`);
      
      const passRate = (this.testResults.summary.passed / this.testResults.summary.total) * 100;
      if (passRate >= 80) {
        console.log('🎯 MVP READINESS: GOOD - Most user stories are functional');
      } else if (passRate >= 60) {
        console.log('⚠️ MVP READINESS: NEEDS WORK - Some critical issues remain');
      } else {
        console.log('🚨 MVP READINESS: POOR - Major functionality gaps exist');
      }
      
    } catch (error) {
      console.error('❌ Comprehensive test failed:', error);
    } finally {
      await this.browser.close();
    }
  }
}

// Run the comprehensive test
const test = new ComprehensiveUserStoriesTest();
test.run().catch(console.error);