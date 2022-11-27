import { Component, OnInit, AfterViewInit, OnDestroy, Input, HostListener } from '@angular/core';
import { IBasePlan, MobilePlanItem, PlansConfigurationService } from '@ztarmobile/zwp-service-backend';
import { FadeInOutAnimation } from '../../app/app.animations';
import { Options, ChangeContext } from 'ng5-slider';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators'
import { Router } from '@angular/router';
import { LOGIN_ROUTE_URLS, SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app/app.routes.names';

@Component({
  selector: 'app-featured-plans',
  templateUrl: './featured-plans.component.html',
  styleUrls: ['./featured-plans.component.scss'],
  animations: [FadeInOutAnimation]
})
export class FeaturedPlansComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() isPromo: boolean;
  public featuredPlans: IBasePlan[];
  public state: string = 'in';
  public innerWidth: any;
  public config: SwiperConfigInterface = {};
  public plans: Array<MobilePlanItem>;
  public selectedPlan: MobilePlanItem;
  value: any;
  options: Options;
  public steps = [];
  public isHidden: boolean = true;
  public selectedIndex: any = 0;
  public showPromoPlan: boolean = false;
  private basePlansObserver: Subscription;
  private allBasePlans: Array<IBasePlan>;
  private alive: boolean = true;

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
  ngAfterViewInit(): void {
    this.slideChanged();
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }
  public slideChanged(): void {
    this.config = {
      slidesPerView: 1,
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
      speed: 1000,
      roundLengths:true,
      autoplay:{
        delay: 8000, // 8 seconds
        disableOnInteraction: false
      },
      pagination: {
        el: '.slider-pagination',
        renderBullet: (index, className) => {
          return `<li style="z-index: 10" class="slick-active ${className}"><button ></button></li>`;
        },
        clickable: true
      },
    };
 }
  ngOnDestroy(): void{
    if (!!this.basePlansObserver) {
      this.basePlansObserver.unsubscribe();
    }
    this.alive = false;
  }
  public onUserChange(changeContext: ChangeContext): void {
    this.getSelectedPlan(changeContext.value);
  }
  public getSelectedPlan(index): void {
    this.selectedPlan = this.plans[index];
  }
  public signUp(): void{
    this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.SIGN_UP}`]);
  }

  public goToPlans(selectedPlan: MobilePlanItem) {
    let id = selectedPlan.id;
    if (id.includes('GOOD2GO-6GB-35')) {
      id = 'GOOD2GO-MDG-6GB-30';
    }
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PLANS_SHOP_ROUTE_URLS.BASE}/${id}/${PLANS_SHOP_ROUTE_URLS.DETAILS}`]);
  }
  public viewAllPlans() {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}`]);
  }

  public showNextSlide(index: any): void {
    if (this.selectedIndex < (this.featuredPlans.length - 1)) {
      this.selectedIndex = this.selectedIndex + 1;
    } else {
      this.selectedIndex = 0;
    }
  }
  public showPrevSlide(index: any): void {
    if (this.selectedIndex == 0) {
      this.selectedIndex = this.featuredPlans.length - 1;
    } else {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}

