const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting Puppeteer navigation test...');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    // Log network requests to see what's failing
    page.on('response', response => {
      const status = response.status();
      const url = response.url();
      if (status >= 400) {
        console.log(`❌ ${status} ${url}`);
      } else if (url.includes('/api/')) {
        console.log(`✅ ${status} ${url}`);
      }
    });
    
    // Log console messages from the page
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`🔥 Console Error: ${msg.text()}`);
      }
    });
    
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    
    console.log('📝 Filling login form...');
    await page.type('input[data-testid="email-input"]', 'admin@example.com');
    await page.type('input[data-testid="password-input"]', 'testpassword123');
    
    console.log('🔑 Submitting login...');
    await page.click('button[data-testid="login-submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    console.log('📍 Current URL:', page.url());
    
    console.log('🧭 Looking for navigation elements...');
    
    // Debug: Check what navigation links exist
    const navLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent.trim(),
        visible: link.offsetParent !== null
      })).filter(link => link.href && (link.href.includes('generate') || link.text.toLowerCase().includes('generate')));
    });
    
    console.log('🔍 Found navigation links:', navLinks);
    
    // Try to find generate recipe link with different selectors
    const selectors = [
      '[href="/generate"]',
      'a[href*="generate"]',
      '*[data-testid*="generate"]',
      'button:contains("Generate")',
      '*:contains("Generate Recipe")'
    ];
    
    let foundSelector = null;
    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 1000 });
        foundSelector = selector;
        console.log(`✅ Found element with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`❌ Selector not found: ${selector}`);
      }
    }
    
    if (foundSelector) {
      console.log('🧭 Clicking generate recipe element...');
      await page.click(foundSelector);
    } else {
      console.log('❌ No generate recipe element found');
    }
    
    // Wait a bit to see what happens
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📍 Final URL:', page.url());
    
    // Check if we're still logged in by looking for auth indicators
    const isLoggedIn = await page.evaluate(() => {
      return !!localStorage.getItem('auth_token') || !!sessionStorage.getItem('auth_token');
    });
    
    console.log('🔐 Still logged in:', isLoggedIn);
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();