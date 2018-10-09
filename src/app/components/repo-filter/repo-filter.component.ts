import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'repo-filter',
  templateUrl: './repo-filter.component.html',
  styleUrls: ['./repo-filter.component.css']
})
export class RepoFilterComponent implements OnInit {

  @Input() repoCount = 0;
  @Input() includeForkedRepos = false;
  @Input() includeNonOwnedRepos = false;
  @Output() onFilterChanged = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  change() {
    const filterValues = {
      includeForkedRepos: this.includeForkedRepos,
      includeNonOwnedRepos: this.includeNonOwnedRepos
    };
    this.onFilterChanged.emit(filterValues);
  }
}
