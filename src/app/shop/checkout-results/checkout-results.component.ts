import { Component, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FadeInOutAnimation } from '../../../app/app.animations';
import {
  IUserPlan, UserPlansService,
  FirebaseUserProfileService,
  UserOrdersService,
} from '@ztarmobile/zwp-service-backend';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { AppState } from '../../app.service';
import { MetaService } from '../../../services/meta-service.service';
import { takeWhile, combineLatest } from 'rxjs/operators';
import { SHOP_ROUTE_URLS, ROUTE_URLS, ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { LookupsService } from '@ztarmobile/zwp-service-backend-v2';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-checkout-results',
  templateUrl: './checkout-results.component.html',
  styleUrls: ['./checkout-results.component.scss'],
  animations: [FadeInOutAnimation]
})
export class CheckoutResultsComponent implements OnDestroy {
  public selectedUserPlan: IUserPlan;
  public userPlanId: string;
  public isSuccessfulMultiplePurchases: string;
  public isChangePlanSummary = false;
  public nextCycle = false;
  public isPlanAddon = false;
  public isOrderSim = false;
  public isStorePickup = false;
  public isActivationFlow = false;
  public isAcpDevice = false;
  public purchasedPlanId: string;
  public purchasedPlan: IUserPlan;
  public user: IUser;
  public stores = [];
  public orderId: string;
  public barCodeVal;

  private alive = true;

  constructor(private route: ActivatedRoute, private router: Router, private userPlansService: UserPlansService, private appState: AppState,
    private metaService: MetaService, private userProfileService: FirebaseUserProfileService,
    private lookupsService: LookupsService, private toastHelper: ToastrHelperService,
    private accountOrderService: UserOrdersService,) {
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);
    this.userPlansService.isSelectedPlanReady.pipe(combineLatest(this.route.params, (ready, params: Params) => {
      const nextCycleParam = params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE];
      this.isChangePlanSummary = nextCycleParam === 'false' || nextCycleParam === 'true';
      this.nextCycle = nextCycleParam === 'true';
      this.userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
      const planAddonParam = params[SHOP_ROUTE_URLS.PARAMS.ADD_ON_PLAN];
      this.isPlanAddon = planAddonParam === 'true' || planAddonParam === 'false';
      this.selectedUserPlan = this.userPlansService.selectedUserPlan;
      this.purchasedPlanId = params[ROUTE_URLS.PARAMS.SELECTED_PLAN];
      const orderSimParam = params[SHOP_ROUTE_URLS.PARAMS.ORDER_SIM];
      const storePickup = params[SHOP_ROUTE_URLS.PARAMS.STORE_PICKUP];
      const acpDevice = params[SHOP_ROUTE_URLS.PARAMS.PHONE_PURCHASE];
      this.isAcpDevice = !!acpDevice ? true : false;
      this.isStorePickup = !!storePickup ? true : false;
      this.isOrderSim = orderSimParam === 'true' || orderSimParam === 'false';
      const successfulPurchases = params[SHOP_ROUTE_URLS.PARAMS.SUCCESSFUL_PURCHASE];
      this.isSuccessfulMultiplePurchases = successfulPurchases;
      this.orderId = params[ROUTE_URLS.PARAMS.USER_ORDER_ID];
      if (!!params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION]) {
        this.isActivationFlow = true;
      }
      if (this.isChangePlanSummary && !this.selectedUserPlan.mdn) {
        this.goToAccountSummary();
      }
      this.getOrderDetails(this.orderId);
      const planID = !!this.userPlanId ? this.userPlanId : this.purchasedPlanId;
      if (!!planID) {
        setTimeout(() => {
          this.appState.loading = true;
          this.userPlansService.getUserPlan(planID).then((plan) => {
            this.purchasedPlan = plan;
            this.appState.loading = false;
          });
        }, 200);
      }
    })).subscribe();
    this.appState.loading = false;
    this.metaService.createCanonicalUrl();
    setTimeout(() => {
      this.appState.clearSessionStorage();
    }, 1000);
    this.lookupsService.getAvailableStores().then(stores => {
      if (stores?.storesLocations?.length > 0) {
        this.stores = stores?.storesLocations;
      }
    }, error => {
      this.toastHelper.showAlert(error.error.errors[0].message);
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public goToOrderDetails(orderId): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDER_DETAILS}`, params]);
  }
  public goToAccountSummary(isSIM?): void {
    if (!!isSIM) {
      this.userPlansService.selectUserPlan(this.userPlansService.selectedUserPlan.id);
    }
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }

  public goToPurchasedPlans(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS}`]);
  }

  public goToActivation(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
  }

  public goToPlans(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

  public goToCompatability(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.purchasedPlanId;
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
  }
  private getOrderDetails(orderId): void {
    this.appState.loading = true;
    this.accountOrderService.getOrderById(orderId).then((order) => {
      if (!!order) {
        this.appState.loading = false;
        this.isStorePickup = order?.storePickup;
        if(!!this.isAcpDevice && !!order?.devices && order?.devices?.length > 0) {
          this.barCodeVal = order?.devices[0]?.itemId;
        }
        else if(!!order?.id && !!order?.cards && order?.cards?.length > 0) {
          this.barCodeVal = `${order?.cards[0]?.itemId}`;
        }
      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
    });
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('purchased', 'true');
  }
}
