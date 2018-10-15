import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { GitHubService } from './github.service';

describe('GitHubService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: GitHubService = TestBed.get(GitHubService);
    expect(service).toBeTruthy();
  });
});
