import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAdsService } from '@ztarmobile/zwp-service-backend';
import { CUSTOMER_CARE_NUMBER, ENDPOINT_URL } from 'src/environments/environment';
import { MetaService } from '../../services/meta-service.service';
import { ACTIVATION_ROUTE_URLS, SUPPORT_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../app.routes.names';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { ContentfulService } from '../../services/contentful.service';
import { AppState } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public jsonLDString: any;
  public innerWidth: any;
  public zipCode = '';
  public processingRequest = false;
  public homePage;
  public customHtml;
  public isLoggedIn: boolean;
  public ROUTE_URLS = ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ACTIVATION_ROUTE_URLS = ACTIVATION_ROUTE_URLS;
  public isBannersSlidesReady = false;
  public page: any;
  private alive = true;

   constructor(private router: Router,
               private firebaseAdsService: FirebaseAdsService,
               private metaService: MetaService,
               private simpleAuthService: SimpleAuthService,
               private contentful: ContentfulService,
               private appState: AppState) {

    this.prepareSchemaData();
    this.metaService.createCanonicalUrl(ENDPOINT_URL);
    }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.homePage = this.contentful.getContent('homePage');
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public goToPlans(expand20?: boolean): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

  public goToplanDetails(id): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }

  private prepareSchemaData(): void {
    const structuredData = {
      '@type': 'Organization',
      '@id': `${ENDPOINT_URL}/#organization`,
      name: 'GoodMobile',
      url: ENDPOINT_URL,
      logo: `${ENDPOINT_URL}/assets/img/logo.svg`,
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: CUSTOMER_CARE_NUMBER,
        contactType: 'Customer Care',
        areaServed: 'US'
      }],
      sameAs: ['https://facebook.com/goodmobileusa', 'https://twitter.com/goodmobileusa', 'https://instagram.com/goodmobileusa']
    };
    this.jsonLDString = this.appState.setJsonLdData(structuredData);
  }
}
