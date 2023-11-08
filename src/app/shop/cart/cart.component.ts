import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, FirebaseUserProfileService, GenericMobilePlanItem, IBasePlan, ICatalogItem, IDeviceCompatibilityV1, IPlanAddOn, IUser, IVoucherData, MobileCustomPlansService, MobilePlanDetails, PlansConfigurationService, PURCHASE_INTENT, ShippingConfigurationService, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile, take } from 'rxjs/operators';
import { POSTAL_PATTERN } from 'src/app/app.config';
import { ACCOUNT_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';
import { CheckoutService } from '../checkout/checkout.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  public user: IUser;
  public selectedPhone: ICatalogItem;
  public isItemUnavailable: boolean;
  public isGenericType = false;
  public zipCodePattern = new RegExp(POSTAL_PATTERN);
  public internationalAddon: IPlanAddOn = null;
  public dataAddons: Array<IPlanAddOn> = [];
  public talkAndTextAddons: Array<IPlanAddOn> = [];
  public CART_TYPES = CART_TYPES;
  public newSimOrder: { price: number, fees: number, id?: string };
  public isApplicablePromo = false;
  public isTrialUpgrade = false;
  public purchasedMdn: string;
  public topupMdn: string;
  public isTopupChecked = false;
  public items = true;
  public line = true;
  public total = 0;
  public validZipCode
  public subTotal = 0;
  public autoRenew;
  public taxes;
  public zipCode;
  public estimatedTaxes;
  public estimatedFees;
  public isActivePromo = false;
  public estimatedResult = false;
  public userCart: CustomizableMobilePlan;
  public promoDetails = {
    "2X2GHolidays2022": { img: "assets/icon/2X2GHolidays2022.svg" },
    "2X6GHolidays2022": { img: "assets/icon/2X6GHolidays2022.svg" },
    "2X3GHolidays2022": { img: "assets/icon/2X3GHolidays2022.svg" },
  }
  public deviceImage = 'assets/img/loading.gif';
  private planInCatalogChecked = false;
  private allBasePlans: Array<IBasePlan>;
  private alive = true;
  planInCatalog: IBasePlan;

  constructor(private router: Router, private modalHelper: ModalHelperService, private mobilePlansService: MobileCustomPlansService,
    private appState: AppState, private analyticsService: ActionsAnalyticsService, private shippingConfigurationService: ShippingConfigurationService,
    private userPlanService: UserPlansService, private userAccountService: UserAccountService,
    private userProfileService: FirebaseUserProfileService, private plansConfigurationService: PlansConfigurationService, private toastHelper: ToastrHelperService, private checkoutService: CheckoutService, private mobileCustomPlansService: MobileCustomPlansService) {
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => {
      this.user = user;
      setTimeout(() => {
        if (!!this.user && this.user.referredWithCode && this.user.referredWithCode !== this.user.referralCode
          && !!this.userCart && this.userCart.cartType === CART_TYPES.NEW_PLAN) {
          this.mobilePlansService.setReferralCode(this.user.referredWithCode);
        }
      }, 300);

    });
    this.shippingConfigurationService.newSimOrder.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.newSimOrder = order;
    });
    this.appState.isMarketingCampaign.pipe(takeWhile(() => this.alive)).subscribe((isCampaign) => {
      this.isActivePromo = isCampaign;
    });
  }

  ngOnInit(): void {
    this.appState.loading = true;
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.userCart = plan;
      setTimeout(() => {
        this.autoRenew = this.userCart?.autoRenewPlan;
        if (!!this.userCart && this.userCart.cartType === CART_TYPES.GENERIC_CART) {
          sessionStorage.removeItem('shippingAddress');
          sessionStorage.removeItem('shippingMethod');
          sessionStorage.removeItem('storePickup');
          sessionStorage.removeItem('personPickup');
          sessionStorage.removeItem('payment_id');
          this.isGenericType = true;
          this.deviceImage = this.userCart.acpDevice.imgUrl;
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
        if (!!this.userCart && this.userCart.cartType === CART_TYPES.NEW_PLAN) {
          this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((conf) => {
            this.allBasePlans = conf.allPlans.filter((p) => !p.archived);
            this.planInCatalog = this.allBasePlans.find((p) => p.id === this.userCart.basePlan.id);
            if (!this.planInCatalog && !this.planInCatalogChecked) {
              this.planInCatalogChecked = true;
              this.showExpiredPlansPopup();
            }
          });
        }
      }, 500);
      this.appState.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public goToDevices(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.ACP_DEVICES}`]);
  }

  public goToPlans(changePlan): void {
    if (!!changePlan) {
      this.modalHelper.showConfirmMessageModal(
        `Are you sure you want to change plan?`, 'By clicking yes you agree to leave this page and change your plan',
        'Yes', 'No', 'confirm-change-checkout-modal')
        .afterClosed().subscribe((result) => {
          if (result) {
            sessionStorage.removeItem('payment_id');
            sessionStorage.removeItem('useFromReward');
            sessionStorage.removeItem('useFromBalance');
            sessionStorage.removeItem('removeFromCart');
            if (this.userCart.cartType === CART_TYPES.CHANGE_PLAN) {
              const params = {};
              params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userCart.activePlanId;
              this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`, params]);
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

  public deleteCart(event, allCart?): void {
    if (!this.userCart) {
      return;
    }
    let question;
    let confirmMessage;
    if (this.userCart.cartType === CART_TYPES.NEW_PLAN) {
      allCart = true;
    }
    if (!!allCart) {
      question = `Are you sure you want to empty all the items in your shopping cart?`;
      confirmMessage = `This removes ALL items from your shopping cart. Click "No" to keep items and proceed with checkout.`;
    } else {
      question = (this.userCart.cartType === CART_TYPES.CHANGE_PLAN) ?
        'Are you sure you want to remove plan?' : 'Are you sure you want to remove item?';
      confirmMessage = (this.userCart.cartType === CART_TYPES.NEW_PLAN) || (this.userCart.cartType === CART_TYPES.CHANGE_PLAN) ?
        'By clicking yes you agree to remove plan from your cart' : 'By clicking yes you agree to remove item from your cart';
    }
    this.modalHelper.showConfirmMessageModal(question, confirmMessage, 'Yes', 'No', 'confirm-change-checkout-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          switch (this.userCart.cartType) {
            case CART_TYPES.NEW_PLAN:
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              sessionStorage.setItem('removeFromCart', 'true');
              this.checkoutService.paymentsSubject.next(null);
              this.checkoutService.detailsSubject.next(null);
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              this.router.navigate([ROUTE_URLS.HOME]);
              break;
            case CART_TYPES.PLAN_ITEMS:
              this.removeItemFromCart(event, allCart);
              break;
            case CART_TYPES.CHANGE_PLAN:
              this.mobilePlansService.clearUserCart();
              this.checkoutService.paymentsSubject.next(null);
              this.checkoutService.detailsSubject.next(null);
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              this.appState.clearSessionStorage();
              sessionStorage.setItem('removeFromCart', 'true');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
            case CART_TYPES.TOPUP_PLAN:
              if (!!this.userCart.voucherData) {
                this.mobilePlansService.setVoucherData({} as IVoucherData);
              }
              this.checkoutService.paymentsSubject.next(null);
              this.checkoutService.detailsSubject.next(null);
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
            case CART_TYPES.GENERIC_CART:
              this.checkoutService.paymentsSubject.next(null);
              this.checkoutService.detailsSubject.next(null);
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.ACP_DEVICES}`]);
              break;
            default:
              this.checkoutService.paymentsSubject.next(null);
              this.checkoutService.detailsSubject.next(null);
              this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
              break;
          }
        }
      });
  }

  public clearUserCart(event, isItForPhone?: boolean): void {
    if (!this.isGenericType && !!this.selectedPhone && !!isItForPhone) {
      const question = 'To delete the device, check compatibility is needed!';
      const confirmMessage = 'Device will be removed from your cart. To complete your plan purchase, let’s find out if your device is compatible with our network.';
      this.modalHelper.showConfirmMessageModal(question, confirmMessage, 'Check your Device', 'Keep Device', 'clear-phone-modal')
        .afterClosed().subscribe((result) => {
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

  public checkout(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`]);
  }

  public cancel(): void {
    this.router.navigate([ROUTE_URLS.HOME]);
  }

  public updateAutoRenew(): void {
    if (!this.autoRenew) {
      this.autoRenew = false;
      this.checkoutService.updateAutoRenew(this.autoRenew);
      this.mobilePlansService.setAutoRenewPlan(this.autoRenew);
      this.calculateTotal();
    }
    if (this.autoRenew) {
      this.checkoutService.updateAutoRenew(this.autoRenew);
      this.mobilePlansService.setAutoRenewPlan(this.autoRenew);
      this.calculateTotal();

    }
  }

  public goToAddons(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.CHANGE_ADDON] = true;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`, params]);
  }

  public validateZipCode(): void {
    this.validZipCode = /^\d{5}(-\d{4})?$/.test(this.zipCode);
    return this.validZipCode;
  }

  public estimateTaxes(): void {
    const purchasedDetails: any = {};
    purchasedDetails.basePlanId = this.userCart.id;
    purchasedDetails.paymentInfo = !!this.zipCode ? { postalCode: this.zipCode } : null;
    purchasedDetails.voucherCode = !!this.userCart.voucherData ? this.userCart.voucherData.code : null;
    switch (this.userCart.cartType) {
      case CART_TYPES.NEW_PLAN: {
        purchasedDetails.simsQuantity = this.userCart.simsQuantity;
        purchasedDetails.autoRenewPlan = this.autoRenew;
        break;
      }
      case CART_TYPES.CHANGE_PLAN: {
        purchasedDetails.mdn = this.purchasedMdn;
        purchasedDetails.userPlanId = this.userCart.activePlanId;
        purchasedDetails.autoRenewPlan = this.autoRenew;
        break;
      }
      case CART_TYPES.TOPUP_PLAN: {
        purchasedDetails.mdn = this.purchasedMdn;
        purchasedDetails.userPlanId = this.userCart.activePlanId;
        purchasedDetails.autoRenewPlan = this.autoRenew;
        break;
      }
      case CART_TYPES.PLAN_ITEMS: {
        purchasedDetails.mdn = this.purchasedMdn;
        purchasedDetails.userPlanId = this.userCart.activePlanId;
        delete purchasedDetails.basePlanId;
        delete purchasedDetails.voucherCode;
        if (!!this.userCart.addOns) {
          purchasedDetails.addOns = this.userCart.addOns;
          purchasedDetails.refillVoucher = !!this.userCart.voucherData ? this.userCart.voucherData.code : null;
        }
        if (this.userCart.simsQuantity > 0) {
          purchasedDetails.simsQuantity = 1;
        }
        break;
      }
    }
    if (!!this.zipCode && this.validZipCode) {
      this.appState.loading = true;
      if (this.userCart.cartType === CART_TYPES.CHANGE_PLAN || this.userCart.cartType === CART_TYPES.NEW_PLAN
        || (this.userCart.cartType === CART_TYPES.PLAN_ITEMS && this.userCart.simsQuantity > 0 && !this.userCart.addOns)) {
        this.mobilePlansService.calculateTaxesAndFees(purchasedDetails).then((result) => {
          this.applyEstimatedTaxes(result);
        }, (error) => {
          this.applyResetEstimatedTaxes(error);
        });
      } else if (this.userCart.cartType === CART_TYPES.TOPUP_PLAN) {
        this.mobilePlansService.calculateTopupTaxesAndFees(this.userCart.activePlanId, purchasedDetails).then((result) => {
          this.applyEstimatedTaxes(result);
        }, (error) => {
          this.applyResetEstimatedTaxes(error);
        });
      } else {
        if (!!this.userCart.addOns && this.userCart.simsQuantity < 1) {
          this.mobilePlansService.calculateAddonsTaxes(this.userCart.activePlanId, purchasedDetails).then((result) => {
            this.applyEstimatedTaxes(result);
          }, (error) => {
            this.applyResetEstimatedTaxes(error);
          });
        } else {
          this.mobilePlansService.calculateAddonSIMTaxesAndFees(this.userCart.activePlanId, purchasedDetails).then((result) => {
            this.applyEstimatedTaxes(result);
          }, (error) => {
            this.applyResetEstimatedTaxes(error);
          });
        }
      }
    }
  }

  public filterAddons(planAddons): boolean {
    this.dataAddons = planAddons.filter((addon) => addon.type === 'add-on-data');
    this.internationalAddon = planAddons.filter((addon) => addon.id === 'GOODMOBILE-UNLIMITED-INTERNATIONAL');
    this.talkAndTextAddons = planAddons.filter((addon) => addon.type === 'add-on-talkandtext' && addon.id !== 'GOODMOBILE-UNLIMITED-INTERNATIONAL');
    return true;
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

  public calculateTotal(subTotal?): number {
    let total = 0;
    if (!this.userCart) {
      return 0;
    }
    if (this.userCart?.cartType === CART_TYPES.NEW_PLAN) {
      if (!!this.userCart) {
        const priceAmount = !!this.userCart.basePlan.specialPromotion && !!this.userCart.basePlan.specialPromotion.promotionCycles ?
          this.userCart.basePlan.specialPromotion.promotionCycles * this.userCart.price : this.userCart.price;
        total += priceAmount;
      }
      if (!!this.autoRenew) { // auto renew discount
        const promoAmount = !!this.userCart.basePlan.specialPromotion && !!this.userCart.basePlan.specialPromotion.promotionCycles ?
          this.userCart.basePlan.promoPrice * this.userCart.basePlan.specialPromotion.promotionCycles : this.userCart.basePlan.promoPrice;
        total -= promoAmount;
      }
      // order is important to calculate discount on price and auto pay
      if (!!this.userCart.basePlan.specialPromotion && !!this.userCart.basePlan.specialPromotion.promotionDiscount) {
        const discountAmountValue = this.userCart.basePlan.specialPromotion.promotionDiscount.split('%')[0];
        const discountValue = parseInt(discountAmountValue, 10);
        total -= total * (discountValue / 100);
      }
      // if (!this.userCart.activationCode) {
      //   total = total + this.newSimOrder.price;
      // }
      if (!!this.estimatedResult && !subTotal) {
        total = total + this.estimatedFees + this.estimatedTaxes;
      }
      if (!!this.userCart.phones && this.userCart.phones.length > 0) {
        for (const phone of this.userCart.phones) {
          total += phone.price;
        }
      }
    }
    if (this.userCart.cartType === CART_TYPES.GENERIC_CART) {
      if (!!this.userCart.acpDevice) {
        total += this.userCart.acpDevice.price;
      }
    }
    if (this.userCart.cartType === CART_TYPES.CHANGE_PLAN) {
      if (!!this.userCart) {
        if (!!this.userCart.basePlan.subscriptionCycles) {
          total += this.userCart.basePlan.subscriptionPrice;
        } else {
          total += this.userCart.price;
        }
      }
      if (!!this.autoRenew) {
        total -= this.userCart.basePlan.promoPrice;
      }
      if (!!this.isTrialUpgrade) {
        total = total - 5;
      }
      if (!!this.estimatedResult && !subTotal) {
        total = total + this.estimatedFees + this.estimatedTaxes;
      }
    }
    if (this.userCart.cartType === CART_TYPES.TOPUP_PLAN) {
      if (!!this.userCart) {
        if (!!this.userCart.basePlan.subscriptionCycles) {
          total += this.userCart.basePlan.subscriptionPrice;
        } else {
          total += this.userCart.price;
        }
      }
      if (!!this.autoRenew) {
        total -= this.userCart.basePlan.promoPrice;
      }
      if (!!this.isApplicablePromo) {
        const discountAmountValue = this.userCart.basePlan.specialPromotion.promotionDiscount.split('%')[0];
        const discountValue = parseInt(discountAmountValue, 10);
        total -= total * (discountValue / 100);
      }
      if (!!this.estimatedResult && !subTotal) {
        total = total + this.estimatedFees + this.estimatedTaxes;
      }
    }
    if (!!this.userCart.addOns) {
      for (const addon of this.userCart.addOns) {
        total += addon.price * addon.quantity;
      }
      if (!!this.estimatedResult && !subTotal) {
        total = total + this.estimatedFees + this.estimatedTaxes;
      }
    }
    if (this.userCart.simsQuantity > 0 && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
      if (!!this.newSimOrder && this.userCart.cartType === CART_TYPES.PLAN_ITEMS) { // this condition to disable sim price calculation for migration) {
        total = total + this.newSimOrder.price;
      }
      if (!!this.taxes && !!this.estimatedResult && !this.userCart.addOns && !subTotal) {
        total += this.taxes;
      }
      if (!!this.estimatedFees && !!this.estimatedResult && !this.userCart.addOns && !subTotal) {
        total += this.estimatedFees;
      }
      if (!!this.estimatedResult && !this.userCart.addOns && !subTotal) {
        total = total + this.estimatedFees + this.estimatedFees;
      }
    }
    this.total = total >= 0 ? total : 0;
    return total >= 0 ? total : 0;
  }

  private applyEstimatedTaxes(result): void {
    this.estimatedTaxes = result.taxes;
    this.estimatedFees = result.fees;
    this.estimatedResult = true;
    this.taxes = this.estimatedTaxes === 0 || !!this.estimatedTaxes ? true : false;
    this.appState.loading = false;
  }

  private applyResetEstimatedTaxes(error): void {
    this.appState.loading = false;
    this.toastHelper.showAlert(error.error.message);
    this.estimatedTaxes = 0;
    this.estimatedFees = 0;
    this.taxes = this.estimatedTaxes;
    this.estimatedResult = false;
    this.zipCode = '';
  }

  private removeItemFromCart(item: string, allCart?: boolean): void {
    const cartHasMultipleItems = this.userCart.simsQuantity > 0 && !!this.userCart?.addOns && this.userCart?.addOns?.length > 0;
    if (!allCart) {
      if (item === 'sim') {
        if (!!this.userCart.addOns && this.userCart.addOns.length > 0) {
          this.userCart.simsQuantity = 0;
          this.mobilePlansService.setSimPurchaseQuantity(0);
        } else {
          this.mobilePlansService.clearUserCart();
          this.appState.clearSessionStorage();
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.MANAGE_DEVICES}`]);
        }
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
        if (!!this.userCart.addOns && this.userCart.addOns.length === 1 && !!cartHasMultipleItems) { // cart has sim and one addon
          if (!!this.userCart.voucherData) {
            this.mobilePlansService.removeVoucherCode();
          }
        }
        if (!!this.userCart.addOns && this.userCart.addOns?.length === 1 && !cartHasMultipleItems) { // if cart has only one addon then clear cart
          this.mobilePlansService.clearUserCart();
          if (!!this.userCart.voucherData) {
            this.mobilePlansService.removeVoucherCode();
          }
          this.appState.clearSessionStorage();
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`]);
        } else {
          let cartAddons = this.userCart?.addOns;
          cartAddons = cartAddons.filter((addon) => addon.id !== item);
          this.mobilePlansService.setAddonsList(cartAddons, this.userCart).then(() => {
          });
        }
        this.analyticsService.trackRermoveFromCartGA4(this.userCart.addOns);
      }
    } else {
      this.mobilePlansService.clearUserCart();
      this.mobilePlansService.setSimPurchaseQuantity(0);
      this.checkoutService.paymentsSubject.next(null);
      this.checkoutService.detailsSubject.next(null);
      if (!!this.userCart.voucherData) {
        this.mobilePlansService.removeVoucherCode();
      }
      if (!!this.userCart.basePlan && !!this.userCart.basePlan.parentId) {
        this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
      }
      if (!!this.userCart.addOns && this.userCart.addOns.length > 0) {
        this.analyticsService.trackRermoveFromCartGA4(this.userCart.addOns);
      }
      this.router.navigate([ROUTE_URLS.HOME]);
    }
  }

  private showExpiredPlansPopup(): void {
    const customHtml = `<div class="content"><p>The current plan in your cart is no longer available. </p>
    <p>Click the button below now and check our latest best deals!</p>`;
    this.modalHelper.showInformationMessageModal('Oops!', '', 'See Plans', null, false, 'archived-plan', customHtml).afterClosed().subscribe((response) => {
      if (!!response) {
        this.mobilePlansService.clearUserCart();
        this.appState.clearSessionStorage();
        sessionStorage.setItem('removeFromCart', 'true');
        this.checkoutService.paymentsSubject.next(null);
        this.checkoutService.detailsSubject.next(null);
        this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'esc') {
      if (!!this.planInCatalogChecked) {
        this.showExpiredPlansPopup();
      }
    }
  }
}
