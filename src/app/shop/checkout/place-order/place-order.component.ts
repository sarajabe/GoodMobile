import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FadeInOutAnimation } from '../../../../app/app.animations';
import { CheckoutService } from '../checkout.service';
import { ICreditCardInfo, CustomizableMobilePlan, CART_TYPES, ActionsAnalyticsService, FirebaseAccountPaymentService, ShippingConfigurationService, MobileCustomPlansService, UserPlansService, UserAccountService, ICatalogItem, IPlanAddOn, IVoucherData, IShippingMethod, IFirebaseAddress } from '@ztarmobile/zwp-service-backend';
import { IFlowIndicator, FLOW_STEPS_IDS, FLOW_STATE } from '../flow-indicator/flow-indicator';
import { Router } from '@angular/router';
import { MetaService } from '../../../../services/meta-service.service';
import { INVISIBLE_CAPTCHA_ID } from '../../../../environments/environment';
import { debounceTime, take, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, CHECKOUT_ROUTE_URLS, PHONES_SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss'],
  animations: [FadeInOutAnimation]
})
export class PlaceOrderComponent implements OnInit, OnDestroy {
  @Input() isLoggedIn: boolean;

  public selectedPhone: ICatalogItem;
  public summary = true;
  public items = true;
  public line = true;
  public delivery = true;
  public content = true;
  public total = 0;
  public newSimOrder: { price: number, id?: string };
  public isGenericType = false;
  public purchasedMdn: string;
  public isApplicablePromo = false;
  public isTopupChecked = false;
  public autoRenew;
  public topupMdn: string;
  public isItemUnavailable: boolean;
  public dataAddons: Array<IPlanAddOn> = [];
  public internationalAddon: IPlanAddOn = null;
  public talkAndTextAddons: Array<IPlanAddOn> = [];
  public storedShippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public orderShippingMethod: IShippingMethod = {} as IShippingMethod;
  public shippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public showShippingCard = false;
  public showBillingAddress = false;
  public showBalanceSection = false;
  public balanceAmount = 0;
  public promoDetails = {
    "2X2GHolidays2022": {img: "assets/icon/2X2GHolidays2022.svg"},
    "2X6GHolidays2022": {img: "assets/icon/2X6GHolidays2022.svg"},
    "2X3GHolidays2022": {img: "assets/icon/2X3GHolidays2022.svg"},
  }
  public CART_TYPES = CART_TYPES;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public cardInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public userCart: CustomizableMobilePlan;
  public flowSettings: IFlowIndicator = {} as IFlowIndicator;
  public remainingAmount: number;
  public recaptchaResponse: any;
  public captchaValid = false;
  public isMigration = false;
  public isReplacement = false;
  public usedBalance = 0;
  public usedReward = 0;
  public details;
  public isStorePickup = false;

  private alive = true;

  constructor(
    private checkoutService: CheckoutService,
    private accountPaymentService: FirebaseAccountPaymentService,
    private router: Router,
    private analyticsService: ActionsAnalyticsService,
    private metaService: MetaService,
    private shippingConfigurationService: ShippingConfigurationService,
    private mobilePlansService: MobileCustomPlansService,
    private appState: AppState,
    private userPlanService: UserPlansService,
    private userAccountService: UserAccountService,
    private modalHelper: ModalHelperService,
    private toastHelper: ToastrHelperService) {

    this.metaService.createCanonicalUrl();
    sessionStorage.removeItem('editPayment');
    this.checkoutService.totalSubject.subscribe((t) => {
      this.total = t;
    });
    this.checkoutService.detailsSubject.subscribe((t) => {
      this.details = t;
    });
  }
  ngOnInit(): void {
    this.analyticsService.trackCheckoutSteps(4, 'Place Your Order');
    this.flowSettings = this.checkoutService.initFlowControlSettings(this.checkoutService.needsShipping, this.isLoggedIn);
    const nextStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT);
    nextStep.nextStepId = FLOW_STEPS_IDS.STEP_CHECKOUT;
    // this.checkoutService.updateCheckoutStep(nextStep);
    const useFromBalanceStored = sessionStorage.getItem('useFromBalance');
    const useFromRewardStored = sessionStorage.getItem('useFromReward');
    this.usedBalance = !!useFromBalanceStored ? parseFloat(useFromBalanceStored) : undefined;
    this.usedReward = !!useFromRewardStored ? parseFloat(useFromRewardStored) : undefined;
    this.balanceAmount = this.usedBalance + this.usedReward;
    const storedPaymentId = sessionStorage.getItem('payment_id');
    this.checkoutService.userCartReplySubject.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.userCart = cart;
      this.isMigration = this.userCart.cartType === CART_TYPES.MIGRATION;
      this.isReplacement = this.userCart.cartType === CART_TYPES.PLAN_ITEMS && !this.userCart.addOns && this.userCart.simsQuantity > 0;
      const storedMethod = JSON.parse(sessionStorage.getItem('shippingMethod'));
     
      this.shippingConfigurationService.shippingMethods.pipe(takeWhile(() => this.alive)).subscribe((methods) => {
        if (!!storedMethod) {
          this.orderShippingMethod = methods.find((m) => m.id === storedMethod.id);
        }
      }, (error) => {
        console.error(error);
      });
      this.storedShippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress'));
      this.isStorePickup = JSON.parse(sessionStorage.getItem('storePickup'));

      if (!!this.storedShippingAddress) {
        this.shippingAddress = Object.assign({}, this.storedShippingAddress) as IFirebaseAddress;

      } else {
        this.checkoutService.shippingAddressSubject.pipe(take(1)).subscribe((address) => {
          this.shippingAddress = address;
        });
      }
      if(!this.isStorePickup) {
        this.checkoutService.storePickupSubject.pipe(take(1)).subscribe((storePickup) => {
          this.isStorePickup = storePickup;
        });
      }
      this.showShippingCard = (!!this.shippingAddress && this.shippingAddress.address1) || !!this.isStorePickup ? true : false;
      if (!!storedPaymentId && storedPaymentId !== '1') {
        this.accountPaymentService.getPaymentMethod(storedPaymentId).then((method) => {
          this.cardInfo = Object.assign(this.cardInfo, method);
          this.showBillingAddress = true;
        });
      }
      this.checkoutService.paymentsSubject.subscribe(method => {
        if (!!method && !!method?.card) {
          if (!!storedPaymentId && storedPaymentId !== '1') {
            this.accountPaymentService.getPaymentMethod(storedPaymentId).then((method) => {
              this.cardInfo = Object.assign(this.cardInfo, method);
              this.showBillingAddress = true;
            });
        } else {
            this.cardInfo = method?.card;
            this.showBillingAddress = true;
          }
        }
        if ((!!method?.balanceAmount && method?.balanceAmount > 0) || (!!method?.rewardsAmount && method?.rewardsAmount > 0)) {
          this.showBalanceSection = true;
          this.usedBalance = method?.balanceAmount;
          this.usedReward = method?.rewardsAmount;
          this.balanceAmount = this.usedBalance + this.usedReward;
        }
      })
    });

    this.shippingConfigurationService.newSimOrder.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.newSimOrder = order;
    });
    this.checkoutService.userCartReplySubject.pipe(takeWhile(() => this.alive), debounceTime(300)).subscribe((cart) => {
      this.prepareOrderData(cart);
    });

    setTimeout(() => {
      sessionStorage.removeItem('validPayment'); // when the user refresh take him back to payment
    }, 2000);
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public goToPlans(changePlan): void {
    if (!!changePlan) {
      this.modalHelper.showConfirmMessageModal(
        `Are you sure you want to change plan?`, 'By clicking yes you agree to leave this page and change your plan',
        'Yes', 'No', 'auto-renew-modal')
        .result.then((result) => {
          if (result) {
            sessionStorage.removeItem('payment_id');
            sessionStorage.removeItem('useFromReward');
            sessionStorage.removeItem('useFromBalance');
            sessionStorage.removeItem('removeFromCart');
            if (this.userCart.cartType === CART_TYPES.CHANGE_PLAN) {
              this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`]);
            } else {
              const params = {};
              params[SHOP_ROUTE_URLS.PARAMS.REPLACE_PLAN] = true;
              this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`, params]);
            }
          }
        }, (error) => {
          console.error('error', error);
          this.toastHelper.showAlert(error.message);
          this.appState.loading = false;
        });
    } else {
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);

    }
  }
  public clearUserCart(event, isItForPhone?: boolean): void {
    if (!this.isGenericType && !!this.selectedPhone && !!isItForPhone) {
      const question = 'Are you sure you want to remove phone?';
      const confirmMessage = 'Phone will be removed from your cart. To complete your plan purchase, let’s find out if your device is compatible with our network.';
      this.modalHelper.showConfirmMessageModal(question, confirmMessage, 'Yes, Check Device', 'Cancel', 'clear-phone-modal')
        .result.then((result) => {
          if (!!result) {
            this.mobilePlansService.removePhonesFromCart();
            sessionStorage.removeItem('shippingMethod');
            this.mobilePlansService.setPlanDevice(null);
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`]);
          }
        });
    }
    else {
      this.deleteCart(event);
    }
  }
  public deleteCart(event): void {
    if (!this.userCart) {
      return;
    }
    let question;
    let confirmMessage;
    question = (this.userCart.cartType === CART_TYPES.NEW_PLAN) || (this.userCart.cartType === CART_TYPES.CHANGE_PLAN) ?
      'Are you sure you want to remove plan?' : 'Are you sure you want to remove item?';
    confirmMessage = (this.userCart.cartType === CART_TYPES.NEW_PLAN) || (this.userCart.cartType === CART_TYPES.CHANGE_PLAN) ?
      'By clicking yes you agree to remove plan from your cart' : 'By clicking yes you agree to remove item from your cart';
    this.modalHelper.showConfirmMessageModal(question, confirmMessage, 'Yes', 'No', 'clean-cart-modal')
      .result.then((result) => {
        if (!!result) {
          switch (this.userCart.cartType) {
            case CART_TYPES.NEW_PLAN:
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              sessionStorage.setItem('removeFromCart', 'true');
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              this.router.navigate([ROUTE_URLS.HOME]);
              break;
            case CART_TYPES.PLAN_ITEMS:
              this.removeItemFromCart('sim');
              break;
            case CART_TYPES.CHANGE_PLAN:
              this.mobilePlansService.clearUserCart();
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              this.appState.clearSessionStorage();
              sessionStorage.setItem('removeFromCart', 'true');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
            case CART_TYPES.TOPUP_PLAN:
              if (!!this.userCart.voucherData) {
                this.mobilePlansService.setVoucherData({} as IVoucherData);
              }
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
            case CART_TYPES.MIGRATION:
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              sessionStorage.setItem('isMigrationSimRemoved', 'true');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
            default:
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
          }
        }
      });
  }
  public goToPhones(): void {
    this.modalHelper.showConfirmMessageModal('Are you sure you want to change phone?', 'By clicking yes you agree to leaving this page and changing your phone', 'Yes', 'Cancel',
      'confirm-change-checkout-modal').result.then((result) => {
        if (result) {
          const params = {};
          params[PHONES_SHOP_ROUTE_URLS.PARAMS.CHANGE_PHONE] = true;
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`, params]);
        }
      });
  }
  public goToAddons(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.CHANGE_ADDON] = true;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`, params]);
  }
  public filterAddons(planAddons): boolean {
    this.dataAddons = planAddons.filter((addon) => addon.type === 'add-on-data');
    this.internationalAddon = planAddons.filter((addon) => addon.id === 'GOODMOBILE-UNLIMITED-INTERNATIONAL');
    this.talkAndTextAddons = planAddons.filter((addon) => addon.type === 'add-on-talkandtext' && addon.id !== 'GOODMOBILE-UNLIMITED-INTERNATIONAL');
    return true;
  }
  public goToShippingSection(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.SHIPPING_SECTION}`]);
  }
  public goToPaymentSection(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PAYMENT_SECTION}`]);
  }
  public planCategory(category): string {
    switch (category) {
      case 'plan': {
        return 'Unlimited Plans'; // new plans parent Id has been change as some of them can be upgraded and that plan Id is saved in the parentId field
      }
      case 'addon': {
        return 'Plan add-on';
      }
      case 'sim': {
        return 'New sim order';
      }
      default:
        return '';
    }
  }
  public enablePaymentEditing(): void {
    const checkOutStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT);
    checkOutStep.state = FLOW_STATE.STATE_PENDING;
    const paymentStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD);
    paymentStep.state = FLOW_STATE.STATE_CURRENT;
    this.checkoutService.editPayment(paymentStep);
    sessionStorage.setItem('editPayment', 'true');
  }

  public placeOrder(): void {
    this.appState.loading = true;
    this.checkoutService.updatePlaceOrder(true);
  }
  private prepareOrderData(cart): void {
    this.userCart = cart;
    this.autoRenew = this.userCart.autoRenewPlan;
    if (!!this.userCart && this.userCart.cartType === CART_TYPES.GENERIC_CART) {
      this.isGenericType = true;
      if (!!this.userCart.activePlanId) {
        this.userPlanService.getUserPlan(this.userCart.activePlanId).then((plan) => {
          if (!!plan) {
            this.purchasedMdn = (new PhonePipe()).transform(plan.mdn);
          }
        });
      }
    }
    if (!!this.userCart && !!this.userCart?.activePlanId && this.userCart?.cartType === CART_TYPES.CHANGE_PLAN) {
      this.userPlanService.getUserPlan(this.userCart.activePlanId).then((plan) => {
        if (!!this.userCart && !!this.userCart.basePlan.isSpecialPromotion) {
          this.userAccountService.checkAvailablePromotion(plan.mdn).then((result) => {
            if (!!result) {
              const applicableIndex = result.findIndex((promo) => promo.code === this.userCart.basePlan.specialPromotion.code);
              this.isApplicablePromo = applicableIndex > -1 ? true : false;
            }
          });
        }
      });
    }
    if (!!this.userCart && this.userCart?.cartType === CART_TYPES.TOPUP_PLAN && !this.isTopupChecked || this.userCart.cartType === CART_TYPES.CHANGE_PLAN || this.userCart.cartType === CART_TYPES.PLAN_ITEMS) {
      const activeUserPlanId = !!this.userCart.activePlanId ? this.userCart.activePlanId : sessionStorage.getItem('plan_id');
      this.userPlanService.getUserPlan(activeUserPlanId).then((plan) => {
        if (!!plan) {
          if (this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
            this.autoRenew = this.userCart.autoRenewPlan;
          }
          this.topupMdn = (new PhonePipe()).transform(plan.mdn);
        }
      });
      this.isTopupChecked = true;
    }
    if (!!this.userCart && !!this.userCart.phones) {
      this.selectedPhone = this.userCart.phones[0];
      if (!!this.selectedPhone && this.selectedPhone.stock > 0) {
        this.isItemUnavailable = false;
      } else {
        this.isItemUnavailable = true;
        let customHtml = ``;
        if (this.userCart.cartType === CART_TYPES.NEW_PLAN) {
          customHtml = `The item ${this.userCart.phones[0].name}, is currently unavailable.
                 Please choose another phone or remove it from cart to proceed.`;
        } else {
          customHtml = `The item ${this.userCart.phones[0].name}, is currently unavailable.
                  Please choose another phone or remove it.`;
        }
        if (!document.body.classList.contains('modal-open')) {
          this.modalHelper.showItemOutOFStockModal('Action Required', customHtml, this.userCart, 'out-of-stock-modal', false);
        }
      }
    }
    // this.appState.loading = false;
  }
  private removeItemFromCart(item: string): void {
    const cartHasMultipleItems = this.userCart.simsQuantity > 0 && !!this.userCart.addOns && this.userCart.addOns.length > 0;
    if (item === 'sim') {
      this.userCart.simsQuantity = 0;
      this.mobilePlansService.setSimPurchaseQuantity(0);
    }
    if (item === 'sim' && !cartHasMultipleItems) { // cart has only sim and want to remove it
      this.mobilePlansService.clearUserCart();
      // eslint-disable-next-line max-len
      this.analyticsService.trackRermoveFromCartGA4([{ id: this.userCart.planDevice.skuIdentifier, quantity: this.userCart.simsQuantity, price: this.newSimOrder.price, type: 'plan-item', title: 'SIM CARD' }]);
      if (!!this.userCart.voucherData) {
        this.mobilePlansService.removeVoucherCode();
      }
      this.appState.clearSessionStorage();
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.MANAGE_DEVICES}`]);
    }
    if (item === 'sim' && !!cartHasMultipleItems) { // cart has sim and addon and want to remove sim.
      // eslint-disable-next-line max-len
      this.analyticsService.trackRermoveFromCartGA4([{ id: this.userCart.planDevice.skuIdentifier, quantity: this.userCart.simsQuantity, price: this.newSimOrder.price, type: 'plan-item', title: 'SIM CARD' }]);
      this.appState.clearSessionStorage();
      this.mobilePlansService.clearUserCart();
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
    }
    if (item === 'plan') {
      this.mobilePlansService.clearUserCart();
      if (!!this.userCart.voucherData) {
        this.mobilePlansService.removeVoucherCode();
      }
      this.appState.clearSessionStorage();
      this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
      this.router.navigate([ROUTE_URLS.HOME]);
    }
    if (item !== 'sim' && item !== 'plan') { // remove from addons
      if (this.userCart.addOns.length === 1 && !!cartHasMultipleItems) { // cart has sim and one addon
        if (!!this.userCart.voucherData) {
          this.mobilePlansService.removeVoucherCode();
        }
      }
      if (this.userCart.addOns.length === 1 && !cartHasMultipleItems) { // if cart has only one addon then clear cart
        this.mobilePlansService.clearUserCart();
        if (!!this.userCart.voucherData) {
          this.mobilePlansService.removeVoucherCode();
        }
        this.appState.clearSessionStorage();
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`]);
      } else {
        let cartAddons = this.userCart.addOns;
        cartAddons = cartAddons.filter((addon) => addon.id !== item);
        this.mobilePlansService.setAddonsList(cartAddons, this.userCart).then(() => {
        });
      }
      this.analyticsService.trackRermoveFromCartGA4(this.userCart.addOns);
    }
  }
}
