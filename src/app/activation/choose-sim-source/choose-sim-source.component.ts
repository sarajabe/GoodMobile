import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ACTIVATION_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-choose-sim-source',
  templateUrl: './choose-sim-source.component.html',
  styleUrls: ['./choose-sim-source.component.scss']
})
export class ChooseSimSourceComponent {
  constructor(private router: Router,
              private metaService: MetaService) {

    if (sessionStorage.getItem('activation_step') !== 'step1') {
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
    }
    this.metaService.createCanonicalUrl();
  }

  public goToSimPath(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_SIM_PATH}`]);
  }

  public goToActivatePlan(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATE_PLAN}`]);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step0');
  }
}
