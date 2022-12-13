import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import {
  CART_TYPES, CustomizableMobilePlan, FirebaseUserProfileService, IDeviceCompatibilityV1, IUser, IUserPlan,
  MobileCustomPlansService, UserDeviceService, UserPlansService, IExistingOrder, AccountPaymentService, PlacesAutocompleteService, IFirebaseAddress, IAutoCompletePrediction
} from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { EquipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { AppState } from 'src/app/app.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-activation-check-compatibility',
  templateUrl: './activation-check-compatibility.component.html',
  styleUrls: ['./activation-check-compatibility.component.scss']
})
export class ActivationCheckCompatibilityComponent implements OnDestroy, OnInit {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  @ViewChild('compatibilityForm') compatibilityForm: NgForm;

  public user: IUser;
  public userPlan: IUserPlan;
  public compatibleDevice: IDeviceCompatibilityV1;
  public simValidity: IExistingOrder;
  public page: any;
  public userPlanId: string;
  public network: string;
  public activationCode: string;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public equipment = '';
  public zipCode = '';
  public isEBBPlan = false;
  public isEbbCart = false;
  public processingRequest = false;
  public invalidIMEI = false;
  public isLoggedIn = false;
  public captchaValid = false;
  public withDevice = false;
  public userPlanCarrier;
  public userCart: CustomizableMobilePlan;
  public invalidAddress = false;
  public displayedAddressModel: any;
  public address: any;
  public setFoucs = false;

  private captchaResponse: string;
  private alive = true;
  private streetSearchText: string;
  deviceNetwork: string;

  constructor(public router: Router,
    private userDeviceService: UserDeviceService,
    private mobileCustomPlansService: MobileCustomPlansService,
    private userPlanService: UserPlansService,
    private userProfileService: FirebaseUserProfileService,
    private simpleAuthService: SimpleAuthService,
    private toastHelper: ToastrHelperService,
    private route: ActivatedRoute,
    private modalHelper: ModalHelperService,
    private metaService: MetaService,
    private accountPaymentService: AccountPaymentService,
    private equipmentService: EquipmentService,
    private placesAutoCompleteService: PlacesAutocompleteService,
    private appState: AppState) {

    this.metaService.createCanonicalUrl();
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params) {
        if (params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
          this.userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
          this.userPlanService.getUserPlan(this.userPlanId).then((plan) => {
            this.withDevice = !!plan.planDevice && !!plan.planDevice.id;
            this.userPlan = plan;
            this.deviceNetwork = this.userPlan.planDevice.network;
            this.userPlanCarrier = !!plan.planDevice ? this.userPlan.planDevice.network : 'tmo';
            this.isEBBPlan = !!this.userPlan.basePlan.ebb ? true : false;
          });
        }
        if (params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE]) {
          this.activationCode = params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE];
        }
        if (params[ROUTE_URLS.PARAMS.NETWORK]) {
          this.network = params[ROUTE_URLS.PARAMS.NETWORK];
        } else {
          this.network = 'tmo';
        }
      }
    });
    this.simValidity = JSON.parse(sessionStorage.getItem('activation'));
  }

  ngOnInit(): void {
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive))
      .subscribe((authState) => this.isLoggedIn = !!authState && !authState.isAnonymous);
    this.mobileCustomPlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.userCart = cart;
      this.isEbbCart = !!this.userCart.basePlan.ebb ? true : false;
    });
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);
    setInterval(() => {
      this.reCaptcha.execute(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
    }, 1.8 * 60 * 1000);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public findPlace(keyword: ''): Observable<Array<IAutoCompletePrediction>> {
    return this.placesAutoCompleteService.findAddress(keyword);
  }
  public addressDetails(event: IAutoCompletePrediction): void {
    if (!!event && !!event.main_text) {
      if (!!event.place_id) {
        this.invalidAddress = false;
        this.placesAutoCompleteService
          .findDetailedAddressFields(event.place_id)
          .subscribe(
            (place) => {
              this.streetSearchText =
                !!place.address1 && place.address1.length > 0
                  ? place.address1
                  : null;
              this.displayedAddressModel = this.getAddressValues(
                place,
                event.main_text
              );
              this.address = `${this.displayedAddressModel?.address1}, ${this.displayedAddressModel?.city
                }, ${this.displayedAddressModel?.state} ${this.displayedAddressModel?.postalCode
                  ? this.displayedAddressModel?.postalCode
                  : ''
                }`;
            },
            (error) => {
              console.warn(
                `Google can't find details for place: ${event.place_id}`,
                error
              );
            }
          );
      } else {
        this.invalidAddress = true;
        console.warn(`Google can't find place: ${event.main_text}`);
      }
    } else {
      this.invalidAddress = true;
    }
  }
  public changedAddress(): void {
    this.displayedAddressModel = null;
  }

  public checkPhoneCompatibility(): void {
    this.compatibilityForm.form.markAllAsTouched();
    if (!!this.compatibilityForm.valid && !!this.displayedAddressModel) {
      this.processingRequest = true;
      if (this.equipment.indexOf(' ') >= 0) {
        this.equipment = this.equipment.replace(/\s+/g, '');
      }
      this.zipCode = this.displayedAddressModel?.postalCode;
      // eslint-disable-next-line
      // user wants to check compatibility for purchased plan without device(we need to read the network saved in the planDevice as it might be changed from fulfillment)
      if (!!this.userPlanId && !!this.user && !this.withDevice) {
        this.userPlanCarrier = !!this.isEBBPlan ? 'tmo' : this.userPlanCarrier;
        this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
          this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
          this.displayedAddressModel?.state, this.displayedAddressModel?.address2, this.equipment).then((res) => {
            this.processingRequest = false;
            if (!!res) {
              this.processingRequest = false;
              if (!!res[this.deviceNetwork].covered) {
                // eslint-disable-next-line prefer-const
                let device = res.details as IDeviceCompatibilityV1;
                device.manufacturer = res?.details?.make;
                device.marketingName = res?.details?.name;
                device.address1 = this.displayedAddressModel?.address1;
                device.address2 = this.displayedAddressModel?.address2;
                device.city = this.displayedAddressModel?.city;
                device.state = this.displayedAddressModel?.state;
                device.postalCode = this.displayedAddressModel?.postalCode;
                device.id = res?.details?.serialNumber;
                device.network = this.deviceNetwork;
                device.skuIdentifier = res[this.deviceNetwork].details?.skuIdentifier;
                device.skuNumber = res[this.deviceNetwork].details?.skuNumber;
                if (!res?.details?.eSimOnly) {
                  this.setUserPlanDevice(this.compatibleDevice);
                  this.userPlanService.setPlanDeviceFromBFF(this.userPlanId, { planDevice: device }).then(() => {
                    const customHTML = `<div class="success-message">
                        <p class="message">Your phone is ready and able to join our network!</p>
                        <p class="note">It must also be unlocked to work on the Good Mobile Network.</p>
                      </div>`;
                    this.modalHelper.showInformationMessageModal('Congratulations!', '', 'Continue', null, true, 'successPhoneModal', customHTML).result.then(() => {
                      const params = {};
                      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
                      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
                    });
                  }, (error) => {
                    this.toastHelper.showAlert(error.error.message || error.message);
                    this.processingRequest = false;
                  });
                } else {
                  this.processingRequest = false;
                  this.toastHelper.showWarning('Changing a device might impact your service, please contact CUSTOMER CARE to ensure that your changes are handled correct.');
                }
              } else {
                this.processingRequest = false;
                this.toastHelper.showWarning('Your device is not compatible.');
              }
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
            }
          }, (error) => {
            this.processingRequest = false;
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
            let errorMessage = '';
            if (error?.error?.errors[0]?.code === 102) {
              if (error?.error?.errors[0]?.params[0].param_name.includes('equipment')) {
                errorMessage = 'The device serial number does not seem to be valid';
              } else if (error?.error?.errors[0]?.params[0].message === 'Invalid zip code') {
                errorMessage = 'Sorry, Your address does not have good coverage';
              }
            } else {
              errorMessage = error?.error?.errors[0]?.message;
            }
            this.toastHelper.showAlert(errorMessage);
          });
        // eslint-disable-next-line
        // user wants to edit device for pending plan so it has to be the same network
      } else if (!!this.userPlanId && !!this.user && !!this.withDevice) { // user wants to check compatibility for purchased plan with device
        this.userPlanCarrier = !!this.isEBBPlan ? 'tmo' : this.userPlanCarrier;
        this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
          this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
          this.displayedAddressModel?.state, this.displayedAddressModel?.address2, this.equipment).then((res) => {
            this.processingRequest = false;
            if (!!res) {
              this.processingRequest = false;
              if (!!res[this.deviceNetwork].covered) {
                // eslint-disable-next-line prefer-const
                this.compatibleDevice = res.details as IDeviceCompatibilityV1;
                this.compatibleDevice.manufacturer = res?.details?.make;
                this.compatibleDevice.marketingName = res?.details?.name;
                this.compatibleDevice.address1 = this.displayedAddressModel?.address1;
                this.compatibleDevice.address2 = this.displayedAddressModel?.address2;
                this.compatibleDevice.city = this.displayedAddressModel?.city;
                this.compatibleDevice.state = this.displayedAddressModel?.state;
                this.compatibleDevice.postalCode = this.displayedAddressModel?.postalCode;
                this.compatibleDevice.id = res?.details?.serialNumber;
                this.compatibleDevice.skuIdentifier = res[this.deviceNetwork].details?.skuIdentifier;
                this.compatibleDevice.skuNumber = res[this.deviceNetwork].details?.skuNumber;
                this.compatibleDevice.network = this.deviceNetwork;
                if (this.compatibleDevice.network === this.userPlan.planDevice.network && !res?.details?.eSimOnly) {
                  this.setUserPlanDevice(this.compatibleDevice);
                } else {
                  this.processingRequest = false;
                  this.toastHelper.showWarning('Changing a device might impact your service, please contact CUSTOMER CARE to ensure that your changes are handled correct.');
                }
              }
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
            }
  
          }, (error) => {
            this.processingRequest = false;
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
            let errorMessage = '';
            if (error?.error?.errors[0]?.code === 102) {
              if (error?.error?.errors[0]?.params[0].param_name.includes('equipment')) {
                errorMessage = 'The device serial number does not seem to be valid';
              } else if (error?.error?.errors[0]?.params[0].message === 'Invalid zip code') {
                errorMessage = 'Sorry, Your address does not have good coverage';
              }
            } else {
              errorMessage = error?.error?.errors[0]?.message;
            }
            this.toastHelper.showAlert(errorMessage);
          });
        // eslint-disable-next-line
        // user wants to check compatibility after activate plan page (got sim from somewhere else)
      } else if (!!this.simValidity && this.simValidity.valid) { // user is in activation flow
        this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
          this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
          this.displayedAddressModel?.state, this.displayedAddressModel?.address2, this.equipment).then((res) => {
            this.processingRequest = false;
            if (!!res) {
              this.processingRequest = false;
              if (!!res?.tmo?.covered) {
                // eslint-disable-next-line prefer-const
                this.compatibleDevice = res.details as IDeviceCompatibilityV1;
                this.compatibleDevice.manufacturer = res?.details?.make;
                this.compatibleDevice.marketingName = res?.details?.name;
                this.compatibleDevice.address1 = this.displayedAddressModel?.address1;
                this.compatibleDevice.address2 = this.displayedAddressModel?.address2;
                this.compatibleDevice.city = this.displayedAddressModel?.city;
                this.compatibleDevice.state = this.displayedAddressModel?.state;
                this.compatibleDevice.postalCode = this.displayedAddressModel?.postalCode;
                this.compatibleDevice.id = res?.details?.serialNumber;
                this.compatibleDevice.skuIdentifier = res?.tmo?.details?.skuIdentifier;
                this.compatibleDevice.skuNumber = res?.tmo?.details?.skuNumber;
                this.compatibleDevice.network = 'tmo'; 
                if (!res?.details?.eSimOnly) {
                sessionStorage.setItem('device', JSON.stringify(this.compatibleDevice));
                if (this.simValidity.prefunded) {
                  const customHTML = `<div class="success-message">
                      <p class="message">Your phone is ready and able to join our network!</p>
                      <p class="note">It must also be unlocked to work on the Good Mobile Network.</p>
                    </div>`;
                  this.modalHelper.showInformationMessageModal('Congratulations!', '', 'Continue', null, true, 'successPhoneModal', customHTML).result.then(() => {
                    const params = {};
                    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = 'prefunded';
                    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
                  });
                } else {
                  this.mobileCustomPlansService.setSimCard(this.simValidity.activationCode);
                  this.mobileCustomPlansService.setPlanDevice(this.compatibleDevice);
                  const params = {};
                  params[ACTIVATION_ROUTE_URLS.PARAMS.NETWORK] = this.compatibleDevice.network;
                  params[ACTIVATION_ROUTE_URLS.PARAMS.ZIP_CODE] = this.zipCode;
                  this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE_RESULT}`, params]);
                }
              } else {
                this.toastHelper.showWarning('Your device is not compatible.');
              }
            }
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
            }
          }, (error) => {
            this.processingRequest = false;
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
            let errorMessage = '';
            if (error?.error?.errors[0]?.code === 102) {
              if (error?.error?.errors[0]?.params[0].param_name.includes('equipment')) {
                errorMessage = 'The device serial number does not seem to be valid';
              } else if (error?.error?.errors[0]?.params[0].message === 'Invalid zip code') {
                errorMessage = 'Sorry, Your address does not have good coverage';
              }
            } else {
              errorMessage = error?.error?.errors[0]?.message;
            }
            this.toastHelper.showAlert(errorMessage);
          });
      } else { // user wants to check compatibility for a new plan in cart
        this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
          this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
          this.displayedAddressModel?.state, this.displayedAddressModel?.address2, this.equipment).then((res) => {
            this.processingRequest = false;
            if (!!res) {
              this.processingRequest = false;
              if (!!res?.tmo?.covered) {
                // eslint-disable-next-line prefer-const
                this.compatibleDevice = res.details as IDeviceCompatibilityV1;
                this.compatibleDevice.manufacturer = res?.details?.make;
                this.compatibleDevice.marketingName = res?.details?.name;
                this.compatibleDevice.address1 = this.displayedAddressModel?.address1;
                this.compatibleDevice.address2 = this.displayedAddressModel?.address2;
                this.compatibleDevice.city = this.displayedAddressModel?.city;
                this.compatibleDevice.state = this.displayedAddressModel?.state;
                this.compatibleDevice.postalCode = this.displayedAddressModel?.postalCode;
                this.compatibleDevice.id = res?.details?.serialNumber;
                this.compatibleDevice.skuIdentifier = res?.tmo?.details?.skuIdentifier;
                this.compatibleDevice.skuNumber = res?.tmo?.details?.skuNumber;
                this.compatibleDevice.network = 'tmo';
                if (!res?.details?.eSimOnly) {
                  let customHTML;
                  customHTML = `<div class="success-message">
                <p class="message">Your phone is ready and able to join our network!</p>
                <p class="note">It must also be unlocked to work on the Good Mobile Network.</p>
                </div>`;
                this.modalHelper.showInformationMessageModal('Congratulations!', '', 'Continue', null, true, 'successPhoneModal', customHTML).result.then((result) => {
                  if (!!result) {
                    this.mobileCustomPlansService.setPlanDevice(this.compatibleDevice);
                    if (!!this.userCart && this.userCart.cartType === CART_TYPES.NEW_PLAN && !!this.userCart.basePlan) {
                      const params = {};
                      params[ACTIVATION_ROUTE_URLS.PARAMS.NETWORK] = this.compatibleDevice.network;
                      params[ACTIVATION_ROUTE_URLS.PARAMS.ZIP_CODE] = this.zipCode;
                      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE_RESULT}`, params]);
                    } else {
                      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
                    }
                  }
                }, (error) => {
                  console.error(error);
                });
                } else {
                  this.toastHelper.showWarning('Your device is not compatible.');
                }

              }
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
            }
          }, (error) => {
            this.processingRequest = false;
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
            let errorMessage = '';
            if (error?.error?.errors[0]?.code === 102) {
              if (error?.error?.errors[0]?.params[0].param_name.includes('equipment')) {
                errorMessage = 'The device serial number does not seem to be valid';
              } else if (error?.error?.errors[0]?.params[0].message === 'Invalid zip code') {
                errorMessage = 'Sorry, Your address does not have good coverage';
              }
            } else {
              errorMessage = error?.error?.errors[0]?.message;
            }
            this.toastHelper.showAlert(errorMessage);
          });
      }
    }
  }
  public setUserPlanDevice(device: IDeviceCompatibilityV1): void {
    this.processingRequest = false;
    this.userPlanService.setPlanDeviceFromBFF(this.userPlanId, { planDevice: device }).then(() => {
      const customHTML = `<div class="success-message">
          <p class="message">Your phone is ready and able to join our network!</p>
          <p class="note">It must also be unlocked to work on the Good Mobile Network.</p>
          </div>`;
      this.modalHelper.showInformationMessageModal('Congratulations!', '', 'Continue', null, true, 'successPhoneModal', customHTML).result.then(() => {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS}`]);
      });
    }, (error) => {
      this.toastHelper.showAlert(error.error.message || error.message);
    });
  }
  public showUnlockedPopup(): void {
    const customHTML = `<div class="question-section">
      <p class="question">What is an unlocked device?</p>
      <p class="answer">An unlocked cell phone or tablet is not tied to any specific wireless carrier/provider. This means you can use it with any wireless provider,
      as long as they have a similar network. (Purchase of a service plan and a SIM card required).</p>
      <p class="answer">Most cell phones and tablets that use SIM cards are sold locked, which means they are programmed to only work with the original carrier’s SIM card. </p>
    </div>
    <div class="question-section">
      <p class="question">To get a device unlocked</p>
      <p class="answer">Contact the original wireless carrier. They will usually unlock it for you as long as you meet the requirements.</p>
    </div>
    <div class="question-section">
      <p class="question">How do I know if my phone is unlocked?</p>
      <p class="answer">Only the Carrier/Provider who locked the phone can confirm that the phone is unlocked. Please contact the provider where the phone was
      used last to determine the phone’s lock status.</p>
    </div>`;
    this.modalHelper.showInformationMessageModal('Unlocked Devices', '', 'Continue', null, true, 'unlockedModal', customHTML);
  }
  public showWhatIsIMEI(): void {
    this.modalHelper.showInformationMessageModal('3 Ways to find your MEID or IMEI', '', 'Got it', null,
      true, 'compatibility-help-modal-IME',
      `<div class="description-content">
      <div class="intro">
      Your IMEI number is needed if you want to unlock your device to use
      on other networks. Here’s 3 ways how to find it on your phone: </div>
         <div class="note-dial"> <b>Enter *#06# on your phone’s dial pad.</b></div>
         <b>OR</b>
         <div class="menu-margins">
         <b>Check your phone’s settings menu:</b>
         <p class="p-nowrap">Android: Go to Settings > About device > Status</p>
         <p class="p-nowrap">iPhone: Go to Settings > General > About</p>
         <p class="p-nowrap">Windows Phone: Go to Settings > About > More info</p>
         </div>
         <b>OR</b>
         <div class="menu-margins">
         <p class="p-nowrap"><b>Check the sticker under your device’s battery.</b></p>
         <p class="p-nowrap"> Note: It may be listed as “DEC.” </p> </div>
        </div>`);
  }
  public goToActivationPage(network): void {
    const btnText = (!!this.userPlanId) ? 'Continue Activation' : 'Continue to Plans';
    const params = {};
    if (!!this.userPlanId) {
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
    } else if (!!this.activationCode) {
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
    } else {
      params[ACTIVATION_ROUTE_URLS.PARAMS.NETWORK] = network;
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE_RESULT}`, params]);
    }
  }
  private getAddressValues(
    placeInfo: any,
    searchTerms?: string
  ): IFirebaseAddress {
    let address: IFirebaseAddress = {
      name: !!this.displayedAddressModel?.name
        ? this.displayedAddressModel?.name
        : this.displayedAddressModel?.alias,
      address1: placeInfo.address1,
      address2: placeInfo.address2,
      state: placeInfo.state ? placeInfo.state.toUpperCase() : placeInfo.state,
      city: placeInfo.city,
      country: placeInfo.country || 'United States',
      postalCode: placeInfo.postalCode,
    } as IFirebaseAddress;

    if (!!this.displayedAddressModel?.id) {
      address.id = this.displayedAddressModel?.id;
      address.isDefault = this.displayedAddressModel?.isDefault;
    }
    if (!!searchTerms && typeof searchTerms === 'string') {
      if (!!this.streetSearchText) {
        if (!searchTerms.match(this.streetSearchText)) {
          this.streetSearchText = null;
        }
      }
      address.address1 = !!this.streetSearchText
        ? address.address1
        : searchTerms.trim();
    }
    if (!!address && address.address1)
      address.address1 = AccountPaymentService.shortenAddress(address.address1, 30);

    // Clean Out empty values,
    address = this.appState.removeEmptyValues(address);
    return Object.assign({}, address);
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    if (sessionStorage.getItem('activation_step') === 'step4') {
      event.preventDefault();
      sessionStorage.setItem('activation_step', 'step3');
    }
  }
}
