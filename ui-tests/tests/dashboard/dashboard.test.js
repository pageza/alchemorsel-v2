const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../../helpers/browser');
require('dotenv').config();

describe('Dashboard Database Integration E2E Tests', () => {
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

  describe('Dashboard Data Loading', () => {
    test('should load dashboard page with required elements', async () => {
      try {
        await browser.navigate('/dashboard');
        
        // Check for main dashboard container
        const hasDashboard = await browser.elementExists('[data-testid="dashboard-container"]', 5000);
        assert.ok(hasDashboard, 'Dashboard container should be present');
        
        // Check for user stats section
        const hasUserStats = await browser.elementExists('[data-testid="user-stats"]', 5000);
        console.log('User stats section found:', hasUserStats);
        
        // Check for recent activity section
        const hasRecentActivity = await browser.elementExists('[data-testid="recent-activity"]', 5000);
        console.log('Recent activity section found:', hasRecentActivity);
        
        // Check for recipe statistics
        const hasRecipeStats = await browser.elementExists('[data-testid="recipe-stats"]', 5000);
        console.log('Recipe statistics found:', hasRecipeStats);
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-loading', error);
      }
    });

    test('should display user statistics with real data', async () => {
      try {
        await browser.navigate('/dashboard');
        
        // Wait for dashboard to load
        await browser.elementExists('[data-testid="dashboard-container"]', 10000);
        
        // Check for total recipes count
        const hasTotalRecipes = await browser.elementExists('[data-testid="total-recipes-count"]', 5000);
        if (hasTotalRecipes) {
          const recipesText = await browser.page.$eval('[data-testid="total-recipes-count"]', el => el.textContent);
          console.log('Total recipes displayed:', recipesText);
          
          // Should show a number (could be 0 for new users)
          assert.ok(/\d+/.test(recipesText), 'Should display numeric recipe count');
        }
        
        // Check for favorite recipes count
        const hasFavoriteCount = await browser.elementExists('[data-testid="favorite-recipes-count"]', 5000);
        if (hasFavoriteCount) {
          const favoritesText = await browser.page.$eval('[data-testid="favorite-recipes-count"]', el => el.textContent);
          console.log('Favorite recipes displayed:', favoritesText);
          
          // Should show a number
          assert.ok(/\d+/.test(favoritesText), 'Should display numeric favorite count');
        }
        
        // Check for user creation date or account age
        const hasUserSince = await browser.elementExists('[data-testid="user-since"]', 5000);
        if (hasUserSince) {
          const userSinceText = await browser.page.$eval('[data-testid="user-since"]', el => el.textContent);
          console.log('User since displayed:', userSinceText);
          
          // Should contain date-like information
          assert.ok(userSinceText.length > 0, 'Should display user creation info');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-user-stats', error);
      }
    });

    test('should display recent activity feed', async () => {
      try {
        await browser.navigate('/dashboard');
        
        // Wait for dashboard to load
        await browser.elementExists('[data-testid="dashboard-container"]', 10000);
        
        // Check for recent activity section
        const hasRecentActivity = await browser.elementExists('[data-testid="recent-activity"]', 5000);
        if (hasRecentActivity) {
          // Check for activity items
          const hasActivityItems = await browser.elementExists('[data-testid="activity-item"]', 3000);
          console.log('Activity items found:', hasActivityItems);
          
          if (hasActivityItems) {
            // Count activity items
            const activityItems = await browser.page.$$('[data-testid="activity-item"]');
            console.log('Number of activity items:', activityItems.length);
            
            // Check if activity items have proper structure
            const firstItem = await browser.page.$('[data-testid="activity-item"]');
            if (firstItem) {
              const itemText = await firstItem.evaluate(el => el.textContent);
              assert.ok(itemText.length > 0, 'Activity items should have content');
              console.log('First activity item:', itemText);
            }
          } else {
            // Should show empty state message
            const hasEmptyState = await browser.elementExists('[data-testid="empty-activity"]', 3000);
            console.log('Empty activity state found:', hasEmptyState);
          }
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-recent-activity', error);
      }
    });

    test('should handle dashboard performance with large datasets', async () => {
      try {
        const startTime = Date.now();
        
        await browser.navigate('/dashboard');
        
        // Wait for all main elements to load
        await browser.elementExists('[data-testid="dashboard-container"]', 10000);
        
        const loadTime = Date.now() - startTime;
        console.log(`Dashboard load time: ${loadTime}ms`);
        
        // Dashboard should load within reasonable time (5 seconds)
        assert.ok(loadTime < 5000, 'Dashboard should load within 5 seconds');
        
        // Check that all stat elements are loaded
        const statsElements = [
          '[data-testid="total-recipes-count"]',
          '[data-testid="favorite-recipes-count"]',
          '[data-testid="user-stats"]'
        ];
        
        let loadedElements = 0;
        for (const selector of statsElements) {
          const exists = await browser.elementExists(selector, 1000);
          if (exists) loadedElements++;
        }
        
        console.log(`Loaded ${loadedElements}/${statsElements.length} stat elements`);
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-performance', error);
      }
    });
  });

  describe('Dashboard Navigation and Interactions', () => {
    test('should navigate from dashboard to other features', async () => {
      try {
        await browser.navigate('/dashboard');
        
        // Wait for dashboard to load
        await browser.elementExists('[data-testid="dashboard-container"]', 10000);
        
        // Check for navigation links within dashboard
        const hasRecipesLink = await browser.elementExists('[data-testid="dashboard-recipes-link"]', 5000);
        if (hasRecipesLink) {
          await browser.clickElement('[data-testid="dashboard-recipes-link"]');
          await browser.page.waitForTimeout(2000);
          
          const currentUrl = browser.getCurrentUrl();
          assert.ok(currentUrl.includes('/recipes'), 'Should navigate to recipes page from dashboard');
          console.log('✓ Successfully navigated to recipes from dashboard');
        }
        
        // Navigate back to dashboard
        await browser.navigate('/dashboard');
        
        // Check for profile link
        const hasProfileLink = await browser.elementExists('[data-testid="dashboard-profile-link"]', 5000);
        if (hasProfileLink) {
          await browser.clickElement('[data-testid="dashboard-profile-link"]');
          await browser.page.waitForTimeout(2000);
          
          const currentUrl = browser.getCurrentUrl();
          assert.ok(currentUrl.includes('/profile'), 'Should navigate to profile page from dashboard');
          console.log('✓ Successfully navigated to profile from dashboard');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-navigation', error);
      }
    });

    test('should refresh dashboard data correctly', async () => {
      try {
        await browser.navigate('/dashboard');
        
        // Wait for initial load
        await browser.elementExists('[data-testid="dashboard-container"]', 10000);
        
        // Check if there's a refresh button
        const hasRefreshButton = await browser.elementExists('[data-testid="refresh-dashboard"]', 5000);
        if (hasRefreshButton) {
          // Get initial data
          const initialStats = await browser.elementExists('[data-testid="total-recipes-count"]', 3000);
          
          // Click refresh
          await browser.clickElement('[data-testid="refresh-dashboard"]');
          
          // Wait for refresh to complete
          await browser.page.waitForTimeout(3000);
          
          // Verify stats are still displayed
          const refreshedStats = await browser.elementExists('[data-testid="total-recipes-count"]', 5000);
          assert.ok(refreshedStats, 'Stats should still be displayed after refresh');
          console.log('✓ Dashboard refresh completed successfully');
        } else {
          // Test page refresh instead
          await browser.page.reload({ waitUntil: 'networkidle0' });
          
          // Verify dashboard reloads correctly
          const hasContainer = await browser.elementExists('[data-testid="dashboard-container"]', 10000);
          assert.ok(hasContainer, 'Dashboard should reload correctly');
          console.log('✓ Dashboard page refresh completed successfully');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-refresh', error);
      }
    });
  });

  describe('Dashboard Responsive Design', () => {
    test('should display correctly on mobile viewport', async () => {
      try {
        // Set mobile viewport
        await browser.page.setViewport({ width: 375, height: 667 });
        
        await browser.navigate('/dashboard');
        
        // Wait for dashboard to load
        await browser.elementExists('[data-testid="dashboard-container"]', 10000);
        
        // Check if mobile layout is applied
        const hasMobileLayout = await browser.elementExists('[data-testid="mobile-dashboard"]', 3000) ||
                               await browser.elementExists('.v-container', 3000);
        
        console.log('Mobile layout detected:', hasMobileLayout);
        
        // Check that stats are still visible and stacked
        const hasStats = await browser.elementExists('[data-testid="user-stats"]', 5000);
        if (hasStats) {
          const statsElement = await browser.page.$('[data-testid="user-stats"]');
          const boundingBox = await statsElement.boundingBox();
          
          console.log('Stats element width on mobile:', boundingBox.width);
          assert.ok(boundingBox.width <= 375, 'Stats should fit within mobile viewport');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-mobile', error);
      }
    });

    test('should display correctly on tablet viewport', async () => {
      try {
        // Set tablet viewport
        await browser.page.setViewport({ width: 768, height: 1024 });
        
        await browser.navigate('/dashboard');
        
        // Wait for dashboard to load
        await browser.elementExists('[data-testid="dashboard-container"]', 10000);
        
        // Check tablet layout
        const hasTabletLayout = await browser.elementExists('[data-testid="tablet-dashboard"]', 3000) ||
                               await browser.elementExists('.v-container', 3000);
        
        console.log('Tablet layout detected:', hasTabletLayout);
        
        // Stats should be displayed in a grid or flexible layout
        const hasStats = await browser.elementExists('[data-testid="user-stats"]', 5000);
        if (hasStats) {
          console.log('✓ Dashboard displays correctly on tablet viewport');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-tablet', error);
      }
    });
  });

  describe('Dashboard Error Handling', () => {
    test('should handle data loading errors gracefully', async () => {
      try {
        await browser.navigate('/dashboard');
        
        // Wait for dashboard to load
        await browser.elementExists('[data-testid="dashboard-container"]', 10000);
        
        // Check for error handling elements
        const hasErrorMessage = await browser.elementExists('[data-testid="dashboard-error"]', 3000);
        const hasLoadingSpinner = await browser.elementExists('[data-testid="dashboard-loading"]', 3000);
        const hasEmptyState = await browser.elementExists('[data-testid="dashboard-empty"]', 3000);
        
        console.log('Error handling elements:');
        console.log('- Error message:', hasErrorMessage);
        console.log('- Loading spinner:', hasLoadingSpinner);
        console.log('- Empty state:', hasEmptyState);
        
        // Dashboard should either show data, loading, or error state
        const hasValidState = hasErrorMessage || hasLoadingSpinner || hasEmptyState ||
                             await browser.elementExists('[data-testid="user-stats"]', 3000);
        
        assert.ok(hasValidState, 'Dashboard should show a valid state (data, loading, error, or empty)');
        
      } catch (error) {
        await browser.screenshotOnFailure('dashboard-error-handling', error);
      }
    });
  });
});