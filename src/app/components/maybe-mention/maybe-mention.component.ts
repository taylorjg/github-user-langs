import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'maybe-mention',
  templateUrl: './maybe-mention.component.html',
  styleUrls: ['./maybe-mention.component.css']
})
export class MaybeMentionComponent implements OnInit {

  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }
}
