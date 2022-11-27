import { Observable } from 'rxjs';
import { Component, OnDestroy, AfterViewInit, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ICategoryPhone, IShopCategory } from '@ztarmobile/zwp-service-backend';
import { FadeInOutAnimation } from '../../../../app/app.animations';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ContentfulService } from '../../../../services/contentful.service';
import { MetaService } from '../../../../services/meta-service.service';
import { takeWhile } from 'rxjs/operators';
import { PHONES_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from '../../../app.routes.names';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  animations: [FadeInOutAnimation]
})
export class ModelComponent implements OnDestroy, AfterViewInit, OnInit {
  public OUT_OF_STOCK = 'out of stock';
  public phoneModel = [];
  public categoryId: string;
  public phones: Array<ICategoryPhone>;
  public category: IShopCategory;
  public config: SwiperConfigInterface = {};
  public CATEGORIES = {
    apple_ID: "Apple iPhones",
    googlePixel_ID: "Google Pixels"
  }
  private userPlanId: string;
  private referencePage: string;
  private isChangePhone = false;
  private updatePlan: boolean;
  private selectedPlanId: string;
  private alive = true;

  constructor(private router: Router, private metaService: MetaService, private route: ActivatedRoute,
              private contentful: ContentfulService) {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (params) {
        if (!!params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
          this.userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
        }
        if (!!params[ROUTE_URLS.PARAMS.UPDATE_PLAN]) {
          this.updatePlan = params[ROUTE_URLS.PARAMS.UPDATE_PLAN];
        }
        if (!!params[ROUTE_URLS.PARAMS.REFERENCE_PAGE]) {
          this.referencePage = params[ROUTE_URLS.PARAMS.REFERENCE_PAGE];
        }
        if (!!params[ROUTE_URLS.PARAMS.SELECTED_PLAN]) {
          this.selectedPlanId = params[ROUTE_URLS.PARAMS.SELECTED_PLAN];
        }
        if (!!params[PHONES_SHOP_ROUTE_URLS.PARAMS.CHANGE_PHONE]){
          this.isChangePhone = true;
        }

      } else {
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}`]);
      }

    });
  }
  ngOnInit(): void {
    this.metaService.createCanonicalUrl('', true);
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    this.contentful.getphoneTypes('phoneModel', this.categoryId).subscribe((phones) => {
      phones.forEach((phone) => {
        let index;
        index = this.getPhoneOrder(phone);
        this.phoneModel[index] = phone;
      });
    });
  }
  ngAfterViewInit(): void {
    this.slideChanged();
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public goToPhoneType(): void {
    const params = {};
    if (!!this.userPlanId) {
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
    }
    if (!!this.updatePlan) {
      params[ROUTE_URLS.PARAMS.UPDATE_PLAN] = true;
    }
    if (!!params[ROUTE_URLS.PARAMS.REFERENCE_PAGE]) {
      params[ROUTE_URLS.PARAMS.REFERENCE_PAGE] = this.referencePage;
    }
    if (!!this.selectedPlanId) {
      params[ROUTE_URLS.PARAMS.SELECTED_PLAN] = this.selectedPlanId;
    }
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}`, params]);
  }

  public viewPhoneDetails(phoneKey, availability): void {
    if (availability !== this.OUT_OF_STOCK) {
      const params = {};
      params[ROUTE_URLS.PARAMS.PHONE_ID] = phoneKey;
      params[ROUTE_URLS.PARAMS.CATEGORY_ID] = this.categoryId;
      if (this.userPlanId) {
        params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
      }
      if (this.updatePlan) {
        params[ROUTE_URLS.PARAMS.UPDATE_PLAN] = true;
      }
      if (!!this.referencePage) {
        params[ROUTE_URLS.PARAMS.REFERENCE_PAGE] = this.referencePage;
      }
      if (!!this.selectedPlanId) {
        params[ROUTE_URLS.PARAMS.SELECTED_PLAN] = this.selectedPlanId;
      }
      if (!!this.isChangePhone) {
        params[PHONES_SHOP_ROUTE_URLS.PARAMS.CHANGE_PHONE] = true;
      }
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.DETAILS}`, params]);
    }
  }
  public slideChanged(): void {
    this.config = {
      effect: 'flip',
      centeredSlides: true,
      observer: true,
      speed: 600,
      autoplay: {
        delay: 10000, // 10 seconds
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      mousewheel: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    };
  }

  public goToPhonesPage(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`]);
  }
  private getPhoneOrder(phone): any {
    const order = phone.fields.orderNumber;
    return order;
  }
}
