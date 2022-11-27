import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ios-cdma',
  templateUrl: './cdma.component.html',
  styleUrls: ['./cdma.component.scss']
})
export class IosCdmaComponent {
  @Output() backToMain: EventEmitter<boolean> = new EventEmitter();

  public done(): void {
    this.backToMain.emit(true);
  }
}
