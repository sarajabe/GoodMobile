import { DOCUMENT, Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { AppHelperService, IPageMeta } from '@ztarmobile/zwp-service';
import { AuthHttp, SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { ActionsAnalyticsService, FirebaseUserProfileService, IMarketingDetails } from '@ztarmobile/zwp-service-backend';
import { filter, take, takeWhile } from 'rxjs/operators';
import { ModalHelperService } from 'src/services/modal-helper.service';
import {
  ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS, ACTIVATION_ROUTE_URLS, CHECKOUT_ROUTE_URLS, DUPLICATE_PAYMENTS_ROUTE_URLS, LOGIN_ROUTE_URLS,
  MIGRATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS
} from './app.routes.names';
import { AppState } from './app.service';
import { ContentfulService } from 'src/services/contentful.service';
import { Meta } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CheckoutService } from './shop/checkout/checkout.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Good Mobile';
  public maintenanceExists = false;
  public alertBannerExists = false;
  public loadMinHeight = true;
  public isMarketingCampaign = false;
  public alertBannerHeight;
  public pageUrl;
  private isBackButton: boolean;
  private isCampaignChecked = false;
  private alive = true;
  private idleTime = 0;
  private idleInterval: any;
  private userActive = false;
  private timeLeft = 300000; // 5 Minutes

  constructor(
    //FIX ME
    @Inject(DOCUMENT) private document: any,
    //END of FIX ME
    public appState: AppState, private location: Location, private appHelper: AppHelperService, private simpleAuthService: SimpleAuthService,
    private actionsAnalyticsService: ActionsAnalyticsService, private router: Router, private modalHelper: ModalHelperService,
    private userProfileService: FirebaseUserProfileService, private authHttp: AuthHttp, private meta: Meta,
    private contentfulService: ContentfulService, private changeDetector: ChangeDetectorRef,
    private angularAuthService: AngularFireAuth, private checkoutService: CheckoutService) {
    //FIX ME
    const domain: string = document.location.href;
    if (domain.indexOf('gm-prod.ztarmobile.io') > -1) {
      window.open('https://www.goodmobile.org/affordable-connectivity-program/application', '_self');
    }
    //END of FIX ME
  }

  ngOnInit(): void {
    this.subscribeRouterEvents();
    this.isIE();
    this.isSamsungBrowser();
    this.authHttp.setLanguage('en');
    this.checkIfMaintenanceExist();
    this.checkUserActivity();
    this.appState.checkInternalEbbApp();
  }

  ngAfterViewInit(): void {

    if (!!this.router.events) {
      this.router.events.pipe(filter((event) => event instanceof RoutesRecognized)
        , takeWhile(() => this.alive))
        .subscribe((event: RoutesRecognized) => {
          const route = this.getLastChildOnTreeOfActivatedRoute(event.state);
          if (route.routeConfig.path.indexOf('campaigns/1912q4001') > -1) {
            this.appState.isCampaign = true;
          }
          else if (
            event.state.url.includes(SUPPORT_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(LOGIN_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(ACCOUNT_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(SHOP_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(PLANS_SHOP_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(CHECKOUT_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(ACTIVATION_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(MIGRATION_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(ACP_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(DUPLICATE_PAYMENTS_ROUTE_URLS.BASE) === true ||
            event.state.url.includes(ACP_ROUTE_URLS.BASE) === true ||
            route.routeConfig.path.indexOf('**') > -1
          ) {
            this.loadMinHeight = false;
          }
          else {
            this.appState.isCampaign = false;
            this.loadMinHeight = true;
          }
          this.checkRouterDataChanges(route);
          this.checkCampaigns(route);
          this.checkUtms(route);
          // this.trackMoneySavingProReferrals(route);
        });
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public isIE(): boolean {
    const match = navigator.userAgent.search(/(?:MSIE|Trident\/.*; rv:)/);
    let isIE = false;
    if (match !== -1) {
      isIE = true;
    }
    return isIE;
  }

  public isSamsungBrowser(): boolean {
    const isSamsungBrowser = (navigator.userAgent.includes('SamsungBrowser') ||
      navigator.userAgent.includes('Samsung Browser')) && parseFloat(navigator.appVersion.substr(0, 3)) <= 4.0;
    return isSamsungBrowser;
  }

  private checkRouterDataChanges(route: ActivatedRouteSnapshot): void {
    const data: IPageMeta = route.data as IPageMeta;
    this.appHelper.setPageTitle(data.title);
    if (!!data.description) {
      this.appHelper.setPageDescription(data.description);
    }
  }

  // workaround since ActivatedRoute is not working.
  private getLastChildOnTreeOfActivatedRoute(snapshot: RouterStateSnapshot): ActivatedRouteSnapshot {
    let parent = snapshot.root;
    while (!!parent.firstChild) {
      parent = parent.firstChild;
    }
    return parent;
  }

  private handleRouterEventChange(event: NavigationEnd): void {
    if (event instanceof NavigationEnd) {
      this.pageUrl = event.url;
      this.appState.globalAlertHeight.subscribe((value) => {
        this.alertBannerHeight = value;
        this.changeDetector.detectChanges();
      });
      this.meta.updateTag({ property: 'og:url', content: window.location.href });
      this.meta.updateTag({ name: 'twitter:url', content: window.location.href });
      this.actionsAnalyticsService.trackPageView(event);
      this.location.subscribe((e) => {
        // this is fired when user click back or forward of browser
        if (e.pop) {
          this.isBackButton = true;
          setTimeout(() => this.isBackButton = false, 500);
        }
      });
      setTimeout(() => {
        if (!this.isBackButton && !this.router.parseUrl(this.router.url).toString().includes('#acpDiscount') && !this.router.parseUrl(this.router.url).toString().includes('#promoPlans')) {
          document.body.scrollTop = 0;
          window.scroll(0, 0);
        }
      }, 200);
    }
  }

  private subscribeRouterEvents(): void {
    if (!!this.router.events) {
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)
        , takeWhile(() => this.alive))
        .subscribe((event: NavigationEnd) => {
          this.handleRouterEventChange(event);
        });
    }
  }

  private checkUtms(route: ActivatedRouteSnapshot): void {
    const queryParams = route.queryParams;
    let utms = JSON.parse(sessionStorage.getItem('utms')); // read already saved utms
    if (!!queryParams && !!queryParams[ROUTE_URLS.PARAMS.UTM_CAMPAIGN]
      && !!queryParams[ROUTE_URLS.PARAMS.UTM_MEDIUM]
      && !!queryParams[ROUTE_URLS.PARAMS.UTM_SOURCE]) {
      this.appState.utmsCampaignParamsReplySubject.next(queryParams);
      this.appState.utmsCampaignReplySubject.next(true);
      this.isMarketingCampaign = true;
      const details: IMarketingDetails = Object.assign({} as IMarketingDetails, queryParams);
      details.url = window.location.href.split('?')[0];
      sessionStorage.setItem('utms', JSON.stringify(details)); // this is to always save the latest utm values
      utms = JSON.parse(sessionStorage.getItem('utms')); // update the saved utms
    }
    if (!!utms) {
      this.appState.utmsCampaignReplySubject.next(true);
      this.isMarketingCampaign = true;
      this.isCampaignChecked = true;
      utms = JSON.parse(sessionStorage.getItem('utms')); // update the saved utms
    }
  }

  private checkCampaigns(route: ActivatedRouteSnapshot): void {
    const queryParams = route.queryParams;
    const status = sessionStorage.getItem('termsAccepted');
    let utms = JSON.parse(sessionStorage.getItem('utms')); // read already saved utms
    if (!!queryParams && !!queryParams[ROUTE_URLS.PARAMS.UTM_CAMPAIGN] && queryParams[ROUTE_URLS.PARAMS.UTM_CAMPAIGN] === 'fsi-demo'
      && !!queryParams[ROUTE_URLS.PARAMS.UTM_MEDIUM] && queryParams[ROUTE_URLS.PARAMS.UTM_MEDIUM] === 'affiliate'
      && !!queryParams[ROUTE_URLS.PARAMS.UTM_SOURCE] && queryParams[ROUTE_URLS.PARAMS.UTM_SOURCE] === 'fsi') {
      this.appState.campaignQueryParamsReplySubject.next(queryParams);
      this.appState.isMarktingCampaignReplySubject.next(true);
      this.isMarketingCampaign = true;
      sessionStorage.setItem('utms', JSON.stringify(queryParams)); // this is to always save the latest utm values
      utms = JSON.parse(sessionStorage.getItem('utms')); // update the saved utms
    }
    if (!!utms && utms.utm_campaign === 'fsi-demo') {
      this.appState.isMarktingCampaignReplySubject.next(true);
      this.isMarketingCampaign = true;
      this.isCampaignChecked = true;
      utms = JSON.parse(sessionStorage.getItem('utms')); // update the saved utms
    }
    // const maxDate = new Date('February 28, 2021 23:59:59 GMT-06:00');
    // const todayDate = new Date();
    // if (todayDate < maxDate) {
    //   if (!status) {
    //     this.appState.campaignQueryParamsReplySubject.next(queryParams);
    //     this.appState.isMarktingCampaignReplySubject.next(true);
    //     sessionStorage.setItem('termsAccepted', 'yes');
    //   } else if (!!status && status === 'yes') {
    //     this.appState.isMarktingCampaignReplySubject.next(true);
    //     this.isCampaignChecked = true;
    //   } else {
    //     this.appState.isMarktingCampaignReplySubject.next(false);
    //     this.isCampaignChecked = true;
    //   }
    // } else {
    //   this.appState.isMarktingCampaignReplySubject.next(false);
    //   this.isCampaignChecked = true;
    // }

  }
  private trackMoneySavingProReferrals(route: ActivatedRouteSnapshot): void {
    const queryParams = route.queryParams;
    if (!!queryParams && !!queryParams[ROUTE_URLS.PARAMS.UTM_SOURCE] &&
      (queryParams[ROUTE_URLS.PARAMS.UTM_SOURCE] === 'moneysavingpro' || queryParams[ROUTE_URLS.PARAMS.UTM_SOURCE] === 'msp')
      && !!queryParams[ROUTE_URLS.PARAMS.UTM_CONTENT]) {
      const isMoneyPro = sessionStorage.getItem('MoneyProReferral');
      if (!isMoneyPro) {
        this.appState.isMoneySavingProReplySubject.next(true);
        sessionStorage.setItem('MoneyProReferral', 'true');
        sessionStorage.setItem('MoneyProContent', queryParams[ROUTE_URLS.PARAMS.UTM_CONTENT]);
      } else if (!!isMoneyPro && isMoneyPro === 'true') {
        this.appState.isMarktingCampaignReplySubject.next(true);
      } else {
        this.appState.isMarktingCampaignReplySubject.next(false);
      }
    }
  }
  private checkIfMaintenanceExist(): void {
    this.contentfulService.getContent('maintenanceModel').subscribe(contents => {
      if (!!contents) {
        const result = contents[0].fields;
        const maxDate = new Date(result.endDisplayDate);
        const displayDate = new Date(result.maintenanceDisplayDate);
        const todayDate = new Date();
        if (todayDate < maxDate && todayDate >= displayDate) {
          this.maintenanceExists = true;
        }
      }

    });
  }
  private checkUserActivity(): void {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        // Set up an interval to check for user activity
        this.idleInterval = setInterval(() => {
          if (this.userActive) {
            this.idleTime = 0;
            this.userActive = false;
          } else {
            this.idleTime += 1;
            if(this.idleTime === (25 * 60) && this.timeLeft > 0) {
              // display a popup if the time remaining with inactivity is 5 min
              this.timeLeft = this.timeLeft - 1000;
              // display the popup if there is no action till 25min
              if (!document.querySelector('body div.cdk-overlay-backdrop-showing')) {
                const customHtml = `<div class="text-content">
              <p class="desc">You have been inactive for a while. For your security, please choose whether to stay <b>signed in</b> or to <b>log out.</b></p>
              <p class="desc last">Otherwise, you will be logged out <b>automatically.</b></p>
            </div>`;
                this.modalHelper.showAlertSecurityModal('Your session is about to end', 'Stay Connected', 'Log out', true, 'timer-alert-modal', customHtml).afterClosed().subscribe((res) => {
                  if (!!res) {
                    //if res is logout 
                    if (res === 'logout') {
                      this.logout();
                    } else {
                      // refresh the token
                      this.refreshToken();
                    }
                  }
                });
              }
            } else if (this.timeLeft === 0) {
              this.logout();
            } else if (this.idleTime >= 30 * 60) {
              // more than 30m then logout the customer
              this.logout();
            }
          }
        }, 1000);
        // Set up event listeners to detect user activity
        window.addEventListener('mousemove', this.onUserActivity.bind(this));
        window.addEventListener('keypress', this.onUserActivity.bind(this));
        // Set up an event listener to detect when the user is leaving the page or closing the tab
        window.addEventListener('unload', () => {
          this.logout();
        });
      }
    });
  }
  private logout(): void {
    this.resetVariables();
    this.appState.clearSessionStorage();
    this.angularAuthService.signOut().then(() => {
      this.appState.userLoggedIn.next(undefined);
      this.checkoutService.setPayments({ card: { address1: '', address2: '', cardCode: '', cardNumber: '', last4: '', id: '', city: '', state: '', country: '', postalCode: '', method: '', name: '', alias: '', fullName: '', brand: '' } });
      this.router.navigate([ROUTE_URLS.HOME]);
    })
  }
  private onUserActivity(): void {
    this.userActive = true;
  }
  private resetVariables(): void {
    clearInterval(this.idleInterval);
    this.idleTime = 0;
    this.userActive = false;
    this.timeLeft = 300000;
  }
  private refreshToken(): void {
    this.resetVariables();
    window.location.reload();
  }
}
