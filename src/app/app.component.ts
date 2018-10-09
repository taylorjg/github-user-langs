import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from './services/github.service';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
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
export class AppComponent implements OnInit {

  @ViewChild(ErrorPanelComponent) errorPanel: ErrorPanelComponent;

  version = version;
  includeForkedRepos = false;
  includeNonOwnedRepos = false;
  results = null;
  repoCount = 0;
  langs = [];
  user = null;
  queryInProgress = false;

  constructor(private gh: GithubService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.getUserLangs(username);
      }
    });
  }

  onSubmit(username: string) {
    this.getUserLangs(username);
  }

  onReset() {
    this.includeForkedRepos = false;
    this.includeNonOwnedRepos = false;
    this.results = null;
    this.repoCount = 0;
    this.langs = [];
    this.user = null;
  }

  onFilterChanged(filterValues) {
    this.includeForkedRepos = filterValues.includeForkedRepos;
    this.includeNonOwnedRepos = filterValues.includeNonOwnedRepos;
    this.updateResults();
  }

  private getUserLangs(username: string) {
    this.results = null;
    this.queryStarted();
    this.gh.getUserLangs(username)
      .pipe(finalize(() => {
        this.queryFinished();
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
    this.langs = common.filterResults(
      this.results,
      this.includeForkedRepos,
      this.includeNonOwnedRepos);
    this.repoCount = common.countRepos(
      this.results,
      this.includeForkedRepos,
      this.includeNonOwnedRepos);
    this.user = this.results.success.user;
  }

  queryStarted() {
    this.queryInProgress = true;
  }

  queryFinished() {
    this.queryInProgress = false;
  }
}
