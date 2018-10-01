import { browser, by, element } from 'protractor';

export class AppPage {
  
  navigateTo(username?: string) {
    const destination = username ? `/index.html?username=${username}` : '/'
    return browser.get(destination);
  }

  getVersion() {
    return element(by.css('.version')).getText();
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
