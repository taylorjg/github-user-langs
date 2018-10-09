import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input() queryInProgress = false;
  @Output() onSubmit = new EventEmitter<string>();
  @Output() onReset = new EventEmitter<null>();
  @ViewChild('usernameField') usernameField: ElementRef;

  username = '';

  constructor() { }

  ngOnInit() {
  }

  submit() {
    this.onSubmit.emit(this.username);
  }

  reset() {
    this.username = '';
    this.usernameField.nativeElement.focus();
    this.onReset.emit();
  }
}
