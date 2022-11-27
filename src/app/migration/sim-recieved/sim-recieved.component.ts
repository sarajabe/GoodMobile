import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, MIGRATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-sim-recieved',
  templateUrl: './sim-recieved.component.html',
  styleUrls: ['./sim-recieved.component.scss']
})
export class SimRecievedComponent implements OnInit, OnDestroy {
  public selectedPlan: IUserPlan;
  public selectedDeviceName: string;
  public phoneImei;
  public mdn;
  public planId: string;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public verifyFlow = false;
  private alive = true;

  constructor(private userPlansService: UserPlansService, private route: ActivatedRoute, private toastHelper: ToastrHelperService,
              private modalHelper: ModalHelperService, private router: Router) {

    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
        const userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
        this.userPlansService.getUserPlan(userPlanId).then((plan) => {
          if (!!plan) {
            this.selectedPlan = plan;
            this.mdn = this.selectedPlan.mdn;
            this.selectedDeviceName = !!this.selectedPlan.migrationDevice ? null : this.selectedPlan.planDevice.model.split('(')[0];
            this.planId = this.selectedPlan.id;
            this.phoneImei = this.selectedPlan.migrationDevice || this.selectedPlan.planDevice.id;
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

  public back(): void {
    if (!!this.verifyFlow) {
      this.verifyFlow = false;
    } else {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
    }
  }
  public goToCheckDevice(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
    params[MIGRATION_ROUTE_URLS.PARAMS.ORDERED] = true;
    this.router.navigate([`${MIGRATION_ROUTE_URLS.BASE}/${MIGRATION_ROUTE_URLS.CHECK_COMPATIBILITY}`, params]);
  }
  public getVerifiedValue(verifyValue): void {
    this.verifyFlow = verifyValue;
  }

  public showWhatIsIMEI(): void {
    this.modalHelper.showInformationMessageModal('3 Ways to find your IMEI', '', 'Got it', null,
      true, 'compatibility-help-modal-IME ',
      `<div class="description-content">
    <div class="intro">
    Your IMEI number is needed if you want to unlock your device to use
    on other networks. Here’s 3 ways how to find it on your phone: </div>

       <div class="note-dial"> <b>Enter *#06# on your phone’s dial pad.</b></div>
       <b>OR</b>
       <div class="menu-margins">
       <b>Check your phone’s settings menu:</b>
       <p class="p-nowrap">Android: Go to Settings > About device > Status</p>
       <p class="p-nowrap">iPhone: Go to Settings > General > About</p>
       <p class="p-nowrap">Windows Phone: Go to Settings > About > More info</p>
       </div>
       <b>OR</b>
       <div class="menu-margins">
       <p class="p-nowrap"><b>Check the sticker under your device’s battery.</b></p>
       <p class="p-nowrap"> Note: It may be listed as “DEC.” </p> </div>
      </div>`
    );
  }

}
