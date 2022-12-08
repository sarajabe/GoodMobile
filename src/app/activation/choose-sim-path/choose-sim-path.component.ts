import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ACTIVATION_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-choose-sim-path',
  templateUrl: './choose-sim-path.component.html',
  styleUrls: ['./choose-sim-path.component.scss']
})
export class ChooseSimPathComponent {
  constructor(private router: Router,
              private metaService: MetaService) {

    // if (sessionStorage.getItem('activation_step') !== 'step2') {
    //   this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_SIM_SOURCE}`]);
    // }
    this.metaService.createCanonicalUrl();
  }

  public goToActivationFlow(): void {
    sessionStorage.setItem('activation_step', 'step3');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_PLANS_PATH}`]);
  }

  public goToReplacementFlow(): void {
    sessionStorage.setItem('activation_step', 'step3');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.REPLACE_SIM}`]);
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step1');
  }
}
