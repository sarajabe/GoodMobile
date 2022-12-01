import { Component, OnInit } from '@angular/core';
import { SHOP_ROUTE_URLS, ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, ROUTE_URLS, PHONES_SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { MetaService } from '../../../services/meta-service.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent {
  public ROUTE_URLS = ROUTE_URLS;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ACTIVATION_ROUTE_URLS = ACTIVATION_ROUTE_URLS;
  public PHONES_SHOP_ROUTE_URLS = PHONES_SHOP_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  constructor(private metaService: MetaService) {
    this.metaService.createCanonicalUrl();
  }

}
