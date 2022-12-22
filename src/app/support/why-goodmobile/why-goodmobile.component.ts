import { Component, OnInit } from '@angular/core';
import { PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../../app.routes.names';
import { MetaService } from '../../../services/meta-service.service';

@Component({
  selector: 'app-why-goodmobile',
  templateUrl: './why-goodmobile.component.html',
  styleUrls: ['./why-goodmobile.component.scss']
})
export class WhyGoodMobileComponent implements OnInit {
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;

  constructor(private metaService: MetaService) { }
  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
  }
}
