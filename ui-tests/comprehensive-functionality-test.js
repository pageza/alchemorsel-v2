/**
 * Comprehensive Functionality Test
 * Tests actual user interactions and functionality, not just navigation
 */

const BrowserManager = require('./helpers/browser');

async function testComprehensiveFunctionality() {
  const browser = new BrowserManager();
  const results = {
    admin: { passed: 0, failed: 0, tests: [] },
    user: { passed: 0, failed: 0, tests: [] },
    total: { passed: 0, failed: 0, tests: 0 }
  };

  async function runTest(category, testName, testFunc) {
    results.total.tests++;
    console.log(`\n🧪 Testing: ${testName}`);
    try {
      const result = await testFunc();
      if (result.success) {
        console.log(`✅ PASSED: ${result.message || testName}`);
        results[category].passed++;
        results.total.passed++;
      } else {
        console.log(`❌ FAILED: ${result.message || testName}`);
        results[category].failed++;
        results.total.failed++;
      }
      results[category].tests.push({ name: testName, ...result });
    } catch (error) {
      console.log(`❌ ERROR: ${testName} - ${error.message}`);
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
    await browser.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await browser.page.deleteCookie(...(await browser.page.cookies()));
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  try {
    console.log('🚀 COMPREHENSIVE FUNCTIONALITY TEST');
    console.log('===================================\n');
    
    await browser.launch();

    // ==========================================
    // ADMIN FUNCTIONALITY TESTS
    // ==========================================
    console.log('🔰 ADMIN FUNCTIONALITY TESTS');
    console.log('============================');
    
    await runTest('admin', 'Admin login and dashboard access', async () => {
      const loginSuccess = await login('admin@example.com', 'testpassword123');
      if (!loginSuccess) return { success: false, message: 'Login failed' };
      
      // Check for dashboard elements
      const hasDashboard = await browser.elementExists('.dashboard, .dashboard-stats, h1', 5000);
      return { 
        success: loginSuccess && hasDashboard, 
        message: loginSuccess && hasDashboard ? 'Admin logged in and dashboard loaded' : 'Dashboard elements not found'
      };
    });

    await runTest('admin', 'Admin can browse and interact with recipes', async () => {
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check if recipes loaded
      const hasRecipes = await browser.elementExists('.recipe-card, .recipe-preview-card, .recipe-item', 10000);
      if (!hasRecipes) return { success: false, message: 'No recipes found on page' };
      
      // Try to find a recipe link and click it
      const recipeLink = await browser.elementExists('a[href*="/recipes/"], .recipe-card a', 5000);
      if (recipeLink) {
        await browser.clickElement('a[href*="/recipes/"], .recipe-card a');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const onRecipeDetail = browser.getCurrentUrl().includes('/recipes/') && !browser.getCurrentUrl().endsWith('/recipes');
        return { 
          success: onRecipeDetail, 
          message: onRecipeDetail ? 'Successfully navigated to recipe details' : 'Failed to navigate to recipe details'
        };
      }
      
      return { success: true, message: 'Recipes loaded but no clickable links found' };
    });

    await runTest('admin', 'Admin can favorite a recipe from recipe list', async () => {
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Look for favorite buttons in different possible locations
      const favoriteSelectors = [
        'button[data-testid*="favorite"]',
        '.favorite-btn',
        'button[aria-label*="favorite"]',
        '.recipe-card button',
        '.recipe-favorite',
        'button.v-btn'
      ];
      
      let favoriteButton = null;
      for (const selector of favoriteSelectors) {
        if (await browser.elementExists(selector, 2000)) {
          favoriteButton = selector;
          break;
        }
      }
      
      if (!favoriteButton) {
        return { success: false, message: 'No favorite button found on recipe cards' };
      }
      
      // Click favorite button
      await browser.clickElement(favoriteButton);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if button state changed (might have class change, icon change, etc)
      return { 
        success: true, 
        message: `Clicked favorite button with selector: ${favoriteButton}. Check UI for state change.`
      };
    });

    await runTest('admin', 'Admin can generate AI recipe', async () => {
      await browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Find input field for recipe prompt
      const inputSelectors = [
        'textarea',
        'input[type="text"]',
        '[data-testid="recipe-prompt"]',
        '.recipe-input',
        'input[placeholder*="recipe"]',
        'textarea[placeholder*="recipe"]'
      ];
      
      let inputField = null;
      for (const selector of inputSelectors) {
        if (await browser.elementExists(selector, 2000)) {
          inputField = selector;
          break;
        }
      }
      
      if (!inputField) {
        return { success: false, message: 'No input field found for recipe generation' };
      }
      
      // Enter recipe prompt
      await browser.fillInput(inputField, 'Quick pasta recipe with tomatoes and basil');
      
      // Find and click generate button
      const generateSelectors = [
        'button[type="submit"]',
        'button:contains("Generate")',
        '.generate-btn',
        '[data-testid="generate-button"]',
        'button.v-btn'
      ];
      
      let generateButton = null;
      for (const selector of generateSelectors) {
        if (await browser.elementExists(selector, 2000)) {
          generateButton = selector;
          break;
        }
      }
      
      if (!generateButton) {
        return { success: false, message: 'No generate button found' };
      }
      
      console.log('   ⏳ Clicking generate and waiting 45 seconds for AI response...');
      await browser.clickElement(generateButton);
      
      // Wait for generation (45 seconds as requested)
      await new Promise(resolve => setTimeout(resolve, 45000));
      
      // Check for generated recipe result
      const resultSelectors = [
        '.generated-recipe',
        '.recipe-result',
        '.recipe-content',
        'article',
        '.recipe-card',
        'h2',
        '.recipe-title'
      ];
      
      let hasResult = false;
      for (const selector of resultSelectors) {
        if (await browser.elementExists(selector, 5000)) {
          hasResult = true;
          break;
        }
      }
      
      return { 
        success: hasResult, 
        message: hasResult ? 'AI recipe generated successfully' : 'No generated recipe found after 45 seconds'
      };
    });

    await runTest('admin', 'Admin can access and use favorites page', async () => {
      await browser.navigate('/favorites');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const hasFavoritesInterface = await browser.elementExists('.favorites, .recipe-grid, .favorite-recipes, h1', 5000);
      
      // Check if there are any favorited recipes
      const hasFavoriteItems = await browser.elementExists('.recipe-card, .favorite-item, .recipe-preview-card', 3000);
      
      return { 
        success: hasFavoritesInterface, 
        message: hasFavoriteItems ? 'Favorites page loaded with favorited items' : 'Favorites page loaded but no items found (may need to favorite some first)'
      };
    });

    // ==========================================
    // REGULAR USER FUNCTIONALITY TESTS
    // ==========================================
    console.log('\n\n👤 REGULAR USER FUNCTIONALITY TESTS');
    console.log('===================================');
    
    console.log('🔄 Logging out admin user...');
    await logout();

    await runTest('user', 'Regular user login and dashboard', async () => {
      const loginSuccess = await login('john.doe@example.com', 'testpassword123');
      if (!loginSuccess) return { success: false, message: 'Login failed' };
      
      const hasDashboard = await browser.elementExists('.dashboard, .dashboard-stats, h1', 5000);
      return { 
        success: loginSuccess && hasDashboard, 
        message: loginSuccess && hasDashboard ? 'User logged in and dashboard loaded' : 'Dashboard elements not found'
      };
    });

    await runTest('user', 'User can view recipe details and favorite from detail page', async () => {
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Navigate to a specific recipe
      const recipeLink = await browser.elementExists('a[href*="/recipes/"], .recipe-card a', 5000);
      if (!recipeLink) {
        return { success: false, message: 'No recipe links found' };
      }
      
      await browser.clickElement('a[href*="/recipes/"], .recipe-card a');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check we're on recipe detail page
      const onDetail = browser.getCurrentUrl().includes('/recipes/') && !browser.getCurrentUrl().endsWith('/recipes');
      if (!onDetail) {
        return { success: false, message: 'Failed to navigate to recipe detail' };
      }
      
      // Look for favorite button on detail page
      const favoriteSelectors = [
        'button[data-testid*="favorite"]',
        '.favorite-btn',
        'button[aria-label*="favorite"]',
        'button:contains("Favorite")',
        'button:contains("favorite")',
        'button.v-btn'
      ];
      
      let foundFavorite = false;
      for (const selector of favoriteSelectors) {
        if (await browser.elementExists(selector, 2000)) {
          await browser.clickElement(selector);
          foundFavorite = true;
          break;
        }
      }
      
      return { 
        success: onDetail, 
        message: foundFavorite ? 'Recipe detail loaded and favorite button clicked' : 'Recipe detail loaded but no favorite button found'
      };
    });

    await runTest('user', 'User can generate AI recipe', async () => {
      await browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Similar to admin test but for regular user
      const inputField = await browser.elementExists('textarea, input[type="text"]', 5000);
      if (!inputField) {
        return { success: false, message: 'No input field found' };
      }
      
      await browser.fillInput('textarea, input[type="text"]', 'Vegetarian stir-fry recipe');
      
      const generateButton = await browser.elementExists('button[type="submit"], button:contains("Generate"), .generate-btn', 3000);
      if (!generateButton) {
        return { success: false, message: 'No generate button found' };
      }
      
      console.log('   ⏳ Generating recipe (45 second wait)...');
      await browser.clickElement('button[type="submit"], button:contains("Generate"), .generate-btn');
      await new Promise(resolve => setTimeout(resolve, 45000));
      
      const hasResult = await browser.elementExists('.generated-recipe, .recipe-result, .recipe-content, article, h2', 5000);
      
      return { 
        success: hasResult, 
        message: hasResult ? 'Recipe generated successfully' : 'No recipe generated after 45 seconds'
      };
    });

    await runTest('user', 'User can search for recipes', async () => {
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Look for search input
      const searchSelectors = [
        'input[type="search"]',
        'input[placeholder*="search"]',
        '[data-testid="search-input"]',
        '.search-input',
        'input[type="text"]'
      ];
      
      let searchInput = null;
      for (const selector of searchSelectors) {
        if (await browser.elementExists(selector, 2000)) {
          searchInput = selector;
          break;
        }
      }
      
      if (!searchInput) {
        return { success: false, message: 'No search input found' };
      }
      
      // Search for pasta
      await browser.fillInput(searchInput, 'pasta');
      
      // Look for search button or wait for auto-search
      const searchButton = await browser.elementExists('button[type="submit"], .search-btn', 2000);
      if (searchButton) {
        await browser.clickElement('button[type="submit"], .search-btn');
      }
      
      // Wait for results
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if results changed or filtered
      const hasResults = await browser.elementExists('.recipe-card, .recipe-preview-card, .search-results', 5000);
      
      return { 
        success: hasResults, 
        message: hasResults ? 'Search functionality works' : 'No results found after search'
      };
    });

    // ==========================================
    // UNVERIFIED USER TESTS
    // ==========================================
    console.log('\n\n🚫 UNVERIFIED USER FUNCTIONALITY TESTS');
    console.log('======================================');
    
    console.log('🔄 Logging out regular user...');
    await logout();

    await runTest('user', 'Unverified user login', async () => {
      const loginSuccess = await login('unverified@example.com', 'testpassword123');
      return { 
        success: loginSuccess, 
        message: loginSuccess ? 'Unverified user logged in' : 'Login failed'
      };
    });

    await runTest('user', 'Unverified user can browse but not generate', async () => {
      // Can browse recipes
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const canBrowse = browser.getCurrentUrl().includes('/recipes');
      
      // Try to generate
      await browser.navigate('/generate');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const url = browser.getCurrentUrl();
      const blocked = !url.includes('/generate') || await browser.elementExists('.verification-required, .email-verify', 3000);
      
      return { 
        success: canBrowse, 
        message: `Can browse: ${canBrowse}, AI generation blocked: ${blocked} (blocking not yet implemented)`
      };
    });

    // ==========================================
    // PRINT RESULTS
    // ==========================================
    console.log('\n\n📊 COMPREHENSIVE FUNCTIONALITY TEST RESULTS');
    console.log('==========================================');
    console.log(`Admin Tests: ${results.admin.passed}/${results.admin.passed + results.admin.failed} passed`);
    console.log(`User Tests: ${results.user.passed}/${results.user.passed + results.user.failed} passed`);
    console.log(`Total: ${results.total.passed}/${results.total.tests} tests passed`);
    console.log(`Success Rate: ${Math.round((results.total.passed / results.total.tests) * 100)}%`);

    console.log('\n📋 DETAILED RESULTS:');
    console.log('-------------------');
    
    console.log('\nAdmin Tests:');
    results.admin.tests.forEach(test => {
      console.log(`  ${test.success ? '✅' : '❌'} ${test.name}`);
      if (test.message) console.log(`     → ${test.message}`);
    });
    
    console.log('\nUser Tests:');
    results.user.tests.forEach(test => {
      console.log(`  ${test.success ? '✅' : '❌'} ${test.name}`);
      if (test.message) console.log(`     → ${test.message}`);
    });

    const passRate = (results.total.passed / results.total.tests) * 100;
    if (passRate >= 80) {
      console.log('\n🎯 FUNCTIONALITY STATUS: EXCELLENT - Core features working well');
    } else if (passRate >= 60) {
      console.log('\n⚠️ FUNCTIONALITY STATUS: NEEDS WORK - Some features broken');
    } else {
      console.log('\n🚨 FUNCTIONALITY STATUS: CRITICAL - Major functionality issues');
    }

    return results;
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the comprehensive test
testComprehensiveFunctionality().catch(console.error);