import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import Swiper, { Autoplay, EffectFade, Navigation } from 'swiper';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  public showPromoBanner = false;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public ROUTE_URLS = ROUTE_URLS;
  public index = 0;
  public bannerSwiperConfig: any = {
    centeredSlides: true,
    speed: 1000,
    direction: 'horizontal',
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    observeParents: true,
    observer: true,
    zoom: {
      toggle: false
    },
    setWrapperSize: false,
    loop: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  };
  constructor(private router: Router) {
  }
  ngOnInit(): void {
    let swiper = new Swiper('.banners', {
      // Enable lazy loading
      lazy: true,
      preloadImages: true,
      mousewheel: false,
      modules: [Navigation, EffectFade, Autoplay],
      hashNavigation: true,
      autoplay: {
        delay: 10000,
        stopOnLastSlide: false,
        disableOnInteraction: true,
      },
      preventClicks: false,
      preventClicksPropagation: false,
      ...this.bannerSwiperConfig
    });
  }

  public goToplanDetails(id): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PLANS_SHOP_ROUTE_URLS.BASE}/${id}/${PLANS_SHOP_ROUTE_URLS.DETAILS}`]);
  }
}
