import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ACTIVATION_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-sim-check',
  templateUrl: './sim-check.component.html',
  styleUrls: ['./sim-check.component.scss']
})
export class SIMCheckComponent {
  @ViewChild('optionRef') optionRef;
  public option;
  constructor(private router: Router,
              private metaService: MetaService) {

    sessionStorage.setItem('activation_step', 'step0');
    this.metaService.createCanonicalUrl();
  }
  public selectOption(): void {
    this.optionRef.control.markAllAsTouched();
    if (!!this.option) {
      sessionStorage.setItem('activation_step', 'step1');
      if (this.option === 'no') {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.No_SIM}`]);
      } else {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATE_PLAN}`]);
      }
    }
  }
}
