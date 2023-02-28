import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AccountPaymentService, ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, FirebaseAccountPaymentService, IAddress,
  ICreditCardInfo, IFirebaseAddress, IFirebasePaymentMethod, IShippingMethod, IUserAccount, IUserPlan,
  IVoucherData, MobileCustomPlansService, ShippingConfigurationService, UserAccountService, UserPlansService,
  VoucherActivationService, ShippingService, PlansConfigurationService
} from '@ztarmobile/zwp-service-backend';
import { VoucherService } from '@ztarmobile/zwp-service-backend-v2';
import { IVoucherValidations } from '@ztarmobile/zwp-service-backend-v2/lib/models';
import { debounceTime, take, takeWhile } from 'rxjs/operators';
import { CHECKOUT_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { CUSTOMER_CARE_NUMBER, INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { CreditCardValidator } from 'src/widgets/validators/credit-card.validator';
import { CheckoutService } from '../checkout.service';
import { FLOW_STEPS_IDS, IFlowIndicator } from '../flow-indicator/flow-indicator';

@Component({
  selector: 'app-payment-section',
  templateUrl: './payment-section.component.html',
  styleUrls: ['./payment-section.component.scss']
})
export class PaymentSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public CART_TYPES = CART_TYPES;
  public captchaValid = false;
  public recaptchaResponse: any;
  public showPaymentSection = true;
  public payWithCard = false;
  public methodsList: IFirebasePaymentMethod[];
  public toggleCount = 1;
  public storedPaymentId: string;
  public selectedPaymentMethod: IFirebasePaymentMethod;
  public enteredCard: IFirebasePaymentMethod;
  public showAddCardSection = false;
  public paymentInfoForm: UntypedFormGroup;
  public voucherForm: UntypedFormGroup;
  public paymentInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public currentYear;
  public currentMonth;
  public userPlan: IUserPlan;
  public expirationYearRange: Array<number>;
  public autoRenew: boolean;
  public shippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public saveCCInfo = true;
  public isStorePickup = false;
  public billingSameAsShipping = false;
  public billingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public isValidAddress = false;
  public cart: CustomizableMobilePlan;
  public newCardInfo: ICreditCardInfo;
  public isMigration = false;
  public isReplacement = false;
  public paymentInfoCollected = false;
  public flowSettings: IFlowIndicator = {} as IFlowIndicator;
  public showCardRequired = false;
  public touchBillingForm = false;
  public isNewPlan = false;
  public userAccount: IUserAccount;
  public payWithBalance = false;
  public usedBalance = 0;
  public total = 0;
  public decimalPattern: RegExp = new RegExp('^[0-9]+(\.[0-9]{1,2})?$');
  public isChangingBalance = false;
  public payWithReward = false;
  public usedReward = 0;
  public isChangingReward = false;
  public customerCareNumber: string = CUSTOMER_CARE_NUMBER;
  public processingRequest = false;
  public disableBalance = false;
  public disableRewards = false;
  public disableCard = false;
  public morePaymentNeeded = false;
  public newSimOrder: { price: number, id?: string };
  public simPrice: number;
  public simId: string;
  public showAllPayments = false;
  public resetBillingForm = false;
  public totalBalance = 0;
  public payWithTotalBalance = false;
  public balanceApplied = false;
  public balanceAmount: number = 0;
  public showVoucherSection = false;
  public payWithVoucher = false;
  public showVoucherError = false;
  public showVoucherSuccess = false;
  public applyVoucherCalled = false;
  public voucherDetuctedAmount =0;
  public voucherRemainingAmount = 0;
  public voucherAmount = 0;
  private isNewPayment = false;
  private alive = true;
  private currentDate: Date;
  private savedBalance = 0;
  private savedReward = 0;
  private nextClicked = false;
  private selectedPlanBundleId;
  private isEditPayment = false;
  private isRewardsChanged = false; // to keep track if the user updated the rewards manually or not
  private isBalanceChanged = false; // to keep track if the user updated the balance manually or not
  private cardExists = false;
  private userHasPurchases = false;
  rewardAmount: number = 0;
  rewardApplied: boolean;
  shippingMethod: IShippingMethod;

  constructor(private firebaseAccountPaymentService: FirebaseAccountPaymentService, private formBuilder: UntypedFormBuilder, private analyticsService: ActionsAnalyticsService,
              private checkoutService: CheckoutService, private mobilePlansService: MobileCustomPlansService, private accountPaymentService: AccountPaymentService,
              private metaService: MetaService, private router: Router, private userPlansService: UserPlansService, private userAccountService: UserAccountService,
              private modalHelper: ModalHelperService, private voucherActivationService: VoucherActivationService, private cdRef: ChangeDetectorRef,
              private shippingConfigurationService: ShippingConfigurationService, private toastHelper: ToastrHelperService, private appState: AppState,
              private shippingService: ShippingService, private voucherService: VoucherService,  private plansConfigurationService: PlansConfigurationService,) {
    this.storedPaymentId = sessionStorage.getItem('payment_id'); // initial value to keep the saved id in case the user wants to edit and he keeps the same payment selection
    this.expirationYearRange = [];
    this.currentDate = new Date();
    const year = parseInt(this.currentDate.getFullYear().toString().substr(-2), 10);
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    for (let i = 0; i < 20; i++) {
      this.expirationYearRange.push(year + i);
    }
    this.voucherForm = formBuilder.group({
      voucher: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12)])),
    })
    this.paymentInfoForm = formBuilder.group({
      fullName: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
      cardNumber: new UntypedFormControl('', Validators.compose([Validators.required, CreditCardValidator.validateCCNumber])),
      saveCard: [''],
      cardCode: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])),
      cardExpirationMonth: ['', Validators.required],
      cardExpirationYear: ['', Validators.required],
    }, { validator: this.validExpirationDate('cardExpirationMonth', 'cardExpirationYear') });
    const storedShippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress'));
    this.isStorePickup = JSON.parse(sessionStorage.getItem('storePickup'));
    if (!!storedShippingAddress) {
      this.shippingAddress = Object.assign({}, storedShippingAddress) as IFirebaseAddress;
      this.billingSameAsShipping = true;
    } else {
      this.shippingAddress = null;
      this.billingSameAsShipping = false;
    }
    const storedShippingMethod = JSON.parse(sessionStorage.getItem('shippingMethod'));
    if (!!storedShippingMethod) {
      this.shippingMethod = Object.assign({}, storedShippingMethod) as IShippingMethod;
    } else {
      this.shippingMethod = null;
    }
    this.billingAddress = { address1: '', address2: '', name: '', city: '', state: '', postalCode: '' } as IFirebaseAddress;
    setInterval(() => {
      this.reCaptcha.resetReCaptcha(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
    }, 1.8 * 60 * 1000);


    this.checkoutService.totalSubject.subscribe((t) => {
      this.total = t;
    });
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.analyticsService.trackCheckoutSteps(3, 'Payment');
    this.flowSettings = this.checkoutService.initFlowControlSettings(this.checkoutService.needsShipping, true);
    this.userPlansService.userPlans.pipe((take(1))).subscribe((plans) => {
      if (!!plans && plans.length > 0) {
        this.userHasPurchases = true;
      } else {
        this.userHasPurchases = false;
      }
    });
    this.firebaseAccountPaymentService.paymentMethodsList.pipe(takeWhile(() => this.alive)).subscribe((methods) => {
      if (!!methods) {
        this.methodsList = methods;
        if ((this.methodsList.length === 0 || this.isNewPayment) && !this.cart?.activationCode) {
          this.showAddCardSection = true;
          this.autoRenew = true;
          this.payWithCard = true;
        }
        if (!!this.storedPaymentId && this.storedPaymentId !== '1') {
          this.selectedPaymentMethod = this.methodsList.find((method) => method.id === this.storedPaymentId);
          this.payWithCard = !!this.selectedPaymentMethod && this.selectedPaymentMethod.id ? true : false;
        } else {
          this.checkoutService.paymentsSubject.pipe(takeWhile(() => this.alive)).subscribe((p) => {
            if (!!p && !!p?.card) {
              this.paymentInfo = p.card;
            }
            if (!!p?.card && !!p?.card?.cardNumber) {
              this.isNewPayment = true;
              this.convertPaymentData(false);
            } else {
              this.isNewPayment = false;
            }
          })
        }
      }
    });
  
    this.shippingConfigurationService.newSimOrder.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.newSimOrder = order;
    });
    this.checkoutService.userCartReplySubject.pipe(takeWhile(() => this.alive), debounceTime(300)).subscribe((cart) => {
      if (!!cart) {
        this.cart = cart;
        if (!!this.newSimOrder && this.cart.cartType === CART_TYPES.PLAN_ITEMS && this.cart.simsQuantity > 0) {
          this.simPrice = this.newSimOrder.price;
          this.simId = this.newSimOrder.id;
        }
        this.autoRenew = this.cart.autoRenewPlan;
        this.isNewPlan = cart.cartType !== CART_TYPES.NEW_PLAN ? false : true;
        if (cart.cartType === CART_TYPES.MIGRATION) {
          this.isMigration = true;
          this.paymentInfoCollected = true;
        }
        if (cart.cartType === CART_TYPES.PLAN_ITEMS && cart.simsQuantity > 0 && !cart.addOns) {
          this.paymentInfoCollected = true;
          this.isReplacement = true;
        }
        if (cart.cartType !== CART_TYPES.NEW_PLAN && !this.nextClicked) {
          this.userPlansService.getUserPlan(cart.activePlanId).then((plan) => {
            if (!!plan) {
              this.userPlan = plan;
              this.userAccountService.userAccounts.pipe(take(1)).subscribe((accounts) => {
                if (!!accounts) {
                  this.userAccount = accounts.find((account) => account.mdn === this.userPlan.mdn);
                  const availableRewards = !!this.userAccount.rewards ? this.userAccount.rewards.available : 0; 
                  this.totalBalance = availableRewards + this.userAccount.accountBalance;
                  if (this.totalBalance === 0 && !this.cart?.activationCode) { // if the user doesn't have balance or reward then he will pay with card only
                    this.payWithCard = true;
                  }
                  const useFromReward = sessionStorage.getItem('useFromReward');
                  const useFromBalance = sessionStorage.getItem('useFromBalance');
                  if (!!useFromReward) {
                    this.usedReward = parseFloat(useFromReward);
                    if (this.usedReward > 0) {
                      this.rewardApplied = true;
                      this.rewardAmount = this.usedReward;
                      this.payWithReward = true;
                    }
                  } else {
                    this.usedReward = 0;
                    this.rewardApplied = false;
                    this.rewardAmount = this.usedReward;
                  }

                  if (!!useFromBalance) {
                    this.usedBalance = parseFloat(useFromBalance);
                    if (this.usedBalance > 0) {
                      this.balanceApplied = true;
                      this.balanceAmount = this.usedBalance;
                      this.payWithBalance = true;
                    }
                  } else {
                    this.usedBalance = 0;
                    this.balanceApplied = false;
                    this.balanceAmount = this.usedBalance;
                  }
                  this.payWithTotalBalance = this.payWithBalance || this.payWithReward ? true : false;
                  const isEdit = sessionStorage.getItem('editPayment');
                  this.isEditPayment = !!isEdit ? true : false;
                }
              });
            }
          });
        } else if (!this.cart?.activationCode) {
          this.payWithCard = true;
        }
        if(!!this.cart?.activationCode) {
          this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((conf) => {
            const allBasePlans = conf.allPlans;
             if(allBasePlans?.length > 0) {
               this.selectedPlanBundleId = allBasePlans.find(item => item?.id === this.cart?.basePlan?.id).bundleId;
             }     
          });
          this.showVoucherSection = true;
          if(!!this.payWithCard && !!this.payWithVoucher) {
            this.payWithCard = false;
            this.togglePayWithCard();
          }
        } else {
          this.showVoucherSection = false;
          this.payWithVoucher = false;
        }
        if(!!this.cart?.voucherData && !!this.cart?.voucherData?.code) {
          this.payWithVoucher = true;
          this.showVoucherSuccess = true;
          this.voucherDetuctedAmount = this.cart?.voucherData?.limit;
          this.voucherRemainingAmount = this.cart?.voucherData?.limit - this.total;
          this.voucherForm.controls.voucher.setValue(this.cart?.voucherData?.code);
          this.applyVoucherCalled = true;
          this.payWithCard = false;
          this.togglePayWithCard();
        }
      }
    });
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }

  public applyBalance(): void {
    this.isEditPayment = false;
    if (!!this.usedBalance && this.usedBalance <= this.total && this.usedBalance <= this.userAccount.accountBalance && this.usedBalance >= 0) {
      this.isChangingBalance = false;
      this.balanceAmount = this.usedBalance;
      sessionStorage.setItem('useFromBalance', this.usedBalance.toString());
      this.payWithBalance = true;
      this.isBalanceChanged = true;
      this.balanceApplied = true;
      this.morePaymentNeeded = false;
    }
    if (this.usedBalance === 0) {
      this.isBalanceChanged = true;
      this.balanceAmount = this.usedBalance;
    }
    if (!this.usedBalance || this.usedBalance < 0) {
      this.usedBalance = 0;
      this.balanceAmount = 0;
      sessionStorage.setItem('useFromBalance', this.usedBalance.toString());
    }
  }
  public applyVoucher(): void {
    this.voucherForm.markAllAsTouched();
    if(!!this.voucherForm.valid) {
      this.appState.loading = true;
      const data = {
        planId: this.selectedPlanBundleId,
        voucherCode: this.voucherForm.controls.voucher.value
      } as IVoucherValidations;
       this.voucherService.validateVoucher(data).then(res => {
        if(!!res) {
          this.applyVoucherCalled = true;
          this.appState.loading = false;
          this.showVoucherError = false;
          this.showVoucherSuccess = true;
          this.voucherAmount = (res?.pinValue / 100);
          this.checkoutService.setPayments({card: null, balanceAmount: 0, rewardsAmount: 0, voucherAmount: this.voucherAmount});
          const voucherData = { 
            limit: res?.pinValue / 100,
            code : this.voucherForm.controls.voucher.value
          } as IVoucherData;
          this.mobilePlansService.setVoucherData(voucherData);
          this.mobilePlansService.setAutoRenewPlan(false);
          this.voucherDetuctedAmount = this.total;
          this.voucherRemainingAmount = (res?.pinValue / 100) - this.total;

        }
       }, error => {
        this.appState.loading = false;
        this.showVoucherError = true;
        this.showVoucherSuccess = false;
        this.applyVoucherCalled = true;

       })
    }
  }
  public applyReward(): void {
    this.isEditPayment = false;
    if (!!this.usedReward && this.usedReward <= this.total && this.usedReward <= this.userAccount.rewards.available && this.usedReward >= 0) {
      this.isChangingReward = false;
      sessionStorage.setItem('useFromReward', this.usedReward.toString());
      this.payWithReward = true;
      this.isRewardsChanged = true;
      this.rewardApplied = true;
      this.rewardAmount = this.usedReward;
      this.morePaymentNeeded = false;
    }
    if (this.usedReward === 0) {
      this.payWithReward = false;
      this.isRewardsChanged = false;
      this.rewardAmount = 0;
    }
    if (!this.usedReward || this.usedReward < 0) {
      this.usedReward = 0;
      sessionStorage.setItem('useFromReward', this.usedReward.toString());
    }
  }

  public toggleExistingPaymentMethod(paymentMethod: IFirebasePaymentMethod, event?): void {
    if (!!event) {
      event.preventDefault();
    }
    this.isEditPayment = false;
    this.selectedPaymentMethod = paymentMethod;
    this.showAddCardSection = false;
    this.paymentInfoForm.reset();
    this.autoRenew = true;
    this.showCardRequired = false;
    this.billingAddress = {} as IFirebaseAddress;
    sessionStorage.setItem('payment_id', this.selectedPaymentMethod.id);
    sessionStorage.setItem('auto_renew', 'true');
    this.morePaymentNeeded = false;
  }

  public toggleSharedAddress(): void {
    this.isEditPayment = false;
    if (!!this.billingSameAsShipping) {
      this.billingAddress = this.shippingAddress;
      this.billingAddress.id = '';
      this.isValidAddress = true;
      this.morePaymentNeeded = false;
      this.paymentInfo.cardNumber = this.paymentInfoForm.get('cardNumber').value;
      this.paymentInfo.cardNumber = this.paymentInfo.cardNumber.toString().replace(/\t\s+|-/g, '');
      this.paymentInfo.cardCode = this.paymentInfoForm.get('cardCode').value;
      this.paymentInfo.fullName = this.paymentInfoForm.get('fullName').value;
      this.paymentInfo = Object.assign(this.paymentInfo, this.billingAddress);
    } else {
      this.billingAddress = { address1: '', address2: '', name: '', city: '', state: '', postalCode: '' } as IFirebaseAddress;
      this.isValidAddress = false;
    }
  }
  public changeReward(): void {
    this.isChangingReward = true;
    this.payWithReward = true;
    this.rewardApplied = false;
    this.rewardAmount = 0;
  }
  public changeBalance(): void {
    this.isChangingBalance = true;
    this.payWithBalance = true;
    this.balanceApplied = false;
    this.balanceAmount = 0;
  }
  public togglePayWithCard(): void {
    this.isEditPayment = false;
    if(!!this.payWithVoucher && !!this.payWithCard) {
      this.payWithVoucher = false;
      this.togglePayWithVoucher();
    }
    if (!this.payWithCard) {
      this.selectedPaymentMethod = null;
      this.showAddCardSection = false;
      this.billingAddress = {} as IFirebaseAddress;
      this.paymentInfoForm.reset();
      this.billingSameAsShipping = false;
      this.showCardRequired = false;
      this.autoRenew = false;
      this.checkoutService.updateAutoRenew(false);
      sessionStorage.setItem('auto_renew', 'false');
      sessionStorage.removeItem('payment_id');
    }
  }
  public togglePayWithBalance(): void {
    this.isEditPayment = false;
    if (!this.payWithBalance) {
      sessionStorage.setItem('useFromBalance', '0');
      this.usedBalance = 0;
      this.balanceAmount = 0;
      this.balanceApplied = false;
      this.isBalanceChanged = true;
    }
  }

  public togglePayWithTotalBalance(): void {
    this.isEditPayment = false;
    if (!this.payWithTotalBalance) {
      sessionStorage.setItem('useFromBalance', '0');
      sessionStorage.setItem('useFromReward', '0');
      this.usedBalance = 0;
      this.balanceAmount = 0;
      this.balanceApplied = false;
      this.isBalanceChanged = true;
      this.usedReward = 0;
      this.rewardAmount = 0;
      this.rewardApplied = false;
    }
  }
  public togglePayWithReward(): void {
    this.isEditPayment = false;
    if (!this.payWithReward) {
      sessionStorage.setItem('useFromReward', '0');
      this.usedReward = 0;
      this.isRewardsChanged = false;
      this.rewardAmount = 0;
      this.rewardApplied = false;
    }
  }
  public togglePayWithVoucher(): void {
    if(!!this.payWithVoucher) {
      this.payWithCard = false;
      this.checkoutService.detailsSubject.next(null);
      this.togglePayWithCard();
    }
    this.voucherForm.reset();
    this.showVoucherError = false;
    this.showVoucherSuccess = false;
    this.applyVoucherCalled = false;
    this.mobilePlansService.setVoucherCode({} as IVoucherData);
  }
  public voucherInputChanged(): void {
    this.showVoucherError = false;
    this.showVoucherSuccess = false;
    this.applyVoucherCalled = false;
    this.mobilePlansService.setVoucherCode({} as IVoucherData);
  }
  public validExpirationDate(month: string, year: string): any {
    this.isEditPayment = false;
    return (group: UntypedFormGroup): { [key: string]: any } => {
      const expMonth = group.controls[month];
      const expYear = group.controls[year];
      if (!!this.paymentInfo && !!expYear.value && !!expMonth.value) {
        this.paymentInfo.expirationDate = expMonth.value + expYear.value;
      }
      const currentYear = this.currentDate.getFullYear() % 100;
      if (!!expYear.value && !!expMonth.value) {
        if (this.currentDate.getMonth() + 1 > +expMonth.value && currentYear >= +expYear.value) {
          return {
            cardExpirationInvalid: true
          };
        }
      }
    };
  }

  public toggleNewCardForm(): void {
    this.isEditPayment = false;
    if (!!this.showAddCardSection) { // if add card was expanded then reset forms when collapse
      this.billingAddress = { address1: '', address2: '', name: '', city: '', state: '', postalCode: '' } as IFirebaseAddress;
      this.paymentInfoForm.reset();
      this.resetBillingForm = true;
    } else {
      this.morePaymentNeeded = false;
    }
    sessionStorage.removeItem('payment_id');
    this.showAddCardSection = !this.showAddCardSection;
    this.showCardRequired = false;
    this.payWithCard = true;
    this.selectedPaymentMethod = null;
    this.autoRenew = true;
  }

  public setValidAddress(isValid: boolean): void {
    this.isValidAddress = isValid;
  }

  public addressLookUpChanged(address: IAddress): void {
    this.isEditPayment = false;
    this.billingAddress = Object.assign(this.billingAddress, address);
    this.morePaymentNeeded = false;
    if (typeof this.billingAddress.address1 === 'object' && !!this.billingAddress?.address1) {
      // tslint:disable-next-line:no-string-literal
      this.billingAddress.address1 = this.billingAddress.address1['main_text'];
    }
    if (!!this.isValidAddress) {
      this.paymentInfo = Object.assign(this.paymentInfo, this.billingAddress);
      const cardExpirationMonth = this.paymentInfoForm.get('cardExpirationMonth').value;
      const cardExpirationYear = this.paymentInfoForm.get('cardExpirationYear').value;
      if (!!cardExpirationMonth && !!cardExpirationYear) {
        this.paymentInfo.expirationDate = cardExpirationMonth + cardExpirationYear;
      }
      this.paymentInfo.cardNumber = this.paymentInfoForm.get('cardNumber').value;
      this.paymentInfo.cardNumber = this.paymentInfo.cardNumber.toString().replace(/\t\s+|-/g, '');
      this.paymentInfo.cardCode = this.paymentInfoForm.get('cardCode').value;
      this.paymentInfo.fullName = this.paymentInfoForm.get('fullName').value;
    } else {
      this.paymentInfo = Object.assign(this.paymentInfo, this.billingAddress);
    }

  }

  public updateSaveCCInfoChanged(): void {
    this.isEditPayment = false;
    if (!!this.autoRenew && !this.selectedPaymentMethod) {
      this.saveCCInfo = true; // if there is auto renew then we save the cc
    }
    this.checkoutService.updateSaveCC(this.saveCCInfo);
  }

  public updateAutoRenew(): void {
    this.checkoutService.updateAutoRenew(this.autoRenew);
    this.mobilePlansService.setAutoRenewPlan(this.autoRenew);
    sessionStorage.setItem('auto_renew', !!this.autoRenew ? 'true' : 'false');
  }
  public setBalance(): void { // when the user clicks on the input and erase the value without clicking apply then reset to saved value
    if (!this.usedBalance && this.usedBalance !== 0) {
      this.usedBalance = this.savedBalance;
      this.isChangingBalance = false;
    }
  }
  public setReward(): void {
    if (!this.usedReward && this.usedReward !== 0) {
      this.usedReward = this.savedReward;
      this.isChangingReward = false;
    }
  }

  public continueMigration(): void {
    sessionStorage.setItem('validPayment', 'true');
    const nextStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT);
    this.checkoutService.updateCheckoutStep(nextStep);
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PLACE_ORDER}`]);
  }
  public nextCheckoutStep(): void {
    this.nextClicked = true;
    this.isEditPayment = false;
    const sum = +this.rewardAmount + +this.balanceAmount; //add + at the beginning of the variable to keep it as number
    const enoughBalancePayments = sum === this.total ? true : false;
    const isValidBalanceUse = this.balanceAmount <= (this.total - this.rewardAmount) && !!this.userAccount && this.userAccount.accountBalance && this.balanceAmount <= this.userAccount.accountBalance;
    const isValidRewardUse = this.rewardAmount <= (this.total - this.balanceAmount)&& !!this.userAccount && !!this.userAccount.rewards && this.userAccount.rewards.available > 0;
    const isValidCardPayment = !!this.payWithCard && (!!this.selectedPaymentMethod || !!this.enteredCard);
    const isValidPayWithVoucher = !!this.payWithVoucher && !!this.voucherForm.valid && this.showVoucherSuccess;
    if ((!!isValidCardPayment && ((!!this.payWithBalance && isValidBalanceUse) || !this.payWithBalance) && ((!!this.payWithReward && isValidRewardUse) || !this.payWithReward)) ||
    (!this.payWithCard && ((!!this.payWithBalance && isValidBalanceUse && enoughBalancePayments) || (!!this.payWithReward && isValidRewardUse && enoughBalancePayments))) || (!!isValidPayWithVoucher)) {
      this.morePaymentNeeded = false;
      const paymentType = [];
        if (!!isValidBalanceUse) {
          paymentType.push('balance');
        }
        if (!!isValidRewardUse) {
          paymentType.push('reward');
        }
        if (!!isValidCardPayment) {
          paymentType.push('credit card');
        }
        if(!!isValidPayWithVoucher) {
          paymentType.push('voucher');
        }
        sessionStorage.setItem('useFromBalance', this.balanceAmount.toString());
        sessionStorage.setItem('useFromReward', this.rewardAmount.toString());
        this.analyticsService.trackAddPaymentInfoGA4(this.cart, paymentType, this.simPrice, this.simId);
        this.checkoutService.setPayments({card: !this.isNewPayment ? this.selectedPaymentMethod: this.paymentInfo, balanceAmount: +this.balanceAmount, rewardsAmount: +this.rewardAmount, voucherAmount: this.voucherAmount})
        // this.checkoutService.updatePaymentMethod(this.selectedPaymentMethod);
        // this.checkoutService.updateCreditBalance({balanceAmount: this.balanceAmount, rewardsAmount: this.rewardAmount});
        this.processPayment();

    } else {
      if (this.isMigration && (!this.shippingMethod || (!!this.shippingMethod && this.shippingMethod.price === 0))) {
        this.processPayment();
      } else {
        this.morePaymentNeeded = true;
        let el = document.getElementById('title');
        el.scrollIntoView();
      }
    }
  }

  private processPayment(): void {
    sessionStorage.setItem('validPayment', 'true');
    const nextStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT);
    this.checkoutService.updateCheckoutStep(nextStep);
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PLACE_ORDER}`]);
  }
  public goBack(): void {
    if(!!this.cart?.eSIM && (!this.cart?.phones || (!!this.cart?.phones && this.cart?.phones.length === 0)) || !!this.cart?.activationCode) {
      this.checkoutService.setPayments({card: !this.isNewPayment ? this.selectedPaymentMethod: this.paymentInfo, balanceAmount: +this.balanceAmount, rewardsAmount: +this.rewardAmount, voucherAmount: this.voucherAmount})
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    } else {
      this.checkoutService.setPayments({card: !this.isNewPayment ? this.selectedPaymentMethod: this.paymentInfo, balanceAmount: +this.balanceAmount, rewardsAmount: +this.rewardAmount, voucherAmount: this.voucherAmount})
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.SHIPPING_SECTION}`]);
    }
  }
  public saveCard(): void {
    this.paymentInfoForm.markAllAsTouched();
    this.touchBillingForm = true;
    if (!!this.paymentInfoForm.valid && ((!this.billingSameAsShipping && this.isValidAddress) || !!this.billingSameAsShipping)) {
      this.prepareCCData();
      this.accountPaymentService.getExistPaymentMethod(this.paymentInfo).then((paymentMethod) => {
        if (!!paymentMethod && paymentMethod.id) {
          this.cardExists = true;
          this.appState.loading = false;
          this.toastHelper.showWarning('Credit Card already exists!');
        } else {
          this.cardExists = false;
          if (!!this.saveCCInfo && !!this.methodsList && this.methodsList.length > 0 && !!this.userHasPurchases) { // if the user already has purchases then we call save card other wise the save will be done from checkout API if needed
            this.appState.loading = true;
            this.accountPaymentService.addPaymentMethod(this.paymentInfo, this.recaptchaResponse).then((methodId) => {
              this.appState.loading = false;
              this.toastHelper.showSuccess('Credit Card saved successfully');
              sessionStorage.setItem('payment_id', methodId);
              setTimeout(() => {
                this.selectedPaymentMethod = this.methodsList.find((m) => m.id === methodId);
                let el = document.getElementById('cart-section');
                el.scrollIntoView();
              }, 500);
              this.processingRequest = false;
              this.resetPayment();
            }, (error) => {
                this.processingRequest = false;
                this.appState.loading = false;
                this.toastHelper.showAlert('Credit Card was not saved successfully.If you keep getting this error, please contact customer support!');
                console.warn(error);
                this.reCaptcha.resetReCaptcha();
                this.reCaptcha.execute();
            });
          } else {
            sessionStorage.setItem('payment_id', '1');
            this.convertPaymentData(true);
            this.isNewPayment = true;
            this.resetPayment();
            setTimeout(() => {
              let el = document.getElementById('cart-section');
              el.scrollIntoView();
            }, 500);
           
          }
        }
      });
    }
  }
  private convertPaymentData(pushToList?: boolean): void {
    const newPaymentMethod = {} as IFirebasePaymentMethod;
    newPaymentMethod.address1 = this.paymentInfo.address1;
    newPaymentMethod.address2 = this.paymentInfo.address2;
    newPaymentMethod.city = this.paymentInfo.city;
    newPaymentMethod.state = this.paymentInfo.state;
    newPaymentMethod.postalCode = this.paymentInfo.postalCode;
    newPaymentMethod.country = this.paymentInfo.country;
    newPaymentMethod.name = this.billingAddress.name;
    newPaymentMethod.fullName = this.paymentInfo.fullName;
    newPaymentMethod.last4 = parseInt(this.paymentInfo.cardNumber.slice(-4), 10);
    newPaymentMethod.method = 'Credit Card';
    newPaymentMethod.isDefault = true;
    newPaymentMethod.defaultCreditCard = false;
    newPaymentMethod.expirationDate = this.paymentInfo.expirationDate;
    newPaymentMethod.id = '';
    this.selectedPaymentMethod = newPaymentMethod;
    if (!!this.methodsList && this.methodsList.length > 0) {
      this.methodsList.push(newPaymentMethod);
      this.selectedPaymentMethod = newPaymentMethod;
    } else {
      this.enteredCard = newPaymentMethod;
    }
    this.morePaymentNeeded = false;
  }
  private resetPayment(): void {
    this.processingRequest = false;
    this.billingAddress.name = ' ';
    this.billingAddress = { address1: '', address2: '', name: '', city: '', state: '', postalCode: '' } as IFirebaseAddress;
    this.paymentInfoForm.reset();
    this.resetBillingForm = true;
    this.showAddCardSection = false;
  }
  private prepareCCData(): void {
    this.paymentInfo = Object.assign(this.paymentInfo, this.billingAddress);
    const cardExpirationMonth = this.paymentInfoForm.get('cardExpirationMonth').value;
    const cardExpirationYear = this.paymentInfoForm.get('cardExpirationYear').value;
    if (!!cardExpirationMonth && !!cardExpirationYear) {
      this.paymentInfo.expirationDate = cardExpirationMonth + cardExpirationYear;
    }
    this.paymentInfo.cardNumber = this.paymentInfoForm.get('cardNumber').value;
    this.paymentInfo.cardNumber = this.paymentInfo.cardNumber.toString().replace(/\t\s+|-/g, '');
    this.paymentInfo.cardCode = this.paymentInfoForm.get('cardCode').value;
    this.paymentInfo.fullName = this.paymentInfoForm.get('fullName').value;
    if (!!this.shippingAddress && this.billingSameAsShipping) {
      this.billingAddress = this.shippingAddress;
      delete this.billingAddress.id;
    }
    this.paymentInfo.address1 = AccountPaymentService.shortenAddress(this.paymentInfo.address1, 30);
    this.paymentInfo.address2 = !!this.paymentInfo.address2 ? AccountPaymentService.shortenAddress(this.paymentInfo.address2, 30) : '';
    this.paymentInfo.city = AccountPaymentService.shortenAddress(this.paymentInfo.city, 20);
    this.paymentInfo = Object.assign(this.paymentInfo, this.billingAddress);
    this.paymentInfo.cardNumber = this.paymentInfo.cardNumber.toString().replace(/\t\s+|-/g, '');
    this.paymentInfo.type = 'creditCard'
    this.paymentInfo.country = 'United States';
  }
}
