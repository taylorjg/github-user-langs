import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  @Input() user: any = {};

  constructor() { }

  ngOnInit() {
  }
}
