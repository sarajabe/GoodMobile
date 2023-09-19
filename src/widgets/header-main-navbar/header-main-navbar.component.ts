import { AfterViewInit, Component, HostListener, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { CART_TYPES, CustomizableMobilePlan, IUserAccount, IUserPlan, MobileCustomPlansService, UserAccountService, UserPlansService, ActionsAnalyticsService, FirebaseUserProfileService, IUser, ICreditCardInfo } from '@ztarmobile/zwp-service-backend';
import { combineLatest, takeWhile } from 'rxjs/operators';
import { ROUTE_URLS, LOGIN_ROUTE_URLS, SHOP_ROUTE_URLS, ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, SUPPORT_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, DUPLICATE_PAYMENTS_ROUTE_URLS, ACP_ROUTE_URLS } from '../../app/app.routes.names';
import { AppState } from '../../app/app.service';
import { PhonePipe } from '../pipes/phone.pipe';
import { ModalHelperService } from '../../services/modal-helper.service';
import { ContentfulService } from 'src/services/contentful.service';
import { IVerificationRes } from '@ztarmobile/zwp-service-backend-v2';
import { CheckoutService } from 'src/app/shop/checkout/checkout.service';

@Component({
  selector: 'app-header-main-navbar',
  templateUrl: './header-main-navbar.component.html',
  styleUrls: ['./header-main-navbar.component.scss']
})
export class HeaderMainNavbarComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() pageUrl: string;
  public menuShowing = false;
  public isLoggedIn = true;
  public subAccountShowing = false;
  public hasCartItem = true;
  public totalItems = 0;
  public activeItem = 0;
  public userCart: CustomizableMobilePlan;
  public userAccounts: IUserAccount[];
  public loadingPlan = true;
  public selectedPlan: IUserPlan;
  public notificationCounter = 0;
  public isExpiredAccount = false;
  public isPortIn = false;
  public ROUTE_URLS = ROUTE_URLS;
  public LOGIN_ROUTE_URLS = LOGIN_ROUTE_URLS;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public ACTIVATION_ROUTE_URLS = ACTIVATION_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public userHasActivePlans = false;
  public userPlans: IUserPlan[];
  public showResponsiveMenu = false;
  public showAccountMenu = false;
  public showShopResMenu = false;
  public innerWidth;
  public displayMaintenanceBanner = false;
  public mantainenceDescription;
  public isEbbPlan = false;
  public userProfile: IUser;
  public displayAcpSection = false;
  public showACPActionBanner = false;
  public acpActionRequired = false;
  public ACP_STATUS = {
    COMPLETE: 'COMPLETE',
    PENDING_RESOLUTION: 'PENDING_RESOLUTION',
    IN_PROGRESS: 'IN_PROGRESS',
    PENDING_REVIEW: 'PENDING_REVIEW',
    PENDING_CERT: 'PENDING_CERT'
  };
  public paymentUpdateInProgress = false;
  public preferredPaymentInProgress;
  public showShopMenu = false;
  public acpPlan: IUserPlan;
  public showActivatePlanContent = false;
  public showResumeFilingContent = false;
  public isActivatedAcpPlan = false;
  public verificationDetails: IVerificationRes;

  private showActivatePlanContentCopy = false;
  private showResumeFilingContentCopy = false;
  private previousUrl: any;
  private timeout: any;
  private headerHeight;
  private alertBannerHeight;
  private alive = false;

  constructor(private renderer: Renderer2, private simpleAuthService: SimpleAuthService, public router: Router,
    private userPlansService: UserPlansService, private checkoutService: CheckoutService,
    private appState: AppState, private angularAuthService: AngularFireAuth, private mobilePlansService: MobileCustomPlansService,
    private userAccountService: UserAccountService, private modalHelper: ModalHelperService, private analyticService: ActionsAnalyticsService,
    private contentfulService: ContentfulService, private userProfileService: FirebaseUserProfileService) {
  }

  ngOnInit(): void {
    this.mobilePlansService.currentPlan.subscribe((plan) => {
      this.hasCartItem = (!!plan && plan.hasPlanItem) || (!!plan && plan.simsQuantity > 0) || (!!plan && !!plan.addOns) || (!!plan && !!plan.acpDevice);
      this.calculateCartItems(plan);
      this.getNotificationCount();
      if (!!plan && !!plan.basePlan && !!plan.basePlan.ebb) {
        this.isEbbPlan = true;
        this.totalItems = 0;
      } else {
        this.isEbbPlan = false;
      }
      this.userPlansService.selectedUserPlanObservable.subscribe((selectedPlan) => {
        this.selectedPlan = selectedPlan;
        if (!!this.selectedPlan) {
          this.isPortIn = !!this.selectedPlan.portInRequestNumber ? !!this.selectedPlan.portInRequestNumber : false;
        }
      });
      this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
        this.loadingPlan = !userPlanReady;
        if (!!userPlanReady) {
          this.selectedPlan = this.userPlansService.selectedUserPlan;
        } else {
          this.userPlansService.selectFirstUserPlan(true);
        }
      });
    });
    this.simpleAuthService.userState.subscribe((authState) => {
      this.isLoggedIn = !!authState && !authState.isAnonymous;
      if (!this.isLoggedIn) {
        this.showActivatePlanContent = false;
        this.showResumeFilingContent = false;
        this.showActivatePlanContentCopy = false;
        this.showResumeFilingContentCopy = false;
        this.showACPActionBanner = false;
      }
    });
    this.userAccountService.selectedAccount.subscribe((selectedAccount) => {
      this.isExpiredAccount = !!selectedAccount && selectedAccount.pastDue;
    });
    this.userProfileService.userProfileObservable.subscribe((user) => {
      this.userProfile = user;
      if (!!user) {
        this.userPlansService.userPlans.subscribe((plans) => {
          if (!!plans) {
            this.acpPlan = plans.find((plan) => !!plan.basePlan.ebb && !plan.canceled);
            this.displayAcpSection = !!this.acpPlan ? true : false;
            this.isActivatedAcpPlan = !!this.acpPlan?.mdn ? true : false;
            if (!!this.isActivatedAcpPlan) {
              this.showActivatePlanContent = false;
              this.showResumeFilingContent = false;
              this.showActivatePlanContentCopy = false;
              this.showResumeFilingContentCopy = false;
            }
          }
        });
        if (!!user.ebbId) {
          this.appState.acpAppResObs.subscribe(res => {
            if (!!res) {
              if (!this.isActivatedAcpPlan) {
                if (!!this.acpPlan && res.status === this.ACP_STATUS.COMPLETE && this.router.url.indexOf(ACCOUNT_ROUTE_URLS.ACP_APPLICATION) < 0) {
                  this.showActivatePlanContent = true;
                  this.showActivatePlanContentCopy = true;
                } else if ((res.status === this.ACP_STATUS.PENDING_RESOLUTION || res.status === this.ACP_STATUS.PENDING_CERT) && !!res.link && this.router.url.indexOf(ACCOUNT_ROUTE_URLS.ACP_APPLICATION) < 0 && this.pageUrl.indexOf(ACP_ROUTE_URLS.BASE) < 0) {
                  this.showResumeFilingContent = true;
                  this.showResumeFilingContentCopy = true;
                }
                setTimeout(() => {
                  const alert = document.getElementById('alert');
                  this.alertBannerHeight = !!alert ? alert.clientHeight : 0;
                  this.appState.globalAlertHeightReplySubject.next(this.headerHeight + this.alertBannerHeight);
                }, 200);
              }
              this.verificationDetails = res;
              this.acpActionRequired = false;
              this.showACPActionBanner = false;
            }
          });
        } else {
          this.showActivatePlanContent = false;
          this.showResumeFilingContent = false;
          this.showResumeFilingContentCopy = false;
          this.showActivatePlanContentCopy = false;
          this.appState.acpActiveAppRes.subscribe(res => {
            if (!!res) {
              this.acpActionRequired = true;
              this.showACPActionBanner = (this.router.url.indexOf(ACCOUNT_ROUTE_URLS.ACP_APPLICATION) < 0 && this.pageUrl.indexOf(ACP_ROUTE_URLS.BASE) < 0) ? true : false;
              if (!!this.showACPActionBanner) {
                setTimeout(() => {
                  const alert = document.getElementById('alert');
                  this.alertBannerHeight = !!alert ? alert.clientHeight : 0;
                  this.appState.globalAlertHeightReplySubject.next(this.headerHeight + this.alertBannerHeight);
                }, 200);
              } else {
                this.appState.globalAlertHeightReplySubject.next(this.headerHeight);
              }
            } else {
              this.acpActionRequired = false;
              this.showACPActionBanner = false;
            }
          });
        }
        this.appState.displayAcpSectionObs.subscribe(res => {
          this.displayAcpSection = res;
        });
      }
    });

    this.getMaintenanceContentFromContentful();
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterViewInit(): void {
    const header = document.getElementById('header');
    this.headerHeight = !!header && !!this.showACPActionBanner ? header.clientHeight : (window.innerWidth < 640 ? 58 : 64);
    this.appState.globalAlertHeightReplySubject.next(this.headerHeight);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.pageUrl) {
      this.pageUrl = changes.pageUrl.currentValue;
      // this is to handle hiding the banner after navigating to the acp application page
      if (!!this.pageUrl && (this.pageUrl.indexOf(ACCOUNT_ROUTE_URLS.ACP_APPLICATION) > -1 || this.pageUrl.indexOf(ACP_ROUTE_URLS.BASE) > -1)) {
        this.showActivatePlanContent = false;
        this.showResumeFilingContent = false;
        this.showACPActionBanner = false;
        this.appState.globalAlertHeightReplySubject.next(this.headerHeight);
      } else if (!!this.pageUrl && this.pageUrl.indexOf(ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH) > -1 && this.pageUrl.indexOf(this.acpPlan.id)) {
        this.showActivatePlanContent = false;
        this.showResumeFilingContent = false;
        this.appState.globalAlertHeightReplySubject.next(this.headerHeight);
      }
      else {
        this.showACPActionBanner = this.acpActionRequired;
        this.showActivatePlanContent = this.showActivatePlanContentCopy;
        this.showResumeFilingContent = this.showResumeFilingContentCopy;
        if (!!this.showResumeFilingContent || !!this.showActivatePlanContent) {
          setTimeout(() => {
            const alert = document.getElementById('alert');
            this.alertBannerHeight = !!alert ? alert.clientHeight : 0;
            this.appState.globalAlertHeightReplySubject.next(this.headerHeight + this.alertBannerHeight);
          }, 200);
        }
        else if (!!this.showACPActionBanner) {
          setTimeout(() => {
            const alert = document.getElementById('alert');
            this.alertBannerHeight = !!alert ? alert.clientHeight : 0;
            this.appState.globalAlertHeightReplySubject.next(this.headerHeight + this.alertBannerHeight);
          }, 200);
        } else {
          this.appState.globalAlertHeightReplySubject.next(this.headerHeight);
        }
      }
    }
  }

  public activatePlan(): void {
    if (!!this.acpPlan) {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.acpPlan.id;
      if (!!this.acpPlan && !!this.acpPlan.planDevice && !!this.acpPlan.planDevice.id) {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
      } else {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
      }
    }
  }

  public goToAcp(): void {
    window.open(`${this.verificationDetails?.link}`, '_self');
  }

  public toggleShowing(): void {
    this.menuShowing = !this.menuShowing;
    // prevent body from scroll when menu is open
    if (!!this.menuShowing) {
      this.renderer.addClass(document.body, 'modal-open');
      this.renderer.removeClass(document.body, 'modal-closed');
    } else {
      this.renderer.removeClass(document.body, 'modal-open');
      this.renderer.addClass(document.body, 'modal-closed');
    }
  }

  public logout(event): void {
    this.menuShowing = false;
    this.showResponsiveMenu = false;
    this.setActiveItem(0);
    this.renderer.removeClass(document.body, 'modal-open');
    this.renderer.addClass(document.body, 'modal-closed');
    this.router.navigate([ROUTE_URLS.HOME]);
    this.appState.clearSessionStorage();
    this.angularAuthService.signOut();
    this.appState.userLoggedIn.next(undefined);
    this.acpActionRequired = false;
    this.showACPActionBanner = false;
    this.appState.globalAlertHeightReplySubject.next(this.headerHeight);
    this.checkoutService.setPayments({ card: { address1: '', address2: '', cardCode: '', cardNumber: '', last4: '', id: '', city: '', state: '', country: '', postalCode: '', method: '', name: '', alias: '', fullName: '', brand: '' } });
  }

  public getPriority(): void {
    if (!this.isLoggedIn) {
      const params = {};
      params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE] = `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
    } else {
      if (!!this.userAccounts && this.userAccounts.length > 0) {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PAY_AND_RENEW}`]);
      } else {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS}`]);
      }
    }
  }

  public onLinkClick(event, page?: string): void {
    this.showResponsiveMenu = false;
    const screenWidth = window.innerWidth;
    this.renderer.removeClass(document.body, 'modal-open');
    this.renderer.addClass(document.body, 'modal-closed');
    if (screenWidth < 750) {
      this.toggleShowing();
    }
    if (!!page && !this.isPortIn) {
      switch (page) {
        case 'addon': {
          if (!this.isExpiredAccount) {
            this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`]);
          }
          break;
        }
        case 'refill':
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PAY_AND_RENEW}`]);
          break;
        case 'payment':
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PAYMENTS}`]);
          break;
        case 'usage':
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.USAGE}`]);
          break;
      }
    }
    if (!!page && page === 'orders') {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
    }
    if (!!page && page === 'acp') {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`]);
    }
    if (!!page && page === 'refer') {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REFER_FRIEND}`]);
    }
    if (!!page && (page === 'pendingPlans' || page === 'plans')) {
      this.mobilePlansService.setSimCard('');
    }
  }

  public setActiveItem(x: number): void {
    this.resetTimeout();
    this.activeItem = x;
  }

  public goToCart(): void {
    if (this.hasCartItem && !(this.router.url.indexOf('cart') > -1) && !this.isEbbPlan) {
      this.menuShowing = false;
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    }
  }

  public resetTimeout(): void {
    if (!!this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public calculateCartItems(plan): void {
    this.totalItems = 0;
    if (!!plan) {
      if (!!plan.cartType && plan.cartType !== CART_TYPES.PLAN_ITEMS && plan.cartType !== CART_TYPES.GENERIC_CART) {
        this.totalItems = !this.isEbbPlan ? 1 : 0;
      } else {
        if (plan.addOns) {
          this.totalItems += plan.addOns.length;
        }
        if (plan.simsQuantity) {
          this.totalItems += 1;
        }
        if (!!plan.acpDevice) {
          this.totalItems += 1;
        }
      }
    }
  }

  public getNotificationCount(): void {
    if (!!this.isLoggedIn) {
      this.userAccountService.userAccounts.pipe(combineLatest(this.userPlansService.userPlans, (accounts: IUserAccount[], plans) => {
        const userAccounts = accounts.filter((account) => account.billingRenewDaysLeft <= 3);
        let pendingPlans: IUserPlan[];
        let activePlans: IUserPlan[];
        let duePlan: IUserPlan;
        if (!!plans) {
          pendingPlans = plans.filter((plan) => !plan.mdn);
          activePlans = plans.filter((plan) => !!plan.mdn);
          this.userPlans = activePlans;
          if (userAccounts.length > 0) {
            this.notificationCounter = 1;
            duePlan = this.userPlans.find((plan) => plan.mdn === userAccounts[0].mdn);
          } else {
            this.notificationCounter = pendingPlans.length;
          }
          this.userHasActivePlans = (!!activePlans && activePlans.length > 0);
        }
      }), takeWhile(() => this.alive)).subscribe();
    }
  }

  public goToAddOns(): void {
    if (!this.isExpiredAccount && !this.isPortIn) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`]);
    }
  }

  public changePlan(): void {
    if (!this.isPortIn) {
      if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.CHANGE_PLAN) {
        // eslint-disable-next-line max-len
        this.modalHelper.showConfirmMessageModal('Clear Cart', 'Purchasing a plan will remove any other item in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
          .afterClosed().subscribe((result) => {
            if (result) {
              this.mobilePlansService.clearUserCart();
              this.appState.clearSessionStorage();
              const removedItems = [];
              if (this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
                removedItems.push(this.userCart.basePlan);
              } else {
                if (this.userCart.simsQuantity > 0) {
                  removedItems.push({ id: !!this.userCart.planDevice ? this.userCart.planDevice.skuNumber : 'SIMUNI4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
                }
                if (!!this.userCart.addOns) {
                  removedItems.push(this.userCart.addOns);
                }
              }
              const params = {};
              params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
              this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`, params]);
            }
          }, (error) => {
            console.error('error', error);
          });
      } else {
        const params = {};
        params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`, params]);
      }
    }
  }

  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan.mdn) {
      if (!this.selectedPlan || (!!userPlan && userPlan.id !== this.selectedPlan.id)) {
        if (!!this.userCart && this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
          this.modalHelper.showConfirmMessageModal('Clear Cart', 'Changing your selected account will clear the items in your cart. Do you want to proceed?',
            'Yes', 'No', 'clean-cart-modal')
            .afterClosed().subscribe((result) => {
              if (result) {
                this.mobilePlansService.clearUserCart();
                this.appState.clearSessionStorage();
                const removedItems = [];
                if (this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
                  removedItems.push(this.userCart.basePlan);
                } else {
                  if (this.userCart.simsQuantity > 0) {
                    removedItems.push({ id: 'SIMG2G4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
                  }
                  if (!!this.userCart.addOns) {
                    removedItems.push(this.userCart.addOns);
                  }
                }
                this.analyticService.trackRermoveFromCartGA4(removedItems);
                this.userPlansService.selectUserPlan(userPlan.id);
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
        else {
          this.userPlansService.selectUserPlan(userPlan.id);
        }
      }
    } else {
      this.userPlansService.selectFirstUserPlan(true);
    }
  }

  public planCompare(plan1: IUserPlan, plan2: IUserPlan) {
    return !!plan1 && !!plan2 ? plan1.id === plan2.id : plan1 === plan2;
  }

  public getSelectorTitle(plan: IUserPlan): string {
    const mdn: string = (new PhonePipe()).transform(plan.mdn);
    const title = !!plan.portInRequestNumber ? `PortIn for ${mdn}` : (!!plan.canceled ? `${mdn} - Canceled` : mdn);
    return title;
  }

  private getMaintenanceContentFromContentful(): void {
    this.contentfulService.getContent('maintenanceModel').subscribe(contents => {
      if (!!contents) {
        const result = contents[0].fields;
        this.mantainenceDescription = this.contentfulService.getRichTextWithOptions(result.maintenanceDescription);
        const maxDate = new Date(result.endDisplayDate);
        const displayDate = new Date(result.maintenanceDisplayDate);
        const todayDate = new Date();
        if (todayDate < maxDate && todayDate >= displayDate) {
          this.displayMaintenanceBanner = true;
        }
      }

    });
  }

  public goToACPApplication(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`]);
  }

  public goToPaymentUpdate(): void {
    this.router.navigate(['/' + DUPLICATE_PAYMENTS_ROUTE_URLS.BASE + '/' + DUPLICATE_PAYMENTS_ROUTE_URLS.PAYMENT_ATTENTION]);
  }

  public continueEditing(): void {
    const params = {};
    const paymentUpdateInProgressSaved = sessionStorage.getItem('attention-payment');
    params[DUPLICATE_PAYMENTS_ROUTE_URLS.PARAMS.ID] = paymentUpdateInProgressSaved;
    this.router.navigate(['/' + DUPLICATE_PAYMENTS_ROUTE_URLS.BASE + '/' + DUPLICATE_PAYMENTS_ROUTE_URLS.CHANGE_PREFERRED_PAYMENT, params]);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    const header = document.getElementById('header');
    this.headerHeight = !!header && !!this.showACPActionBanner ? header.clientHeight : (window.innerWidth < 640 ? 58 : 64);
    if (!!this.showACPActionBanner || !!this.showResumeFilingContent || !!this.showActivatePlanContent) {
      const alert = document.getElementById('alert');
      this.alertBannerHeight = !!alert ? alert.clientHeight : 0;
      this.appState.globalAlertHeightReplySubject.next(this.headerHeight + this.alertBannerHeight);
    } else {
      this.appState.globalAlertHeightReplySubject.next(this.headerHeight);
    }
  }
  
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    this.showResponsiveMenu = false;
    this.renderer.removeClass(document.body, 'modal-open');
    this.renderer.addClass(document.body, 'modal-closed');
  }
}
