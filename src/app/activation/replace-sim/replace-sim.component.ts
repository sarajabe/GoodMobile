import { Component, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IChangeDevice, IDeviceCompatibilityV1, IExistingOrder, IUserAccount, IUserPlan, UserAccountService, UserDeviceService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
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
  public currentMobileNumberForm: FormGroup;
  public activePlans: Array<IUserPlan>;
  private alive = true;

  constructor(private router: Router,
              private userPlansService: UserPlansService,
              private modalHelper: ModalHelperService,
              private toastHelper: ToastrHelperService,
              private userDeviceService: UserDeviceService,
              private appState: AppState,
              private formBuilder: FormBuilder,
              private userAccountService: UserAccountService,
              private metaService: MetaService) {
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((plans) => {
      this.userPlans = plans.filter((plan) => !!plan.mdn && !plan.portInRequestNumber && !plan.canceled && plan.planDevice.pendingNewSim);
    });
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
    });
    this.metaService.createCanonicalUrl();
    this.currentMobileNumberForm = this.formBuilder.group({
      mdn: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
 
  public swapSim(): void {
    this.currentMobileNumberForm.markAllAsTouched();
    if (!!this.currentMobileNumberForm.valid) {
      const mdn = this.currentMobileNumberForm.controls.mdn.value;
      const sim: any = Object.assign({}, JSON.parse(sessionStorage.getItem('activation')));
      let validatedIccid = '';
      if (!!sim) {
        validatedIccid = sim.iccid;
      }
      this.selectedPlan = this.userPlans.find((p) => p.mdn === mdn);
      this.modalHelper.showSIMModal('Enter your Replacement SIM’s ICCID', '', 'Activate', 'primary', 'Sim-replacement-iccid-modal',
         'tmo', 'Replacement SIM ICCID', true, false, (!!validatedIccid && validatedIccid.length > 0 ? validatedIccid : null)).result.then((result) => {
          if (!!result && result !== false && result.input) {
            const customHTML = '<div class="question"><p>You are about to swap to SIM <p class="iccid"><b>[' + result.input +
            ']</b></p> on Phone Number <b>' + this.selectedPlan?.mdn +
              '</b></p><p class="confirm">Is this correct?</p></div>';
            this.modalHelper.showInformationMessageModal('Confirmation', '',
              'Yes', null, true, 'confirm-swap-modal', customHTML, true, 'No',
              'Please make sure this is the phone number you want your new SIM associated to.  This change cannot be undone.').result.then((res) => {
                if (!!res && res === true) {
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
  }
  public goToActivationFlow(): void {
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
          this.toastHelper.showSuccess('SIM swap was successful!');
          this.userPlansService.selectUserPlan(this.selectedPlan.id);
          this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SUCCESS_SWAP}`]);
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
}
