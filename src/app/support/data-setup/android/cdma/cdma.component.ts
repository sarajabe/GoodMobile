import { Component, EventEmitter, Output } from '@angular/core';
import { ACCOUNT_ROUTE_URLS } from '../../../../app.routes.names';

@Component({
  selector: 'app-android-cdma',
  templateUrl: './cdma.component.html',
  styleUrls: ['./cdma.component.scss']
})
export class AndroidCdmaComponent  {
  @Output() backToMain: EventEmitter<boolean> = new EventEmitter();
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;

  public done(): void {
    this.backToMain.emit(true);
  }

}
