import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { RepoFilterComponent } from './components/repo-filter/repo-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ResultsTableComponent,
    ErrorPanelComponent,
    RepoFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
