/**
 * Recipe Favoriting Functionality Test
 * Tests favoriting recipes from different locations
 */

const BrowserManager = require('./helpers/browser');

async function testFavoriting() {
  const browser = new BrowserManager();
  const results = [];

  async function login() {
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await browser.fillInput('[data-testid="email-input"]', 'john.doe@example.com');
    await browser.fillInput('[data-testid="password-input"]', 'testpassword123');
    await browser.clickElement('[data-testid="login-submit"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return browser.getCurrentUrl().includes('/dashboard');
  }

  async function testFavoriteLocation(location, testName, testFunc) {
    try {
      console.log(`\n📋 Testing: ${testName}`);
      const result = await testFunc();
      
      if (result.success) {
        console.log(`✅ ${testName}: ${result.message}`);
      } else {
        console.log(`❌ ${testName}: ${result.message}`);
      }
      
      results.push({ location, testName, ...result });
      return result;
    } catch (error) {
      console.log(`❌ ${testName}: Error - ${error.message}`);
      results.push({ location, testName, success: false, message: error.message });
      return { success: false, message: error.message };
    }
  }

  try {
    console.log('🍳 RECIPE FAVORITING FUNCTIONALITY TEST');
    console.log('=======================================\n');
    
    await browser.launch();
    
    // Login first
    console.log('🔐 Logging in as verified user...');
    const loginSuccess = await login();
    if (!loginSuccess) {
      console.log('❌ Login failed, cannot test favoriting');
      return;
    }
    console.log('✅ Login successful');

    // Test 1: Check favorites page structure
    await testFavoriteLocation('favorites-page', 'Favorites page accessibility', async () => {
      await browser.navigate('/favorites');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const url = browser.getCurrentUrl();
      const hasAccess = url.includes('/favorites');
      const hasInterface = await browser.elementExists('.favorites-container, .recipe-grid, h1, .favorites', 5000);
      
      if (hasAccess && hasInterface) {
        return { success: true, message: 'Favorites page accessible with proper interface' };
      } else {
        return { success: false, message: `Access: ${hasAccess}, Interface: ${hasInterface}` };
      }
    });

    // Test 2: Check recipe listing page for favorite buttons
    await testFavoriteLocation('recipe-list', 'Favorite buttons on recipe listing', async () => {
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Look for recipe cards first
      const hasRecipeCards = await browser.elementExists('.recipe-card, .recipe-preview-card, .recipe-item', 5000);
      if (!hasRecipeCards) {
        return { success: false, message: 'No recipe cards found on recipes page' };
      }
      
      // Look for favorite buttons on recipe cards
      const favoriteSelectors = [
        '[data-testid*="favorite"]',
        '.favorite-btn',
        'button[aria-label*="favorite"]',
        '.favorite-button',
        '[class*="favorite"]',
        'button[title*="favorite"]',
        '.heart-icon',
        '.fa-heart',
        '[data-favorite]'
      ];
      
      let foundFavoriteButton = false;
      let foundSelector = '';
      
      for (const selector of favoriteSelectors) {
        if (await browser.elementExists(selector, 2000)) {
          foundFavoriteButton = true;
          foundSelector = selector;
          break;
        }
      }
      
      if (foundFavoriteButton) {
        return { success: true, message: `Favorite button found using selector: ${foundSelector}` };
      } else {
        return { success: false, message: 'No favorite buttons found on recipe cards' };
      }
    });

    // Test 3: Check landing page for favorite buttons (if recipes shown)
    await testFavoriteLocation('landing-page', 'Favorite buttons on landing page', async () => {
      await browser.navigate('/');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Look for featured recipes section
      const hasFeaturedSection = await browser.elementExists('.featured-section, .featured-recipes, .recipe-preview-card', 5000);
      if (!hasFeaturedSection) {
        return { success: false, message: 'No featured recipes section found on landing page' };
      }
      
      // Look for favorite buttons in featured section
      const favoriteSelectors = [
        '[data-testid*="favorite"]',
        '.favorite-btn', 
        'button[aria-label*="favorite"]',
        '.favorite-button',
        '[class*="favorite"]'
      ];
      
      let foundFavoriteButton = false;
      let foundSelector = '';
      
      for (const selector of favoriteSelectors) {
        if (await browser.elementExists(selector, 2000)) {
          foundFavoriteButton = true;
          foundSelector = selector;
          break;
        }
      }
      
      if (foundFavoriteButton) {
        return { success: true, message: `Favorite button found using selector: ${foundSelector}` };
      } else {
        return { success: false, message: 'No favorite buttons found on featured recipes' };
      }
    });

    // Test 4: Test clicking a favorite button (if found)
    await testFavoriteLocation('favorite-action', 'Clicking favorite button functionality', async () => {
      // Go back to recipes page for testing
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const favoriteSelectors = [
        '[data-testid*="favorite"]',
        '.favorite-btn',
        'button[aria-label*="favorite"]',
        '.favorite-button'
      ];
      
      let favoriteButton = null;
      let usedSelector = '';
      
      for (const selector of favoriteSelectors) {
        if (await browser.elementExists(selector, 2000)) {
          favoriteButton = selector;
          usedSelector = selector;
          break;
        }
      }
      
      if (!favoriteButton) {
        return { success: false, message: 'No favorite button found to test clicking' };
      }
      
      try {
        // Click the favorite button
        await browser.clickElement(favoriteButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check for any visual feedback (state change, notification, etc.)
        const hasNotification = await browser.elementExists('.notification, .toast, .alert, .success-message', 3000);
        const hasStateChange = await browser.elementExists('[class*="favorited"], [class*="active"], [aria-pressed="true"]', 3000);
        
        if (hasNotification || hasStateChange) {
          return { success: true, message: `Favorite button clicked successfully. Notification: ${hasNotification}, State change: ${hasStateChange}` };
        } else {
          return { success: false, message: 'Favorite button clicked but no visual feedback detected' };
        }
        
      } catch (clickError) {
        return { success: false, message: `Failed to click favorite button: ${clickError.message}` };
      }
    });

    // Test 5: Check recipe details page for favorite button
    await testFavoriteLocation('recipe-details', 'Favorite button on recipe details page', async () => {
      await browser.navigate('/recipes');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Look for a recipe link to click
      const recipeLink = await browser.elementExists('a[href*="/recipes/"], .recipe-card a, .recipe-title a', 5000);
      
      if (!recipeLink) {
        return { success: false, message: 'No recipe links found to test recipe details page' };
      }
      
      try {
        // Click on a recipe to go to details
        await browser.clickElement('a[href*="/recipes/"], .recipe-card a, .recipe-title a');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const url = browser.getCurrentUrl();
        const onDetailsPage = url.includes('/recipes/') && url !== '/recipes';
        
        if (!onDetailsPage) {
          return { success: false, message: 'Did not navigate to recipe details page' };
        }
        
        // Look for favorite button on details page
        const favoriteSelectors = [
          '[data-testid*="favorite"]',
          '.favorite-btn',
          'button[aria-label*="favorite"]',
          '.favorite-button',
          '[class*="favorite"]'
        ];
        
        let foundFavoriteButton = false;
        let foundSelector = '';
        
        for (const selector of favoriteSelectors) {
          if (await browser.elementExists(selector, 3000)) {
            foundFavoriteButton = true;
            foundSelector = selector;
            break;
          }
        }
        
        if (foundFavoriteButton) {
          return { success: true, message: `Favorite button found on recipe details using: ${foundSelector}` };
        } else {
          return { success: false, message: 'No favorite button found on recipe details page' };
        }
        
      } catch (navError) {
        return { success: false, message: `Failed to navigate to recipe details: ${navError.message}` };
      }
    });

    // Print Summary
    console.log('\n📊 FAVORITING FUNCTIONALITY SUMMARY');
    console.log('===================================');
    
    const totalTests = results.length;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    console.log('\n📋 Detailed Results:');
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.location}: ${result.testName}`);
      console.log(`   ${result.message}`);
    });
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    const failedResults = results.filter(r => !r.success);
    if (failedResults.length === 0) {
      console.log('✅ All favoriting functionality is working properly!');
    } else {
      failedResults.forEach(failed => {
        console.log(`- Fix favoriting in ${failed.location}: ${failed.message}`);
      });
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Favoriting test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the favoriting test
testFavoriting().catch(console.error);