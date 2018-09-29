import { Component } from '@angular/core';
import { GithubService } from './services/github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    GithubService
  ]
})
export class AppComponent {

  constructor(private gh: GithubService) { }

  onSubmit(username: string) {
    console.log(`[onSubmit] username: ${username}`)
    this.gh.getUserLangs(username).subscribe(
      data => {
        console.log(JSON.stringify(data, null, 2))
      },
      error => {
        console.log(`ERROR: ${JSON.stringify(error, null, 2)}`)
      })
  }

  onReset() {
    console.log('[onReset]')
  }
}
