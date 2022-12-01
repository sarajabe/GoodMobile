import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AccountPaymentService,
  ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, FirebaseUserProfileService,
  IAutoCompletePrediction,
  IChangeDevice,
  IDeviceCompatibilityV1, IFirebaseAddress, IShippingMethod, IUser, IUserAccount, IUserPlan, MobileCustomPlansService,
  PlacesAutocompleteService,
  PURCHASE_INTENT, ShippingConfigurationService, UserAccountService, UserDeviceService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { EquipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { Observable } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { FadeInOutAnimation } from 'src/app/app.animations';
import { ACCOUNT_ROUTE_URLS, CHECKOUT_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';
import { AccountHeaderService } from '../account-header.service';

@Component({
  selector: 'app-account-manage-device',
  templateUrl: './account-manage-device.component.html',
  animations: [FadeInOutAnimation],
  styleUrls: ['./account-manage-device.component.scss']
})
export class AccountManageDeviceComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  @ViewChild('compatibilityForm') compatibilityForm: NgForm;

  public user: IUser;
  public selectedPendingChangePlan: IUserPlan;
  public selectedPlan: IUserPlan;
  public userAccount: IUserAccount;
  public userCart: CustomizableMobilePlan;
  public compatibleDevice: IDeviceCompatibilityV1;
  public iccid: string;
  public equipment: string;
  public deviceName: string;
  public deviceNetwork: string;
  public selectedDeviceName: string;
  public newSimOrder: { price: number, fees: number };
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public isAccountLoading = false;
  public loadingPlan = true;
  public userHasPendingPlans = false;
  public userHasActivePlans = false;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public captchaValid = false;
  public invalidAddress = false;
  public displayedAddressModel: any;
  public address: any;
  public setFoucs = false;
  public isESimCapable = false;
  public simOptionsForm: FormGroup;
  public simOption: string;
  public simOptions = [{ id: 'esim', value: 'eSIM' }, { id: 'physical', value: 'Physical SIM' }];

  public deviceExpanded = true;
  public showCompatibleForm = false;
  public showErrorBanner = false;
  public errorMessage = '';
  public showWarningBanner = false;
  public checkedDevice = {} as IDeviceCompatibilityV1;
  public simExpanded = true;
  public showSuccessBanner: boolean;
  public showReplacementForm = false;
  public lteExpanded = true;
  public eSIMOrdered = false;
  private captchaResponse: string;
  private attSim: IDeviceCompatibilityV1;
  private tmoSim: IDeviceCompatibilityV1;
  private userHasPlans = false;
  private alive = true;
  private methodsObserver: Subscription;
  private streetSearchText: string;
  
  constructor(private userAccountService: UserAccountService,
    private userPlansService: UserPlansService,
    private accountHeaderService: AccountHeaderService,
    private router: Router,
    private toastHelper: ToastrHelperService,
    private shippingConfigurationService: ShippingConfigurationService,
    private userDeviceService: UserDeviceService,
    private mobilePlansService: MobileCustomPlansService,
    private mobileCustomPlansService: MobileCustomPlansService,
    private modalHelper: ModalHelperService,
    private appState: AppState,
    private metaService: MetaService,
    private analyticsService: ActionsAnalyticsService,
    private userProfileService: FirebaseUserProfileService,
    private placesAutoCompleteService: PlacesAutocompleteService,
    private accountPaymentService: AccountPaymentService,
    private equipmentService: EquipmentService) {

    this.userPlansService.selectedUserPlanObservable.subscribe((plan) => this.selectedPlan = plan);
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      if (userPlanReady && !!this.userPlansService.selectedUserPlan) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
        if (!!this.selectedPlan && this.selectedPlan.planDevice) {
          this.selectedDeviceName = this.selectedPlan.planDevice.model.split('(')[0];
        }
        this.selectedPendingChangePlan = this.userPlansService.selectedPendingUserPlan;
      } else {
        this.userPlansService.selectFirstUserPlan(true);
      }
    });
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
      if (!!plans && !!this.selectedPlan) {
        this.selectedPlan = plans.find((plan) => plan.id === this.selectedPlan.id);
        this.eSIMOrdered = !!this.selectedPlan && !this.selectedPlan?.canceled  && !!this.selectedPlan?.planDevice && this.selectedPlan?.planDevice?.network === 'tmo' && !this.selectedPlan?.qrScanned && this.selectedPlan?.mdn && !!this.selectedPlan?.eSimDetails && !!this.selectedPlan.planDevice.pendingNewSim;
      }
    });
    this.mobilePlansService.currentPlan.subscribe((cart) => {
      this.userCart = cart;
      if (!!this.userCart && this.userCart.activePlanId && this.selectedPlan.id !== this.userCart.activePlanId) {
        this.userPlansService.selectUserPlan(this.userCart.activePlanId);
      }
    });
    this.simOptionsForm = new FormGroup({
      option: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setPageDescription(this.getDescription());
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.accountHeaderService.setPageTitle('Manage device & SIM');
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.user = user;
    });
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
      this.deviceNetwork = this.userAccount.network;
      if (!!this.userAccount?.deviceDetails?.eSimCapable && this.userAccount?.network === 'tmo') {
        this.isESimCapable = true;
      }
    });
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
      this.userHasPlans = plans.length > 0;

      const pendingActivationPlans = plans.filter((plan) => !plan.mdn);
      const activatedPlans = plans.filter((plan) => !!plan.mdn);

      this.userHasPendingPlans = (!!pendingActivationPlans && pendingActivationPlans.length > 0);
      this.userHasActivePlans = (!!activatedPlans && activatedPlans.length > 0);
    });
    this.methodsObserver = this.shippingConfigurationService.newSimOrder.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.newSimOrder = order;
    });
    this.mobilePlansService.currentPlan.subscribe((cart) => this.userCart = cart);
    this.userAccountService.isSyncingAccount.pipe(takeWhile(() => this.alive)).subscribe((isSyncing) => this.isAccountLoading = this.appState.loading = isSyncing);
    setInterval(() => {
      if (!!this.reCaptcha) {
        this.reCaptcha.resetReCaptcha(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
      }
    }, 1.8 * 60 * 1000);
  }
  ngOnDestroy(): void {
    this.alive = false;
    if (!!this.methodsObserver) {
      this.methodsObserver.unsubscribe();
    }
  }
  public onOptionChange(): void {
    this.simOption = this.simOptionsForm.get('option').value;
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
    this.hideBanners();
  }
  public activateReplacementEsim(): void {
    const mdn: string = (new PhonePipe()).transform(this.selectedPlan.mdn);
    if (!!this.selectedPlan.eSimDetails && this.selectedPlan.eSimDetails.iccid !== this.selectedPlan.planDevice.simNumber) {
      this.modalHelper.showeSIMModal(this.selectedPlan.eSimDetails.iccid, mdn, 'esim-replacement').result.then((response) => {
        if (!!response) {
          this.swapSIM(this.selectedPlan.eSimDetails.iccid, response);
        }
      })
    } else {
      this.goToQrScan();
    }
  }
  public changeDevice(iccid, recaptcha): void {
    this.appState.loading = true;
    this.userDeviceService.isSupportedDeviceWithZipCode(this.selectedPlan.planDevice.id, this.selectedPlan.planDevice.postalCode,
      this.selectedPlan.planDevice.network, recaptcha).then((response) => {
        const changeRequest: IChangeDevice = {
          mdn: this.selectedPlan.mdn, equipment: this.selectedPlan.planDevice.id,
          handsetOS: !!this.selectedPlan.planDevice.os ? this.selectedPlan.planDevice.os : '', iccid
        };
        let device = {} as IDeviceCompatibilityV1;
        if (!!response && response.meta.count > 0) {
          device = response.carrierValidity[0];
        }
        this.userDeviceService.changeUserDevice(changeRequest, this.selectedPlan.id).then(() => {
          this.appState.loading = false;
          this.selectedPlan.planDevice = !!this.selectedPlan.planDevice ? Object.assign(this.selectedPlan.planDevice, device) : device;
          this.selectedPlan.planDevice.pendingNewSim = false;
          this.selectedPlan.planDevice.simNumber = iccid;
          delete this.selectedPlan.eSimDetails;
          this.userPlansService.updateUserPlan(this.selectedPlan.userId, this.selectedPlan).then(() => {
            const mdn: string = (new PhonePipe()).transform(this.selectedPlan.mdn);
            const customHtml = '<div class="subHeader"><p>Your SIM is now active on Phone Number ' + mdn + '.</p></div>' +
              '<div class="details"><p>Please insert your new SIM in your phone, and turn the phone on. If the SIM was already in the phone, ' +
              'please turn the phone off and then back on again, ' +
              'and wait 30 seconds for network programming. If this is also a new phone, your new phone would need data settings programmed.' +
              ' If it is the same phone, the data settings would not be impacted, and would not need to be applied again. If you experience any trouble with the service,' +
              ' please give us a call at <a href="tel=8004163003"> (800)-416-3003</a></p></div>';
            this.modalHelper.showInformationMessageModal('SIM swap is completed!', '', 'Done', null, true, 'success-swap-modal', customHtml).result.then((result) => {
              this.userPlansService.selectUserPlan(this.selectedPlan.id);
            });
          }, (error) => {
            this.appState.loading = false;
            this.toastHelper.showAlert(error.message || error.error ? error.error.message : error);
          });

        }, (error) => {
          this.appState.loading = false;
          this.toastHelper.showAlert(error.message);
        });
      }, (error) => {
        this.appState.loading = false;
        this.toastHelper.showAlert(error.message || error.error ? error.error.message : error);
      });
  }
  public replaceSIM(): void {
    const mdn: string = (new PhonePipe()).transform(this.selectedPlan.mdn);
    const customHTML = '<div class="question"><p>Is this the Phone Number you Want your SIM active with?</p></div><div class="number"><p>' + mdn + '</p></div>';
    this.modalHelper.showInformationMessageModal('', '', 'Yes', null, true, 'SIM-replacement-modal', customHTML, true, 'No').result.then((result) => {
      if (!!result && result === true) {
        this.modalHelper.showSIMModal('Enter your Replacement SIM’s ICCID', '', 'Activate', 'primary', 'Sim-replacement-iccid-modal',
          this.selectedPlan.planDevice.network, 'Replacement SIM ICCID', true).result.then((selection) => {
            if (!!selection && selection !== false && selection.input) {
              const modalHTML = '<div class="question"><p class="subhead">You are about to swap to SIM <p class="iccid"><b>[' + selection.input + ']</b></p> on Phone Number <b>' + mdn +
                '</b></p><p class="confirm">Is this correct?"</p></div>';
              this.modalHelper.showInformationMessageModal('', '',
                'Yes', null, true, 'confirm-swap-modal', modalHTML, true, 'No',
                'Please make sure this is the phone number you want your new SIM associated to.  This change cannot be undone.').result.then((res) => {
                  if (!!res && res === true) {
                    if (!this.selectedPlan.planDevice.postalCode) {
                      this.modalHelper.showInputModal('Postal code', `Enter postal code of your area`, 'Submit', 'primary', 'Sim-replacement-iccid-modal')
                        .result.then((data) => {
                          if (!!data) {
                            this.selectedPlan.planDevice.postalCode = data;
                            this.changeDevice(selection.input, selection.captcha);
                          }
                        });
                    } else {
                      this.changeDevice(selection.input, selection.captcha);
                    }
                  }
                });
            }
          });
      }
    });
  }
  public swapSIM(iccid, recaptcha): void {
    const changeRequest: IChangeDevice = {
      mdn: this.selectedPlan.mdn, equipment: this.selectedPlan.planDevice.id,
      handsetOS: !!this.selectedPlan.planDevice.os ? this.selectedPlan.planDevice.os : '', iccid
    };
    this.appState.loading = true;
    this.userDeviceService.changeUserDevice(changeRequest, this.selectedPlan.id).then(() => {
      this.appState.loading = false;
      this.selectedPlan.planDevice.pendingNewSim = false;
      this.selectedPlan.planDevice.simNumber = iccid;
      this.selectedPlan.iccid = iccid;
      this.userPlansService.updateUserPlan(this.selectedPlan.userId, this.selectedPlan).then(() => {
        this.userPlansService.selectUserPlan(this.selectedPlan.id);
        const customHtml = `<div class="content"><p class="info">Your Service is now active.</p>
        <p class="info">The SIM will be changed immediately.</p>
        <p class="focus"><b>You must have your phone ready to scan the QR code to load the eSIM on your phone</b></p></div>`;
        this.modalHelper.showInformationMessageModal('Ready to set up your eSIM', '', 'Setup now', null, true, 'confirm-esim', customHtml).result.then((response) => {
          if (!!response) {
            this.goToQrScan()
          }
        });

      }, (error) => {
        this.appState.loading = false;
        this.toastHelper.showAlert(error.message || error.error ? error.error.message : error);
      });

    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message);
    });
  }
  public getDescription(): string {
    if (this.userHasPlans) {
      const storeLocatorUrl = '/' + SUPPORT_ROUTE_URLS.STORE_LOCATOR;
      return `<div class="page-description">You should have received a SIM card through mail by now, or purchased one from
     <a href="${storeLocatorUrl}"> an authorised retail store</a> near you in order to activated your pending plan?</div>`;
    } else {
      return `<div class="page-description plan-selector-space">You can always update your account details and settings here. You can also manage
      devices and activated accounts or add numbers to your existing account.</div>`;
    }
  }
  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan.mdn) {
      if (!this.selectedPlan || (!!userPlan && userPlan.id !== this.selectedPlan.id)) {
        if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
          this.modalHelper.showConfirmMessageModal('Clear Cart', 'Changing your selected account will clear the items in your cart. Do you want to proceed?',
            'Yes', 'No', 'clean-cart-modal')
            .result.then((result) => {
              if (result) {
                if (!!this.userCart.voucherData) {
                  this.mobilePlansService.removeVoucherCode();
                }
                const removedItems = [];
                if (this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
                  removedItems.push(this.userCart.basePlan);
                } else {
                  if (this.userCart.simsQuantity > 0) {
                    removedItems.push({ id: 'SIMGWLTMO4GLTE', quantity: this.userCart.simsQuantity, price: this.newSimOrder.price, type: 'plan-item', title: 'SIM CARD' });
                  }
                  if (!!this.userCart.addOns) {
                    removedItems.push(this.userCart.addOns);
                  }
                }
                this.analyticsService.trackRermoveFromCartGA4(removedItems);
                this.appState.clearSessionStorage();
                this.mobilePlansService.clearUserCart();
                this.userPlansService.selectUserPlan(userPlan.id);
              } else {
                this.userPlansService.selectUserPlan(this.selectedPlan.id);
              }
            }, (error) => {
              console.error('error', error);
            });
        } else {
          this.userPlansService.selectUserPlan(userPlan.id);
        }
      } else {
        if (!userPlan) {
          console.warn('User trying to select undefined user plan, that\'s weird!!');
        }
      }
    } else {
      this.userPlansService.selectFirstUserPlan(true);
    }
  }
  public checkPhoneCompatibility(): void {
    this.compatibilityForm.form.markAllAsTouched();
    if (!!this.compatibilityForm.valid && !!this.displayedAddressModel) {
      this.appState.loading = true;
      this.deviceNetwork = !!this.userAccount.network ? this.userAccount.network : this.selectedPlan.planDevice.network;
      if (this.equipment.indexOf(' ') >= 0) {
        this.equipment = this.equipment.replace(/\s+/g, '');
      }
      this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
        this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
        this.displayedAddressModel?.state, this.displayedAddressModel?.address2, this.equipment).then(res => {
          if (!!res) {
            this.appState.loading = false;
            if (!!res[this.deviceNetwork].covered) {
              this.showErrorBanner = false;
              this.address = '';
              this.equipment = '';
              this.showSuccessBanner = true;
              this.checkedDevice = res.details as IDeviceCompatibilityV1;
            } else {
              this.showWarningBanner = true;
            }
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
          }
        }, (error) => {
          this.showErrorBanner = true;
          this.appState.loading = false;
          this.errorMessage = '';
          if (error?.error?.errors[0]?.code === 102) {
            if (error?.error?.errors[0]?.params[0].param_name.includes('equipment')) {
              this.errorMessage = 'The device serial number does not seem to be valid';
            } else if (error?.error?.errors[0]?.params[0].message === 'Invalid zip code') {
              this.errorMessage = 'Sorry, Your address does not have good coverage';
            }
          } else {
            this.errorMessage = error?.error?.errors[0]?.message;
          }
          this.reCaptcha.resetReCaptcha();
          this.reCaptcha.execute();
        });
    }
  }

  public getReplacement(): void {
    if (!this.selectedPlan.canceled) {
      if (!!this.isESimCapable) {
        this.showReplacementForm = true;
      } else {
        this.showReplacementForm = false;
        this.goToCart();
      }
    }
  }
  public openDeviceForm(): void{
    if (!this.selectedPlan.canceled) {
      this.showCompatibleForm = true;
    }
  }
  public goToQrScan(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.PLAN_ID]= this.selectedPlan.id;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ESIM_SETUP}`, params]);
  }
  public goToCart(): void {
    if (!!this.isESimCapable) {
      this.simOptionsForm.markAllAsTouched();
      if (!!this.simOptionsForm.valid) {
        if (this.simOption === 'esim') {
          this.setReplacementSim(true);
        } else if (this.simOption === 'physical') {
          this.setReplacementSim();
        }
      }
    } else {
      this.setReplacementSim();
    }
  }
  public goToContactUs(): void {
    this.router.navigate([SUPPORT_ROUTE_URLS.BASE+'/'+SUPPORT_ROUTE_URLS.CONTACT_US]);
  }
  public hideBanners() {
    this.showErrorBanner = false;
    this.showWarningBanner = false;
    this.showSuccessBanner = false;
    this.checkedDevice = {} as IDeviceCompatibilityV1;
  }
  private setReplacementSim(eSim?: boolean): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
    this.tmoSim =  { network: 'tmo', networkType: 'GSM', skuIdentifier: 'T', skuNumber: 'SIMGWLTMO4GLTE' } as IDeviceCompatibilityV1;
    this.attSim = { network: 'att', networkType: 'GSM', skuIdentifier: 'G', skuNumber: 'SIMGWLTMO4GLTE' } as IDeviceCompatibilityV1;
    const device = this.selectedPlan.planDevice.network === 'att' ? this.attSim : this.tmoSim;
    if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Adding new sim will remove any plan in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
        .result.then((result) => {
          if (result) {
            this.appState.clearSessionStorage();
            if (!!this.userCart.voucherData) {
              this.mobilePlansService.removeVoucherCode();
            }
            this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
            this.mobilePlansService.setBasePlan(this.mobilePlansService.getNoPlanMobilePlan());
            this.mobilePlansService.setCartType(CART_TYPES.PLAN_ITEMS);
            this.mobilePlansService.setSimPurchaseQuantity(1);
            this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
            this.mobilePlansService.setPlanDevice(device);
            if (!!eSim) {
              this.mobileCustomPlansService.seteSIM(true);
              this.mobileCustomPlansService.setQrScanned(false);
            } else {
              this.mobileCustomPlansService.seteSIM(false);
            }
            this.appState.clearSessionStorage();
            this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.REPLACEMENT, [{
              id: device.skuNumber, quantity: this.userCart.simsQuantity,
              price: this.newSimOrder.price, type: 'plan-item', title: 'SIM CARD'
            }]);
            sessionStorage.setItem('plan_id', this.selectedPlan.id);
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
          }
        }, (error) => {
          console.error('error', error);
        });
    } else {
      this.appState.clearSessionStorage();
      this.mobilePlansService.setCartType(CART_TYPES.PLAN_ITEMS);
      this.mobilePlansService.setSimPurchaseQuantity(1);
      this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
      this.mobilePlansService.setPlanDevice(device);
      if (!!eSim) {
        this.mobileCustomPlansService.seteSIM(true);
        this.mobileCustomPlansService.setQrScanned(false);
      } else {
        this.mobileCustomPlansService.seteSIM(false);
      }
      sessionStorage.setItem('plan_id', this.selectedPlan.id);
      this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.REPLACEMENT, [{
        id: device.skuNumber, quantity: this.userCart.simsQuantity,
        price: this.newSimOrder.price, type: 'plan-item', title: 'SIM CARD'
      }]);
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    }
  }
  public goToDataSetup(): void {
    let network;
    let os = 'android';
    if (this.selectedPlan.planDevice.manufacturer.substr(0, 5) === 'Apple') {
      os = 'ios';
    }
    network = this.selectedPlan.planDevice.network.toLowerCase();
    const params = {};
    params[ROUTE_URLS.PARAMS.NETWORK] = network;
    params[ROUTE_URLS.PARAMS.PHONE_OS] = os;
    if (network === 'att') {
      if (os === 'ios') {
        this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.IPHONE}`]);
      } else {
        this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.ANDROID}`]);
      }
    } else {
      if (os === 'ios') {
        this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TMO_IPHONE}`]);
      } else {
        this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TMO_Android}`]);
      }
    }
  }
  public addActivatedAccount(): void {
    this.modalHelper.showAddActivatedNumberModal('add-number-modal').result.then((result) => {
      if (!!result) {
        this.userPlansService.bffAddUserPlanMDN(result).then((userPlanId) => this.userPlansService.selectUserPlan(userPlanId),
          (error) => this.toastHelper.showAlert(error.error.message));
      }
    }).catch((error) => {
    });
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
