import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CART_TYPES, CustomizableMobilePlan, FirebaseUserProfileService, IAcpDevice, IUserPlan, MobileCustomPlansService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { CatalogCoreService, EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { ClipboardService } from 'ngx-clipboard';
import { filter, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS, LOGIN_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ContentfulService } from 'src/services/contentful.service';
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
  public collapsed: boolean;
  public catalogPhoneQsts;
  private pendingAcpPlan: IUserPlan;
  private alive = true;
  private changeDevice: boolean;
  private cart: CustomizableMobilePlan;
  private isLoggedIn = false;
  questionIdParam: any;
  isCopied: boolean;
  canPurchaseDevice: any;
  nextEnrollmentTryDate: Date;
  user: import("@ztarmobile/zwp-service-backend").IUser;

  constructor(private catalogServices: CatalogCoreService, private contentfulService: ContentfulService, private clipboardService: ClipboardService,
    private appState: AppState, private toastHelper: ToastrHelperService, private route: ActivatedRoute, private location: Location,
    private cd: ChangeDetectorRef, private userPlansService: UserPlansService, private mobilePlansService: MobileCustomPlansService, private router: Router,
    private userProfileService: FirebaseUserProfileService, private modalHelper: ModalHelperService, private simpleAuthService: SimpleAuthService,
    private ebbService: EbbService) {
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
      this.acpPlan = plans.find((p) => p.mdn && !p.portInRequestNumber && !!p.basePlan.ebb && !p.canceled);
      this.pendingAcpPlan = plans.find((p) => !p.mdn && !p.portInRequestNumber && !!p.basePlan.ebb);
      this.hasAcpPlan = !!this.acpPlan ? true : false;
    });
    this.contentfulService.getQuestionsByCategoryId('good2goFaqs', 'device-catalog').subscribe(questions => {
      if (!!questions) {
        const allQuestions = questions[0].fields.questions;
        this.catalogPhoneQsts = allQuestions;
      }
    });
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((authState) => {
      this.isLoggedIn = !!authState && !authState.isAnonymous;
      if (!!this.isLoggedIn) {
        this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => {
          this.user = user;
        });
      }
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
    if (!!this.isLoggedIn) {
      const deviceItem = JSON.parse(sessionStorage.getItem('acp-device'));
      if (!!deviceItem) {
        this.checkSelectDeviceBehavior(deviceItem);
      }
    }
    this.getAcpDevices();
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public selectDevice(item): void {
    if (!!this.isLoggedIn) {
      this.checkSelectDeviceBehavior(item);
    } else {
      sessionStorage.setItem('acp-device', JSON.stringify(item));
      const params = {};
      params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE] = `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.ACP_DEVICES}`;
      this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.LOGIN}`, params]);
    }
  }
  public toggleActive(questionId, answerId, copy?): void {
    if (this.questionIdParam === questionId && !this.collapsed && !copy) {
      this.questionIdParam = 'q0';
    } else {
      this.questionIdParam = questionId;
      this.collapsed = false;
      this.callRichText(answerId);
    }
    if (!!copy && this.questionIdParam === questionId){
      const url = window.location.host + this.location.path();
      this.clipboardService.copy(url);
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 1500);
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
    this.removeAcpDevice();
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
        this.removeAcpDevice();
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
        this.removeAcpDevice();
      }
    });
  }
  private showExistingAcpDevicePopup(): void {
    const customHTML = `
    <p class="acp-desc max">Our records show that you have claimed your <b>one-time</b> device discount. </p><p class="acp-desc">If this is not correct, please contact customer care for more help.</p>`;
    this.modalHelper.showACPModal(`You've Claimed your Discount!`, customHTML, 'Got it!', null, 'acp-device-modal', true).afterClosed().subscribe((data) => {
      if (!!data) {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`]);
      }
    });
  }
  private showAcpDevicePopupForNextCycle(): void {
    const customHTML = `
    <p class="acp-desc">You may be eligible for ACP device discount <b>on your next plan renewal date.</b> Please check again later!</p>`;
    this.modalHelper.showACPModal(`ACP Device Discount`, customHTML, 'Got it!', null, 'acp-device-modal', true).afterClosed().subscribe((data) => {
      if (!!data) {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`]);
      }
    });
  }
  private checkSelectDeviceBehavior(item): void {
    if (!!this.user) {
      if (!this.user.ebbId) { this.showNoAcpDevicePopup(); }
      else if (!!this.user.ebbId) {
        if (!!this.pendingAcpPlan) {
          //pending acp plan
          this.showPendingAcpDevicePopup();
        } else if (!this.hasAcpPlan && !this.pendingAcpPlan) {
          this.showNoAcpDevicePopup();
        } else if (!!this.hasAcpPlan) {
          this.appState.loading = true;
          this.ebbService.getDeviceEligibility(this.user.ebbId).then((data) => {
            this.appState.loading = false;
            this.canPurchaseDevice = data.canPurchaseADevice;
            this.nextEnrollmentTryDate = !!data.nextEnrollmentTryDate ? new Date(data.nextEnrollmentTryDate): null;
            if (!!this.canPurchaseDevice) {
              if (!!this.cart && !!this.cart.cartType && this.cart.cartType !== CART_TYPES.GENERIC_CART) {
                this.modalHelper.showConfirmMessageModal('Clear Cart', 'Adding new device will remove other items in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
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
            } else {
              console.info('nextenroll ', this.nextEnrollmentTryDate)
              if (!this.canPurchaseDevice && !!this.nextEnrollmentTryDate) {
                this.showAcpDevicePopupForNextCycle()
              } else {
                this.showExistingAcpDevicePopup();
              }
            }
          }, (error) => {
            this.appState.loading = false;
            this.canPurchaseDevice = false;
          });
        }
      }
    }
  }
  private removeAcpDevice(): void {
    sessionStorage.removeItem('acp-device');
  }

  private callRichText(answerId): void {
    this.contentfulService.getRichText('questions', answerId);
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
