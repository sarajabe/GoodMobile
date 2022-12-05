import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, MobileCustomPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';

@Component({
  selector: 'app-choose-trial-path',
  templateUrl: './choose-trial-path.component.html',
  styleUrls: ['./choose-trial-path.component.scss']
})
export class ChooseTrialPathComponent implements OnDestroy {
  public userCart: CustomizableMobilePlan;
  public selectedPlanId: string;
  private alive = true;

  constructor(private router: Router,
              private modalHelper: ModalHelperService,
              private mobilePlansService: MobileCustomPlansService,
              private analyticService: ActionsAnalyticsService,
              private appState: AppState,
              private route: ActivatedRoute,
              private metaService: MetaService) {

    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.userCart = cart;
    });
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
        this.selectedPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
      }
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public keepTrial(): void {
    if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.CHANGE_PLAN) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Purchasing a plan will remove any other item in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
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
                removedItems.push({ id: 'SIMGWLTMO4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
              }
              if (!!this.userCart.addOns) {
                removedItems.push(this.userCart.addOns);
              }
            }
            this.analyticService.trackRermoveFromCartGA4(removedItems);
            this.appState.clearSessionStorage();
            this.mobilePlansService.clearUserCart();
            sessionStorage.setItem('plan_id', this.selectedPlanId);
            this.mobilePlansService.setActivePlanId(this.selectedPlanId);
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`]);
          }
        }, (error) => {
          console.error('error', error);
        });
    } else {
      this.mobilePlansService.setActivePlanId(this.selectedPlanId);
      sessionStorage.setItem('plan_id', this.selectedPlanId);
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`]);
    }
  }

  public portNumber(): void {
    if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Purchasing a plan will remove any other item in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
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
                removedItems.push({ id: 'SIMGWLTMO4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
              }
              if (!!this.userCart.addOns) {
                removedItems.push(this.userCart.addOns);
              }
            }
            this.analyticService.trackRermoveFromCartGA4(removedItems);
            this.appState.clearSessionStorage();
            this.mobilePlansService.clearUserCart();
            this.mobilePlansService.setActivePlanId(this.selectedPlanId);
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
          }
        }, (error) => {
          console.error('error', error);
        });
    } else {
      this.appState.clearSessionStorage();
      this.mobilePlansService.setActivePlanId(this.selectedPlanId);
      this.mobilePlansService.setSimCard('11111');
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
    }
  }

  public showInquiry(): void {
    const customHtml = `<div class="info-section">
      <p class="info">Port is a fancy way of saying “transfer your phone number from another provider to GoodMobile”.</p>
      <p class="info">You can transfer an active number from another provider using the second SIM card you received in the SIM kit.</p>
    </div>`;
    this.modalHelper.showInformationMessageModal('', null, 'Got it!', null, true, 'big-button', customHtml);
  }
}
