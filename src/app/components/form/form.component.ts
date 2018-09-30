import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input() showSpinner = false;
  @Output() onSubmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() onReset: EventEmitter<null> = new EventEmitter<null>();

  username: string = '';

  constructor() { }

  ngOnInit() {
  }

  submit() {
    this.onSubmit.emit(this.username);
  }

  reset() {
    this.onReset.emit();
  }
}
