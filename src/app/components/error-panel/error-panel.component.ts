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

  showHttpError(error, baseMessage) {
    this.errorMessage = error && error.status && error.statusText
      ? `${baseMessage} (${error.status} ${error.statusText}).`
      : `${baseMessage}.`
    this.show = true;
  }
}
