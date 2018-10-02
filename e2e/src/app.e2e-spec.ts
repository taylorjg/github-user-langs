import { AppPage } from './app.po';
import { version } from '../../version2';
import * as P from 'protractor';

describe('workspace-project App', () => {
  
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display the correct version number', () => {
    page.navigateTo();
    expect(page.getVersion()).toMatch(new RegExp(`${version}$`));
  });

  it('should have non-zero language count for dhpiggott (via form submission)', () => {
    page.navigateTo();
    page.enterUsername('dhpiggott');
    page.clickSubmit();
    expect(page.getResultsTableRows().count()).toBeGreaterThan(0);
  });

  it('should have non-zero language count for dhpiggott (via query param)', () => {
    page.navigateTo('dhpiggott');
    expect(page.getResultsTableRows().count()).toBeGreaterThan(0);
  });

  it('should display an error message for a non-existent user', () => {
    page.navigateTo();
    page.enterUsername('mary-mungo-midge');
    page.clickSubmit();
    expect(page.getErrorPanelErrorMessage()).toContain('mary-mungo-midge');
  });

  it('should total 100% \u00b1 tolerance', async () => {
    page.navigateTo('dhpiggott');
    const rows = page.getResultsTableRows();
    const f = async (acc, row) => {
      const s = await row.$('td:nth-child(2)').getText()
      const n = Number(s.slice(0, -1))
      return acc + n
    }
    const total = await rows.reduce(f, 0);
    expect(total).toBeCloseTo(100, 6);
  });

  it('should have a non-zero repo count', async () => {
    page.navigateTo('dhpiggott');
    expect(page.getRepoCount()).toBeGreaterThan(0);
  });

  it('should have higher repo count after checking includeForkedRepos', async () => {
    page.navigateTo('taylorjg');
    const baseCount = await page.getRepoCount();
    page.setIncludeForkedReposValue(true);
    expect(page.getRepoCount()).toBeGreaterThan(baseCount);
  });

  it('should have higher repo count after checking includeNonOwnedRepos', async () => {
    page.navigateTo('taylorjg');
    const baseCount = await page.getRepoCount();
    page.setIncludeNonOwnedReposValue(true);
    expect(page.getRepoCount()).toBeGreaterThan(baseCount);
  });

  it('should have even higher repo count after checking both checkboxes', async () => {
    page.navigateTo('taylorjg');
    const count1 = await page.getRepoCount();
    page.setIncludeForkedReposValue(true);
    const count2 = await page.getRepoCount();
    page.setIncludeNonOwnedReposValue(true);
    const count3 = await page.getRepoCount();
    expect(count2).toBeGreaterThan(count1);
    expect(count3).toBeGreaterThan(count2);
  });
});
