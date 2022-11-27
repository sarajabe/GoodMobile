import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, MIGRATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-confirm-device',
  templateUrl: './confirm-device.component.html',
  styleUrls: ['./confirm-device.component.scss']
})
export class ConfirmDeviceComponent implements OnInit, OnDestroy {
  public userPlan: IUserPlan;
  private alive = true;

  constructor(private route: ActivatedRoute, private router: Router, private toastHelper: ToastrHelperService, private userPlansService: UserPlansService) {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
        const userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
        this.userPlansService.getUserPlan(userPlanId).then((plan) => {
          if (!!plan) {
            this.userPlan = plan;
          }
        });
      } else {
        this.toastHelper.showAlert('Please select a plan to start the migration process!');
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      }
    });
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public goToCheckDevice(confirmed: boolean): void {
    const params = {};
    params[MIGRATION_ROUTE_URLS.PARAMS.CONFIRMED] = confirmed;
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlan.id;
    this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.CHECK_COMPATIBILITY}`, params]);
  }
}
