import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AccountPaymentService, CART_TYPES, IAutoCompletePrediction, IDeviceCompatibilityV1, IFirebaseAddress, IUserPlan, MobileCustomPlansService, PlacesAutocompleteService, UserDeviceService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EquipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { POSTAL_PATTERN } from 'src/app/app.config';
import { ACCOUNT_ROUTE_URLS, MIGRATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';

@Component({
  selector: 'app-compatibility',
  templateUrl: './compatibility.component.html',
  styleUrls: ['./compatibility.component.scss']
})
export class CompatibilityComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  @ViewChild('addressCompatibilityForm') addressCompatibilityForm: NgForm;
  @ViewChild('equipmentCompatibilityForm') equipmentCompatibilityForm: NgForm;
  @ViewChild('imei') equipmentNumber: ElementRef<HTMLInputElement>;
  public userPlan: IUserPlan;
  public userPlanId: string;
  public confirmedDevice = false;
  public processingRequest = false;
  public invalidZipCode = false;
  public zipCode = '';
  public equipment = '';
  public compatibileDevice: IDeviceCompatibilityV1;
  public postalPattern: RegExp = new RegExp(POSTAL_PATTERN);
  public isSimOrdered = false;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public captchaValid = false;
  public captchaPending = false;
  private alive = true;
  private captchaResponse: string;
  public filteredOptions: Observable<Array<IAutoCompletePrediction>>;
  public filteredOptionsSubscription: Subscription;
  public circlePercentage = 50;
  public activeStep = 1;
  public stepsDetails: Array<{ stepNumber: number; title: string; }>;
  public ADDRESS_COMPATIBILITY_DESCS = {};
  public DEVICE_COMPATIBILITY_DESCS = {};
  public compatibilityStatus: string = '';
  public showAddressResultBanner = false;
  public showDeviceResultBanner = false;
  public addressCompatibilityResponse: any;
  public address: any;
  displayedAddressModel: any;
  deviceName: any;
  enteredDevice: IDeviceCompatibilityV1;
  streetSearchText: any;
  invalidAddress: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private toastHelper: ToastrHelperService, private userPlansService: UserPlansService, private placesAutoCompleteService: PlacesAutocompleteService,
              private userDeviceService: UserDeviceService, private mobilePlansService: MobileCustomPlansService, private formBuilder: FormBuilder,private appState: AppState,
              private equipmentService: EquipmentService, private modalHelper: ModalHelperService) {
 
    this.stepsDetails = [
      { stepNumber: 1, title: 'Service Coverage Check' },
      { stepNumber: 2, title: 'Device Compatibility Check' }
    ];
   }

  ngOnInit(): void {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params) {
        if (!!params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
          this.userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
          if (params[MIGRATION_ROUTE_URLS.PARAMS.CONFIRMED]) {
            this.confirmedDevice = params[MIGRATION_ROUTE_URLS.PARAMS.CONFIRMED] === 'true' ? true : false;
          }
          if (params[MIGRATION_ROUTE_URLS.PARAMS.ORDERED]) {
            this.isSimOrdered = true;
          }
          this.userPlansService.getUserPlan(this.userPlanId).then((plan) => {
            if (!!plan) {
              this.userPlan = plan;
              this.equipment = !!this.isSimOrdered ? this.userPlan.migrationDevice : (!!this.confirmedDevice ? this.userPlan.planDevice.id : '');
            }
          });
        }
      } else {
        this.toastHelper.showAlert('Please select a plan to start the migration process!');
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      }
    });
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
    this.filteredOptionsSubscription?.unsubscribe();

  }

  public checkAddressCompatibility(): void {
    this.addressCompatibilityForm.form.markAllAsTouched();
    if (!!this.addressCompatibilityForm.valid && !!this.displayedAddressModel) {
      this.appState.loading = true;
      this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
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
          }
        }, error => {
          this.appState.loading = false;
          this.showAddressResultBanner = true;
          this.compatibilityStatus = 'NOT_COVERED';
          this.reCaptcha.resetReCaptcha();
        });
    }
  }
  public checkDeviceCompatibility(): void {
    this.equipmentCompatibilityForm.form.markAllAsTouched();
    if (!!this.equipmentCompatibilityForm.valid && !!this.displayedAddressModel) {
      this.appState.loading = true;
      this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
        this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
        this.displayedAddressModel?.state, this.displayedAddressModel?.address2, this.equipment).then(res => {
          if (!!res) {
            this.appState.loading = false;
            if (!!res?.tmo?.covered) {
              this.compatibileDevice = res.details as IDeviceCompatibilityV1;
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
  public findPlace(keyword: ''): Observable<Array<IAutoCompletePrediction>> {
    this.filteredOptions = this.placesAutoCompleteService.findAddress(keyword);
    this.filteredOptionsSubscription = this.filteredOptions.subscribe();
    return this.filteredOptions;
  }
  public addressDetails(eventFire: IAutoCompletePrediction): void {
    if (!!eventFire && !!this.address && this.address?.main_text) {
      const event = this.address;
      if (!!event.place_id) {
        this.appState.loading = true;
        this.invalidAddress = false;
         //this is a default value until address have the value from api
         this.address = event?.main_text;
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
                this.appState.loading = false;
            },
            (error) => {
              this.appState.loading = false;
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
  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    this.captchaPending = !!captchaResponse ? false : true;
  }
  public changedAddress(): void {
    this.findPlace(this.address);
    this.displayedAddressModel = null;
  }
  public goToConfirmDevice(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
    this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.CONFIRM_DEVICE}`, params]);
    // this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]); // sometimes there is no user plan id to get the details for in confirm page
  }

  public back(): void {
    if (this.activeStep == 2) {
      this.activeStep = 1;
      this.showAddressResultBanner = false;
    } else {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
    }
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
  private setDevice(device): void {
    if (!this.isSimOrdered) { // if the user didn't ordered the SIM and wants to check his device
      this.userPlan.migrationDevice = this.compatibileDevice.id;
      this.userPlansService.updateUserPlan(this.userPlan.userId, this.userPlan);
      sessionStorage.removeItem('useFromBalance');
      sessionStorage.removeItem('useFromReward');
      sessionStorage.removeItem('shippingAddress');
      sessionStorage.removeItem('storePickup');
      sessionStorage.removeItem('personPickup');
      sessionStorage.removeItem('shippingMethod');
      sessionStorage.removeItem('plan_id');
      this.mobilePlansService.setCartType(CART_TYPES.MIGRATION);
      this.mobilePlansService.setPlanDevice(this.compatibileDevice);
      this.mobilePlansService.setActivePlanId(this.userPlanId);
      this.mobilePlansService.setSimPurchaseQuantity(1);
      this.mobilePlansService.setPlanExpectedDevice(null);
      this.mobilePlansService.setBasePlan(this.mobilePlansService.getNoPlanMobilePlan());
      this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.COMPATIBLE_DEVIE}`]);
    } else { // user ordered the SIM and wants to start migration service but didn't confirm the planDevice
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
      this.userPlan.migrationDevice = this.compatibileDevice.id;
      this.userPlansService.updateUserPlan(this.userPlan.userId, this.userPlan);
      this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.SIM_RECEIVED}`, params]);
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
}
