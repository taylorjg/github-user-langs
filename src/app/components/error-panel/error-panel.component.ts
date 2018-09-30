import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'error-panel',
  templateUrl: './error-panel.component.html',
  styleUrls: ['./error-panel.component.css']
})
export class ErrorPanelComponent implements OnInit {

  @Input() show = false;
  @Input() errorMessage = '';

  constructor() { }

  ngOnInit() {
  }

  showError(errorMessage) {
    this.errorMessage = errorMessage;
    this.show = true;
  }

  showHttpError(error, baseMessage) {
    const errorMessage = error && error.status && error.statusText
      ? `${baseMessage} (${error.status} ${error.statusText}).`
      : `${baseMessage}.`
    this.showError(errorMessage);
  }

  close() {
    this.show = false;
  }
}
