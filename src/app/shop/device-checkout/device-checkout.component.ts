import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomizableMobilePlan, MobileCustomPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { CheckoutService } from '../checkout/checkout.service';

@Component({
  selector: 'app-device-checkout',
  templateUrl: './device-checkout.component.html',
  styleUrls: ['./device-checkout.component.scss']
})
export class DeviceCheckoutComponent implements OnInit, OnDestroy {
  public userCart: CustomizableMobilePlan;
  public total = 0;
  private alive = true;

  constructor(private mobilePlansService: MobileCustomPlansService, private toastHelper: ToastrHelperService,
    private router: Router, private appState: AppState, private checkoutService: CheckoutService) { 
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.userCart = cart;
      if (!!this.userCart && !!this.userCart.acpDevice) {
        this.total = this.userCart.acpDevice.price;
      }
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  public goToCart(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
  }
  public placeOrder():void {
    this.appState.loading = true;
    const cart = {
      currentPlan: this.userCart,
      shippingAddress:  null,
      cardInfo:  null,
      options: {
        autoRenewPlan:  false ,
        isVoucherPayment: false,
        saveCcInfo: false,
        usingPaymentProfile: false,
        taxes: 0,
        fees: 0,
        simId: '',
        simPrice: 0,
        haseSIM: false,
        storePickup: true
      },
      orderShippingMethod:  null,
      hasShippingItems: false
    };
    this.checkoutService.checkoutNewPlan(cart).then(() => {
      this.appState.loading = false;
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message || error, '', 6000, false);
    });
  }
}
