import { Component, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FadeInOutAnimation } from '../../../app/app.animations';
import {
  IUserPlan, UserPlansService, IPhoneDetails, IPhoneProduct,
  FirebaseUserProfileService, ActionsAnalyticsService, ICatalogItem
} from '@ztarmobile/zwp-service-backend';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { AppState } from '../../app.service';
import { MetaService } from '../../../services/meta-service.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { takeWhile, combineLatest, take } from 'rxjs/operators';
import { SHOP_ROUTE_URLS, ROUTE_URLS, ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, PHONES_SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { ContentfulService } from 'src/services/contentful.service';

@Component({
  selector: 'app-checkout-results',
  templateUrl: './checkout-results.component.html',
  styleUrls: ['./checkout-results.component.scss'],
  animations: [FadeInOutAnimation]
})
export class CheckoutResultsComponent implements OnDestroy {
  public selectedUserPlan: IUserPlan;
  public userPlanId: string;
  public isChangePlanSummary = false;
  public nextCycle = false;
  public trustedUrl;
  public isPlanAddon = false;
  public isOrderSim = false;
  public isStorePickup = false;
  public purchasedPlanId: string;
  public purchasedPlan: IUserPlan;
  public isMoneySavingReferral: boolean;
  public utmContent: string;
  public phone: IPhoneDetails;
  public selectedProduct: IPhoneProduct;
  public deviceImageURL: string;
  public user: IUser;
  public isSuccessfulMultiplePurchases: string;
  public isPhoneOnly = false;
  public purchasedPhone: any;
  public phoneImageLink: string;
  private alive = true;
  orderId: any;
  constructor(private route: ActivatedRoute, private router: Router, private userPlansService: UserPlansService, private appState: AppState,
              private metaService: MetaService, private modalHelper: ModalHelperService, private userProfileService: FirebaseUserProfileService,
              private analyticsService: ActionsAnalyticsService, private contentful: ContentfulService) {
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);
    // this.appState.clearSessionStorage();
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
      this.isStorePickup = !!storePickup? true: false;
      this.isOrderSim = orderSimParam === 'true' || orderSimParam === 'false';
      const successfulPurchases = params[SHOP_ROUTE_URLS.PARAMS.SUCCESSFUL_PURCHASE];
      this.isSuccessfulMultiplePurchases = successfulPurchases;
      this.orderId = params[ROUTE_URLS.PARAMS.USER_ORDER_ID];
      if (params[ROUTE_URLS.PARAMS.PHONE_PURCHASE]) {
        this.isPhoneOnly = true;
      }
      if (this.isChangePlanSummary && !this.selectedUserPlan.mdn) {
        this.goToAccountSummary();
      }
     
      const planID = !!this.userPlanId ? this.userPlanId : this.purchasedPlanId;
      if (!!planID) {
        setTimeout(() => {
            this.appState.loading = true;
          this.userPlansService.getUserPlan(planID).then((plan) => {
            this.purchasedPlan = plan;
            this.appState.loading = false;
            if (!!this.purchasedPlan?.phones) {
              const allPhones = Object.values(this.purchasedPlan.phones);
              // if the phone was with active mdn, then the phones property will have all associated phones that purchased previously with that mdn so I filter to get the phone with the specified order id
              this.purchasedPhone = allPhones.find((phone) => phone.orderId === this.orderId);
              this.purchasedPlan.associatedPhones = !!this.purchasedPlan.associatedPhones ? this.purchasedPlan.associatedPhones : [];
              this.purchasedPlan.associatedPhones.push(this.purchasedPhone);
              this.purchasedPlan.phonePurchaseDate = new Date();
              this.userPlansService.updateUserPlan(this.purchasedPlan.userId, this.purchasedPlan);
              if (!!this.purchasedPhone) {
                this.contentful.getPhoneImgBySku('sku', this.purchasedPhone.sku).pipe(take(1)).subscribe((finishID) => {
                  if (!!finishID) {
                    this.contentful.getPhoneImg('finishes', finishID).pipe(take(1)).subscribe((src) => {
                      if (!!src) {
                        this.phoneImageLink = src.imageUrl;
                      }
                    });
                  }
                });
              }
            }
          });
        }, 200);
        }
    })).subscribe();
    this.appState.loading = false;
    this.appState.isMoneySavingProCampaign.pipe(takeWhile(() => this.alive)).subscribe((result) => {
      if (!!result) {
        this.isMoneySavingReferral = true;
        this.utmContent = sessionStorage.getItem('MoneyProContent');
        this.trustedUrl = 'https://services.moneysavingpro.com/v1/conversion/?pid=834&cid=' + this.utmContent;
        this.analyticsService.trackMoneySavingProClick(this.utmContent);
        sessionStorage.setItem('MoneyProReferral', 'false');
        sessionStorage.removeItem('MoneyProContent');
      } else {
        this.isMoneySavingReferral = false;
      }
    });
    this.metaService.createCanonicalUrl();
    setTimeout(() => {
      this.appState.clearSessionStorage();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.alive = false;
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

  public goToPhones(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.SELECTED_PLAN] = this.purchasedPlanId;
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`, params]);
  }

  public domainFromUrl(url): string {
    let result;
    if (!!url) {
      let match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im);
      if (!!match) {
        result = match[1];
        match = result.match(/^[^\.]+\.(.+\..+)$/);
        if (!!match) {
          result = match[1];
        }
      }
      return result;
    }
    return '';
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('purchased', 'true');
  }
}
