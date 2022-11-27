import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  CustomizableMobilePlan, MobileCustomPlansService, MobilePlanItem,
  ShippingConfigurationService, CART_TYPES, IPlanAddOn, UserPlansService,
  IUserPlan, IShippingMethod, ICatalogItem
} from '@ztarmobile/zwp-service-backend';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { PhonePipe } from '../pipes/phone.pipe';
import { CheckoutService } from '../../app/shop/checkout/checkout.service';
import { ModalHelperService } from '../../services/modal-helper.service';
import { takeWhile } from 'rxjs/operators';
import { SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ACCOUNT_ROUTE_URLS, PHONES_SHOP_ROUTE_URLS } from '../../app/app.routes.names';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() plan: CustomizableMobilePlan;
  @Input() user: IUser;
  @Input() autoRenew: boolean;
  @Input() isItemUnavailable: boolean;
  @Input() orderShippingMethod: IShippingMethod;
  @Input() daysEstimation: string;
  @Input() isPromoApplied: boolean;
  @Output() clearCart: EventEmitter<string> = new EventEmitter<string>();
  public CART_TYPES = CART_TYPES;
  public isGenericType = false;
  public parentPlans: Array<MobilePlanItem>;
  public newSimOrder: { price: number, fees: number };
  public internationalAddon: IPlanAddOn = null;
  public dataAddons: Array<IPlanAddOn> = [];
  public talkAndTextAddons: Array<IPlanAddOn> = [];
  public selectedPhone: ICatalogItem;
  public userPlan: IUserPlan;
  public topupMdn: string;
  public purchasedMdn: string;
  public isTopupChecked = false;
  public isVoucher = false;
  public isTrialUpgrade = false;
  public isActivePromo = false;
  private alive = true;
  private allBasePlans: Array<MobilePlanItem>;

  constructor(private router: Router, private mobilePlansService: MobileCustomPlansService, private modalHelper: ModalHelperService, private appState: AppState,
    private shippingConfigurationService: ShippingConfigurationService, private userPlanService: UserPlansService, private checkoutService: CheckoutService) {
    this.mobilePlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe((isReady) => {
      if (isReady) {
        this.allBasePlans = this.mobilePlansService.allBasePlans;
        this.parentPlans = this.mobilePlansService.parentBasePlans;
      }
    });
    this.appState.isMarketingCampaign.pipe(takeWhile(() => this.alive)).subscribe((isCampaign) => {
      this.isActivePromo = isCampaign;
    });
    this.shippingConfigurationService.newSimOrder.pipe(takeWhile(() => this.alive)).subscribe((order) => this.newSimOrder = order);
  }

  ngOnInit(): void {
    this.checkoutService.userCartReplySubject.subscribe((cart) => {
      if (!!cart) {
        if (cart.cartType === CART_TYPES.GENERIC_CART) {
          this.isGenericType = true;
          if (!!cart.activePlanId) {
            this.userPlanService.getUserPlan(cart.activePlanId).then((plan) => {
              if (!!plan) {
                this.userPlan = plan;
                this.purchasedMdn = (new PhonePipe()).transform(this.userPlan.mdn);
              }
            });
          }
        }
        if (!!cart.voucherData) {
          this.isVoucher = true;
        } else {
          this.isVoucher = false;
        }
        this.autoRenew = cart.autoRenewPlan;
        if (cart.cartType === CART_TYPES.TOPUP_PLAN && !this.isTopupChecked || cart.cartType === CART_TYPES.CHANGE_PLAN || cart.cartType === CART_TYPES.PLAN_ITEMS) {
          const activeUserPlanId = !!cart.activePlanId ? cart.activePlanId : sessionStorage.getItem('plan_id');
          this.userPlanService.getUserPlan(activeUserPlanId).then((plan) => {
            if (!!plan) {
              this.userPlan = plan;
              if (cart.cartType !== CART_TYPES.PLAN_ITEMS) {
                this.autoRenew = cart.autoRenewPlan;
              }
              this.topupMdn = (new PhonePipe()).transform(this.userPlan.mdn);
            }
          });
          this.isTopupChecked = true;
        }
        if (!!cart.phones) {
          this.selectedPhone = cart.phones[0];
        }
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.autoRenewPlan && !!changes.autoRenewPlan.currentValue) {
      this.autoRenew = changes.autoRenewPlan.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public planCategory(category): string {
    switch (category) {
      case 'plan': {
        // if (!!this.parentPlans) {
        //   const categoryPlan = this.parentPlans.find((plan) => plan.id === this.plan.basePlan.parentId);
        //   if (!!categoryPlan) {
        //     return categoryPlan.title;
        //   }
        // }
        return 'Unlimited Plans'; // new plans parent Id has been change as some of them can be upgraded and that plan Id is saved in the parentId field
        break;
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

  public goToPlans(): void {
    this.modalHelper.showConfirmMessageModal('Are you sure you want to change plan?', 'By clicking yes you agree to leaving this page and changing your GoodMobile plan', 'Yes', 'Cancel',
      'confirm-change-checkout-modal').result.then((result) => {
        if (result) {
          sessionStorage.removeItem('payment_id');
          sessionStorage.removeItem('useFromReward');
          sessionStorage.removeItem('useFromBalance');
          sessionStorage.removeItem('removeFromCart');
          if (this.plan.cartType === CART_TYPES.CHANGE_PLAN) {
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`]);
          } else {
            const params = {};
            params[SHOP_ROUTE_URLS.PARAMS.REPLACE_PLAN] = true;
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}`, params]);
          }
        } else {
          if (result === false) {
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
  public goToManageDevice(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.MANAGE_DEVICES}`]);
  }
  public filterAddons(planAddons): boolean {
    this.dataAddons = planAddons.filter((addon) => addon.type === 'add-on-data');
    this.internationalAddon = planAddons.filter((addon) => addon.id === 'GOODMOBILE-UNLIMITED-INTERNATIONAL');
    this.talkAndTextAddons = planAddons.filter((addon) => addon.type === 'add-on-talkandtext' && addon.id !== 'GOODMOBILE-UNLIMITED-INTERNATIONAL');
    return true;
  }

  clearUserCart(event, isItForPhone?: boolean): void {
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
      this.clearCart.emit(event);
    }
  }
}

