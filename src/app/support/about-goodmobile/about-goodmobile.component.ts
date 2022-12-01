import { Component, OnInit, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';
import { ContentfulService } from 'src/services/contentful.service';

@Component({
  selector: 'app-about-goodmobile',
  templateUrl: './about-goodmobile.component.html',
  styleUrls: ['./about-goodmobile.component.scss']
})
export class AboutGoodMobileComponent implements OnInit {
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public page: any;
  public innerWidth: any;
  public aboutGoodmobile: any;
  public readMore = false;

  constructor(private router: Router, private metaService: MetaService,
              private contentful: ContentfulService) {
  }

ngOnInit(): void {
  this.metaService.createCanonicalUrl();
  this.innerWidth = window.innerWidth;
  this.aboutGoodmobile = this.contentful.getContent('aboutGood2go');
}

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}
