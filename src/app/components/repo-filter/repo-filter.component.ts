import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'repo-filter',
  templateUrl: './repo-filter.component.html',
  styleUrls: ['./repo-filter.component.css']
})
export class RepoFilterComponent implements OnInit {

  @Input() repoCount = 0;
  @Output() onFilterChanged = new EventEmitter<null>();

  includeForkedRepos = false;
  includeNonOwnedRepos = false;

  constructor() { }

  ngOnInit() {
  }

  change() {
    this.onFilterChanged.emit();
  }
}
