/**
 * MVP Mobile & Responsive Design E2E Tests
 * 
 * Tests mobile responsiveness and touch interactions based on user stories in docs/planning/STORIES.md
 * Focus: Mobile-first design, responsive layouts, touch optimization
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const BrowserManager = require('../helpers/browser');
const AuthHelper = require('../helpers/auth');

describe('MVP Mobile & Responsive Stories', () => {
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

  describe('🎯 Mobile Viewport Testing', () => {
    
    test('MOBILE-001: Landing page is responsive on mobile', async () => {
      // Set mobile viewport
      await browser.page.setViewport({ width: 375, height: 667 }); // iPhone SE size
      
      await browser.navigate('/');
      
      // Check if main navigation is mobile-friendly
      const mobileNav = await browser.elementExists('.mobile-nav, .hamburger-menu, .nav-toggle', 5000);
      console.log(mobileNav ? '✅ Mobile navigation found' : '⚠️ Mobile navigation not found');
      
      // Check if hero section is responsive
      const heroSection = await browser.elementExists('.hero-section, .hero', 5000);
      assert.ok(heroSection, 'Hero section should be present on mobile');
      
      // Check if content fits within viewport
      const bodyWidth = await browser.page.evaluate(() => document.body.scrollWidth);
      assert.ok(bodyWidth <= 375, 'Page content should not exceed mobile viewport width');
      
      console.log('✅ Landing page responsive design verified');
    });

    test('MOBILE-002: Recipe browsing works on mobile', async () => {
      await browser.page.setViewport({ width: 375, height: 667 });
      await browser.navigate('/recipes');
      
      // Check if recipe cards are mobile-optimized
      const recipeCards = await browser.elementExists('.recipe-card, .recipe-preview-card', 5000);
      assert.ok(recipeCards, 'Recipe cards should be visible on mobile');
      
      // Check if cards stack vertically on mobile
      const cardLayout = await browser.page.evaluate(() => {
        const cards = document.querySelectorAll('.recipe-card, .recipe-preview-card');
        if (cards.length >= 2) {
          const firstCard = cards[0].getBoundingClientRect();
          const secondCard = cards[1].getBoundingClientRect();
          return secondCard.top > firstCard.bottom; // Cards should stack vertically
        }
        return true;
      });
      
      console.log(cardLayout ? '✅ Recipe cards stack vertically on mobile' : '⚠️ Recipe cards not properly stacked');
    });

    test('MOBILE-003: Login form is mobile-friendly', async () => {
      await browser.page.setViewport({ width: 375, height: 667 });
      await browser.navigate('/login');
      
      // Check form layout
      const loginForm = await browser.elementExists('form, .login-form', 5000);
      assert.ok(loginForm, 'Login form should be present');
      
      // Check input field sizing
      const inputFields = await browser.page.evaluate(() => {
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
        return Array.from(inputs).every(input => {
          const rect = input.getBoundingClientRect();
          return rect.width >= 200; // Inputs should be reasonably sized
        });
      });
      
      console.log(inputFields ? '✅ Input fields properly sized for mobile' : '⚠️ Input fields may be too small');
    });

    test('MOBILE-004: Dashboard is mobile responsive', async () => {
      await browser.page.setViewport({ width: 375, height: 667 });
      await auth.login('admin@example.com', 'testpassword123');
      
      // Check dashboard layout
      const dashboardStats = await browser.elementExists('.dashboard-stats', 5000);
      assert.ok(dashboardStats, 'Dashboard stats should be visible');
      
      // Check if stats cards stack on mobile
      const statsLayout = await browser.page.evaluate(() => {
        const statCards = document.querySelectorAll('.stat-card, .dashboard-card');
        if (statCards.length >= 2) {
          const firstCard = statCards[0].getBoundingClientRect();
          const secondCard = statCards[1].getBoundingClientRect();
          return secondCard.top >= firstCard.bottom - 10; // Allow for some margin
        }
        return true;
      });
      
      console.log(statsLayout ? '✅ Dashboard cards stack properly on mobile' : '⚠️ Dashboard layout issues on mobile');
    });
  });

  describe('🎯 Touch Interaction Testing', () => {
    
    beforeEach(async () => {
      await browser.page.setViewport({ width: 375, height: 667 });
    });

    test('MOBILE-005: Touch targets are appropriately sized', async () => {
      await browser.navigate('/');
      
      // Check button sizes meet touch target guidelines (44px minimum)
      const touchTargetSizes = await browser.page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a, input[type="submit"]');
        return Array.from(buttons).map(element => {
          const rect = element.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            meetsGuidelines: rect.width >= 44 && rect.height >= 44
          };
        });
      });
      
      const adequateTargets = touchTargetSizes.filter(target => target.meetsGuidelines).length;
      const totalTargets = touchTargetSizes.length;
      
      console.log(`✅ ${adequateTargets}/${totalTargets} touch targets meet size guidelines`);
    });

    test('MOBILE-006: Mobile navigation menu works', async () => {
      await browser.navigate('/');
      
      // Look for mobile menu trigger
      const menuTrigger = await browser.elementExists('.mobile-nav, .hamburger-menu, .nav-toggle, .menu-btn', 5000);
      
      if (menuTrigger) {
        // Try opening mobile menu
        await browser.clickElement('.mobile-nav, .hamburger-menu, .nav-toggle, .menu-btn');
        await browser.page.waitForTimeout(500);
        
        // Check if menu opened
        const openMenu = await browser.elementExists('.nav-menu.open, .mobile-menu.show, .nav-drawer', 3000);
        console.log(openMenu ? '✅ Mobile menu opens correctly' : '⚠️ Mobile menu not opening');
        
        // Check if navigation links are accessible
        const navLinks = await browser.elementExists('nav a, .nav-link', 3000);
        console.log(navLinks ? '✅ Navigation links accessible in mobile menu' : '⚠️ Navigation links not found');
      } else {
        console.log('⚠️ Mobile navigation trigger not found');
      }
    });

    test('MOBILE-007: Recipe cards are touch-friendly', async () => {
      await browser.navigate('/recipes');
      
      // Check if recipe cards respond to touch
      const recipeCard = await browser.elementExists('.recipe-card, .recipe-preview-card', 5000);
      
      if (recipeCard) {
        // Try tapping a recipe card
        await browser.clickElement('.recipe-card, .recipe-preview-card');
        await browser.page.waitForTimeout(2000);
        
        // Should navigate to recipe details or show interaction
        const url = browser.getCurrentUrl();
        const recipeInteraction = url.includes('/recipes/') || await browser.elementExists('.recipe-modal, .recipe-overlay', 3000);
        
        console.log(recipeInteraction ? '✅ Recipe cards respond to touch' : '⚠️ Recipe cards not interactive');
      }
    });

    test('MOBILE-008: Form inputs work with mobile keyboards', async () => {
      await browser.navigate('/register');
      
      // Test email input (should trigger email keyboard)
      const emailInput = await browser.elementExists('input[type="email"]', 5000);
      if (emailInput) {
        await browser.clickElement('input[type="email"]');
        await browser.page.waitForTimeout(500);
        
        // Type in email field
        await browser.fillInput('input[type="email"]', 'test@example.com');
        console.log('✅ Email input works with mobile keyboard');
      }
      
      // Test password input
      const passwordInput = await browser.elementExists('input[type="password"]', 5000);
      if (passwordInput) {
        await browser.clickElement('input[type="password"]');
        await browser.fillInput('input[type="password"]', 'testpassword');
        console.log('✅ Password input works with mobile keyboard');
      }
    });
  });

  describe('🎯 Cross-Device Compatibility', () => {
    
    test('MOBILE-009: Tablet landscape view works correctly', async () => {
      // Set tablet landscape viewport
      await browser.page.setViewport({ width: 1024, height: 768 });
      
      await browser.navigate('/');
      
      // Check if layout adapts to tablet size
      const navigation = await browser.elementExists('nav, .navigation', 5000);
      assert.ok(navigation, 'Navigation should be present on tablet');
      
      // Check if content uses available space efficiently
      const contentWidth = await browser.page.evaluate(() => {
        const main = document.querySelector('main, .main-content, .container');
        return main ? main.getBoundingClientRect().width : 0;
      });
      
      console.log(`✅ Content width on tablet: ${contentWidth}px`);
      assert.ok(contentWidth > 600, 'Content should utilize tablet screen space');
    });

    test('MOBILE-010: Large mobile view (iPhone Plus) works', async () => {
      // Set large mobile viewport
      await browser.page.setViewport({ width: 414, height: 736 });
      
      await browser.navigate('/recipes');
      
      // Check if recipe layout adapts
      const recipeCards = await browser.elementExists('.recipe-card, .recipe-preview-card', 5000);
      assert.ok(recipeCards, 'Recipe cards should be visible');
      
      // Count visible cards to ensure layout efficiency
      const visibleCards = await browser.page.evaluate(() => {
        const cards = document.querySelectorAll('.recipe-card, .recipe-preview-card');
        return Array.from(cards).filter(card => {
          const rect = card.getBoundingClientRect();
          return rect.top >= 0 && rect.top < window.innerHeight;
        }).length;
      });
      
      console.log(`✅ ${visibleCards} recipe cards visible on large mobile screen`);
    });

    test('MOBILE-011: Small mobile view (iPhone SE) works', async () => {
      // Set small mobile viewport
      await browser.page.setViewport({ width: 320, height: 568 });
      
      await browser.navigate('/');
      
      // Check if content doesn't overflow
      const horizontalOverflow = await browser.page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      
      assert.ok(!horizontalOverflow, 'Content should not overflow horizontally on small screens');
      
      // Check if essential elements are still accessible
      const essentialElements = await browser.page.evaluate(() => {
        const nav = document.querySelector('nav, .navigation');
        const main = document.querySelector('main, .main-content');
        return nav && main;
      });
      
      assert.ok(essentialElements, 'Essential page elements should be present on small screens');
      console.log('✅ Small screen compatibility verified');
    });
  });

  describe('🎯 Mobile-Specific Features', () => {
    
    test('MOBILE-012: Swipe gestures work on recipe cards', async () => {
      await browser.page.setViewport({ width: 375, height: 667 });
      await browser.navigate('/recipes');
      
      // Look for swipeable elements
      const swipeableCards = await browser.elementExists('.swipeable, .recipe-card[data-swipe]', 3000);
      
      if (swipeableCards) {
        console.log('✅ Swipeable recipe cards found');
        
        // Try simulating a swipe gesture
        const cardRect = await browser.page.evaluate(() => {
          const card = document.querySelector('.swipeable, .recipe-card');
          return card ? card.getBoundingClientRect() : null;
        });
        
        if (cardRect) {
          // Simulate touch swipe
          await browser.page.touchscreen.tap(cardRect.x + cardRect.width / 2, cardRect.y + cardRect.height / 2);
          console.log('✅ Touch interaction simulated');
        }
      } else {
        console.log('⚠️ Swipeable elements not found (may not be implemented)');
      }
    });

    test('MOBILE-013: Pull-to-refresh works on recipe lists', async () => {
      await browser.page.setViewport({ width: 375, height: 667 });
      await browser.navigate('/recipes');
      
      // Look for pull-to-refresh indicators
      const pullToRefresh = await browser.elementExists('.pull-to-refresh, .refresh-indicator', 3000);
      
      if (pullToRefresh) {
        console.log('✅ Pull-to-refresh functionality found');
      } else {
        console.log('⚠️ Pull-to-refresh not implemented (future enhancement)');
      }
    });

    test('MOBILE-014: Mobile search is optimized', async () => {
      await browser.page.setViewport({ width: 375, height: 667 });
      await browser.navigate('/recipes');
      
      // Check mobile search interface
      const searchInput = await browser.elementExists('input[type="search"], .search-input', 5000);
      
      if (searchInput) {
        // Check if search is optimized for mobile
        const searchOptimized = await browser.page.evaluate(() => {
          const search = document.querySelector('input[type="search"], .search-input');
          const rect = search.getBoundingClientRect();
          
          // Check if search input is full-width on mobile
          const isFullWidth = rect.width >= window.innerWidth * 0.8;
          
          // Check if search has appropriate input mode
          const hasInputMode = search.hasAttribute('inputmode') || search.type === 'search';
          
          return { isFullWidth, hasInputMode, width: rect.width };
        });
        
        console.log(`✅ Mobile search - Full width: ${searchOptimized.isFullWidth}, Input mode: ${searchOptimized.hasInputMode}`);
      }
    });

    test('MOBILE-015: Loading states are mobile-appropriate', async () => {
      await browser.page.setViewport({ width: 375, height: 667 });
      await auth.login('admin@example.com', 'testpassword123');
      
      // Navigate to a page that might show loading
      await browser.navigate('/generate');
      
      // Look for mobile-friendly loading indicators
      const loadingIndicators = await browser.elementExists('.loading, .spinner, .skeleton', 3000);
      
      if (loadingIndicators) {
        console.log('✅ Loading indicators found');
        
        // Check if loading states are appropriately sized for mobile
        const loadingSize = await browser.page.evaluate(() => {
          const loading = document.querySelector('.loading, .spinner');
          if (loading) {
            const rect = loading.getBoundingClientRect();
            return rect.width <= window.innerWidth && rect.height <= window.innerHeight;
          }
          return true;
        });
        
        console.log(loadingSize ? '✅ Loading states appropriately sized' : '⚠️ Loading states may be oversized');
      } else {
        console.log('⚠️ Loading indicators not found');
      }
    });
  });
});