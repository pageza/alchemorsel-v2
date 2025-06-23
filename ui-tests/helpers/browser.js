const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class BrowserManager {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    this.screenshotDir = path.join(__dirname, '../screenshots');
    
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async launch() {
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-audio-output',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate'
      ]
    });
    
    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(30000);
    return this.page;
  }

  async navigate(url) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    await this.page.goto(fullUrl, { waitUntil: 'networkidle0' });
  }

  async elementExists(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  async clickElement(selector) {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  async fillInput(selector, value) {
    await this.page.waitForSelector(selector);
    await this.page.focus(selector);
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('KeyA');
    await this.page.keyboard.up('Control');
    await this.page.type(selector, value);
  }

  getCurrentUrl() {
    return this.page.url();
  }

  async waitForTimeout(milliseconds) {
    await this.page.waitForTimeout(milliseconds);
  }

  async screenshot(name) {
    if (process.env.SCREENSHOT_ON_FAILURE === 'true') {
      const filepath = path.join(this.screenshotDir, `${name}.png`);
      await this.page.screenshot({ path: filepath });
      console.log(`Screenshot saved: ${filepath}`);
    }
  }

  async screenshotOnFailure(testName, error) {
    await this.screenshot(`failure-${testName}`);
    throw error;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = BrowserManager;