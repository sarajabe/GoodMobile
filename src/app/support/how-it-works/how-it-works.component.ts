import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MetaService } from '../../../services/meta-service.service';
import { ACTIVATION_ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS, ACCOUNT_ROUTE_URLS, PHONES_SHOP_ROUTE_URLS } from '../../app.routes.names';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {
  public ACTIVATION_ROUTE_URLS = ACTIVATION_ROUTE_URLS;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public PHONES_SHOP_ROUTE_URLS = PHONES_SHOP_ROUTE_URLS;
  constructor(private router: Router, private metaService: MetaService) {
    this.metaService.createCanonicalUrl();
  }
  public goToAddons(type?: string): void {
    const params = {};
    if (!!type) {
      params[ACCOUNT_ROUTE_URLS.PARAMS.INTERNATIONAL_CALLING] = true;
    }
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`, params]);
  }
}
