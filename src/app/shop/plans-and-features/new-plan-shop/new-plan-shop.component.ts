import { Component, OnInit, OnDestroy, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, take, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../../../app.routes.names';
import { AppState } from 'src/app/app.service';
import { ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, IMarketingDetails, IUserAccount, MobileCustomPlansService, MobilePlanItem, PURCHASE_INTENT, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { PageScrollService } from 'ngx-page-scroll-core';
import { Location } from '@angular/common';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ContentfulService } from 'src/services/contentful.service';
import { ClipboardService } from 'ngx-clipboard';


@Component({
  selector: 'app-new-plan-shop',
  templateUrl: './new-plan-shop.component.html',
  styleUrls: ['./new-plan-shop.component.scss']
})
export class NewPlanShopComponent implements OnDestroy, OnInit, OnChanges {
  public currentPlan: CustomizableMobilePlan = new CustomizableMobilePlan();
  public userAccount: IUserAccount;
  public filteredPlans: Array<MobilePlanItem>;
  public desktopFilteredPlans: Array<MobilePlanItem> = [];
  public selectedPlan: MobilePlanItem;
  public isExpiredPlan = false;
  public activePlan = false;
  public isReplacePlan = false;
  public isLoggedIn = false;
  public userHasDevice = false;
  public isValentinePromo = false;
  public showCampaignPlan = false;
  public selectedIndex = -1;
  public cardExpanded;
  public utms;
  public hasEbb = false;
  public isCopied = false;
  public isEbbPlan = false;
  public innerWidth: any;
  public questionIdParam: any;
  public collapsed: boolean;
  public plansQuestions;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public planPrices = [];
  public selectedPrice: number;

  private activationFlow = false;
  private allBasePlans: Array<MobilePlanItem>;
  private alive = true;
  private utmSource: string;
  private planPriceParam: number;

  constructor(private router: Router, private mobilePlansService: MobileCustomPlansService, private userAccountService: UserAccountService,
    private userPlansService: UserPlansService, private route: ActivatedRoute, private analyticsService: ActionsAnalyticsService,
    private appState: AppState, private pageScrollService: PageScrollService, private location: Location,
    private simpleAuthService: SimpleAuthService, private modalHelper: ModalHelperService, private angularFireService: AngularFireAuth,
    private contentfulService: ContentfulService, private clipboardService: ClipboardService) {
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((authState) => this.isLoggedIn = !!authState && !authState.isAnonymous);
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.currentPlan = plan;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  ngOnInit(): void {
    this.innerWidth = document.documentElement.clientWidth;
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
      if (!!this.userAccount && this.userAccount.plan.bundleId.endsWith('EXP')) {
        this.isExpiredPlan = true;
      }
    });
    this.getPlansQsts();
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
        this.preparePlans();
        if (!!this.filteredPlans) {
          this.analyticsService.trackProductsImpressions(this.filteredPlans, 'plans-list');
        }
        this.activationFlow = !!params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION] ? true : false;
        /* eslint-disable @typescript-eslint/dot-notation */
        if (!!params && params['id']) {
          const selectedPlanId = params['id'];
          this.selectedPlan = this.mobilePlansService.allBasePlans.find((plan) => plan.id === selectedPlanId.toUpperCase());
          if (!!this.selectedPlan) {
            this.selectedIndex = this.filteredPlans.indexOf(this.selectedPlan);
            this.activePlan = true;
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
            this.location.replaceState(SHOP_ROUTE_URLS.BASE + '/' + SHOP_ROUTE_URLS.PLANS_AND_FEATURES + '/' + PLANS_SHOP_ROUTE_URLS.NEW_PLAN + '/' + this.filteredPlans[this.selectedIndex].id.toUpperCase() +
              '/details?' + window.location.href.split('?')[1]);
          }
        }
      }
    })).subscribe();
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (params) {
        if (!!params[SHOP_ROUTE_URLS.PARAMS.REPLACE_PLAN]) {
          this.isReplacePlan = params[SHOP_ROUTE_URLS.PARAMS.REPLACE_PLAN];
        }
        if (!!params[PLANS_SHOP_ROUTE_URLS.PARAMS.PRICE]) {
          this.planPriceParam = Number(params[PLANS_SHOP_ROUTE_URLS.PARAMS.PRICE]);
          this.selectedPrice = this.planPriceParam;
        }
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.allBasePlans && !!changes) {
      this.preparePlans();
    }
  }
  public getSelectedPlan(index, forDesktop?: boolean): void {
    if (!!forDesktop) {
      this.selectedPlan = this.desktopFilteredPlans[index];
    } else {
      this.selectedPlan = this.filteredPlans[index];
    }
  }
  public goToCoverage(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.LANDING_COVERAGE}`]);
  }
  public goToCompatibility(): void {
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`]);
  }
  public goToFaqs(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}`]);
  }
  public goToEbb(): void {
    this.router.navigate([ROUTE_URLS.ACP]);
  }
  public goToPurchasedPlans(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS}`]);

  }

  public addPlanToCart(plan, index, forDesktop?: boolean): void {
    if (!plan?.ebb) {
      this.getSelectedPlan(index, forDesktop);
      if (!!this.isReplacePlan) {
        this.addPlan(this.selectedPlan);
        this.mobilePlansService.setBasePlan(this.selectedPlan);
        this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
      } else {
        if (!!this.currentPlan && !!this.currentPlan.planDevice && this.currentPlan.planDevice.id) {
          this.mobilePlansService.removePhonesFromCart();
          this.mobilePlansService.setPlanExpectedDevice(null);
          this.mobilePlansService.setBasePlan(this.selectedPlan);
          this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
        } else {
          this.checkUser(this.selectedPlan);
        }
      }
    } else {
      this.goToEbb();
    }

  }
  public showDetails(index): void {
    this.cardExpanded[index] = !this.cardExpanded[index];
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
  public toggleActive(questionId, answerId, copy?): void {
    if (this.questionIdParam === questionId && !this.collapsed && !copy) {
      this.questionIdParam = 'q0';
    } else {
      this.questionIdParam = questionId;
      this.collapsed = false;
      this.callRichText(answerId);
    }
    if (!!copy && this.questionIdParam === questionId) {
      const url = window.location.host + this.location.path();
      this.clipboardService.copy(url);
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 1500);
    }
  }
  public priceSelected(item): void {
    this.selectedPrice = item;
  }
  private callRichText(answerId): void {
    this.contentfulService.getRichText('questions', answerId);
  }
  private checkCart(plan: MobilePlanItem): boolean {
    // eslint-disable-next-line eqeqeq
    if (!!this.currentPlan && !!this.currentPlan.cartType && this.currentPlan.cartType != CART_TYPES.NEW_PLAN) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Adding new plan will remove other items in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
        .afterClosed().subscribe((result) => {
          if (!!result) {
            this.clearCart();
            setTimeout(() => {
              this.addPlan(plan);
              sessionStorage.removeItem('planFlow');
              if (!!this.userHasDevice) {
                this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
              } else {
                this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`]);
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
      sessionStorage.removeItem('planFlow');
      if (!!this.userHasDevice) {
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
      } else {
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`]);
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
    if (!this.activationFlow) {
      this.mobilePlansService.setSimCard('');
    }
    this.mobilePlansService.setAutoRenewPlan(true);
    sessionStorage.removeItem('useFromBalance');
    sessionStorage.removeItem('useFromReward');
    sessionStorage.removeItem('removeFromCart');
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
    if (!!this.showCampaignPlan) {
      /* eslint-disable max-len */
      // tslint:disable:max-line-length
      this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId && ((!!plan.specialPromotion && (plan.specialPromotion.utm_source === this.utmSource && !!plan.specialPromotion.isSpecific)) || !plan.isSpecialPromotion) && !plan.ebb);
      const replacedPlans = this.filteredPlans.filter((val) => this.filteredPlans.includes(this.filteredPlans.find((e) => e.details.data === val.details.data && !val.isSpecialPromotion && !!e.isSpecialPromotion))); // get plans that has equal data with the special promo plans
      this.filteredPlans = this.filteredPlans.filter((plan) => !replacedPlans.includes(plan)); // remove plans that has the same data as the promo plan
      this.filteredPlans.sort((a, b) => a.price - b.price);
      this.selectedPlan = this.allBasePlans.find((plan) => !!plan.parentId && !!plan.isSpecialPromotion);
    } else {
      this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId && (!plan.isSpecialPromotion || !!plan.specialPromotion && !plan.specialPromotion.isSpecific));
      const replacedPlans = this.filteredPlans.filter((val) => this.filteredPlans.includes(this.filteredPlans.find((e) => e.details.data === val.details.data && !val.isSpecialPromotion && !!e.isSpecialPromotion))); // get plans that has equal data with the special promo plans
      this.filteredPlans = this.filteredPlans.filter((plan) => !replacedPlans.includes(plan)); // remove plans that has the same data as the promo plan
    }
    this.filteredPlans.sort((a, b) => a.price - b.price);
    this.desktopFilteredPlans.push(...this.filteredPlans);
    // swap the plans to make visually the ebb plan on the second item after the array is sorted
    const lowestPrice = this.desktopFilteredPlans[1];
    const ebbPlan = this.desktopFilteredPlans[0];
    this.desktopFilteredPlans[0] = lowestPrice;
    this.desktopFilteredPlans[1] = ebbPlan;
    this.filteredPlans.map(plan => {
      this.planPrices.push(plan.price);
      if (!!plan.ebb && !this.planPriceParam) {
        this.selectedPrice = plan.price;
      } else if (!!this.planPriceParam) {
        this.selectedPrice = this.planPriceParam;
      }
    });
    this.checkInnerWidth();
  }
  private checkUser(plan: MobilePlanItem): void {
    this.simpleAuthService.userState.pipe(take(1)).subscribe((authState) => {
      const isLoggedIn = !!authState && !authState.isAnonymous;
      if (!isLoggedIn) {
        this.angularFireService.signInAnonymously().then((user) => {
          setTimeout(() => {
            this.checkCart(plan);
          }, 1000);
        });
      } else {
        this.checkCart(plan);
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
      marketingObject.attributes.push({ name: 'vendorID', value: !!this.utms && !!this.utms.vendorID ? this.utms.vendorID : 'goodmobile' });
      this.mobilePlansService.setMarketingObject(marketingObject);
    }
  }
  private checkInnerWidth(): void {
    this.cardExpanded = Array(this.filteredPlans.length).fill(true);
  }
  private getPlansQsts(): void {
    this.contentfulService.getQuestionsByCategoryId('good2goFaqs', 'plans-questions').subscribe(questions => {
      if (!!questions) {
        this.plansQuestions = questions[0].fields.questions;
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = document.documentElement.clientWidth;
  }
}
