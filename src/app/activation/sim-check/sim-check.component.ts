import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ACTIVATION_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-sim-check',
  templateUrl: './sim-check.component.html',
  styleUrls: ['./sim-check.component.scss']
})
export class SIMCheckComponent {
  constructor(private router: Router,
              private metaService: MetaService) {

    sessionStorage.setItem('activation_step', 'step0');
    this.metaService.createCanonicalUrl();
  }

  public goToNoSimPath(): void {
    sessionStorage.setItem('activation_step', 'step1');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.No_SIM}`]);
  }

  public goToSimSource(): void {
    sessionStorage.setItem('activation_step', 'step1');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_SIM_SOURCE}`]);
  }
}
