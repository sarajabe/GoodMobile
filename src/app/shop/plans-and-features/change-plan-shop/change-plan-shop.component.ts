import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { FadeInOutAnimation } from '../../../app.animations';
import { IUserAccount, IUser, IUserPlan, CustomizableMobilePlan, UserPlansService, FirebaseUserProfileService, MobileCustomPlansService, UserAccountService, ActionsAnalyticsService, PURCHASE_INTENT, CART_TYPES, MobilePlanItem } from '@ztarmobile/zwp-service-backend';
import { ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../../../app.routes.names';
import { PlansShopService } from '../plans-shop.service';
import { MetaService } from '../../../../services/meta-service.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalHelperService } from '../../../../services/modal-helper.service';
import { takeWhile, combineLatest } from 'rxjs/operators';

@Component({
  selector: 'app-change-plan-shop',
  templateUrl: './change-plan-shop.component.html',
  styleUrls: ['./change-plan-shop.component.scss'],
  animations: [FadeInOutAnimation],
})
export class ChangePlanShopComponent implements OnInit, OnDestroy {
  public selectedPlan: MobilePlanItem;
  public userPlan: IUserPlan;
  public isPlanSelected = false;
  public selectedPlanInfo: CustomizableMobilePlan;
  public isExpiredPlan = false;
  public userAccount: IUserAccount;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public cardExpanded = true;
  public ROUTE_URLS = ROUTE_URLS;
  public plansPrices = [];
  public selectedPrice;
  private alive = true;
  allBasePlans: any;
  filteredPlans: any;
  innerWidth: number;

  constructor(
    public plansShopService: PlansShopService,
    private userPlansService: UserPlansService,
    private router: Router,
    private metaService: MetaService,
    private route: ActivatedRoute,
    private mobilePlansService: MobileCustomPlansService,
    private userAccountService: UserAccountService,
    private modalHelper: ModalHelperService,
    private analyticsService: ActionsAnalyticsService) {

    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
        this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
          if (!!plans) {
            this.userPlan = plans.find((p) => p.id === params[ROUTE_URLS.PARAMS.USER_PLAN_ID]);
            this.selectedPlanInfo = this.userPlansService.getCustomizableMobilePlanFromUserPlan(this.userPlan);
            this.mobilePlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe(() => {
              this.allBasePlans = this.mobilePlansService.allBasePlans;
              this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId && ((!!plan.specialPromotion && !!plan.specialPromotion.isSpecific) || !plan.isSpecialPromotion) && !plan.ebb && plan.id !== this.userPlan.basePlan.id);
              this.filteredPlans.sort((a, b) => a.price - b.price);
              this.selectedPlan = this.filteredPlans[this.filteredPlans.length - 1];
              this.selectedPrice = this.selectedPlan.price;
              this.filteredPlans.map((p) => this.plansPrices.push(p.price))
            });
          }
        });
        this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
          this.userAccount = account;
          if (!!this.userAccount && this.userAccount.plan.bundleId.endsWith('EXP')) {
            this.isExpiredPlan = true;
          }
        });
      }
    });
  }

  public selectPlanPrice(data): void {
    this.selectedPlan = this.filteredPlans.find((p) => (p.price) === data);
    this.selectedPrice = data;
  }
  public selectChangePlan(): void {
    if (!this.isExpiredPlan) {
      const cusomHtml = `<p>If you choose to change plans now, Your plan change will take affect immediately,
      and any remaining service balances on your account may be lost.</p>
      <p >If you choose to change plans on your plan’s expiration date, your plan will change
      on your <span class="primary-font-bold">rate plan expiration date</span>.</p><p> At that time, the cost of this new plan will be deducted from your main account balance.</p>`
      this.modalHelper.showInformationMessageModal('Before we continue', '', 'Make change on Expiry Date', null, true, 'change-plan-modal', cusomHtml, true, 'Change plan now').afterClosed().subscribe((result) => {
        if (result !== null && result !== undefined) {
          this.mobilePlansService.clearUserCart().then(() => {
            sessionStorage.removeItem('shippingAddress');
            sessionStorage.removeItem('shippingMethod');
            sessionStorage.removeItem('payment_id');
            sessionStorage.removeItem('auto_renew');
            sessionStorage.setItem('changeNextCycle', 'true');
            sessionStorage.removeItem('useFromBalance');
            sessionStorage.removeItem('useFromReward');
            sessionStorage.removeItem('removeFromCart');
            this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.CHANGE, [this.selectedPlan]);
            this.mobilePlansService.setCartType(CART_TYPES.CHANGE_PLAN);
            this.mobilePlansService.setActivePlanId(this.userPlansService.selectedUserPlan.id);
            this.mobilePlansService.setBasePlan(this.selectedPlan);
            const params = {};
            params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = result;
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHANGE_SUMMARY}`, params]);
          });
        }

      });
    } else {
      const cusomHtml = `<p class="first">If you choose to change plan now, Your plan change will take affect immediately.</p>
      <p class="second">The cost of this new plan will be deducted from your main account balance.</p>`;
      this.modalHelper.showInformationMessageModal('Before we continue', '', '', null, true, 'change-plan-modal expiry', cusomHtml, true, 'Change plan now').afterClosed().subscribe((result) => {
        if (result !== null) {
          this.mobilePlansService.clearUserCart().then(() => {
            this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.CHANGE, [this.selectedPlan]);
            this.mobilePlansService.setBasePlan(this.selectedPlan);
            this.mobilePlansService.setCartType(CART_TYPES.CHANGE_PLAN);
            sessionStorage.removeItem('useFromBalance');
            sessionStorage.removeItem('useFromReward');
            sessionStorage.removeItem('changeNextCycle'); // this should be false for expired plans
            this.mobilePlansService.setActivePlanId(this.userPlansService.selectedUserPlan.id);
            const params = {};
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHANGE_SUMMARY}`, params]);
          });
        }
      });
    }
  }
  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}
