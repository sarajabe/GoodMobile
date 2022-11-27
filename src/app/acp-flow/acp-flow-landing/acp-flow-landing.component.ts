import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseUserProfileService, IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { filter, take, takeWhile } from 'rxjs/operators';
import { AppState } from 'src/app/app.service';
import { ACP_CALLBACK_URL } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS, ROUTE_URLS } from '../../app.routes.names';

@Component({
  selector: 'app-acp-flow-landing',
  templateUrl: './acp-flow-landing.component.html',
  styleUrls: ['./acp-flow-landing.component.scss']
})
export class AcpFlowLandingComponent implements OnInit, OnDestroy {
  public acpFlowForm: FormGroup;
  public acpOption: string;
  public acpData: any = {};
  public enrolled = false;
  public showAcpValidationMsg = false;
  public showAcpComponents = false;
  public newApplication = false;
  public yesWithNonExistingApp = false;
  public yesExistingAppId = false;
  public acpSuccess = false;
  public acpError = false;
  public isActivatedWithEbbPlan = false;
  public customerId: string;
  public applicationId: string;
  public userPlans: Array<IUserPlan>;
  public userId: string;
  public acpStatus: string;
  public ebbId:string;
  public isExitingPlan = false;
  public acpOptions = [{ id: 'yes', value: 'Yes' },
  { id: 'yes-without-id', value: 'Yes, but I don’t have it now' },
  { id: 'no', value: 'No' }];
  public callBackUrl: string;
  public acpLink: string;
  private alive = true;
  constructor(private router: Router, private userProfileService: FirebaseUserProfileService,
    private appState: AppState, private ebbService: EbbService, private modalHelper: ModalHelperService,
    private userPlansService: UserPlansService, private toastHelper: ToastrHelperService) {
    this.acpFlowForm = new FormGroup({
      option: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.callBackUrl = `${ACP_CALLBACK_URL}/${ACP_ROUTE_URLS.BASE}`;
    this.userPlansService.userPlans
      .pipe(takeWhile(() => this.alive))
      .pipe(filter((plans) => !!plans))
      .subscribe((plans) => {
        if (!!plans) {
          const userEbbPlan = plans.find((p) => p.basePlan && !!p.basePlan.ebb && !p.canceled);
          this.isActivatedWithEbbPlan = !!userEbbPlan ? true : false;
          this.userPlans = plans;
          if (!this.isActivatedWithEbbPlan) {
            setTimeout(() => {
              this.userProfileService.userProfileObservable
                .pipe(
                  take(1),
                  filter((user) => !!user)
                )
                .subscribe((user) => {
                  if (!!user && !!user?.ebbId) {
                    this.appState.loading = true;
                    this.enrolled = true;
                    this.acpFlowForm.disable();
                    this.ebbId = user.ebbId;
                    this.ebbService
                      .getACPApplicationStatus(this.ebbId, user.customerId, this.callBackUrl)
                      .then(
                        (details) => {
                          this.appState.loading = false;
                          if (!!details) {
                            this.checkVerifyStatus(details);
                          }
                        },
                        (error) => {
                          this.appState.loading = false;
                          this.acpSuccess = false;
                          if (!!error && !!error.error && !!error.error.errors && error.error.errors.length > 0) {
                            if (error.error.errors[0].code === 608) {
                              this.isExitingPlan = true;
                              this.callAcpPlanExistModal();
                            } else {
                              this.toastHelper.showAlert(error.error.errors[0].message);
                            }
                          }
                        }
                      );
                  } else {
                    this.appState.loading = true;
                    this.customerId = user?.customerId;
                    this.userId = user?.id;
                    // call get app state to know which option shall we select 
                    this.ebbService.getActiveInternalApplication(this.customerId).then(
                      (res) => {
                        if (!!res?.data) {
                          this.acpData = res.data;
                          if (!!this.acpData) {
                            this.applicationId = this.acpData?.applicationId;
                            if (!!this.acpData?.providerApplicationId) {
                              this.showAcpValidationMsg = false;
                              this.acpFlowForm?.controls.option.setValue('yes');
                            } else if (!!this.acpData?.eligibilityCode) {
                              this.showAcpValidationMsg = false;
                              this.acpFlowForm?.controls.option.setValue('no');
                            } else {
                              this.showAcpValidationMsg = false;
                              this.acpFlowForm?.controls.option.setValue('yes-without-id');
                            }
                            this.acpOption = this.acpFlowForm?.get('option')?.value;
                          }
                          this.appState.loading = false;
                        }
                      },
                      (error) => {
                        this.appState.loading = false;
                      }
                    );
                  }
                });
            }, 100);
          } else {
            this.callAcpPlanExistModal();
            setTimeout(() => {
              if (this.router.url.includes(ACP_ROUTE_URLS.BASE) && !this.router.url.includes(ACP_ROUTE_URLS.ENROLLMENT_EXISTING_LINE) && !this.router.url.includes(ACP_ROUTE_URLS.ENROLLMENT_NEW_LINE)) {
                this.isExitingPlan = true;
                this.callAcpPlanExistModal();
              }
            }, 600);
          }
        }
      });
  }
  public onOptionChange(): void {
    this.acpOption = this.acpFlowForm.get('option').value;
    if (!!this.acpOption) {
      this.showAcpValidationMsg = false;
    }
  }
  public cancel(): void {
    this.router.navigate([ROUTE_URLS.ACP])
  }
  public goNext(): void {
    if (!!this.acpOption) {
      this.showAcpValidationMsg = false;
      this.showAcpComponents = true;
      if (this.acpOption === 'no') {
        this.acpData.providerApplicationId =  null;
        this.newApplication = true;
      } else if (this.acpOption === 'yes') {
        this.yesExistingAppId = true;
        this.acpData.identityVerification = null;
        this.acpData.tribalId = null;
        this.acpData.last4ssn = null;
        this.acpData.eligibilityCode = null;
        this.acpData.bqpUser = null;
      } else if (this.acpOption === 'yes-without-id') {
        this.acpData.providerApplicationId =  null;
        this.yesWithNonExistingApp = true;
        this.acpData.eligibilityCode = null;
        this.acpData.bqpUser = null;
      }
    }
    else {
      this.showAcpValidationMsg = true;
      window.scroll(0, 0);
    }
  }
  public back(event): void {
    if (!!event) {
      this.showAcpComponents = false;
      this.yesWithNonExistingApp = false;
      this.newApplication = false;
      this.yesExistingAppId = false;
    }
  }
  private checkVerifyStatus(result: any): void {
    this.appState.loading = false;
    if (!!result) {
      if (result.status === "PENDING_REVIEW" || result.status === "IN_PROGRESS" || result?.status === 'PENDING_ELIGIBILITY') {
        // thats mean the status is PENDING_REVIEW
        this.acpError = true;
        this.acpStatus = 'review';
        this.acpSuccess = false;
      } else if (result.status === "COMPLETE") {
        this.acpSuccess = true;
        this.acpError = false;
      }  else if (!result.link && (result?.status === 'PENDING_RESOLUTION'|| result?.status === 'PENDING_CERT') ) {
        this.acpSuccess = false;
        this.acpStatus = 'not-complete';
        this.acpError = true;
      } else if (!!result.link && (result?.status === 'PENDING_RESOLUTION'|| result?.status === 'PENDING_CERT') ) {
        this.acpStatus = 'pendingAction';
        this.acpLink = result.link;
        this.acpSuccess = true;
        this.acpError = false;
      }
    }
  }
  private callAcpPlanExistModal(): void {
    this.modalHelper
      .showInformationMessageModal(
        "ACP Plan Exists",
        "You already have a Federal Affordable Connectivity plan!",
        "Account Summary"
      )
      .result.then((res) => {
        if (!!res) {
          this.router.navigate([
            `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`,
          ]);
        }
      });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  @HostListener("window:keydown.esc", ["$event"])
  onEsc(event: any): void {
    if (event.keyCode === 27) {
      event.preventDefault();
      if(!!this.isExitingPlan) {
     this.callAcpPlanExistModal();
      }
    }
  }
}
