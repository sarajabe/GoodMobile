import { Component, Inject } from '@angular/core';
import { CustomizableMobilePlan, MobileCustomPlansService, ActionsAnalyticsService, CART_TYPES } from '@ztarmobile/zwp-service-backend';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.service';
import { CheckoutService } from 'src/app/shop/checkout/checkout.service';
import { ACCOUNT_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class OutOfStockItemModalContext {
  public title: string;
  public customHTML: string;
  public customClass?: string;
  public hasCloseLink?: boolean;
  public currentPlan: CustomizableMobilePlan;
}
@Component({
  selector: 'app-out-of-stock-item-modal',
  templateUrl: './out-of-stock-item-modal.component.html'
})
export class OutOfStockItemModalComponent {
  public context: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialogRef<OutOfStockItemModalContext>, private mobilePlansService: MobileCustomPlansService,
              private router: Router, private analyticsService: ActionsAnalyticsService, private appState: AppState,
              private checkoutService: CheckoutService, private location: PlatformLocation) {
    this.context = data;
    location.onPopState(() => { this.beforeDismiss();this.dialog.close();});
  }
  beforeClose(): boolean {
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
    }
    return false;
  }

  beforeDismiss(): boolean {
    return this.beforeClose();
  }

  closeDialog(): void {
    this.beforeDismiss();
    this.dialog.close();
  }
  public changePhone(): void {
    this.closeDialog();
  }
  public remove(): void {
    if (this.context.currentPlan.cartType === CART_TYPES.NEW_PLAN) {
      this.mobilePlansService.setPlanDevice(null);
      this.mobilePlansService.removePhonesFromCart();
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECK_PHONE}`]);
      this.closeDialog();
    } else if (this.context.currentPlan.cartType === CART_TYPES.GENERIC_CART) {
      this.mobilePlansService.clearUserCart();
      this.analyticsService.trackRermoveFromCartGA4([this.context.currentPlan.basePlan]);
      this.appState.clearSessionStorage();
      this.checkoutService.shippingAddressSubject.next(undefined);
      this.checkoutService.storePickupSubject.next(undefined);
      sessionStorage.setItem('removeFromCart', 'true');
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      this.closeDialog();
    }
  }
}

