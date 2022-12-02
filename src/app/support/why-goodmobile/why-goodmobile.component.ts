import { Component, OnInit, HostListener } from '@angular/core';
import { PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../../app.routes.names';
import { MetaService } from '../../../services/meta-service.service';
import { ContentfulService } from '../../../services/contentful.service';

@Component({
  selector: 'app-why-goodmobile',
  templateUrl: './why-goodmobile.component.html',
  styleUrls: ['./why-goodmobile.component.scss']
})
export class WhyGoodMobileComponent implements OnInit {
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public whyGoodmobile;
  public page: any;
  public innerWidth: any;
  public images: Array<string>;
  constructor(private metaService: MetaService,
              private contentful: ContentfulService) {
    this.images = ['/assets/img/banners/bring-phone.svg', '/assets/img/banners/nationwide-coverage.svg', 
    '/assets/img/banners/high-speed.svg', '/assets/img/banners/save-money.svg'];
  }
  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.innerWidth = window.innerWidth;
    this.whyGoodmobile = this.contentful.getContent('whyGood2go');
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}
