import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUserProfileService, IUserPlan } from '@ztarmobile/zwp-service-backend';
import { EbbService, IAcpAddress, IAcpDetails, IAcpUser, IAppDetails } from '@ztarmobile/zwp-service-backend-v2';
import { take } from "rxjs/operators";
import { ACP_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ACP_CALLBACK_URL, INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { EbbManager } from 'src/services/ebb.service';
import { ModalHelperService } from 'src/services/modal-helper.service';

@Component({
  selector: 'app-not-existing-app-validation',
  templateUrl: './not-existing-app-validation.component.html',
  styleUrls: ['./not-existing-app-validation.component.scss']
})
export class NotExistingAppValidationComponent implements OnInit {
  @Output() back: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() acpData: IAcpDetails;
  @Input() customerId: string;
  @Input() applicationId: string;
  @Input() enrolled = false;
  @Input() userProfileId: string;

  public activeStep: number;
  public steps = [1, 2, 3, 4];
  public address: IAcpAddress;
  public callBackUrl: string;
  public userPlans: Array<IUserPlan>;
  public acpFinishAppUrl: any;
  public userSignedAgreement = false;
  public recaptchaResponse: any;
  public captchaValid = false;
  public acpSuccess = false;
  public acpError = false;
  public acpStatus: string;
  private grcaptcha;
  acpLink: any;
  constructor(public router: Router, private ebbManager: EbbManager, private appState: AppState,
    private ebbService: EbbService, private modalHelper: ModalHelperService,
    private userProfileService: FirebaseUserProfileService,
    private cdRef: ChangeDetectorRef) {
      this.ebbManager.validateCurrentStep(this.activeStep, true);
  }

  ngOnInit(): void {
    this.activeStep = 1;
    this.callBackUrl = `${ACP_CALLBACK_URL}/${ACP_ROUTE_URLS.BASE}`;
    if (!!this.customerId) {
      if (!!this.acpData) {
        this.address = this.acpData?.user?.address?.primary;
      } else {
        this.acpData = { user: { address: {} } as IAcpUser } as IAcpDetails;
      }
    }
  }
  ngAfterViewInit(): void {
  }
  public setPersonalInfo(data): void {
    data = this.appState.removeEmptyValues(data);
    data.last4ssn = data.identityVerification === 'tribal'? null : data.last4ssn;
    data.tribalId = data.identityVerification === 'tribal'? data.tribalId : null;
    this.acpData.user = data;
  }
  public setUserAddresses(data): void {
    data = this.appState.removeEmptyValues(data);
    this.acpData.user.address = { primary: data, mail: data };
  }
  public setBqpUserInfo(data): void {
    data = this.appState.removeEmptyValues(data);
    data.last4ssn = data.identityVerification === 'tribal'? null : data.last4ssn;
    data.tribalId = data.identityVerification === 'tribal'? data.tribalId : null;
    this.acpData.bqpUser = data || null;
    this.acpData.user.customerId = this.customerId;
  }
  public setSignedValue(data): void {
    this.recaptchaResponse = data.captcha;
    this.acpData.signature = data;
    this.acpData.callbackUrl = this.callBackUrl;
    this.appState.loading = true;
    this.callCreateInternalApp(true);
  }
  public cancel(): void {
    this.router.navigate([`${ROUTE_URLS.ACP}`]);
  }
  public goNext(): void {
    this.ebbManager.validateCurrentStep(this.activeStep, true);
  }
  public next(nextStepNumber): void {
    this.activeStep = nextStepNumber;
    this.callCreateInternalApp();
  }
  public goBack(): void {
    this.cdRef.detectChanges();
    window.scroll(0,0);
    if (this.activeStep === 1) {
      this.back.emit(true);
    } else {
      let changedActiveStep;
      this.activeStep -= 1;
      changedActiveStep = this.activeStep;
      this.cdRef.detectChanges();
      this.activeStep = changedActiveStep;
      this.cdRef.detectChanges();
      this.appState.loading = true;
      this.ebbService.getActiveInternalApplication(this.customerId).then(
        (res) => {
          if (!!res?.data) {
            this.acpData = res.data;
            this.address = this.acpData?.user?.address?.primary;
            this.appState.loading = false;
          }
        },
        (error) => {
          this.appState.loading = false;
        }
      );
  }
  }
  public callCreateInternalApp(callVerify?): void {
    if (this.acpData) {
      window.scroll(0,0);
      this.appState.loading = true;
      this.acpData = {
        brand: "goodmobile",
        applicationId: this.applicationId,
        customerId: this.customerId,
        ...this.acpData
      } as IAcpDetails;
      this.ebbService.createInternalApplication(this.acpData).then(
        (res) => {
          this.appState.loading = false;
          if(res?.applicationId) {
            this.applicationId = res?.applicationId;
          }
          if(!!callVerify) {
            this.callVerifyAcp();
          }
        },
        (error) => {
          this.appState.loading = false;
        }
      );
    }
  }
  private checkVerifyStatus(result: any): void {
    this.appState.loading = false;
    if (!!result && result?.status) {
      this.enrolled = true;
      if (result.status === "PENDING_REVIEW" || result.status === "IN_PROGRESS" ||
          result?.status === 'PENDING_ELIGIBILITY' ) {
        this.acpError = true;
        this.acpStatus = 'review';
      } else if (result?.status === "COMPLETE") {
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
  private callVerifyAcp(renewRecaptcha?: boolean): void {
    this.appState.loading = true;
    this.acpData.user.customerId = this.customerId;
    let appData: IAppDetails = {
      customerId: this.customerId,
      applicationId: this.applicationId,
      command: 'CreateACPWithoutProviderAppIdCommand'
    };
    if (!!appData && !!this.recaptchaResponse) {
      this.ebbService.verifyACPWithOrWithoutAppId(appData, this.recaptchaResponse).then(
        (result) => {
          this.appState.loading = false;
          // Post API, so we will use id not appId because its returned from the post API as id
          if (!!result && !!result?.ebbId) {
            this.userProfileService.userProfileObservable
              .pipe(take(1))
              .subscribe((profile) => {
                if (!!profile) {
                  profile.ebbId = result.ebbId;
                  // bff needs the eebid , and the user id ,so we must sent the profile data
                  this.userProfileService.bffUpdateUserProfile(profile);
                  this.acpFinishAppUrl = result?.link;
                  this.checkVerifyStatus(result);
                }
              });
          }
        },
        (error) => {
          this.appState.loading = false;
          this.acpSuccess = false;
          let errorMessage = "";
          let htmlMessage = "";
          this.enrolled = false;
          if(!!error && !!error.error && !!error.error.errors && error.error.errors.length > 0) {
            if (error.error.errors[0].customCode == 1146 || error.error.errors[0].code == 'APPLICATION_NOT_FOUND'){
              this.acpError = true;
              this.acpSuccess = false;
              this.acpStatus = 'not-found';
            } else if ( error.error.errors[0].type === "Validation Error") {
              errorMessage = !!error.error.errors[0].params
                ? error.error.errors[0].message +
                ", " +
                error.error.errors[0].params[0].param_value
                : error.error.errors[0].message;
              htmlMessage = `<p class="message">${error.error.errors[0].message
                }</p><p>${!!error.error.errors[0].params &&
                  !!error.error.errors[0].params[0].message
                  ? error.error.errors[0].params[0].message
                  : ""
                }</p><p>${!!error.error.errors[0].params &&
                  !!error.error.errors[0].params[0].param_value
                  ? error.error.errors[0].params[0].param_value
                  : ""
                }</p>`;
              this.loggifyError(errorMessage, htmlMessage);
            } else {
              errorMessage = error.error.errors[0].message;
              htmlMessage = `<p class="message">${error.error.errors[0].message}</p>`;
              this.loggifyError(errorMessage, htmlMessage);
            }
          } 
        }
      );
    }
  }
  private loggifyError(errorMessage, htmlMessage) : void {
    this.ebbService.logVerifyError(this.userProfileId, errorMessage);
    this.modalHelper.showInformationMessageModal(
      "ACP Validation Error",
      "",
      "Got it!",
      null,
      true,
      "ebb-validation",
      htmlMessage
    );
  }

}
