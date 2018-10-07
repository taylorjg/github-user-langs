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

  getRepoCount() {
    return element(by.css('#repoCount')).getText().then(Number);
  }

  getIncludeForkedReposValue() {
    return element(by.css('#includeForkedRepos'))
      .getAttribute('checked')
      .then(value => !!value);
  }

  setIncludeForkedReposValue(value) {
    const currentValue = this.getIncludeForkedReposValue();
    if (currentValue !== value) {
      return element(by.css('#includeForkedRepos')).click();
    }
  }

  getIncludeNonOwnedReposValue() {
    return element(by.css('#includeNonOwnedRepos'))
      .getAttribute('checked')
      .then(value => !!value);
  }

  setIncludeNonOwnedReposValue(value) {
    const currentValue = this.getIncludeNonOwnedReposValue();
    if (currentValue !== value) {
      return element(by.css('#includeNonOwnedRepos')).click();
    }
  }

  getUserLink() {
    return element(by.css('#userPanel #url')).getAttribute('href');
  }

  getUserAvatarLink() {
    return element(by.css('#userPanel #avatar')).getAttribute('src');
  }

  getUserNameText() {
    return element(by.css('#userPanel #name')).getText();
  }

  getUserLoginText() {
    return element(by.css('#userPanel #login')).getText();
  }

  getUserCompanyText() {
    return element(by.css('#userPanel #company')).getText();
  }

  getUserCompanyLink() {
    return element(by.css('#userPanel #company a')).getAttribute('href');
  }

  getUserLocationText() {
    return element(by.css('#userPanel #location')).getText();
  }

  getUserEmailText() {
    return element(by.css('#userPanel #email')).getText();
  }

  getUserEmailLink() {
    return element(by.css('#userPanel #email')).getAttribute('href');
  }

  getUserWebsiteText() {
    return element(by.css('#userPanel #websiteUrl')).getText();
  }

  getUserWebsiteLink() {
    return element(by.css('#userPanel #websiteUrl')).getAttribute('href');
  }
}
