import { browser, by, element } from 'protractor';

export class AppPage {
  
  navigateTo() {
    return browser.get('/');
  }

  enterUsername(username) {
    return element(by.css('#username')).sendKeys(username);
  }

  clickSubmit() {
    return element(by.css('#submit')).click();
  }

  getResultsTableRows() {
    return element.all(by.css('table tbody tr'));
  }

  getErrorPanelErrorMessage() {
    return element(by.css('.alert #errorMessage')).getText();
  }
}
