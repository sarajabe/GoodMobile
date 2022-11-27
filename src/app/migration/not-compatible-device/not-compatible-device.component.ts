import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, MIGRATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-not-compatible-device',
  templateUrl: './not-compatible-device.component.html',
  styleUrls: ['./not-compatible-device.component.scss']
})
export class NotCompatibleDeviceComponent implements OnInit {
  public userPlanId: string;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.pipe(take(1)).subscribe((params: Params) => {
      if (!!params) {
        this.userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
      }
    });
  }

  ngOnInit(): void {
  }

  public goToCompatibility(): void {
    const params = {};
    if (!!this.userPlanId) {
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
    }
    this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.CHECK_COMPATIBILITY}`, params]);
  }

  public cancel(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }
}
