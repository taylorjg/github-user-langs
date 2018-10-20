import { AppPage } from './app.po';
import { version } from '../../version2';

describe('github-user-langs', () => {

  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  describe('general', () => {

    it('should display the correct version number', () => {
      page.navigateTo();
      expect(page.getVersion()).toMatch(new RegExp(`${version}$`));
    });

    it('should display an error message for a non-existent user', () => {
      page.navigateTo();
      page.enterUsername('bogus-crap-blah');
      page.clickSubmit();
      expect(page.getErrorPanelErrorMessage()).toContain('bogus-crap-blah');
    });
  });

  describe('dhpiggott', () => {

    const USERNAME = 'dhpiggott';

    it('should have non-zero language count (via form submission)', () => {
      page.navigateTo();
      page.enterUsername(USERNAME);
      page.clickSubmit();
      expect(page.getResultsTableRows().count()).toBeGreaterThan(0);
    });

    it('should have non-zero language count (via query param)', () => {
      page.navigateTo(USERNAME);
      expect(page.getResultsTableRows().count()).toBeGreaterThan(0);
    });

    it('should have languages that total 100% \u00b1 tolerance', async () => {
      page.navigateTo(USERNAME);
      const rows = page.getResultsTableRows();
      const f = async (acc, row) => {
        const s = await row.$('td:nth-child(2)').getText()
        const n = Number(s.slice(0, -1))
        return acc + n
      }
      const total = await rows.reduce(f, 0);
      expect(total).toBeCloseTo(100, 2);
    });

    it('should fully populate the user details panel', () => {
      page.navigateTo(USERNAME);
      expect(page.getUserLink()).toBe('https://github.com/dhpiggott');
      expect(page.getUserAvatarLink()).toBe('https://avatars1.githubusercontent.com/u/6965859?v=4');
      expect(page.getUserNameText()).toBe('David Piggott');
      expect(page.getUserLoginText()).toBe('dhpiggott');
      expect(page.getUserCompanyText()).toBe('@cakesolutions');
      expect(page.getUserCompanyLink()).toBe('https://github.com/cakesolutions');
      expect(page.getUserLocationText()).toBe('United Kingdom');
      expect(page.getUserEmailText()).toBe('david@piggott.me.uk');
      expect(page.getUserEmailLink()).toBe('mailto:david@piggott.me.uk');
      expect(page.getUserWebsiteText()).toBe('https://www.dhpiggott.net/');
      expect(page.getUserWebsiteLink()).toBe('https://www.dhpiggott.net/');
    });
  });

  describe('taylorjg', () => {

    const USERNAME = 'taylorjg';

    it('should have a non-zero repo count', async () => {
      page.navigateTo(USERNAME);
      expect(page.getRepoCount()).toBeGreaterThan(0);
    });

    it('should have higher repo count after checking includeForkedRepos', async () => {
      page.navigateTo(USERNAME);
      const baseCount = await page.getRepoCount();
      page.setIncludeForkedReposValue(true);
      expect(page.getRepoCount()).toBeGreaterThan(baseCount);
    });

    it('should have higher repo count after checking includeNonOwnedRepos', async () => {
      page.navigateTo(USERNAME);
      const baseCount = await page.getRepoCount();
      page.setIncludeNonOwnedReposValue(true);
      expect(page.getRepoCount()).toBeGreaterThan(baseCount);
    });

    it('should have even higher repo count after checking both checkboxes', async () => {
      page.navigateTo(USERNAME);
      const count1 = await page.getRepoCount();
      page.setIncludeForkedReposValue(true);
      const count2 = await page.getRepoCount();
      page.setIncludeNonOwnedReposValue(true);
      const count3 = await page.getRepoCount();
      expect(count2).toBeGreaterThan(count1);
      expect(count3).toBeGreaterThan(count2);
    });
  });
});
