import { Component, HostListener, OnInit } from '@angular/core';
import { BUILD_VERSION, ENV_FIREBASE_CONFIG } from '../../environments/environment';
import { ContentfulService } from '../../services/contentful.service';
import { SUPPORT_ROUTE_URLS, SHOP_ROUTE_URLS, ACCOUNT_ROUTE_URLS, ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app/app.routes.names';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { IUser } from '@ztarmobile/zwp-service-backend';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-footer-main-navbar',
  templateUrl: 'footer-main-navbar.component.html',
  styleUrls: ['./footer-main-navbar.component.scss']
})
export class FooterMainNavbarComponent implements OnInit {
  public autoExpandSubmenus = true;
  public BUILD_VERSION = BUILD_VERSION;
  public BUILD_DATE = new Date();
  public FIREBASE_CONF = ENV_FIREBASE_CONFIG;
  public ROUTE_URLS = ROUTE_URLS;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public showAccount: boolean;
  public showShop: boolean;
  public showSupport: boolean;
  public showAbout: boolean;
  public innerWidth: any;
  public isLoggedIn = false;
  public userProfile: IUser;
  public displayAcpSection = false;
  private MOBILE_SCREEN_WIDTH = 1000;

  constructor(
    private contentful: ContentfulService,
    private simpleAuthService: SimpleAuthService,
    private appState: AppState) {
    // temp fix until i get the styles to flip the auto expanded flag based on resolution.
    if (window.screen.width <= this.MOBILE_SCREEN_WIDTH) {
      this.autoExpandSubmenus = false;
    }
  }
  ngOnInit(): void {
    this.simpleAuthService.userState.subscribe((authState) => {
      this.isLoggedIn = !!authState && !authState.isAnonymous;
    });
    this.appState.displayAcpSectionObs.subscribe(res => {
      this.displayAcpSection = res;
    });
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}
