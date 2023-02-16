import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IUser } from '@ztarmobile/zwp-services-auth';
import {
  ActionsAnalyticsService, FirebaseUserProfileService, IAddress, IExistingOrder, IFirebaseAddress, IFireBasePlanItem, IPortInUserAccountRequest, IUserDevice, IUserPlan,
  IVoucherData, PortInStatusEnum, UserAccountPortInService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { CAPTCHA_SITE_ID, CUSTOMER_CARE_NUMBER } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { filter, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-activate-current-number',
  templateUrl: './activate-current-number.component.html',
  styleUrls: ['./activate-current-number.component.scss']
})
export class ActivateCurrentNumberComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;
  public user: IUser;
  public userPlan: IUserPlan;
  public codePattern = new RegExp('^[A-Z]+\\d{6}|\\d{7}$');
  public voucherData: IVoucherData;
  public portIn: IPortInUserAccountRequest = { address: {} } as IPortInUserAccountRequest;
  public userPortAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public iccid: string;
  public carrier: string;
  public PIN_VALIDATE = {
    EMPTY: 0,
    VALID: 1,
    INVALID: 2
  };
  public activationCode: string;
  public portInCode = '';
  public portAccountNumber = '';
  public isValidAddress = false;
  public showActivationCode = true;
  public showIccid = false;
  public processingRequest = false;
  public showPinRequired = false;
  public updatePortIn = false;
  public editableAccountNumber = false;
  public editablePin = false;
  public editableFirstName = false;
  public editableLastName = false;
  public editableAddress = false;
  public editableZipCode = false;
  public cancelPort = false;
  public SITE_ID = CAPTCHA_SITE_ID;
  public captchaValid = false;
  public customerCareNumber: string = CUSTOMER_CARE_NUMBER;
  private captchaResponse: string;
  private portInRequestNumber: string;
  private alive = true;
  planId: any;

  constructor(private router: Router,
              private toastHelper: ToastrHelperService,
              private userAccountPortInService: UserAccountPortInService,
              private userPlansService: UserPlansService,
              private appState: AppState,
              private route: ActivatedRoute,
              private metaService: MetaService,
              private modalHelper: ModalHelperService,
              private userProfileService: FirebaseUserProfileService,
              private analyticsService: ActionsAnalyticsService) {
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.user = user;
    });
   
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE]) {
        this.activationCode = params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE];
      }
      if (!!params && params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
        this.planId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
        if (!!this.planId) {
          if (this.planId !== 'prefunded') {
            this.userPlansService.getUserPlan(this.planId).then((userPlan) => {
              this.userPlanSelected(userPlan);
            });
          } else {
            const device: IUserDevice = Object.assign({}, JSON.parse(sessionStorage.getItem('device')));
            const sim: IExistingOrder = Object.assign({}, JSON.parse(sessionStorage.getItem('activation')));
            if (!device || !sim) {
              this.toastHelper.showAlert('Activation data is missing, please try again!');
              this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
            } else {
              const basePlan = { id: sim.prefundedPlan, price: sim.prefundedAmount, promoted: false, unlimited: true, type: 'Unlimited' } as IFireBasePlanItem;
              this.userPlan = {
                id: 'prefunded', activationCode: sim.activationCode, planDevice: device,
                basePlan, autoRenewPlan: false,
              } as IUserPlan;
            }
          }
        } else {
          this.toastHelper.showAlert('Activation data is missing, please try again!');
          this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
        }
      }
    });
    if (!!this.userPlan) {
      this.activationCode = this.userPlan.activationCode;
      if (this.activationCode === '11111' || this.activationCode === '0000000') { // if the activation code is one of the dummy data then empty it
        this.activationCode = '';
      }
    }
    this.userPortAddress = { address1: '', address2: '' } as IFirebaseAddress;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }

  public activateCurrentNumber(): void {
    if (this.updatePortIn) {
      this.updatePreviousPortIn();
    } else {
      this.callActivateCurrentNumber();
    }
  }

  public addressChanged(address: IFirebaseAddress): void {
    this.portIn.address = Object.assign({}, address);
    this.isValidAddress = !!this.portIn.address;
  }
  public goToActivationPath(): void {
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`]);
  }
  public setValidAddress(isValid: boolean): void {
    this.isValidAddress = isValid;
  }

  public validatePin(): number {
    if (!!this.portIn.pin && this.portIn.pin.length !== 0) {
      const sequentialPatternA = '012345678901234567890';
      const sequentialPatternB = '098765432109876543210';
      if (this.portIn.pin.length === 4 &&
        // match for ascending sequence
        sequentialPatternA.indexOf(this.portIn.pin) === -1 &&
        // match for descending sequence
        sequentialPatternB.indexOf(this.portIn.pin) === -1 &&
        // match for 1111, 2222, 3333
        !(this.portIn.pin[0] === this.portIn.pin[1] &&
          this.portIn.pin[0] === this.portIn.pin[2] &&
          this.portIn.pin[0] === this.portIn.pin[3])) {
        return this.PIN_VALIDATE.VALID;
      } else {
        return this.PIN_VALIDATE.INVALID;
      }
    } else if (!!this.portIn.pin && this.portIn.pin.length === 0) {
      return this.PIN_VALIDATE.EMPTY;
    }

  }

  public showPinCodeRules(): void {
    this.modalHelper.showInformationMessageModal('Pin Code Info',
      'The pin code should not be a sequential number: i.e: 1234 or 9876, also should not be a sequence of the same number; i.e 1111,2222,etc');
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
  private userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan) {
      this.userPlan = userPlan;
      this.voucherData = userPlan.voucherData;
      if (this.userPlan.id === 'prefunded') {
        this.portIn.prefunded = true;
        this.portIn.planDevice = this.userPlan.planDevice;
        this.portIn.prefundedPlan = this.userPlan.basePlan.id;
      }
      if (!userPlan.portInRequestNumber && !!userPlan.mdn) {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      } else {
        this.handlePortInUpdate(userPlan);
      }
      this.showActivationCode = !!userPlan.planDevice && userPlan.planDevice.network !== 'sprint';
      this.showIccid = !!userPlan.planDevice && userPlan.planDevice.network === 'sprint';
      this.iccid = userPlan.iccid;
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

  private handlePortInUpdate(userPlan: IUserPlan): void {
    if (!!userPlan.portInRequestNumber) {
      if (userPlan.portInStatus !== PortInStatusEnum.DELAY && userPlan.portInStatus !== PortInStatusEnum.SUBMITTED) {
        this.portInRequestNumber = userPlan.portInRequestNumber;
        this.fillPortInRequestFields();
      } else {
        this.toastHelper.showWarning('Your portIn request number is still under processing.');
        const params = {};
        params[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER] = true;
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATION_SUMMARY}`, params]);
      }
    }
  }

  private callActivateCurrentNumber(): void {
    this.appState.loading = true;
    if (!!this.showActivationCode) {
      this.portIn.activationCode = this.activationCode;
    }
    if (!!this.showIccid) {
      this.portIn.iccid = this.iccid;
    }
    this.portIn.version = '2';
    this.userAccountPortInService.newPortInAccount(this.userPlan.id, this.portIn, this.captchaResponse)
      .then((account) => {
        this.appState.loading = false;
        if (this.userPlan.basePlan.ebb) {
          const data = {
            event: 'ACP_activation ',
            category: 'ACP Activation',
            label: 'ACP plan activation',
            action: 'portin ACP plan'
          }
          this.analyticsService.trackACPEvent(data);
        }
        this.userPlansService.selectUserPlan(this.userPlan.id);
        this.processingRequest = false;
        sessionStorage.removeItem('activation');
        sessionStorage.removeItem('device');
        const simNumber = !!this.showActivationCode ? this.activationCode : this.iccid;
        this.analyticsService.trackPortIn('PortIn', this.carrier, simNumber, this.userPlan.planDevice.model, this.portIn.address.postalCode,
          this.userPlan.id, this.userPlan.basePlan.id);
        const params = {};
        params[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER] = true;
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.PORT_SUBMITTED}`, params]);
      }, (error) => {
        this.toastHelper.showAlert(error.message || 'There was an error with this activation code');
        this.processingRequest = false;
        this.appState.loading = false;
        this.captchaResponse = '';
        this.reCaptcha.resetReCaptcha();
      });
  }
  private updatePreviousPortIn(): void {
    this.processingRequest = true;
    this.portIn.activationCode = this.activationCode;
    this.portIn.portInRequestNumber = this.portInRequestNumber;
    this.userAccountPortInService.updatePortInAccount(this.userPlan.id, this.portIn).then((account) => {
      this.processingRequest = false;
      this.userPlansService.selectUserPlan(this.userPlan.id);
      const params = {};
      params[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER] = true;
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATION_SUMMARY}`, params]);
    }, (error) => {
      this.processingRequest = false;
      this.toastHelper.showAlert(error.message);
      this.captchaResponse = '';
      this.reCaptcha.resetReCaptcha();
    });
  }

  private fillPortInRequestFields(): void {
    this.appState.loading = true;
    this.userAccountPortInService
      .checkPortInAccount(this.userPlan.id)
      .then((portIn) => {
        this.updatePortIn = portIn.portStatus === PortInStatusEnum.RESOLUTION;
        const address: IAddress = this.user.shippingAddresses.find((userAddress) => userAddress.id === this.userPlan.shippingAddressId);
        this.portIn.address = Object.assign({}, address);
        this.userPortAddress = Object.assign({}, portIn.address as IFirebaseAddress);
        this.portAccountNumber = portIn.accountNumber;
        this.activationCode = portIn.activationCode;
        this.iccid = portIn.iccid;
        this.portIn = Object.assign(portIn, { accountPassword: portIn.accountPassword ? portIn.accountPassword : '', address } as IPortInUserAccountRequest);
        this.portInCode = this.userPlan.portInStatusReason;
        this.enableErrorFields(this.portInCode);
        this.appState.loading = false;

      }, (error) => {
        this.toastHelper.showAlert(error.message || error);
        this.processingRequest = false;
        this.appState.loading = false;
      });
  }

  private enableErrorFields(errorCode): void {
    switch (errorCode) {
      case '8A': {
        this.editableAccountNumber = true;
        break;
      }
      case '8C': {
        this.editablePin = true;
        break;
      }
      case '6C': {
        this.editableAddress = true;
        this.editableFirstName = true;
        this.editableLastName = true;
        break;
      }
      case '8E': {
        this.editableFirstName = true;
        this.editableLastName = true;
        break;
      }
      case '7A': {
        this.cancelPort = true;
        break;
      }
      case '6D': {
        this.cancelPort = true;
        break;
      }
      case '8D': {
        this.editableZipCode = true;
        break;
      }
    }
  }
}
