import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IUser,
  IUserAccount,
  IUserPlan,
  UserAccountService,
  UserPlansService,
  UserDeviceService,
  MobileCustomPlansService,
  CustomizableMobilePlan,
  CART_TYPES,
  IDeviceCompatibilityV1,
  ActionsAnalyticsService,
  IAutoCompletePrediction,
  PlacesAutocompleteService,
  IFirebaseAddress,
  AccountPaymentService
} from '@ztarmobile/zwp-service-backend';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../../app.routes.names';
import { AccountHeaderService } from '../account-header.service';
import { FadeInOutAnimation } from '../../../app/app.animations';
import { AppState } from '../../app.service';
import { MetaService } from '../../../services/meta-service.service';
import { ToastrHelperService } from '../../../services/toast-helper.service';
import { takeWhile, filter } from 'rxjs/operators';
import { CAPTCHA_SITE_ID, INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { Observable, Subscription } from 'rxjs';
import { EquipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-account-phone-details',
  templateUrl: './account-phone-details.component.html',
  styleUrls: ['./account-phone-details.component.scss'],
  animations: [FadeInOutAnimation]
})
export class AccountPhoneDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  @ViewChild('compatibilityForm') compatibilityForm: NgForm;

  public user: IUser;
  public selectedPlan: IUserPlan;
  public selectedPendingChangePlan: IUserPlan;
  public userAccount: IUserAccount;
  public equipment: string;
  public iccid: string;
  public device: any;
  public userCart: CustomizableMobilePlan;
  public deviceNetwork: string;
  public compatibleDevice: IDeviceCompatibilityV1;
  public zipCode: string;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public isAccountLoading = false;
  public loadingPlan = true;
  public processingRequest = false;
  public userHasPendingPlans = false;
  public userHasActivePlans = false;
  public iccidRequired = false;
  public invalidIMEI = false;
  public deviceCheckComplete = false;
  public deviceChanged = false;
  public sameTypeDevice = true;
  public differentSIM = false;
  public alreadyActive = false;
  public invalidZipCode = false;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  private captchaResponse: string;
  public captchaValid = false;
  public invalidAddress = false;
  public displayedAddressModel: any;
  public address: any;
  public setFoucs = false;
  public filteredOptions: Observable<Array<IAutoCompletePrediction>>;
  public filteredOptionsSubscription: Subscription;
  
  private alive = true;
  private streetSearchText: string;

  constructor(private userAccountService: UserAccountService,
    private userPlansService: UserPlansService,
    private accountHeaderService: AccountHeaderService,
    private userDeviceService: UserDeviceService,
    private mobileCustomPlansService: MobileCustomPlansService,
    private toastHelper: ToastrHelperService,
    private metaService: MetaService,
    private modalHelper: ModalHelperService,
    private appState: AppState,
    private analyticService: ActionsAnalyticsService,
    private mobilePlansService: MobileCustomPlansService,
    private placesAutoCompleteService: PlacesAutocompleteService,
    private accountPaymentService: AccountPaymentService,
    private equipmentService: EquipmentService) {
    this.userPlansService.selectedUserPlanObservable.subscribe((plan) => this.selectedPlan = plan);
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      if (userPlanReady && !!this.userPlansService.selectedUserPlan) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
        this.selectedPendingChangePlan = this.userPlansService.selectedPendingUserPlan;
      } else {
        this.userPlansService.selectFirstUserPlan(true);
      }
    });
    this.mobilePlansService.currentPlan.subscribe((cart) => this.userCart = cart);
    this.accountHeaderService.setPageTitle('Phone Details');
  }
  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setPageDescription('');
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
      this.deviceNetwork = this.userAccount.network;
    });
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).pipe(filter((plans) => !!plans)).subscribe((plans) => {
      if (!!this.selectedPlan) {
        this.selectedPlan = plans.find((plan) => plan.id === this.selectedPlan.id);
      }
      const pendingActivationPlans = plans.filter((plan) => !plan.mdn);
      const activatedPlans = plans.filter((plan) => !!plan.mdn);

      this.userHasPendingPlans = (!!pendingActivationPlans && pendingActivationPlans.length > 0);
      this.userHasActivePlans = (!!activatedPlans && activatedPlans.length > 0);
    });
    this.userAccountService.isSyncingAccount.pipe(takeWhile(() => this.alive)).subscribe((isSyncing) => this.isAccountLoading = isSyncing);
    setInterval(() => {
      this.reCaptcha.execute(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
    }, 1.8 * 60 * 1000);
  }
  ngOnDestroy(): void {
    this.alive = false;
    this.filteredOptionsSubscription?.unsubscribe();
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
  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan.mdn) {
      if (!this.selectedPlan || (!!userPlan && userPlan.id !== this.selectedPlan.id)) {
        if (!!this.userCart && this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
          this.modalHelper.showConfirmMessageModal('Clear Cart', 'Changing your selected account will clear the items in your cart. Do you want to proceed?',
            'Yes', 'No', 'clean-cart-modal')
            .afterClosed().subscribe((result) => {
              if (result) {
                this.mobilePlansService.clearUserCart();
                this.appState.clearSessionStorage();
                if (!!this.userCart.voucherData) {
                  this.mobilePlansService.removeVoucherCode();
                }
                const removedItems = [];
                if (this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
                  removedItems.push(this.userCart.basePlan);
                } else {
                  if (this.userCart.simsQuantity > 0) {
                    removedItems.push({ id: 'SIMGWLTMO4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
                  }
                  if (!!this.userCart.addOns) {
                    removedItems.push(this.userCart.addOns);
                  }
                }
                this.analyticService.trackRermoveFromCartGA4(removedItems);
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
  public changedAddress(): void {
    this.findPlace(this.address);
    this.displayedAddressModel = null;
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }

  public checkPhoneCompatibility(): void {
    this.compatibilityForm.form.markAllAsTouched();
    if (!!this.compatibilityForm.valid && !!this.displayedAddressModel) {
      this.deviceNetwork = !!this.userAccount.network ? this.userAccount.network : this.selectedPlan.planDevice.network;
      this.processingRequest = true;
      this.deviceChanged = false;
      if (this.equipment.indexOf(' ') >= 0) {
        this.equipment = this.equipment.replace(/\s+/g, '');
      }

      this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
        this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
        this.displayedAddressModel?.state, this.displayedAddressModel?.address2, this.equipment).then(res => {
          this.processingRequest = false;
          if (!!res) {
            this.processingRequest = false;
            if (!!res[this.deviceNetwork].covered) {
              this.deviceCheckComplete = true;
              this.address = '';
              this.equipment = '';
            } else {
              this.deviceCheckComplete = false;
              this.toastHelper.showAlert('No coverage available for this address');
            }
            } else {
              this.deviceCheckComplete = false;
            }
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
        }, (error) => {
          this.deviceCheckComplete = false;
          this.processingRequest = false;
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
          this.reCaptcha.resetReCaptcha();
          this.reCaptcha.execute();
        });
    }
  }
  public changePhone(): void {
    this.deviceCheckComplete = false;
    if ((this.device.iccidRequired && !!this.iccid && this.iccid.length >= 19) || !this.device.iccidRequired) {
      // shopping cart
      if (!!this.selectedPlan.id && !!this.userAccount) {
        this.userPlansService.setPlanDeviceFromBFF(this.selectedPlan.id, { planDevice: this.device }).then(() => {
          this.deviceChanged = true;
        }, (error) => {
          this.deviceChanged = false;
          this.toastHelper.showAlert(error.message);
        });
        this.userPlansService.selectUserPlan(this.selectedPlan.id);
      } else {
        this.mobileCustomPlansService.setPlanDevice(this.device); // change plan in cart
        // this flag shows the success results
        this.deviceChanged = true;
      }
    } else {
      this.deviceChanged = false;
    }
  }
  public onZipCodeChange(): void {
    if (!this.processingRequest) {
      this.invalidZipCode = !(/^\d{5}(-\d{4})?$/.test(this.zipCode));
    }
  }
  public addActivatedAccount(): void {
    this.modalHelper.showAddActivatedNumberModal('add-number-modal').afterClosed().subscribe((result) => {
      if (!!result) {
        this.userPlansService.bffAddUserPlanMDN(result).then((userPlanId) => this.userPlansService.selectUserPlan(userPlanId),
          (error) => this.toastHelper.showAlert(error.error.message));
      }
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
