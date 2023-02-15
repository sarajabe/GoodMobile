import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACTIVATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-choose-activation-path',
  templateUrl: './choose-activation-path.component.html',
  styleUrls: ['./choose-activation-path.component.scss']
})
export class ChooseActivationPathComponent implements OnDestroy {
  public userPlan: IUserPlan;
  public equipment: string;
  public userPlanId: string;
  public processingRequest = false;
  public isPortOnly = false;
  public isNewOnly = false;
  public disableNew = false;
  public option;
  public showValidation = false;
  private alive = true;
  activationCode: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userPlansService: UserPlansService,
              private appState: AppState,
              private toastHelper: ToastrHelperService,
              private metaService: MetaService) {

    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
        this.userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
        if (!!this.userPlanId) {
          if (this.userPlanId !== 'prefunded') {
            this.appState.loading = true;
            this.userPlansService.getUserPlan(this.userPlanId).then((plan) => {
              this.userPlan = plan;
              this.appState.loading = false;
              if (!!this.userPlan.planDevice && !!this.userPlan.planDevice.portRequired) {
                this.isPortOnly = true;
              } else {
                this.isPortOnly = false;
              }
              if (!!plan && plan.planDevice) {
                this.equipment = plan.planDevice.id;
              } else {
                // eslint-disable-next-line no-shadow
                const params = {};
                params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
                this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
              }
            });
          }
        }
      } else {
        this.appState.loading = false;
      }
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE]) {
        this.activationCode = params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE];
      }
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public selectOption(): void {
    if (!this.option) {
      this.showValidation = true;
    }
    switch (this.option) {
      case ('new'): {
        this.activateNewNumber();
        break;
      }
      case ('port'): {
        this.portInCurrentNumber();
        break;
      }
    }
  }

  public activateNewNumber(): void {
    const params = {};
    if (!!this.userPlanId) {
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
    }
    if (!!this.activationCode) {
      params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE] = this.activationCode;
    }
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATE_NEW}`, params]);
  }

  public portInCurrentNumber(): void {
    const params = {};
    params[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER] = true;
    if (!!this.userPlanId) {
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
    }
    if (!!this.activationCode) {
      params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE];
    }
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.PORT_NUMBER}`, params]);
  }
}
