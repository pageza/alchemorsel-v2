/**
 * Basic E2E flow test using simple selectors
 */

const BrowserManager = require('./helpers/browser');

async function runBasicFlow() {
  const browser = new BrowserManager();
  
  try {
    console.log('🚀 Starting basic flow test...\n');
    
    await browser.launch();
    
    // Test 1: Check landing page
    console.log('📋 Test 1: Landing page');
    await browser.navigate('/');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const landingUrl = browser.getCurrentUrl();
    console.log(`✅ Landing page accessible: ${landingUrl}`);
    
    // Test 2: Check login page structure
    console.log('\n📋 Test 2: Login page inspection');
    await browser.navigate('/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for various possible form selectors
    const selectors = [
      'form',
      'input[type="email"]',
      'input[type="password"]', 
      'button',
      'button[type="submit"]',
      '.v-btn',
      '.v-form',
      '.login-form'
    ];
    
    console.log('Available elements on login page:');
    for (const selector of selectors) {
      const exists = await browser.elementExists(selector, 1000);
      console.log(`  ${selector}: ${exists ? '✅' : '❌'}`);
    }
    
    // Test 3: Try login with very basic selectors
    console.log('\n📋 Test 3: Login attempt with basic selectors');
    try {
      // Fill email field (try multiple possible selectors)
      const emailSelectors = ['input[type="email"]', 'input[name="email"]', '.v-text-field input'];
      let emailFilled = false;
      
      for (const selector of emailSelectors) {
        if (await browser.elementExists(selector, 1000)) {
          await browser.fillInput(selector, 'admin@example.com');
          emailFilled = true;
          console.log(`✅ Email filled using: ${selector}`);
          break;
        }
      }
      
      if (!emailFilled) {
        console.log('❌ Could not find email input field');
        // Take a screenshot to see what's on the page
        await browser.screenshot('login-page-elements');
        
        // Let's check what inputs actually exist
        const allInputs = await browser.page.$$eval('input', inputs => 
          inputs.map(input => ({
            type: input.type,
            name: input.name,
            placeholder: input.placeholder,
            id: input.id,
            className: input.className
          }))
        );
        console.log('All inputs found on page:', allInputs);
        
        return;
      }
      
      // Fill password field
      const passwordSelectors = ['input[type="password"]', 'input[name="password"]'];
      let passwordFilled = false;
      
      for (const selector of passwordSelectors) {
        if (await browser.elementExists(selector, 1000)) {
          await browser.fillInput(selector, 'testpassword123');
          passwordFilled = true;
          console.log(`✅ Password filled using: ${selector}`);
          break;
        }
      }
      
      if (!passwordFilled) {
        console.log('❌ Could not find password input field');
        return;
      }
      
      // Click submit button
      const buttonSelectors = ['button[type="submit"]', 'button', '.v-btn', 'input[type="submit"]'];
      let buttonClicked = false;
      
      for (const selector of buttonSelectors) {
        if (await browser.elementExists(selector, 1000)) {
          await browser.clickElement(selector);
          buttonClicked = true;
          console.log(`✅ Submit button clicked using: ${selector}`);
          break;
        }
      }
      
      if (!buttonClicked) {
        console.log('❌ Could not find submit button');
        return;
      }
      
      // Wait and check result
      await new Promise(resolve => setTimeout(resolve, 5000));
      const afterLoginUrl = browser.getCurrentUrl();
      const loginSuccessful = !afterLoginUrl.includes('/login');
      console.log(`${loginSuccessful ? '✅' : '❌'} Login result: ${loginSuccessful} (URL: ${afterLoginUrl})`);
      
      if (loginSuccessful) {
        // Test 4: Check authenticated pages
        console.log('\n📋 Test 4: Authenticated page access');
        
        const protectedPages = ['/dashboard', '/profile', '/generate', '/recipes'];
        for (const page of protectedPages) {
          await browser.navigate(page);
          await new Promise(resolve => setTimeout(resolve, 2000));
          const url = browser.getCurrentUrl();
          const accessible = url.includes(page) || !url.includes('/login');
          console.log(`  ${page}: ${accessible ? '✅' : '❌'} (${url})`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Login test error: ${error.message}`);
      await browser.screenshot('login-error');
    }
    
    // Test 5: Registration page inspection
    console.log('\n📋 Test 5: Registration page inspection');
    await browser.navigate('/register');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Available elements on register page:');
    for (const selector of selectors) {
      const exists = await browser.elementExists(selector, 1000);
      console.log(`  ${selector}: ${exists ? '✅' : '❌'}`);
    }
    
    // Check what form fields are available
    const regInputs = await browser.page.$$eval('input', inputs => 
      inputs.map(input => ({
        type: input.type,
        name: input.name,
        placeholder: input.placeholder,
        id: input.id
      }))
    );
    console.log('Registration form inputs:', regInputs);
    
    console.log('\n🎉 Basic flow test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await browser.screenshot('test-failure');
  } finally {
    await browser.close();
  }
}

// Run the test
runBasicFlow().catch(console.error);