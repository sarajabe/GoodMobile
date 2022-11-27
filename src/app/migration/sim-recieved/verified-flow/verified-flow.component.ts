import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { ACCOUNT_ROUTE_URLS, MIGRATION_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-verified-flow',
  templateUrl: './verified-flow.component.html',
  styleUrls: ['./verified-flow.component.scss']
})
export class VerifiedFlowComponent implements OnInit {
  @Output() verifyFlow = new EventEmitter<boolean>();
  @Input() selectedPlan: IUserPlan;
  @Input() phoneImei;
  @Input() planMdn;
  @Input() selectedPlanId;

  public activationForm: FormGroup;
  public MIGRATION_ROUTE_URLS = MIGRATION_ROUTE_URLS;

  constructor(private userPlansService: UserPlansService, private toastHelper: ToastrHelperService, private router: Router, private appState: AppState) { }

  ngOnInit(): void {
    this.activationForm = new FormGroup({
      activationCode: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(7), Validators.minLength(7), Validators.pattern('^[A-Z]+\\d{6}|\\d{7}$')]))
    });
  }

  public back(): void {
    this.verifyFlow.emit(false);
  }

  public startMigrationService(): void {
    let code = '';
    this.activationForm.markAllAsTouched();
    if (!!this.selectedPlan.eSimDetails) {
      code = this.selectedPlan.eSimDetails.activationCode;
      code = code.trim();
      this.callMigrationService(code)
    } else {
      this.activationForm.markAllAsTouched();
      if (this.activationForm.valid) {
        code = this.activationForm.get('activationCode').value;
        this.callMigrationService(code)
      }
    }
    
  }
  private callMigrationService(code): void {
    this.appState.loading = true;
    this.userPlansService.submitMigrationRequest(this.planMdn, {activationCode: code}).then((result) => {
      this.toastHelper.showSuccess('Migration Request Submitted Successfully!');
      this.appState.loading  = false;
      this.userPlansService.getUserPlan(this.selectedPlanId).then((plan) => {
        plan.planDevice.id = this.phoneImei;
        plan.planDevice.pendingMigrationSim = false;
        delete plan.migrationDevice;
        this.userPlansService.updateUserPlan(plan.userId, plan).then(() => {
          this.userPlansService.selectUserPlan(this.selectedPlanId);
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
        }, (error) => {
          this.toastHelper.showAlert(error.message || error.error ? error.error.message : error);
        });
      });
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message);
    });
  }
}
