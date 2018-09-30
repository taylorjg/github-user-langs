import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GithubService } from './services/github.service';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { FormComponent } from './components/form/form.component';
import { RepoFilterComponent } from './components/repo-filter/repo-filter.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';
import { finalize } from 'rxjs/operators';
import * as common from '../../common';
import { version } from '../../version';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    GithubService
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild(ErrorPanelComponent) errorPanel: ErrorPanelComponent;
  @ViewChild(FormComponent) form: FormComponent;
  @ViewChild(RepoFilterComponent) repoFilter: RepoFilterComponent;
  @ViewChild(ResultsTableComponent) resultsTable: ResultsTableComponent;

  version = version;
  private results = null;
  private subscription = null;

  constructor(private gh: GithubService) { }

  ngOnInit() {
    this.subscription = this.repoFilter.onFilterChanged.subscribe(this.updateResults.bind(this));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();    
  }

  onSubmit(username: string) {
    this.form.showSpinner = true;
    this.gh.getUserLangs(username)
      .pipe(finalize(() => {
        this.form.showSpinner = false;
      }))
      .subscribe(
        (results: any) => {
          if (results.failure) {
            this.errorPanel.showError(results.failure.errors[0].message);
          } else {
            this.results = results;
            this.updateResults();
            this.errorPanel.close();
          }
        },
        error => {
          this.errorPanel.showHttpError(error, 'An error occurred proxying a call to the GitHub GraphQL API');
        });
  }

  onReset() {
    console.log('[onReset] TODO')
  }

  updateResults() {
    this.resultsTable.langs = common.filterResults(
      this.results,
      this.repoFilter.includeForkedRepos,
      this.repoFilter.includeNonOwnedRepos);
    this.repoFilter.repoCount = common.countRepos(
      this.results,
      this.repoFilter.includeForkedRepos,
      this.repoFilter.includeNonOwnedRepos);
  }
}
