import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {

  constructor(private http: HttpClient) { }

  getUserLangs(username: String) {
    return this.http.get(`/api/userLangs/${username}`);
  }
}
