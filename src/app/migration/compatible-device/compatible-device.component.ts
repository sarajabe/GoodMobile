import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomizableMobilePlan, MobileCustomPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-compatible-device',
  templateUrl: './compatible-device.component.html',
  styleUrls: ['./compatible-device.component.scss']
})
export class CompatibleDeviceComponent implements OnInit, OnDestroy {
  public cart: CustomizableMobilePlan;
  public eSIM = false;
  private alive = true

  constructor(private router: Router, private cartService: MobileCustomPlansService) { }

  ngOnInit(): void {
    this.cartService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.cart = cart;
      this.eSIM = this.cart.eSIM;
      this.cart.planDevice.marketingName
    });
  }

  ngOnDestroy(): void {
      this.alive = false;
  }

  public SendTmoPhysicalSim(): void {
    const device  = this.cart.planDevice;
    device.skuIdentifier = 'T';
    device.skuNumber = 'SIMG2GTMO4GLTE';
    this.cartService.setPlanDevice(device);
    this.cartService.seteSIM(false);
    this.goToCart();
  }
  public goToCart(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
  }

  public goToSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }

}
