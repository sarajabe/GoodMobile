import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CatalogCoreService } from '@ztarmobile/zwp-service-backend-v2';
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
  constructor(private catalogServices: CatalogCoreService,
    private appState: AppState, private toastHelper: ToastrHelperService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.innerWidth = document.documentElement.clientWidth;
    this.getAcpDevices();
  }
  public selectDevice(): void {

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
