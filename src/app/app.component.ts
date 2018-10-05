import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from './services/github.service';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { FormComponent } from './components/form/form.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
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
  @ViewChild(UserDetailsComponent) userDetails: UserDetailsComponent;
  @ViewChild(RepoFilterComponent) repoFilter: RepoFilterComponent;
  @ViewChild(ResultsTableComponent) resultsTable: ResultsTableComponent;

  version = version;
  private results = null;
  private subscription = null;

  constructor(private gh: GithubService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.getUserLangs(username);
      }
    });
    this.subscription = this.repoFilter.onFilterChanged.subscribe(this.updateResults.bind(this));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit(username: string) {
    this.getUserLangs(username);
  }

  onReset() {
    console.log('[onReset] TODO')
  }

  private getUserLangs(username: string) {
    this.form.queryStarted();
    this.gh.getUserLangs(username)
      .pipe(finalize(() => {
        this.form.queryFinished();
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

  private updateResults() {
    this.resultsTable.langs = common.filterResults(
      this.results,
      this.repoFilter.includeForkedRepos,
      this.repoFilter.includeNonOwnedRepos);
    this.repoFilter.repoCount = common.countRepos(
      this.results,
      this.repoFilter.includeForkedRepos,
      this.repoFilter.includeNonOwnedRepos);
    this.userDetails.user = this.results.success.user;
  }
}
