import puppeteer from 'puppeteer';
import { expect } from 'chai';



describe('Puppeteer test cases', () => {
  beforeEach(async () => {
    this.browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        slowMo: 500,
      });
    this.page = await this.browser.newPage();
    await this.page.goto('http://127.0.0.1:5000/');
  });

  afterEach(async () => {
    await this.browser.close();
  });

  describe('button1 test cases', () => {
    it('should follow returned redirectUrl if response is ok', async () => {
      this.page.on('request', (request) => {
        if (request.url().endsWith('/api/some/endpoint/?with=params')) {
          request.respond({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify('https://example.com/returned/redirect/url/'),
          });
        } else {
          request.continue();
        }
      });
      this.page.setRequestInterception(true);

      this.page.click('#button1');
      await this.page.waitForNavigation();

      expect(this.page.url()).to.equal('https://example.com/returned/redirect/url/');
    });

    it('should follow default url if request is blocked', async () => {
      this.page.on('request', (request) => {
        if (request.url().endsWith('/api/some/endpoint/?with=params')) {
          request.abort('blockedbyclient');
        } else {
          request.continue();
        }
      });
      this.page.setRequestInterception(true);

      this.page.click('#button1');
      await this.page.waitForNavigation();

      expect(this.page.url()).to.equal('https://example.com/default/url/');
    });

    it('should follow default url if request is invalid', async () => {
      this.page.on('request', (request) => {
        if (request.url().endsWith('/api/some/endpoint/?with=params')) {
          request.respond({
            status: 500,
            contentType: 'text/html',
            body: '<p>Error</p>',
          });
        } else {
          request.continue();
        }
      });
      this.page.setRequestInterception(true);

      this.page.click('#button1');
      await this.page.waitForNavigation();

      expect(this.page.url()).to.equal('https://example.com/default/url/');
    });
  });

  describe('button2 test cases', () => {
    it('should not print message to node console on button2 click', async () => {
      const printedMessages = [];

      console.log = (message) => {
        printedMessages.push(message);
      }
      await this.page.click('#button2');

      expect(printedMessages).to.be.empty;
    });

    it('should print message to browser console on button2 click', async () => {
      await this.page.evaluate(() => {
        window.printedMessages = [];

        window.console.log = (message) => {
          window.printedMessages.push(message);
        }
      });
      await this.page.click('#button2');
      const printedMessages = await this.page.evaluate(() => window.printedMessages);

      expect(printedMessages).to.contain('Hello from main.js!');
    });
  });
});
