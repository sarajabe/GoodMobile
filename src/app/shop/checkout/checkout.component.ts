import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { PageScrollService } from 'ngx-page-scroll-core';
import { Subscription, ReplaySubject } from 'rxjs';
import { FadeInOutAnimation } from '../../app.animations';
import {
  AccountPaymentService, CustomizableMobilePlan, FirebaseUserProfileService, IAddress, ICreditCardInfo,
  IFirebaseAddress, IShippingMethod, IUser, IVoucherData, IPhoneProduct, MobileCustomPlansService, MobilePlanItem,
  ShippingConfigurationService, UserPlansService, ShopConfigurationService,
  IPhoneDetails, IUserPlan, CART_TYPES, PlansConfigurationService,
  IEstimateShipping, ShippingService, GenericMobilePlanItem, MobilePlanDetails, ActionsAnalyticsService,
  PURCHASE_INTENT, IDeviceCompatibilityV1, IMigrationCartItem, UserAccountService, IUserAccount, CatalogService, ICatalogItem, IMarketingDetails, ITaxesAndFeesResult,
} from '@ztarmobile/zwp-service-backend';
import { FLOW_STATE, FLOW_STEPS_IDS, IFlowIndicator, IFlowIndicatorStep } from './flow-indicator/flow-indicator';
import { CheckoutService, CheckoutSimCard } from './checkout.service';
import { PlansShopService } from '../plans-and-features/plans-shop.service';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { AppState } from '../../app.service';
import { ToastrHelperService } from '../../../services/toast-helper.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { combineLatest, take, takeWhile } from 'rxjs/operators';
import { CHECKOUT_ROUTE_URLS, SHOP_ROUTE_URLS, ACCOUNT_ROUTE_URLS, ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { PhoneManagementService } from 'src/services/phones.service';


@Component({
  templateUrl: './checkout.component.html',
  selector: 'app-checkout',
  styleUrls: ['./checkout.component.scss'],
  animations: [FadeInOutAnimation]
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  public currentPlan: CustomizableMobilePlan;
  public eventsSubscription: Subscription;
  public userPlan: IUserPlan;
  public user: IUser;
  public userAccount: IUserAccount;
  public estimateShipping: IEstimateShipping;
  public selectedCreditCardPaymentInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public shippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public storedShippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public storePickup = false;
  public inPerson = false;
  public storedPaymentId: string;
  public billingName: string;
  public deviceImageURL: string;
  public activeUserPlanId: string;
  public changeRequestMdn: string;
  public phone: IPhoneDetails;
  public parentPlans: Array<MobilePlanItem>;
  public FLOW_STEPS_IDS = FLOW_STEPS_IDS;
  public flowSettings: IFlowIndicator = {} as IFlowIndicator;
  public currentStep: IFlowIndicatorStep = {} as IFlowIndicatorStep;
  public showOrderDetails = true;
  public cardInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public orderShippingMethod: IShippingMethod = {} as IShippingMethod;
  public newSimOrder: { price: number, fees: number, id?: string };
  public autoRenewPlan = false;
  public autoRenewTopUp = false;
  public disableAutoRenewA = false;
  public isLoggedIn = false;
  public isPaymentDone = false;
  public isVoucherPayment = false;
  public processingRequest = false;
  public usingPaymentProfile = false;
  public saveCcInfo = true;
  public noMoreFundsRequired = false;
  public hasShippingItems = false;
  public allowVouchers = true;
  public isAddOnPlan = false;
  public isChangePlan = false;
  public isTopUpPlan = false;
  public isNewPlan = false;
  public isSimOrder = false;
  public isAddonSuccess = false;
  public isNewSimSuccess = false;
  public currentCartType = '';
  public CART_TYPES = CART_TYPES;
  public daysEstimation: string;
  public isValidPostal = true;
  public showPaymentSection = false;
  public isUserDataReceived = false;
  public shippingInfoReceived = false;
  public paymentInfoReceived = false;
  public paymentIsSelected = false;
  public remainingAmount: number;
  public topUpChecked = false;
  public isPaymentWithVoucher = false;
  public isRemainingCalculated = false;
  public isOrderPage = false;
  public isPaymentPage = false;
  public taxes = 0;
  public fees = 0;
  public billingZipCode: string;
  public estimationZipCode: string;
  public estimatedTaxes = 0;
  public estimatedFees = 0;
  public realTaxes: number;
  public realFees: number;
  public isEstimated = false;
  public isCalculated = false;
  public toggleTaxEstimation = false;
  public useFromRewardStored = 0;
  public useFromBalanceStored = 0;
  public isApplicablePromo = false;
  public isItemUnavailable = false;
  public catalogChecked = false;
  public selectedPhoneFromCatalog: ICatalogItem;
  public discount = 0;
  private paymentSubscription: Subscription;
  private saveOnce = true;
  private nextCycleRenew = false;
  private alive = true;
  private total = 0;
  private baseTotal = 0;
  private isPlanReadySubject: ReplaySubject<string> = new ReplaySubject<string>(1);
  private previousPhoneId: string;
  private isRemove = false;

  constructor(private route: ActivatedRoute,
    private userProfileService: FirebaseUserProfileService,
    private router: Router,
    private simpleAuthService: SimpleAuthService,
    private toastHelper: ToastrHelperService,
    private shippingConfigurationService: ShippingConfigurationService,
    private checkoutService: CheckoutService,
    private userPlanService: UserPlansService,
    private plansShopService: PlansShopService,
    private mobilePlansService: MobileCustomPlansService,
    private appState: AppState,
    private plansConfigurationService: PlansConfigurationService,
    private shopConfigurationService: ShopConfigurationService,
    private accountPaymentService: AccountPaymentService,
    private modalHelper: ModalHelperService,
    private shippingService: ShippingService,
    private analyticsService: ActionsAnalyticsService,
    private pageScrollService: PageScrollService,
    private userAccountService: UserAccountService,
    private catalogService: CatalogService,
    private stepsManagement: PhoneManagementService) {
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((authState) => {
      this.isLoggedIn = !!authState && !authState.isAnonymous;
    });
    this.route.queryParams.pipe(takeWhile(() => this.alive)).subscribe((query) => {
      if (!!query && query.mdn) {
        sessionStorage.setItem('emailMdn', query.mdn);
      }
    });
    this.getStoredData();
    this.router.events.pipe(takeWhile(() => this.alive)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('billing') > -1) {
          this.isPaymentPage = true;
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.alive = false;
    this.checkoutService.updatePaymentMethod({
      address1: '', name: '', cardCode: '', cardNumber: '', city: '',
      country: '', expirationDate: '', id: '', postalCode: '', state: ''
    });
    this.checkoutService.setPayments({
      card: {
        address1: '', name: '', cardCode: '', cardNumber: '', city: '',
        country: '', expirationDate: '', id: '', postalCode: '', state: ''
      }
    });
    this.checkoutService.updateShippingAddress({});
    this.checkoutService.updateStorePickup(false);
    this.checkoutService.updateInPersonDelivery(false);
    sessionStorage.removeItem('false');
    setTimeout(() => {
      this.paymentSubscription.unsubscribe();
    }, 200);
  }
  ngOnInit(): void {
    sessionStorage.removeItem('planID');
    this.checkoutService.updateCheckoutStepEmitter.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      this.nextFlowStep(step);
      this.currentStep = step;
      if (!!step && step.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD) {
        this.isPaymentPage = true;
      }
      else if (!!step && step.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT) {
        this.isOrderPage = true;
        if (!!this.flowSettings && this.flowSettings.steps && this.flowSettings.steps.length > 0) {
          const paymentStepIndex = this.flowSettings.steps
            .findIndex((flowStep) => (flowStep.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_VOUCHER || flowStep.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD));
          this.flowSettings.steps[paymentStepIndex].state = FLOW_STATE.STATE_DONE;
          const checkoutStepIndex = this.flowSettings.steps
            .findIndex((flowStep) => (flowStep.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT));
          this.flowSettings.steps[checkoutStepIndex].state = FLOW_STATE.STATE_CURRENT;
          if (!!this.hasShippingItems && !!this.shippingAddress && (!!this.shippingAddress.address1 || !!this.shippingAddress.id)) {
            this.shippingInfoReceived = true;
          }
        }
      }
      else {
        this.isOrderPage = false;
        this.isPaymentPage = false;
      }
    });
    this.checkoutService.editPaymentEmitter.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      this.enablePaymentEditing();
    });
    this.checkoutService.saveCCEmitter.pipe(takeWhile(() => this.alive)).subscribe((save) => {
      this.updateSaveCCInfo(save);
    });
    // listen to shipping address changes
    this.checkoutService.shippingAddressSubject.pipe(takeWhile(() => this.alive)).subscribe((address) => {
      if (!!address && !!address.address1) {
        this.shippingAddress = !!address ? Object.assign({
          id: !!address.id ? address.id : null,
          address1: !!address.address1 ? address.address1 : '',
          address2: !!address.address2 ? address.address2 : '',
          state: !!address.state ? address.state : '',
          country: !!address.country ? address.country : '',
          city: !!address.city ? address.city : '',
          postalCode: !!address.postalCode ? address.postalCode : '',
          name: !!address.name ? address.name : undefined,
          alias: !!address.alias ? address.alias : undefined
        } as IAddress) : address;
        if (!!this.shippingAddress) {
          this.shippingInfoReceived = true;
          this.estimateShippingArrival();
        }
      }
    });
    this.checkoutService.storePickupSubject.pipe(takeWhile(() => this.alive)).subscribe((isPickup) => {
      this.storePickup = isPickup;
      if (!!this.storePickup) {
        this.orderShippingMethod = {} as IShippingMethod;
        this.calculateTotal();
      }
    });
    this.checkoutService.inPersonSubject.pipe(takeWhile(() => this.alive)).subscribe((isPerson) => {
      this.inPerson = isPerson;
      if (!!this.inPerson) {
        this.orderShippingMethod = {} as IShippingMethod;
        this.calculateTotal();
      }
    });
    // listen to shipping method changes
    this.checkoutService.shippingMethodSubject.pipe(takeWhile(() => this.alive)).subscribe((method) => {
      if (!!method) {
        this.orderShippingMethod = method;
        this.calculateTotal();
      } else {
        this.orderShippingMethod = {} as IShippingMethod;
      }
    });

    this.paymentSubscription = this.checkoutService.paymentsSubject.pipe(takeWhile(() => this.alive)).subscribe((payments) => {
      this.useFromBalanceStored = !!payments && !!payments.balanceAmount ? payments.balanceAmount : this.useFromBalanceStored;
      this.useFromRewardStored = !!payments && !!payments.rewardsAmount ? payments.rewardsAmount : this.useFromRewardStored;
      if (!!payments) {
        if (!!payments.card) {
          const paymentInfo = payments.card;
          this.usingPaymentProfile = !!paymentInfo.id;
          if (!!paymentInfo.id) {
            this.selectedCreditCardPaymentInfo = {
              id: paymentInfo.id,
              cardNumber: !!paymentInfo.id ? '' : paymentInfo.cardNumber,
              cardCode: !!paymentInfo.id ? '' : paymentInfo.cardCode,
              fullName: paymentInfo.fullName,
              email: '', // this.user.email
              type: 'creditCardProfile',
              // Field Above shouldn't be edited?
              primary: paymentInfo.primary,
              expirationDate: paymentInfo.expirationDate,
            } as ICreditCardInfo;
            this.paymentIsSelected = true;
            this.cardInfo = paymentInfo;
          } else {
            this.usingPaymentProfile = false;
            this.paymentIsSelected = true;
            this.cardInfo = Object.assign({}, paymentInfo);
            this.cardInfo.type = 'creditCard';
            if (!this.cardInfo.state) {
              this.cardInfo.country = '';
            } else {
              this.cardInfo.country = 'United States';
            }
          }
          this.calculateTaxesAndFees();
        } else {
          this.paymentIsSelected = false;
          this.calculateTotal();
        }
      } else {
        this.cardInfo = null;
      }

    });

    this.checkoutService.autoRenewSubject.pipe(takeWhile(() => this.alive)).subscribe((autoRenew) => {
      this.autoRenewPlan = autoRenew;
    });
    this.checkoutService.taxesSubject.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.applyResetEstimatedTaxes();
    });
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => {
      this.user = user;
      setTimeout(() => {
        if (!!this.user && this.user.referredWithCode && this.user.referredWithCode !== this.user.referralCode
          && !!this.currentPlan && this.currentPlan.cartType === CART_TYPES.NEW_PLAN) {
          this.mobilePlansService.setReferralCode(this.user.referredWithCode);
        }
      }, 300);
      const emailMdnRedirect = sessionStorage.getItem('emailMdn');
      if (!!emailMdnRedirect && !this.user) {
        this.showOrderDetails = false; // when the user is redirected from auto renew reminder email and he is not logged in then hide the order details section
      }
      if (!!this.user && emailMdnRedirect) {
        this.appState.loading = true;
        this.showOrderDetails = true;
        this.userPlanService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
          if (!!plans) {
            const userPlans = plans;
            const MdnPlan = userPlans.find((plan) => plan.mdn === emailMdnRedirect);
            if (!!MdnPlan) {
              this.mobilePlansService.setCartType(CART_TYPES.TOPUP_PLAN);
              this.mobilePlansService.setActivePlanId(MdnPlan.id);
              sessionStorage.setItem('plan_id', MdnPlan.id);
              this.plansConfigurationService.planConfiguration.pipe(takeWhile(() => this.alive)).subscribe((conf) => {
                const selectedPlan = conf.allPlans.find((plan) => plan.id === MdnPlan.basePlan.id);
                const topUpPlan = new GenericMobilePlanItem(selectedPlan.id, selectedPlan.title, selectedPlan.subtitle, selectedPlan.price,
                  MobileCustomPlansService.ADD_ONS_TYPES.BASE_PLAN, new MobilePlanDetails(selectedPlan.minutes, selectedPlan.messages, selectedPlan.data, selectedPlan.mms),
                  selectedPlan.parentId, selectedPlan.virtual, selectedPlan.buttonText,
                  selectedPlan.extTitle, selectedPlan.description, selectedPlan.promoMessage, selectedPlan.promoCode, selectedPlan.promoPrice, selectedPlan.promoMonths);
                this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.NEW, [topUpPlan]);
                this.mobilePlansService.setBasePlan(topUpPlan);
              });
              setTimeout(() => {
                this.appState.loading = false;
              }, 2000);
            } else {
              this.appState.loading = false;
              this.toastHelper.showAlert(`This Mobile number ${emailMdnRedirect} is not found in your account`);
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
            }
          } else {
            this.appState.loading = false;
            this.toastHelper.showAlert(`This Mobile number ${emailMdnRedirect} is not found in your account`);
            this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
          }
        });
      }
    });
    this.shippingConfigurationService.newSimOrder.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.newSimOrder = order;
    });
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive), combineLatest(this.route.params, (plan, params: Params, isConfigurationReady) => {
      this.currentPlan = plan;
      this.autoRenewPlan = this.currentPlan.autoRenewPlan;
      this.calculateTotal();
      this.checkoutService.userCartReplySubject.next(this.currentPlan);
      if (!!this.currentPlan.phones && !this.catalogChecked) {
        this.catalogService.getCatalog('smartphone').then((data) => {
          this.appState.loading = false;
          this.catalogChecked = true;
          const catalogData = data.items;
          this.selectedPhoneFromCatalog = catalogData.find((item) => item.sku === this.currentPlan.phones[0].sku);
          this.selectedPhoneFromCatalog.image = this.currentPlan.phones[0].image;
          if (!!this.selectedPhoneFromCatalog && this.selectedPhoneFromCatalog.stock > 0) {
            this.isItemUnavailable = false;
          } else {
            this.isItemUnavailable = true;
            let customHtml = ``;
            if (this.currentPlan.cartType === CART_TYPES.NEW_PLAN) {
              customHtml = `The item ${this.currentPlan.phones[0].name}, is currently unavailable.
             Please choose another phone or remove it from cart to proceed.`;
            } else {
              customHtml = `The item ${this.currentPlan.phones[0].name}, is currently unavailable.
              Please choose another phone or remove it.`;
            }
            if (!document.body.classList.contains('modal-open')) {
              this.modalHelper.showItemOutOFStockModal('Action Required', customHtml, this.currentPlan, 'out-of-stock-modal', false);
            }
          }
          this.appState.loading = false;
        }, (error) => {
          this.appState.loading = false;
          this.toastHelper.showAlert(error.message);
        });
      }
      if (this.userPlanService.selectedUserPlan) {
        this.activeUserPlanId = this.userPlanService.selectedUserPlan.id;
      }
      if (!!this.currentPlan.activePlanId) {
        // eslint-disable-next-line no-shadow
        this.userPlanService.getUserPlan(this.currentPlan.activePlanId).then((plan) => {
          if (!!plan) {
            this.changeRequestMdn = plan.mdn;
            this.userAccountService.userAccounts.pipe(take(1)).subscribe((accounts) => {
              if (!!accounts) {
                this.userAccount = accounts.find((account) => account.mdn === plan.mdn);
              }
            });
            if (!!this.currentPlan && !!this.currentPlan.basePlan.isSpecialPromotion) {
              this.userAccountService.checkAvailablePromotion(plan.mdn).then((result) => {
                if (!!result) {
                  const applicableIndex = result.findIndex((promo) => promo.code === this.currentPlan.basePlan.specialPromotion.code);
                  this.isApplicablePromo = applicableIndex > -1 ? true : false;
                }
              });
            }
          }
        });
      }
      if (!!this.currentPlan && this.currentPlan.voucherData) {
        this.isVoucherPayment = !!this.currentPlan.voucherData;
      }
      if (params) {
        const nextCycleParam: string = params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE];
        this.nextCycleRenew = false;
        const addOnParam: string = params[SHOP_ROUTE_URLS.PARAMS.ADD_ON_PLAN];
        this.isAddOnPlan = addOnParam === 'true' || addOnParam === 'false';
        this.isChangePlan = nextCycleParam === 'true' || nextCycleParam === 'false';
        const simOrderParam: string = params[SHOP_ROUTE_URLS.PARAMS.ORDER_SIM];
        this.isSimOrder = simOrderParam === 'true' || simOrderParam === 'false';
      } else {
        this.isAddOnPlan = !!this.currentPlan.addOns;
        this.isSimOrder = this.currentPlan.simsQuantity > 0;
        this.isChangePlan = this.currentPlan.cartType === CART_TYPES.CHANGE_PLAN;
        this.isTopUpPlan = this.currentPlan.cartType === CART_TYPES.TOPUP_PLAN;
      }
      if (this.isChangePlan && !!this.activeUserPlanId) {
        this.isPlanReadySubject.next(this.activeUserPlanId);
      }
      if (this.isAddOnPlan) {
        this.isPlanReadySubject.next(this.activeUserPlanId);
        this.disableAutoRenew();
      }
      if (this.isSimOrder) {
        this.isPlanReadySubject.next(this.activeUserPlanId);
        this.disableAutoRenew();
      }

      if (!this.flowSettings.steps && !!this.currentPlan && !!this.currentPlan.cartType) {
        // Set the view flags:
        this.initFlowControl();
      } else {
        if (!!this.currentPlan && this.currentPlan.title !== 'No Plan' && this.currentCartType !== this.currentPlan.cartType) {
          this.initFlowControl();
        }
        this.currentCartType = this.currentPlan.cartType;
      }
      if (!!this.newSimOrder && this.currentPlan.cartType === CART_TYPES.PLAN_ITEMS && this.currentPlan.simsQuantity > 0) {
        const simPrice = this.newSimOrder.price;
        const simId = this.newSimOrder.id;
        this.analyticsService.trackBeginCheckoutGA4(this.currentPlan, simPrice, simId);
      } else {
        this.analyticsService.trackBeginCheckoutGA4(this.currentPlan);
      }
    })).subscribe();
    this.mobilePlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe((isReady) => {
      if (isReady) {
        this.parentPlans = this.mobilePlansService.parentBasePlans;
      }
    });
    this.checkoutService.placeOrder.pipe(takeWhile(() => this.alive)).subscribe((isPlaceOrder) => {
      if (!!isPlaceOrder) {
        this.checkout();
      }
    });
  }

  public validatePostalCode(): boolean {
    if (!this.processingRequest) {
      this.isValidPostal = /^\d{5}(-\d{4})?$/.test(this.billingZipCode);
      return this.isValidPostal;
    }
  }
  public estimateShippingArrival(): void {
    if (!!this.shippingAddress.postalCode && !!this.orderShippingMethod.id) {
      this.estimateShipping = {
        /* eslint-disable quote-props */
        'serviceType': this.orderShippingMethod.id,
        'destinationZip': this.shippingAddress.postalCode,
        'provider': 'usps'
      };
      this.shippingService.shippingEstimate(this.estimateShipping).then((result) => {
        if (!!result) {
          this.daysEstimation = result.days.toString();
        }
      }, (error) => {
        console.error(error);
      });
    }
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    if (!!this.selectedPhoneFromCatalog && this.currentPlan) {
      sessionStorage.setItem('phone', JSON.stringify(this.selectedPhoneFromCatalog));
      if (this.currentPlan.cartType === CART_TYPES.GENERIC_CART) {
        this.stepsManagement.updateSelectedLineOption('current');
        sessionStorage.setItem('selectedUserPlan', JSON.stringify(this.currentPlan));
      } else if (this.currentPlan.cartType === CART_TYPES.NEW_PLAN) {
        this.stepsManagement.updateSelectedLineOption('new');
        sessionStorage.setItem('selectedPlanId', JSON.stringify(this.currentPlan.id));
      }
    }
    if (!!this.flowSettings) {
      const shippingAddressStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS);
      const paymentStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD);
      if (document.location.href.indexOf('shipping') > -1) {
        // shippingAddressStep.state = FLOW_STATE.STATE_CURRENT;
        if (this.currentStep.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT) {
          shippingAddressStep.nextStepId = FLOW_STEPS_IDS.STEP_CHECKOUT;
        }
        this.currentStep = shippingAddressStep;
        this.shippingInfoReceived = false;
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.SHIPPING_SECTION}`]);
      } else if (document.location.href.indexOf('billing') > -1) {
        paymentStep.state = FLOW_STATE.STATE_CURRENT;
        if (this.currentStep.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT) {
          paymentStep.nextStepId = FLOW_STEPS_IDS.STEP_CHECKOUT;
        }
        if (!!this.shippingAddress && (!!this.shippingAddress.address1 || !!this.shippingAddress.id)) {
          this.shippingInfoReceived = true; // if the user enters shipping then goes to payment and clicks back and forward from browser
          const shippingAddressStepIndex = this.flowSettings.steps.findIndex((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS);
          this.flowSettings.steps[shippingAddressStepIndex].state = FLOW_STATE.STATE_DONE;
        }
        if (!!this.storePickup || !!this.inPerson) {
          const shippingAddressStepIndex = this.flowSettings.steps.findIndex((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS);
          this.flowSettings.steps[shippingAddressStepIndex].state = FLOW_STATE.STATE_DONE;
        }
        const paymentStepIndex = this.flowSettings.steps
          .findIndex((flowStep) => (flowStep.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_VOUCHER || flowStep.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD));
        this.flowSettings.steps[paymentStepIndex].state = FLOW_STATE.STATE_CURRENT;
        this.currentStep = paymentStep;
        this.paymentInfoReceived = false;
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PAYMENT_SECTION}`]);
      } else if (document.location.href.indexOf('customerinfo') > -1) {
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
      }
      else {
        if (!!this.saveOnce) {
          if (document.location.href.endsWith('/checkout') || document.location.href.indexOf('/checkout;') > -1) {
            window.history.back();
          }
          this.saveOnce = false;
        }
      }
    }
  }
  public enableShippingAddressEditing(event): void {
    const shippingAddressStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS);
    shippingAddressStep.state = FLOW_STATE.STATE_CURRENT;
    if (this.currentStep.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT) {
      shippingAddressStep.nextStepId = FLOW_STEPS_IDS.STEP_CHECKOUT;
    }
    this.currentStep = shippingAddressStep;
    this.shippingInfoReceived = false;
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.SHIPPING_SECTION}`]);
  }

  public updateShippingMethod(event): void {
    this.orderShippingMethod = event;
  }

  public enablePaymentEditing(): void {
    sessionStorage.removeItem('validPayment');
    this.paymentInfoReceived = false;
    this.noMoreFundsRequired = false;
    /* eslint-disable no-shadow */
    const paymentStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD);
    paymentStep.state = FLOW_STATE.STATE_CURRENT;
    if (this.currentStep.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT) {
      paymentStep.nextStepId = FLOW_STEPS_IDS.STEP_CHECKOUT;
    }
    this.currentStep = paymentStep;
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PAYMENT_SECTION}`]);
  }

  public nextFlowStep(step?): void {
    switch (this.currentStep.flowStepId) {
      case this.FLOW_STEPS_IDS.STEP_SIGN_IN:
        this.nextStep();
        break;
      case this.FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS:
        this.nextStep();
        break;
      case this.FLOW_STEPS_IDS.STEP_PAYMENT_VOUCHER:
        this.nextStep();
        break;
      case this.FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD:
        // go to checkout
        this.nextStep();
        break;
      case this.FLOW_STEPS_IDS.STEP_CHECKOUT:
        this.currentStep = this.flowSettings.steps.find((step) => step.flowStepId === this.FLOW_STEPS_IDS.STEP_CHECKOUT);
        break;
    }
  }

  public updateAutoRenew(autoRenew): void {
    this.autoRenewPlan = autoRenew;
  }
  public updateSaveCCInfo(event): void {
    this.saveCcInfo = event;
  }
  /**
   * Calculate total price of items in cart
   * calculations table
   * -------------------------------------------------------------------
   *                 New_plan   Top_Up   Change_plan   Add-ons   Sim_card
   * -------------------------------------------------------------------
   * Voucher(-)        true      true      true          true      false
   * shipping(+)       true      false     false         false     true
   * taxes&fees(+)     true      true      true          true      true
   * autoRenew(-)      true      false     false         false     false
   */
  public calculateTotal(): number {
    let total = 0;
    this.discount = 0;
    if (!this.currentPlan) {
      return 0;
    }
    if (this.currentPlan.cartType === CART_TYPES.NEW_PLAN) {
      if (!!this.currentPlan) {
        const priceAmount = !!this.currentPlan.basePlan.specialPromotion && !!this.currentPlan.basePlan.specialPromotion.promotionCycles ?
          this.currentPlan.basePlan.specialPromotion.promotionCycles * this.currentPlan.price : this.currentPlan.price;
        total += priceAmount;
      }
      if (!!this.autoRenewPlan) { // auto renew discount
        const promoAmount = !!this.currentPlan.basePlan.specialPromotion && !!this.currentPlan.basePlan.specialPromotion.promotionCycles ?
          this.currentPlan.basePlan.promoPrice * this.currentPlan.basePlan.specialPromotion.promotionCycles : this.currentPlan.basePlan.promoPrice;
        total -= promoAmount;
        this.discount = this.currentPlan.basePlan.promoPrice;
      }
      // order is important to calculate discount on price and auto pay
      if (!!this.currentPlan.basePlan.specialPromotion && !!this.currentPlan.basePlan.specialPromotion.promotionDiscount) {
        const discountAmountValue = this.currentPlan.basePlan.specialPromotion.promotionDiscount.split('%')[0];
        const discountValue = parseInt(discountAmountValue, 10);
        this.discount += (total * (discountValue / 100));
        total -= total * (discountValue / 100);
      }
      // if (!this.currentPlan.activationCode) {
      //   total = total + this.newSimOrder.price;
      // }
      this.baseTotal = total;
      if (this.hasShippingItems && !!this.orderShippingMethod && !!this.orderShippingMethod?.price) {
        total += this.orderShippingMethod.price;
      }
      if (!!this.taxes && this.paymentIsSelected && !!this.isCalculated) {
        total += this.taxes;
      }
      if (!!this.fees && this.paymentIsSelected && !!this.isCalculated) {
        total += this.fees;
      }
      if (!this.isCalculated) {
        total = total + this.estimatedFees + this.estimatedTaxes;
      }
      if (!!this.currentPlan.phones && this.currentPlan.phones.length > 0) {
        for (const phone of this.currentPlan.phones) {
          total += phone.price;
        }
      }
    }
    if (this.currentPlan.cartType === CART_TYPES.GENERIC_CART) {
      if (!!this.currentPlan.acpDevice) {
        total += this.currentPlan.acpDevice.price;
      }
      this.baseTotal = total;
    }
    if (this.currentPlan.cartType === CART_TYPES.CHANGE_PLAN) {
      if (!!this.currentPlan) {
        if (!!this.currentPlan.basePlan.subscriptionCycles) {
          total += this.currentPlan.basePlan.subscriptionPrice;
        } else {
          total += this.currentPlan.price;
        }
      }
      if (!!this.autoRenewPlan) {
        this.discount = this.currentPlan.basePlan.promoPrice;
        total -= this.currentPlan.basePlan.promoPrice;
      }
      this.baseTotal = total;
      if (!!this.taxes && !!this.isCalculated) {
        total += this.taxes;
      }
      if (!!this.fees && !!this.isCalculated) {
        total += this.fees;
      }
      if (!this.isCalculated) {
        total = total + this.estimatedFees + this.estimatedTaxes;
      }
    }
    if (this.currentPlan.cartType === CART_TYPES.TOPUP_PLAN) {
      if (!!this.currentPlan) {
        if (!!this.currentPlan.basePlan.subscriptionCycles) {
          total += this.currentPlan.basePlan.subscriptionPrice;
        } else {
          total += this.currentPlan.price;
        }
      }

      if (!!this.autoRenewPlan) {
        total -= this.currentPlan.basePlan.promoPrice;
        this.discount = this.currentPlan.basePlan.promoPrice;
      }
      if (!!this.isApplicablePromo) {
        const discountAmountValue = this.currentPlan.basePlan.specialPromotion.promotionDiscount.split('%')[0];
        const discountValue = parseInt(discountAmountValue, 10);
        this.discount += (total * (discountValue / 100));
        total -= total * (discountValue / 100);
      }
      this.baseTotal = total;

      if (!!this.taxes && !!this.isCalculated) {
        total += this.taxes;
      }
      if (!!this.fees && !!this.isCalculated) {
        total += this.fees;
      }

      if (!this.isCalculated) {
        total = total + this.estimatedFees + this.estimatedTaxes;
      }
    }
    if (!!this.currentPlan.addOns) {
      for (const addon of this.currentPlan.addOns) {
        total += addon.price * addon.quantity;
      }

      this.baseTotal = total;
      if (!!this.taxes && !!this.isCalculated) {
        total += this.taxes;
      }
      if (!!this.fees && !!this.isCalculated) {
        total += this.fees;
      }
      if (!this.isCalculated) {
        total = total + this.estimatedFees + this.estimatedTaxes;
      }

    }
    if (this.currentPlan.simsQuantity > 0 && this.currentPlan.cartType !== CART_TYPES.NEW_PLAN) {
      if (!!this.newSimOrder && this.currentPlan.cartType === CART_TYPES.PLAN_ITEMS) { // this condition to disable sim price calculation for migration) {
        total = total + this.newSimOrder.price;
      }
      this.baseTotal = total;
      if (this.hasShippingItems && !!this.orderShippingMethod && !!this.orderShippingMethod?.price) {
        total += this.orderShippingMethod.price;
      }
      if (!!this.taxes && !!this.isCalculated && !this.currentPlan.addOns) {
        total += this.taxes;
      }
      if (!!this.fees && !!this.isCalculated && !this.currentPlan.addOns) {
        total += this.fees;
      }
      if (!this.isCalculated && !this.currentPlan.addOns) {
        total = total + this.estimatedFees + this.estimatedFees;
      }
    }
    this.total = total >= 0 ? total : 0;
    this.checkoutService.setTotal(total);
    this.checkoutService.updateTotalDetails({ subtotal: this.baseTotal, shipping: !!this.orderShippingMethod?.price ? this.orderShippingMethod.price : 0, taxes: !!this.paymentIsSelected ? this.taxes : 0, fees: !!this.paymentIsSelected ? this.fees : 0, discount: this.discount, method: !!this.orderShippingMethod && Object.keys(this.orderShippingMethod).length > 0 ? this.orderShippingMethod : null });
  }
  public checkout(): void {
    if (!!this.currentPlan?.cartType) {
      switch (this.currentPlan.cartType) {
        case CART_TYPES.NEW_PLAN:
          this.checkoutNewPlan();
          break;
        case CART_TYPES.GENERIC_CART:
          this.checkoutNewPlan();
          break;
        case CART_TYPES.CHANGE_PLAN:
          this.checkoutChangePlan();
          break;
        case CART_TYPES.TOPUP_PLAN:
          this.checkoutTopUpPlan();
          break;
        case CART_TYPES.MIGRATION:
          this.checkoutMigrationOrder();
          break;
      }
      if (!!this.currentPlan.addOns && this.currentPlan.simsQuantity < 1) {
        this.checkoutAddonPlan();
      }
      if (this.currentPlan.simsQuantity > 0 && !this.currentPlan.addOns && this.currentPlan.cartType === CART_TYPES.PLAN_ITEMS) {
        this.orderNewSim();
      }
      if (!!this.currentPlan.addOns && this.currentPlan.simsQuantity > 0) {
        this.checkoutPlanItem();
      }
    }

  }
  public clearUserCart(event): void {
    if (!this.currentPlan) {
      return;
    }
    const question = (this.currentPlan.cartType === CART_TYPES.NEW_PLAN) || (this.currentPlan.cartType === CART_TYPES.CHANGE_PLAN) ?
      'Are you sure you want to remove plan?' : 'Are you sure you want to remove item?';
    const confirmMessage = (this.currentPlan.cartType === CART_TYPES.NEW_PLAN) || (this.currentPlan.cartType === CART_TYPES.CHANGE_PLAN) ?
      'By clicking yes you agree to remove plan from your cart' : 'By clicking yes you agree to remove item from your cart';
    this.modalHelper.showConfirmMessageModal(question, confirmMessage, 'Yes', 'Cancel', 'clean-cart-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          switch (this.currentPlan.cartType) {
            case CART_TYPES.NEW_PLAN:
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              sessionStorage.setItem('removeFromCart', 'true');
              this.flowSettings.steps = [{} as IFlowIndicatorStep];
              this.analyticsService.trackRermoveFromCartGA4([this.currentPlan.basePlan]);
              this.checkoutService.shippingAddressSubject.next(undefined);
              this.checkoutService.storePickupSubject.next(undefined);
              this.checkoutService.inPersonSubject.next(undefined);
              this.router.navigate([ROUTE_URLS.HOME]);
              break;
            case CART_TYPES.PLAN_ITEMS:
              this.removeItemFromCart(event);
              break;
            case CART_TYPES.CHANGE_PLAN:
              this.mobilePlansService.clearUserCart();
              this.analyticsService.trackRermoveFromCartGA4([this.currentPlan.basePlan]);
              this.appState.clearSessionStorage();
              this.flowSettings.steps = [{} as IFlowIndicatorStep];
              this.checkoutService.shippingAddressSubject.next(undefined);
              this.checkoutService.storePickupSubject.next(undefined);
              this.checkoutService.inPersonSubject.next(undefined);
              sessionStorage.setItem('removeFromCart', 'true');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
            case CART_TYPES.TOPUP_PLAN:
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              this.flowSettings.steps = [{} as IFlowIndicatorStep];
              this.analyticsService.trackRermoveFromCartGA4([this.currentPlan.basePlan]);
              this.checkoutService.shippingAddressSubject.next(undefined);
              this.checkoutService.storePickupSubject.next(undefined);
              this.checkoutService.inPersonSubject.next(undefined);
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
            case CART_TYPES.MIGRATION:
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              this.flowSettings.steps = [{} as IFlowIndicatorStep];
              this.analyticsService.trackRermoveFromCartGA4([this.currentPlan.basePlan]);
              this.checkoutService.shippingAddressSubject.next(undefined);
              this.checkoutService.storePickupSubject.next(undefined);
              this.checkoutService.inPersonSubject.next(undefined);
              sessionStorage.setItem('isMigrationSimRemoved', 'true');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
            default:
              this.analyticsService.trackRermoveFromCartGA4([this.currentPlan.basePlan]);
              this.mobilePlansService.clearUserCart();
              this.flowSettings.steps = [{} as IFlowIndicatorStep];
              this.appState.clearSessionStorage();
              this.checkoutService.shippingAddressSubject.next(undefined);
              this.checkoutService.storePickupSubject.next(undefined);
              this.checkoutService.inPersonSubject.next(undefined);
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
          }
        }
      });
  }
  public pageDescription(currentStepPageDescription: string): string {
    if (!!this.currentPlan && !!this.currentPlan.basePlan && !!this.currentPlan.basePlan.parentId) {
      const planCategory = this.planCategory(this.currentPlan.basePlan.parentId);
      return `Your ${planCategory} is ready to go, ${currentStepPageDescription}`;
    } else {
      if (!!this.currentPlan) {
        if (this.currentPlan.cartType === CART_TYPES.PLAN_ITEMS) {
          let descriptiveText = '';
          if (this.currentPlan.simsQuantity > 0 && !this.currentPlan.addOns) {
            descriptiveText = 'SIM Card ';
          }
          if (this.currentPlan.simsQuantity === 0 && !!this.currentPlan.addOns) {
            descriptiveText = 'Plan addon ';
          }
          if (this.currentPlan.simsQuantity > 0 && !!this.currentPlan.addOns) {
            descriptiveText = 'Plan items ';
            return `Your ${descriptiveText} are ready to go, ${currentStepPageDescription}`;
          }
          return `Your ${descriptiveText} is ready to go, ${currentStepPageDescription}`;
        }
        return '';
      }
    }
  }
  public removePhone(): void {
    this.mobilePlansService.setPlanExpectedDevice(null);
  }
  public goToCompatiblity(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.REFERENCE_PAGE] = SHOP_ROUTE_URLS.CHECKOUT;
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`, params]);
  }
  public removePlanDevice(): void {
    this.modalHelper.showConfirmMessageModal('Remove Device', 'Are you sure you want to remove your compatible device?', 'Yes', 'Cancel', 'clean-cart-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.mobilePlansService.setPlanDevice(null);
        }
      });
  }
  public showSelectedPhonePopup(): void {
    this.modalHelper.showInformationMessageModal('Your selected phone',
      '',
      'Continue with plan purchase',
      null, true, 'big-button',
      `<p>First, continue with your plan purchase. Then you will be directed to complete your selected device purchase from an online retailer.</p>
    <p>If you have more questions please contact us on: <a class="text-color-secondary" href="mailto:support@goodmobile.org">support@goodmobile.org</a></p>`
    );
  }
  public calculateTaxesAndFees(): void {
    if (!!this.currentPlan) {
      let purchaseDetails = {};
      if (!!this.cardInfo && !!this.cardInfo?.cardNumber) {
        this.cardInfo.cardNumber = this.cardInfo?.cardNumber.toString().replace(/\t\s+|-/g, '');
      }
      const storedAutoRenew = sessionStorage.getItem('auto_renew');
      const autoRenew = storedAutoRenew === 'true' ? true : false;
      if (this.currentPlan.cartType === CART_TYPES.NEW_PLAN) {
        purchaseDetails = {
          basePlanId: this.currentPlan.basePlan.id,
          simsQuantity: this.currentPlan.simsQuantity,
          paymentInfo: !!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber || !!this.cardInfo.state) ? this.cardInfo : null,
          shippingAddress: !this.storePickup && !this.inPerson ? this.shippingAddress : null,
          usingPaymentProfile: !!this.cardInfo && !!this.cardInfo?.id ? true : false,
          voucherCode: !!this.currentPlan.voucherData ? this.currentPlan.voucherData.code : null,
          orderShipMethod: !!this.orderShippingMethod && !this.storePickup && !this.inPerson ? this.orderShippingMethod.id : null,
          autoRenewPlan: this.autoRenewPlan,
          promoCode: !!this.autoRenewPlan ? '' + this.currentPlan.basePlan.promoPrice : null,
          savePaymentMethod: !!this.cardInfo && (!!this.cardInfo?.cardNumber || !!this.cardInfo?.id) && this.saveCcInfo ? true : false,
          storePickup: this.storePickup
        };
        this.appState.loading = true;
        this.mobilePlansService.calculateTaxesAndFees(purchaseDetails).then((result) => {
          this.applyTaxes(result);
        }, (error) => {
          this.appState.loading = false;
          this.applyResetEstimatedTaxes(error);
        });
      }
      if (!!this.currentPlan.activePlanId) {
        this.userPlanService.getUserPlan(this.currentPlan.activePlanId).then((plan) => {
          if (!!plan) {
            this.changeRequestMdn = plan.mdn;
          }
          if (this.currentPlan.cartType === CART_TYPES.CHANGE_PLAN) {
            if (!!this.cardInfo && this.cardInfo?.id) {
              this.cardInfo.type = 'creditCardProfile';
            }
            if (!!this.cardInfo && this.cardInfo?.cardNumber) {
              this.cardInfo.type = 'creditCard';
            }
            purchaseDetails = {
              autoRenewPlan: this.autoRenewPlan,
              basePlanId: this.currentPlan.basePlan.id,
              nextCycleRenew: this.nextCycleRenew,
              paymentInfo: !!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber || !!this.cardInfo.state) ? this.cardInfo : null,
              usingPaymentProfile: !!this.cardInfo && !!this.cardInfo?.id ? true : false,
              voucherCode: !!this.currentPlan.voucherData ? this.currentPlan.voucherData.code : null,
              promoCode: !!this.autoRenewPlan ? '' + this.currentPlan.basePlan.promoPrice : null,
              savePaymentMethod: !!this.cardInfo && (!!this.cardInfo?.cardNumber || !!this.cardInfo?.id) && this.saveCcInfo ? true : false,
              mdn: this.changeRequestMdn,
              userPlanId: this.currentPlan.activePlanId,
              rewardsAmount: this.useFromRewardStored,
              balanceAmount: this.useFromBalanceStored,
              storePickup: this.storePickup
            };
            this.appState.loading = true;
            this.mobilePlansService.calculateTaxesAndFees(purchaseDetails).then((result) => {
              this.applyTaxes(result);
            }, (error) => {
              this.appState.loading = false;
              this.toastHelper.showAlert('Sorry, we are having an internal issue at the moment. Please contact customer care for help.');
            });
          }
          if (this.currentPlan.cartType === CART_TYPES.TOPUP_PLAN) {
            purchaseDetails = {
              basePlanId: this.currentPlan.basePlan.id,
              voucherCode: !!this.currentPlan.voucherData ? this.currentPlan.voucherData.code : null,
              paymentInfo: !!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber || !!this.cardInfo.state) ? this.cardInfo : null,
              autoRenewPlan: storedAutoRenew === 'true' ? true : false,
              mdn: this.changeRequestMdn,
              userPlanId: this.currentPlan.activePlanId,
              rewardsAmount: this.useFromRewardStored,
              balanceAmount: this.useFromBalanceStored,
              storePickup: this.storePickup
            };
            this.appState.loading = true;
            this.mobilePlansService.calculateTopupTaxesAndFees(this.currentPlan.activePlanId, purchaseDetails).then((result) => {
              this.applyTaxes(result);
            }, (error) => {
              this.appState.loading = false;
              this.toastHelper.showAlert('Sorry, we are having an internal issue at the moment. Please contact customer care for help.');
            });
          }
          if (this.currentPlan.cartType === CART_TYPES.PLAN_ITEMS) {
            if (this.currentPlan.simsQuantity < 1 && !!this.currentPlan.addOns) { // addons
              if (!!this.cardInfo && this.cardInfo?.id) {
                this.cardInfo.type = 'creditCardProfile';
              }
              if (!!this.cardInfo && this.cardInfo?.cardNumber) {
                this.cardInfo.type = 'creditCard';
              }
              purchaseDetails = {
                mdn: this.changeRequestMdn,
                userPlanId: this.currentPlan.activePlanId,
                addOns: this.currentPlan.addOns,
                addOnRenewable: false,
                paymentInfo: !!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber || !!this.cardInfo.state) ? this.cardInfo : null,
                nextCycle: false,
                newAddOnId: '',
                refillVoucher: !!this.currentPlan.voucherData ? this.currentPlan.voucherData.code : null,
                rewardsAmount: this.useFromRewardStored,
                balanceAmount: this.useFromBalanceStored,
                storePickup: this.storePickup
              };
              this.appState.loading = true;
              this.mobilePlansService.calculateAddonsTaxes(this.currentPlan.activePlanId, purchaseDetails).then((result) => {
                this.applyTaxes(result);
              }, (error) => {
                this.appState.loading = false;
                this.toastHelper.showAlert('Sorry, we are having an internal issue at the moment. Please contact customer care for help.');
              });
            } else if (!this.currentPlan.addOns && this.currentPlan.simsQuantity > 0) {
              if (!!this.cardInfo && this.cardInfo?.id) {
                this.cardInfo.type = 'creditCardProfile';
              }
              if (!!this.cardInfo && this.cardInfo?.cardNumber) {
                this.cardInfo.type = 'creditCard';
              }
              purchaseDetails = {
                shippingAddress: !this.storePickup && !this.inPerson ? this.shippingAddress : null,
                orderShipMethod: !this.storePickup && !this.inPerson ? this.orderShippingMethod.id : null,
                userPlanId: this.activeUserPlanId,
                simsQuantity: 1,
                paymentInfo: !!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber || !!this.cardInfo.state) ? this.cardInfo : null,
                usingPaymentProfile: (!!this.cardInfo && !!this.cardInfo?.id ? true : false),
                savePaymentMethod: (!!this.cardInfo && !!this.cardInfo?.id ? false : this.saveCcInfo),
                mdn: this.changeRequestMdn,
                rewardsAmount: this.useFromRewardStored,
                balanceAmount: this.useFromBalanceStored,
                storePickup: this.storePickup
              };
              this.appState.loading = true;
              this.mobilePlansService.calculateTaxesAndFees(purchaseDetails).then((result) => {
                this.applyTaxes(result);
              }, (error) => {
                this.appState.loading = false;
                this.toastHelper.showAlert('Sorry, we are having an internal issue at the moment. Please contact customer care for help.');
              });
            } else {
              if (!!this.currentPlan.addOns && this.currentPlan.simsQuantity > 0) {
                if (!!this.cardInfo && !!this.cardInfo?.id) {
                  this.cardInfo.type = 'creditCardProfile';
                }
                if (!!this.cardInfo && !!this.cardInfo?.cardNumber) {
                  this.cardInfo.type = 'creditCard';
                }
                purchaseDetails = {
                  mdn: this.changeRequestMdn,
                  addOns: this.currentPlan.addOns,
                  shippingAddress: !this.storePickup && !this.inPerson ? this.shippingAddress : null,
                  orderShipMethod: !this.storePickup && !this.inPerson ? this.orderShippingMethod.id : null,
                  userPlanId: this.activeUserPlanId,
                  simsQuantity: 1,
                  paymentInfo: !!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber || !!this.cardInfo.state) ? this.cardInfo : null,
                  refillVoucher: !!this.currentPlan.voucherData ? this.currentPlan.voucherData.code : null,
                  usingPaymentProfile: (!!this.cardInfo?.id ? true : false),
                  savePaymentMethod: (!!this.cardInfo && !!this.cardInfo?.id ? false : this.saveCcInfo),
                  rewardsAmount: this.useFromRewardStored,
                  balanceAmount: this.useFromBalanceStored,
                  storePickup: this.storePickup
                };
                this.appState.loading = true;
                this.mobilePlansService.calculateAddonSIMTaxesAndFees(this.currentPlan.activePlanId, purchaseDetails).then((result) => {
                  this.applyTaxes(result);
                }, (error) => {
                  this.appState.loading = false;
                  this.toastHelper.showAlert('Sorry, we are having an internal issue at the moment. Please contact customer care for help.');
                });
              }
            }
          }
          if (this.currentPlan.cartType === CART_TYPES.GENERIC_CART) {
            this.taxes = 0;
            this.fees = 0;
            this.isCalculated = true;
            this.calculateTotal();
          }
        });
      }
    }
  }

  private checkoutPlanItem(): void {
    if (!!this.cardInfo && this.cardInfo?.id) {
      this.cardInfo.type = 'creditCardProfile';
    }
    if (!!this.cardInfo && this.cardInfo?.cardNumber) {
      this.cardInfo.type = 'creditCard';
    }
    const purchaseDetails: any = {
      paymentInfo: !!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber || !!this.cardInfo.state) ? this.cardInfo : null,
      refillVoucher: !!this.currentPlan.voucherData ? this.currentPlan.voucherData.code : null,
      mdn: this.changeRequestMdn,
      userPlanId: this.currentPlan.activePlanId,
      rewardsAmount: this.useFromRewardStored,
      balanceAmount: this.useFromBalanceStored,
      nextCycle: false,
      storePickup: this.storePickup
    };
    if (!!this.currentPlan && this.currentPlan.addOns) {
      purchaseDetails.addOns = this.currentPlan.addOns;
      purchaseDetails.addOnRenewable = false;
      purchaseDetails.newAddOnId = '';
    }
    if (this.currentPlan.simsQuantity > 0) {
      purchaseDetails.shippingAddress = !this.storePickup && !this.inPerson ? this.shippingAddress : null;
      purchaseDetails.orderShipMethod = !this.storePickup && !this.inPerson ? this.orderShippingMethod.id : null;
      purchaseDetails.simsQuantity = 1;
    }
    const SIMDetails = { shippingPrice: this.orderShippingMethod.price, SIMPrice: this.newSimOrder.price, SIMId: this.newSimOrder.id };
    this.processingRequest = true;
    this.checkoutService.checkoutAddonAndSIM(this.currentPlan.activePlanId, purchaseDetails, this.currentPlan, this.taxes, this.fees, SIMDetails).then(() => {
      this.appState.loading = false;
      this.mobilePlansService.clearUserCart();
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message || error, '', 6000, false);
    });
  }
  private removeItemFromCart(item: string): void {
    const cartHasMultipleItems = this.currentPlan.simsQuantity > 0 && !!this.currentPlan.addOns && this.currentPlan.addOns.length > 0;
    if (item === 'sim') {
      this.currentPlan.simsQuantity = 0;
      this.mobilePlansService.setSimPurchaseQuantity(0);
    }
    if (item === 'sim' && !cartHasMultipleItems) { // cart has only sim and want to remove it
      this.mobilePlansService.clearUserCart();
      this.flowSettings.steps = [{} as IFlowIndicatorStep];
      // eslint-disable-next-line max-len
      this.analyticsService.trackRermoveFromCartGA4([{ id: 'SIMGWLTMO4GLTE', quantity: this.currentPlan.simsQuantity, price: this.newSimOrder.price, type: 'plan-item', title: 'SIM CARD' }]);
      this.appState.clearSessionStorage();
      this.checkoutService.shippingAddressSubject.next(undefined);
      this.checkoutService.storePickupSubject.next(undefined);
      this.checkoutService.inPersonSubject.next(undefined);
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.MANAGE_DEVICES}`]);
    }
    if (item === 'sim' && !!cartHasMultipleItems) { // cart has sim and addon and want to remove sim.
      // eslint-disable-next-line max-len
      this.analyticsService.trackRermoveFromCartGA4([{ id: 'SIMGWLTMO4GLTE', quantity: this.currentPlan.simsQuantity, price: this.newSimOrder.price, type: 'plan-item', title: 'SIM CARD' }]);
      this.appState.clearSessionStorage();
      this.checkoutService.updateShippingAddress(undefined);
      this.initFlowControl();
    }
    if (item === 'plan') {
      this.mobilePlansService.clearUserCart();
      this.appState.clearSessionStorage();
      this.flowSettings.steps = [{} as IFlowIndicatorStep];
      this.checkoutService.shippingAddressSubject.next(undefined);
      this.checkoutService.storePickupSubject.next(undefined);
      this.checkoutService.inPersonSubject.next(undefined);
      this.analyticsService.trackRermoveFromCartGA4([this.currentPlan.basePlan]);
      this.router.navigate([ROUTE_URLS.HOME]);
    }
    if (item !== 'sim' && item !== 'plan') { // remove from addons
      if (this.currentPlan.addOns.length === 1 && !cartHasMultipleItems) { // if cart has only one addon then clear cart
        this.mobilePlansService.clearUserCart();
        this.flowSettings.steps = [{} as IFlowIndicatorStep];
        this.appState.clearSessionStorage();
        this.checkoutService.shippingAddressSubject.next(undefined);
        this.checkoutService.storePickupSubject.next(undefined);
        this.checkoutService.inPersonSubject.next(undefined);
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`]);
      } else {
        let cartAddons = this.currentPlan.addOns;
        cartAddons = cartAddons.filter((addon) => addon.id !== item);
        this.mobilePlansService.setAddonsList(cartAddons, this.currentPlan).then(() => {
          setTimeout(() => {
            if (!!this.isOrderPage) {
              this.enablePaymentEditing();
            } else {
              this.calculateTaxesAndFees();
            }
          }, 100);
        });
      }
      this.analyticsService.trackRermoveFromCartGA4(this.currentPlan.addOns);
    }
  }
  private disableAutoRenew(): void {
    this.autoRenewPlan = false;
    this.disableAutoRenewA = true;
  }

  private checkoutNewPlan(): void {
    const device = { network: 'tmo', networkType: 'GSM', skuIdentifier: 'T', skuNumber: 'SIMGWLTMO4GLTE' } as IDeviceCompatibilityV1;
    if (!!this.currentPlan.planExpectedDevice || (!this.currentPlan.planDevice && !this.currentPlan.planExpectedDevice)) {
      this.mobilePlansService.setPlanDevice(device); // send default SIM if the user selects a phone from shop or no device at all
    }
    if (!!this.isVoucherPayment) {
      this.mobilePlansService.setAutoRenewPlan(false);
    }
    const cart = {
      currentPlan: this.currentPlan,
      shippingAddress: this.hasShippingItems && !this.storePickup && !this.inPerson ? this.shippingAddress : null,
      cardInfo: !!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber) ? this.cardInfo : null,
      options: {
        autoRenewPlan: !!this.isVoucherPayment ? false : this.currentPlan.autoRenewPlan,
        isVoucherPayment: this.isVoucherPayment,
        saveCcInfo: !!this.cardInfo && !!this.cardInfo?.cardNumber ? !!this.saveCcInfo : false,
        usingPaymentProfile: !!this.cardInfo && !!this.cardInfo?.id ? true : false,
        taxes: this.taxes,
        fees: this.fees,
        simId: this.newSimOrder.id,
        simPrice: this.newSimOrder.price,
        haseSIM: this.currentPlan.eSIM,
        storePickup: !!this.currentPlan?.activationCode ? false : this.storePickup
      },
      orderShippingMethod: this.hasShippingItems && !this.storePickup && !this.inPerson ? this.orderShippingMethod : null,
      hasShippingItems: this.hasShippingItems,
      deliveryMethod: !!this.storePickup ? 'storePickup' : (!!this.hasShippingItems && !!this.shippingAddress ? 'homeDelivery' : 'inPersonDelivery')
    };
    this.checkoutService.checkoutNewPlan(cart).then(() => {
      this.checkoutService.paymentsSubject.next(null);
      this.checkoutService.detailsSubject.next(null);
      this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((data) => {
        if (!!data && data.activeCampaign) {
          this.appState.loading = false;
          data.activeCampaign = {} as IMarketingDetails;
          this.userProfileService.updateUserProfile(data);
        }
      });
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message || error, '', 6000, false);
    });
  }

  private checkoutChangePlan(): void {
    const storedNextCycle = sessionStorage.getItem('changeNextCycle');
    if (!!storedNextCycle) {
      this.nextCycleRenew = false;
    }
    if (!!this.cardInfo && this.cardInfo?.id) {
      this.cardInfo.type = 'creditCardProfile';
    }
    if (!!this.cardInfo && this.cardInfo?.cardNumber) {
      this.cardInfo.type = 'creditCard';
    }
    this.checkoutService.checkoutChangePlan({
      currentPlan: this.currentPlan,
      cardInfo: (!!this.cardInfo && (this.cardInfo?.id || this.cardInfo?.cardNumber)) ? this.cardInfo : null,
      options: {
        autoRenewPlan: this.currentPlan.autoRenewPlan,
        isVoucherPayment: this.isVoucherPayment,
        saveCcInfo: this.saveCcInfo,
        usingPaymentProfile: !!this.cardInfo?.id ? true : false,
        taxes: this.taxes,
        fees: this.fees,
        rewardsAmount: this.useFromRewardStored,
        balanceAmount: this.useFromBalanceStored,
        storePickup: this.storePickup
      },
      nextCycle: this.nextCycleRenew,
    }).then(() => {
      this.checkoutService.paymentsSubject.next(null);
      this.checkoutService.detailsSubject.next(null);
      // console.info('Checkout change plan success');
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message || error);
    });
  }
  private checkoutMigrationOrder(): void {
    const orderDetails: IMigrationCartItem = {
      equipment: {
        network: 'tmo', networkType: 'GSM', skuIdentifier: this.currentPlan.planDevice.skuIdentifier, skuNumber: this.currentPlan.planDevice.skuNumber
      }
    };
    if (!this.currentPlan.eSIM && !this.storePickup && !this.inPerson) {
      orderDetails.shippingAddress = this.shippingAddress;
      orderDetails.orderShipMethod = this.orderShippingMethod.id
    } else {
      delete orderDetails.shippingAddress;
      delete orderDetails.orderShipMethod;
      orderDetails.haseSIM = true;
    }
    if (this.orderShippingMethod.price > 0) {
      orderDetails.paymentInfo = this.cardInfo
    }
    this.checkoutService.checkoutSIMMigration(this.changeRequestMdn, orderDetails, this.currentPlan.activePlanId).then((result) => {
      this.appState.loading = false;
      this.checkoutService.paymentsSubject.next(null);
      this.checkoutService.detailsSubject.next(null);
      sessionStorage.setItem('isMigrationSimRemoved', 'true');
    }, (error) => {
      this.appState.loading = false;
    });
  }
  private checkoutTopUpPlan(): void {
    this.processingRequest = true;
    // const storedAutoRenew = sessionStorage.getItem('auto_renew');
    // if (!!storedAutoRenew) {
    //   this.autoRenewPlan = storedAutoRenew === 'true' ? true : false;
    // }
    if (!!this.cardInfo && this.cardInfo?.id) {
      this.cardInfo.type = 'creditCardProfile';
    }
    if (!!this.cardInfo && this.cardInfo?.cardNumber) {
      this.cardInfo.type = 'creditCard';
    }
    this.checkoutService.checkoutTopUpPlan({
      currentPlan: this.currentPlan,
      cardInfo: (!!this.cardInfo && (this.cardInfo?.id || this.cardInfo?.cardNumber)) ? this.cardInfo : null,
      options: {
        isVoucherPayment: this.isVoucherPayment,
        saveCcInfo: this.saveCcInfo,
        usingPaymentProfile: !!this.cardInfo && !!this.cardInfo?.id ? true : false,
        autoRenewPlan: this.currentPlan.autoRenewPlan,
        isEnoughVoucher: !this.noMoreFundsRequired,
        taxes: this.taxes,
        fees: this.fees,
        rewardsAmount: this.useFromRewardStored,
        balanceAmount: this.useFromBalanceStored,
        storePickup: this.storePickup
      },
    }).then(() => {
      this.appState.loading = false;
      this.mobilePlansService.clearUserCart();
      this.appState.clearSessionStorage();
      this.checkoutService.paymentsSubject.next(null);
      this.checkoutService.detailsSubject.next(null);
      this.toastHelper.showSuccess('Account balance updated successfully!');
      const params = {};
      params[SHOP_ROUTE_URLS.PARAMS.SUCCESSFUL_PURCHASE] = true;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`, params]);
    }).catch((error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message || error);
    });
  }
  private checkoutAddonPlan(checkoutSimCardItem?: CheckoutSimCard): void {
    this.checkoutService.checkoutAddOnPlan({
      addOnId: '',
      addOns: this.currentPlan.addOns,
      currentPlan: this.currentPlan,
      cardInfo: (!!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber)) ? this.cardInfo : null,
      mdn: this.changeRequestMdn,
      options: {
        autoRenewPlan: this.autoRenewPlan,
        isVoucherPayment: this.isVoucherPayment,
        saveCcInfo: this.saveCcInfo,
        usingPaymentProfile: this.usingPaymentProfile,
        rewardsAmount: this.useFromRewardStored,
        balanceAmount: this.useFromBalanceStored
      },
    }, this.taxes, this.fees, checkoutSimCardItem).then(() => {
      this.isAddonSuccess = true;
      this.mobilePlansService.clearUserCart();
      this.appState.clearSessionStorage();
      this.appState.loading = false;
      this.checkoutService.paymentsSubject.next(null);
      this.checkoutService.detailsSubject.next(null);
    }, (error) => {
      this.toastHelper.showAlert(error.message);
      this.appState.loading = false;
    });
  }
  private orderNewSim(): void {
    if (!!this.cardInfo && this.cardInfo?.id) {
      this.cardInfo.type = 'creditCardProfile';
    }
    if (!!this.cardInfo && this.cardInfo?.cardNumber) {
      this.cardInfo.type = 'creditCard';
    }
    if (!!this.cardInfo && !!this.cardInfo.address1) {
      this.cardInfo.address1 = AccountPaymentService.shortenAddress(this.cardInfo.address1, 30);
    }
    if (!!this.cardInfo && !!this.cardInfo.address2) {
      this.cardInfo.address2 = AccountPaymentService.shortenAddress(this.cardInfo.address2, 30);
    }
    if (!!this.cardInfo && !!this.cardInfo.city) {
      this.cardInfo.city = AccountPaymentService.shortenAddress(this.cardInfo.city, 20);
    }
    this.checkoutService.checkoutNewSIM(
      {
        paymentInfo: (!!this.cardInfo && (!!this.cardInfo?.id || !!this.cardInfo?.cardNumber)) ? this.cardInfo : null,
        usingPaymentProfile: (!!this.cardInfo && !!this.cardInfo?.id ? true : false),
        savePaymentMethod: (!!this.cardInfo && !!this.cardInfo?.id ? false : this.saveCcInfo),
        rewardsAmount: this.useFromRewardStored, balanceAmount: this.useFromBalanceStored,
        shippingAddress: !!this.shippingAddress && this.shippingAddress.address1 && !this.storePickup && !this.inPerson ? this.shippingAddress : null, orderShipMethod: !!this.orderShippingMethod && !!this.shippingAddress && this.shippingAddress.address1 && !this.storePickup && !this.inPerson ? this.orderShippingMethod.id : null, userPlanId: this.activeUserPlanId, simsQuantity: 1, haseSIM: this.currentPlan.eSIM,
        storePickup: this.storePickup
      },
      this.taxes, this.fees, false, this.currentPlan, this.orderShippingMethod.price, this.newSimOrder.price, this.newSimOrder.id)
      .then(() => {
        this.mobilePlansService.clearUserCart();
        this.appState.loading = false;
        this.appState.clearSessionStorage();
        this.checkoutService.paymentsSubject.next(null);
        this.checkoutService.detailsSubject.next(null);
        sessionStorage.setItem('isMigrationSimRemoved', 'true');
      }, (error) => {
        this.appState.loading = false;
        console.error('error ', error);
      });
  }
  private initFlowControl(): void {
    const hasActivationCode = (!!this.currentPlan.planDevice ? !!this.currentPlan.planDevice.activationCode : false) || !!this.currentPlan.activationCode || (!!this.currentPlan.eSIM && !this.currentPlan.phones);
    this.hasShippingItems = (!hasActivationCode && (this.currentPlan.cartType === CART_TYPES.NEW_PLAN || this.currentPlan.cartType === CART_TYPES.GENERIC_CART))
      || (this.currentPlan.simsQuantity > 0 && !this.currentPlan.eSIM);

    if (this.flowSettings.hasShippingMode === this.hasShippingItems) {
      return;
    }
    if (!!JSON.parse(sessionStorage.getItem('isMigrationSimRemoved'))) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      return;
    }
    // Set the view flags:
    this.isVoucherPayment = (!!this.currentPlan.voucherData && this.currentPlan.voucherData.limit > 0);
    // Set the flow:
    this.flowSettings = this.checkoutService.initFlowControlSettings(this.hasShippingItems, this.isLoggedIn);
    if (!this.isLoggedIn) {
      this.currentStep = this.flowSettings.steps.find((step) => step.flowStepId === this.FLOW_STEPS_IDS.STEP_SIGN_IN);
    } else {
      if (!!this.hasShippingItems && this.storedShippingAddress == null && !this.storePickup && !this.inPerson) { // no Activation code then there is a free SIM
        this.currentStep = this.flowSettings.steps.find((step) => step.flowStepId === this.FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS);

        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.SHIPPING_SECTION}`]);
      } else {
        const isValidPayment = sessionStorage.getItem('validPayment');
        if (!!isValidPayment) {
          this.getStoredData();
          this.currentStep = this.flowSettings.steps.find((step) => step.flowStepId === this.FLOW_STEPS_IDS.STEP_CHECKOUT);
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PLACE_ORDER}`]);
        } else {
          this.currentStep = this.flowSettings.steps.find((step) => step.flowStepId === this.FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD
            || step.flowStepId === this.FLOW_STEPS_IDS.STEP_PAYMENT_VOUCHER);
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PAYMENT_SECTION}`]);
        }
      }
    }
  }

  private nextStep(altStep?: boolean): void {
    const flowStep = this.flowSettings.steps.find((step) => step.flowStepId === this.currentStep.flowStepId);
    if (flowStep.state !== FLOW_STATE.STATE_DONE) {
      flowStep.state = FLOW_STATE.STATE_DONE;
      if (altStep && !!this.currentStep.nextAltStepId) {
        const flowStepNext = this.flowSettings.steps.find((step) => step.flowStepId === this.currentStep.nextAltStepId);
        flowStepNext.state = FLOW_STATE.STATE_CURRENT;
        this.currentStep = flowStepNext;
      } else {
        if (!altStep && !!this.currentStep.nextStepId) {
          const flowStepNext = this.flowSettings.steps.find((step) => step.flowStepId === this.currentStep.nextStepId);
          flowStepNext.state = FLOW_STATE.STATE_CURRENT;
          this.currentStep = flowStepNext;
        } else {
        }
      }
    } else {
      this.currentStep = this.flowSettings.steps.find((step) => step.flowStepId === flowStep.nextStepId);
    }
  }

  private planCategory(categoryId): string {
    const categoryPlan = !!this.parentPlans ? this.parentPlans.find((plan) => plan.id === categoryId) : undefined;
    // not the best idea but lets just get things done...
    if (!!categoryPlan) {
      return categoryPlan.title.toLowerCase().replace('plans', 'plan').replace(' ', ' GoodMobile ');
    } else {
      return '';
    }
  }

  private getStoredData(): void {
    this.storedShippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress'));
    this.storePickup = JSON.parse(sessionStorage.getItem('storePickup'));
    this.inPerson = JSON.parse(sessionStorage.getItem('personPickup'));
    if (!!this.storedShippingAddress) {
      this.shippingAddress = Object.assign({}, this.storedShippingAddress) as IFirebaseAddress;
      this.shippingInfoReceived = true;
    }
    const storedShippingMethod = JSON.parse(sessionStorage.getItem('shippingMethod'));
    if (!!storedShippingMethod) {
      this.orderShippingMethod = storedShippingMethod;
    } else if (!storedShippingMethod && !this.storePickup && !this.inPerson) {
      this.shippingConfigurationService.shippingMethods.pipe(takeWhile(() => this.alive)).subscribe((methods) => {
        this.orderShippingMethod = methods[0];
      }, (error) => {
        console.error(error);
      });
    } else {
      this.orderShippingMethod = {} as IShippingMethod;
    }
    this.storedPaymentId = sessionStorage.getItem('payment_id');
    if (!!this.storedPaymentId) {
      this.accountPaymentService.getPaymentMethod(this.storedPaymentId).then((method) => {
        this.cardInfo = Object.assign(this.cardInfo, method) as ICreditCardInfo;
        this.paymentIsSelected = true;
      });
    }
    const isPurchased = sessionStorage.getItem('purchased');
    if (!!isPurchased) {
      this.router.navigate([ROUTE_URLS.HOME]);
      sessionStorage.removeItem('purchased');
    }
  }
  private applyResetEstimatedTaxes(error?): void {
    this.appState.loading = false;
    if (!!error) {
      this.toastHelper.showAlert(error.error.message);
    }
    this.estimatedTaxes = 0;
    this.estimatedFees = 0;
    this.taxes = this.estimatedTaxes;
    this.fees = this.estimatedFees;
    this.estimationZipCode = '';
    this.billingZipCode = '';
    this.calculateTotal();
    // this.checkoutService.updateTaxesAndFees(this.taxes + this.fees);
  }
  private applyTaxes(result): void {
    this.fees = result.fees;
    this.taxes = result.taxes;
    this.isCalculated = true;
    this.estimatedFees = 0;
    this.estimatedTaxes = 0;
    this.billingZipCode = '';
    this.estimationZipCode = '';
    // this.checkoutService.updateTaxesAndFees(result);
    this.calculateTotal();
    this.appState.loading = false;
  }
}
