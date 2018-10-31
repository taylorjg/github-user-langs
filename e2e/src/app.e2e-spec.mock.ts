import { AppPage } from './app.po';
import * as ngApimock from '../../.tmp/ngApimock/protractor.mock.js';

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

  it('TODO: e2e mock test that requires a call to ngApimock.selectScenario()', () => {
    ngApimock.selectScenario('userLangs', 'error');
  });
});
