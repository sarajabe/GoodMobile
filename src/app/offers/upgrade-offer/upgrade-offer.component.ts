import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionsAnalyticsService, CART_TYPES, ChangePlanService, FirebaseUserProfileService, GenericMobilePlanItem, IBasePlan, IPaymentInfo, IUser, IUserAccount, IUserPlan,
  MobileCustomPlansService, MobilePlanDetails, PlansConfigurationService, PURCHASE_INTENT, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { take } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, OFFERS_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-upgrade-offer',
  templateUrl: './upgrade-offer.component.html',
  styleUrls: ['./upgrade-offer.component.scss']
})
export class UpgradeOfferComponent implements OnInit {
  public innerWidth: any;
  public plansToUpgrade: Array<IUserPlan>;
  public allPlans: Array<IBasePlan>;
  public upgradePlans: Array<IBasePlan>;
  public upgradedPlans: Array<IUserPlan>;
  public user: IUser;
  public processingRequest = false;
  public userAccounts: Array<IUserAccount>;
  public allPlansToUpgradeCount: number;

  constructor(private userPlansService: UserPlansService, private plansConfigurationService: PlansConfigurationService, private userProfileService: FirebaseUserProfileService,
              private modalHelper: ModalHelperService, private mobilePlansService: MobileCustomPlansService, private appState: AppState,
              private userAccountService: UserAccountService,
              private toastHelper: ToastrHelperService, private changePlanService: ChangePlanService, private router: Router, private analyticsService: ActionsAnalyticsService) {

    this.userPlansService.userPlans.pipe(take(1)).subscribe((plans) => {
      if (!!plans) {
        plans = plans.filter((e) => !!e.mdn);
        this.userAccountService.userAccounts.pipe(take(1)).subscribe((accounts) => {
          if (!!accounts) {
            this.userAccounts = accounts;
            let plansToUpgrade = plans.filter((p) => !p.canceled && !p.portInRequestNumber && !!p.basePlan.parentId &&
              !!p.basePlan && !!p.basePlan.specialPromotion &&  (!p.pendingPlan || (!!p.pendingPlan && p.pendingPlan.basePlan.id.indexOf('6MO') < 0)));
            const plansCanBeUpgraded: Array<IUserPlan> = [];
            plansToUpgrade.map((x) => {
              const planAccount = this.userAccounts.find((a) => a.mdn === x.mdn);
              if (!!planAccount && !planAccount.billingRenewalPaid) {
                plansCanBeUpgraded.push(x);
              }
            });
            plansToUpgrade = plansToUpgrade.filter((val) => !!plansCanBeUpgraded.includes(plansCanBeUpgraded.find((e) => e.id === val.id)));
            this.allPlansToUpgradeCount = !!plansToUpgrade ? plansToUpgrade.length : 0;
            this.plansToUpgrade = plansToUpgrade;
            this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((conf) => {
              if (!!conf) {
                this.allPlans = conf.allPlans;
                const plansDetailsFromCatalog = this.plansToUpgrade.map((entry) => this.allPlans.find((e) => e.id === entry.basePlan.id));
                this.upgradePlans = plansDetailsFromCatalog.map((entry) => this.allPlans.find((e) => e.id === entry.parentId));
              }
            });
          }
        });
        this.upgradedPlans = plans.filter((e) => !e.canceled && !e.portInRequestNumber && (e.basePlan.id.indexOf('6MO') > -1 ||
        (!!e.pendingPlan && e.pendingPlan.basePlan.id.indexOf('6MO') > -1)));
      }
    });
    this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((data) => {
      if (!!data) {
        this.user = data;
      }
    });
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  public goToSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }
  public upgradePlan(plan: IUserPlan, upgradeId): void {
    if (!this.processingRequest) {
      const planAccount = this.userAccounts.find((account) => account.mdn === plan.mdn);
      const nextCycleApply = !!planAccount.pastDue ? false : true;
      if (!!planAccount.pastDue) {
        this.prepareCartForCheckout(plan, upgradeId, nextCycleApply);
      } else if (!!plan.autoRenewPlan) {
          this.appState.loading = true;
          this.processingRequest = true;
          const paymentInfo = {} as IPaymentInfo;
          paymentInfo.id = plan.paymentMethodId;
          this.changePlanService.changePlan({
            mdn: plan.mdn,
            nextCycle: nextCycleApply,
            newBasePlanId: upgradeId,
            paymentInfo,
            addOnRenewable: true
          }, plan.id).then(() => {
            this.appState.loading = false;
            this.processingRequest = false;
            this.userPlansService.selectUserPlan(plan.id);
            const params = {};
            params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = plan.id;
            this.router.navigate([`${OFFERS_ROUTE_URLS.BASE}/${OFFERS_ROUTE_URLS.CONFIRM_UPGRADE}`, params]);
          }, (error) => {
            this.processingRequest = false;
            this.appState.loading = false;
            this.toastHelper.showAlert(error.message);
          });
      } else { // checkout flow
        this.prepareCartForCheckout(plan, upgradeId, nextCycleApply);
      }
    }
  }
  private prepareCartForCheckout(plan: IUserPlan, upgradeId, nextCycleApply): void {
    this.processingRequest = true;
    const selectedPlan = this.allPlans.find((basePlan) => basePlan.id === upgradeId);
    const upgradeBasePlan = new GenericMobilePlanItem(selectedPlan.id, selectedPlan.title, selectedPlan.subtitle, selectedPlan.price,
      MobileCustomPlansService.ADD_ONS_TYPES.BASE_PLAN, new MobilePlanDetails(selectedPlan.minutes, selectedPlan.messages, selectedPlan.data, selectedPlan.mms),
      selectedPlan.parentId, selectedPlan.virtual, selectedPlan.buttonText,
      selectedPlan.extTitle, selectedPlan.description, selectedPlan.promoMessage, selectedPlan.promoCode, selectedPlan.promoPrice, selectedPlan.promoMonths);
    this.mobilePlansService.clearUserCart().then(() => {
      sessionStorage.removeItem('shippingAddress');
      sessionStorage.removeItem('shippingMethod');
      sessionStorage.removeItem('payment_id');
      sessionStorage.setItem('auto_renew', !!plan.autoRenewPlan ? 'true' : 'false');
      const sessionNextCycle = !!nextCycleApply ? 'true' : 'false';
      sessionStorage.setItem('changeNextCycle', sessionNextCycle);
      this.mobilePlansService.setCartType(CART_TYPES.CHANGE_PLAN);
      this.mobilePlansService.setActivePlanId(plan.id);
      this.mobilePlansService.setBasePlan(upgradeBasePlan);
      const params = {};
      params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = nextCycleApply;
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`, params]);
      this.processingRequest = false;
    });
  }
// eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}
