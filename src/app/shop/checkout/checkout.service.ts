import { Injectable, EventEmitter } from '@angular/core';
import { FLOW_STATE, FLOW_STEPS_IDS, IFlowIndicator, IFlowIndicatorStep } from './flow-indicator/flow-indicator';
import {
  AccountPaymentService,
  AccountRefillService,
  ActionsAnalyticsService,
  CustomizableMobilePlan,
  FirebaseUserProfileService,
  IChangePlanCartItem,
  ICreditCardInfo,
  IFirebaseAddress,
  INewPlanCartItem,
  IPaymentInfo,
  IShippingMethod,
  MobileCustomPlansService,
  OrderCheckoutService,
  UserPlansService,
  ChangePlanService,
  IPlanAddOn,
  ICartSimItem,
  CART_TYPES,
  ICartSimCard,
  IVoucherData,
  IAddOnRequest,
  IRefillPlanDetails,
  PURCHASE_INTENT,
  IMigrationCartItem,
  ICheckoutResult
} from '@ztarmobile/zwp-service-backend';
import { Router } from '@angular/router';
import { FirebaseUser, IAuthStateDependentService, IUser, SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { Subscription } from 'rxjs/Subscription';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '../../app.service';
import { ToastrHelperService } from '../../../services/toast-helper.service';
import { SHOP_ROUTE_URLS, ROUTE_URLS, MIGRATION_ROUTE_URLS, OFFERS_ROUTE_URLS, ACTIVATION_ROUTE_URLS } from '../../app.routes.names';
import { filter } from 'rxjs/operators';

export interface CheckoutCartOptions {
  isVoucherPayment: boolean;
  autoRenewPlan: boolean;
  usingPaymentProfile: boolean;
  saveCcInfo: boolean;
  taxes?: number;
  fees?: number;
  isEnoughVoucher?: boolean;
  simId?: string;
  simPrice?: number;
  rewardsAmount?: number;
  balanceAmount?: number;
  haseSIM?: boolean;
  storePickup?: boolean;
}

export interface BaseCheckoutPlan {
  currentPlan: CustomizableMobilePlan;
  cardInfo: ICreditCardInfo;
  options: CheckoutCartOptions;
}

export interface CheckoutNewPlan extends BaseCheckoutPlan {
  shippingAddress: IFirebaseAddress;
  options: CheckoutCartOptions;
  orderShippingMethod?: IShippingMethod;
  hasShippingItems: boolean;
}

export interface CheckoutChangePlan extends BaseCheckoutPlan {
  nextCycle: boolean;
}

export interface CheckoutTopUpPlan extends BaseCheckoutPlan {
  options: CheckoutCartOptions;
}

export interface CheckoutAddonPlan extends BaseCheckoutPlan {
  addOnId: string;
  addOns?: Array<IPlanAddOn>;
  savePaymentMethod?: boolean;
  mdn?: string;
  rewardsAmount?: number;
  balanceAmount?: number;
  storePickup?: boolean;
}

export interface CheckoutSimCardItem extends ICartSimItem {
  userPlanId: string;
}

export interface CheckoutSimCard extends ICartSimCard {
  userPlanId: string;
  haseSIM?:boolean;
  storePickup?:boolean;
}

export interface ICheckoutService {
  checkoutNewPlan(checkoutNewPlan: CheckoutNewPlan): Promise<void>;
  initFlowControlSettings;
}


@Injectable({
  providedIn: 'root'
})
export class CheckoutService implements IAuthStateDependentService, ICheckoutService {
  public user: IUser;
  public userCartObservable: Observable<CustomizableMobilePlan>;
  public userCartReplySubject: ReplaySubject<CustomizableMobilePlan> = new ReplaySubject(1);
  public needsShipping: boolean;
  public updateCheckoutStepEmitter: EventEmitter<IFlowIndicatorStep> = new EventEmitter<IFlowIndicatorStep>();
  public editPaymentEmitter: EventEmitter<IFlowIndicatorStep> = new EventEmitter<IFlowIndicatorStep>();
  public saveCCEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public shippingMethodSubject: ReplaySubject<IShippingMethod> = new ReplaySubject<IShippingMethod>(1);
  public shippingAddressSubject: ReplaySubject<IFirebaseAddress> = new ReplaySubject<IFirebaseAddress>(1);
  public storePickupSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public PaymentInfoSubject: ReplaySubject<ICreditCardInfo> = new ReplaySubject<ICreditCardInfo>(1);
  // eslint-disable-next-line max-len
  public balanceInfoSubject: ReplaySubject<{ rewardsAmount?: number, balanceAmount?: number, calculateTaxes?: boolean }> = new ReplaySubject<{ rewardsAmount?: number, balanceAmount?: number, calculateTaxes?: boolean }>(1);
  public autoRenewSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public voucherDataSubject: ReplaySubject<IVoucherData> = new ReplaySubject<IVoucherData>(1);
  public detailsSubject: ReplaySubject<any> = new ReplaySubject<any>(1);
  public totalSubject: ReplaySubject<number> = new ReplaySubject<number>(1);
  public isInitializedSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public isRemoveSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public paymentsSubject: ReplaySubject<any> = new ReplaySubject<any>(1);
  public placeOrder: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private userId: string;
  private userPlanId: string;

  constructor(private orderCheckoutService: OrderCheckoutService,
    private actionsAnalyticsService: ActionsAnalyticsService,
    private userProfileService: FirebaseUserProfileService,
    private userPlanService: UserPlansService,
    private mobilePlansService: MobileCustomPlansService,
    private accountRefillService: AccountRefillService,
    private router: Router,
    private toastHelper: ToastrHelperService,
    private changePlanService: ChangePlanService,
    private appState: AppState,
    private simpleAuthService: SimpleAuthService) {

    this.userCartObservable = this.userCartReplySubject.asObservable();
    this.simpleAuthService.registerDependentService('checkout-service', this);
    this.userCartReplySubject.subscribe((cart) => {
      if (!!cart) {
        const hasActivationCode = (!!cart.planDevice ? !!cart.planDevice.activationCode : false) || !!cart.activationCode || (!!cart.eSIM && !cart.phones);
        this.needsShipping = (!hasActivationCode && (cart.cartType === CART_TYPES.NEW_PLAN || !cart.cartType))
          || cart.simsQuantity > 0; // no Activation code then there is a free SIM
      }
    });
  }


  buildSubscriptions(fbUser: FirebaseUser): Array<Subscription> {
    this.userId = fbUser.uid;
    const userProfileSubscription: Subscription = this.userProfileService.userProfileObservable.subscribe((user) => this.user = user);
    const userPlanSubscription: Subscription = this.userPlanService.isSelectedPlanReady
      .pipe(filter((ready) => ready)).subscribe(() => this.userPlanId = this.userPlanService.selectedUserPlan.id);
    return [userProfileSubscription, userPlanSubscription];
  }

  onLoggedOut(): void {
    this.user = undefined;
  }
  public updateCheckoutStep(step?: IFlowIndicatorStep): void {
    this.updateCheckoutStepEmitter.emit(step);
  }

  public editPayment(step?: IFlowIndicatorStep): void {
    this.editPaymentEmitter.emit(step);
  }
  public updateShippingAddress(address): void {
    this.shippingAddressSubject.next(address);
  }
  public updateStorePickup(storePickup): void {
    this.storePickupSubject.next(storePickup);
  }
  public updatePaymentMethod(method): void {
    this.PaymentInfoSubject.next(method);
  }
  public setPayments(types): void {
    this.paymentsSubject.next(types);
  }
  public updateCreditBalance(amount): void {
    this.balanceInfoSubject.next(amount);
  }
  public updateShippingMethod(method): void {
    this.shippingMethodSubject.next(method);
  }

  public updateTotalDetails(total): void {
    this.detailsSubject.next(total);
  }
  public setTotal(total): void {
    this.totalSubject.next(total);
  }
  public updateAutoRenew(autoRenew: boolean): void {
    this.autoRenewSubject.next(autoRenew);
  }

  public updateVoucherData(voucher: IVoucherData): void {
    this.voucherDataSubject.next(voucher);
  }

  public updateSaveCC(save: boolean): void {
    this.saveCCEmitter.emit(save);
  }
  public checkoutNewPlan(checkoutNewPlan: CheckoutNewPlan): Promise<void> {
    const options: CheckoutCartOptions = checkoutNewPlan.options;
    return new Promise<void>((resolve, reject) => {
      // this is important to save this value for later when user activate the plan
      const setAutoRenewPromise: Promise<void> = this.mobilePlansService.setAutoRenewPlan(options.autoRenewPlan);
      this.mobilePlansService.setStorePickup(options.storePickup);
      const prepareCartValuesPromise: Promise<INewPlanCartItem> = this.prepareCartItems(checkoutNewPlan);
      const allPromises = Promise.all([setAutoRenewPromise, prepareCartValuesPromise]);
      allPromises.then((items: [void, INewPlanCartItem]) => {
        this.checkoutPlanNew(items[1], checkoutNewPlan).then(() => resolve(), (error) => reject(error));
      }, (error) => reject(error));
    });
  }

  public checkoutChangePlan(checkoutChangePlan: CheckoutChangePlan): Promise<void> {
    const autoRenew = sessionStorage.getItem('auto_renew');
    const currentPlan: CustomizableMobilePlan = checkoutChangePlan.currentPlan;
    const cardInfo: ICreditCardInfo = checkoutChangePlan.cardInfo;
    const options: CheckoutCartOptions = checkoutChangePlan.options;
    const planId = currentPlan.activePlanId;
    if (!!cardInfo && !!cardInfo.address1) {
      cardInfo.address1 = AccountPaymentService.shortenAddress(cardInfo.address1, 30);
    }
    if (!!cardInfo && !!cardInfo.address2) {
      cardInfo.address2 = AccountPaymentService.shortenAddress(cardInfo.address2, 30);
    }
    if (!!cardInfo && !!cardInfo.city) {
      cardInfo.city = AccountPaymentService.shortenAddress(cardInfo.city, 20);
    }
    if (!!cardInfo && !!cardInfo.id) {
      cardInfo.type = 'creditCardProfile';
    }
    if (!!cardInfo && !!cardInfo.cardNumber) {
      cardInfo.type = 'creditCard';
    }
    if (!options.autoRenewPlan) { // if auto renew is undefined then read it from session storage
      const autoRenewFlag = autoRenew === 'true' ? true : false;
      options.autoRenewPlan = autoRenewFlag;
    }
    const cart: IChangePlanCartItem = {
      autoRenewPlan: options.autoRenewPlan,
      basePlanId: checkoutChangePlan.currentPlan.id,
      nextCycleRenew: checkoutChangePlan.nextCycle,
      paymentInfo: cardInfo,
      promoCode: options.autoRenewPlan ? '' + currentPlan.basePlan.promoPrice : null,
      savePaymentMethod: options.saveCcInfo,
      usingPaymentProfile: options.usingPaymentProfile,
      voucherCode: !!currentPlan.voucherData ? currentPlan.voucherData.code : null,
      taxes: options.taxes,
      fees: options.fees,
      rewardsAmount: options.rewardsAmount,
      balanceAmount: options.balanceAmount
    };
    return this.checkoutPlanChange(planId, cart, currentPlan);
  }

  public checkoutTopUpPlan(checkoutTopUpPlan: CheckoutTopUpPlan): Promise<void> {
    const currentPlan: CustomizableMobilePlan = checkoutTopUpPlan.currentPlan;
    if (!!checkoutTopUpPlan.cardInfo && !!checkoutTopUpPlan.cardInfo.id) {
      checkoutTopUpPlan.cardInfo.type = 'creditCardProfile';
    }
    if (!!checkoutTopUpPlan.cardInfo && !!checkoutTopUpPlan.cardInfo.cardNumber) {
      checkoutTopUpPlan.cardInfo.type = 'creditCard';
    }
    const refillDetails: IRefillPlanDetails = {
      autoRenewPlan: checkoutTopUpPlan.options.autoRenewPlan,
      basePlanId: currentPlan.basePlan.id,
      paymentInfo: checkoutTopUpPlan.cardInfo,
      savePaymentMethod: !!checkoutTopUpPlan.options.saveCcInfo && !!checkoutTopUpPlan.cardInfo
        && !!checkoutTopUpPlan.cardInfo.cardNumber ? checkoutTopUpPlan.options.saveCcInfo : false,
      usingPaymentProfile: !!checkoutTopUpPlan.cardInfo && !!checkoutTopUpPlan.cardInfo.id ? true : false,
      voucherCode: !!currentPlan.voucherData ? currentPlan.voucherData.code : null,
      rewardsAmount: checkoutTopUpPlan.options.rewardsAmount,
      balanceAmount: checkoutTopUpPlan.options.balanceAmount,
    };
    if (!!refillDetails.paymentInfo && !!refillDetails.paymentInfo.address1) {
      refillDetails.paymentInfo.address1 = AccountPaymentService.shortenAddress(checkoutTopUpPlan.cardInfo.address1, 30);
    }
    if (!!refillDetails.paymentInfo && !!refillDetails.paymentInfo.address2) {
      refillDetails.paymentInfo.address2 = AccountPaymentService.shortenAddress(checkoutTopUpPlan.cardInfo.address2, 30);
    }
    if (!!refillDetails.paymentInfo && !!refillDetails.paymentInfo.city) {
      refillDetails.paymentInfo.city = AccountPaymentService.shortenAddress(refillDetails.paymentInfo.city, 20);
    }
    if (!!checkoutTopUpPlan.options.isVoucherPayment && !!checkoutTopUpPlan.options.isEnoughVoucher) {
      delete refillDetails.paymentInfo;
    }
    const options: CheckoutCartOptions = checkoutTopUpPlan.options;
    currentPlan.autoRenewPlan = checkoutTopUpPlan.options.autoRenewPlan;
    return this.checkoutPlanTopUp(currentPlan, refillDetails, options);
  }

  public checkoutAddonAndSIM(planId: string, details: any, cart: CustomizableMobilePlan, taxes: number, fees: number, SIMDetails?: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.orderCheckoutService.checkoutPlanItem(planId, details).then((response) => {
        resolve();
        const params = {};
        this.actionsAnalyticsService.trackItemSucceededPurchase(response.orderId, cart, taxes, fees, SIMDetails.shippingCost, SIMDetails.simPrice, SIMDetails.simId);
        params[SHOP_ROUTE_URLS.PARAMS.SUCCESSFUL_PURCHASE] = 'both';
        params[ROUTE_URLS.PARAMS.USER_ORDER_ID] = response.orderId;
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`, params]);
        this.appState.clearSessionStorage();
      }, (error) => reject(error));
    });
  }

  public checkoutAddOnPlan(checkoutAddonPlan: CheckoutAddonPlan, taxes: number, fees: number, checkoutSimCardItem?: CheckoutSimCard): Promise<void> {
    const planId = !!sessionStorage.getItem('plan_id') ? sessionStorage.getItem('plan_id') : this.userPlanId;
    if (!!checkoutAddonPlan.cardInfo && !!checkoutAddonPlan.cardInfo.id) {
      checkoutAddonPlan.cardInfo.type = 'creditCardProfile';
    }
    if (!!checkoutAddonPlan.cardInfo && !!checkoutAddonPlan.cardInfo.cardNumber) {
      checkoutAddonPlan.cardInfo.type = 'creditCard';
    }
    return new Promise<void>((resolve, reject) => {
      const data: IAddOnRequest = {
        mdn: checkoutAddonPlan.mdn,
        addOns: checkoutAddonPlan.addOns,
        nextCycle: false,
        paymentInfo: !!checkoutAddonPlan.cardInfo ? checkoutAddonPlan.cardInfo : null,
        newAddOnId: checkoutAddonPlan.addOnId,
        addOnRenewable: false,
        refillVoucher: checkoutAddonPlan.currentPlan && !!checkoutAddonPlan.currentPlan.voucherData ? checkoutAddonPlan.currentPlan.voucherData.code : null,
        rewardsAmount: checkoutAddonPlan.options.rewardsAmount,
        balanceAmount: checkoutAddonPlan.options.balanceAmount
      };
      if (!!checkoutAddonPlan.options.saveCcInfo && !!checkoutAddonPlan.cardInfo && !!checkoutAddonPlan.cardInfo.cardNumber) {
        data.savePaymentMethod = checkoutAddonPlan.options.saveCcInfo;
      }
      if (!!checkoutAddonPlan.cardInfo && !checkoutAddonPlan.cardInfo.cardNumber && !checkoutAddonPlan.cardInfo.id) {
        checkoutAddonPlan.cardInfo.type = '';
      }
      this.changePlanService.addPlanDataAddOn(data, planId).then((result) => {
        const params = {};
        this.actionsAnalyticsService.trackItemSucceededPurchase(result.orderId, checkoutAddonPlan.currentPlan, taxes, fees, 0);
        if (!!checkoutSimCardItem) {
          this.checkoutNewSIM(checkoutSimCardItem, taxes, fees, true);
        } else {
          params[SHOP_ROUTE_URLS.PARAMS.ADD_ON_PLAN] = true;
          params[ROUTE_URLS.PARAMS.USER_ORDER_ID] = result.orderId;
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`, params]);
        }
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  public checkoutSIMMigration(mdn: string, migrationCart: IMigrationCartItem, planId: string): Promise<ICheckoutResult> {
    return new Promise<ICheckoutResult>((resolve, reject) => {
      this.orderCheckoutService.orderSimMigration(mdn, migrationCart).then((success) => {
        this.userPlanService.getUserPlan(planId).then((p) => {
          const plan = p;
          plan.planDevice.pendingMigrationSim = true;
          this.userPlanService.updateUserPlan(p.userId, plan);
        });
        const params = {};
        params[ROUTE_URLS.PARAMS.USER_ORDER_ID] = success.orderId;
        // this.userPlanService.selectUserPlan(planId);
        this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.SUCCESS_ORDER}`, params]);
        this.mobilePlansService.clearUserCart();
        this.appState.clearSessionStorage();
        resolve(success);
      }, (error) => {
        this.toastHelper.showAlert(error.message);
        reject(error.message);
      });
    });
  }

  public checkoutNewSIM(checkoutSimCardItem: CheckoutSimCard, taxes: number, fees: number, withAddons?: boolean, cart?: CustomizableMobilePlan, shippingCost?: number,
    simPrice?: number, simId?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.orderCheckoutService.orderNewSim(checkoutSimCardItem.userPlanId, checkoutSimCardItem)
        .then((success) => {
          this.actionsAnalyticsService.trackItemSucceededPurchase(success.orderId, cart, taxes, fees, shippingCost, simPrice, simId);
          const params = {};
          params[ROUTE_URLS.PARAMS.USER_ORDER_ID] = success.orderId;
          if (withAddons) {
            params[SHOP_ROUTE_URLS.PARAMS.SUCCESSFUL_PURCHASE] = 'both';
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`, params]);
          } else {
            params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = checkoutSimCardItem.userPlanId;
            params[SHOP_ROUTE_URLS.PARAMS.ORDER_SIM] = true;
            if(!!checkoutSimCardItem?.storePickup) {
              params[SHOP_ROUTE_URLS.PARAMS.STORE_PICKUP] = true;
            }
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`, params]);
          }
          resolve();
        }, (error) => {
          if (withAddons) {
            const params = {};
            params[SHOP_ROUTE_URLS.PARAMS.SUCCESSFUL_PURCHASE] = 'addon';
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`, params]);
          }
          this.toastHelper.showAlert(error.message);
          reject(error.message);
        });
    });
  }
  public initFlowControlSettings(hasShippingItems: boolean, isLoggedIn: boolean): IFlowIndicator {
    const storedShippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress'));
    const storedPaymentId = sessionStorage.getItem('payment_id');
    return {
      steps: [
        {
          // Sign In Step just for flow indicator
          state: (!!isLoggedIn) ? FLOW_STATE.STATE_DONE : FLOW_STATE.STATE_CURRENT,
          flowStepId: FLOW_STEPS_IDS.STEP_SIGN_IN,
          title: 'Info',
          nextStepId: (hasShippingItems) ? FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS : FLOW_STEPS_IDS.STEP_PAYMENT_VOUCHER,
          prevStepId: null,
          isFirst: true,
          isVisible: true
        },
        {
          // Shipping address step optional
          state: (!isLoggedIn) ? FLOW_STATE.STATE_PENDING : ((hasShippingItems && !!isLoggedIn && !storedShippingAddress) ? FLOW_STATE.STATE_CURRENT : FLOW_STATE.STATE_DONE),
          flowStepId: FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS,
          nextStepId: FLOW_STEPS_IDS.STEP_PAYMENT_VOUCHER,
          nextAltStepId: null,
          prevStepId: FLOW_STEPS_IDS.STEP_SIGN_IN,
          pageSubTitle: 'Please fill in the below information',
          pageTitle: 'Almost There!',
          pageDescription: 'we just need you to fill out the below billing information and shipment address so we can get you started.',
          title: 'Shipping',
          isVisible: (hasShippingItems)
        },
        {
          // Payment using voucher step
          state: (!isLoggedIn || (hasShippingItems && !storedShippingAddress)) ? FLOW_STATE.STATE_PENDING : ((!storedPaymentId && !!isLoggedIn) ||
            (!!isLoggedIn && !!storedPaymentId && storedPaymentId === '1')) ? FLOW_STATE.STATE_CURRENT : FLOW_STATE.STATE_DONE,
          flowStepId: FLOW_STEPS_IDS.STEP_PAYMENT_VOUCHER,
          nextStepId: FLOW_STEPS_IDS.STEP_CHECKOUT,
          nextAltStepId: FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD,
          prevStepId: FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS,
          pageTitle: 'Almost There!',
          pageSubTitle: 'Please fill in the below information',
          pageDescription: 'we just need you to fill out the below billing information and shipment address so we can get you started.',
          title: 'Payment',
          isVisible: true
        },
        {
          // Payment using credit card
          state: (hasShippingItems && !storedShippingAddress) ? FLOW_STATE.STATE_PENDING : (!!isLoggedIn && !storedPaymentId ||
            (!!isLoggedIn && !!storedPaymentId && storedPaymentId === '1')) ? FLOW_STATE.STATE_CURRENT : FLOW_STATE.STATE_DONE,
          flowStepId: FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD,
          nextStepId: FLOW_STEPS_IDS.STEP_CHECKOUT,
          nextAltStepId: null,
          prevStepId: FLOW_STEPS_IDS.STEP_SHIPPING_ADDRESS,
          pageTitle: 'Almost There!',
          pageSubTitle: 'Please fill in the below information',
          pageDescription: 'we just need you to fill out the below billing information and shipment address so we can get you started.',
          title: 'Payment & Billing',
          isVisible: false
        },
        {
          // review order step before checkout
          state: (!!isLoggedIn && !!storedPaymentId && storedPaymentId !== '1') ? FLOW_STATE.STATE_CURRENT : FLOW_STATE.STATE_PENDING,
          flowStepId: FLOW_STEPS_IDS.STEP_CHECKOUT,
          nextStepId: null,
          nextAltStepId: null,
          prevStepId: FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD,
          pageTitle: 'Placing your order',
          pageDescription: 'please review your order below so you can finish checking out.',
          title: 'Checkout',
          isLast: true,
          isVisible: true
        }]
      , hasShippingMode: hasShippingItems
    };
  }
  public updatePlaceOrder(placeOrder): void {
    this.placeOrder.next(placeOrder);
  }

  private checkoutPlanNew(cart: INewPlanCartItem, checkoutNewPlan: CheckoutNewPlan): Promise<void> {
    const currentPlan: CustomizableMobilePlan = checkoutNewPlan.currentPlan;
    const orderShippingMethod: IShippingMethod = checkoutNewPlan.orderShippingMethod;
    const shippingAddress: IFirebaseAddress = checkoutNewPlan.shippingAddress;
    const isPhoneOnly = currentPlan.cartType === CART_TYPES.GENERIC_CART ? true : false;
    return new Promise<void>((resolve, reject) => {
      this.orderCheckoutService.checkoutNewPlan(cart).then((response) => {
        currentPlan.autoRenewPlan = cart.autoRenewPlan;
        currentPlan.cartType = PURCHASE_INTENT.NEW;
        const includeFreeSIM = !!currentPlan.activationCode ? false : true;
        this.actionsAnalyticsService.trackSucceededCheckout(response.orderId, currentPlan, !!orderShippingMethod ? orderShippingMethod.price : 0, checkoutNewPlan.options.taxes,
          checkoutNewPlan.options.fees, cart.autoRenewPlan, includeFreeSIM, { id: checkoutNewPlan.options.simId, price: checkoutNewPlan.options.simPrice });
        resolve();
        const params = {};
        if ((checkoutNewPlan.hasShippingItems && !!shippingAddress) || (!!cart?.storePickup)) {
          params[ROUTE_URLS.PARAMS.SELECTED_PLAN] = response.userPlanId;
        } else { // activation flow
          params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = response.userPlanId;
        }
        if (isPhoneOnly) {
          params[ROUTE_URLS.PARAMS.PHONE_PURCHASE] = true;
        }
        if(!!cart?.storePickup) {
          params[SHOP_ROUTE_URLS.PARAMS.STORE_PICKUP] = true;
        }
        if (!!currentPlan.activationCode) {
          params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION]=true;
        }
        params[ROUTE_URLS.PARAMS.USER_ORDER_ID] = response.orderId;
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`, params]);
        this.appState.clearSessionStorage();
      }, (error) => reject(error));
    });
  }

  private checkoutPlanChange(userPlanId: string, cart: IChangePlanCartItem, currentPlan: CustomizableMobilePlan): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.orderCheckoutService.checkoutChangePlan(userPlanId, cart).then((response) => {
        currentPlan.cartType = PURCHASE_INTENT.CHANGE;
        this.actionsAnalyticsService.trackSucceededCheckout(response.orderId, currentPlan, 0, cart.taxes, cart.fees, cart.autoRenewPlan, false);
        this.userPlanService.selectUserPlan(userPlanId);
        resolve();
        const params = {};
        params[ROUTE_URLS.PARAMS.USER_ORDER_ID] = response.orderId;
        params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = cart.nextCycleRenew;
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`, params]);
        this.updateShippingAddress({});
        this.updatePaymentMethod({ id: '', cardNumber: '' });
      }, (error) => reject(error));
    });
  }
  private checkoutPlanTopUp(currentPlan, details: IRefillPlanDetails, options?: CheckoutCartOptions): Promise<void> {
    const planId = !!sessionStorage.getItem('plan_id') ? sessionStorage.getItem('plan_id') : currentPlan.activePlanId;
    //  const cardId = !!sessionStorage.getItem('payment_id') ? sessionStorage.getItem('payment_id') : details.paymentInfo.id ;
    return new Promise<void>((resolve, reject) => {
      this.accountRefillService.refillUserPlan(planId, details).then((refillResults) => {
        this.updateShippingAddress({});
        this.updatePaymentMethod({ id: '', cardNumber: '' });
        currentPlan.cartType = PURCHASE_INTENT.RENEWAL;
        this.actionsAnalyticsService.trackSucceededCheckout(refillResults.orderId, currentPlan, 0, options.taxes,
          options.fees, details.autoRenewPlan, false);
        resolve();
      }, (error) => reject(error));
    });
  }

  private prepareCartItems(checkoutNewPlan: CheckoutNewPlan): Promise<INewPlanCartItem> {
    const currentPlan: CustomizableMobilePlan = checkoutNewPlan.currentPlan;
    const shippingAddress: IFirebaseAddress = checkoutNewPlan.shippingAddress;
    const cardInfo: ICreditCardInfo = checkoutNewPlan.cardInfo;
    const options: CheckoutCartOptions = checkoutNewPlan.options;
    const orderShippingMethod: IShippingMethod = checkoutNewPlan.orderShippingMethod;
    return new Promise<INewPlanCartItem>((resolve, reject) => {
      try {
        if (!!cardInfo && cardInfo?.address1) {
          cardInfo.address1 = AccountPaymentService.shortenAddress(cardInfo.address1, 30);
        }
        if (!!cardInfo && !!cardInfo?.address2) {
          cardInfo.address2 = AccountPaymentService.shortenAddress(cardInfo.address2, 30);
        }
        if (!!cardInfo && !!cardInfo?.city) {
          cardInfo.city = AccountPaymentService.shortenAddress(cardInfo.city, 20);
        }
        if (!!cardInfo && !!cardInfo?.id) {
          cardInfo.type = 'creditCardProfile';
        }
        if (!!cardInfo && !!cardInfo?.cardNumber) {
          cardInfo.type = 'creditCard';
        }
        const requestBody = {
          basePlanId: currentPlan.basePlan.id,
          simsQuantity: currentPlan.simsQuantity,
          paymentInfo: !currentPlan.voucherData ? cardInfo: null,
          shippingAddress: checkoutNewPlan.shippingAddress,
          usingPaymentProfile: options.usingPaymentProfile,
          voucherCode: !!currentPlan.voucherData ? currentPlan.voucherData.code : null,
          orderShipMethod: !!orderShippingMethod ? orderShippingMethod.id : null,
          autoRenewPlan: options.autoRenewPlan,
          promoCode: options.autoRenewPlan ? '' + currentPlan.basePlan.promoPrice : null,
          savePaymentMethod: options.saveCcInfo,
          haseSIM: options.haseSIM,
          storePickup: options.storePickup
        };
        if (!cardInfo?.cardNumber && !cardInfo?.id && !!currentPlan?.voucherData && currentPlan?.voucherData?.code) {
          delete requestBody.paymentInfo; // if user enter enough voucher remove payment info property from request
        }
        resolve(requestBody);
      } catch (error) {
        reject(error);
      }
    });
  }

}
