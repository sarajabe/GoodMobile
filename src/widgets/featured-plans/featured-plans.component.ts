import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { IBasePlan, MobilePlanItem, PlansConfigurationService } from '@ztarmobile/zwp-service-backend';
import { FadeInOutAnimation } from '../../app/app.animations';
import { Options } from 'ng5-slider';
import { take } from 'rxjs/operators'
import { Router } from '@angular/router';
import { SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app/app.routes.names';

@Component({
  selector: 'app-featured-plans',
  templateUrl: './featured-plans.component.html',
  styleUrls: ['./featured-plans.component.scss'],
  animations: [FadeInOutAnimation]
})
export class FeaturedPlansComponent implements OnInit {
  public featuredPlans: IBasePlan[];
  public responsiveFeaturedPlans: IBasePlan[];
  public innerWidth: any;
  public plans: Array<MobilePlanItem>;
  public value: any;
  public options: Options;
  public planPrices = [];
  public selectedPrice: number;

  private allBasePlans: Array<IBasePlan>;

  constructor(private plansConfigurationService: PlansConfigurationService, private router: Router,
    private cd: ChangeDetectorRef) {
    this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((conf) => {
      this.allBasePlans = conf.allPlans;
      this.featuredPlans = this.allBasePlans.filter((plan) => plan.featured && !plan.archived);
      this.responsiveFeaturedPlans = this.allBasePlans.filter((plan) => !!plan.parentId && !plan.archived);
      this.checkSpecialPromotionPrices(this.featuredPlans);
      this.checkSpecialPromotionPrices(this.responsiveFeaturedPlans);
      this.responsiveFeaturedPlans.map(plan => {
        this.planPrices.push(plan.price);
        if (!!plan.ebb) {
          this.selectedPrice = plan.price;
        }
      });
    });
  }

  ngOnInit(): void {
    this.innerWidth = document.documentElement.clientWidth;
  }

  public priceSelected(item): void {
    this.selectedPrice = item;
  }

  public viewAllPlans(planPrice?: any) {
    if (!!planPrice) {
      const params = {};
      params[PLANS_SHOP_ROUTE_URLS.PARAMS.PRICE] = planPrice;
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`, params]);
    } else {
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
    }
  }

  private checkSpecialPromotionPrices(arr: IBasePlan[]): void {
    arr.forEach(plan => {
      if (!!plan.specialPromotion && !!plan.specialPromotion.promotionDiscount) {
        const discountAmountValue = plan.specialPromotion.promotionDiscount.split('%')[0];
        const discountValue = parseInt(discountAmountValue, 10);
        const total = (plan.price - plan.promoPrice) * (discountValue / 100);
        plan.priceAfterSpecialPromoDiscount = total;
      }
      else {
        plan.priceAfterSpecialPromoDiscount = plan.price - plan.promoPrice;
      }
    })
    arr.sort((a, b) => a.price - b.price);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = document.documentElement.clientWidth;
  }
}

