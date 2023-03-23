import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomizableMobilePlan, MobileCustomPlansService, MobilePlanItem, CART_TYPES } from '@ztarmobile/zwp-service-backend';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { MetaService } from '../../../services/meta-service.service';
import { AppState } from '../../../app/app.service';
import { ROUTE_URLS, SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { combineLatest, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss']
})
export class PlanDetailsComponent implements OnInit, OnDestroy {
  public updatePlan: boolean;
  public currentPlan: CustomizableMobilePlan = new CustomizableMobilePlan();
  public quantity = 1;
  public quantityRange: number[] = [1, 2, 3, 4, 5];
  public selectedPlan: MobilePlanItem;
  private alive = true;
  private parentPlans: Array<MobilePlanItem>;

  constructor(private route: ActivatedRoute, private router: Router, private modalHelper: ModalHelperService, private metaService: MetaService,
              private mobilePlansService: MobileCustomPlansService, private location: Location, private appState: AppState) {
    this.appState.loading = true;
    this.mobilePlansService.isConfigurationReady.pipe(combineLatest(this.route.params, (isReady, params: Params) => {
      this.parentPlans = this.mobilePlansService.parentBasePlans;

      if (isReady && params && params[ROUTE_URLS.PARAMS.SELECTED_PLAN]) {
        const selectedPlanId = params[ROUTE_URLS.PARAMS.SELECTED_PLAN];
        this.selectedPlan = this.mobilePlansService.allBasePlans.find((plan) => plan.id === selectedPlanId);
        if (!this.selectedPlan) {
          console.warn(`Mobile Plan with ID [${selectedPlanId}] not found`);
          this.location.back();
        }
      }
    })).subscribe();
    this.metaService.createCanonicalUrl();
  }

  ngOnInit(): void {
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.currentPlan = plan;
      this.appState.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public goToCart() {
    if (!!this.currentPlan && !!this.currentPlan.cartType && this.currentPlan.cartType !== CART_TYPES.NEW_PLAN) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Adding new plan will remove other items in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
      .afterClosed().subscribe((result) => {
        if (result) {
          this.mobilePlansService.startNewMobilePlan();
          this.mobilePlansService.setBasePlan(this.selectedPlan);
          this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
          this.mobilePlansService.setAutoRenewPlan(true);
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
        }}, (error) => {
          console.error('error' , error);
        });
      } else {
        this.mobilePlansService.setBasePlan(this.selectedPlan);
        this.mobilePlansService.setAutoRenewPlan(true);
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    }
  }

  public goToCompatiblilty(): void {
    if (!!this.currentPlan && !!this.currentPlan.cartType && this.currentPlan.cartType !== CART_TYPES.NEW_PLAN) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Adding new plan will remove other items in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
      .afterClosed().subscribe((result) => {
        if (result) {
          this.clearCart();
          this.mobilePlansService.setBasePlan(this.selectedPlan);
          this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
          this.mobilePlansService.setAutoRenewPlan(true);
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`]);
        }}, (error) => {
          console.error('error' , error);
        });
      } else {
        this.mobilePlansService.setBasePlan(this.selectedPlan);
        this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
        this.mobilePlansService.setAutoRenewPlan(true);
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`]);
    }
  }

  public goToPlans(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

  public needPhonePopUp(): void {
    this.modalHelper.showRoutingModal('Do you need a phone to go with this plan?', '', true ,
     'I already have a phone', 'I need to buy a phone', 'Skip for now', SHOP_ROUTE_URLS.CHECK_PHONE,
     SHOP_ROUTE_URLS.PHONES.TYPE, SHOP_ROUTE_URLS.CART, 'need-phone-popUp').afterClosed().subscribe((result) => {
      if (!!result) {
        if (result === 'check-phone') {
          this.goToCompatiblilty();
        } else if (result === 'shop-phone') {
         //
        } else {
          this.goToCart();
        }
      }}, (error) => {
        console.error('error' , error);
      });
  }

  public planCategory(categoryId): any {
    const categoryPlan = !!this.parentPlans ? this.parentPlans.find((plan) => plan.id === categoryId) : undefined;
    return !!categoryPlan ? categoryPlan.title : undefined;
  }

  private clearCart(): void {
    this.mobilePlansService.setSimPurchaseQuantity(0);
    this.mobilePlansService.setAddonsList(null, this.currentPlan);
  }
}
