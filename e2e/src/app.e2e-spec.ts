import { AppPage } from './app.po';

describe('workspace-project App', () => {
  
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should list 3 languages for dhpiggott', () => {
    page.navigateTo();
    page.enterUsername('dhpiggott');
    page.clickSubmit();
    expect(page.getResultsTableRows().count()).toBe(3);
  });

  it('should display an error message for non-existent user, "dhpiggott-bogus"', () => {
    page.navigateTo();
    page.enterUsername('dhpiggott-bogus');
    page.clickSubmit();
    expect(page.getErrorPanelErrorMessage()).toContain('dhpiggott-bogus');
  });
});
