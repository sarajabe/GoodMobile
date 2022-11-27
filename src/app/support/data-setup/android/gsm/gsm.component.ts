import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS, ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../../../../app.routes.names';

@Component({
  selector: 'app-android-gsm',
  templateUrl: './gsm.component.html',
  styleUrls: ['./gsm.component.scss']
})
export class AndroidGsmComponent {
  @Output() backToMain: EventEmitter<boolean> = new EventEmitter();
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  constructor(private router: Router) { }
  public fourthGen(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.ANDROID4G}`]);
  }
  public fifthGen(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.ANDROID5G}`]);
  }
}
