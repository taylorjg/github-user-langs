import { AppPage } from './app.po';

describe('github-user-langs', () => {

  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display an error message on proxy failure', () => {
    page.navigateTo('anything');
    expect(page.getErrorPanelErrorMessage()).toContain('418');
    expect(page.getErrorPanelErrorMessage()).toContain('teapot');
  });
});
