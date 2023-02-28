import { Component, EventEmitter, Output } from '@angular/core';
import { ACCOUNT_ROUTE_URLS,} from '../../../../app.routes.names';

@Component({
  selector: 'app-android-gsm',
  templateUrl: './gsm.component.html',
  styleUrls: ['./gsm.component.scss']
})
export class AndroidGsmComponent {
  @Output() backToMain: EventEmitter<boolean> = new EventEmitter();
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  constructor() { }
}
