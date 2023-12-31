import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthHelperService, UserAuthService } from '@ztarmobile/zwp-services-auth';
import { ActionsAnalyticsService, FirebaseMobilePlansCartService, FirebaseUserProfileService, IUser, IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { RouterHelperService } from '@ztarmobile/zwp-services-util';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EMAIL_PATTERN, NAME_PATTERN, PASSWORD_PATTERN } from 'src/app/app.config';
import { ACTIVATION_ROUTE_URLS, LOGIN_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;

  public SITE_ID: string = CAPTCHA_SITE_ID;
  public userForm: UntypedFormGroup;
  public user: IUser = {} as IUser;
  public password = '';
  public confirmPassword = '';
  public processingRequest = false;
  public captchaValid = false;
  public showRecaptchaError = false;
  private userCart: IUserPlan;
  private captchaResponse: string;
  private params: any;
  private nextPage: string;
  private userProfileObserver: Subscription;
  private routerSubscription: Subscription;
  private referredCode: string;

  constructor(private userAuthService: UserAuthService, private formBuilder: FormBuilder, public router: RouterHelperService,
              private route: ActivatedRoute, private analyticsService: ActionsAnalyticsService,
              private toastHelper: ToastrHelperService, private metaService: MetaService, private angularFireService: AngularFireAuth,
              private firebaseMobilePlansCartService: FirebaseMobilePlansCartService, private userPlansService: UserPlansService,
              private appState: AppState, private userProfileService: FirebaseUserProfileService) {
    this.routerSubscription = this.route.params.subscribe((params: Params) => {
      if (!!params) {
        this.params = params;
        if (params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE]) {
          this.nextPage = params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE];
        }
      }
    });
    this.referredCode = sessionStorage.getItem('referralCode');

    // this.firebaseMobilePlansCartService.userCart.pipe(take(1)).subscribe((cart) => this.userCart = cart);

    this.userForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(NAME_PATTERN)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(NAME_PATTERN)])],
      email: ['', Validators.compose([Validators.required,Validators.pattern(EMAIL_PATTERN)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6),
        Validators.maxLength(12), Validators.pattern(PASSWORD_PATTERN)])],
      confirmPassword: ['', Validators.required],
    }, {validator: this.matchingPasswords('password', 'confirmPassword')});
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.firebaseMobilePlansCartService.userCart.pipe(take(1)).subscribe((cart) => this.userCart = cart);
    this.userProfileObserver = this.userProfileService.userProfileObservable.subscribe((user) => {
      if (!!user && !!user.email) {
        if (!!this.userProfileObserver) {
          this.userProfileObserver.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (!!this.userProfileObserver) {
      this.userProfileObserver.unsubscribe();
    }
    if (!!this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  public goToLogin(): void {
    if (!!this.params) {
      const params = {};
      params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE] = this.nextPage;
      this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.LOGIN}`, this.params]);
    } else {
      this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.LOGIN}`]);
    }
  }

  public signUp(): void {
    this.userForm.markAllAsTouched();
    this.showRecaptchaError = !!this.captchaResponse ? false : true;
    if (this.captchaValid && !!this.userForm.valid) {
      this.processingRequest = true;
      this.user.firstName = this.userForm.get('firstName').value;
      this.user.lastName = this.userForm.get('lastName').value;
      this.user.email = this.userForm.get('email').value;
      this.password = this.userForm.get('password').value;
      this.user.password = this.userForm.get('password').value;
      this.user.referredWithCode = this.referredCode;
      this.userAuthService.signUpWithBff(this.captchaResponse, this.user, this.password).then((user) => {
        setTimeout(() => {
          this.angularFireService.signOut().then(() => {
            this.angularFireService.signInWithEmailAndPassword(user.email, user.password).then((userCred) => {
              this.processingRequest = false;
              this.appState.userLoggedIn.next(true);
              this.analyticsService.trackUserAuthentication('signup', userCred.user.uid, 'Create account');
              this.analyticsService.trackUserId(userCred.user.uid);
              this.analyticsService.sendUserIdToHotjar(userCred.user.uid);
              const utms = JSON.parse(sessionStorage.getItem('utms'));
              if (!!utms) {
                setTimeout(() => {
                  this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((data) => {
                    if (!!data) {
                      const marketingDetails = this.appState.setMarketingObject(utms);
                      data.activeCampaign = marketingDetails;
                      data.campaignsHistory = [];
                      data.campaignsHistory.push(marketingDetails)
                      this.userProfileService.updateUserProfile(data);
                    }
                  });
                }, 2000);
              }
              if (!!this.userCart && !!this.userCart.mdn) {
                this.userPlansService.bffAddUserPlanMDN(this.userCart.mdn).then((userPlanId) =>
                 this.userPlansService.selectUserPlan(userPlanId));
              } else {
                this.handleNextPageParams();
              }
            }, (error) => {
              this.toastHelper.showAlert(error.message);
            });
          });
        }, 1000);
      }, (error) => {
        this.processingRequest = false;
        const errorMessageAsJson = AuthHelperService.getErrorMessage(error);
        if (errorMessageAsJson.code === 'auth/requires-recent-login') {
          this.moveCartFromAnonymousToNewAnonymous().then(() => {
            this.toastHelper.showAlert('Something went wrong, please try again');
          });
        } else {
          this.toastHelper.showAlert(errorMessageAsJson.message || 'Sign Up failed');
        }
        this.reCaptcha.resetReCaptcha();
      });
    }
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    this.showRecaptchaError = false;
  }

  private matchingPasswords(passwordKey: string, confirmPasswordKey: string): any {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  private moveCartFromAnonymousToNewAnonymous(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firebaseMobilePlansCartService.clearUserCart().then(() => {
        this.userAuthService.loginAnonymous(true).then(() => {
          this.firebaseMobilePlansCartService.updateUserCart(this.userCart).then(() => resolve(), (error) => reject(error));
        });
      });
    });
  }

  private handleNextPageParams(): void {
    if (!!this.nextPage) {
      // takes the params from the url before auth and set it to the next page params
      if (!!this.nextPage.includes(';')) {
        const nextPageUrl = this.nextPage.split(';');
        this.nextPage = nextPageUrl[0];
        nextPageUrl.forEach((urlSegment) => {
          const paramsList = urlSegment.split('=');
          if (paramsList.length > 1) {
            this.params[paramsList[0]] = paramsList[1];
          }
        });
      }
      if (this.nextPage === `${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_PLANS_PATH}`) {
        this.nextPage = SHOP_ROUTE_URLS.BASE + '/' + SHOP_ROUTE_URLS.PLANS_AND_FEATURES + '/' + PLANS_SHOP_ROUTE_URLS.NEW_PLAN;
      }
      this.router.navigate([this.nextPage, this.params], true);
    } else {
      this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.WELCOME}`]);
    }
  }
}
