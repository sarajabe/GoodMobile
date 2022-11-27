import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountRefillService, ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan,
  FirebaseAccountPaymentService, FirebaseUserProfileService, GenericMobilePlanItem, ICreditCardInfo,
  IFirebaseAddress,
  IFirebasePaymentMethod, INewRefillPlanInfo, IUser, IUserAccount, IUserPlan, IVoucherData, MobileCustomPlansService,
  MobilePlanDetails,
  PlansConfigurationService, PURCHASE_INTENT, UserAccountService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { filter, takeWhile } from 'rxjs/operators';
import { FadeInOutAnimation, SlideInOutAnimation } from 'src/app/app.animations';
import { ACCOUNT_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { CUSTOMER_CARE_NUMBER } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { SimpleDateFormatPipe } from 'src/widgets/pipes/simple-date-format.pipe';
import { AccountHeaderService } from '../account-header.service';

@Component({
  selector: 'app-account-pay-and-renew',
  templateUrl: './account-pay-and-renew.component.html',
  animations: [FadeInOutAnimation, SlideInOutAnimation],
  styleUrls: ['./account-pay-and-renew.component.scss']
})
export class AccountPayAndRenewComponent implements OnInit, OnDestroy {
  public user: IUser;
  public userAccount: IUserAccount;
  public selectedPlan: IUserPlan;
  public methodsList: IFirebasePaymentMethod[];
  public selectedPaymentMethod: IFirebasePaymentMethod;
  public cardInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public userCart: CustomizableMobilePlan;
  public pastDueDays: number;
  public userBalance: number;
  public voucherCode: string;
  public customerCareNumber: string = CUSTOMER_CARE_NUMBER;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public presetPaymentOptions = [
    { id: 0, title: '$30', value: 30 },
    { id: 1, title: '$40', value: 40 },
    { id: 2, title: '$50', value: 50 },
    { id: 3, title: 'Other' }];
  public otherPaymentAnimationState = 'out';
  public paymentAmount = 30;
  public customPaymentAmount = 0;
  public showVoucherForm = true;
  public checkOnChanges = false;
  public processingRequest = false;
  public userHasPendingPlans = false;
  public userHasActivePlans = false;
  public autoRenewEnabled = true;
  public paymentInfoCollected = false;
  public saveCCInfoChange = true;
  public usingPaymentProfile = false;
  public billing = false;
  public isChecked = false;
  public isModalAction = true;
  private selectedCreditCardPaymentInfo: ICreditCardInfo = {} as ICreditCardInfo;
  private alive = true;

  constructor(private userAccountService: UserAccountService,
              private router: Router,
              private userPlansService: UserPlansService,
              private accountHeaderService: AccountHeaderService,
              private appState: AppState,
              private accountRefillService: AccountRefillService,
              private firebaseAccountPaymentService: FirebaseAccountPaymentService,
              private modalHelper: ModalHelperService,
              private toastHelper: ToastrHelperService,
              private userProfileService: FirebaseUserProfileService,
              private plansConfigurationService: PlansConfigurationService,
              private datePipe: SimpleDateFormatPipe,
              private metaService: MetaService,
              private mobilePlansService: MobileCustomPlansService,
              private analyticService: ActionsAnalyticsService) {

    this.userPlansService.selectedUserPlanObservable.subscribe((plan) => {
      if (!!plan) {
        this.selectedPlan = plan;
      }
    });
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      if (userPlanReady && !!this.userPlansService.selectedUserPlan) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
      } else {
        this.userPlansService.selectFirstUserPlan(true);
      }
    });

  }

  public getDescription(): string {
    let date;
    if (!!this.userAccount) {
      date = this.datePipe.transform(this.userAccount.plan.subscriptionRenewalDate);
    }
    let title = '';
    if (!!this.selectedPlan) {
      title = this.selectedPlan.title;
    }
    if (!!this.userHasActivePlans) {
      return `<div class="page-description plan-selector-space">Payment is due <b> ${date} </b>for your GoodMobile plan: ${title}</div>`;
    } else {
      return `<div class="page-description plan-selector-space pay">You can always update your account details and settings here. You can also manage
      devices and activated accounts or add numbers to your existing account.</div>`;
    }
  }
  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setPageTitle('Pay & refill your account');
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.user = user;
    });
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
      const pendingActivationPlans = plans.filter((plan) => !plan.mdn);
      const activatedPlans = plans.filter((plan) => !!plan.mdn);
      if (!this.isChecked) {
        this.selectPaymentDuePlan(plans);
        this.isChecked = true;
      }
      this.userHasPendingPlans = (!!pendingActivationPlans && pendingActivationPlans.length > 0);
      this.userHasActivePlans = (!!activatedPlans && activatedPlans.length > 0);
    });
    this.userAccountService.isSyncingAccount.pipe(takeWhile(() => this.alive)).subscribe((isSyncing) => {
      this.appState.loading = isSyncing;
    });
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
      if (!!this.userAccount) {
        this.userBalance = this.userAccount.accountBalance;
      }
      this.accountHeaderService.setPageDescription(this.getDescription());
    });
    this.firebaseAccountPaymentService.paymentMethodsList.pipe(takeWhile(() => this.alive)).subscribe((methods) => {
      if (!!methods) {
        this.methodsList = methods;
      }
    });
    this.mobilePlansService.currentPlan.subscribe((cart) => {
      this.userCart = cart;
      if (!!this.userCart && this.userCart.activePlanId && this.selectedPlan.id !== this.userCart.activePlanId) {
        this.userPlansService.selectUserPlan(this.userCart.activePlanId);
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public topUpUsingVoucherCode(): void {
    this.processingRequest = true;
    this.accountRefillService.refillUsingVoucherCode(this.selectedPlan.id, this.voucherCode).then((refillResults) => {
      this.toastHelper.showSuccess('We have successfully added funds to your account');

      this.userBalance = refillResults.accountBalance;
      const voucherAmount = refillResults.amount;

      this.modalHelper.showInformationMessageModal('Voucher refill successful!',
        '',
        'OK',
        null, true, 'custom-modal-voucher-results',
        `<div>You entered an amount of: $${voucherAmount} to your account through voucher </div><br><b> Your current balance is $${this.userBalance} </b>`
      );

      this.processingRequest = false;
      this.voucherCode = null;
    }).catch((error) => {
      this.toastHelper.showWarning(error.message);
      this.processingRequest = false;
    });
  }
  public topUpUsingCreditCard(): void {
    this.processingRequest = true;
    this.customPaymentAmount = this.userAccount.plan.paymentAmount;
    if (!!this.usingPaymentProfile) {
      this.accountRefillService.refillUsingExistingCreditCard(this.selectedPlan.id, this.cardInfo.id,
        { amount: this.customPaymentAmount, autoRenew: this.autoRenewEnabled }).then((refillResults) => {
          this.userBalance = refillResults.accountBalance;
          const voucherAmount = refillResults.amount;
          this.processingRequest = false;
          this.modalHelper.showInformationMessageModal('Card refill successful!',
            '',
            'Ok',
            null, true, 'custom-modal-voucher-results',
            `<div>You entered an amount of: $${this.userAccount.plan.paymentAmount} to your account through card </div><br><b> Your current balance is $${this.userBalance} </b>`
          );
          this.cardInfo = {} as ICreditCardInfo;
          this.showVoucherForm = true;
        }).catch((error) => {
          this.toastHelper.showWarning(error.message);
          this.processingRequest = false;
        });
    } else {
      const newRefillPlanInfo: INewRefillPlanInfo = Object.assign({ amount: this.customPaymentAmount, autoRenew: this.autoRenewEnabled }, this.cardInfo);
      this.accountRefillService.refillUsingNewCreditCard(this.selectedPlan.id, newRefillPlanInfo).then((refillResults) => {
        this.userBalance = refillResults.accountBalance;
        const voucherAmount = refillResults.amount;
        this.processingRequest = false;
        this.modalHelper.showInformationMessageModal('Card refill successful!',
          '',
          'Ok',
          null, true, 'custom-modal-voucher-results',
          `<div>You entered an amount of: $${this.paymentAmount} to your account through card </div><br><b> Your current balance is $${this.userBalance} </b>`
        );
        this.cardInfo = {} as ICreditCardInfo;
        this.showVoucherForm = true;
      }).catch((error) => {
        this.toastHelper.showWarning(error.message);
        this.processingRequest = false;
      });
    }
  }

  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan.mdn) {
      if (!this.selectedPlan || (!!userPlan && userPlan.id !== this.selectedPlan.id)) {
        if (!!this.userCart && this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
          if (!!this.isModalAction) {
            this.isModalAction = false;
            this.modalHelper.showConfirmMessageModal('Clear Cart', 'Changing your selected account will clear the items in your cart. Do you want to proceed?',
              'Yes', 'No', 'clean-cart-modal')
              .result.then((result) => {
                if (!!result) {
                  this.isModalAction = true;
                  this.mobilePlansService.clearUserCart();
                  this.appState.clearSessionStorage();
                  const removedItems = [];
                  if (this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
                    removedItems.push(this.userCart.basePlan);
                  } else {
                    if (this.userCart.simsQuantity > 0) {
                      removedItems.push({ id: this.userCart.planDevice.skuNumber, quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
                    }
                    if (!!this.userCart.addOns) {
                      removedItems.push(this.userCart.addOns);
                    }
                  }
                  this.analyticService.trackRermoveFromCartGA4(removedItems);
                  if (!!this.userCart.voucherData) {
                    this.mobilePlansService.removeVoucherCode();
                  }
                  this.userPlansService.selectUserPlan(userPlan.id);
                } else {
                  this.userPlansService.selectUserPlan(this.selectedPlan.id);
                  this.isModalAction = true;
                }
              }, (error) => {
                console.error('error', error);
              });
          }
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
  public addActivatedAccount(): void {
    this.modalHelper.showAddActivatedNumberModal('add-number-modal').result.then((result) => {
      if (!!result) {
        this.userPlansService.bffAddUserPlanMDN(result).then((userPlanId) => this.userPlansService.selectUserPlan(userPlanId),
          (error) => this.toastHelper.showAlert(error.error.message));
      }
    }).catch((error) => {
    });
  }

  public toggleExistingPaymentMethod(paymentMethod: IFirebasePaymentMethod, event?): void {
    if (!!event) {
      event.preventDefault();
    }
    this.selectedPaymentMethod = this.selectedPaymentMethod === paymentMethod ? null : paymentMethod;
  }

  public updatePresetPaymentOptions(value): void {
    this.otherPaymentAnimationState = (value.id === 3) ? 'in' : 'out';
    this.paymentAmount = value.value;
    this.customPaymentAmount = this.paymentAmount;
  }

  public paymentInfoUpdated(paymentInfo: ICreditCardInfo): void {
    if (!!paymentInfo) {
      this.usingPaymentProfile = !!paymentInfo.id;
      this.selectedCreditCardPaymentInfo = {
        id: paymentInfo.id,
        cardNumber: !!paymentInfo.id ? '' : paymentInfo.cardNumber,
        cardCode: !!paymentInfo.id ? '' : paymentInfo.cardCode,
        fullName: paymentInfo.fullName,
        email: '',
        type: !!paymentInfo.id ? 'creditCardProfile' : 'creditCard',
        primary: paymentInfo.primary,
        expirationDate: paymentInfo.expirationDate,
      } as ICreditCardInfo;
    } else {
      this.usingPaymentProfile = false;
    }

    if (this.usingPaymentProfile) {
      this.cardInfo = Object.assign({}, paymentInfo);
    } else {
      this.cardInfo = Object.assign({}, this.selectedCreditCardPaymentInfo, this.cardInfo);
    }
  }

  public billingAddressUpdated(paymentInfo: IFirebaseAddress): void {
    this.selectedCreditCardPaymentInfo = {
      id: paymentInfo.id,
      primary: paymentInfo.isDefault,
      address1: paymentInfo.address1,
      address2: paymentInfo.address2,
      state: paymentInfo.state,
      country: paymentInfo.country,
      city: paymentInfo.city,
      postalCode: paymentInfo.postalCode
    } as ICreditCardInfo;
    this.cardInfo.id = paymentInfo.id;
    this.cardInfo.primary = paymentInfo.isDefault;
    this.cardInfo.address1 = paymentInfo.address1;
    this.cardInfo.address2 = paymentInfo.address2;
    this.cardInfo.state = paymentInfo.state;
    this.cardInfo.country = paymentInfo.country;
    this.cardInfo.city = paymentInfo.city;
    this.cardInfo.postalCode = paymentInfo.postalCode;
  }

  public calculateTotal(): any {
    let total = 0;
    if (!this.selectedPlan) {
      return 0;
    }

    total += this.selectedPlan.basePlan.price;

    total = this.userBalance - total;

    return total >= 0 ? total : 0;
  }

  public calculateDiffInDays(planRenewDate: Date): any {
    const oneDay = 1000 * 60 * 60 * 24;
    const planRenewTime = planRenewDate.getTime();
    const difference = planRenewTime - new Date().getTime();
    return Math.round(difference / oneDay);
  }

  public selectPaymentDuePlan(userPlans): void {
    const paymentDuePlan = userPlans.find((plan) => !!plan && !!plan.basePlan && !!plan.basePlan.renewDate && this.calculateDiffInDays(new Date(plan.basePlan.renewDate)) <= 3 &&
      this.calculateDiffInDays(new Date(plan.basePlan.renewDate)) > 0);
    if (!!paymentDuePlan) {
      this.userPlansService.selectUserPlan(paymentDuePlan.id);
      this.selectedPlan = paymentDuePlan;
    }
  }

  public makePayment(method?): void {
    if (!!this.selectedPlan && !this.selectedPlan.portInRequestNumber && !!this.userAccount &&
      !this.selectedPlan.pendingPlan && !this.selectedPlan.canceled) {
      if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.TOPUP_PLAN) {
        this.modalHelper.showConfirmMessageModal('Clear Cart', 'Purchasing a plan will remove any other item in your cart. Do you want to proceed?',
          'Yes', 'No', 'clean-cart-modal')
          .result.then((result) => {
            if (result) {
              this.appState.clearSessionStorage();
              this.mobilePlansService.clearUserCart();
              if (!!this.userCart.voucherData) {
                this.mobilePlansService.setVoucherData({} as IVoucherData);
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
              setTimeout(() => {
                this.mobilePlansService.setSimPurchaseQuantity(0);
                this.mobilePlansService.setAddonsList(null, this.userCart);
                this.mobilePlansService.setCartType(CART_TYPES.TOPUP_PLAN);
                this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
                sessionStorage.setItem('plan_id', this.selectedPlan.id);
                this.plansConfigurationService.planConfiguration.pipe(takeWhile(() => this.alive)).subscribe((conf) => {
                  const selectedPlan = conf.allPlans.find((plan) => plan.id === this.selectedPlan.basePlan.id);
                  const topUpPlan = new GenericMobilePlanItem(selectedPlan.id, selectedPlan.title, selectedPlan.subtitle, selectedPlan.price,
                    MobileCustomPlansService.ADD_ONS_TYPES.BASE_PLAN, new MobilePlanDetails(selectedPlan.minutes, selectedPlan.messages, selectedPlan.data, selectedPlan.mms),
                    selectedPlan.parentId, selectedPlan.virtual, selectedPlan.buttonText,
                    selectedPlan.extTitle, selectedPlan.description, selectedPlan.promoMessage, selectedPlan.promoCode, selectedPlan.promoPrice, selectedPlan.promoMonths);
                  this.mobilePlansService.setBasePlan(topUpPlan);
                  this.analyticService.trackAddToCartGA4(PURCHASE_INTENT.RENEWAL, [topUpPlan]);
                });
                const params = {};
                if (!!method && method === 'voucher') {
                  params[ROUTE_URLS.PARAMS.PAYMENT_METHOD] = 'voucher';
                }
                this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`, params]);
              }, 200);
            }
          }, (error) => {
            console.error('error', error);
          });
      } else {
        this.appState.clearSessionStorage();
        this.mobilePlansService.setCartType(CART_TYPES.TOPUP_PLAN);
        this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
        this.plansConfigurationService.planConfiguration.pipe(takeWhile(() => this.alive)).subscribe((conf) => {
          const selectedPlan = conf.allPlans.find((plan) => plan.id === this.selectedPlan.basePlan.id);
          const topUpPlan = new GenericMobilePlanItem(selectedPlan.id, selectedPlan.title, selectedPlan.subtitle, selectedPlan.price,
            MobileCustomPlansService.ADD_ONS_TYPES.BASE_PLAN, new MobilePlanDetails(selectedPlan.minutes, selectedPlan.messages, selectedPlan.data, selectedPlan.mms),
            selectedPlan.parentId, selectedPlan.virtual, selectedPlan.buttonText,
            selectedPlan.extTitle, selectedPlan.description, selectedPlan.promoMessage, selectedPlan.promoCode, selectedPlan.promoPrice, selectedPlan.promoMonths);
          this.mobilePlansService.setBasePlan(topUpPlan);
          this.analyticService.trackAddToCartGA4(PURCHASE_INTENT.RENEWAL, [topUpPlan]);
        });
        const params = {};
        sessionStorage.setItem('plan_id', this.selectedPlan.id);
        if (!!method && method === 'voucher') {
          params[ROUTE_URLS.PARAMS.PAYMENT_METHOD] = 'voucher';
        }
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`, params]);
      }
    }
  }
}
