import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, IMarketingDetails, MobileCustomPlansService, MobilePlanItem, PURCHASE_INTENT } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ModalHelperService } from 'src/services/modal-helper.service';

@Component({
  selector: 'app-plans-list',
  templateUrl: './plans-list.component.html',
  styleUrls: ['./plans-list.component.scss']
})
export class PlansListComponent implements OnDestroy {
  public cart: CustomizableMobilePlan;
  public basePlans: Array<MobilePlanItem>;
  public filteredPlans: Array<MobilePlanItem>;
  public selectedPlan: MobilePlanItem;
  public pageWidth: any;
  public customHtml;
  public selectedIndex = -1;
  public activePlan = false;
  public isValentinePromo = false;
  public utms;
  private alive = true;

  constructor(private mobilePlansService: MobileCustomPlansService,
              private router: Router,
              private modalHelper: ModalHelperService,
              private appState: AppState,
              private analyticsService: ActionsAnalyticsService) {

    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.cart = plan;
    });
    this.mobilePlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe((isReady) => {
      if (isReady) {
        this.basePlans = [];
        this.basePlans = this.mobilePlansService.allBasePlans;
        this.filteredPlans = this.basePlans.filter((plan) => !!plan.parentId && plan.id !== 'GOOD2GO-UNLIMITED-3GB-25-PROMO' && plan.id !== 'GOOD2GO-7-DAY-TRIAL' && (!plan.isSpecialPromotion || !!plan.specialPromotion && !plan.specialPromotion.isSpecific) && !plan.ebb);
        const replacedPlans = this.filteredPlans.filter((val) => this.filteredPlans.includes(this.filteredPlans.find((e) => e.details.data === val.details.data && !val.isSpecialPromotion && !!e.isSpecialPromotion))); // get plans that has equal data with the special promo plans
        this.filteredPlans = this.filteredPlans.filter((plan) => !replacedPlans.includes(plan)); // remove plans that has the same data as the promo plan
        this.filteredPlans.sort((a, b) => a.details.data - b.details.data);
        this.filteredPlans.push(this.filteredPlans.shift()); // make the first element the last one in array
        this.analyticsService.trackProductsImpressions(this.filteredPlans, 'plans-coverage-list');
      }
    });
    this.pageWidth = window.innerWidth;
    this.appState.isMarketingCampaign.pipe(takeWhile(() => this.alive)).subscribe((isCampaign) => {
      this.utms = JSON.parse(sessionStorage.getItem('utms'));
      this.setMarketingObjectToCart();
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public calculatePlanPrice(plan: MobilePlanItem): any {
    if (!!plan) {
      if (!!plan.isSpecialPromotion && ((!!plan?.specialPromotion?.promotionAmount && plan?.specialPromotion?.promotionAmount > 0) || !!plan?.specialPromotion?.promotionDiscount)) {
        if (!!plan?.specialPromotion?.promotionAmount && plan?.specialPromotion?.promotionAmount > 0)
          return '$' + (plan.price - plan.specialPromotion.promotionAmount);
        else if (!!plan?.specialPromotion?.promotionDiscount) {
          const discountAmountValue = plan?.specialPromotion?.promotionDiscount.split('%')[0];
          const discountValue = parseInt(discountAmountValue, 10);
          return plan?.price - (plan?.price * (discountValue / 100));
        }
      } else {
        // prmo price is the suto renew
        return !!plan?.ebb ? 'FREE' : '$' + (plan?.price - plan?.promoPrice);
      }
    }
  }
  public showAutoPayPopUp(): void {
    this.modalHelper.showInformationMessageModal('Auto Pay Credit', '', 'Got it', null,
      true, 'autoPay-help-modal',
      `<div class="description-content">
      <p class="main">Sign up for Good2Go Auto Pay and get a $5 service credit at the end of each monthly billing cycle. Save up to $60 per year!</p>
      </div>
      <div class="margin-bottom-5"><strong>Payment Timing</strong></div>
      <p class="payment-main">• We’ll charge your card two (2) days before your due date. Don’t worry, we’ll send you a reminder before your card is charged.
      </p><p class="payment-sub">• We’ll notify you if we have any problems processing your card.</p>
      <div class="margin-bottom-5"><strong>Your Monthly Charges</strong></div>
      <p class="charges">Auto Pay will automatically charge the full amount due. Your amount due includes your rate plan and any monthly features currently on your account.
      This amount won’t change unless you change your plan, ad-ons or features, or if you have any existing credits, charges, or fees on your account.</p>`);
  }
  public toggleSelectedPlan(index): void {
    if (this.selectedIndex === index) {
      this.activePlan = !this.activePlan;
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = index;
      this.activePlan = true;
      this.selectedPlan = this.filteredPlans[index];
      this.analyticsService.trackProductDetails(this.selectedPlan);
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.pageWidth = window.innerWidth;
  }

  public getSelectedPlan(index): void {
    this.selectedPlan = this.filteredPlans[index];
  }

  public addToCart(index): void {
    if (!!index || index === 0) {
      this.getSelectedPlan(index);
    }
    if (!!this.cart && !!this.cart.cartType && this.cart.cartType !== CART_TYPES.NEW_PLAN) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Adding new plan will remove other items in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
        .result.then((result) => {
          if (result) {
            this.clearCart();
            this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.NEW, [this.selectedPlan]);
            this.mobilePlansService.setBasePlan(this.selectedPlan);
            this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
            if (!!this.isValentinePromo) {
              const promoCodes = [{code: 'VDAY1MTHFREE21', description: 'Second Month Free Service', date: new Date()}];
              this.mobilePlansService.setPromoCodes(promoCodes);
            }
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
          }
        }, (error) => {
          console.error('error', error);
        });
    } else {
      this.mobilePlansService.setBasePlan(this.selectedPlan);
      this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
      this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.NEW, [this.selectedPlan]);
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    }
  }

  private clearCart(): void {
    sessionStorage.removeItem('useFromBalance');
    sessionStorage.removeItem('useFromReward');
    sessionStorage.removeItem('removeFromCart');
    this.mobilePlansService.setSimPurchaseQuantity(0);
    this.mobilePlansService.setAddonsList(null, this.cart);
    this.appState.clearSessionStorage();
  }

  private setMarketingObjectToCart(): void {
    if (!!this.utms) {
      const marketingObject: IMarketingDetails = {
        timestamp: new Date().toISOString(), utm_campaign: this.utms.utm_campaign,
        utm_medium: this.utms.utm_medium, utm_source: this.utms.utm_source, attributes: []
      };
      if (!!this.utms.agentID || !!this.utms.agentid) {
        marketingObject.attributes.push({ name: 'agentID', value: !!this.utms.agentID ? this.utms.agentID : this.utms.agentid });
      }
      marketingObject.attributes.push({ name: 'vendorID', value: !!this.utms && !!this.utms.vendorID ? this.utms.vendorID : 'g2g' });
      this.mobilePlansService.setMarketingObject(marketingObject);
    }
  }
}
