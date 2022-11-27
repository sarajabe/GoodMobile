import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ReCaptchaComponent } from '../../../widgets/re-captcha/re-captcha.component';
import { CAPTCHA_SITE_ID } from '../../../environments/environment';
import { ACCOUNT_ROUTE_URLS, ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../../app.routes.names';
import { IUserPlan, UserPlansService, UserDeviceService } from '@ztarmobile/zwp-service-backend';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastrHelperService } from '../../../services/toast-helper.service';
import { MetaService } from '../../../services/meta-service.service';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-data-setup',
  templateUrl: './data-setup.component.html',
  styleUrls: ['./data-setup.component.scss']
})
export class DataSetupComponent implements OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;
  public SITE_ID: string = CAPTCHA_SITE_ID;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public compatibilityForm: FormGroup;
  public userPlan: IUserPlan;
  public deviceName: string;
  public os: string;
  public networkType: string;
  public mdn: string;
  public equipment: string;
  public iccid: string;
  public iccidRequired = false;
  public processingRequest = false;
  public processingRequestIos = false;
  public userPlanId: string;
  public invalidIMEI = false;
  public compatibilityChecked = false;
  public isAtt = false;
  public isTmo = false;
  public isLoggedIn = false;
  public captchaValid = false;
  public isIos = false;
  private captchaResponse: string;
  private alive = true;
  private userPlanID: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private metaService: MetaService,
    private toastHelper: ToastrHelperService,
    private simpleAuthService: SimpleAuthService,
    private userDeviceService: UserDeviceService,
    private userPlansService: UserPlansService) {
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((authState) => this.isLoggedIn = !!authState && !authState.isAnonymous);
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
        this.os = params[ROUTE_URLS.PARAMS.PHONE_OS] || 'ios';
        this.userPlanID = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
        this.userPlansService.getUserPlan(this.userPlanID).then((userPlan) => this.userPlanSelected(userPlan));
      }
      if (!!params && params[ROUTE_URLS.PARAMS.PHONE_NUMBER]) {
        this.mdn = params[ROUTE_URLS.PARAMS.PHONE_NUMBER];
      }
      if (!!params && params[ROUTE_URLS.PARAMS.PHONE_OS] && !!params[ROUTE_URLS.PARAMS.NETWORK]) {
        this.os = params[ROUTE_URLS.PARAMS.PHONE_OS];
        this.networkType = params[ROUTE_URLS.PARAMS.NETWORK];
        if (this.os === 'ios') {
          this.isIos = true;
        }
        if (this.networkType === 'att') {
          this.isAtt = true;
        } else if (this.networkType === 'tmo') {
          this.isTmo = true;
        }
        this.compatibilityChecked = true;
      }
    });
    this.compatibilityForm = formBuilder.group({
      mdn: ['', Validators.required]
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan && !!userPlan.planDevice) {
      this.userPlan = userPlan;
      this.userPlanID = userPlan.id;
      this.deviceName = userPlan.planDevice.marketingName || userPlan.planDevice.brand;
      this.networkType = userPlan.planDevice.networkType.toLowerCase();

      if (!this.route.firstChild) {
        this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.DATA_SETUP}`]);
      }
    }
  }

  public checkPhoneCompatibility(): void {
    if (this.os === 'ios') {
      this.processingRequestIos = true;
    } else {
      this.processingRequest = true;
    }
    this.userDeviceService
      .checkDeviceNetworkByMdn(this.mdn)
      .then((result) => {
        this.processingRequest = false;
        this.processingRequestIos = false;
        if (!!result) {
          this.compatibilityChecked = true;
          if (result.network.toLowerCase() === 'att') {
            if (this.os === 'ios') {
              this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.IPHONE}`]);
            } else {
              this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.ANDROID}`]);
            }
          }
          else  {
            this.isTmo = true;
            if (this.os === 'ios') {
              this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TMO_IPHONE}`]);
            } else {
              this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TMO_Android}`]);
            }
          }
        } else {
          this.processingRequest = false;
          this.processingRequestIos = false;
          this.toastHelper.showWarning('Device not supported! Please try again later')
        }
      }, (error) => this.notCompatibleDevice(error));
  }

  public reset($event): void {
    this.compatibilityChecked = false;
    this.mdn = '';
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }

  private notCompatibleDevice(response: any): void {
    this.compatibilityForm.markAllAsTouched();
    const errorMessage = response.message || response;
    console.warn('Device not supported', errorMessage);
    this.toastHelper.showWarning(errorMessage);
    if (!this.userPlanId) {
      this.userDeviceService.setCompatibleDevice(null);
    }
    this.processingRequest = false;
    this.processingRequestIos = false;
  }
}
