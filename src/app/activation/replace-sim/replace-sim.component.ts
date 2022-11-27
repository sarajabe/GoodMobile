import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IChangeDevice, IDeviceCompatibilityV1, IUserAccount, IUserPlan, UserAccountService, UserDeviceService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACTIVATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';

@Component({
  selector: 'app-replace-sim',
  templateUrl: './replace-sim.component.html',
  styleUrls: ['./replace-sim.component.scss']
})
export class ReplaceSimComponent implements OnDestroy {
  public selectedPlan: IUserPlan;
  public userPlans: IUserPlan[];
  public userAccount: IUserAccount;
  public firstSet = true;
  private alive = true;

  constructor(private router: Router,
              private userPlansService: UserPlansService,
              private modalHelper: ModalHelperService,
              private toastHelper: ToastrHelperService,
              private userDeviceService: UserDeviceService,
              private appState: AppState,
              private userAccountService: UserAccountService,
              private metaService: MetaService) {

    if (sessionStorage.getItem('activation_step') !== 'step3') {
      this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_SIM_PATH}`]);
    }
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
      this.userPlans = plans.filter((plan) => !!plan.mdn && !plan.portInRequestNumber);
      if (!!this.userPlans && this.userPlans.length > 0 && !!this.firstSet) {
        this.selectedPlan = this.userPlans[0];
        this.firstSet = false;
      }
    });
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public getSelectorTitle(plan: IUserPlan): string {
    let title = '';
    if (!!plan.mdn) {
      const mdn: string = (new PhonePipe()).transform(plan.mdn);
      title = !!plan.portInRequestNumber ? `PortIn for ${mdn}` : mdn;
    }
    return title;
  }

  public swapSim(): void {
    this.modalHelper.showSIMModal('', 'Enter your Replacement SIM’s ICCID', 'Activate', 'primary', 'Sim-replacement-iccid-modal',
       '', 'Replacement SIM ICCID', true).result.then((result) => {
        if (!!result && result !== false && result.input) {
          const customHTML = '<div class="question"><p>You are about to swap to SIM <p class="iccid"><b>[' + result.input +
          ']</b></p> on Phone Number <b>' + this.selectedPlan.mdn +
            '</b></p><p class="confirm">Is this correct?"</p></div>';
          this.modalHelper.showInformationMessageModal('', '',
            'Yes', null, true, 'confirm-swap-modal', customHTML, true, 'No',
            'Please make sure this is the phone number you want your new SIM associated to.  This change cannot be undone.').result.then((res) => {
              if (!!res && res === true) {
                sessionStorage.setItem('activation_step', 'step4');
                if (!this.selectedPlan.planDevice.postalCode) {
                  this.modalHelper.showInputModal('Postal code', `Enter postal code of your area`, 'Submit', 'primary', 'Sim-replacement-iccid-modal').result.then((postal) => {
                    if (!!postal) {
                      this.selectedPlan.planDevice.postalCode = postal;
                      this.changeDevice(result.input, result.captcha);
                    }
                  });
                } else {
                  this.changeDevice(result.input, result.captcha);
                }
              }
            });
        }
      });
  }
  public goToActivationFlow(): void {
    sessionStorage.setItem('activation_step', 'step4');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_PLANS_PATH}`]);
  }
  public changeDevice(iccid, captchaResponse): void {
    this.appState.loading = true;
    if (!!this.userAccount) {
      const originalIccid = this.userAccount.iccid;
    }
    this.userDeviceService.isSupportedDeviceWithZipCode(this.selectedPlan.planDevice.id, this.selectedPlan.planDevice.postalCode, '', captchaResponse).then((response) => {
      const changeRequest: IChangeDevice = {
        mdn: this.selectedPlan.mdn, equipment: this.selectedPlan.planDevice.id,
        handsetOS: !!this.selectedPlan.planDevice.os ? this.selectedPlan.planDevice.os : '', iccid
      };
      let device = {} as IDeviceCompatibilityV1;
      if (!!response && response.meta.count > 0) {
        device = response.carrierValidity[0];
      }

      this.userDeviceService.changeUserDevice(changeRequest, this.selectedPlan.id).then(() => {
        this.selectedPlan.planDevice = !!this.selectedPlan.planDevice ? Object.assign(this.selectedPlan.planDevice, device) : device;
        this.selectedPlan.planDevice.pendingNewSim = false;
        this.selectedPlan.planDevice.simNumber = iccid;
        this.appState.loading = false;
        this.userPlansService.updateUserPlan(this.selectedPlan.userId, this.selectedPlan).then(() => {
          const params = {};
          params[ACTIVATION_ROUTE_URLS.PARAMS.ICCID] = this.userAccount.iccid;
          params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
          this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.REPLACE_RESULT}`, params]);
        }, (error) => {
          this.appState.loading = false;
          this.toastHelper.showAlert(error.message || error.error ? error.error.message : error);
        });
      }, (error) => {
        this.appState.loading = false;
        this.toastHelper.showAlert(error.message);
      });
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message || error.error ? error.error.message : error);
    });
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step2');
  }
}
