import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-sim-arrival',
  templateUrl: './sim-arrival.component.html',
  styleUrls: ['./sim-arrival.component.scss']
})
export class SIMArrivalComponent {
  constructor(private router: Router,
              private metaService: MetaService) {

    if (sessionStorage.getItem('activation_step') !== 'step2') {
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.No_SIM}`]);
    }
    this.metaService.createCanonicalUrl();
  }

  public goToAccountSummary(): void {
    sessionStorage.setItem('activation_step', 'step3');
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step1');
  }
}
