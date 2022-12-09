import { Component, HostListener } from '@angular/core';
import { PlansShopService } from './plans-shop.service';
import { Router } from '@angular/router';
import { ACTIVATION_ROUTE_URLS } from '../../app.routes.names';

@Component({
  templateUrl: './plans-and-features.component.html',
  selector: 'app-plans-and-features'
})
export class PlansAndFeaturesComponent{
  constructor(public plansShopService: PlansShopService, private router: Router) {
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    // if (sessionStorage.getItem('activation_step') === 'step2'){
    //   console.info('****************************');
    // event.preventDefault();
    // sessionStorage.setItem('activation_step', 'step1');
    // this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.No_SIM}`]);
    // }
  }

}
