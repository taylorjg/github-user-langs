import { Component, OnInit } from '@angular/core';
import { GithubService } from './services/github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    GithubService
  ]
})
export class AppComponent implements OnInit {

  title = 'github-user-langs';

  constructor(private gh: GithubService) { }

  ngOnInit() {
    this.gh.getUserLangs('fluffy322').subscribe(
      data => {
        console.log(JSON.stringify(data, null, 2))
      },
      error => {
        console.log(`ERROR: ${JSON.stringify(error, null, 2)}`)
      })
  }
}
