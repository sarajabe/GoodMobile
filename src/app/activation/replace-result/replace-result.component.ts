import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPlansService } from '@ztarmobile/zwp-service-backend';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-replace-result',
  templateUrl: './replace-result.component.html',
  styleUrls: ['./replace-result.component.scss']
})
export class ReplaceResultComponent {
  public oldIccid: string;
  public mdn: string;
  public iccid: string;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private userPlansService: UserPlansService,
              private metaService: MetaService) {

    if (sessionStorage.getItem('activation_step') !== 'step4') {
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.REPLACE_SIM}`]);
    }
    this.route.params.subscribe((params) => {
      if (!!params) {
        if (!!params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
          this.userPlansService.getUserPlan(params[ROUTE_URLS.PARAMS.USER_PLAN_ID]).then((plan) => {
            if (!!plan) {
              this.mdn = plan.mdn;
              this.iccid = plan.planDevice.simNumber;
              this.userPlansService.selectUserPlan(plan.id);
            }
          });
        }
        if (!!params[ACTIVATION_ROUTE_URLS.PARAMS.ICCID]) {
          this.oldIccid = params[ACTIVATION_ROUTE_URLS.PARAMS.ICCID];
        }

      }
    });
    this.metaService.createCanonicalUrl();
  }

  public goToAcccountSummary(): void {
    sessionStorage.setItem('activation_step', 'step5');
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step3');
  }
}
