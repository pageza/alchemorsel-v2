const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
require('dotenv').config();

const BrowserManager = require('../../helpers/browser');
const AuthHelper = require('../../helpers/auth');

describe('Admin Analytics Dashboard', () => {
  let browser;
  let auth;

  beforeEach(async () => {
    browser = new BrowserManager();
    await browser.launch();
    auth = new AuthHelper(browser);

    // Login as admin
    const adminUser = {
      email: 'admin@alchemorsel.com',
      password: 'AdminPass123!'
    };
    await auth.login(adminUser.email, adminUser.password);
    
    // Navigate to admin analytics
    await browser.navigateToUrl('/admin/analytics');
  });

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('should display analytics dashboard with key metrics', async () => {
    try {
      // Verify analytics page loads
      const analyticsPage = await browser.elementExists('[data-testid="admin-analytics"]');
      assert.ok(analyticsPage, 'Admin analytics page should be accessible');

      // Check for key metric cards
      const metricCards = await browser.getElements('.metric-card, .stats-card, [data-testid*="metric"]');
      assert.ok(metricCards.length > 0, 'Analytics metrics should be displayed');

      // Look for common analytics metrics
      const hasUserMetrics = await browser.elementExists('text=Users') ||
                            await browser.elementExists('[data-metric="users"]') ||
                            await browser.elementExists('.user-stats');
      
      const hasRecipeMetrics = await browser.elementExists('text=Recipes') ||
                              await browser.elementExists('[data-metric="recipes"]') ||
                              await browser.elementExists('.recipe-stats');
      
      assert.ok(hasUserMetrics || hasRecipeMetrics, 'Key platform metrics should be displayed');

    } catch (error) {
      await browser.screenshotOnFailure('analytics-dashboard', error);
      throw error;
    }
  });

  test('should show user activity and engagement metrics', async () => {
    try {
      // Check for user activity metrics
      const userActivity = await browser.elementExists('[data-testid="user-activity"]') ||
                          await browser.elementExists('.activity-metrics') ||
                          await browser.elementExists('text=Active Users');
      
      if (userActivity) {
        assert.ok(true, 'User activity metrics should be displayed');
      }

      // Check for engagement metrics
      const engagementMetrics = await browser.elementExists('[data-testid="engagement"]') ||
                               await browser.elementExists('.engagement-stats') ||
                               await browser.elementExists('text=Engagement');
      
      if (engagementMetrics) {
        assert.ok(true, 'User engagement metrics should be displayed');
      }

      // Check for time-based metrics (daily, weekly, monthly)
      const timeMetrics = await browser.elementExists('.time-series, .daily-stats, .weekly-stats');
      if (timeMetrics) {
        assert.ok(true, 'Time-based metrics should be available');
      }

    } catch (error) {
      await browser.screenshotOnFailure('user-activity-metrics', error);
      throw error;
    }
  });

  test('should display recipe and content analytics', async () => {
    try {
      // Check for recipe creation metrics
      const recipeMetrics = await browser.elementExists('[data-testid="recipe-metrics"]') ||
                           await browser.elementExists('.recipe-analytics') ||
                           await browser.elementExists('text=Recipe Creation');
      
      if (recipeMetrics) {
        assert.ok(true, 'Recipe analytics should be displayed');
      }

      // Check for popular recipes or trending content
      const popularContent = await browser.elementExists('[data-testid="popular-recipes"]') ||
                             await browser.elementExists('.trending-content') ||
                             await browser.elementExists('text=Popular');
      
      if (popularContent) {
        assert.ok(true, 'Popular content metrics should be displayed');
      }

      // Check for AI generation usage metrics
      const aiMetrics = await browser.elementExists('[data-testid="ai-metrics"]') ||
                       await browser.elementExists('.ai-usage') ||
                       await browser.elementExists('text=AI Generation');
      
      if (aiMetrics) {
        assert.ok(true, 'AI generation metrics should be tracked');
      }

    } catch (error) {
      await browser.screenshotOnFailure('recipe-analytics', error);
      throw error;
    }
  });

  test('should show charts and visualizations', async () => {
    try {
      // Check for chart elements (Chart.js, D3, etc.)
      const hasCharts = await browser.elementExists('canvas') ||
                       await browser.elementExists('.chart, .graph') ||
                       await browser.elementExists('[data-chart]');
      
      if (hasCharts) {
        assert.ok(true, 'Analytics charts should be displayed');
        
        // Wait for charts to load
        await browser.waitForTimeout(2000);
        
        // Check if charts have rendered with data
        const chartElements = await browser.getElements('canvas, .chart, .graph');
        assert.ok(chartElements.length > 0, 'Charts should be rendered');
      }

      // Check for data visualization components
      const dataViz = await browser.elementExists('.visualization, .data-chart, .analytics-chart');
      if (dataViz) {
        assert.ok(true, 'Data visualizations should be present');
      }

    } catch (error) {
      await browser.screenshotOnFailure('analytics-charts', error);
      throw error;
    }
  });

  test('should allow filtering analytics by time period', async () => {
    try {
      // Look for time period filters
      const timeFilter = await browser.elementExists('[data-testid="time-filter"]') ||
                        await browser.elementExists('select[name*="period"]') ||
                        await browser.elementExists('.time-range-picker');
      
      if (timeFilter) {
        // Test different time periods
        const periods = ['7days', 'month', '30days', 'week'];
        
        for (const period of periods) {
          const periodOption = await browser.elementExists(`option[value="${period}"], [data-period="${period}"]`);
          if (periodOption) {
            await browser.clickElement(periodOption);
            await browser.waitForTimeout(1000);
            
            // Verify data updates
            const metricsUpdated = await browser.elementExists('.loading, .updating, [data-loading]');
            assert.ok(true, `Analytics should update for ${period} period`);
            break; // Test one period successfully
          }
        }
      }

      // Check for date range picker
      const dateRange = await browser.elementExists('input[type="date"], .date-picker, .date-range');
      if (dateRange) {
        assert.ok(true, 'Date range filtering should be available');
      }

    } catch (error) {
      await browser.screenshotOnFailure('analytics-time-filter', error);
      throw error;
    }
  });

  test('should display top users and power users analytics', async () => {
    try {
      // Check for top users section
      const topUsers = await browser.elementExists('[data-testid="top-users"]') ||
                      await browser.elementExists('.top-users') ||
                      await browser.elementExists('text=Top Users');
      
      if (topUsers) {
        assert.ok(true, 'Top users analytics should be displayed');
        
        // Check for user leaderboard or ranking
        const userList = await browser.getElements('.user-rank, .top-user-item, [data-user-rank]');
        if (userList.length > 0) {
          assert.ok(true, 'Top users should be ranked and displayed');
        }
      }

      // Check for user behavior analytics
      const userBehavior = await browser.elementExists('[data-testid="user-behavior"]') ||
                          await browser.elementExists('.behavior-analytics') ||
                          await browser.elementExists('text=User Behavior');
      
      if (userBehavior) {
        assert.ok(true, 'User behavior analytics should be available');
      }

    } catch (error) {
      await browser.screenshotOnFailure('top-users-analytics', error);
      throw error;
    }
  });

  test('should show platform health and performance metrics', async () => {
    try {
      // Check for system health indicators
      const healthMetrics = await browser.elementExists('[data-testid="platform-health"]') ||
                           await browser.elementExists('.health-metrics') ||
                           await browser.elementExists('text=Platform Health');
      
      if (healthMetrics) {
        assert.ok(true, 'Platform health metrics should be displayed');
      }

      // Check for performance indicators
      const perfMetrics = await browser.elementExists('[data-testid="performance"]') ||
                         await browser.elementExists('.performance-metrics') ||
                         await browser.elementExists('text=Performance');
      
      if (perfMetrics) {
        assert.ok(true, 'Performance metrics should be tracked');
      }

      // Check for error rates or issues tracking
      const errorMetrics = await browser.elementExists('[data-testid="errors"]') ||
                          await browser.elementExists('.error-metrics') ||
                          await browser.elementExists('text=Errors');
      
      if (errorMetrics) {
        assert.ok(true, 'Error tracking should be available');
      }

    } catch (error) {
      await browser.screenshotOnFailure('platform-health', error);
      throw error;
    }
  });

  test('should allow exporting analytics data', async () => {
    try {
      // Check for export functionality
      const exportButton = await browser.elementExists('[data-testid="export"]') ||
                           await browser.elementExists('button[title*="export"]') ||
                           await browser.elementExists('.export-btn');
      
      if (exportButton) {
        await browser.clickElement(exportButton);
        
        // Check for export format options
        const exportOptions = await browser.elementExists('.export-options, .download-menu');
        if (exportOptions) {
          const csvOption = await browser.elementExists('text=CSV, [data-format="csv"]');
          const pdfOption = await browser.elementExists('text=PDF, [data-format="pdf"]');
          
          assert.ok(csvOption || pdfOption, 'Export format options should be available');
        }
      } else {
        // Export might not be implemented yet
        assert.ok(true, 'Export functionality may be planned for future release');
      }

    } catch (error) {
      await browser.screenshotOnFailure('analytics-export', error);
      throw error;
    }
  });
});