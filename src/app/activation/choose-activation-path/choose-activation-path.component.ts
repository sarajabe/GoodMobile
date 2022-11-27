import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseUserProfileService, IDeviceCompatibility, IUser, IUserPlan, UserDeviceService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { IExistingOrder } from '@ztarmobile/zwp-service-backend';
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
  public enteredDevice: IDeviceCompatibility;
  public user: IUser;
  public equipment: string;
  public iccid: string;
  public userPlanId: string;
  public isIccidRequired = false;
  public invalidICCID = true;
  public processingRequest = false;
  public deviceCheckComplete = true;
  public iccidNotFound = false;
  public invalidDevice = false;
  public isPortOnly = false;
  public isNewOnly = false;
  public disableNew = false;
  private alive = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userPlansService: UserPlansService,
              private appState: AppState,
              private toastHelper: ToastrHelperService,
              private metaService: MetaService,
              private userDeviceService: UserDeviceService,
              private userProfileService: FirebaseUserProfileService) {

    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
        this.userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
        if (!!this.userPlanId) {
          if (this.userPlanId !== 'prefunded') {
            this.appState.loading = true;
            this.userPlansService.selectUserPlan(this.userPlanId);
            this.userPlansService.getUserPlan(this.userPlanId).then((plan) => {
              this.userPlan = plan;
              if (!!this.userPlan.planDevice && !!this.userPlan.planDevice.portRequired) {
                this.isPortOnly = true;
              } else {
                this.isPortOnly = false;
              }
              if (!!this.userPlan.activationCode && this.userPlan.activationCode === '11111') {
                this.disableNew = true;
              } else {
                this.disableNew = false;
              }
              this.appState.loading = false;
              if (!!plan && plan.planDevice) {
                this.equipment = plan.planDevice.id;
              } else {
                // eslint-disable-next-line no-shadow
                const params = {};
                params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
                this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
              }
            });
          } else {

          }
        } else {
          this.toastHelper.showAlert('Activation data is missing, please try again!');
          this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
        }
      } else {
        this.appState.loading = false;
        this.toastHelper.showAlert('Activation data is missing, please try again!');
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
      }
    });
    const sim: IExistingOrder = Object.assign({}, JSON.parse(sessionStorage.getItem('activation')));
    if (!!sim) {
      if (sim.prefundedPlan) {
        this.isNewOnly = true;
      } else {
        this.isNewOnly = false;
      }
    }
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);
    this.metaService.createCanonicalUrl();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public activateNewNumber(): void {
    const params = {};
    if (!!this.userPlanId) {
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
    }
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATE_SIM}`, params]);
  }

  public portInCurrentNumber(): void {
    const params = {};
    params[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER] = true;
    if (!!this.userPlanId) {
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlanId;
    }
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATE_SIM}`, params]);
  }
}
