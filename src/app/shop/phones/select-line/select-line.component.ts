import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhoneManagementService } from 'src/services/phones.service';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { take, takeWhile } from 'rxjs/operators';
import { LOGIN_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserPlansService, IUserPlan } from '@ztarmobile/zwp-service-backend';

@Component({
  selector: 'app-select-line',
  templateUrl: './select-line.component.html',
  styleUrls: ['./select-line.component.scss']
})
export class SelectLineComponent implements OnInit, OnDestroy {
  public LOGIN_ROUTE_URLS = LOGIN_ROUTE_URLS;
  public isNewMobileService = false;
  public isCurrentMobileNumber = false;
  public isLoggedIn = false;
  public selectedOption = '';
  public userPlans: IUserPlan[];
  public selectedPlan: IUserPlan = {} as IUserPlan;
  public activeStep = 1;
  public hasActivePlans = false;
  public allActivePlans: IUserPlan[];
  private alive = true;
  private routerObserver: Subscription;
  constructor(private stepsManagement: PhoneManagementService,
              private simpleAuthService: SimpleAuthService,
              private route: ActivatedRoute,
              public router: Router,
              private userPlansService: UserPlansService) {
    this.stepsManagement.updateCurrentStep(this.activeStep);
    sessionStorage.removeItem('planFlow');
  }

  ngOnInit(): void {
    this.stepsManagement.activeStep.subscribe((step) => {
       this.activeStep = step;
    });
    this.routerObserver = this.route.params.subscribe((params: Params) => {
      if (!!params && params.isCurrentMobileNumber) {
        // we need this to handle the page that the user will be redirected to after the login
        this.isCurrentMobileNumber = true;
        this.stepsManagement.updateSelectedLineOption('current');
      }
    });
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive))
      .subscribe((authState) => {
        this.isLoggedIn = !!authState && !authState.isAnonymous;
      });
    this.stepsManagement.selectedOption.pipe(takeWhile(() => this.alive)).subscribe((option) => {
      if (!!option) {
        this.selectedOption = option;
        if (this.selectedOption === 'new') {
          // if the user select add new line
          this.isNewMobileService = true;
        }
        else {
          // if the user select current mobile number
          this.isCurrentMobileNumber = true;
          this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
            if (!!plans) {
              this.allActivePlans = plans.filter((plan) => !!plan.mdn && !plan.canceled);
              this.userPlans = plans.filter((plan) => !!plan.mdn && !plan.canceled && (!plan.phonePurchaseDate || (((new Date().getTime() - new Date(plan.phonePurchaseDate).getTime()) / (1000 * 3600 * 24)) > 90)));
              this.hasActivePlans = !!this.allActivePlans && this.allActivePlans.length > 0 ? true : false;
              // we get the selected user plan after back button is clicked
              const selectedUserPlan: IUserPlan = JSON.parse(sessionStorage.getItem('selectedUserPlan'));
              if (!!selectedUserPlan) {
                this.selectedPlan = this.userPlans.find((plan) => !!plan.mdn && plan.mdn === selectedUserPlan.mdn);
              }
            }
          });
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.alive = false;
    if (!!this.routerObserver) {
      this.routerObserver.unsubscribe();
    }
  }
  public selectMobileService(serviceType: string): void {
    this.isCurrentMobileNumber = serviceType === 'current' && this.hasActivePlans ? true : false;
    this.isNewMobileService = serviceType === 'new' ? true : false;
    if (serviceType === 'current' && this.hasActivePlans) {
      sessionStorage.removeItem('selectedPlanId');
      this.selectedPlan = null; // this is to clear the drop down list before the user wants to select current mdn
    } else {
      sessionStorage.removeItem('selectedUserPlan');
      this.selectedPlan = null;
    }
    this.stepsManagement.updateSelectedLineOption(serviceType);
    this.stepsManagement.setProcessValidity(false);
  }
  public goToLogin(): void {
    const params = {};
    params[LOGIN_ROUTE_URLS.PARAMS.NEXT_PAGE] = `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PHONES.ADD_STEPS}/${SHOP_ROUTE_URLS.PHONES.SELECT_LINE};isCurrentMobileNumber=true`;
    this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.LOGIN}`, params]);
  }
  public userPlanSelected(userPlan: IUserPlan): void {
    // this function called when the user select active mdn
    if (!!userPlan) {
      // save the selected plan in the session
      sessionStorage.setItem('selectedUserPlan', JSON.stringify(userPlan));
      this.selectedPlan = userPlan;
      // update the observable selectedMdn to not display the validation message that u need to select active mdn
      this.stepsManagement.updateSelectedMdn(true);
    } else {
      this.stepsManagement.updateSelectedMdn(false);
    }
  }
}
