import { Component, ViewChild } from '@angular/core';
import { GithubService } from './services/github.service';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { FormComponent } from './components/form/form.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';
import { filterResults } from './common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    GithubService
  ]
})
export class AppComponent {

  @ViewChild(ErrorPanelComponent) errorPanel: ErrorPanelComponent;
  @ViewChild(FormComponent) form: FormComponent;
  @ViewChild(ResultsTableComponent) resultsTable: ResultsTableComponent;

  constructor(private gh: GithubService) { }

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
            this.resultsTable.langs = filterResults(results)
            this.errorPanel.close();
          }
        },
        error => {
          this.errorPanel.showHttpError(error, 'An error occurred proxying a call to the GitHub GraphQL API');
        });
  }

  onReset() {
    console.log('[onReset]')
  }
}
