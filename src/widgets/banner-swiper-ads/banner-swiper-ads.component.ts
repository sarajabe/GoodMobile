import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { IBannerSwiperAdsConfig } from './banner-swiper-ads';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { IFirebaseBannerSlide } from '@ztarmobile/zwp-service-backend';

@Component({
  selector: 'app-banner-swiper-ads',
  templateUrl: './banner-swiper-ads.component.html',
  styleUrls: ['./banner-swiper-ads.component.scss']
})
export class BannerSwiperAdsComponent implements AfterViewInit, OnInit {
  @Input() isLoggedIn: boolean;
  @Input() settings: IBannerSwiperAdsConfig;
  @Output() bannerRendered: EventEmitter<boolean> = new EventEmitter<boolean>();

  public state: string = 'in';
  public isShowingModal: boolean = false;
  public swiperConfig: SwiperConfigInterface = {};
  public isBannersReady: boolean = false;

  public banners: IFirebaseBannerSlide[] = [];
  public mobileBanner: IFirebaseBannerSlide;

  constructor() {
  }

  ngOnInit(): void {
    this.banners = this.settings.banners.filter((banner) => !banner.mobileBanner);
    this.mobileBanner = this.settings.banners.find((banner) => !!banner.mobileBanner);
  }

  ngAfterViewInit(): void {
    this.slideChanged();
  }

  public bannerContentWidthFromTheme(): string {
    if (this.settings.gridTheme) {
      return this.settings.gridTheme;
    } else {
      switch (this.settings.theme) {
        case 'theme-hero':
          return 'seven';
        case 'theme-freds':
          return 'eight';
        case 'theme-g2g':
          return 'five offset-three';
        default:
          return 'seven';
      }
    }
  }

  public slideChanged(): void {
    this.isBannersReady = false;
    this.swiperConfig = {
      centeredSlides: true,
      autoplay: {
        delay: 10000, // 10 seconds
        disableOnInteraction: false
      },
      speed: 1000,
      direction: 'horizontal',
      slidesPerView: 1,
      keyboard: true,
      effect: this.settings.effect ? this.settings.effect : 'slide',
      navigation: {
        nextEl: '.slider-next-button',
        prevEl: '.slider-prev-button'
      },
      pagination: {
        el: '.slider-pagination',
        renderBullet: (index, className) => {
          return `<li style="z-index: 10" class="slick-active ${className}"><button ></button></li>`;
        },
        clickable: true
      },
      loop: true,
      zoom: {
        toggle: false
      },
      setWrapperSize: true
    };

    setTimeout(() => {
      this.isBannersReady = true;
      this.bannerRendered.emit(true);
    }, 1500);
  }

  public responsiveBgImages(defaultImgUrl, responsiveImages): any {
    if (!!responsiveImages) {
      return {
        'background-image': `-webkit-image-set(
          url('${responsiveImages.small}') 300w,
          url('${responsiveImages.medium}') 1024w,
          url('${responsiveImages.large}') 1320w
      )`,
        'color': 'red'
      };
    } else {
      return {
        'background-image': `url('${defaultImgUrl}')`
      };
    }
  }
}