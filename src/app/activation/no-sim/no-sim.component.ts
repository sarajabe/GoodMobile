import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-no-sim',
  templateUrl: './no-sim.component.html',
  styleUrls: ['./no-sim.component.scss']
})
export class NoSIMComponent {
  constructor(private router: Router,
              private metaService: MetaService) {

    if (sessionStorage.getItem('activation_step') !== 'step1') {
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
    }
    this.metaService.createCanonicalUrl();
  }

  public goToShopPath(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

  public goToSimCheck(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
  }

  public goToOrders(): void {
    sessionStorage.setItem('activation_step', 'step1');
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step0');
  }
}
