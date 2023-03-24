import {ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CART_TYPES, IAcpDevice, IUserPlan, MobileCustomPlansService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { CatalogCoreService } from '@ztarmobile/zwp-service-backend-v2';
import { filter, takeWhile } from 'rxjs/operators';
import { SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import Swiper, { Autoplay, EffectFade, Navigation } from 'swiper';

@Component({
  selector: 'app-acp-devices',
  templateUrl: './acp-devices.component.html',
  styleUrls: ['./acp-devices.component.scss']
})
export class AcpDevicesComponent implements OnInit{
  public acpDevices = [];
  public swiperConfig: any = {
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
  public innerWidth;
  public hasAcpPlan = false;
  public acpPlan: IUserPlan;
  private alive = true;
  constructor(private catalogServices: CatalogCoreService,
    private appState: AppState, private toastHelper: ToastrHelperService,
    private cd: ChangeDetectorRef, private userPlansService: UserPlansService, private mobilePlansService: MobileCustomPlansService, private router: Router) { 
      this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
        this.acpPlan = plans.find((p) => p.mdn && !p.portInRequestNumber && !!p.basePlan.ebb);
        this.hasAcpPlan = !!this.acpPlan ? true : false;
      });
    }

  ngOnInit(): void {
    this.innerWidth = document.documentElement.clientWidth;
    this.getAcpDevices();
  }
  ngOnDestroy(): void {
      this.alive = false;
  }
  public selectDevice(item): void {
    if (!!this.hasAcpPlan) {
      const selectedDevice: IAcpDevice = {id: item?.id, deviceMake: item?.fields?.deviceMake, deviceModel: item?.fields?.deviceModel, sku: item?.fields?.sku, modelId: item?.fields?.modelId, marketValue: parseFloat(item?.fields?.marketValue), price: parseFloat(item?.fields?.price), modelNumber: item?.fields?.modelNumber, typeId: item?.fields?.typeId, imgUrl: item?.fields?.deviceImg?.fields.file.url, title: item?.fields?.deviceMake + ' ' + item?.fields?.deviceModel}
      this.mobilePlansService.setActivePlanId(this.acpPlan.id);
      this.mobilePlansService.setAcpDevice(selectedDevice);
      this.mobilePlansService.setCartType(CART_TYPES.GENERIC_CART);
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    }

  }
  private createSwiper(): void {
    const swiper = new Swiper('.acp-devices', {
      // Enable lazy loading
      lazy: true,
      preloadImages: true,
      modules: [Navigation, EffectFade, Autoplay],
      hashNavigation: true,
      autoplay: {
        delay: 10000,
        stopOnLastSlide: false,
        disableOnInteraction: true,
      },
      ...this.swiperConfig
    });
    this.cd.detectChanges();
    setTimeout(() => {
      swiper.update();
    }, 200);
  }
  private getAcpDevices(): void {
    this.appState.loading = true;
    this.catalogServices.getAcpDevicesFromContentful().then(res => {
      if (!!res) {
        this.appState.loading = false;
        this.acpDevices = res;
        this.cd.detectChanges();
        if(this.innerWidth < 800) {
          this.createSwiper();
        }
      }
    }, error => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.error.message);
    })
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = document.documentElement.clientWidth;
    this.cd.detectChanges();
    if(this.innerWidth < 800) {
      this.createSwiper();
    }
  }
}
