import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { IUserPlan, MobileCustomPlansService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-choose-plan-path',
  templateUrl: './choose-plan-path.component.html',
  styleUrls: ['./choose-plan-path.component.scss']
})
export class ChoosePlanPathComponent implements OnDestroy {
  public pendingPlans: IUserPlan[];
  public activePlans: IUserPlan[];
  public activationCode: string;
  public isLoggedIn = false;
  public processingRequest = false;
  public noPendingPlans = false;
  private alive = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private appState: AppState,
              private metaService: MetaService,
              private mobileCustomPlansService: MobileCustomPlansService,
              private userPlansService: UserPlansService,
              private simpleAuthService: SimpleAuthService) {

    if (sessionStorage.getItem('activation_step') !== 'step3' && sessionStorage.getItem('activation_step') !== 'step4') {
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_SIM_PATH}`]);
    }
    this.metaService.createCanonicalUrl();
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE]) {
        this.activationCode = params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE];
      }
    });
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((authState) => {
      this.isLoggedIn = !!authState && !authState.isAnonymous;
      if (!!this.isLoggedIn) {
        this.appState.loading = true;
        setTimeout(() => {
          this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
            if (!!plans) {
              this.pendingPlans = plans.filter((plan) => !plan.mdn);
              this.activePlans = plans.filter((plan) => !!plan.mdn);
              this.appState.loading = false;
              if (!!this.pendingPlans && this.pendingPlans.length === 0) {
                this.noPendingPlans = true;
              }
            }
          });
        }, 500);
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public purchasePlan(): void {
    sessionStorage.setItem('activation_step', 'step4');
    this.mobileCustomPlansService.setSimCard('0000000');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`]);
  }

  public goToPendingPlans(): void {
    sessionStorage.setItem('activation_step', 'step4');
    this.mobileCustomPlansService.setSimCard('');
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS}`]);
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step2');
  }
}
