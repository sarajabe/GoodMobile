/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  AccountPaymentService, ActionsAnalyticsService, CART_TYPES, ChangePlanService, CustomizableMobilePlan,
  FirebaseUserProfileService, GenericMobilePlanItem, IAccountAddOn, IBasePlan, IChangeDevice, IDeviceCompatibilityV1, IFirebaseAddress, IFirebasePaymentMethod, IPaymentMethod,
  IPlanAddOn, IPortInUserAccountRequest, IUser, IUserAccount, IUserPlan, IVoucherData, MobileCustomPlansService,
  MobilePlanDetails, PlansConfigurationService, PURCHASE_INTENT, UserAccountPortInService, UserAccountService, UserDeviceService,
  UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { Subscription } from 'rxjs';
import { FadeInOutAnimation } from '../../app.animations';
import { AppState } from '../../app.service';
import { CUSTOMER_CARE_NUMBER } from '../../../environments/environment';
import { MetaService } from '../../../services/meta-service.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { ToastrHelperService } from '../../../services/toast-helper.service';
import { CheckoutService } from '../../shop/checkout/checkout.service';
import { AccountHeaderService } from '../account-header.service';
import { PhonePipe } from '../../../widgets/pipes/phone.pipe';
import { filter, take, takeWhile } from 'rxjs/operators';
import {
  ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, DUPLICATE_PAYMENTS_ROUTE_URLS, MIGRATION_ROUTE_URLS, OFFERS_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS,
  ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS
} from '../../app.routes.names';
import { NgForm } from '@angular/forms';
import { param } from 'cypress/types/jquery';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  animations: [FadeInOutAnimation],
  styleUrls: ['./account-summary.component.scss']
})
export class AccountSummaryComponent implements OnInit, OnDestroy {
  public customerCareNumber: string = CUSTOMER_CARE_NUMBER;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public methodsList: IPaymentMethod[];
  public user: IUser;
  public selectedPlan: IUserPlan;
  public updatedPlan: IUserPlan;
  public userPlans: Array<IUserPlan>;
  public userAccount: IUserAccount;
  public renewBreakDownAmounts: any;
  public surchargesFees: number;
  public govFess: number;
  public isAccountLoading = false;
  public loadingPlan = true;
  public paymentMethod: IFirebasePaymentMethod;
  public filteredPlan: IBasePlan;
  public shippingAddress: IFirebaseAddress;
  public shippingAddressList: IFirebaseAddress[];
  public processingRequest = false;
  public userHasPendingPlans = false;
  public userHasActivePlans = false;
  public allowEditingAddresses = true;
  public showAccountPin = false;
  public showShippingAddresses = false;
  public accountPin: string;
  public isEditingPin = false;
  public canMigrate = false;
  public userCart: CustomizableMobilePlan;
  public animationState = 'small';
  public autoRenewEnabled: boolean;
  public autoRenew: boolean;
  public dataAddons: Array<IAccountAddOn>;
  public payGoAddons: Array<IAccountAddOn>;
  public internationalAddons: Array<IAccountAddOn>;
  public allAddons: Array<IPlanAddOn>;
  public dataAddonPlans: Array<IPlanAddOn>;
  public gigPlanAddon: IPlanAddOn;
  public payGoAddonPlan: IPlanAddOn;
  public unlimitedCalls: IPlanAddOn;
  public renewalDate: Date;
  public updatedRenewalDate: Date;
  public portIn: IPortInUserAccountRequest = { address: {} } as IPortInUserAccountRequest;
  public pastDueDays: number;
  public innerWidth: any;
  public planSubscription: Subscription;
  public count: number;
  public currentPin: string;
  public pinCode: string;
  public pinCodeConfirm: string;
  public dataRemainingBalance: any;
  public dataRemainingBalanceOfLteInGB: any;
  public editPinNumberClicked = false;
  public equalCurrentPin = false;
  public successfulSIMSwap = false;
  public hideManageYourPlanCard = false;
  public hideUpcomingCardSection = false;
  public hideUsageCardSection = false;
  public hideAddonsCard = false;
  public hideCreditCardSection = false;
  public hideDeviceCardSection = false;
  public hideCreditBalanceSection = false;
  public hidePinCardSection = false;
  public hideshippingAddressSection = false;
  public hideWifiCallingSection = false;
  public accountChanges = false;
  public termsAndConditions = false;
  public receipts = false;
  public promotional = false;
  public PIN_VALIDATE = {
    EMPTY: 0,
    VALID: 1,
    INVALID: 2
  };
  public isNotInterested = false;
  public trialPlanDaysLeft: number;
  public wifiEnabled = false;
  public fiveGEnabled = false;
  public newlyActivatedMdn: string;
  public isChecked = false;
  public selectedPlanId: string;
  public isEBBPlan = false;
  public upgradePromoPlan: IBasePlan;
  public upgradePrice: number;
  public disableFiveGToggle = false;
  @ViewChild('pinCodeForm', { static: true }) pinCodeForm: NgForm;
  private isPortedPlan = false;
  private allBasePlans: Array<IBasePlan>;
  private userHasPlans = false;
  private alive = true;
  isApplicablePromo = false;

  constructor(
    private userAccountService: UserAccountService,
    private changePlanService: ChangePlanService,
    private userAccountPortInService: UserAccountPortInService,
    private router: Router,
    private route: ActivatedRoute,
    private plansConfigurationService: PlansConfigurationService,
    private appState: AppState,
    private userPlansService: UserPlansService,
    private accountHeaderService: AccountHeaderService,
    private accountPaymentService: AccountPaymentService,
    private toastHelper: ToastrHelperService,
    private modalHelper: ModalHelperService,
    private metaService: MetaService,
    private userProfileService: FirebaseUserProfileService,
    private checkoutService: CheckoutService,
    private userDeviceService: UserDeviceService,
    private mobilePlansService: MobileCustomPlansService,
    private analyticService: ActionsAnalyticsService) {

    this.accountHeaderService.setPageTitle('Account summary');
    this.userPlansService.selectedUserPlanObservable.pipe(takeWhile(() => this.alive)).subscribe((userPlan) => {
      this.selectedPlan = userPlan;    
      if (userPlan) {
        this.getUserPlan();
      }
      // console.info('selectedPlan ', this.selectedPlan);
      if (!!this.selectedPlan && this.selectedPlan.migrate && this.selectedPlan.migrate.portInRequestNumber) {
        this.userPlansService.getMigrationDetails(this.selectedPlan.mdn).then((result) => {
        }, (error) => {
          this.toastHelper.showAlert(error.message);
        });
      }
      this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
        this.userHasPlans = plans.length > 0;
        const pendingActivationPlans = plans.filter((plan) => !plan.mdn);
        const activatedPlans = plans.filter((plan) => !!plan.mdn);
        this.userPlans = activatedPlans;
        this.userHasPendingPlans = (!!pendingActivationPlans && pendingActivationPlans.length > 0);
        this.userHasActivePlans = (!!activatedPlans && activatedPlans.length > 0);
        if (!!this.selectedPlan) {
          this.selectedPlan = plans.find((plan) => plan.id === this.selectedPlan.id);
          this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((conf) => {
            this.allBasePlans = conf.allPlans;
            if (!!this.allBasePlans) {
              this.filteredPlan = this.allBasePlans.find((plan) => plan.id === this.selectedPlan.basePlan.id);
              if (!!this.selectedPlan.basePlan && !!this.selectedPlan.basePlan.specialPromotion) {
                this.upgradePromoPlan = this.allBasePlans.find((plan) => plan.id === this.filteredPlan.parentId);
                this.upgradePrice =
                  !!this.selectedPlan.autoRenewPlan ? this.upgradePromoPlan.subscriptionPrice - this.upgradePromoPlan.promoPrice : this.upgradePromoPlan.subscriptionPrice;
              }
            }
          });
          if (!!this.isPortedPlan && !this.selectedPlan.portInRequestNumber) {
            this.userPlansService.selectUserPlan(this.selectedPlan.id);
            this.isPortedPlan = false;
            setTimeout(() => {
              this.userAccountService.userAccounts.pipe(take(1)).subscribe((accounts) => {
                const account = accounts.find((planAccount) => planAccount.mdn === this.selectedPlan.mdn);
                if (!!account) {
                  this.userAccount = account;
                }
              });
            }, 2000);
          }
        }
      });
    });
    this.planSubscription = this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      this.loadingPlan = !userPlanReady;
      this.showAccountPin = false;
      if (userPlanReady && !!this.userPlansService.selectedUserPlan) {
        this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
          // if (!!params && params[SHOP_ROUTE_URLS.PARAMS.SUCCESSFUL_PURCHASE]) {
          //   this.userPlanSelected(this.selectedPlan);
          //   this.getUserPlan();
          // }
          if (!!params && params[SHOP_ROUTE_URLS.PARAMS.MDN]) {
            this.newlyActivatedMdn = params[SHOP_ROUTE_URLS.PARAMS.MDN];
          }
        });
        this.selectedPlan = this.userPlansService.selectedUserPlan;
        this.autoRenewEnabled = this.selectedPlan.autoRenewPlan;
        this.autoRenew = this.selectedPlan.autoRenewPlan;
        if (!!this.newlyActivatedMdn && !this.isChecked && this.userPlans) {
          // eslint-disable-next-line no-shadow
          const plan = this.userPlans.find((plan) => plan.mdn === this.newlyActivatedMdn);
          if (plan.id !== this.selectedPlan.id) {
            this.userPlansService.selectUserPlan(plan.id);
          }
          this.isChecked = true;
        }
        if (!!this.selectedPlan.shippingAddressId) {
          this.userPlansService.getShippingAddressById(this.selectedPlan.shippingAddressId).then((address) => {
            this.shippingAddress = address;
          });
        }
        if (!!this.selectedPlan && this.selectedPlan.portInRequestNumber) {
          this.isPortedPlan = true;
        }
        this.paymentMethod = this.userPlansService.selectedPlanPaymentMethod;
        if (!!this.selectedPlan.portInRequestNumber) {
          this.appState.loading = true;
          this.count = 0;
          this.userAccountPortInService.checkPortInAccount(this.selectedPlan.id).then((portIn) => {
            setTimeout(() => {
              this.userPlansService.getUserPlan(this.selectedPlan.id).then((plan) => {
                this.selectedPlan = plan;
              });
              this.appState.loading = false;
            }, 200);
          }, (error) => {
            this.appState.loading = false;
            this.toastHelper.showAlert(error.message);
          });
          // interval(1000 * 60).subscribe(x => {
          //   if (this.count < 15 && !!this.selectedPlan.portInRequestNumber && !!this.selectedPlan.portInStatus) {
          //     this.count++;
          //     this.userPlansService.getUserPlan(this.selectedPlan.id).then((plan) => {
          //       this.selectedPlan = plan;
          //     });
          //   }
          // });
        } else {
          this.count = 15;
        }
      } else {
        this.loadingPlan = false;
      }
    });
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
      // console.info('userAccount ', this.userAccount);
      if (!!this.userAccount) {
        this.checkUsageData();
        this.wifiEnabled = this.userAccount.wifiCallingEnabled;
        this.fiveGEnabled = this.userAccount.tech5gEnabled;
        this.renewBreakDownAmounts = this.userAccount.plan.renewAmountBreakdown;
        if (!!this.renewBreakDownAmounts) {
          this.govFess = this.renewBreakDownAmounts.salesTax + this.renewBreakDownAmounts.ppSurcharge;
          this.surchargesFees = this.renewBreakDownAmounts.federalUsf + this.renewBreakDownAmounts.stateUsf + this.renewBreakDownAmounts.adminFee;
        }
        if (!!this.userAccount.deviceDetails.capableOf5G && this.selectedPlan.planDevice.network.toLowerCase() === 'tmo') {
          this.disableFiveGToggle = true;
          this.fiveGEnabled = true;
        }
        this.userAccountService.checkAvailablePromotion(this.selectedPlan.mdn).then((result) => {
          if (!!result && result.length > 0) {
            this.isApplicablePromo = true;
          } else {
            this.isApplicablePromo = false;
          }
        }, (error) => {
          this.isApplicablePromo = false;
        });
      }
      if (!!this.userAccount && (this.userAccount.plan.bundleId === '7DTRIALLTE' || this.userAccount.plan.bundleId === '7DTRIALLTEEXP')) {
        const date = new Date(this.userAccount.plan.subscriptionRenewalDate);
        this.trialPlanDaysLeft = this.calculateDiffInDays(date);
      }
      if (!!this.userAccount && this.userAccount.activeAddOns) {
        this.dataAddons = this.userAccount.activeAddOns.filter((addon) => addon.type === 'add-on-data');
        this.payGoAddons = this.userAccount.activeAddOns.filter((addon) => addon.id === 'G2GINTLPAYGO');
        this.internationalAddons = this.userAccount.activeAddOns.filter((addon) => addon.id === 'UNLILD65');
      }
    });
    this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((planConfig) => {
      this.allAddons = planConfig.planAddOns;
      this.dataAddonPlans = this.allAddons.filter((plan) => plan.type === 'add-on-data');
      this.gigPlanAddon = this.dataAddonPlans.find((plan) => plan.data === 1024);
      this.unlimitedCalls = this.allAddons.find((plan) => plan.id.includes('INTERNATIONAL'));
      this.payGoAddonPlan = this.allAddons.find((plan) => plan.id === 'GOODMOBILE-PAYASYOUGO-CALLING');
    });
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.userCart = cart;
      if (!!this.userCart && this.userCart.activePlanId && this.selectedPlan.id !== this.userCart.activePlanId) {
        this.userPlansService.selectUserPlan(this.userCart.activePlanId);
      }
    });
  }

  public getDescription(): string {
    if (this.userHasPlans) {
      const storeLocatorUrl = SUPPORT_ROUTE_URLS.BASE + '/' + SUPPORT_ROUTE_URLS.STORE_LOCATOR;
      return `<div class="page-description">You should have received a SIM card through mail by now, or purchased one from
     <a href="${storeLocatorUrl}"> an authorised retail store</a> near you in order to activated your pending plan?</div>`;
    } else {
      return `<div class="page-description plan-selector-space">You can always update your account details and settings here. You can also manage
      devices and activated accounts or add numbers to your existing account.</div>`;
    }
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    sessionStorage.setItem('isMigrationSimRemoved', 'false');
    this.innerWidth = window.innerWidth;
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.isNotInterested = JSON.parse(sessionStorage.getItem('notInterested'));
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.user = user;
      this.shippingAddressList = this.user.shippingAddresses;
      const paymentUpdateNeeded = sessionStorage.getItem('navigatedToPayment');
      if (!paymentUpdateNeeded) {
        if (!!this.user && this.user.paymentUpdateNeeded) {
          this.router.navigate([`${DUPLICATE_PAYMENTS_ROUTE_URLS.BASE}/${DUPLICATE_PAYMENTS_ROUTE_URLS.PAYMENT_ATTENTION}`]);
          sessionStorage.setItem('navigatedToPayment', 'true');
        }
      }
    });
    this.accountPaymentService.paymentMethodsList.pipe(takeWhile(() => this.alive)).subscribe((list) => {
      this.methodsList = list;
      // console.info('methods list ', this.methodsList);
    });
    this.userAccountService.isSyncingAccount.pipe(takeWhile(() => this.alive)).subscribe((isSyncing) => {
      this.appState.loading = isSyncing;
      this.isAccountLoading = isSyncing;
      if (!isSyncing && !!this.successfulSIMSwap) {
        const mdn: string = (new PhonePipe()).transform(this.selectedPlan.mdn);
        const customHtml = '<div class="subHeader"><p>Your SIM is now active on Phone Number ' + mdn + '.</p></div>' +
          '<div class="details"><p>Please insert your new SIM in your phone, and turn the phone on. If the SIM was already in the phone, ' +
          'please turn the phone off and then back on again, ' +
          'and wait 30 seconds for network programming. If this is also a new phone, your new phone would need data settings programmed.' +
          ' If it is the same phone, the data settings would not be impacted, and would not need to be applied again. If you experience any trouble with the service,' +
          ' please give us a call at <a href="tel=8004163003"> (800)-416-3003</a></p></div>';
        this.modalHelper.showInformationMessageModal('SIM swap is completed!', '', 'Done', null, true, 'success-swap-modal', customHtml).result.then((result) => {
          this.successfulSIMSwap = false;
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.alive = false;
    this.planSubscription.unsubscribe();
  }
  public refreshPage(): void {
    window.location.reload();
  }
  public userPlanSelected(userPlan: IUserPlan): void {
    this.selectedPlanId = userPlan.id;
    if (!!userPlan.mdn) {
      if (!this.selectedPlan || (!!userPlan && userPlan.id !== this.selectedPlan.id)) {
        if (!!this.userCart && this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
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
                    removedItems.push({ id: 'SIMG2G4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
                  }
                  if (!!this.userCart.addOns) {
                    removedItems.push(this.userCart.addOns);
                  }
                }
                this.analyticService.trackRermoveFromCart(removedItems);
                this.analyticService.trackRermoveFromCartGA4(removedItems);
                this.mobilePlansService.clearUserCart();
                this.appState.clearSessionStorage();
                this.checkoutService.updatePaymentMethod(null);
                this.userPlansService.selectUserPlan(userPlan.id);
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
  public revertCancellation(): void {
    this.modalHelper.showConfirmMessageModal('Revert plan cancellation', 'Would you like to revert you plan cancellation?', 'Yes', 'No', 'auto-renewel-modal')
      .result.then((result) => {
        if (result) {
          this.appState.loading = true;
          this.userPlansService.reverseCancelPlan(this.selectedPlan.mdn, this.selectedPlan.id).then(() => {
            this.appState.loading = false;
            this.toastHelper.showSuccess('Your plan cancellation is reverted successfully');
          }, (error) => {
            this.appState.loading = false;
            this.toastHelper.showAlert('Failed to revert your plan cancellation. Please try again');
          });
        } else {
          this.appState.loading = false;
        }
      });
  }
  public notInterested(): void {
    this.isNotInterested = true;
    sessionStorage.setItem('notInterested', 'true');
  }
 
  public showMigrationDataFlow(): void {
    this.modalHelper.showMigrationStepsModal('migration-flows-popup')
      .result.then((result) => {
        if (!!result) {
          this.orderSIMMigration();
        } else {
          this.notInterested();
        }
      }, (error) => {
        console.error('error', error);
      });
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
      this.activateEsim();
    }
   
  }
  public replaceSIM(): void {
    const mdn: string = (new PhonePipe()).transform(this.selectedPlan.mdn);
    const customHTML = '<div class="question"><p>Is this the Phone Number you Want your SIM active with?</p></div><div class="number"><p>' + mdn + '</p></div>';
    this.modalHelper.showInformationMessageModal('', '', 'Yes', null, true, 'SIM-replacement-modal', customHTML, true, 'No').result.then((result) => {
      if (!!result && result === true) {
        this.modalHelper.showSIMModal('', 'Enter your Replacement SIM’s ICCID', 'Activate', 'primary', 'Sim-replacement-iccid-modal',
          this.selectedPlan.planDevice.network, 'Replacement SIM ICCID', true).result.then((selection) => {
            if (!!selection && selection !== false && selection.input) {
              const modalHTML = '<div class="question"><p>You are about to swap to SIM <p class="iccid"><b>[' + selection.input + ']</b></p> on Phone Number <b>' + mdn +
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
            this.activateEsim()
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
            this.userPlansService.selectUserPlan(this.selectedPlan.id);
            this.successfulSIMSwap = true;

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
  public calculateDaysToPayment(): string {
    let nextPaymentText = '';
    if (!!this.userAccount && this.userAccount.plan) {
      const nextPaymentDays: number = this.userAccount.billingRenewDaysLeft;
      if (nextPaymentDays === 0) {
        nextPaymentText = 'Today';
      } else if (nextPaymentDays > 0 && !this.userAccount.pastDue) {
        nextPaymentText = 'In ' + nextPaymentDays + ' Days';
      } else if (this.userAccount.pastDue) {
        this.calculatePastDueDays();
        nextPaymentText = this.pastDueDays + ' Days Ago';
      } else if (nextPaymentDays < 0) {
        if (this.userAccount.billingRenewalPaid) {
          nextPaymentText = '-';
        } else {
          nextPaymentText = Math.abs(nextPaymentDays) + ' Days Ago';
        }
      }
    }
    return nextPaymentText;
  }

  public calculatePastDueDays(): void {
    const today = new Date();
    if (!!this.userAccount.plan.startDate) {
      const startDate = new Date(this.userAccount.plan.startDate);
      const diff = Math.abs(today.getTime() - startDate.getTime());
      const days = Math.ceil(diff / (1000 * 3600 * 24));
      this.pastDueDays = days;
    } else {
      this.pastDueDays = 0;
    }
  }
  public calculateDiffInDays(planRenewDate: Date): any {
    const oneDay = 1000 * 60 * 60 * 24;
    const planRenewTime = planRenewDate.getTime();
    const difference = planRenewTime - new Date().getTime();
    const result = Math.round(difference / oneDay);
    if (result >= 0) {
      return result;
    } else {
      return 0;
    }
  }

  public upgradeTrialPlan(): void {
    if (!!this.selectedPlan && !this.selectedPlan.upgradeDiscountUsed && !this.selectedPlan.canceled) {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_TRIAL}`, params]);
    }
  }

  public setDefaultShippingAddress(address): void {
    this.userProfileService.setDefaultShippingAddress(address.id).then(() => {
      this.selectedPlan.shippingAddressId = address.id;
      this.shippingAddress = address;
      this.userPlansService.updateUserPlan(this.user.id, this.selectedPlan).catch((error) => console.warn(error));
      this.showShippingAddresses = false;
    }, (error) => this.toastHelper.showAlert(error.message || error));
  }

  public goToPlans(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}`]);
  }

  public goToPendingPlans(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS}`]);
  }
  public toggleShowShippingAddresses(): void {
    this.showShippingAddresses = !this.showShippingAddresses;
  }

  public changePlan(): void {
    if (!!this.userAccount && !!this.selectedPlan && !this.selectedPlan.portInRequestNumber && !this.selectedPlan.canceled) {
      if (!!this.isEBBPlan) {
        const firstHtml = `You are currently enrolled in the ACP program, which is only eligible with the plan you are currently on.<br><br>
        Changing to a different plan will result in de-enrollment of the ACP program, and loss of the monthly free plan benefit.<br><br>
        Do you want to proceed to change your plan and discontinue the ACP program?`;
        const secondHtml = `You are about to change your plan, and your ACP benefits will be immediately discontinued.<br><br>
        <span class="approve-remove-ebb">I approve removal of ACP benefits, and wish to proceed changing to a paid plan?</span>`;
        this.modalHelper.showInformationMessageModal('Change ACP Plan', '', 'Yes', '', false, 'change-ebb-plan-modal', firstHtml, true, 'No')
          .result.then((result) => {
            if (result) {
              this.modalHelper.showInformationMessageModal('Change ACP Plan', '', 'Yes', '', false, 'change-ebb-plan-modal', secondHtml, true, 'No')
                .result.then((res) => {
                  if (res) {
                    this.checkClearCartForChangePlan();
                  }
                }, (error) => {
                  console.error('error', error);
                });
            } else {
              this.modalHelper.showInformationMessageModal('Change ACP Plan', 'Ok, no changes will be made to your account.  Your current ACP benefit and plan remains intact.');
            }
          }, (error) => {
            console.error('error', error);
          });
      } else {
        this.checkClearCartForChangePlan();
      }
    }
  }
  public goToCheckout(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`]);
  }
  public editDevice(): void {
    if (!!this.selectedPlan && !this.selectedPlan.canceled && !!this.userAccount) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PHONE_DETAILS}`]);
    }
  }

  public cancelPlan(): void {
    if (!!this.userAccount && !!this.selectedPlan && !this.selectedPlan.portInRequestNumber && !this.selectedPlan.canceledOnExpiry && !this.selectedPlan.canceled) {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.CANCEL_PLAN}`, params]);
    }
  }
  public paymentHistory(): void {
    if (!!this.selectedPlan && !this.selectedPlan.canceled) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PAYMENTS}`]);
    }
  }
  public activateEsim(): void {
    if(!!this.selectedPlan && !!this.selectedPlan?.planDevice && !!this.selectedPlan?.planDevice?.os) {
      const params = {};
      params[ACCOUNT_ROUTE_URLS.PARAMS.PLAN_ID]= this.selectedPlan.id;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ESIM_SETUP}`, params]);
    }
  }
  public orderAddon(addOnType?: string): void {
    if (!!this.userAccount && !this.userAccount.pastDue && !this.selectedPlan.canceled) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`]);
      if (addOnType === 'International') {
        const params = {};
        params[ACCOUNT_ROUTE_URLS.PARAMS.INTERNATIONAL_CALLING] = true;
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`, params]);
      }
    }
  }
  public usageHistory(): void {
    if (!!this.selectedPlan && !this.selectedPlan.canceled && !!this.userAccount) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.USAGE}`]);
    }
  }
  public dataSetup(): void {
    let network;
    let os = 'android';
    if (this.selectedPlan.planDevice.manufacturer.substr(0, 5).toLowerCase() === 'apple') {
      os = 'ios';
    }
    if (this.selectedPlan.planDevice.network.toLowerCase() === 'tmo') {
      network = 'tmo';
    } else if (this.selectedPlan.planDevice.network.toLowerCase() === 'att') {
      network = 'att';
    }
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
  public cancelChangePlan(): void {
    this.processingRequest = true;
    this.appState.loading = true;
    this.changePlanService.cancelChangePlan(this.selectedPlan.id)
      .then(() => {
        this.getUserPlan();
        setTimeout(() => {
          this.processingRequest = false;
          this.appState.loading = false;
        }, 2000);
      }, (error) => {
        this.appState.loading = false;
        this.processingRequest = false;
        this.toastHelper.showAlert(error.message || error);
      });

  }
  public resetPinForm(): void {
    this.editPinNumberClicked = false;
    this.equalCurrentPin = false;
    this.currentPin = '';
    this.pinCode = '';
    this.pinCodeConfirm = '';
  }
  public makePayment(): void {
    if (!!this.selectedPlan && !this.selectedPlan.canceled) {
      if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.TOPUP_PLAN) {
        this.modalHelper.showConfirmMessageModal('Clear Cart', 'Purchasing a plan will remove any other item in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
          .result.then((result) => {
            if (result) {
              this.mobilePlansService.removePhonesFromCart();
              if (!!this.userCart.voucherData) {
                this.mobilePlansService.setVoucherData({} as IVoucherData);
              }
              const removedItems = [];
              if (this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
                removedItems.push(this.userCart.basePlan);
              } else {
                if (this.userCart.simsQuantity > 0) {
                  removedItems.push({ id: 'SIMG2G4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
                }
                if (!!this.userCart.addOns) {
                  removedItems.push(this.userCart.addOns);
                }
              }
              this.analyticService.trackRermoveFromCart(removedItems);
              this.analyticService.trackRermoveFromCartGA4(removedItems);
              setTimeout(() => {
                this.mobilePlansService.setSimPurchaseQuantity(0);
                this.mobilePlansService.setAddonsList(null, this.userCart);
                this.mobilePlansService.setCartType(CART_TYPES.TOPUP_PLAN);
                this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
                this.appState.clearSessionStorage();
                this.checkoutService.updatePaymentMethod(null);
                sessionStorage.setItem('plan_id', this.selectedPlan.id);
                const cartPlanId = this.userCart.basePlan.id;
                const activeUserPlanId = this.selectedPlan.basePlan.id;
                this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((conf) => {
                  const selectedPlan = conf.allPlans.find((plan) => plan.id === this.selectedPlan.basePlan.id);
                  const topUpPlan = new GenericMobilePlanItem(selectedPlan.id, selectedPlan.title, selectedPlan.subtitle, selectedPlan.price,
                    MobileCustomPlansService.ADD_ONS_TYPES.BASE_PLAN, new MobilePlanDetails(selectedPlan.minutes, selectedPlan.messages, selectedPlan.data, selectedPlan.mms),
                    selectedPlan.parentId, selectedPlan.virtual, selectedPlan.buttonText,
                    selectedPlan.extTitle, selectedPlan.description, selectedPlan.promoMessage, selectedPlan.promoCode, selectedPlan.promoPrice, selectedPlan.promoMonths);
                  if (activeUserPlanId !== cartPlanId) {
                    this.mobilePlansService.setBasePlan(topUpPlan);
                    this.analyticService.trackAddToCartGA4(PURCHASE_INTENT.RENEWAL, [topUpPlan]);
                  }
                });
                this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`]);
              }, 500);
            }
          }, (error) => {
            console.error('error', error);
          });
      } else {
        this.appState.clearSessionStorage();
        const params = {};
        params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
        params[ROUTE_URLS.PARAMS.AUTO_RENEW] = this.autoRenew;
        params[SHOP_ROUTE_URLS.PARAMS.TOP_UP_PLAN] = true;
        this.mobilePlansService.setCartType(CART_TYPES.TOPUP_PLAN);
        this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
        sessionStorage.setItem('plan_id', this.selectedPlan.id);
        const activeUserPlanId = this.selectedPlan.basePlan.id;
        this.plansConfigurationService.planConfiguration.pipe(takeWhile(() => this.alive)).subscribe((conf) => {
          const selectedPlan = conf.allPlans.find((plan) => plan.id === this.selectedPlan.basePlan.id);
          const topUpPlan = new GenericMobilePlanItem(selectedPlan.id, selectedPlan.title, selectedPlan.subtitle, selectedPlan.price,
            MobileCustomPlansService.ADD_ONS_TYPES.BASE_PLAN, new MobilePlanDetails(selectedPlan.minutes, selectedPlan.messages, selectedPlan.data, selectedPlan.mms),
            selectedPlan.parentId, selectedPlan.virtual, selectedPlan.buttonText,
            selectedPlan.extTitle, selectedPlan.description, selectedPlan.promoMessage, selectedPlan.promoCode, selectedPlan.promoPrice, selectedPlan.promoMonths);
          this.mobilePlansService.setBasePlan(topUpPlan);
          this.analyticService.trackAddToCartGA4(PURCHASE_INTENT.RENEWAL, [topUpPlan]);
        });
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`, params]);
      }
    }
  }
  public submitCurrentPin(): void {
    this.processingRequest = true;
    if (this.userAccount.pin === this.currentPin) {
      this.processingRequest = false;
      this.equalCurrentPin = true;
    }
    else {
      this.toastHelper.showAlert('Current PIN is incorrect ');
      this.processingRequest = false;
      this.equalCurrentPin = false;
      this.currentPin = '';


    }
  }
  public showPinCodeRules(): void {
    this.modalHelper.showInformationMessageModal('Pin Code Info',
      'The pin code should not be a sequential number: i.e: 1234 or 9876, also should not be a sequence of the same number; i.e 1111,2222,etc');
  }

  public validatePin(): number {
    if (!!this.pinCode && this.pinCode.length !== 0) {
      const sequentialPatternA = '012345678901234567890';
      const sequentialPatternB = '098765432109876543210';
      if (this.pinCode.length === 4 &&
        sequentialPatternA.indexOf(this.pinCode) === -1 &&
        sequentialPatternB.indexOf(this.pinCode) === -1 &&
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
  public changePinNumber(): void {
    if (!this.selectedPlan.canceled && !!this.userAccount) {
      this.editPinNumberClicked = true;
    }
  }
  public editAccountPin(): void {
    if (!!this.pinCode && !!this.pinCodeConfirm && (this.pinCode === this.pinCodeConfirm) && this.validatePin() === this.PIN_VALIDATE.VALID) {
      this.accountPin = this.pinCode;
      this.processingRequest = true;
      this.userAccountService.changePin({
        mdn: this.userAccount.mdn,
        pin: this.accountPin
      }, this.userAccount.id).then(() => {
        this.userAccount.pin = this.accountPin;
        this.toastHelper.showSuccess('Account PIN has been successfully changed!');
        this.processingRequest = false;
        this.editPinNumberClicked = false;
        this.equalCurrentPin = false;
        this.currentPin = '';
        this.pinCode = '';
        this.pinCodeConfirm = '';
      }).catch((error) => {
        console.warn(error);
      });
    }
    else {
      this.processingRequest = false;
    }
  }
  public viewAccountPin(): void {
    if (!this.selectedPlan.canceled || !!this.userAccount) {
      this.showAccountPin = !this.showAccountPin;
    }
  }

  public editPaymentMethod(isToggle: boolean): void {
    this.modalHelper.showSpecificManagePaymentModal(this.user, this.selectedPlan, false, this.selectedPlan.paymentMethodId, 'manage-payment-modal', `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SETTINGS}`)
      .result.then((result) => {
        if (!!result && result === 'success' && !isToggle) {
          this.modalHelper.showConfirmMessageModal('Plan Auto Pay',
            'Sign up for Auto Pay and get a $5 service credit on each monthly billing cycle. Save up to $60/year! Of course, you can cancel autopay and make changes to your account at any time',
            'Yes to Auto Pay & Save', 'No to Saving', 'auto-renewel-modal')
            .result.then((response) => {
              if (!!response) {
                this.appState.loading = true;
                this.accountPaymentService.updateAutoRenewPlan(this.selectedPlan.id, this.paymentMethod.id, true).then(() => {
                  this.autoRenew = true;
                  this.autoRenewEnabled = true;
                  this.appState.loading = false;
                }, (error) => {
                  console.error('error updating autoRenew');
                  this.toastHelper.showAlert(error.message);
                  this.appState.loading = false;
                  this.autoRenew = false;
                  this.autoRenewEnabled = false;
                });
              }
              else {
                this.appState.loading = true;
                this.accountPaymentService.updateAutoRenewPlan(this.selectedPlan.id, this.paymentMethod.id, false).then(() => {
                  this.autoRenew = false;
                  this.autoRenewEnabled = false;
                  this.appState.loading = false;
                }, (error) => {
                  console.error('error updating autoRenew');
                  this.toastHelper.showAlert(error.message);
                  this.appState.loading = false;
                });
              }
            }, (error) => {
              console.error('error', error);
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message);
            });
        } else {
          if (!!result && result.trim() === 'error' && !!isToggle) {
            this.appState.loading = false;
            this.autoRenew = false;
          } else if (result === 'success') {
            this.autoRenew = true;
            this.autoRenewEnabled = true;
          } else { // when the user clicks on close icon
            this.appState.loading = false;
            this.autoRenew = false;
          }
        }
        this.appState.loading = false;
      }, (error) => {
        console.error('error', error);
        this.appState.loading = false;
        this.toastHelper.showAlert(error.message);
        this.autoRenew = false;
      });
  }

  public editShippingMethod(): void {
    if (!!this.selectedPlan && !this.selectedPlan.canceled) {
      this.modalHelper.showManageShippingAddressesModal(this.user, this.selectedPlan,
        false, this.selectedPlan.shippingAddressId, 'manage-payment-modal', `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SETTINGS}`);
    }
  }

  public addActivatedAccount(): void {
    this.modalHelper.showAddActivatedNumberModal('add-number-modal').result.then((result) => {
      if (!!result) {
        this.userPlansService.bffAddUserPlanMDN(result).then((userPlanId) =>
          this.userPlansService.selectUserPlan(userPlanId), (error) => this.toastHelper.showAlert(error.error.message));
      }
    }).catch((error) => {
      this.toastHelper.showAlert(error.message);
    });
  }

  public updateAutoRenew(): void {
    if (!this.autoRenew) {
      this.modalHelper.showConfirmMessageModal(
        'Disable Auto Pay?', 'By disabling the Auto Pay option, you will miss out the -$5 discount on your monthly billing cycle. Are you sure you wish to disable it?',
        'Yes', 'No', 'auto-renew-modal')
        .result.then((result) => {
          if (result) {
            this.updatedPlan = this.selectedPlan;
            this.autoRenew = false;
            this.autoRenewEnabled = false;
            this.appState.loading = true;
            const autoRenewOriginalValue = this.autoRenew;
            this.accountPaymentService.updateAutoRenewPlan(this.selectedPlan.id, this.selectedPlan.paymentMethodId, this.autoRenew).then(() => {
              this.updatedPlan.autoRenewPlan = this.autoRenew;
              this.paymentMethod = {} as IFirebasePaymentMethod;
              this.getUserPlan();
              this.appState.loading = false;
              this.selectedPlan.autoRenewPlan = this.autoRenew;
              this.userPlansService.selectUserPlan(this.selectedPlan.id);
            }, (error) => {
              console.error('error updating autoRenew ', error);
              this.autoRenew = true; // error disabling auto renew so revret back to original value (true)
              this.autoRenewEnabled = true;
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message);
            });
          } else {
            this.autoRenew = true;
            this.autoRenewEnabled = this.autoRenew;
          }
        }, (error) => {
          console.error('error', error);
          this.toastHelper.showAlert(error.message);
          this.appState.loading = false;
        });
    }
    if (this.autoRenew) {
      this.modalHelper.showConfirmMessageModal('Enable Auto Pay?', 'Sign up for Auto Pay and get a -$5 service credit on each monthly billing cycle. Save up to $60/year!. Of course, you can cancel autopay and make changes to your account at any time.', 'Yes to Auto Pay & Save', 'No to Saving', 'auto-renew-modal2')
        .result.then((result) => {
          if (result) {
            this.updatedPlan = this.selectedPlan;
            const autoRenewOriginalValue = this.autoRenew;
            if (!this.selectedPlan.paymentMethodId) {
              this.editPaymentMethod(true);
            } else {
              this.appState.loading = true;
              this.accountPaymentService.updateAutoRenewPlan(this.selectedPlan.id, this.selectedPlan.paymentMethodId, this.autoRenew).then(() => {
                this.updatedPlan.autoRenewPlan = this.autoRenew;
                this.autoRenew = true;
                this.autoRenewEnabled = true;
                this.appState.loading = false;
              }, (error) => {
                console.error('error updating autoRenew ', error);
                this.autoRenew = false;
                this.autoRenewEnabled = false;
                this.appState.loading = false;
                this.toastHelper.showAlert(error.message);
              });
            }
          }
          else {
            this.autoRenew = false;
            this.autoRenewEnabled = false;
            this.appState.loading = false;
          }
        }, (error) => {
          console.error('error', error);
          this.toastHelper.showAlert(error.message);
          this.appState.loading = false;
        });
    }
  }

  public getUserPlan(): void {
    // this.appState.loading = true;
    this.userPlansService.getUserPlan(this.selectedPlan.id).then((plan) => {
      if (!!plan) {
        this.selectedPlan = plan;
        if (!!this.selectedPlan && this.selectedPlan.planDevice && this.selectedPlan.planDevice.manufacturer) {
          // eslint-disable-next-line max-len
          this.selectedPlan.planDevice.manufacturer =
            !!this.selectedPlan.planDevice.manufacturer ? this.selectedPlan.planDevice.manufacturer.toLowerCase() : this.selectedPlan.planDevice.manufacturer;
          if (this.selectedPlan.planDevice.manufacturer.indexOf('apple') > -1 && this.selectedPlan.planDevice.network === 'att' &&
            !this.selectedPlan.planDevice.pendingMigrationSim) {
            this.canMigrate = true;
          } else {
            this.canMigrate = false;
          }
        }
        this.isEBBPlan = !!this.selectedPlan.basePlan && !!this.selectedPlan.basePlan.ebb ? true : false;
      }
      // this.appState.loading = false;
    }, (error) => {
      this.appState.loading = false;
      console.error('error', error);
    });
  }
  public refresh(): void {
    window.location.reload();
  }

  public reviewIssue(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
    params[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER] = true;
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATE_SIM}`, params]);
  }
  public cancelPortIn(): void {
    this.modalHelper.showConfirmMessageModal('Cancel Port In', 'Are you sure you want to cancel?', 'Yes', 'No', '').result.then((result) => {
      if (!!result) {
        this.appState.loading = true;
        this.processingRequest = true;
        this.userAccountPortInService.deletePortInAccount(this.selectedPlan.id).then(() => {
          this.processingRequest = false;
          setTimeout(() => {
            this.getUserPlan();
            this.appState.loading = false;
          }, 1000);
          this.toastHelper.showSuccess('Port in request cancelled successfully');
        }, (error) => {
          console.error('error', error);
          this.processingRequest = false;
          this.appState.loading = false;
          this.toastHelper.showAlert(error.message);
        });
      }
    });
  }

  public toggleFiveG(): void {
    let os = 'android';
    if (!!this.selectedPlan.planDevice && !this.disableFiveGToggle && this.selectedPlan.planDevice.network.toLowerCase() === 'att') {
      if (!!this.selectedPlan.planDevice.manufacturer && this.selectedPlan.planDevice.manufacturer.substr(0, 5).toLowerCase() === 'apple') {
        os = 'ios';
      }
      if (!!this.fiveGEnabled) {
        const enableCustomHtml = `<p>Enabling 5G requires an APN data setup update. Please check the data setup instructions for further details.</p>`;
        this.modalHelper.showFiveGModal('New APN required', enableCustomHtml, 'Enable and download file',
          '/assets/ereseller.mobileconfig', 'five-toggle-modal', true).result.then((res) => {
            if (!!res) {
              this.appState.loading = true;
              //the timeout needs to be set to fixte issue of downloading in firefox and safari
              setTimeout(() => {
                this.userAccountService.enable5G(this.userAccount.mdn).then((result) => {
                  if (!!result) {
                    this.fiveGEnabled = true;
                    this.userAccount.tech5gEnabled = true;
                    if (os === 'ios') {
                      this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.IPHONE5G}`]);
                    } else {
                      this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.ANDROID5G}`]);
                    }
                    this.appState.loading = false;
                  }
                }, (error) => {
                  this.fiveGEnabled = false;
                  this.appState.loading = false;
                  this.toastHelper.showAlert(error.message);
                });
              }, 2000);
            } else {
              this.appState.loading = false;
              this.fiveGEnabled = false;
            }
          });
      } else {
        const disableCustomHtml = `<p>Disabling 5G requires an APN data setup update. Please check the data setup instructions </p>`;
        this.modalHelper.showFiveGModal('New APN required', disableCustomHtml, 'Disable and download file',
          '/assets/reseller.mobileconfig', 'five-toggle-modal', true).result.then((res) => {
            if (!!res) {
              this.appState.loading = true;
              setTimeout(() => {
                this.userAccountService.disable5G(this.userAccount.mdn).then((result) => {
                  if (!!result) {
                    this.fiveGEnabled = false;
                    this.userAccount.tech5gEnabled = false;
                    if (os === 'ios') {
                      this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.IPHONE4G}`]);
                    } else {
                      this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.ANDROID4G}`]);
                    }
                    this.appState.loading = false;
                  }
                }, (error) => {
                  this.fiveGEnabled = true;
                  this.appState.loading = false;
                  this.toastHelper.showAlert(error.message);
                });
              }, 2000);
            } else {
              this.appState.loading = false;
              this.fiveGEnabled = true;
            }
          });
      }
    }
  }

  public toggleWifiCalling(): void {
    if (this.wifiEnabled) {
      // eslint-disable-next-line max-len
      this.modalHelper.showWifiCallingModal(`Activate WiFi \n Calling on your device`, `${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TERMS_AND_CONDITIONS}/wifi-calling`,
        'wifi-calling-modal').result.then((data) => {
          if (!!data) {
            this.appState.loading = true;
            this.userAccountService.setWifiCalling(this.selectedPlan.id, data).then(() => {
              this.appState.loading = false;
              this.wifiEnabled = true;
              // eslint-disable-next-line max-len
              this.modalHelper.showInformationMessageModal('Wi-Fi Calling Added Successfully!', 'To begin using this feature, please restart your phone,  and then enable Wi-Fi calling.',
                'Done', '', true, 'wifi-result-modal').result.then(() => {
                  this.userAccount.wifiCallingEnabled = true;
                  this.userAccount.wifiCallingAddress = data;
                  this.userPlansService.selectUserPlan(this.selectedPlan.id);
                });
            }, (error) => {
              this.appState.loading = false;
              this.wifiEnabled = false;
              const customHtml = `<div class="description"><p class="message">${error.error.message}</p></div>`;
              this.modalHelper.showInformationMessageModal('Error', '', 'Try again', '', true, 'wifi-result-modal', customHtml);
            });
          } else {
            this.wifiEnabled = false;
          }
        });
    } else {
      this.modalHelper.showConfirmMessageModal('Are you sure You want to disable WiFi Calling on Your device?', '',
        'Disable', 'Cancel', 'disable-wifi-modal').result.then((response) => {
          if (!!response) {
            this.appState.loading = true;
            this.userAccountService.disableWifiCalling(this.selectedPlan.id).then(() => {
              this.appState.loading = false;
              this.toastHelper.showSuccess('Wi-Fi Calling feature disabled successfully!');
              this.userAccount.wifiCallingEnabled = false;
              this.userAccount.wifiCallingAddress = null;
              this.userPlansService.selectUserPlan(this.selectedPlan.id);
            }, (error) => {
              this.toastHelper.showAlert(error.message);
              this.wifiEnabled = true;
              this.appState.loading = false;
            });
          } else {
            this.wifiEnabled = true;
          }
        });
    }
  }

  public editWifiCalling(): void {
    const address: IFirebaseAddress = this.userAccount.wifiCallingAddress as IFirebaseAddress;
    address.name = 'wifi address';
    delete address.alias;
    this.modalHelper.showWifiCallingModal('Update WiFi Calling Address', `${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TERMS_AND_CONDITIONS}/wifi-calling`,
      'wifi-calling-modal edit-wifi-modal', address).result.then((data) => {
        if (!!data) {
          this.appState.loading = true;
          this.userAccountService.setWifiCalling(this.selectedPlan.id, data).then(() => {
            this.appState.loading = false;
            this.modalHelper.showInformationMessageModal('Wi-Fi Calling Updated Successfully!',
              'To begin using this feature, please restart your phone,  and then enable Wi-Fi calling.',
              'Done', '', true, 'wifi-result-modal').result.then(() => {
                this.userPlansService.selectUserPlan(this.selectedPlan.id);
              });
          }, (error) => {
            this.appState.loading = false;
            this.wifiEnabled = false;
            const customHtml = '<div class="description"><p class="message">The address must be a physical location, PO box as address is not allowed.</p></div>';
            this.modalHelper.showInformationMessageModal('Oops! Something went wrong', '', 'Try again', '', true, 'wifi-result-modal', customHtml).result.then(() => {
              this.userPlansService.selectUserPlan(this.selectedPlan.id);
            });
          });
        }
      });
  }
  public orderSIMMigration(): void {
    this.modalHelper.showeMigrationConfirmationModal(this.selectedPlan.planDevice.marketingName, this.selectedPlan.planDevice.id, 'migration-confirmation').result.then((response) => {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
      params[MIGRATION_ROUTE_URLS.PARAMS.CONFIRMED] = response;
      
      this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.CHECK_COMPATIBILITY}`, params]);
    });
  }
  public startMigration(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
    this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.SIM_RECEIVED}`, params]);
  }
  public goToOffers(): void {
    this.router.navigate([`${OFFERS_ROUTE_URLS.BASE}/${OFFERS_ROUTE_URLS.UPGRADE_OFFER}`]);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
  private checkUsageData(): void {
    if (!!this.userAccount.dataRemaining) {
      if (this.userAccount.dataRemaining.units.toLocaleLowerCase() === 'gb') {
        this.dataRemainingBalance = this.userAccount.dataRemaining.balance * 1024;
        this.dataRemainingBalanceOfLteInGB = this.userAccount.dataRemaining.balance;
      }
      else if (this.userAccount.dataRemaining.units.toLocaleLowerCase() === 'kb') {
        this.dataRemainingBalance = this.userAccount.dataRemaining.balance / 1024;
        this.dataRemainingBalanceOfLteInGB = this.userAccount.dataRemaining.balance / (1024 * 1024);
      }
      else {
        this.dataRemainingBalance = this.userAccount.dataRemaining.balance;
        this.dataRemainingBalanceOfLteInGB = this.userAccount.dataRemaining.balance / 1024;
      }
    }
  }
  private checkClearCartForChangePlan(): void {
    if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.CHANGE_PLAN) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Purchasing a plan will remove any other item in your cart. Do you want to proceed?',
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
                removedItems.push({ id: 'SIMG2G4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
              }
              if (!!this.userCart.addOns) {
                removedItems.push(this.userCart.addOns);
              }
            }
            this.analyticService.trackRermoveFromCart(removedItems);
            this.analyticService.trackRermoveFromCartGA4(removedItems);
            this.appState.clearSessionStorage();
            this.checkoutService.updatePaymentMethod(null);
            this.mobilePlansService.clearUserCart();
            sessionStorage.setItem('plan_id', this.selectedPlan.id);
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`]);
          }
        }, (error) => {
          console.error('error', error);
        });
    } else {
      sessionStorage.setItem('plan_id', this.selectedPlan.id);
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`]);
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    if (sessionStorage.getItem('activation_step') === 'step3') {
      event.preventDefault();
      sessionStorage.setItem('activation_step', 'step2');
    }
  }
}
