import { Component, OnDestroy, ViewChild, OnInit, ElementRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FirebaseUserProfileService, IUser, MobileCustomPlansService,
  IDeviceCompatibility, CART_TYPES, IDeviceCompatibilityV1, MobilePlanItem, IAutoCompletePrediction, PlacesAutocompleteService, IFirebaseAddress, AccountPaymentService, IMarketingDetails
} from '@ztarmobile/zwp-service-backend';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { INVISIBLE_CAPTCHA_ID } from '../../../environments/environment';
import { ContentfulService } from '../../../services/contentful.service';
import { MetaService } from '../../../services/meta-service.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { take, takeWhile } from 'rxjs/operators';
import { ROUTE_URLS, SHOP_ROUTE_URLS, ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS } from '../../app.routes.names';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.service';
import { EquipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';

@Component({
  selector: 'app-check-compatibility',
  templateUrl: './check-compatibility.component.html',
  styleUrls: ['./check-compatibility.component.scss']
})
export class CheckCompatibilityComponent implements OnDestroy, OnInit, AfterContentChecked {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  @ViewChild('addressCompatibilityForm') addressCompatibilityForm: NgForm;
  @ViewChild('equipmentCompatibilityForm') equipmentCompatibilityForm: NgForm;
  @ViewChild('imei') equipmentNumber: ElementRef<HTMLInputElement>;

  public circlePercentage = 50;
  public activeStep = 1;
  public stepsDetails: Array<{ stepNumber: number; title: string; }>;
  public ADDRESS_COMPATIBILITY_DESCS = {};
  public DEVICE_COMPATIBILITY_DESCS = {};
  public compatibilityStatus: string = '';
  public showAddressResultBanner = false;
  public showDeviceResultBanner = false;
  public addressCompatibilityResponse: any;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public equipment = '';
  public iccid: string;
  public zipCode = '';
  public deviceName: string;
  public selectedUserPlanId: string;
  public shopCheckPhone: any;
  public flowType: number;
  public urlParams: Params;
  public user: IUser;
  public page: any;
  public enteredDevice: IDeviceCompatibilityV1;
  public compatibilityResult: IDeviceCompatibility;
  public compatibileDevice: IDeviceCompatibilityV1;
  public FLOW_TYPES = {
    CHECK_OUT: 0,
    ACTIVATION: 1,
    CHANGE_DEVICE: 2,
    PENDING_ACTIVATION: 3
  };
  public invalidIMEI = false;
  public isLoggedIn = false;
  public captchaValid = false;
  public isCheckoutFlow = false;
  public trialUpgrade = false;
  public invalidAddress = false;
  public displayedAddressModel: any;
  public address: any;
  public setFoucs = false;

  private activationCode: string;
  private alive = true;
  private recaptchaResponse: any;
  private allBasePlans: Array<MobilePlanItem>;
  private newPlan: MobilePlanItem;
  private streetSearchText: string;

  constructor(public router: Router,
    private mobileCustomPlansService: MobileCustomPlansService,
    private simpleAuthService: SimpleAuthService,
    private userProfileService: FirebaseUserProfileService,
    private route: ActivatedRoute,
    private modalHelper: ModalHelperService,
    private metaService: MetaService,
    private contentful: ContentfulService,
    private placesAutoCompleteService: PlacesAutocompleteService,
    private appState: AppState,
    private equipmentService: EquipmentService) {

    this.stepsDetails = [
      { stepNumber: 1, title: 'Service Coverage Check' },
      { stepNumber: 2, title: 'Device Compatibility Check' }
    ];

    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      this.urlParams = params;
      this.flowType = this.FLOW_TYPES.CHECK_OUT;
      if (!!params && !!params[ROUTE_URLS.PARAMS.REFERENCE_PAGE]) {
        if (params[ROUTE_URLS.PARAMS.REFERENCE_PAGE] === SHOP_ROUTE_URLS.CHECKOUT) {
          this.flowType = this.FLOW_TYPES.CHECK_OUT;
          this.isCheckoutFlow = true;
        }

      }
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnInit(): void {
    this.mobileCustomPlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe((isReady) => {
      if (!!isReady) {
        const savedPlanId = JSON.parse(sessionStorage.getItem('planID'));
        this.allBasePlans = this.mobileCustomPlansService.allBasePlans;
        this.newPlan = this.allBasePlans.find((plan) => plan.id === savedPlanId);
      }
    });
    this.mobileCustomPlansService.currentPlan.subscribe((cart) => {
      if (!!cart && !!cart?.basePlan?.id && cart?.basePlan?.id != 'NOT-FOUND' && cart?.cartType === CART_TYPES.NEW_PLAN) {
        this.newPlan = cart.basePlan;
      }
    });
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((authState) => this.isLoggedIn = !!authState && !authState.isAnonymous);
    this.mobileCustomPlansService.currentPlan.pipe(takeWhile(() => this.alive))
      .subscribe((plan) => {
        if (!!plan && !!plan.planDevice) {
          this.activationCode = plan.activationCode;
        }
      });
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);
    this.mobileCustomPlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      if (!!cart && cart.cartType === CART_TYPES.NEW_PLAN) {
        this.isCheckoutFlow = true;
        this.flowType = this.FLOW_TYPES.CHECK_OUT;
        if (cart.activePlanId) {
          this.trialUpgrade = true;
        } else {
          this.trialUpgrade = false;
        }
      }
    });
    setInterval(() => {
      this.reCaptcha.execute(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
    }, 1.8 * 60 * 1000);
  }
  ngAfterContentChecked(): void {
    this.ADDRESS_COMPATIBILITY_DESCS = {
      'COVERED': {
        title: 'Great News!',
        desc1: 'Your address has good coverage.',
        desc2: `${this.displayedAddressModel?.address1}, ${this.displayedAddressModel?.city}, ${this.displayedAddressModel?.state} ${!!this.displayedAddressModel?.postalCode ? this.displayedAddressModel?.postalCode : ''}`,
        desc3: 'Let’s check compatibility with your device’s IMEI.',
        buttonName: 'Next',
        buttonAction: 'next',
        success: true
      },
      'NOT_COVERED': {
        title: 'We are sorry!',
        desc1: 'Your address does not have good coverage.',
        desc2: `${this.displayedAddressModel?.address1}, ${this.displayedAddressModel?.city}, ${this.displayedAddressModel?.state} ${!!this.displayedAddressModel?.postalCode ? this.displayedAddressModel?.postalCode : ''}`,
        desc3: null,
        buttonName: 'Retry',
        buttonAction: 'retry',
        success: false
      }
    }
    this.DEVICE_COMPATIBILITY_DESCS = {
      'NOT_COVERED': {
        title: 'We are sorry!',
        desc1: 'Your device is not compatible.',
        desc2: null,
        desc3: null,
        buttonName: 'Retry',
        buttonAction: 'retry',
        desc4: null,
        linkName: null,
        linkAction: null,
        success: false
      }
    }
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public next(): void {
    this.activeStep = 2;
    this.circlePercentage = 100;
    this.showAddressResultBanner = false;
  }
  public retry(): void {
    if (this.activeStep === 1) {
      this.address = '';
      this.displayedAddressModel = null;
      this.showAddressResultBanner = false;
    } else if (this.activeStep === 2) {
      this.equipment = '';
      this.showDeviceResultBanner = false;
    }
  }
  public back(): void {
    this.activeStep = 1;
    this.showAddressResultBanner = false;
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
  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public checkAddressCompatibility(): void {
    this.addressCompatibilityForm.form.markAllAsTouched();
    if (!!this.addressCompatibilityForm.valid && !!this.displayedAddressModel) {
      this.appState.loading = true;
      this.equipmentService.checkDeviceCompatibilityV2(this.recaptchaResponse, this.displayedAddressModel?.postalCode,
        this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
        this.displayedAddressModel?.state, this.displayedAddressModel?.address2).then(res => {
          if (!!res) {
            this.appState.loading = false;
            this.showAddressResultBanner = true;
            if (!!res?.tmo?.covered) {
              this.addressCompatibilityResponse = res;
              this.compatibilityStatus = 'COVERED';
            } else {
              this.compatibilityStatus = 'NOT_COVERED';
            }
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
          }
        }, (error) => {
          this.appState.loading = false;
          this.showAddressResultBanner = true;
          this.compatibilityStatus = 'NOT_COVERED';
          this.reCaptcha.resetReCaptcha();
          this.reCaptcha.execute();
        });
    }
  }
  public checkDeviceCompatibility(): void {
    this.equipmentCompatibilityForm.form.markAllAsTouched();
    if (!!this.equipmentCompatibilityForm.valid && !!this.displayedAddressModel) {
      this.appState.loading = true;
      this.equipmentService.checkDeviceCompatibilityV2(this.recaptchaResponse, this.displayedAddressModel?.postalCode,
        this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
        this.displayedAddressModel?.state, this.displayedAddressModel?.address2, this.equipment).then(res => {
          if (!!res) {
            this.appState.loading = false;
            if (!!res?.tmo?.covered) {
              this.compatibileDevice = res?.details as IDeviceCompatibilityV1;
              this.compatibileDevice.manufacturer = res?.details?.make;
              this.compatibileDevice.marketingName = res?.details?.name;
              this.deviceName = res?.details?.name;
              this.enteredDevice = this.compatibileDevice;
              this.compatibileDevice.address1 = this.displayedAddressModel?.address1;
              this.compatibileDevice.address2 = this.displayedAddressModel?.address2;
              this.compatibileDevice.city = this.displayedAddressModel?.city;
              this.compatibileDevice.state = this.displayedAddressModel?.state;
              this.compatibileDevice.postalCode = this.displayedAddressModel?.postalCode;
              this.compatibileDevice.id = res?.details?.serialNumber;
              this.zipCode = this.displayedAddressModel?.postalCode;
              if (!!res?.details?.eSimOnly) {
                this.compatibilityStatus = 'NOT_COVERED';
                this.showDeviceResultBanner = true;
              } else {
                this.compatibileDevice.network = 'tmo';
                this.compatibileDevice.skuIdentifier = res?.tmo?.details?.skuIdentifier;
                this.compatibileDevice.skuNumber = res?.tmo?.details?.skuNumber;
                this.setDevice(this.compatibileDevice);
                this.checkPhoneResult();
              }
            } else {
              this.compatibilityStatus = 'NOT_COVERED';
              this.showDeviceResultBanner = true;
            }
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
          }
        }, (error) => {
          this.appState.loading = false;
          this.showDeviceResultBanner = true;
          this.compatibilityStatus = 'NOT_COVERED';
          this.reCaptcha.resetReCaptcha();
          this.reCaptcha.execute();
        });
    }
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
      <p class="question">How do I know if my device is unlocked?</p>
      <p class="answer">Only the Carrier/Provider who locked the device can confirm that the device is unlocked. Please contact the provider where the device was
      used last to determine the device’s lock status.</p>
    </div>`;
    this.modalHelper.showInformationMessageModal('Unlocked Devices', '', 'Continue', null, true, 'unlockedModal', customHTML);
  }
  public showWhatIsIMEI(): void {
    this.modalHelper.showInformationMessageModal('3 Ways to find your MEID or IMEI', '', 'Got it', null,
      true, 'compatibility-help-modal-IME ',
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
      </div>
        `);
  }
  public skipDevice(): void {
    let device = { network: 'tmo', networkType: 'GSM', skuIdentifier: 'T', skuNumber: 'SIMGWLTMO4GLTE', verified: true } as IDeviceCompatibilityV1;
    this.modalHelper.showConfirmMessageModal('Skip device check', 'The service will only work on 4G/5G VoLTE compatible devices. By skipping this step, there is no way to know if your phone is compatible with our networks. Is your phone 4G or 5G and VoLTE compatible?', 'Yes', 'Check Phone', 'skip-modal')
      .result.then((option) => {
        if (option === true) {
          this.setDevice(device);
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
        } else {
          this.mobileCustomPlansService.clearUserCart();
          this.equipmentNumber.nativeElement.focus();
        }
      });
  }
  private checkPhoneResult(): void {
    const params = {};
    params[ACTIVATION_ROUTE_URLS.PARAMS.NETWORK] = this.compatibileDevice.network;
    params[ACTIVATION_ROUTE_URLS.PARAMS.ZIP_CODE] = this.displayedAddressModel.postalCode;
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE_RESULT}`, params]);
  }
  private setDevice(device): void {
    device.verified = true;
    this.mobileCustomPlansService.setBasePlan(this.newPlan);
    this.mobileCustomPlansService.setCartType(CART_TYPES.NEW_PLAN);
    this.mobileCustomPlansService.setPlanDevice(device);
    this.mobileCustomPlansService.setPlanExpectedDevice(null);
    this.prepareMarketingDetails();
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

  private prepareMarketingDetails(): void {
    const utms = JSON.parse(sessionStorage.getItem('utms'));
    const marketingDetails = !!utms ? this.appState.setMarketingObject(utms) : {} as IMarketingDetails;
    if (!!this.isLoggedIn) {
      this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((data) => {
        if (!!data) {
          const savedActiveCampaign = !!data.activeCampaign ? data.activeCampaign : {} as IMarketingDetails;
          if (marketingDetails.utm_campaign === savedActiveCampaign.utm_campaign && marketingDetails.utm_medium === savedActiveCampaign.utm_medium
            && marketingDetails.utm_source === savedActiveCampaign.utm_source) {
            this.mobileCustomPlansService.setMarketingObject(savedActiveCampaign);
          } else {
            data.activeCampaign = marketingDetails;
            this.mobileCustomPlansService.setMarketingObject(marketingDetails);
            if (!!data.campaignsHistory) {
              data.campaignsHistory.push(marketingDetails)
            } else {
              data.campaignsHistory = [];
              data.campaignsHistory.push(marketingDetails)
            }
            this.userProfileService.updateUserProfile(data);
          }
        }
      });
    } else {
      this.mobileCustomPlansService.setMarketingObject(marketingDetails);
    }
  }
}
