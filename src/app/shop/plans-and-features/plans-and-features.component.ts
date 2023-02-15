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

}
