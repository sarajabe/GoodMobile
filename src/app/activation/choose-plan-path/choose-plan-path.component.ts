import { Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { IUserPlan, MobileCustomPlansService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-choose-plan-path',
  templateUrl: './choose-plan-path.component.html',
  styleUrls: ['./choose-plan-path.component.scss']
})
export class ChoosePlanPathComponent implements OnDestroy {
  @ViewChild('optionRef') optionRef;
  public option;
  public pendingPlans: IUserPlan[];
  public activePlans: IUserPlan[];
  public activationCode: string;
  public isLoggedIn = false;
  public processingRequest = false;
  private alive = true;
  showValidation: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private appState: AppState,
              private metaService: MetaService,
              private mobileCustomPlansService: MobileCustomPlansService,
              private userPlansService: UserPlansService,
              private simpleAuthService: SimpleAuthService) {

    if (sessionStorage.getItem('activation_step') !== 'step1' && sessionStorage.getItem('activation_step') !== 'step2') {
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATE_PLAN}`]);
    }
    this.metaService.createCanonicalUrl();
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE]) {
        this.activationCode = params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE];
      } else {
        const sim: any = Object.assign({}, JSON.parse(sessionStorage.getItem('activation')));
        if (!!sim) {
          this.activationCode = sim.activationCode;
        }
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
            }
          });
        }, 500);
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public goToOrders(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.mobileCustomPlansService.setSimCard('');
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
  }
  public selectOption(): void {
    if (!this.option) {
      this.showValidation = true;
    }
    this.optionRef.control.markAllAsTouched();
    switch (this.option) {
      case ('new'): {
        this.purchasePlan();
        break;
      }
      case ('purchased'): {
        this.goToPendingPlans();
        break;
      }
      case ('replace'): {
        this.goToReplaceSIM();
        break;
      }
    }
  }
  public purchasePlan(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.mobileCustomPlansService.setSimCard(this.activationCode);
    const params = {};
    params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION]=true;
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`,params]);
  }

  public goToPendingPlans(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.mobileCustomPlansService.setSimCard('');
    const params = {};
    params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE] = this.activationCode;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS}`, params]);
  }

  public goToReplaceSIM(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.mobileCustomPlansService.setSimCard('');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.REPLACE_SIM}`]);
  }


  public goToVerifyActivation(): void {
    sessionStorage.setItem('activation_step', 'step2');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.ACTIVATE_PLAN}`]);
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step1');
  }
}
