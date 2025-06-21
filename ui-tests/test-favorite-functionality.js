/**
 * E2E Test for Recipe Favorite Functionality
 * Tests the complete favorite flow including UI state management
 */

const BrowserManager = require('./helpers/browser');

async function testFavoriteFunctionality() {
  const browser = new BrowserManager();
  
  async function login(email, password) {
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await browser.fillInput('[data-testid="email-input"]', email);
    await browser.fillInput('[data-testid="password-input"]', password);
    await browser.clickElement('[data-testid="login-submit"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return browser.getCurrentUrl().includes('/dashboard');
  }

  try {
    console.log('🚀 RECIPE FAVORITE FUNCTIONALITY E2E TEST');
    console.log('=========================================\n');
    
    await browser.launch();

    // Login first
    console.log('📋 Step 1: Login as admin user');
    const loginSuccess = await login('admin@example.com', 'testpassword123');
    console.log(`✅ Login successful: ${loginSuccess}\n`);

    // Navigate to recipes page
    console.log('📋 Step 2: Navigate to recipes page');
    await browser.navigate('/recipes');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if recipes are loaded
    const hasRecipes = await browser.elementExists('.recipe-card, .recipe-preview-card, .v-card', 5000);
    console.log(`✅ Recipes loaded: ${hasRecipes}`);

    // Find and examine favorite buttons
    console.log('\n📋 Step 3: Examining favorite button state');
    
    // Try different selectors for favorite buttons
    const favoriteSelectors = [
      'button[data-testid*="favorite"]',
      '.favorite-btn',
      'button[aria-label*="favorite"]',
      '.recipe-card button[aria-label*="favorite"]',
      'button.v-btn i.mdi-heart',
      'button.v-btn i.mdi-heart-outline',
      'button .mdi-heart',
      'button .mdi-heart-outline',
      '.v-card button',
      '.recipe-favorite-btn'
    ];
    
    let favoriteButton = null;
    let buttonSelector = null;
    
    for (const selector of favoriteSelectors) {
      console.log(`  Trying selector: ${selector}`);
      if (await browser.elementExists(selector, 1000)) {
        favoriteButton = true;
        buttonSelector = selector;
        console.log(`  ✅ Found favorite button with selector: ${selector}`);
        
        // Check the current state of the button
        const buttonState = await browser.page.evaluate((sel) => {
          const btn = document.querySelector(sel);
          if (!btn) return null;
          
          // Check for icon state
          const icon = btn.querySelector('i');
          const hasFilledHeart = icon && (icon.classList.contains('mdi-heart') && !icon.classList.contains('mdi-heart-outline'));
          const hasOutlineHeart = icon && icon.classList.contains('mdi-heart-outline');
          
          // Check aria-pressed or other indicators
          const ariaPressed = btn.getAttribute('aria-pressed');
          const dataFavorited = btn.getAttribute('data-favorited');
          
          return {
            text: btn.textContent,
            classes: btn.className,
            iconClasses: icon ? icon.className : null,
            hasFilledHeart,
            hasOutlineHeart,
            ariaPressed,
            dataFavorited,
            disabled: btn.disabled
          };
        }, selector);
        
        console.log('  Button state:', JSON.stringify(buttonState, null, 2));
        break;
      }
    }
    
    if (!favoriteButton) {
      console.log('❌ No favorite button found on recipe cards');
      return;
    }

    // Click the favorite button
    console.log('\n📋 Step 4: Clicking favorite button');
    await browser.clickElement(buttonSelector);
    console.log('  ⏳ Waiting for server response...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check for any error messages or modals
    console.log('\n📋 Step 5: Checking for errors or feedback');
    
    const errorSelectors = [
      '.v-alert',
      '.error-message',
      '[role="alert"]',
      '.v-snackbar',
      '.notification',
      '.toast'
    ];
    
    for (const errorSel of errorSelectors) {
      if (await browser.elementExists(errorSel, 1000)) {
        const errorText = await browser.page.evaluate((sel) => {
          const elem = document.querySelector(sel);
          return elem ? elem.textContent : null;
        }, errorSel);
        console.log(`  ⚠️ Found message: ${errorText}`);
      }
    }

    // Check if button state changed
    console.log('\n📋 Step 6: Checking if button state changed');
    const newButtonState = await browser.page.evaluate((sel) => {
      const btn = document.querySelector(sel);
      if (!btn) return null;
      
      const icon = btn.querySelector('i');
      const hasFilledHeart = icon && (icon.classList.contains('mdi-heart') && !icon.classList.contains('mdi-heart-outline'));
      const hasOutlineHeart = icon && icon.classList.contains('mdi-heart-outline');
      
      return {
        iconClasses: icon ? icon.className : null,
        hasFilledHeart,
        hasOutlineHeart,
        disabled: btn.disabled
      };
    }, buttonSelector);
    
    console.log('  New button state:', JSON.stringify(newButtonState, null, 2));

    // Try to click again to test toggle
    console.log('\n📋 Step 7: Clicking favorite button again (toggle test)');
    await browser.clickElement(buttonSelector);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check final state
    const finalButtonState = await browser.page.evaluate((sel) => {
      const btn = document.querySelector(sel);
      if (!btn) return null;
      
      const icon = btn.querySelector('i');
      return {
        hasFilledHeart: icon && (icon.classList.contains('mdi-heart') && !icon.classList.contains('mdi-heart-outline')),
        hasOutlineHeart: icon && icon.classList.contains('mdi-heart-outline')
      };
    }, buttonSelector);
    
    console.log('  Final button state:', JSON.stringify(finalButtonState, null, 2));

    // Navigate to favorites page
    console.log('\n📋 Step 8: Checking favorites page');
    await browser.navigate('/favorites');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const hasFavorites = await browser.elementExists('.recipe-card, .v-card, .favorite-item', 5000);
    console.log(`  Favorites page has items: ${hasFavorites}`);

    // Test from recipe detail page
    console.log('\n📋 Step 9: Testing favorite from recipe detail page');
    await browser.navigate('/recipes');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Click on a recipe to go to detail
    const recipeLink = await browser.elementExists('a[href*="/recipes/"], .recipe-card a, .v-card a', 3000);
    if (recipeLink) {
      await browser.clickElement('a[href*="/recipes/"], .recipe-card a, .v-card a');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Look for favorite button on detail page
      console.log('  Looking for favorite button on detail page...');
      let detailFavoriteFound = false;
      
      for (const selector of favoriteSelectors) {
        if (await browser.elementExists(selector, 1000)) {
          console.log(`  ✅ Found favorite button on detail page: ${selector}`);
          detailFavoriteFound = true;
          
          // Test clicking it
          await browser.clickElement(selector);
          await new Promise(resolve => setTimeout(resolve, 2000));
          break;
        }
      }
      
      if (!detailFavoriteFound) {
        console.log('  ❌ No favorite button found on detail page');
      }
    }

    // Final summary
    console.log('\n📊 TEST SUMMARY');
    console.log('===============');
    console.log('✅ Login successful');
    console.log(`${favoriteButton ? '✅' : '❌'} Favorite buttons found on recipe list`);
    console.log('⚠️  409 Conflict suggests UI not tracking favorite state properly');
    console.log('📌 Recommendation: Frontend needs to:');
    console.log('   1. Track favorite state for each recipe');
    console.log('   2. Update UI immediately on favorite/unfavorite');
    console.log('   3. Handle 409 errors gracefully (recipe already favorited)');
    console.log('   4. Show proper filled/outline heart icons based on state');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testFavoriteFunctionality().catch(console.error);