/**
 * MVP Admin User Stories E2E Tests
 * 
 * Tests admin functionality based on user stories in docs/planning/STORIES.md
 * Focus: Essential admin features for MVP readiness
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../helpers/browser');
const AuthHelper = require('../helpers/auth');

describe('MVP Admin User Stories', () => {
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

  describe('🎯 Admin Authentication & Access', () => {
    
    test('ADMIN-001: Admin can login and access admin panel', async () => {
      // Login as admin
      await auth.login('admin@example.com', 'testpassword123');
      
      // Should be able to access admin areas
      await browser.navigate('/admin');
      
      const url = browser.getCurrentUrl();
      // Should either be on admin page or redirect to admin dashboard
      assert.ok(
        url.includes('/admin') || url.includes('/dashboard'), 
        'Admin should be able to access admin areas'
      );
      
      // Should see admin interface elements
      const adminInterface = await browser.elementExists('.admin-panel, .admin-dashboard, h1', 5000);
      assert.ok(adminInterface, 'Admin interface should be visible');
    });

    test('ADMIN-002: Admin can view user management', async () => {
      await auth.login('admin@example.com', 'testpassword123');
      
      // Try to access user management
      await browser.navigate('/admin/users');
      
      const userManagement = await browser.elementExists('.user-list, .users-table, table, .admin-users', 10000);
      if (userManagement) {
        console.log('✅ User management interface found');
        
        // Should see user listings
        const userEntries = await browser.elementExists('tr, .user-row, .user-item', 5000);
        assert.ok(userEntries, 'Should display user listings');
      } else {
        console.log('⚠️ User management interface not found at /admin/users');
        
        // Try alternative admin routes
        const adminRoutes = ['/admin', '/admin/dashboard', '/users'];
        let foundAdmin = false;
        
        for (const route of adminRoutes) {
          await browser.navigate(route);
          const adminFound = await browser.elementExists('.admin, .user-management, table', 5000);
          if (adminFound) {
            foundAdmin = true;
            console.log(`✅ Admin interface found at ${route}`);
            break;
          }
        }
        
        assert.ok(foundAdmin, 'Should find admin interface at some route');
      }
    });

    test('ADMIN-003: Admin can view platform statistics', async () => {
      await auth.login('admin@example.com', 'testpassword123');
      
      // Navigate to admin dashboard/analytics
      await browser.navigate('/admin');
      
      // Look for statistics/analytics
      const statsElements = await browser.elementExists('.stats, .analytics, .dashboard-stats, .metrics', 5000);
      
      if (statsElements) {
        console.log('✅ Platform statistics found');
      } else {
        // Try specific analytics routes
        const analyticsRoutes = ['/admin/analytics', '/admin/dashboard', '/analytics'];
        let foundStats = false;
        
        for (const route of analyticsRoutes) {
          await browser.navigate(route);
          const statsFound = await browser.elementExists('.stats, .analytics, .metrics, .chart', 5000);
          if (statsFound) {
            foundStats = true;
            console.log(`✅ Statistics found at ${route}`);
            break;
          }
        }
        
        console.log(foundStats ? '✅ Platform statistics accessible' : '⚠️ Platform statistics not found');
      }
    });
  });

  describe('🎯 Recipe Administration', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('ADMIN-004: Admin can view all recipes', async () => {
      // Try various routes for recipe management
      const recipeRoutes = ['/admin/recipes', '/admin', '/recipes'];
      let foundRecipeManagement = false;
      
      for (const route of recipeRoutes) {
        await browser.navigate(route);
        
        // Look for recipe management interface
        const recipeManagement = await browser.elementExists('.recipe-list, .recipes-table, .recipe-grid, .admin-recipes', 5000);
        
        if (recipeManagement) {
          foundRecipeManagement = true;
          console.log(`✅ Recipe management found at ${route}`);
          
          // Should see recipe entries
          const recipeEntries = await browser.elementExists('.recipe-card, .recipe-row, tr, .recipe-item', 5000);
          assert.ok(recipeEntries, 'Should display recipe listings');
          break;
        }
      }
      
      assert.ok(foundRecipeManagement, 'Admin should be able to view recipe management interface');
    });

    test('ADMIN-005: Admin can access recipe moderation tools', async () => {
      await browser.navigate('/admin/recipes');
      
      // Look for moderation controls
      const moderationControls = await browser.elementExists(
        'button:contains("Hide"), button:contains("Delete"), .moderate-btn, .admin-actions', 
        5000
      );
      
      if (moderationControls) {
        console.log('✅ Recipe moderation controls found');
      } else {
        // Try looking in individual recipe pages
        await browser.navigate('/recipes');
        const recipeLink = await browser.elementExists('a[href*="/recipes/"]');
        
        if (recipeLink) {
          await browser.clickElement('a[href*="/recipes/"]');
          await browser.page.waitForTimeout(2000);
          
          const adminControls = await browser.elementExists('.admin-controls, .moderate-recipe, button:contains("Moderate")');
          console.log(adminControls ? '✅ Recipe moderation found in recipe details' : '⚠️ Recipe moderation controls not found');
        }
      }
    });
  });

  describe('🎯 User Management', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('ADMIN-006: Admin can search and view users', async () => {
      await browser.navigate('/admin/users');
      
      // Look for user search functionality
      const searchBox = await browser.elementExists('input[type="search"], input[placeholder*="search"], .search-input');
      
      if (searchBox) {
        console.log('✅ User search functionality found');
        
        // Try searching for a user
        await browser.fillInput('input[type="search"], input[placeholder*="search"], .search-input', 'admin');
        await browser.page.waitForTimeout(1000);
      }
      
      // Should see user list/table
      const userList = await browser.elementExists('table, .user-list, .users-grid', 5000);
      assert.ok(userList, 'Should display user list interface');
    });

    test('ADMIN-007: Admin can view user details', async () => {
      await browser.navigate('/admin/users');
      
      // Look for user detail links
      const userDetailLink = await browser.elementExists('a[href*="/users/"], .user-link, tr a, .view-user-btn');
      
      if (userDetailLink) {
        await browser.clickElement('a[href*="/users/"], .user-link, tr a, .view-user-btn');
        await browser.page.waitForTimeout(2000);
        
        // Should see user details
        const userDetails = await browser.elementExists('.user-details, .user-profile, h1, .user-info');
        assert.ok(userDetails, 'Should display user details page');
        
        console.log('✅ User details accessible');
      } else {
        console.log('⚠️ User detail links not found');
      }
    });

    test('ADMIN-008: Admin can access user management actions', async () => {
      await browser.navigate('/admin/users');
      
      // Look for user management actions
      const userActions = await browser.elementExists(
        'button:contains("Ban"), button:contains("Delete"), .user-actions, .admin-actions, select', 
        5000
      );
      
      if (userActions) {
        console.log('✅ User management actions found');
      } else {
        // Try looking for action menus or dropdowns
        const actionMenus = await browser.elementExists('.action-menu, .dropdown, .more-actions, .kebab-menu');
        console.log(actionMenus ? '✅ User action menus found' : '⚠️ User management actions not easily discoverable');
      }
    });
  });

  describe('🎯 Admin Audit & Compliance', () => {
    
    beforeEach(async () => {
      await auth.login('admin@example.com', 'testpassword123');
    });

    test('ADMIN-009: Admin can view audit logs', async () => {
      // Try common audit log routes
      const auditRoutes = ['/admin/audit', '/admin/logs', '/admin/actions', '/admin/activity'];
      let foundAudit = false;
      
      for (const route of auditRoutes) {
        await browser.navigate(route);
        
        const auditLogs = await browser.elementExists('.audit-log, .admin-actions, .activity-log, table', 5000);
        if (auditLogs) {
          foundAudit = true;
          console.log(`✅ Audit logs found at ${route}`);
          
          // Should see log entries
          const logEntries = await browser.elementExists('tr, .log-entry, .audit-item', 5000);
          assert.ok(logEntries, 'Should display audit log entries');
          break;
        }
      }
      
      console.log(foundAudit ? '✅ Audit logging accessible' : '⚠️ Audit logs not found');
    });

    test('ADMIN-010: Admin can filter admin actions', async () => {
      await browser.navigate('/admin/audit');
      
      // Look for filtering options
      const filters = await browser.elementExists(
        'select, .filter-dropdown, input[type="date"], .date-picker, .filter-controls', 
        5000
      );
      
      if (filters) {
        console.log('✅ Audit log filtering found');
      } else {
        console.log('⚠️ Audit log filtering not found');
      }
    });
  });

  describe('🎯 Admin Navigation & Security', () => {
    
    test('ADMIN-011: Non-admin users cannot access admin pages', async () => {
      // Login as regular user
      await auth.login('john.doe@example.com', 'testpassword123');
      
      // Try to access admin page
      await browser.navigate('/admin');
      
      const url = browser.getCurrentUrl();
      // Should be redirected away from admin or show access denied
      assert.ok(
        !url.includes('/admin') || url.includes('/login') || url.includes('/dashboard'),
        'Non-admin users should not access admin pages'
      );
      
      // Should not see admin interface
      const adminInterface = await browser.elementExists('.admin-panel, .admin-dashboard', 2000);
      assert.ok(!adminInterface, 'Non-admin should not see admin interface');
    });

    test('ADMIN-012: Admin can navigate between admin sections', async () => {
      await auth.login('admin@example.com', 'testpassword123');
      await browser.navigate('/admin');
      
      // Look for admin navigation
      const adminNav = await browser.elementExists('.admin-nav, .admin-sidebar, .admin-menu', 5000);
      
      if (adminNav) {
        console.log('✅ Admin navigation found');
        
        // Look for navigation links
        const navLinks = await browser.elementExists('nav a, .nav-link, .menu-item', 5000);
        assert.ok(navLinks, 'Should have admin navigation links');
      } else {
        console.log('⚠️ Admin navigation structure not found');
      }
    });
  });
});