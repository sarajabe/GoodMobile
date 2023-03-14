/* eslint-disable max-len */
import {
  AfterContentChecked, ChangeDetectorRef, Component,
  EventEmitter, HostListener, Input, OnInit, Output
} from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseUserProfileService, IFirebaseEbbDetails, IUser, IUserPlan } from "@ztarmobile/zwp-service-backend";
import { EbbService, IAcpDetails, IAcpUser, IAppDetails, IVerificationRes } from "@ztarmobile/zwp-service-backend-v2";
import { take } from "rxjs/operators";
import { ACP_CALLBACK_URL } from "src/environments/environment";
import { EbbManager } from "src/services/ebb.service";
import { ModalHelperService } from "src/services/modal-helper.service";
import { AppState } from "../../app.service";
import { ACP_ROUTE_URLS, ROUTE_URLS } from "src/app/app.routes.names";

@Component({
  selector: 'app-acp-validation',
  templateUrl: './acp-validation.component.html',
  styleUrls: ['./acp-validation.component.scss']
})
export class AcpValidationComponent implements OnInit, AfterContentChecked {
  @Output() back: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() applicationId: string;
  @Input() acpData: IAcpDetails;
  @Input() customerId: string;
  @Input() enrolled = false;
  @Input() userProfileId: string;
  @Input() userPlans: Array<IUserPlan>;
  @Input() ebbId: string;

  public activeStep: number;
  public STEPS_CONTENT = {};
  public steps = [1, 2, 3, 4];
  public acpSuccess = false;
  public acpError = false;
  public acpStatus: string;

  public recaptchaResponse: any;
  public userProfile: IUser;
  public ebbVerifiedDetails: IVerificationRes;
  public userSignedAgreement = false;
  public acpFinishAppUrl: any;
  public is609ErrorCode = false;
  private callBackUrl: string;
  private firebaseDetails: IFirebaseEbbDetails;
  public primaryAddress: any;
  public mailAddress: any;
  acpLink: any;

  constructor(
    private ebbManager: EbbManager,
    public router: Router,
    private ebbService: EbbService,
    private userProfileService: FirebaseUserProfileService,
    private modalHelper: ModalHelperService,
    private appState: AppState,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activeStep = 1;
    this.callBackUrl = `${ACP_CALLBACK_URL}/${ACP_ROUTE_URLS.BASE}`;
    if (!!this.customerId) {
      if (!!this.acpData) {
        this.primaryAddress = this.acpData?.user?.address?.primary;
        this.mailAddress = this.acpData?.user?.address?.mail;
      } else {
        this.acpData = { user: { address: {} } as IAcpUser } as IAcpDetails;
      }
    }
    if (!!this.enrolled) {
      this.callGetVerifyAcp(this.ebbId);
    }
  }

  ngAfterContentChecked(): void {
    this.STEPS_CONTENT = {
      1: {
        stepTitle: 'Personal Information',
        stepDesc: 'Please enter your Peronsal Information you would like to be sent to the National Verifier',
        stepExtraDesc: null
      },
      2: {
        stepTitle: 'Address Information',
        stepDesc: 'Please provide a physical address or the exact address that you submitted to the National Verifier.',
        stepExtraDesc: null
      },
      3: {
        stepTitle: 'Qualified Programs',
        stepDesc: 'Select the qualifying program(s) for the Affordable Connectivity Program.',
        stepExtraDesc: null
      },
      4: {
        stepTitle: 'Almost there!',
        stepDesc: 'Customer Notice and Agreement',
        stepExtraDesc: 'To apply for service under the Federal ACP with Good Mobile, you should agree and initial the following:'
      }
    }
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
    window.scroll(0, 0);
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
            this.appState.loading = false;
            this.primaryAddress = res.data?.user?.address?.primary;
            this.mailAddress = res.data?.user?.address?.mail;
            this.acpData = res.data;
            this.applicationId = res?.data?.applicationId;
          }
        },
        (error) => {
          this.appState.loading = false;
        }
      );
    }
  }

  public setSignedValue(data): void {
    this.recaptchaResponse = data.captcha;
    this.acpData.signature = data;
    this.acpData.callbackUrl = this.callBackUrl;
    this.appState.loading = true;
    this.callCreateInternalApp(true);
  }

  public setPersonalInfo(data): void {
    data.last4ssn = data.identityVerification === 'tribal'? null : data.last4ssn;
    data.tribalId = data.identityVerification === 'tribal'? data.tribalId : null;
    this.acpData.user = data;
  }

  public setBqpUserInfo(data): void {
    data = this.appState.removeEmptyValues(data);
    if (!!data.user) {
      data.user.last4ssn = data?.user?.identityVerification === 'tribal'? null : data.user.last4ssn;
      data.user.tribalId = data?.user?.identityVerification === 'tribal'? data.user.tribalId : null;
    }
    this.acpData.bqpUser = data?.user || null;
    this.acpData.eligibilityCode = data?.code;
    this.acpData.schoolName = data?.schoolName || null;
    this.acpData.publicHousingCode = data?.publicHousingCode || null;
  }

  public setUserAddresses(data): void {
    this.acpData.user.address = { primary: data.primary, mail: data.mail };
    this.acpData.user.customerId = this.customerId;
    this.primaryAddress = data.primary;
    this.mailAddress = data.mail;
  }

  private callCreateInternalApp(callVerify?): void {
    if (this.acpData) {
      window.scroll(0, 0);
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
          if (res?.applicationId) {
            this.applicationId = res?.applicationId;
          }
          if (!!callVerify) {
            this.callVerifyAcp();
          }
        },
        (error) => {
          this.appState.loading = false;
        }
      );
    }
  }

  private callGetVerifyAcp(userProfileEbbId): void {
    this.appState.loading = true;
    this.ebbService
      .getACPApplicationStatus(userProfileEbbId, this.customerId, this.callBackUrl)
      .then(
        (details) => {
          this.appState.loading = false;
          if (!!details) {
            this.is609ErrorCode = false;
            this.acpFinishAppUrl = details.link;
            this.checkVerifyStatus(details);
            this.userSignedAgreement = details?.signed;
            this.acpData = { user: { address: {} } as IAcpUser } as IAcpDetails;
            this.ebbVerifiedDetails = details as IVerificationRes;
            this.acpData.user = this.ebbVerifiedDetails.user;
            this.acpData.eligibilityCode =
              this.ebbVerifiedDetails.eligibilityCode;
            this.acpData.bqpUser = this.ebbVerifiedDetails?.bqpUser;
            this.acpData.schoolName = this.ebbVerifiedDetails?.schoolName;
            this.acpData.publicHousingCode = this.ebbVerifiedDetails?.publicHousingCode;
            this.primaryAddress = this.acpData?.user?.address?.primary;
            this.mailAddress = this.acpData?.user?.address?.mail;
            this.acpData.signature = details?.signatureInfo;
            this.acpData.user.identityVerification = !!this.acpData.user
              .last4ssn
              ? "ssn"
              : "tribal";
            if (!!this.acpData.bqpUser) {
              this.acpData.bqpUser.identityVerification = !!this.acpData.user
                .last4ssn
                ? "ssn"
                : "tribal";
            }
            const dob = new Date(this.acpData.user.dob);
            const month = dob.getMonth() + 1;
            const dobMonth = month < 10 ? `0${month}` : month;
            const day = dob.getDate();
            const dobDay = day < 10 ? `0${day}` : day;
            this.acpData.user.dob =
              dobMonth + "/" + dobDay + "/" + dob.getFullYear();
            if (!!this.acpData.bqpUser) {
              const bpdob = new Date(this.acpData.bqpUser.dob);
              const bpmonth = dob.getMonth() + 1;
              const bpdobMonth = bpmonth < 10 ? `0${bpmonth}` : bpmonth;
              const bpday = dob.getDate();
              const bpdobDay = bpday < 10 ? `0${bpday}` : bpday;
              this.acpData.bqpUser.dob =
                bpdobMonth + "/" + bpdobDay + "/" + bpdob.getFullYear();
            }
            this.acpData = this.appState.removeEmptyValues(this.acpData);
          }
        },
        (error) => {
          this.appState.loading = false;
          this.activeStep = 1;
          if (
            !!error &&
            !!error.error &&
            !!error.error.errors &&
            error.error.errors.length > 0
          ) {
            if (error.error.errors[0].code === 609) {
              this.activeStep = 4;
              if (!!this.firebaseDetails) {
                this.acpData.user.firstName =
                  this.firebaseDetails?.user?.firstName;
                this.acpData.user.lastName =
                  this.firebaseDetails?.user?.lastName;
              }
              this.is609ErrorCode = true;
              this.enrolled = false;
            }
          }
        }
      );
  }

  private loggifyError(errorMessage, htmlMessage): void {
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

  private checkVerifyStatus(result: any): void {
    this.appState.loading = false;
    if (!!result && result?.status) {
      this.enrolled = true;
      if (result.status === "PENDING_REVIEW" || result.status === "IN_PROGRESS" ||
        result?.status === 'PENDING_ELIGIBILITY') {
        this.acpError = true;
        this.acpStatus = 'review';
      } else if (result?.status === "COMPLETE") {
        this.acpSuccess = true;
        this.acpError = false;
      } else if (!result.link && (result?.status === 'PENDING_RESOLUTION' || result?.status === 'PENDING_CERT')) {
        this.acpSuccess = false;
        this.acpStatus = 'not-complete';
        this.acpError = true;
      } else if (!!result.link && (result?.status === 'PENDING_RESOLUTION' || result?.status === 'PENDING_CERT')) {
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
      command: 'CreateNewACPCommand'
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
          if (!!error && !!error.error && !!error.error.errors && error.error.errors.length > 0) {
            if (error.error.errors[0].customCode == 1146 || error.error.errors[0].code == 'APPLICATION_NOT_FOUND') {
              this.acpError = true;
              this.acpSuccess = false;
              this.acpStatus = 'not-found';
            } else if (error.error.errors[0].type === "Validation Error") {
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
  @HostListener("window:popstate", ["$event"])
  onPopState(event): void {
    this.appState.loading = false;
  }

}
