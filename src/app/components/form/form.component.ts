import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<string>();
  @Output() onReset = new EventEmitter<null>();

  username = '';
  queryInProgress = false;

  constructor() { }

  ngOnInit() {
  }

  submit() {
    this.onSubmit.emit(this.username);
  }

  reset() {
    this.onReset.emit();
  }

  queryStarted() {
    this.queryInProgress = true;
  }

  queryFinished() {
    this.queryInProgress = false;
  }
}
