import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FadeInOutAnimation } from '../../../app.animations';
import { IUserAccount, IUser, IUserPlan, CustomizableMobilePlan, UserPlansService, FirebaseUserProfileService, MobileCustomPlansService, UserAccountService, ActionsAnalyticsService, PURCHASE_INTENT } from '@ztarmobile/zwp-service-backend';
import { ROUTE_URLS, SHOP_ROUTE_URLS } from '../../../app.routes.names';
import { PlansShopService } from '../plans-shop.service';
import { MetaService } from '../../../../services/meta-service.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalHelperService } from '../../../../services/modal-helper.service';
import { takeWhile, combineLatest } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-change-plan-shop',
  templateUrl: './change-plan-shop.component.html',
  animations: [FadeInOutAnimation],
})
export class ChangePlanShopComponent implements OnInit, OnDestroy {
  @Input() isChangePlan: boolean;
  public selectedPlan: IUserPlan;
  public isPlanSelected = false;
  public selectedPlanInfo: CustomizableMobilePlan;
  public userProfile: IUser;
  public isExpiredPlan = false;
  public userAccount: IUserAccount;
  private alive = true;

  constructor(
    public plansShopService: PlansShopService,
    private userPlansService: UserPlansService,
    private firebaseUserProfileService: FirebaseUserProfileService,
    private metaService: MetaService,
    private route: ActivatedRoute,
    private mobilePlansService: MobileCustomPlansService,
    private location: Location,
    private userAccountService: UserAccountService,
    private modalHelper: ModalHelperService,
    private analyticsService: ActionsAnalyticsService) {

    this.plansShopService.reset();

    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      if (userPlanReady) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
        this.selectedPlanInfo = this.userPlansService.getCustomizableMobilePlanFromUserPlan(this.selectedPlan);
      }
    });
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
      if (!!this.userAccount && this.userAccount.plan.bundleId.endsWith('EXP'))  {
        this.isExpiredPlan = true;
      }
    });
    this.firebaseUserProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((userProfile) => this.userProfile = userProfile);
    this.mobilePlansService.isConfigurationReady.pipe(combineLatest(this.route.params,
      (isReady, params: Params) => {
        if (isReady) {
          if (!!params[ROUTE_URLS.PARAMS.SELECTED_PLAN]) {
            const selectedPlanId = params[ROUTE_URLS.PARAMS.SELECTED_PLAN];
            const nextCycle = params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] === 'true';
            const selectedPlan = this.mobilePlansService.allBasePlans.find((plan) => plan.id === selectedPlanId);
            if (!!selectedPlan) {
              sessionStorage.removeItem('useFromBalance');
              sessionStorage.removeItem('useFromReward');
              this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.CHANGE, [selectedPlan]);
              this.mobilePlansService.setBasePlan(selectedPlan);
              this.isPlanSelected = true;
            } else {
              console.warn(`Mobile Plan with ID [${selectedPlanId}] not found`);
              this.location.back();
            }
          } else {
            this.plansShopService.hidePlanSummaryPage();
          }

        }
      })).subscribe();
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.plansShopService.reset();
  }

  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan && userPlan.id !== this.selectedPlan.id) {
      this.userPlansService.selectUserPlan(userPlan.id);
    } else {
      if (!userPlan) {
        console.warn('User trying to select undefined user plan, that\'s weird!!');
      }
    }
  }
}
