import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CART_TYPES, CustomizableMobilePlan, FirebaseUserProfileService, IAcpDevice, IUserPlan, MobileCustomPlansService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { CatalogCoreService } from '@ztarmobile/zwp-service-backend-v2';
import { filter, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import Swiper, { Autoplay, EffectFade, Navigation } from 'swiper';

@Component({
  selector: 'app-acp-devices',
  templateUrl: './acp-devices.component.html',
  styleUrls: ['./acp-devices.component.scss']
})
export class AcpDevicesComponent implements OnInit {
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

  private pendingAcpPlan: IUserPlan;
  private alive = true;
  changeDevice: boolean;
  cart: CustomizableMobilePlan;

  constructor(private catalogServices: CatalogCoreService,
    private appState: AppState, private toastHelper: ToastrHelperService, private route: ActivatedRoute,
    private cd: ChangeDetectorRef, private userPlansService: UserPlansService, private mobilePlansService: MobileCustomPlansService, private router: Router,
    private userProfileService: FirebaseUserProfileService, private modalHelper: ModalHelperService) {
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
      this.acpPlan = plans.find((p) => p.mdn && !p.portInRequestNumber && !!p.basePlan.ebb);
      this.pendingAcpPlan = plans.find((p) => !p.mdn && !p.portInRequestNumber && !!p.basePlan.ebb);
      this.hasAcpPlan = !!this.acpPlan ? true : false;
    });
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[SHOP_ROUTE_URLS.PARAMS.CHANGE_DEVICE]) {
        this.changeDevice = true;
      } else {
        this.changeDevice = false;
      }
    });
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.cart = plan;
    });
  }

  ngOnInit(): void {
    this.innerWidth = document.documentElement.clientWidth;
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      if (!!user) {
        if (!user.ebbId) { this.showNoAcpDevicePopup(); }
        else if (!!user.ebbId) {
          if (!!this.pendingAcpPlan) {
            //pending acp plan
            this.showPendingAcpDevicePopup();
          } else if (!this.hasAcpPlan && !this.pendingAcpPlan) {
            this.showNoAcpDevicePopup();
          }
        }
      }
    });
    this.getAcpDevices();
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public selectDevice(item): void {
    if (!!this.hasAcpPlan) {
      if (this.cart && this.cart.cartType !== CART_TYPES.GENERIC_CART) {
        this.modalHelper.showConfirmMessageModal('Clear Cart', 'Adding new plan will remove other items in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
        .afterClosed().subscribe((result) => {
          if (!!result) {
            this.clearCart();
            setTimeout(() => {
              this.addDeviceToCart(item);
            }, 500);
          }
        });
      } else {
        this.addDeviceToCart(item);
      }
    }

  }
  private clearCart(): void {
    this.appState.clearSessionStorage();
    this.mobilePlansService.clearUserCart();
  }
  private addDeviceToCart(item): void {
    const selectedDevice: IAcpDevice = { id: item?.id, deviceMake: item?.fields?.deviceMake, deviceModel: item?.fields?.deviceModel, sku: item?.fields?.sku, modelId: item?.fields?.modelId, marketValue: parseFloat(item?.fields?.marketValue), price: parseFloat(item?.fields?.price), modelNumber: item?.fields?.modelNumber, typeId: item?.fields?.typeId, imgUrl: item?.fields?.deviceImg?.fields.file.url, title: item?.fields?.deviceMake + ' ' + item?.fields?.deviceModel }
    this.mobilePlansService.setActivePlanId(this.acpPlan.id);
    this.mobilePlansService.setAcpDevice(selectedDevice);
    this.mobilePlansService.setCartType(CART_TYPES.GENERIC_CART);
    this.mobilePlansService.setPlanDevice(null);
    if (!!this.changeDevice) {
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`]);
    } else {
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
        if (this.innerWidth < 800) {
          this.createSwiper();
        }
      }
    }, error => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.error.message);
    })
  }
  private showNoAcpDevicePopup(): void {
    const customHTML = `
    <p class="acp-desc">To get your ACP device benefits, you should 
    <b>enroll</b> and <b>activate</b> your <b>ACP plan</b> first!<p>`;
    this.modalHelper.showACPModal('Looking for ACP device benefits?', customHTML, 'Get ACP Now!', null, 'acp-device-modal', true).afterClosed().subscribe((data) => {
      if (!!data) {
        this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
      } else {
        this.router.navigate([ROUTE_URLS.HOME]);
      }
    });
  }
  private showPendingAcpDevicePopup(): void {
    const customHTML = `
    <p class="acp-desc">Once your ACP plan is <b>activated</b>, you <b>will be able 
    to get</b> your ACP device benefits.<p>`;
    this.modalHelper.showACPModal('ACP Device Discount', customHTML, 'ACP Summary', null, 'acp-device-modal', true).afterClosed().subscribe((data) => {
      if (!!data) {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`]);
      } else {
        this.router.navigate([ROUTE_URLS.HOME]);
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = document.documentElement.clientWidth;
    this.cd.detectChanges();
    if (this.innerWidth < 800) {
      this.createSwiper();
    }
  }
}
