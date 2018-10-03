import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { RepoFilterComponent } from './components/repo-filter/repo-filter.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

const routes: Routes = [
  { path: 'index.html', component: AppComponent },
  { path: '', redirectTo: '/index.html', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ResultsTableComponent,
    ErrorPanelComponent,
    RepoFilterComponent,
    UserDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
