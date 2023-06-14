import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { ActionsAnalyticsService, FirebaseUserProfileService, IMarketingDetails } from '@ztarmobile/zwp-service-backend';
import { RouterHelperService } from '@ztarmobile/zwp-services-util';
import { Subscription } from 'rxjs';
import { ACCOUNT_ROUTE_URLS, DUPLICATE_PAYMENTS_ROUTE_URLS, LOGIN_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import dataSetup from 'cypress/support/pageObjects/dataSetup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;
  @ViewChild('loginForm', { static: true }) loginForm: NgForm;

  public SITE_ID: string = CAPTCHA_SITE_ID;
  public email = '';
  public password = '';
  public processingRequest = false;
  public nextPage: string;
  public rememberPassword = false;
  public oobCode: string;
  public mode: string;
  // eslint-disable-next-line max-len
  public emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  private loggedIn = false;
  private routerObserver: Subscription;
  private authObserver: Subscription;
  private params: any;

  constructor(private simpleAuthService: SimpleAuthService, private userProfileService: FirebaseUserProfileService,
    private appState: AppState, private metaService: MetaService, public router: RouterHelperService,
    private route: ActivatedRoute, private analyticsService: ActionsAnalyticsService,
    private toastHelper: ToastrHelperService, private angularAuthService: AngularFireAuth) {

    this.routerObserver = this.route.params.subscribe((params: Params) => {
      if (!!params) {
        this.params = params;
        if (params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE]) {
          this.nextPage = params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE];
        }
      }
    });
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (queryParams && queryParams[LOGIN_ROUTE_URLS.PARAMS.OOB_CODE]) {
        this.params = queryParams;
        this.oobCode = queryParams[LOGIN_ROUTE_URLS.PARAMS.OOB_CODE];
        this.mode = queryParams[LOGIN_ROUTE_URLS.PARAMS.MODE];
        if (this.mode === 'resetPassword') {
          this.verifyCode();
        }
        if (this.mode === 'verifyEmail') {
          this.router.navigate([LOGIN_ROUTE_URLS.BASE + '/' + LOGIN_ROUTE_URLS.LOGIN]);
          this.toastHelper.showSuccess('Your email has been verified. You can login now to your account');
        }
      }
    });

  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.simpleAuthService.userState.subscribe((authState) => {
      this.loggedIn = !!authState && !authState.isAnonymous;
    });
    this.authObserver = this.simpleAuthService.userState.subscribe((user) => {
      if (!!user && !user.isAnonymous) {
        if (!!this.authObserver) {
          this.authObserver.unsubscribe();
        }

        if (!!this.nextPage) {
          this.handleNextPageParams();
          console.info('5555555555555555')
        } else {
          setTimeout(() => {
            this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((data) => {
              console.info('*****************', data)
              if (!!data && data?.ebbId) {
                this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`], true);
              } else {
                console.info('------------------------')
                this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`], true);
              }
            });
          }, 200);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (!!this.authObserver) {
      this.authObserver.unsubscribe();
    }
    if (!!this.routerObserver) {
      this.routerObserver.unsubscribe();
    }
  }

  public verifyCode(): void {
    const params = {};
    params[LOGIN_ROUTE_URLS.PARAMS.OOB_CODE] = this.oobCode;
    this.angularAuthService.verifyPasswordResetCode(this.oobCode).then((response) => {
      this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.RESET_PASSWORD}`, params]);
    });
  }

  public login(): void {
    this.processingRequest = true;
    this.angularAuthService.signOut().then(() => {
      this.angularAuthService.signInWithEmailAndPassword(this.email, this.password).then((userCred) => {
        this.appState.userLoggedIn.next(true);
        this.processingRequest = false;
        const user = userCred.user;
        this.analyticsService.trackUserAuthentication('login', user.uid, 'Login');
        this.analyticsService.trackUserId(user.uid);
        this.analyticsService.sendUserIdToHotjar(user.uid);
        const referredCode = sessionStorage.getItem('referralCode');
        const utms = JSON.parse(sessionStorage.getItem('utms'));
        if (!!referredCode || !!utms) {
          setTimeout(() => {
            this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((data) => {
              if (!!data) {
                data.referredWithCode = !!referredCode ? referredCode : '';
                if (!!utms) {
                  const marketingDetails = this.appState.setMarketingObject(utms);
                  const savedActiveCampaign = !!data.activeCampaign ? data.activeCampaign : {} as IMarketingDetails;
                  if (marketingDetails.utm_campaign !== savedActiveCampaign.utm_campaign || marketingDetails.utm_medium !== savedActiveCampaign.utm_medium
                    || marketingDetails.utm_source !== savedActiveCampaign.utm_source) { // this is to make sure not to add the same campaign to the history each time the user logout and login within the same session
                    data.activeCampaign = marketingDetails;
                    if (!!data.campaignsHistory) {
                      data.campaignsHistory.push(marketingDetails)
                    } else {
                      data.campaignsHistory = [];
                      data.campaignsHistory.push(marketingDetails)
                    }
                    this.userProfileService.updateUserProfile(data);
                  }
                }
              }
            });
          }, 2000);
        }
      }).catch((error) => {
        this.processingRequest = false;
        if (error.message.includes('wrong-password')) {
          this.toastHelper.showAlert('The password is invalid or the user does not have a password.');
        } else if (error.message.includes('user-not-found')) {
          this.toastHelper.showAlert('There is no user record corresponding to this identifier. The user may have been deleted.');
        } else if (error.message.includes('too-many-requests')) {
          this.toastHelper.showAlert('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.');
        } else {
          this.toastHelper.showAlert(error.message);
        }
      });
    }).catch((error) => {
      this.processingRequest = false;
      this.toastHelper.showAlert(error.message);
    });
  }



  public goToSignUp(): void {
    if (!!this.params) {
      this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.SIGN_UP}`, this.params]);
    } else {
      this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.SIGN_UP}`]);
    }
  }

  public goToForgotPassword(): void {
    const params = [];
    if (!!this.email) {
      params[LOGIN_ROUTE_URLS.PARAMS.EMAIL] = this.email;
    }
    this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.FORGOT_PASSWORD}`, params]);
  }

  private handleNextPageParams(): void {
    if (this.nextPage.includes(';')) {
      // takes the params from the url before auth and set it to the next page params
      const nextPageUrl = this.nextPage.split(';');
      this.nextPage = nextPageUrl[0];
      this.params = {};
      nextPageUrl.forEach((urlSegment) => {
        const paramsList = urlSegment.split('=');
        if (paramsList.length > 1) {
          this.params[paramsList[0]] = paramsList[1];
        }
      });
      this.router.navigate([this.nextPage, this.params], true);
    } else {
      this.router.navigate([this.nextPage], true);
    }
  }

}
