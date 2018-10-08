import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { FormComponent } from './components/form/form.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { RepoFilterComponent } from './components/repo-filter/repo-filter.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';
import { MaybeMentionComponent } from './components/maybe-mention/maybe-mention.component';
import { MailtoPipe } from './pipes/mailto.pipe';
import { GithubService } from './services/github.service';

describe('AppComponent', () => {
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([])
      ],
      declarations: [
        AppComponent,
        FormComponent,
        ResultsTableComponent,
        ErrorPanelComponent,
        RepoFilterComponent,
        UserDetailsComponent,
        MaybeMentionComponent,
        MailtoPipe
      ],
      providers: [
        GithubService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
