import { AppPage } from './app.po';
import { version } from '../../version2';

describe('workspace-project App', () => {
  
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display the correct version number', () => {
    page.navigateTo();
    expect(page.getVersion()).toMatch(new RegExp(`${version}$`));
  });

  it('should list 3 languages for dhpiggott', () => {
    page.navigateTo();
    page.enterUsername('dhpiggott');
    page.clickSubmit();
    expect(page.getResultsTableRows().count()).toBe(3);
  });

  it('should list 3 languages for dhpiggott (via query param)', () => {
    page.navigateTo('dhpiggott');
    expect(page.getResultsTableRows().count()).toBe(3);
  });

  it('should display an error message for non-existent user, "dhpiggott-bogus"', () => {
    page.navigateTo();
    page.enterUsername('dhpiggott-bogus');
    page.clickSubmit();
    expect(page.getErrorPanelErrorMessage()).toContain('dhpiggott-bogus');
  });
});
