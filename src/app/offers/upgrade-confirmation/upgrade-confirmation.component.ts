/* eslint-disable max-len */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CART_TYPES, ChangePlanService, GenericMobilePlanItem, IBasePlan, IPaymentInfo, IUserAccount, IUserPlan, MobileCustomPlansService, MobilePlanDetails,
  PlansConfigurationService, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { take, takeWhile } from 'rxjs/operators';
import { FadeInOutAnimation } from 'src/app/app.animations';
import { ACCOUNT_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-upgrade-confirmation',
  templateUrl: './upgrade-confirmation.component.html',
  animations: [FadeInOutAnimation],
  styleUrls: ['./upgrade-confirmation.component.scss']
})
export class UpgradeConfirmationComponent implements OnInit, OnDestroy {
  public plansToUpgrade: Array<IUserPlan> = [];
  public upgradedPlans: Array<IUserPlan> = [];
  public nextPlanUpgradeDetails: IBasePlan; // next plan to upgrade
  public upgradedPlan: IUserPlan; // user plan that has been upgraded
  public upgradedPlanDetails: IBasePlan; // has the base plan details of the user plan (to get price and data)
  public newPlanDetails: IBasePlan; // has the base plan details of the triple plan
  public newUpgradeDetails: IBasePlan; // next plan upgrade parent details
  public plansConfigs;
  public allPlansToUpgradeCount = 0; // the number of plans to upgrade including skipped
  public processingRequest = false;
  public userAccount: IUserAccount;
  public isChangeNow = false;
  public newUpgradePrice: number;
  private alive = true;

  constructor(private userPlansService: UserPlansService, private plansConfigurationService: PlansConfigurationService, private modalHelper: ModalHelperService,
              private route: ActivatedRoute, private router: Router, private changePlanService: ChangePlanService, private appState: AppState,
              private toastHelper: ToastrHelperService, private userAccountService: UserAccountService, private mobilePlansService: MobileCustomPlansService) {
    this.appState.loading = true;
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
      if (!!plans) {
        this.route.params.pipe(take(1)).subscribe((params: Params) => {
          if (!!params && params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
            this.upgradedPlan = plans.find((plan) => plan.id === params[ROUTE_URLS.PARAMS.USER_PLAN_ID]);
          }
          if (!!params && params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE]) {
            this.isChangeNow = true;
          }
        });
        plans = plans.filter((e) => !!e.mdn);
        this.userAccountService.userAccounts.pipe(take(1)).subscribe((accounts) => {
          if (!!accounts) {
            const account = accounts.find((planAccount) => planAccount.mdn === this.upgradedPlan.mdn);
            if (!!account && this.upgradedPlan) {
              this.userAccount = account;
            }
            let plansToUpgrade = plans.filter((p) => !p.canceled && !p.portInRequestNumber && !!p.basePlan.parentId && p.basePlan.parentId.indexOf('6MO') > -1 &&
              p.basePlan.id.indexOf('6MO') < 0 && (!p.pendingPlan || (!!p.pendingPlan && p.pendingPlan.basePlan.id.indexOf('6MO') < 0)));
            const plansCanBeUpgraded: Array<IUserPlan> = [];
            plansToUpgrade.map((x) => {
                  const planAccount = accounts.find((a) => a.mdn === x.mdn);
                  if (!!planAccount && !planAccount.billingRenewalPaid) {
                    plansCanBeUpgraded.push(x);
                  }
            });
            plansToUpgrade = plansToUpgrade.filter((val) => !!plansCanBeUpgraded.includes(plansCanBeUpgraded.find((e) => e.id === val.id)));
            this.allPlansToUpgradeCount = !!plansToUpgrade ? plansToUpgrade.length : 0;
            this.plansToUpgrade = plansToUpgrade;
            this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((conf) => {
              if (!!conf) {
                this.plansConfigs = conf;
                if (!!this.upgradedPlan) {
                  this.upgradedPlanDetails = conf.allPlans.find((p) => p.id === this.upgradedPlan.basePlan.id);
                  this.newPlanDetails = conf.allPlans.find((p) => p.id === this.upgradedPlan.basePlan.parentId);
                }
                if (!!this.plansToUpgrade && this.plansToUpgrade.length > 0) {
                  this.nextPlanUpgradeDetails = conf.allPlans.find((e) => e.id === this.plansToUpgrade[0].basePlan.id);
                  this.newUpgradeDetails = conf.allPlans.find((e) => e.id === this.plansToUpgrade[0].basePlan.parentId);
                  // tslint:disable-next-line:max-line-length
                  this.newUpgradePrice = !!this.plansToUpgrade[0].autoRenewPlan ? ((this.newUpgradeDetails.subscriptionPrice - this.newUpgradeDetails.promoPrice) / this.newUpgradeDetails.subscriptionCycles) : (this.newUpgradeDetails.price);
                }
              }
            });
          }
        });
        this.upgradedPlans = plans.filter((e) => !e.canceled && !e.portInRequestNumber && (e.basePlan.id.indexOf('6MO') > -1 ||
        (!!e.pendingPlan && e.pendingPlan.basePlan.id.indexOf('6MO') > -1)));
      }
    });
    setTimeout(() => {
      this.appState.loading = false;
    }, 3000);
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public goToAccountSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }
  public upgradePlan(): void {
    if (!this.processingRequest) {
      if (!!this.userAccount && !!this.userAccount.pastDue) {
        const nextCycleApply = !!this.userAccount.pastDue ? false : true;
        this.prepareCartForCheckout(this.plansToUpgrade[0], this.newUpgradeDetails.id, nextCycleApply);
      }
      if (!!this.plansToUpgrade[0].autoRenewPlan) {
        this.appState.loading = true;
        this.processingRequest = true;
        const paymentInfo = {} as IPaymentInfo;
        paymentInfo.id = this.plansToUpgrade[0].paymentMethodId;
        this.changePlanService.changePlan({
          mdn: this.plansToUpgrade[0].mdn,
          nextCycle: true,
          newBasePlanId: this.newUpgradeDetails.id,
          paymentInfo,
          addOnRenewable: true
        }, this.plansToUpgrade[0].id).then(() => {
          this.appState.loading = false;
          this.processingRequest = false;
          this.userPlansService.selectUserPlan(this.plansToUpgrade[0].id);
          this.upgradedPlan = this.plansToUpgrade[0];
        }, (error) => {
          this.processingRequest = false;
          this.appState.loading = false;
          this.toastHelper.showAlert(error.message);
        });
      } else {
        const selectedPlan = this.plansConfigs.allPlans.find((basePlan) => basePlan.id === this.newUpgradeDetails.id);
        const upgradeBasePlan = new GenericMobilePlanItem(selectedPlan.id, selectedPlan.title, selectedPlan.subtitle, selectedPlan.price,
        MobileCustomPlansService.ADD_ONS_TYPES.BASE_PLAN, new MobilePlanDetails(selectedPlan.minutes, selectedPlan.messages, selectedPlan.data, selectedPlan.mms),
        selectedPlan.parentId, selectedPlan.virtual, selectedPlan.buttonText,
        selectedPlan.extTitle, selectedPlan.description, selectedPlan.promoMessage, selectedPlan.promoCode, selectedPlan.promoPrice, selectedPlan.promoMonths);
        this.mobilePlansService.clearUserCart().then(() => {
          sessionStorage.removeItem('shippingAddress');
          sessionStorage.removeItem('storePickup');
          sessionStorage.removeItem('personPickup');
          sessionStorage.removeItem('shippingMethod');
          sessionStorage.removeItem('payment_id');
          sessionStorage.removeItem('useFromBalance');
          sessionStorage.removeItem('useFromReward');
          sessionStorage.setItem('auto_renew', !!this.plansToUpgrade[0].autoRenewPlan ? 'true' : 'false');
          sessionStorage.setItem('changeNextCycle', 'true');
          this.mobilePlansService.setCartType(CART_TYPES.CHANGE_PLAN);
          this.mobilePlansService.setActivePlanId(this.plansToUpgrade[0].id);
          this.mobilePlansService.setBasePlan(upgradeBasePlan);
          const params = {};
          params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = true;
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`, params]);
        });
      }
    }
  }

  private prepareCartForCheckout(plan: IUserPlan, upgradeId, nextCycleApply): void {
    const selectedPlan = this.plansConfigs.allPlans.find((basePlan) => basePlan.id === upgradeId);
    const upgradeBasePlan = new GenericMobilePlanItem(selectedPlan.id, selectedPlan.title, selectedPlan.subtitle, selectedPlan.price,
      MobileCustomPlansService.ADD_ONS_TYPES.BASE_PLAN, new MobilePlanDetails(selectedPlan.minutes, selectedPlan.messages, selectedPlan.data, selectedPlan.mms),
      selectedPlan.parentId, selectedPlan.virtual, selectedPlan.buttonText,
      selectedPlan.extTitle, selectedPlan.description, selectedPlan.promoMessage, selectedPlan.promoCode, selectedPlan.promoPrice, selectedPlan.promoMonths);
    this.mobilePlansService.clearUserCart().then(() => {
      sessionStorage.removeItem('shippingAddress');
      sessionStorage.removeItem('storePickup');
      sessionStorage.removeItem('personPickup');
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
    });
  }
}
