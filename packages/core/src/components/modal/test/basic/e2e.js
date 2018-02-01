'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/modal/test/basic?ionicplatform=${platform}`);
  }

  async present(buttonId) {
    await this.navigate('#presentModal');
    this.driver.findElement(By.id(buttonId)).click();
    await this.driver.wait(until.elementLocated(By.css('.modal-wrapper')));
    return await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.modal-wrapper'))));
  }
}

platforms.forEach(platform => {
  describe('modal/basic', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate('#presentModal');
    });
  });
});
