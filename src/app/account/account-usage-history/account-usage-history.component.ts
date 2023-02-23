import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountUsageService, ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, FirebaseUserProfileService,
  IPlanHistory, IUsageHistory, IUser, IUserAccount, IUserPlan, MobileCustomPlansService, USAGE_SORT_DIRECTION,
  USAGE_SORT_FIELDS, UserAccountService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { PaginationInstance } from 'ngx-pagination';
import { filter, takeWhile } from 'rxjs/operators';
import { FadeInOutAnimation } from 'src/app/app.animations';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService, AccountPageDescription } from '../account-header.service';

@Component({
  selector: 'app-account-usage-history',
  templateUrl: './account-usage-history.component.html',
  animations: [FadeInOutAnimation],
  styleUrls: ['./account-usage-history.component.scss']
})
export class AccountUsageHistoryComponent implements OnInit, OnDestroy, AccountPageDescription {
  public user: IUser;
  public selectedPlan: IUserPlan;
  public selectedPendingChangePlan: IUserPlan;
  public userAccount: IUserAccount;
  public usageHistory: IUsageHistory;
  public userCart: CustomizableMobilePlan;
  public planHistory: IPlanHistory;
  public innerWidth: any;
  public config: PaginationInstance = {
    id: 'usage',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  public configPlans: PaginationInstance = {
    id: 'plans',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  public PLAN_SORT_FIELDS: {
    PLAN_RENEWAL_DATE: string,
    PLAN_START_DATE: string,
    PLAN_STATUS: string,
    RATE_PLAN: string
  };
  public sortPlanBy = 'rate_plan';
  public sortPlanByDate = 'billing_start_date';
  public USAGE_SORT_DIRECTION = USAGE_SORT_DIRECTION;
  public USAGE_SORT_FIELDS = USAGE_SORT_FIELDS;
  public sortBy = USAGE_SORT_FIELDS.DATETIME;
  public sortDirection = USAGE_SORT_DIRECTION.DESC;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public isAccountLoading = false;
  public processingRequest = false;
  public userHasPendingPlans = false;
  public userHasActivePlans = false;
  public showUsage = true;
  public showPlans = false;
  private userHasPlans = false;
  private alive = true;

  constructor(private userAccountService: UserAccountService,
              private userPlansService: UserPlansService,
              private accountHeaderService: AccountHeaderService,
              private usageService: AccountUsageService,
              private toastHelper: ToastrHelperService,
              private mobilePlansService: MobileCustomPlansService,
              private modalHelper: ModalHelperService,
              private appState: AppState,
              private router: Router,
              private metaService: MetaService,
              private analyticService: ActionsAnalyticsService,
              private userProfileService: FirebaseUserProfileService) {

    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      if (userPlanReady && !!this.userPlansService.selectedUserPlan) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
        this.selectedPendingChangePlan = this.userPlansService.selectedPendingUserPlan;
      } else {
        this.userPlansService.selectFirstUserPlan(true);
      }
    });
    this.mobilePlansService.currentPlan.subscribe((cart) => {
      this.userCart = cart;
      if (!!this.userCart && this.userCart.activePlanId && this.selectedPlan.id !== this.userCart.activePlanId) {
        this.userPlansService.selectUserPlan(this.userCart.activePlanId);
      }
    });
    this.accountHeaderService.setPageTitle('Plan & usage history');
  }

  public getDescription(): string {
    if (this.userHasPlans) {
      const storeLocatorUrl = '/' + SUPPORT_ROUTE_URLS.STORE_LOCATOR;
      return `<div class="page-description">You should have received a SIM card through mail by now, or purchased one from
     <a href="${storeLocatorUrl}"> an authorised retail store</a> near you in order to activated your pending plan?</div>`;
    } else {
      return `<div class="page-description plan-selector-space">You can always update your account details and settings here. You can also manage
      devices and activated accounts or add numbers to your existing account.</div>`;
    }
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setPageDescription(this.getDescription());
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.user = user;
    });

    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => this.userAccount = account);
    this.usageService.usageHistory.pipe(takeWhile(() => this.alive)).subscribe((history) => {
      this.toastHelper.updateIsProcessing(false);
      this.usageHistory = history;
      this.config.totalItems = history.totalItems;
    });
    this.usageService.planHistory.pipe(takeWhile(() => this.alive)).subscribe((history) => {
      this.toastHelper.updateIsProcessing(false);
      this.planHistory = history;
      this.configPlans.totalItems = this.planHistory.totalItems;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.planHistory.plans.length; i++) {

        if (this.planHistory.plans[i].ratePlan.includes('EXP')) {
          this.planHistory.plans[i].ratePlan = 'Expire';
        }
        if (this.planHistory.plans[i].ratePlan.startsWith('GOODMOBILE-')) {
          this.planHistory.plans[i].ratePlan = this.planHistory.plans[i].ratePlan.slice(8);
        }
      }
    });
    this.usageService.usageHistoryErrors.pipe(takeWhile(() => this.alive), filter((error) => !!error)).subscribe((error) => {
      this.usageHistory = { usage: [], totalItems: 0 };
      this.toastHelper.updateIsProcessing(false);
      console.warn(`Failed to get usage history: ${error.message}`, error);
    });
    this.userPlansService.selectedUserPlanObservable.subscribe((plan) => {
      this.selectedPlan = plan;
      this.selectedPlan = this.userPlansService.selectedUserPlan;
      this.getUsageHistory();
      this.getPlanHistory();
    });

    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
      this.userHasPlans = plans.length > 0;
      const pendingActivationPlans = plans.filter((plan) => !plan.mdn);
      const activatedPlans = plans.filter((plan) => !!plan.mdn);
      this.userHasPendingPlans = (!!pendingActivationPlans && pendingActivationPlans.length > 0);
      this.userHasActivePlans = (!!activatedPlans && activatedPlans.length > 0);
    });

    this.userAccountService.isSyncingAccount.pipe(takeWhile(() => this.alive)).subscribe((isSyncing) => {
      this.isAccountLoading = isSyncing;
      this.appState.loading = isSyncing;
    });
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan.mdn) {
      if (!this.selectedPlan || (!!userPlan && userPlan.id !== this.selectedPlan.id)) {
        if (!!this.userCart && this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
          this.modalHelper.showConfirmMessageModal('Clear Cart', 'Changing your selected account will clear the items in your cart. Do you want to proceed?',
            'Yes', 'No', 'clean-cart-modal')
            .afterClosed().subscribe((result) => {
              if (result) {
                if (!!this.userCart.voucherData) {
                  this.mobilePlansService.removeVoucherCode();
                }
                this.mobilePlansService.clearUserCart();
                this.appState.clearSessionStorage();
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
                this.userPlansService.selectUserPlan(userPlan.id);
              } else {
                this.userPlansService.selectUserPlan(this.selectedPlan.id);
              }
            }, (error) => {
              console.error('error', error);
            });
        } else {
          this.userPlansService.selectUserPlan(userPlan.id);
        }
      } else {
        if (!userPlan) {
          console.warn('User trying to select undefined user plan, that\'s weird!!');
        }
      }
    } else {
      this.userPlansService.selectFirstUserPlan(true);
    }
  }

  public sortUsageHistory(tSortBy): void {
    if (this.sortBy === tSortBy) {
      this.sortDirection = (this.sortDirection === this.USAGE_SORT_DIRECTION.DESC) ? this.USAGE_SORT_DIRECTION.ASC : this.USAGE_SORT_DIRECTION.DESC;
    } else {
      this.sortDirection = this.USAGE_SORT_DIRECTION.DESC;
    }

    this.sortBy = tSortBy;
    this.getUsageHistory();
  }

  public sortPlanHistory(tSortBy): void {
    if (this.sortPlanBy === tSortBy) {
      this.sortDirection = (this.sortDirection === this.USAGE_SORT_DIRECTION.DESC) ? this.USAGE_SORT_DIRECTION.ASC : this.USAGE_SORT_DIRECTION.DESC;
    } else {
      this.sortDirection = this.USAGE_SORT_DIRECTION.DESC;
    }

    this.sortPlanBy = tSortBy;
    this.getPlanHistory();
  }

  public sortArrow(sortField, category: string): any {
    if (category === 'plans') {
      if (sortField === this.sortPlanBy) {
        return {
          'icon-caret-down': this.sortDirection === this.USAGE_SORT_DIRECTION.DESC,
          'icon-caret-up': this.sortDirection === this.USAGE_SORT_DIRECTION.ASC
        };
      }
    } else {
      if (sortField === this.sortBy) {
        return {
          'icon-caret-down': this.sortDirection === this.USAGE_SORT_DIRECTION.DESC,
          'icon-caret-up': this.sortDirection === this.USAGE_SORT_DIRECTION.ASC
        };
      }
    }
  }

  public addActivatedAccount(): void {
    this.modalHelper.showAddActivatedNumberModal('add-number-modal').afterClosed().subscribe((result) => {
      if (!!result) {
        this.userPlansService.bffAddUserPlanMDN(result).then((userPlanId) => this.userPlansService.selectUserPlan(userPlanId),
          (error) => this.toastHelper.showAlert(error.error.message));
      }
    });
  }

  public addActivatedPhoneNumber(): void {
    this.modalHelper.showAddActivatedNumberModal('add-number-modal').afterClosed().subscribe((result) => {
      if (!!result) {
        this.userPlansService.bffAddUserPlanMDN(result).then((userPlanId) => this.userPlansService.selectUserPlan(userPlanId),
          (error) => this.toastHelper.showAlert(error.error.message));
        this.modalHelper.showInformationMessageModal('Number successfully added!', 'Your activated number has been successfully added to your account.', 'Done',
          null, true, 'successful-activation-modal');
      }
    });
  }

  public pageChanged(page: number, category: string): void {
    if (category === 'usage') {
      if (page > 0 && page <= this.usageHistory.totalItems) {
        const index = page - 1;
        this.config.currentPage = page;
        this.getUsageHistory();
      }
    } else {
      if (page > 0 && page <= this.planHistory.totalItems) {
        const index = page - 1;
        this.configPlans.currentPage = page;
        this.getPlanHistory();
      }
    }
  }
  private getUsageHistory(): void {
    this.toastHelper.updateIsProcessing(true);
    if (!!this.selectedPlan && !this.selectedPlan.portInRequestNumber) {
      this.usageService.refreshUsageHistory(this.selectedPlan.mdn, this.config.itemsPerPage,
        this.config.currentPage, this.sortBy, this.sortDirection);
    } else {
      this.usageHistory = { usage: [], totalItems: 0 };
      this.toastHelper.updateIsProcessing(false);
    }
  }

  private getPlanHistory(): void {
    this.toastHelper.updateIsProcessing(true);
    if (!!this.selectedPlan && !this.selectedPlan.portInRequestNumber) {
      this.usageService.refreshPlanHistory(this.selectedPlan.mdn, this.configPlans.itemsPerPage,
        this.configPlans.currentPage, this.sortPlanByDate, this.sortDirection);
    } else {
      this.planHistory = { plans: [], totalItems: 0 };
      this.toastHelper.updateIsProcessing(false);
    }
  }
}
