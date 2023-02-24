import { Component, OnInit, AfterViewInit,HostListener } from '@angular/core';
import { IBasePlan, MobilePlanItem, PlansConfigurationService } from '@ztarmobile/zwp-service-backend';
import { FadeInOutAnimation } from '../../app/app.animations';
import { Options } from 'ng5-slider';
import { take } from 'rxjs/operators'
import { Router } from '@angular/router';
import { SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app/app.routes.names';
import Swiper, { Autoplay, EffectFade, Keyboard, Mousewheel, Navigation } from 'swiper';

@Component({
  selector: 'app-featured-plans',
  templateUrl: './featured-plans.component.html',
  styleUrls: ['./featured-plans.component.scss'],
  animations: [FadeInOutAnimation]
})
export class FeaturedPlansComponent implements OnInit, AfterViewInit{
  public featuredPlans: IBasePlan[];
  public innerWidth: any;
  public config: any = {
    slidesPerView: 1,
    slidesPerColumn: 1,
    direction: 'horizontal',
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    centeredSlides: true,
    observer: true ,
    observeParents: true,
    speed: 1000,
    spaceBetween: 0,
    loop: false
    };
  public plans: Array<MobilePlanItem>;
  public value: any;
  public options: Options;
  private allBasePlans: Array<IBasePlan>;

  constructor(private plansConfigurationService: PlansConfigurationService, private router: Router) {
    this.plansConfigurationService.planConfiguration.pipe(take(1)).subscribe((conf) => {
      this.allBasePlans = conf.allPlans;
      this.featuredPlans = this.allBasePlans.filter((plan) => plan.featured && !plan.archived );
      this.featuredPlans.forEach(plan => {
        if (!!plan.specialPromotion && !!plan.specialPromotion.promotionDiscount) {
          const discountAmountValue = plan.specialPromotion.promotionDiscount.split('%')[0];
          const discountValue = parseInt(discountAmountValue, 10);
          const total = (plan.price - plan.promoPrice) * (discountValue/100);
          plan.priceAfterSpecialPromoDiscount = total;
        }
        else {
          plan.priceAfterSpecialPromoDiscount = plan.price - plan.promoPrice;
        }
      })
      this.featuredPlans.sort((a, b) => a.price - b.price);
    });
  }
  ngOnInit(): void {
    this.innerWidth = document.documentElement.clientWidth;

  }
  ngAfterViewInit(): void {
    this.createSwiper();
  }  
  public createSwiper(): void {
    const swiper = new Swiper('.swiper-container', {
      hashNavigation: true,
      modules: [Navigation, EffectFade, Keyboard, Autoplay, Mousewheel],
      autoplay:{
        delay: 8000, // 8 seconds
        disableOnInteraction: false
      },
      ...this.config
    });
  }

  public viewAllPlans() {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = document.documentElement.clientWidth;
      this.createSwiper();
  }
}

