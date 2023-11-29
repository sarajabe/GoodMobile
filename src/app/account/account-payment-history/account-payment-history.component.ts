import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountPaymentService, ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan,
  FirebaseUserProfileService, IPaymentHistory, IPaymentMethod, IUser, IUserAccount, IUserPlan,
  MobileCustomPlansService, PAYMENT_SORT_DIRECTION, PAYMENT_SORT_FIELDS, UserAccountService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { PaginationInstance } from 'ngx-pagination';
import { filter, takeWhile } from 'rxjs/operators';
import { FadeInOutAnimation } from 'src/app/app.animations';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService, AccountPageDescription } from '../account-header.service';

@Component({
  selector: 'app-account-payment-history',
  templateUrl: './account-payment-history.component.html',
  styleUrls: ['./account-payment-history.component.scss'],
  animations: [FadeInOutAnimation]
})
export class AccountPaymentHistoryComponent implements OnInit, OnDestroy, AccountPageDescription {
  public user: IUser;
  public selectedPlan: IUserPlan;
  public userAccount: IUserAccount;
  public userCart: CustomizableMobilePlan;
  public paymentHistory: IPaymentHistory;
  public paymentInfo: IPaymentMethod;
  public PAYMENT_SORT_DIRECTION = PAYMENT_SORT_DIRECTION;
  public PAYMENT_SORT_FIELDS = PAYMENT_SORT_FIELDS;
  public sortBy = PAYMENT_SORT_FIELDS.PAYMENT_DATE;
  public sortDirection = PAYMENT_SORT_DIRECTION.DESC;
  public config: PaginationInstance = {
    id: 'payment',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public userHasActivePlans = false;
  public userHasPendingPlans = false;
  private alive = true;
  isSyncing: boolean;
  private isApiCalled = false;
  constructor(private userAccountService: UserAccountService,
    private metaService: MetaService,
    public router: Router,
    private appState: AppState,
    private paymentService: AccountPaymentService,
    private userPlansService: UserPlansService,
    private accountHeaderService: AccountHeaderService,
    private toastHelper: ToastrHelperService,
    private userProfileService: FirebaseUserProfileService,
    private mobilePlansService: MobileCustomPlansService,
    private modalHelper: ModalHelperService,
    private analyticsService: ActionsAnalyticsService) {
  }

  public getDescription(): string {
    return `<div class="page-description plan-selector-space">You can always update your account details and settings here. You can also manage
      devices and activated accounts or add numbers to your existing account.</div>`;
  }

  ngOnInit(): void {

    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => this.userAccount = account);
    this.userAccountService.isSyncingAccount.pipe(takeWhile(() => this.alive)).subscribe((isSyncing) => {
      this.toastHelper.updateIsProcessing(isSyncing);
      this.appState.loading = isSyncing;
      this.isSyncing = isSyncing;
    });
    this.accountHeaderService.setPageTitle('Payment History');
    this.userPlansService.selectedUserPlanObservable.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.selectedPlan = plan;
      this.paymentInfo = this.userPlansService.selectedPlanPaymentMethod;
      this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
        const pendingActivationPlans = plans.filter((plan) => !plan.mdn);
        const activatedPlans = plans.filter((plan) => !!plan.mdn);
        this.userHasActivePlans = (!!activatedPlans && activatedPlans.length > 0);
        this.userHasPendingPlans = (!!pendingActivationPlans && pendingActivationPlans.length > 0);
        if (!!this.selectedPlan) {
          this.selectedPlan = this.userPlansService.selectedUserPlan;
          this.selectedPlan = plans.find((plan) => plan?.id === this.selectedPlan?.id);
        }
        if (!!activatedPlans && activatedPlans.length === 0) {
          this.appState.loading = false;
        }
      });
    });
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      if (userPlanReady && !!this.userPlansService.selectedUserPlan) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
        const isActivePlan = !!this.selectedPlan.mdn;
        if (!!this.userHasActivePlans && !isActivePlan) {
          this.userPlansService.selectFirstUserPlan(true);
        }
        setTimeout(() => {
          if (!!this.selectedPlan && !this.selectedPlan.portInRequestNumber && !this.isApiCalled) {
            this.getPaymentHistory();
          }
        }, 500);
      } else {
        if (!!this.userHasActivePlans) {
          this.userPlansService.selectFirstUserPlan(true);
        }
        // we have to add this case in case the user not have mdn as well as activated accounts so the userPlanReady will be false always 
        if(!this.userHasActivePlans && !!this.userHasPendingPlans) {
        if (!!this.selectedPlan && !this.selectedPlan.portInRequestNumber && !this.isApiCalled) {
            this.getPaymentHistory();
        }
              }
      }
    });
    this.mobilePlansService.currentPlan.subscribe((cart) => {
      this.userCart = cart;
      if (!!this.userCart && this.userCart.activePlanId && this.selectedPlan.id !== this.userCart.activePlanId) {
        this.userPlansService.selectUserPlan(this.userCart.activePlanId);
      }
    });
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setPageDescription(this.getDescription());
    this.accountHeaderService.setAccountMenuVisibility(true);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public goToReceiptDetails(orderID): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = orderID;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PAYMENTS_RECEIPT_DETAILS}`, params]);
  }

  public userPlanSelected(userPlan: IUserPlan): void {
    this.isApiCalled = false;
    if (!!userPlan.mdn) {
      if (!this.selectedPlan || (!!userPlan && userPlan.id !== this.selectedPlan.id)) {
        if (!!this.userCart && this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
          this.modalHelper.showConfirmMessageModal('Clear Cart', 'Changing your selected account will clear the items in your cart. Do you want to proceed?',
            'Yes', 'No', 'clean-cart-modal')
            .afterClosed().subscribe((result) => {
              if (result) {
                this.mobilePlansService.clearUserCart();
                this.appState.clearSessionStorage();
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
                this.analyticsService.trackRermoveFromCartGA4(removedItems);
                this.userPlansService.selectUserPlan(userPlan.id);
                this.appState.loading = false;
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
      if (!!this.userHasActivePlans) {
        this.userPlansService.selectFirstUserPlan(true);
      }
    }
  }

  public sortPaymentHistory(tSortBy): void {
    if (this.sortBy === tSortBy) {
      this.sortDirection = (this.sortDirection === this.PAYMENT_SORT_DIRECTION.DESC) ? this.PAYMENT_SORT_DIRECTION.ASC : this.PAYMENT_SORT_DIRECTION.DESC;
    } else {
      this.sortDirection = this.PAYMENT_SORT_DIRECTION.DESC;
    }

    this.sortBy = tSortBy;
    this.getPaymentHistory();
  }

  public sortArrow(sortField): any {
    if (sortField === this.sortBy) {
      return {
        'icon-caret-down': this.sortDirection === this.PAYMENT_SORT_DIRECTION.DESC,
        'icon-caret-up': this.sortDirection === this.PAYMENT_SORT_DIRECTION.ASC
      };
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
  public pageChanged(page: number): void {
    if (page > 0 && page <= this.paymentHistory.totalItems) {
      const index = page - 1;
      this.config.currentPage = page;
      this.getPaymentHistory();
    }
  }
  private getPaymentHistory(): void {
    this.toastHelper.updateIsProcessing(true);
    if (!!this.selectedPlan && !this.selectedPlan.portInRequestNumber) {
      this.appState.loading = true;
      this.paymentService.reloadPaymentHistory(this.selectedPlan?.mdn, this.selectedPlan?.orderId, this.config.itemsPerPage,
        this.config.currentPage, this.sortBy, this.sortDirection).then(history => {
          this.isApiCalled = true;
          if (!!history) {
            this.toastHelper.updateIsProcessing(false);
            this.paymentHistory = history;
            this.config.totalItems = history.totalItems;
            this.appState.loading = this.isSyncing;
            } else {
              this.paymentHistory = { payments: [], totalItems: 0 };
              this.toastHelper.updateIsProcessing(false);
              this.appState.loading = this.isSyncing;
            }
        }, error => {
          this.isApiCalled = false;
          this.paymentHistory = { payments: [], totalItems: 0 };
          this.toastHelper.updateIsProcessing(false);
          console.warn(`Failed to get payment history: ${error.message}`, error);
          this.toastHelper.showAlert(`Failed to get payment history: ${error.message}`);
          this.appState.loading = this.isSyncing;
        });
      this.toastHelper.updateIsProcessing(false);
    } else {
      this.isApiCalled = false;
      this.paymentHistory = { payments: [], totalItems: 0 };
      this.toastHelper.updateIsProcessing(false);
    }
  }
}
