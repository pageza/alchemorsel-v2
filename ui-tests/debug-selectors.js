/**
 * Debug script to inspect actual DOM structure
 */

const BrowserManager = require('./helpers/browser');

async function debugSelectors() {
  const browser = new BrowserManager();
  
  try {
    console.log('🔍 Debugging actual DOM structure...\n');
    
    await browser.launch();
    
    // Navigate to login page
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📋 Login page DOM inspection:');
    
    // Get all elements with data-testid
    const testIdElements = await browser.page.$$eval('[data-testid]', elements => 
      elements.map(el => ({
        testId: el.getAttribute('data-testid'),
        tagName: el.tagName,
        type: el.type || null,
        className: el.className,
        id: el.id || null
      }))
    );
    
    console.log('Elements with data-testid:');
    testIdElements.forEach(el => {
      console.log(`  ${el.testId}: <${el.tagName.toLowerCase()}> ${el.type ? `type="${el.type}"` : ''} ${el.className ? `class="${el.className}"` : ''}`);
    });
    
    // Get all input elements
    const inputElements = await browser.page.$$eval('input', inputs => 
      inputs.map(input => ({
        type: input.type,
        name: input.name || null,
        placeholder: input.placeholder || null,
        id: input.id || null,
        className: input.className || null,
        testId: input.getAttribute('data-testid') || null,
        parentTestId: input.closest('[data-testid]')?.getAttribute('data-testid') || null
      }))
    );
    
    console.log('\nAll input elements:');
    inputElements.forEach((input, index) => {
      console.log(`  Input ${index + 1}: type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" testId="${input.testId}" parentTestId="${input.parentTestId}"`);
    });
    
    // Test different selector patterns
    const selectorTests = [
      '[data-testid="email-input"]',
      '[data-testid="email-input"] input',
      '[data-testid="email-input"] .el-input__inner',
      '.el-input input',
      'input[type="email"]'
    ];
    
    console.log('\nSelector test results:');
    for (const selector of selectorTests) {
      const exists = await browser.elementExists(selector, 1000);
      console.log(`  ${selector}: ${exists ? '✅' : '❌'}`);
    }
    
    // Take a screenshot for visual inspection
    await browser.screenshot('login-page-debug');
    console.log('\n📸 Screenshot saved as login-page-debug.png');
    
    // Now check registration page
    console.log('\n📋 Registration page DOM inspection:');
    await browser.navigate('/register');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const regTestIdElements = await browser.page.$$eval('[data-testid]', elements => 
      elements.map(el => ({
        testId: el.getAttribute('data-testid'),
        tagName: el.tagName,
        type: el.type || null
      }))
    );
    
    console.log('Registration page elements with data-testid:');
    regTestIdElements.forEach(el => {
      console.log(`  ${el.testId}: <${el.tagName.toLowerCase()}> ${el.type ? `type="${el.type}"` : ''}`);
    });
    
    await browser.screenshot('register-page-debug');
    console.log('\n📸 Screenshot saved as register-page-debug.png');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the debug
debugSelectors().catch(console.error);