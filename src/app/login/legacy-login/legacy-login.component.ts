import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthHelperService, UserAuthService } from '@ztarmobile/zwp-services-auth';
import { FirebaseMobilePlansCartService, FirebaseUserProfileService, IUser, IUserPlan, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { RouterHelperService } from '@ztarmobile/zwp-services-util';
import { CustomValidators } from 'ng4-validators';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PASSWORD_PATTERN } from 'src/app/app.config';
import { ACCOUNT_ROUTE_URLS, LOGIN_ROUTE_URLS } from 'src/app/app.routes.names';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';

@Component({
  selector: 'app-legacy-login',
  templateUrl: './legacy-login.component.html',
  styleUrls: ['./legacy-login.component.scss']
})
export class LegacyLoginComponent implements OnInit, OnDestroy {
  public SITE_ID: string = CAPTCHA_SITE_ID;
  public userForm: FormGroup;
  public user: IUser = {} as IUser;
  public password = '';
  public confirmPassword = '';
  public processingRequest = false;
  public captchaValid = false;
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;
  private userCart: IUserPlan;
  private captchaResponse: string;
  private nextPage: string;
  private params: any;
  private userProfileObserver: Subscription;
  private routerSubscription: Subscription;

  constructor(private userAuthService: UserAuthService,
              private formBuilder: FormBuilder,
              private router: RouterHelperService,
              private route: ActivatedRoute,
              private toastHelper: ToastrHelperService,
              private firebaseMobilePlansCartService: FirebaseMobilePlansCartService,
              private userAccountService: UserAccountService,
              private metaService: MetaService,
              private angularAuthService: AngularFireAuth,
              private userPlansService: UserPlansService,
              private userProfileService: FirebaseUserProfileService) {

    this.routerSubscription = this.route.params
      .subscribe((params: Params) => {
        if (params && params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE]) {
          this.nextPage = params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE];
        }
      });

    this.firebaseMobilePlansCartService.userCart.pipe(take(1)).subscribe((cart) => this.userCart = cart);

    this.userForm = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(PASSWORD_PATTERN)])],
      confirmPassword: ['', Validators.required],
    }, {validator: this.matchingPasswords('password', 'confirmPassword')});
    this.metaService.createCanonicalUrl();
  }

  ngOnInit(): void {
    this.userProfileObserver = this.userProfileService.userProfileObservable.subscribe((user) => {
      if (!!user && !!user.email) {
        if (!!this.userProfileObserver) {
          this.userProfileObserver.unsubscribe();
        }

        if (!!this.nextPage) {
          this.handleNextPageParams();
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
    this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.LOGIN}`]);
  }

  public signUp(): void {
    if (this.captchaValid) {
      this.processingRequest = true;
      this.user.firstName = this.userForm.get('firstName').value;
      this.user.lastName = this.userForm.get('lastName').value;
      this.user.email = this.userForm.get('email').value;
      this.password = this.userForm.get('password').value;
      this.userAuthService.signUpWithBff(this.captchaResponse, this.user, this.password).then((user) => {
        if (!!this.userCart && !!this.userCart.mdn) {
          this.userPlansService.addUserPlanMDN(user.id, this.userCart.mdn).then((userPlanId) => this.userPlansService.selectUserPlan(userPlanId));
        } else {
          if (!!this.userCart) {
            this.handleNextPageParams();
          } else {
            this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`], true);
          }
        }
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
  }

  private matchingPasswords(passwordKey: string, confirmPasswordKey: string): any {
    return (group: FormGroup): { [key: string]: any } => {
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
        this.angularAuthService.signInAnonymously().then(() => {
          this.firebaseMobilePlansCartService.updateUserCart(this.userCart).then(() => resolve(), (error) => reject(error));
        });
      });
    });
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
      this.router.navigate([this.nextPage, this.params], true);
    }
  }

}
