import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { CustomizableMobilePlan, FirebaseUserProfileService, IFireBasePlanItem, IUserDevice,
   IUserPlan, UserDeviceService, UserPlansService, IExistingOrder } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-activate-sim',
  templateUrl: './activate-sim.component.html',
  styleUrls: ['./activate-sim.component.scss']
})
export class ActivateSimComponent implements OnInit, OnDestroy {
  public user: IUser;
  public userPlan: IUserPlan;
  public plan: CustomizableMobilePlan;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public ACTIVATION_ROUTE_URLS = ACTIVATION_ROUTE_URLS;
  public isNewNumber = true;
  public isPageLoading = true;
  public isPortOnly = false;
  public isNewOnly = false;
  public showVideo = false;
  private alive = true;
  activationCode: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userPlansService: UserPlansService,
              private toastHelper: ToastrHelperService,
              private modalHelper: ModalHelperService,
              private userProfileService: FirebaseUserProfileService,
              private userDeviceService: UserDeviceService) {
  }

  ngOnInit(): void {
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      // this will be always true if it was any text, i think, so we need to make sure it is NOT (true), anything else by default will be true .
      this.isNewNumber = params[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER] ? false : true;
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE]) {
        this.activationCode = params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE];
      }
      const userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
      if (!!userPlanId) {
        if (userPlanId !== 'prefunded') {
          this.userPlansService.getUserPlan(userPlanId).then((userPlan) => {
            this.userPlanSelected(userPlan);
          });
          this.isNewOnly = false;
        } else {
          this.isNewOnly = true;
          const device: IUserDevice = Object.assign({}, JSON.parse(sessionStorage.getItem('device')));
          const sim: IExistingOrder = Object.assign({}, JSON.parse(sessionStorage.getItem('activation')));
          if (!device || !sim) {
            this.toastHelper.showAlert('Activation data is missing, please try again!');
            this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
          } else {
            const basePlan = { id: sim.prefundedPlan, price: sim.prefundedAmount, promoted: false, unlimited: true, type: 'Unlimited' } as IFireBasePlanItem;
            this.userPlan = {
              id: 'prefunded', activationCode: sim.activationCode, planDevice: device,
              basePlan, autoRenewPlan: false,
            } as IUserPlan;
          }
        }

      } else {
        this.toastHelper.showAlert('Activation data is missing, please try again!');
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan) {
      this.userPlan = userPlan;
      const newParams = {};
      newParams[ROUTE_URLS.PARAMS.USER_PLAN_ID] = userPlan.id;
      newParams[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER] = !this.isNewNumber;
      this.plan = this.userPlansService.getCustomizableMobilePlanFromUserPlan(userPlan);
      if (!!this.userPlan.planDevice && !!this.userPlan.planDevice.portRequired) {
        this.isPortOnly = true;
      } else {
        this.isPortOnly = false;
      }
      this.isPageLoading = false;
    } else {
      this.modalHelper.showInformationMessageModal('Failed to load the selected user plan',
        'Something went wrong, couldn\'t load the selected plan, please try again later.',
        'Continue to Account Summary','', false, 'big-button')
        .afterClosed().subscribe((result) => {
          if (!!result) {
            this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
          }
        });
    }
  }

  public registerDevice(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.userPlan.id;
    this.userDeviceService.setIsChangingDevice(true);
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
  }
  public clickedOut(event): void {
    if (event.target.className === 'activation-video-container') {
      this.showVideo = false;
    }
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'esc') {
      this.showVideo = false;
    }
  }
}
