import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUserPlan, SimActivationService } from '@ztarmobile/zwp-service-backend';
import { ACTIVATION_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { CUSTOMER_CARE_NUMBER } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-activate-plan',
  templateUrl: './activate-plan.component.html',
  styleUrls: ['./activate-plan.component.scss']
})
export class ActivatePlanComponent {
  public pendingPlans: IUserPlan;
  public userPlans: IUserPlan[];
  public activateForm: UntypedFormGroup;
  public prefundedPlanId: string;
  public isPrefundedSIM = false;
  public customerCareNumber = CUSTOMER_CARE_NUMBER;
  public showErrorMessage = false;

  constructor(private router: Router,
              private simActivationService: SimActivationService,
              private appState: AppState,
              private metaService: MetaService,
              private formBuilder: UntypedFormBuilder,
              private toastHelper: ToastrHelperService,
              private modalHelper: ModalHelperService) {
   
    this.activateForm = formBuilder.group({
      code: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Z]+\\d{6}|\\d{7}$')])]
    });
    this.metaService.createCanonicalUrl();
    sessionStorage.removeItem('activation');
    sessionStorage.removeItem('device');

  }

  public goToSimCheck(): void {
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.SIM_CHECK}`]);
  }
  public showActivationModal(): void {
    this.modalHelper.showInformationMessageModal('Where to find your Activation Code', '', 'Got it!', null, true, 'activation-info-modal',
      `<div class="text-content-holder">
        <p class="text">Your Activation Code is on the back of your SIM card, you can find it on the bottom of the card. It is a 7 digit number.</p>
     </div>
     <div class="image-container">
      <img class="activation-image" src="assets/img/simActivation.png"/>
     </div>`
    );
  }
  public checkSimActivationCode(): void {
    this.activateForm.markAllAsTouched();
    if (this.activateForm.valid) {
      this.appState.loading = true;
      this.simActivationService.checkActivationCodeWithNoAuth(this.activateForm.get('code').value)
        .then((sim) => {
          if (!!sim) {
            sessionStorage.setItem('activation', JSON.stringify(sim));
          }
          this.appState.loading = false;
          const params = {};
          params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE] = this.activateForm.get('code').value;
          params[ROUTE_URLS.PARAMS.NETWORK] = sim.network;
          if (sim.prefunded) {
            this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
          } else {
            this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_PLANS_PATH}`, params]);
          }
        }).catch((error) => {
          // Failed to detect the sim by activation code
          this.appState.loading = false;
          if (error.status === 400) {
            this.showErrorMessage = true;
            this.activateForm.controls.code.setErrors({ invalid: true });
          } else {
            this.toastHelper.showAlert(error.message);
          }
        });
    }
  }
 
}
