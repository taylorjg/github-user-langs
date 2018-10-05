import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { GithubService } from './github.service';

describe('GithubService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: GithubService = TestBed.get(GithubService);
    expect(service).toBeTruthy();
  });
});
