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
      this.featuredPlans.forEach(plan => {
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
      this.featuredPlans.sort((a, b) => a.price - b.price);
      this.featuredPlans.map(plan => {
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

  public viewAllPlans() {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = document.documentElement.clientWidth;
  }
}

