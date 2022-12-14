import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ChangePlanService, IPaymentInfo, IUserPlan, MobileCustomPlansService, MobilePlanItem, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { MetaService } from '../../../services/meta-service.service';
import { ACCOUNT_ROUTE_URLS, SHOP_ROUTE_URLS } from '../../app.routes.names';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-change-plan-summary',
  templateUrl: './change-plan-summary.component.html',
  styleUrls: ['./change-plan-summary.component.scss']
})
export class ChangePlanSummaryComponent implements OnInit, OnDestroy {
  public selectedMobilePlan: MobilePlanItem;
  public selectedUserPlan: IUserPlan;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public planCategory: string;
  public nextCycle;
  public isCheckoutFlow = true;
  private alive = true;
  private parentPlans: Array<MobilePlanItem>;

  constructor(
              private userPlansService: UserPlansService,
              private mobilePlansService: MobileCustomPlansService,
              private appState: AppState,
              private route: ActivatedRoute,
              private toastHelper: ToastrHelperService,
              private changePlanService: ChangePlanService,
              private metaService: MetaService,
              private router: Router) {
        }

  ngOnInit(): void {
   
    this.metaService.createCanonicalUrl();
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.selectedMobilePlan = cart;
      this.parentPlans = this.mobilePlansService.parentBasePlans;
      const categoryPlan = !!this.parentPlans ? this.parentPlans.find((plan) => plan.id === cart.basePlan.parentId) : undefined;
      this.planCategory = !!categoryPlan ? categoryPlan.title : undefined;
    });
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((ready) => {
      if (!!ready) {
        this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: ParameterDecorator) => {
          if (!!params) {
            this.nextCycle = params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] === 'true' ? true : false;
            this.isCheckoutFlow = !this.nextCycle;
          }
        });
        this.selectedUserPlan = this.userPlansService.selectedUserPlan;
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public goToAccountSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }

  public userConfirmed(): void {
    if (!!this.isCheckoutFlow) {
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    } else {
      this.applyChangePlanWithoutCheckout();
    }
  }

  private applyChangePlanWithoutCheckout(): void {
    this.appState.loading = true;
    const paymentInfo = {} as IPaymentInfo;
    paymentInfo.id = this.selectedUserPlan.paymentMethodId;
    this.changePlanService.changePlan({
      mdn: this.selectedUserPlan.mdn,
      nextCycle: true,
      newBasePlanId: this.selectedMobilePlan.id,
      paymentInfo,
      addOnRenewable: true
    }, this.selectedUserPlan.id).then(() => {
      this.appState.loading = false;
      this.toastHelper.showSuccess('Your plan change request has been submitted successfully, and will take effect on your next cycle');
      this.userPlansService.selectUserPlan(this.selectedUserPlan.id);
      this.goToAccountSummary();
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message);
    });
  }
}
