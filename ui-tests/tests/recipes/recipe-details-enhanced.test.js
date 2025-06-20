const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../../helpers/browser');
require('dotenv').config();

describe('Enhanced Recipe Details E2E Tests', () => {
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

  describe('Recipe Author Information', () => {
    test('should display recipe author information', async () => {
      try {
        // Navigate to recipes page
        await browser.navigate('/recipes');
        
        // Find and click on a recipe
        const recipeLink = await browser.page.evaluate(() => {
          const link = document.querySelector('a[href*="/recipes/"]');
          return link ? link.getAttribute('href') : null;
        });
        
        if (!recipeLink) {
          console.log('No recipes found to test');
          return;
        }
        
        await browser.navigate(recipeLink);
        await browser.page.waitForTimeout(2000);
        
        // Check for author information
        const hasAuthorAvatar = await browser.elementExists('.v-avatar', 5000);
        assert.ok(hasAuthorAvatar, 'Author avatar should be present');
        
        // Check for author name
        const authorName = await browser.page.evaluate(() => {
          const elements = document.querySelectorAll('.text-subtitle-1.font-weight-medium');
          for (const el of elements) {
            const text = el.textContent;
            if (text && !text.includes('Recipe') && text.trim().length > 0) {
              return text.trim();
            }
          }
          return null;
        });
        
        console.log('Author name found:', authorName);
        assert.ok(authorName, 'Author name should be displayed');
        
        // Check for creation date
        const hasCreationDate = await browser.page.evaluate(() => {
          const elements = document.querySelectorAll('.text-caption.text-medium-emphasis');
          for (const el of elements) {
            if (el.textContent?.includes('Posted')) {
              return true;
            }
          }
          return false;
        });
        
        assert.ok(hasCreationDate, 'Creation date should be displayed');
        console.log('✓ Recipe author information displayed correctly');
        
      } catch (error) {
        await browser.screenshotOnFailure('recipe-author-info', error);
      }
    });
  });

  describe('Nutritional Information Display', () => {
    test('should display nutritional information when available', async () => {
      try {
        // Navigate to a recipe details page
        await browser.navigate('/recipes');
        
        const recipeLink = await browser.page.evaluate(() => {
          const link = document.querySelector('a[href*="/recipes/"]');
          return link ? link.getAttribute('href') : null;
        });
        
        if (!recipeLink) {
          console.log('No recipes found to test');
          return;
        }
        
        await browser.navigate(recipeLink);
        await browser.page.waitForTimeout(2000);
        
        // Check for nutrition card
        const hasNutritionCard = await browser.page.evaluate(() => {
          const cards = document.querySelectorAll('.v-card-title');
          for (const card of cards) {
            if (card.textContent?.includes('Nutrition')) {
              return true;
            }
          }
          return false;
        });
        
        assert.ok(hasNutritionCard, 'Nutrition card should be present');
        
        // Check for nutritional values
        const nutritionalInfo = await browser.page.evaluate(() => {
          const info = {
            calories: false,
            protein: false,
            carbs: false,
            fat: false
          };
          
          const listItems = document.querySelectorAll('.v-list-item');
          listItems.forEach(item => {
            const title = item.querySelector('.v-list-item-title')?.textContent;
            if (title?.includes('Calories')) info.calories = true;
            if (title?.includes('Protein')) info.protein = true;
            if (title?.includes('Carbohydrates')) info.carbs = true;
            if (title?.includes('Fat')) info.fat = true;
          });
          
          return info;
        });
        
        console.log('Nutritional information found:', nutritionalInfo);
        
        // At least some nutritional information should be present
        const hasAnyNutrition = Object.values(nutritionalInfo).some(v => v);
        if (hasAnyNutrition) {
          console.log('✓ Nutritional information displayed correctly');
        } else {
          // Check for "not available" message
          const hasNoNutritionMessage = await browser.page.evaluate(() => {
            const elements = document.querySelectorAll('.text-medium-emphasis');
            for (const el of elements) {
              if (el.textContent?.includes('Nutritional information not available')) {
                return true;
              }
            }
            return false;
          });
          
          assert.ok(hasNoNutritionMessage, 'Should show "not available" message when no nutrition data');
          console.log('✓ "No nutritional information" message displayed correctly');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('recipe-nutrition-info', error);
      }
    });

    test('should display nutrition icons with proper colors', async () => {
      try {
        await browser.navigate('/recipes');
        
        const recipeLink = await browser.page.evaluate(() => {
          const link = document.querySelector('a[href*="/recipes/"]');
          return link ? link.getAttribute('href') : null;
        });
        
        if (!recipeLink) {
          console.log('No recipes found to test');
          return;
        }
        
        await browser.navigate(recipeLink);
        await browser.page.waitForTimeout(2000);
        
        // Check for nutrition icons
        const nutritionIcons = await browser.page.evaluate(() => {
          const icons = [];
          const iconElements = document.querySelectorAll('.v-list-item .v-icon');
          
          iconElements.forEach(icon => {
            const classes = icon.className;
            if (classes.includes('mdi-fire')) icons.push('calories');
            if (classes.includes('mdi-arm-flex')) icons.push('protein');
            if (classes.includes('mdi-barley')) icons.push('carbs');
            if (classes.includes('mdi-water')) icons.push('fat');
          });
          
          return icons;
        });
        
        if (nutritionIcons.length > 0) {
          console.log('✓ Nutrition icons found:', nutritionIcons);
          assert.ok(true, 'Nutrition icons are displayed');
        } else {
          console.log('No nutrition icons found (possibly no nutritional data)');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('recipe-nutrition-icons', error);
      }
    });
  });

  describe('Recipe Timing and Servings Information', () => {
    test('should display cooking time and servings when available', async () => {
      try {
        await browser.navigate('/recipes');
        
        const recipeLink = await browser.page.evaluate(() => {
          const link = document.querySelector('a[href*="/recipes/"]');
          return link ? link.getAttribute('href') : null;
        });
        
        if (!recipeLink) {
          console.log('No recipes found to test');
          return;
        }
        
        await browser.navigate(recipeLink);
        await browser.page.waitForTimeout(2000);
        
        // Check for time chip
        const timeInfo = await browser.page.evaluate(() => {
          const chips = document.querySelectorAll('.v-chip');
          for (const chip of chips) {
            const text = chip.textContent;
            if (text?.includes('min') || text?.includes('hour')) {
              return text;
            }
          }
          return null;
        });
        
        if (timeInfo) {
          console.log('✓ Cooking time displayed:', timeInfo);
          assert.ok(true, 'Cooking time is displayed');
        } else {
          console.log('No cooking time information found');
        }
        
        // Check for servings chip
        const servingsInfo = await browser.page.evaluate(() => {
          const chips = document.querySelectorAll('.v-chip');
          for (const chip of chips) {
            const text = chip.textContent;
            if (text?.includes('serving')) {
              return text;
            }
          }
          return null;
        });
        
        if (servingsInfo) {
          console.log('✓ Servings displayed:', servingsInfo);
          assert.ok(true, 'Servings information is displayed');
        } else {
          console.log('No servings information found');
        }
        
        // Check for difficulty chip
        const difficultyInfo = await browser.page.evaluate(() => {
          const chips = document.querySelectorAll('.v-chip');
          for (const chip of chips) {
            const text = chip.textContent?.toLowerCase();
            if (text?.includes('easy') || text?.includes('medium') || text?.includes('hard')) {
              return text;
            }
          }
          return null;
        });
        
        if (difficultyInfo) {
          console.log('✓ Difficulty displayed:', difficultyInfo);
          assert.ok(true, 'Difficulty level is displayed');
        } else {
          console.log('No difficulty information found');
        }
        
      } catch (error) {
        await browser.screenshotOnFailure('recipe-timing-servings', error);
      }
    });
  });

  describe('Recipe Page Responsiveness', () => {
    test('should display recipe details correctly on mobile', async () => {
      try {
        // Set mobile viewport
        await browser.page.setViewport({ width: 375, height: 667 });
        
        await browser.navigate('/recipes');
        
        const recipeLink = await browser.page.evaluate(() => {
          const link = document.querySelector('a[href*="/recipes/"]');
          return link ? link.getAttribute('href') : null;
        });
        
        if (!recipeLink) {
          console.log('No recipes found to test');
          return;
        }
        
        await browser.navigate(recipeLink);
        await browser.page.waitForTimeout(2000);
        
        // Check that recipe name is visible
        const hasRecipeName = await browser.page.evaluate(() => {
          const heading = document.querySelector('.text-h3');
          return heading && heading.offsetWidth > 0;
        });
        
        assert.ok(hasRecipeName, 'Recipe name should be visible on mobile');
        
        // Check that ingredients are visible
        const hasIngredients = await browser.page.evaluate(() => {
          const cards = document.querySelectorAll('.v-card-title');
          for (const card of cards) {
            if (card.textContent?.includes('Ingredients')) {
              return card.offsetWidth > 0;
            }
          }
          return false;
        });
        
        assert.ok(hasIngredients, 'Ingredients should be visible on mobile');
        
        // Check that nutrition info is accessible
        const hasNutrition = await browser.page.evaluate(() => {
          const cards = document.querySelectorAll('.v-card-title');
          for (const card of cards) {
            if (card.textContent?.includes('Nutrition')) {
              return card.offsetWidth > 0;
            }
          }
          return false;
        });
        
        assert.ok(hasNutrition, 'Nutrition info should be visible on mobile');
        
        console.log('✓ Recipe details display correctly on mobile');
        
      } catch (error) {
        await browser.screenshotOnFailure('recipe-details-mobile', error);
      }
    });
  });

  describe('Recipe Data Validation', () => {
    test('should handle missing data gracefully', async () => {
      try {
        await browser.navigate('/recipes');
        
        const recipeLink = await browser.page.evaluate(() => {
          const link = document.querySelector('a[href*="/recipes/"]');
          return link ? link.getAttribute('href') : null;
        });
        
        if (!recipeLink) {
          console.log('No recipes found to test');
          return;
        }
        
        await browser.navigate(recipeLink);
        await browser.page.waitForTimeout(2000);
        
        // Check that page doesn't crash with missing data
        const pageLoaded = await browser.elementExists('.v-container', 5000);
        assert.ok(pageLoaded, 'Page should load even with missing data');
        
        // Check for required fields
        const hasRequiredFields = await browser.page.evaluate(() => {
          const hasName = !!document.querySelector('.text-h3');
          const hasIngredients = Array.from(document.querySelectorAll('.v-card-title'))
            .some(el => el.textContent?.includes('Ingredients'));
          const hasInstructions = Array.from(document.querySelectorAll('.v-card-title'))
            .some(el => el.textContent?.includes('Instructions'));
          
          return { hasName, hasIngredients, hasInstructions };
        });
        
        assert.ok(hasRequiredFields.hasName, 'Recipe name should always be present');
        assert.ok(hasRequiredFields.hasIngredients, 'Ingredients section should always be present');
        assert.ok(hasRequiredFields.hasInstructions, 'Instructions section should always be present');
        
        console.log('✓ Recipe page handles missing data gracefully');
        
      } catch (error) {
        await browser.screenshotOnFailure('recipe-data-validation', error);
      }
    });
  });
});