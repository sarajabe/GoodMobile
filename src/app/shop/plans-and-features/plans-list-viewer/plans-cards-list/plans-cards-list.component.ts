/* eslint-disable max-len */
import { Component, EventEmitter, Output, ElementRef, AfterViewInit, QueryList, ViewChildren, Input, OnInit, HostListener, SimpleChange, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import {
  MobilePlanItem, MobileCustomPlansService, CustomizableMobilePlan, CART_TYPES, UserPlansService,
  ActionsAnalyticsService, PURCHASE_INTENT, UserAccountService, IUserAccount, FirebaseUserProfileService, IMarketingDetails
} from '@ztarmobile/zwp-service-backend';
import { FadeInOutAnimation } from '../../../../app.animations';
import { PlansShopService } from '../../plans-shop.service';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { AppState } from '../../../../app.service';
import { SUPPORT_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, CHECKOUT_ROUTE_URLS, PHONES_SHOP_ROUTE_URLS } from '../../../../app.routes.names';
import { takeWhile, combineLatest, take } from 'rxjs/operators';
import { ModalHelperService } from '../../../../../services/modal-helper.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-plans-cards-list',
  templateUrl: './plans-cards-list.component.html',
  styleUrls: ['./plans-cards-list.component.scss'],
  animations: [FadeInOutAnimation]
})
export class PlansCardsListComponent implements OnInit, OnChanges, AfterViewChecked {
  @ViewChildren('planElement') planElements: QueryList<ElementRef>;
  @Input() isChangePlan: boolean;
  @Output()
  public mobilePlanSelected: EventEmitter<MobilePlanItem> = new EventEmitter<MobilePlanItem>();
  @Output() selectPlan: EventEmitter<any> = new EventEmitter<any>();
  public filteredPlans: Array<MobilePlanItem>;
  public selectedPlan: MobilePlanItem;
  public currentPlan: CustomizableMobilePlan = new CustomizableMobilePlan();
  public userAccount: IUserAccount;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ROUTE_URLS = ROUTE_URLS;
  public selectedIndex = -1;
  public selectedPlanDOM: HTMLElement;
  public value: any;
  public pageWidth: any;
  public customHtml: any;
  public isLoggedIn = false;
  public showPromoPlan = false;
  public activePlan = false;
  public needsScroll = false;
  public isExpiredPlan = false;
  public isSectionExpanded = false;
  public steps = [];
  public userHasDevice = false;
  public isValentinePromo = false;
  public showCampaignPlan = false;
  public hasEbb = false;
  public isReplacePlan = false;
  public isPhonePurchase = false;
  public utms;
  private utmSource: string;
  private referralCode: string;
  private allBasePlans: Array<MobilePlanItem>;
  private alive = true;

  constructor(public plansShopService: PlansShopService, private mobilePlansService: MobileCustomPlansService, private modalHelper: ModalHelperService,
    private userAccountService: UserAccountService, private route: ActivatedRoute, private router: Router, private location: Location,
    private appState: AppState, private analyticsService: ActionsAnalyticsService, private pageScrollService: PageScrollService,
    private simpleAuthService: SimpleAuthService, private userPlansService: UserPlansService, private angularFireService: AngularFireAuth,
    private userProfileService: FirebaseUserProfileService) {

    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((authState) => this.isLoggedIn = !!authState && !authState.isAnonymous);
    this.plansShopService.isExpanded.subscribe((isSectionExpanded) => this.isSectionExpanded = isSectionExpanded);
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.currentPlan = plan;
      if (!!this.currentPlan) {
        // eslint-disable-next-line max-len
        this.userHasDevice = (!!this.currentPlan.planDevice && !!this.currentPlan.planDevice.skuIdentifier && !!this.currentPlan.planDevice.skuNumber) || (!!this.currentPlan.phones && this.currentPlan.phones.length > 0);
      }
    });
  }
  ngOnInit(): void {
    const tree = this.router.parseUrl(this.router.url);
    if (tree.fragment) {
      setTimeout(() => {
        this.pageScrollService.scroll({
          document,
          scrollTarget: `#${tree.fragment}`,
          scrollOffset: 100,
          speed: 150
        });
      }, 400);
    }
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
      if (!!this.userAccount && this.userAccount.plan.bundleId.endsWith('EXP')) {
        this.isExpiredPlan = true;
      }
    });
    this.appState.isMarketingCampaign.pipe(takeWhile(() => this.alive)).subscribe((isCampaign) => {
      this.utms = JSON.parse(sessionStorage.getItem('utms'));
      this.setMarketingObjectToCart();
    });
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
      if (!!plans) {
        const userEbbPlan = plans.find((p) => !!p.basePlan.ebb);
        this.hasEbb = !!userEbbPlan ? true : false;
      }
    });
    this.mobilePlansService.isConfigurationReady.pipe(combineLatest(this.route.params, (isReady, params: Params) => {
      if (isReady) {
        this.route.queryParams.pipe(takeWhile(() => this.alive)).subscribe((queryParams: Params) => {
          const maxDate = new Date('October 31, 2021 23:59:59 GMT-06:00');
          const todayDate = new Date();
          if (!!queryParams && queryParams[ROUTE_URLS.PARAMS.REFERRAL_ID]) {
            this.referralCode = queryParams[ROUTE_URLS.PARAMS.REFERRAL_ID];
            sessionStorage.setItem('referralCode', this.referralCode);
            sessionStorage.removeItem('showCampaignPlan');
            this.showCampaignPlan = false;
            this.simpleAuthService.userState.pipe(take(1)).subscribe((authState) => {
              this.isLoggedIn = !!authState && !authState.isAnonymous;
              if (!!this.isLoggedIn) {
                this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((user) => {
                  if (!!user && ((!!user.referredWithCode && user.referredWithCode !== this.referralCode) || !user.referredWithCode) && user.referralCode !== this.referralCode) {
                    user.referredWithCode = this.referralCode;
                    this.userProfileService.bffUpdateUserProfile(user).then((result) => {
                    });
                  }
                });
              }
            });
          }
          if (!!params && !!params[SHOP_ROUTE_URLS.PARAMS.PHONE_PURCHASE]) {
            this.isPhonePurchase = true;
          }
        });
        this.preparePlans();
        setTimeout(() => {
          if (!!this.isChangePlan) {
            this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((ready) => {
              if (!!ready) {
                const selectedPlanId = this.userPlansService.selectedUserPlan.basePlan.id;
                this.filteredPlans = this.filteredPlans.filter((plan) => plan.id !== selectedPlanId && !!plan.availableForChange && !plan.ebb && !!plan.parentId);
              }
            });
          }
        }, 200);
        if (!!this.filteredPlans) {
          this.analyticsService.trackProductsImpressions(this.filteredPlans, 'plans-list');
        }
        /* eslint-disable @typescript-eslint/dot-notation */
        if (!!params && params['id']) {
          const selectedPlanId = params['id'];
          this.selectedPlan = this.mobilePlansService.allBasePlans.find((plan) => plan.id === selectedPlanId.toUpperCase());
          if (!!this.selectedPlan) {
            this.selectedIndex = this.filteredPlans.indexOf(this.selectedPlan);
            this.activePlan = true;
            this.needsScroll = true;
            this.analyticsService.trackProductDetails(this.selectedPlan);
            setTimeout(() => {
              this.pageScrollService.scroll({
                document,
                scrollTarget: '.active',
                scrollOffset: 141,
                speed: 200
              });
            }, 1000);
          }

        } else if (!!params && params[ROUTE_URLS.PARAMS.SELECTED_PLAN]) {
          const selectedPlanId = params[ROUTE_URLS.PARAMS.SELECTED_PLAN];
          this.selectedPlan = this.mobilePlansService.allBasePlans.find((plan) => plan.id === selectedPlanId.toUpperCase());
          if (!!this.selectedPlan) {
            this.selectedIndex = this.filteredPlans.indexOf(this.selectedPlan);
            this.activePlan = true;
            this.analyticsService.trackProductDetails(this.selectedPlan);
            this.location.replaceState(SHOP_ROUTE_URLS.BASE + '/' + SHOP_ROUTE_URLS.PLANS_AND_FEATURES + '/' + this.filteredPlans[this.selectedIndex].id.toUpperCase() +
              '/details?' + window.location.href.split('?')[1]);
          }
        }
      }
    })).subscribe();
    this.pageWidth = window.innerWidth;
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (params) {
        if (!!params[SHOP_ROUTE_URLS.PARAMS.REPLACE_PLAN]) {
          this.isReplacePlan = params[SHOP_ROUTE_URLS.PARAMS.REPLACE_PLAN];
        }
      }
    });
  }
  ngAfterViewChecked(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.allBasePlans && !!changes) {
      this.preparePlans();
    }
  }

  public getQueryParams(): void {
    this.route.queryParams.subscribe((queryParams: Params) => {
      return queryParams.value;
    });
  }
  public getSelectedPlan(index): void {
    this.selectedPlan = this.filteredPlans[index];
  }

  public goToEbb(): void {
    if (!!this.hasEbb && !!this.isLoggedIn) {
      this.modalHelper.showInformationMessageModal('ACP Plan Limit', 'Each customer/household is eligible for a single Affordable Connectivity Program (ACP) plan. You have already enrolled in ACP program on this account', 'Got it!');
    } else {
      this.router.navigate([ROUTE_URLS.ACP]);
    }
  }

  public toggleSelectedPlan(index): void {
    if (this.selectedIndex === index) {
      this.activePlan = !this.activePlan;
      if (!!this.isChangePlan) {
        this.location.replaceState(SHOP_ROUTE_URLS.BASE + '/' + SHOP_ROUTE_URLS.PLANS_AND_FEATURES + '/' + PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN);
      } else {
        this.location.replaceState(SHOP_ROUTE_URLS.BASE + '/' + SHOP_ROUTE_URLS.PLANS_AND_FEATURES);
      }
      this.selectedIndex = -1;
    } else {
      if (!!this.isChangePlan) {
        this.location.replaceState(SHOP_ROUTE_URLS.BASE + '/' +
          SHOP_ROUTE_URLS.PLANS_AND_FEATURES + '/' + PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN + '/' + this.filteredPlans[index].id.toUpperCase() + '/details');
      } else {
        this.location.replaceState(SHOP_ROUTE_URLS.BASE + '/' + SHOP_ROUTE_URLS.PLANS_AND_FEATURES + '/' + this.filteredPlans[index].id.toUpperCase() + '/details');
      }
      this.selectedIndex = index;
      this.activePlan = true;
      this.selectedPlan = this.filteredPlans[index];
      this.analyticsService.trackProductDetails(this.selectedPlan);
      if (window.innerWidth <= 640 && this.selectedIndex >= 2) {
        this.pageScrollService.scroll({
          document,
          scrollTarget: '.active',
          speed: 20,
        });
      }
    }
  }

  public toggleSelectedPlanResponsive(index, size?: string): void {
    if (window.innerWidth < 834 && size === 'responsive') {
      this.toggleSelectedPlan(index);
    }
    if (window.innerWidth >= 834 && size === 'desktop') {
      this.toggleSelectedPlan(index);
    }
  }

  public selectPlanForPhone(index): void {
    this.getSelectedPlan(index);
    sessionStorage.setItem('selectedPlanId', JSON.stringify(this.selectedPlan.id));
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.ADD_STEPS}/${PHONES_SHOP_ROUTE_URLS.CHECK_COVERAGE}`]);
  }
  public addPlanToCart($event, index): void {
    if (!!$event) {
      // this.toggleSelectedPlan(index);
      $event.preventDefault();
    }
    this.getSelectedPlan(index);
    if (!!this.isReplacePlan) {
      this.addPlan(this.selectedPlan);
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    } else {
      if (!!this.currentPlan && !!this.currentPlan.planDevice && this.currentPlan.planDevice.id) {
        this.mobilePlansService.removePhonesFromCart();
        this.mobilePlansService.setPlanExpectedDevice(null);
        this.mobilePlansService.setBasePlan(this.selectedPlan);
        this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
      } else {
        this.modalHelper.showRoutingModal('Do you need a phone to go with this plan?', '', true,
          'I already have a phone', 'I need to buy a phone', 'Skip for now', `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`,
          // tslint:disable-next-line:max-line-length
          `${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`, `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`, 'need-phone-popUp').result.then((result) => {
            if (!!result) {
              this.checkUser(this.selectedPlan, result);
            }
          }, (error) => {
            console.error('error', error);
          });
      }
    }
  }

  public selectChangePlan(i, event): void {
    if (!!event) {
      event.preventDefault();
    }
    this.getSelectedPlan(i);
    if (!this.isExpiredPlan) {
      this.modalHelper.showConfirmMessage(`<p class="first">If you choose to change plans now, Your plan change will take affect immediately,
      and any remaining service balances on your account may be lost.</p>
      <p class="second">If you choose to change plans on your plan’s expiration date, your plan will change
      on your Rate Plan Expiration Date. At that time, the cost of this new plan will be deducted from your main account balance.</p>`, {
        okText: 'Yes, make change on expiry date', cancelText: 'No, I want to change plan now', enableHTML: true, customClass: 'change-plan-modal'
      }).result.then((result) => {
        if (result) {
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
            // this.mobilePlansService.setAutoRenewPlan(this.userPlansService.selectedUserPlan.autoRenewPlan);
            const params = {};
            params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = result;
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHANGE_SUMMARY}`, params]);
          });
        } else {
          if (result === false) {
            this.mobilePlansService.clearUserCart().then(() => {
              sessionStorage.removeItem('shippingAddress');
              sessionStorage.removeItem('shippingMethod');
              sessionStorage.removeItem('payment_id');
              sessionStorage.removeItem('auto_renew');
              sessionStorage.removeItem('useFromBalance');
              sessionStorage.removeItem('useFromReward');
              sessionStorage.removeItem('removeFromCart');
              sessionStorage.setItem('changeNextCycle', 'false');
              this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.CHANGE, [this.selectedPlan]);
              this.mobilePlansService.setCartType(CART_TYPES.CHANGE_PLAN);
              this.mobilePlansService.setActivePlanId(this.userPlansService.selectedUserPlan.id);
              this.mobilePlansService.setBasePlan(this.selectedPlan);
              // this.mobilePlansService.setAutoRenewPlan(this.userPlansService.selectedUserPlan.autoRenewPlan);
              const params = {};
              params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = result;
              this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHANGE_SUMMARY}`, params]);
            });
          }
        }

      });
    } else {
      this.modalHelper.showConfirmMessage(`<p class="first">If you choose to change plan now, Your plan change will take affect immediately.</p>
      <p class="second">The cost of this new plan will be deducted from your main account balance.</p>`, {
        okText: '', cancelText: 'Change plan now', enableHTML: true, customClass: 'change-expired-plan-modal'
      }).result.then((result) => {
        if (result) {
          this.mobilePlansService.clearUserCart().then(() => {
            this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.CHANGE, [this.selectedPlan]);
            this.mobilePlansService.setBasePlan(this.selectedPlan);
            this.mobilePlansService.setCartType(CART_TYPES.CHANGE_PLAN);
            sessionStorage.removeItem('useFromBalance');
            sessionStorage.removeItem('useFromReward');
            // this.mobilePlansService.setAutoRenewPlan(this.userPlansService.selectedUserPlan.autoRenewPlan);
            this.mobilePlansService.setActivePlanId(this.userPlansService.selectedUserPlan.id);
            const params = {};
            params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = result;
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHANGE_SUMMARY}`, params]);
          });
        } else {
          if (result === false) {
            this.mobilePlansService.clearUserCart().then(() => {
              this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.CHANGE, [this.selectedPlan]);
              this.mobilePlansService.setBasePlan(this.selectedPlan);
              this.mobilePlansService.setCartType(CART_TYPES.CHANGE_PLAN);
              sessionStorage.removeItem('useFromBalance');
              sessionStorage.removeItem('useFromReward');
              // this.mobilePlansService.setAutoRenewPlan(this.userPlansService.selectedUserPlan.autoRenewPlan);
              this.mobilePlansService.setActivePlanId(this.userPlansService.selectedUserPlan.id);
              const params = {};
              params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = result;
              this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHANGE_SUMMARY}`, params]);
            });
          }
        }
      });
    }
  }
  public calculatePlanPrice(plan: MobilePlanItem): any {
    if (!!plan) {
      if (!!plan.isSpecialPromotion && ((!!plan?.specialPromotion?.promotionAmount && plan?.specialPromotion?.promotionAmount > 0) || !!plan?.specialPromotion?.promotionDiscount)) {
        if (!!plan?.specialPromotion?.promotionAmount && plan?.specialPromotion?.promotionAmount > 0)
          return '$' + (plan.price - plan.specialPromotion.promotionAmount);
        else if (!!plan?.specialPromotion?.promotionDiscount) {
          const discountAmountValue = plan?.specialPromotion?.promotionDiscount.split('%')[0];
          const discountValue = parseInt(discountAmountValue, 10);
          return plan?.price - (plan?.price * (discountValue / 100));
        }
      } else {
        // prmo price is the suto renew
        return !!plan?.ebb ? 'FREE' : '$' + (plan?.price - plan?.promoPrice);
      }
    }
  }
  private checkCart(plan: MobilePlanItem, selection: string): boolean {
    // eslint-disable-next-line eqeqeq
    if (!!this.currentPlan && !!this.currentPlan.cartType && this.currentPlan.cartType != CART_TYPES.NEW_PLAN) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Adding new plan will remove other items in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
        .result.then((result) => {
          if (!!result) {
            this.clearCart();
            setTimeout(() => {
              this.addPlan(plan);
              if (selection === 'check-phone') {
                sessionStorage.removeItem('planFlow');
                this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`]);
              } else if (selection === 'shop-phone') {
                sessionStorage.setItem('planFlow', 'true');
                sessionStorage.setItem('selectedPlanId', JSON.stringify(this.selectedPlan.id));
                const params = {};
                params[ROUTE_URLS.PARAMS.NEW_PURCHASE] = true;
                this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`, params]);
              } else {
                sessionStorage.removeItem('planFlow');
                this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
              }
            }, 500);
            return true;
          }
        }, (error) => {
          console.error('error', error);
          return false;
        });
    } else {
      this.addPlan(plan);
      this.mobilePlansService.setActivePlanId('');
      if (selection === 'check-phone') {
        sessionStorage.removeItem('planFlow');
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`]);
      } else if (selection === 'shop-phone') {
        sessionStorage.setItem('selectedPlanId', JSON.stringify(this.selectedPlan.id));
        sessionStorage.setItem('planFlow', 'true');
        const params = {};
        params[ROUTE_URLS.PARAMS.NEW_PURCHASE] = true;
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`, params]);
      } else {
        sessionStorage.removeItem('planFlow');
        const url = `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`;
        this.router.navigate([url]);
      }
      return true;
    }
  }
  private addPlan(plan): void {
    sessionStorage.setItem('planID', JSON.stringify(plan.id));
    this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.NEW, [plan], plan.price);
    if (!!this.userHasDevice) {
      this.mobilePlansService.setBasePlan(plan);
      this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
    }
    this.mobilePlansService.setAutoRenewPlan(true);
    sessionStorage.removeItem('useFromBalance');
    sessionStorage.removeItem('useFromReward');
    sessionStorage.removeItem('removeFromCart');
    if (!!this.isValentinePromo) {
      const promoCodes = [{ code: 'VDAY1MTHFREE21', description: 'Second Month Free Service', date: new Date() }];
      this.mobilePlansService.setPromoCodes(promoCodes);
    }
  }
  private clearCart(): void {
    const removedItems = [];
    if (this.currentPlan.cartType !== CART_TYPES.PLAN_ITEMS) {
      removedItems.push(this.currentPlan.basePlan);
    } else {
      if (this.currentPlan.simsQuantity > 0) {
        removedItems.push({ id: 'SIMGWLTMO4GLTE', quantity: this.currentPlan.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
      }
      if (!!this.currentPlan.addOns) {
        removedItems.push(this.currentPlan.addOns);
      }
    }
    this.analyticsService.trackRermoveFromCartGA4(removedItems);
    this.mobilePlansService.setSimPurchaseQuantity(0);
    this.mobilePlansService.setAddonsList(null, this.currentPlan);
    this.mobilePlansService.setActivePlanId('');
    this.appState.clearSessionStorage();
    this.mobilePlansService.clearUserCart();
  }

  private preparePlans(): void {
    this.allBasePlans = this.mobilePlansService.allBasePlans;
    if (!!this.showCampaignPlan && !this.isChangePlan) {
      /* eslint-disable max-len */
      // tslint:disable:max-line-length
      this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId && ((!!plan.specialPromotion && (plan.specialPromotion.utm_source === this.utmSource && !!plan.specialPromotion.isSpecific)) || !plan.isSpecialPromotion) && !plan.ebb);
      const replacedPlans = this.filteredPlans.filter((val) => this.filteredPlans.includes(this.filteredPlans.find((e) => e.details.data === val.details.data && !val.isSpecialPromotion && !!e.isSpecialPromotion))); // get plans that has equal data with the special promo plans
      this.filteredPlans = this.filteredPlans.filter((plan) => !replacedPlans.includes(plan)); // remove plans that has the same data as the promo plan
      this.filteredPlans.sort((a, b) => a.details.data - b.details.data);
      this.filteredPlans.push(this.filteredPlans.shift());
      this.selectedPlan = this.allBasePlans.find((plan) => !!plan.parentId && !!plan.isSpecialPromotion);
    } else {
      this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId && (!plan.isSpecialPromotion || !!plan.specialPromotion && !plan.specialPromotion.isSpecific) && !plan.ebb);
      const replacedPlans = this.filteredPlans.filter((val) => this.filteredPlans.includes(this.filteredPlans.find((e) => e.details.data === val.details.data && !val.isSpecialPromotion && !!e.isSpecialPromotion))); // get plans that has equal data with the special promo plans
      this.filteredPlans = this.filteredPlans.filter((plan) => !replacedPlans.includes(plan)); // remove plans that has the same data as the promo plan
    }
    this.filteredPlans.sort((a, b) => a.details.data - b.details.data);
    this.filteredPlans.push(this.filteredPlans.shift()); // make the first element the last one in array
    if ((!this.isChangePlan ||
      (!!this.isChangePlan && !(this.userPlansService?.selectedUserPlan?.basePlan?.ebb) && this.userPlansService?.selectedUserPlan?.planDevice?.network === 'tmo')) && !this.isPhonePurchase) {
      const ebbPlan = this.allBasePlans.find((p) => !!p.ebb);
      if (!!ebbPlan) {
        this.filteredPlans.unshift(ebbPlan);
      }
    }
  }
  private checkUser(plan: MobilePlanItem, selection?: string): void {
    this.simpleAuthService.userState.pipe(take(1)).subscribe((authState) => {
      const isLoggedIn = !!authState && !authState.isAnonymous;
      if (!isLoggedIn) {
        this.angularFireService.signInAnonymously().then((user) => {
          setTimeout(() => {
            this.checkCart(plan, selection);
          }, 1000);
        });
      } else {
        this.checkCart(plan, selection);
      }
    });
  }

  private setMarketingObjectToCart(): void {
    if (!!this.utms) {
      const marketingObject: IMarketingDetails = {
        timestamp: new Date().toISOString(), utm_campaign: this.utms.utm_campaign,
        utm_medium: this.utms.utm_medium, utm_source: this.utms.utm_source, attributes: []
      };
      if (!!this.utms.agentID || !!this.utms.agentid) {
        marketingObject.attributes.push({ name: 'agentID', value: !!this.utms.agentID ? this.utms.agentID : this.utms.agentid });
      }
      marketingObject.attributes.push({ name: 'vendorID', value: !!this.utms && !!this.utms.vendorID ? this.utms.vendorID : 'g2g' });
      this.mobilePlansService.setMarketingObject(marketingObject);
      // sessionStorage.removeItem('utms');
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.pageWidth = window.innerWidth;
  }
}
