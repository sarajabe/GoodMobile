import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACTIVATION_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-welcome-new-user',
  templateUrl: './welcome-new-user.component.html',
  styleUrls: ['./welcome-new-user.component.scss']
})
export class WelcomeNewUserComponent implements OnInit {

  constructor(private router: Router, private metaService: MetaService) {
    this.metaService.createCanonicalUrl();
  }

  ngOnInit(): void {
  }

  public goToPlans(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}`]);
  }

  public goToCompatibility(): void {
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`]);
  }

}
