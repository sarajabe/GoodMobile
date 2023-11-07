import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomizableMobilePlan, MobileCustomPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { CheckoutService } from '../checkout/checkout.service';
import { NgForm } from '@angular/forms';
import { OrdersService } from '@ztarmobile/zwp-service-backend-v2';

@Component({
  selector: 'app-device-checkout',
  templateUrl: './device-checkout.component.html',
  styleUrls: ['./device-checkout.component.scss']
})
export class DeviceCheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('pickupOptionsForm') pickupOptionsForm: NgForm;

  public userCart: CustomizableMobilePlan;
  public total = 0;
  public option;
  public isPersonStepValidated = false;

  private alive = true;

  constructor(private mobilePlansService: MobileCustomPlansService, private toastHelper: ToastrHelperService,
    private router: Router, private appState: AppState, private checkoutService: CheckoutService, private ordersService: OrdersService) {
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

  public selectPersonOption(event): void {
    if (!!event) {
      this.option = event;
    }
  }

  public validatePersonStep(event): void {
    this.isPersonStepValidated = event;
  }

  public placeOrder(): void {
    this.appState.loading = true;
    const data = {
      haseSIM: false,
      autoRenewPlan: false,
      storePickup: !!this.option && this.option === 'store' ? true : false
    }
    this.ordersService.placeOrder(data).then(() => {
      this.appState.loading = false;
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message || error, '', 6000, false);
    });
  }
}
