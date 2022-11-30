
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  FirebaseUserProfileService, IAddress, IFirebaseAddress, IShippingMethod, IUser,
  ShippingConfigurationService, AccountPaymentService, ActionsAnalyticsService, CustomizableMobilePlan, CART_TYPES
} from '@ztarmobile/zwp-service-backend';
import { FadeInOutAnimation } from '../../../app.animations';
import { Router } from '@angular/router';
import { CheckoutService } from '../checkout.service';
import { IFlowIndicator, FLOW_STEPS_IDS } from '../flow-indicator/flow-indicator';
import { ShippingService } from '@ztarmobile/zwp-service-backend';
import { AppState } from '../../../app.service';
import { MetaService } from '../../../../services/meta-service.service';
import { INVISIBLE_CAPTCHA_ID } from '../../../../environments/environment';
import { ModalHelperService } from '../../../../services/modal-helper.service';
import { takeWhile } from 'rxjs/operators';
import { CHECKOUT_ROUTE_URLS, SHOP_ROUTE_URLS } from '../../../app.routes.names';
import { ToastrHelperService } from '../../../../services/toast-helper.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PageScrollService } from 'ngx-page-scroll-core';

@Component({
  selector: 'app-shipping-address-subpage',
  templateUrl: './shipping-address-subpage.component.html',
  styleUrls: ['./shipping-address-subpage.component.scss'],
  animations: [FadeInOutAnimation]
})
export class ShippingAddressSubpageComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('shippingMethodForm') shippingMethodForm: NgForm;
  @ViewChild('packageForm') packageForm: NgForm;
  @Input() isLoggedIn: boolean;
  public total = 0;
  public shippingMethodItems = true;
  public showAllAddresses = false;
  public cartSubscription: Subscription;
  public cart: CustomizableMobilePlan;
  public flowSettings: IFlowIndicator;
  public shippingMethods: IShippingMethod[];
  public shippingDeliveryService = [];
  public shippingDeliveryOptions = [];
  public selectedShippingServiceOption ='';
  public orderShippingMethod: IShippingMethod;
  public shippingServiceType = '';
  public addressesList: Array<IFirebaseAddress> = [];
  public selectedShippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public shippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public newSimOrder: { price: number, id?: string };
  public simPrice: number;
  public simId: string;
  public isValidAddress: boolean;
  public user: IUser;
  public storedShippingId: string;
  public showShippingForm = false;
  public customHtml: string;
  public customHtml2: string;
  public SITE_ID: string = INVISIBLE_CAPTCHA_ID;
  public recaptchaResponse: any;
  public captchaValid = false;
  public touchShippingForm = false;
  public hasPhone = false;
  public showAddressRequiredError = false;

  private alive = true;
  storedAddress: IFirebaseAddress;

  constructor(private userProfileService: FirebaseUserProfileService, private shippingConfigurationService: ShippingConfigurationService, private router: Router,
    private checkoutService: CheckoutService, private accountPaymentService: AccountPaymentService,
    private modalHelper: ModalHelperService,
    private shippingService: ShippingService,
    private toastHelper: ToastrHelperService,
    private analyticsService: ActionsAnalyticsService,
    private metaService: MetaService,
    public appState: AppState,
    private pageScrollService: PageScrollService) {
    this.metaService.createCanonicalUrl();
    this.checkoutService.totalSubject.subscribe((t) => {
      this.total = t;
    })
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.cartSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.analyticsService.trackCheckoutSteps(2, 'Shipping');
    this.flowSettings = this.checkoutService.initFlowControlSettings(this.checkoutService.needsShipping, this.isLoggedIn);
    const storedShippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress'));
    if (!!storedShippingAddress) {
      this.storedAddress = storedShippingAddress as IFirebaseAddress;
      if (!!this.storedAddress.id) {
        this.storedShippingId = this.storedAddress.id;
      } else {
        this.shippingAddress = this.storedAddress;
      }
    } else {
      this.shippingAddress = {} as IFirebaseAddress;
    }
    const storedPayment = sessionStorage.getItem('payment_id');
    if (!!storedPayment && !!storedShippingAddress) {
      if (storedPayment !== '1') {
        this.accountPaymentService.getPaymentMethod(storedPayment).then((method) => {
          this.checkoutService.updatePaymentMethod(method);
        });
      }
    }
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => {
      this.user = user;
      if (!!this.user) {
        this.addressesList = !!this.user?.shippingAddresses ? this.user.shippingAddresses : [];
        if (!!this.addressesList) {
          const index = this.addressesList.findIndex((address) => address.id === this.storedShippingId);
          if (index > -1) {
            this.selectedShippingAddress = this.addressesList[index];
            this.addressesList.splice(index, 1);
            this.addressesList.unshift(this.selectedShippingAddress);
            this.showAddressRequiredError = false;
          } 
          else if(!!this.storedAddress && Object.keys(this.storedAddress).length>0){
            this.addressesList.push(this.storedAddress);
            this.selectedShippingAddress = this.addressesList[0];
          }
        }
        if (!!this.addressesList && this.addressesList.length <= 0) {
          this.showShippingForm = true;
        }
      }
    });

    this.shippingConfigurationService.newSimOrder.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.newSimOrder = order;
    });
    this.cartSubscription = this.checkoutService.userCartReplySubject.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      if (!!cart) {
        this.cart = cart;
        if (!!this.newSimOrder && this.cart.cartType === CART_TYPES.PLAN_ITEMS && this.cart.simsQuantity > 0) {
          this.simPrice = this.newSimOrder.price;
          this.simId = this.newSimOrder.id;
        }
        this.shippingConfigurationService.shippingMethods.pipe(takeWhile(() => this.alive)).subscribe((methods) => {
          this.shippingMethods = methods;
          if (!!this.cart.phones) {
            this.shippingMethods = this.shippingMethods.filter((method: any) => method.shipper === 'fedex');
            this.hasPhone = true;
          } else {
            this.hasPhone = false;
            this.shippingMethods = this.shippingMethods.filter((method: any) => method.shipper !== 'fedex');
          }
          this.shippingMethods.map(item => {
            if (!this.shippingDeliveryService.some(elm => elm === item?.shipper)) {               
              this.shippingDeliveryService.push(item.shipper);
            } 
            this.shippingDeliveryOptions = this.shippingMethods.filter(method => method.shipper === item?.shipper)
          });
          const savedMethod = JSON.parse(sessionStorage.getItem('shippingMethod'));
          if (!!savedMethod) {
            this.orderShippingMethod = this.shippingMethods.find((method) => method.id === savedMethod.id);
            this.selectedShippingServiceOption = this.orderShippingMethod?.id;
            this.shippingServiceType = this.orderShippingMethod?.shipper;
            this.checkoutService.updateShippingMethod(this.orderShippingMethod);
          }
        });

      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.user && !!changes.user.currentValue) {
      this.addressesList = changes.user.currentValue.shippingAddresses;
    }
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public ShowShippingForm(): void {
    if (!!this.showShippingForm) {
      this.showShippingForm = false;
    } else {
      this.selectedShippingAddress = null;
      this.touchShippingForm = false;
      this.showAddressRequiredError = false;
      this.shippingAddress = {} as IFirebaseAddress;
      this.showShippingForm = true;
    }
  }
  public toggleSelectedAddress(): void {
    this.shippingAddress = { address1: '', address2: '' } as IFirebaseAddress;
    this.showShippingForm = false;
    this.showAddressRequiredError = false;
  }

  public updateTotalPrice(): void {
    sessionStorage.setItem('shippingMethod', JSON.stringify(this.orderShippingMethod));
    this.checkoutService.updateShippingMethod(this.orderShippingMethod);
  }

  public setValidAddress(isValid: boolean): void {
    this.isValidAddress = isValid;
  }
  public changedShippingMethod(shipper): void {
    if (!!shipper) {
      this.shippingDeliveryOptions = this.shippingMethods.filter(method => method.shipper === shipper)
    }
  };
  public changedDeliveryOption(): void {
    if (!!this.selectedShippingServiceOption) {
      const selectedMethod = this.shippingMethods.find(item => item?.id === this.selectedShippingServiceOption);
      if (!!selectedMethod) {
        this.orderShippingMethod = selectedMethod;
        this.updateTotalPrice();
        sessionStorage.setItem('shippingMethod', JSON.stringify(this.orderShippingMethod));
      }
    }
  }
  public addressLookUpChanged(address: IAddress): void {
    this.shippingAddress = Object.assign(this.shippingAddress, address);
    this.removeEmptyValues(this.shippingAddress);
  }
  public addAddress(): void {
    this.shippingMethodForm.form.markAllAsTouched();
    this.touchShippingForm = true;
    this.customHtml2 = `
    <div class="flex-container">
      <div class="pop-header1">
        <p>There’s a chance that you may not receive your package by mail. Please re-visit the possible issues:</p>
      </div>
      <div class="pop-header2">
          <p><b> Do the city, state and ZIP code conflict?</b></p>
          <p><b> Are there any typos or misspellings?</b></p>
        </div>
    </div>`;
    if (!!this.shippingMethodForm.valid && !!this.isValidAddress && !!this.shippingAddress?.name) {
      this.appState.loading = true;
      const address = this.checkExsitingAddresses(this.shippingAddress);
      if (!!address) {
        this.toastHelper.showWarning('Shipping Address already exists!');
        this.toggleSelectedAddress();
        this.selectedShippingAddress = this.addressesList.find((add) => add.id === address.id);
        this.appState.loading = false;
        this.showShippingForm = false;
        this.showAddressRequiredError = false;
        this.shippingAddress = {} as IFirebaseAddress;
      } else {
        this.selectedShippingAddress = this.shippingAddress;
        this.showShippingForm = false;
        this.showAddressRequiredError = false;
        this.shippingAddress = {} as IFirebaseAddress;
        this.shippingMethodForm.form.reset();
        this.touchShippingForm = false;
        this.addNewAddress(this.shippingAddress);
        // this.shippingService.verifyShippingAddress(this.shippingAddress).then((addresses) => {
        //   this.appState.loading = false;
        //   if (!!addresses) {
        //     this.customHtml =
        //       `
        //       <div class="flex-container">
        //       <div class="pop-header">
        //        <p><img src='/assets/img/location.svg'><b> Current Customer Address:</b></p>
        //         <p class="sub-padding">` + this.shippingAddress.address1 + ', ' + this.shippingAddress.state + ' ' + this.shippingAddress.postalCode + `</p>
        //         </div>
        //         <div class="pop-header">
        //         <p><img src='/assets/img/location.svg'><b> Verified Address from USPS</b></p>
        //         <p class="sub-padding"> ` + addresses[0].address1 + ', ' + addresses[0].state + ' ' + addresses[0].postalCode + `</p>
        //         </div>
        //         </div>
        //        `;
        //     this.modalHelper.showInformationMessageModal('Verify your shipping address',
        //       '',
        //       'Keep current address', null, true, 'usp-pop-up-modal', this.customHtml, true, 'Use verified address')
        //       .result.then((result) => {
        //         if (result) {
        //           // PRIMARY
        //           this.selectedShippingAddress = this.shippingAddress;
        //           this.addNewAddress(this.shippingAddress);
        //         }
        //         else {
        //           const name = this.shippingAddress.name;
        //           addresses[0].name = name;
        //           this.selectedShippingAddress = addresses[0];
        //           this.addNewAddress(addresses[0]);
        //         }
        //         this.showShippingForm = false;
        //         this.showAddressRequiredError = false;
        //         this.shippingAddress = {} as IFirebaseAddress;
        //         this.shippingMethodForm.form.reset();
        //         this.touchShippingForm = false;
        //       }, (error) => {
        //         console.error('error step', error);
        //       });
        //   }
        // }, (error) => {
        //   this.appState.loading = false;
        //   this.modalHelper.showInformationMessageModal('We couldn’t validate your address', '', 'Edit address', null,
        //     false, 'usp-pop-up-modal2', this.customHtml2);
        // });
      }
    }
  }
  public nextCheckoutStep(): void {
    if (!!this.showShippingForm) {
      this.shippingMethodForm.form.markAllAsTouched();
      this.touchShippingForm = true;
    } else if(!this.selectedShippingAddress || !!this.selectedShippingAddress && Object.keys(this.selectedShippingAddress).length === 0) {
      this.showAddressRequiredError = true;
      window.scroll(0,100);
    }
    this.packageForm.form.markAllAsTouched();
    if (this.packageForm.valid && !!this.selectedShippingAddress &&  Object.keys(this.selectedShippingAddress).length !== 0 && !this.touchShippingForm || (!!this.touchShippingForm && this.shippingMethodForm.form.valid)) {
      this.removeEmptyValues(this.selectedShippingAddress);
      this.checkoutService.updateShippingAddress(this.selectedShippingAddress);
      sessionStorage.setItem('shippingAddress', JSON.stringify(this.selectedShippingAddress));
      const storedPaymentId = sessionStorage.getItem('payment_id');
      if (!!storedPaymentId && storedPaymentId !== '1') {
        const nextStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_CHECKOUT);
        this.checkoutService.updateCheckoutStep(nextStep);
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PLACE_ORDER}`]);
      } else {
        const nextStep = this.flowSettings.steps.find((step) => step.flowStepId === FLOW_STEPS_IDS.STEP_PAYMENT_CREDIT_CARD);
        this.checkoutService.updateCheckoutStep(nextStep);
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}/${CHECKOUT_ROUTE_URLS.PAYMENT_SECTION}`]);
      }
      this.analyticsService.trackAddShippingInfoGA4(this.cart, this.orderShippingMethod.title, this.simPrice, this.simId);
    }
  }
  public goToCart(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
  }
  private addNewAddress(address): void {
    this.addressesList.unshift(address);
    this.pageScrollService.scroll({
      document,
      scrollTarget: "#addresses",
      scrollOffset: 141,
      speed: 200,
    });

  }
  private checkExsitingAddresses(address): IFirebaseAddress {
    if (!!this.addressesList && this.addressesList.length > 0) {
      return this.addressesList.find((existingAddress) => this.compareAddressInfo(address, existingAddress));
    }
    return null;
  }
  private compareAddressInfo(enteredAddress: any, existingAddress: IAddress): boolean {
    let isAddress2Equal: boolean;
    if (enteredAddress && enteredAddress.address1 && enteredAddress.address1?.main_text) {
      enteredAddress.address1 = enteredAddress.address1?.main_text;
    }
    if ((!!enteredAddress.address2 && !!existingAddress.address2 && enteredAddress.address2.trim() === existingAddress.address2.trim())
      // eslint-disable-next-line @typescript-eslint/quotes
      || (enteredAddress.address2 === "" && existingAddress.address2 === "") || (!enteredAddress.address2 && !existingAddress.address2)) {
      isAddress2Equal = true;
    } else {
      isAddress2Equal = false;
    }
    return enteredAddress?.country === existingAddress?.country &&
      enteredAddress?.address1?.toLowerCase() === existingAddress?.address1?.toLowerCase() &&
      isAddress2Equal &&
      enteredAddress?.state?.toLowerCase() === existingAddress?.state?.toLowerCase() &&
      enteredAddress?.city?.toLowerCase() === existingAddress?.city?.toLowerCase() &&
      enteredAddress?.postalCode === existingAddress?.postalCode;
  }
  private removeEmptyValues(obj): any {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === 'object') {
        this.removeEmptyValues(obj[key]);
      } else if (obj[key] == null || obj[key] === '') {
        delete obj[key];
      }
    });
    return obj;
  }
}
