import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent implements OnInit {

  @Input() langs
  
  constructor() { }

  ngOnInit() {
  }
}
