import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { ActionsAnalyticsService, IActivateUserAccount, IUserPlan, IVoucherData, PortInStatusEnum, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-activate-new-number',
  templateUrl: './activate-new-number.component.html',
})
export class ActivateNewNumberComponent implements OnInit, OnChanges {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;
  @ViewChild('activateSimForm') activateSimForm: NgForm;
  @Input()
  public userPlan: IUserPlan;
  @Input()
  public code: string;
  public user: IUser;
  public voucherData: IVoucherData;
  public activationCode: string;
  public iccid: string;
  public postalCode: string;
  public pinCode: string;
  public pinCodeConfirm: string;
  public carrier: string;
  public PIN_VALIDATE = {
    EMPTY: 0,
    VALID: 1,
    INVALID: 2
  };
  public invalidPostalCode = false;
  public processingRequest = false;
  public showActivationCode = true;
  public showIccid = false;
  public firstCheck = true;
  public SITE_ID = CAPTCHA_SITE_ID;
  public captchaValid = false;
  public captchaResponse: string;
  public captchaRequired = false;
  public codePattern = new RegExp('^[A-Z]+\\d{6}|\\d{7}$');
  private alive = true;

  constructor(public router: Router,
              private toastHelper: ToastrHelperService,
              private userAccountService: UserAccountService,
              private userPlansService: UserPlansService,
              private metaService: MetaService,
              private modalHelper: ModalHelperService,
              private analyticsService: ActionsAnalyticsService) {
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    console.info('code input ', this.code)
    if (!!this.code) {
      this.activationCode = this.code;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.userPlan) {
      const newUserPlanValue: IUserPlan = changes.userPlan.currentValue;
      if (!!newUserPlanValue) {
        this.userPlanSelected(newUserPlanValue);
      }
    }
  }
  public showActivationModal(): void {
    this.modalHelper.showInformationMessageModal('Where to find your Activation Code', '', 'Got it!', null, true, 'activation-info-modal',
      `<div class="text-content-holder">
        <p class="text">Your Activation Code is on the back of your SIM card, you can find it on the bottom of the card. It is a 7 digit number.</p>
     </div>
     <div class="image-container">
      <img class="activation-image" src="assets/img/simActivation.png"/>
     </div>`
    );
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    this.captchaRequired = !!captchaResponse ? false : true;
  }

  public validatePin(): number {
    if (!!this.pinCode && this.pinCode.length !== 0) {
      const sequentialPatternA = '012345678901234567890';
      const sequentialPatternB = '098765432109876543210';
      if (this.pinCode.length === 4 &&
        // match for ascending sequence
        sequentialPatternA.indexOf(this.pinCode) === -1 &&
        // match for descending sequence
        sequentialPatternB.indexOf(this.pinCode) === -1 &&
        // match for 1111, 2222, 3333
        !(this.pinCode[0] === this.pinCode[1] &&
          this.pinCode[0] === this.pinCode[2] &&
          this.pinCode[0] === this.pinCode[3])) {
        return this.PIN_VALIDATE.VALID;
      } else {
        return this.PIN_VALIDATE.INVALID;
      }
    } else {
      return this.PIN_VALIDATE.EMPTY;
    }

  }

  public showPinCodeRules(): void {
    this.modalHelper.showInformationMessageModal('Pin Code Info',
      'The pin code should not be a sequential number: i.e: 1234 or 9876, also should not be a sequence of the same number; i.e 1111,2222,etc');
  }

  public activateNewNumber(): void {
    this.activateSimForm.form.markAllAsTouched();
    this.captchaRequired = !!this.captchaResponse ? false: true;
    if (!!this.activateSimForm.valid && !!this.captchaResponse && this.validatePin() === this.PIN_VALIDATE.VALID && this.pinCode === this.pinCodeConfirm) {
      this.processingRequest = true;
      // eslint-disable-next-line prefer-const
      let requetBody: IActivateUserAccount = {
        zip: this.postalCode,
        pin: this.pinCode
      };
      if (this.userPlan.id === 'prefunded') {
        requetBody.planDevice = this.userPlan.planDevice;
        requetBody.prefunded = true;
        requetBody.prefundedPlan = this.userPlan.basePlan.id;
      }
      if (!!this.showActivationCode) {
        requetBody.activationCode = this.activationCode;
      }
      if (!!this.showIccid) {
        requetBody.iccid = this.iccid;
      }
      this.userAccountService.activateUserAccount(requetBody, this.userPlan.id, this.captchaResponse).then((response) => {
        if (!!response) {
          this.processingRequest = false;
          const simNumber = !!this.showActivationCode ? this.activationCode : this.iccid;
          if (this.userPlan.basePlan.ebb) {
            const data = {
              event: 'ACP_activation ',
              category: 'ACP Activation',
              label: 'ACP plan activation',
              action: 'activate new ACP plan'
            }
            this.analyticsService.trackACPEvent(data);
          } else {
            this.analyticsService.trackActivation('New', this.carrier, simNumber, this.userPlan.planDevice.model, this.postalCode,
              this.userPlan.id, this.userPlan.basePlan.id);
          }
          this.userPlansService.selectUserPlan(this.userPlan.id);
          sessionStorage.removeItem('activation');
          sessionStorage.removeItem('device');
          // eslint-disable-next-line prefer-const
          let params = {};
          params[SHOP_ROUTE_URLS.PARAMS.MDN] = response.mdn;
          this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATION_SUMMARY}`, params]);
        }
      }, (error) => {
        this.processingRequest = false;
        this.captchaResponse = '';
        this.reCaptcha.resetReCaptcha();
        if (!!error) {
          this.toastHelper.showAlert(error.message);
        }
      });
    }
  }

  public onPostalCodeChange(): void {
    if (!this.processingRequest) {
      this.invalidPostalCode = !(/^\d{5}(-\d{4})?$/.test(this.postalCode));
    }
    if (!!this.firstCheck && this.invalidPostalCode) {
      this.postalCode = '';
      this.firstCheck = false;
    }
  }

  public showIccidModal(): void {
    this.modalHelper.showInformationMessageModal('How to find your SIM card (ICCID)', '', 'Got it!', null, true, 'iccid-info-modal',
      `<div class="text-content-holder">
          <p class="text"> You can find your SIM card (ICCID) on the back of your SIM card. Or through:<b> Settings>About Phone> Status <b></p>
       </div>
       <div class="image-container">
        <span class="pointer-holder"></span>
        <span class="rect rect1">89</span>
        <span class="rect rect2"></span>
        <span class="rect rect4"></span>
        <img src="assets/img/Sim graphic.svg"/>
        <span class="big-rect rect4"></span>
        <span class="image-pointer">Your SIM card (ICCID) is a 20 digit number on the back of your SIM card beginning with the numbers 89.</span>
       </div>`
    );
  }

  private userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan) {
      this.userPlan = userPlan;
      this.voucherData = userPlan.voucherData;
      this.iccid = this.userPlan.iccid;
      this.activationCode = this.userPlan.activationCode;
      if (this.activationCode === '11111' || this.activationCode === '0000000') { // if the activation code is one of the dummy data then empty it
        this.activationCode = '';
      }
      this.postalCode = !!this.userPlan.planDevice && !!this.userPlan.planDevice.postalCode ? this.userPlan.planDevice.postalCode : '';
      this.showActivationCode = !!userPlan.planDevice && userPlan.planDevice.network !== 'sprint';
      this.showIccid = !!userPlan.planDevice && userPlan.planDevice.network === 'sprint';
      this.carrier = this.userPlan.planDevice.network;
    } else {
      this.modalHelper.showInformationMessageModal('Failed to load the selected user plan',
        'Something went wrong, couldn\'t load the selected plan, please try again later.',
        'Continue to Account Summary','',false,'big-button')
        .result.then((result) => {
          if (!!result) {
            this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
          }
        });
    }
  }
}
