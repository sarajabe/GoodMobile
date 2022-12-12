import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUserProfileService, IUser, IUserAccount, IUserPlan, UserAccountService, UserOrdersService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService, IEbbDetails, IVerificationRes } from '@ztarmobile/zwp-service-backend-v2';
import { filter, take, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS, ACTIVATION_ROUTE_URLS, ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ACP_CALLBACK_URL } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../account-header.service';

@Component({
  selector: 'app-account-acp-application',
  templateUrl: './account-acp-application.component.html',
  styleUrls: ['./account-acp-application.component.scss']
})
export class AccountAcpApplicationComponent implements OnInit, AfterContentChecked, OnDestroy {
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public userProfile: IUser;
  public verificationDetails: IVerificationRes;
  public acpAppDetails: any = {};
  public nvStatus: string;
  public appStatus: string;
  public planActivationStatus: string;
  public ROUTE_URLS = ROUTE_URLS;
  public ACP_ROUTE_URLS = ACP_ROUTE_URLS;
  public isActivatedAcpPlan = false;
  public acpPlan: IUserPlan;
  public userAccount: IUserAccount;
  public processingRequest = false;
  public isRefreshClicked = false;
  public timeLeft = 300000; // 5 Minutes
  public interval = null;
  public seconds: any = 0;
  public minutes: any = 0;
  public showExpiredSection = false;
  public ACP_STATUS = {
    COMPLETE: 'COMPLETE',
    PENDING_RESOLUTION: 'PENDING_RESOLUTION',
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    PENDING_REVIEW: 'PENDING_REVIEW',
    PENDING_CERT: 'PENDING_CERT'
  };
  public STATUS_TITLE = {
    COMPLETE: 'Complete',
    IN_PROGRESS: 'In Progress',
    PENDING_REVIEW: 'Pending Review',
    PENDING_CERT: 'Pending Certification',
    PENDING_RESOLUTION: 'Pending Resolution',
    PENDING: 'Pending',
    PENDING_ELIGIBILITY: 'On Hold'
  };
  public ACP_PLAN_STATUS_TITLE = {
    PENDING: 'Pending',
    PENDING_WITH_MDN: 'Pending',
    ON_HOLD: 'On Hold',
    PENDING_ACTIVATION: 'Pending Activation',
    ENROLLED: 'Enrolled'
  };
  public hideCardContentNV = false;
  public hideCardContentSP = false;
  public hideCardContentPA = false;
  public showNVOnHoldSection = false;
  public showNVErrorSection = false;
  public showGenericError = false;
  public showNVCard = false;
  public showSPCard = false;
  public showCardDesc = false;
  public showAlert = false;
  public ACP_DESCS = {};
  public ACP_PLAN_DESCS = {};
  public NV_DESCS = {};
  public showAcpApplicationCard = false;
  public showSuccessBanner = true;
  public isDisplayNone = false;
  public showAcpPlanActivationCard = false;
  public activePlans: Array<IUserPlan>;
  public appDetails: any = {};

  private callBackUrl: string;
  private alive = true;

  constructor(
    private accountHeaderService: AccountHeaderService,
    private metaService: MetaService,
    private ebbService: EbbService,
    private userProfileService: FirebaseUserProfileService,
    private appState: AppState,
    private router: Router,
    private toastHelper: ToastrHelperService,
    private userPlansService: UserPlansService,
    private userAccountService: UserAccountService,
    private modalHelper: ModalHelperService,
    private accountOrderService: UserOrdersService,) {

    this.accountHeaderService.setPageTitle('Your ACP application');
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setAccountMenuVisibility(true);

    this.callBackUrl = `${ACP_CALLBACK_URL}/${ACP_ROUTE_URLS.BASE}`;
    const time = JSON.parse(sessionStorage.getItem('refreshTime'));
    if (time > 0) {
      this.timeLeft = time;
      this.timer();
      this.refreshInterval();
      this.isRefreshClicked = true;
    }
    this.getVerificationDetails();
  }

  public hideSuccessBanner(): void {
    setInterval(() => {
      this.showSuccessBanner = false;
    }, 10000);
    setInterval(() => {
      this.isDisplayNone = true;
    }, 11000);
  }

  ngAfterContentChecked(): void {
    this.ACP_DESCS = {
      'In Progress': {
        title: 'Application in progress',
        desc1: `Your ACP application has started with Good Mobile. Please complete your application
         as soon as possible and start enjoying your ACP Free Cell phone Service.`,
        desc2: null,
        buttonName: 'Complete Application',
        buttonAction: 'goToAcpForm',
        longClass: true
      },
      'On Hold': {
        title: 'We are Sorry!',
        desc1: 'We are unable to approve your Request at this time.',
        desc2: 'Please contact customer care for more help.',
        buttonName: 'Contact Us',
        buttonAction: 'goToContactUs',
        longClass: false
      }
    }
    this.ACP_PLAN_DESCS = {
      'PENDING': {
        title: 'Action Required:',
        desc1: 'Please add a new line in order to proceed with your ACP benefits',
        desc2: null,
        desc3: null,
        primaryButtonName: 'Add New Line',
        primaryButtonAction: 'addNewLine',
        secondaryButtonName: null,
        secondaryButtonAction: null,
        linkName: null,
        linkAction: null,
        pendingWidth: false,
        onHoldWidth: false,
        topBottomClass: false,
        longClass: false
      },
      'PENDING_WITH_MDN': {
        title: 'Action Required:',
        desc1: 'Please add a new line or choose an existing one in order to proceed with your ACP benefits',
        desc2: null,
        desc3: null,
        primaryButtonName: 'Add New Line',
        primaryButtonAction: 'addNewLine',
        secondaryButtonName: 'Select Existing Line',
        secondaryButtonAction: 'selectExistingLine',
        linkName: null,
        linkAction: null,
        pendingWidth: true,
        onHoldWidth: false,
        topBottomClass: false,
        longClass: true
      },
      'ON_HOLD': {
        title: 'Attention!',
        desc1: 'We are unable to activate your ACP plan at this time.',
        desc2: 'Please try again or call customer care for more help.',
        desc3: null,
        primaryButtonName: 'View Purchased Plan',
        primaryButtonAction: 'viewPurchasedPlan',
        secondaryButtonName: 'Contact Us',
        secondaryButtonAction: 'goToContactUs',
        linkName: null,
        linkAction: null,
        pendingWidth: false,
        onHoldWidth: true,
        topBottomClass: false,
        longClass: true
      },
      'PENDING_ACTIVATION': {
        title: 'Action Required:',
        desc1: 'Please Activate your line and start using your ACP plan',
        desc2: null,
        desc3: null,
        primaryButtonName: 'Activate Your Plan',
        primaryButtonAction: 'activatePlan',
        secondaryButtonName: null,
        secondaryButtonAction: null,
        linkName: 'Cancel Order',
        linkAction: 'cancelOrder',
        pendingWidth: false,
        onHoldWidth: false,
        topBottomClass: false,
        longClass: true
      },
      'ENROLLED': {
        title: null,
        desc1: 'You have successfully activated your ACP plan.',
        desc2: 'This plan is linked to the following phone number:',
        desc3: `Phone Number/MDN: <b>${this.acpPlan?.mdn}</b>`,
        primaryButtonName: 'Account Summary',
        primaryButtonAction: 'goToAccountSummary',
        secondaryButtonName: null,
        secondaryButtonAction: null,
        linkName: null,
        linkAction: null,
        pendingWidth: false,
        onHoldWidth: false,
        topBottomClass: true,
        longClass: true
      }
    }
    this.NV_DESCS = {
      'COMPLETE': {
        title: null,
        desc1: 'Your application was successfully verified by the National Verifier.',
        desc2: null,
        desc3: null,
        desc4: null,
        buttonName: null,
        buttonAction: null,
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'PENDING_RESOLUTION': {
        title: 'Action Required:',
        desc1: `Please select <b>“Resume Filing”</b> to be redirected to the National Verifier. Once
        you are done, the National Verifier will redirect you back to Good Mobile to complete the
        process.`,
        desc2: `<b>Please make sure to complete this step within 45 days.</b>`,
        desc3: null,
        desc4: null,
        buttonName: 'Resume Filing',
        buttonAction: 'goToAcp',
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'PENDING_CERT': {
        title: 'Action Required:',
        desc1: `Please select <b>“Resume Filing”</b> to be redirected to the National Verifier. Once
        you are done, the National Verifier will redirect you back to Good Mobile to complete the
        process.`,
        desc2: `<b>Please make sure to complete this step within 45 days.</b>`,
        desc3: null,
        desc4: null,
        buttonName: 'Resume Filing',
        buttonAction: 'goToAcp',
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'IN_PROGRESS': {
        title: 'Please Check Back Soon!',
        desc1: `<b>You have submitted your ACP application successfully.</b> Updates on your
        application status will show up on this page.`,
        desc2: `<b>Please make sure to complete this step within 45 days.</b>`,
        desc3: null,
        desc4: null,
        buttonName: 'Refresh',
        buttonAction: 'refresh',
        linkName: null,
        linkAction: null,
        disabledCondition: 'isRefreshClicked',
        noteCondition: 'isRefreshClicked',
        note: `You can refresh again in ${this.minutes}:${this.seconds} minutes.`,
        longClass: false
      },
      'PENDING_REVIEW': {
        title: 'Under Review!',
        desc1: `Your ACP application is currently under review.`,
        desc2: `Please contact <a href="mailto:ACProgram@usac.org"><b>ACProgram@usac.org</b></a> to
        check on your application status before
        finish the enrollment with Good Mobile.`,
        desc3: null,
        desc4: null,
        buttonName: 'Refresh',
        buttonAction: 'refresh',
        linkName: null,
        linkAction: null,
        disabledCondition: 'isRefreshClicked',
        noteCondition: 'isRefreshClicked',
        note: `You can refresh again in ${this.minutes}:${this.seconds} minutes.`,
        longClass: false
      },
      'PENDING_ELIGIBILITY': {
        title: 'Action Required:',
        desc1: `Please check your information again or provide more details to the National Verifier
        to proceed with your ACP application.`,
        desc2: `Please select “Cancel Application” if you’d like to withdraw your application.`,
        desc3: null,
        desc4: null,
        buttonName: 'Go to National Verifier',
        buttonAction: 'goToNationalVerifier',
        linkName: 'Cancel Application',
        linkAction: 'cancelApplication',
        disabledCondition: 'isRefreshClicked',
        noteCondition: null,
        note: null,
        longClass: true
      },
      'PENDING': {
        title: 'Attention!',
        desc1: `It seems like you <b>have not completed your ACP application with the National
        Verifier</b> yet. Please visit <a href="https://www.affordableconnectivity.gov/"
        target="_blank"><b>ACPbenefit.org</b></a> to complete your application before
        finish the enrollment with Good Mobile.`,
        desc2: null,
        desc3: null,
        desc4: null,
        buttonName: null,
        buttonAction: null,
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'EXPIRED': {
        title: 'Expired ACP Application',
        desc1: `Sorry, <b>your ACP application isn’t available!</b>`,
        desc2: `It may have already been expired because it is too old.`,
        desc3: `<b>No problem!</b>`,
        desc4: `You can always try starting again and enjoy your <b>6GB</b> FREE Cell Phone Service
        with <span class="bold-nowrap">Good Mobile!</span>`,
        buttonName: 'Apply Now',
        buttonAction: 'applyNow',
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'NV_ERROR': {
        title: 'Sorry for the inconvenience!',
        desc1: `The National Verifier is currently unavailable. Please check back soon.`,
        desc2: null,
        desc3: null,
        desc4: null,
        buttonName: null,
        buttonAction: null,
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'GENERIC': {
        title: 'We are Sorry!',
        desc1: `We are unable to approve your Request at this time.`,
        desc2: `Please contact customer care for more help.`,
        desc3: null,
        desc4: null,
        buttonName: `Contact Us`,
        buttonAction: `goToContactUs`,
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      }
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public activatePlan(): void {
    if (!this.isActivatedAcpPlan && this.acpPlan) {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.acpPlan.id;
      if (!!this.acpPlan && !!this.acpPlan.planDevice && !!this.acpPlan.planDevice.id) {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
      } else {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
      }
    }
  }

  public cancelApplication(): void {
    if (!!this.userProfile) {
      this.modalHelper.showConfirmMessageModal('Are you sure you want to cancel application?', 'By clicking yes you agree to cancel your ACP application.', 'Yes', 'Cancel', 'clean-cart-modal')
        .result.then((res) => {
          if (!!res) {
            this.appState.loading = true;
            delete this.userProfile.ebbId;
            this.userAccountService.deleteEbb().then(() => {
              this.ebbService.deleteEbbData(this.userProfile?.id);
              this.appState.loading = false;
              this.toastHelper.showSuccess('Your application is cancelled successfully');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
            }).catch((error) => {
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message);
            });
          }
        });
    }
  }

  public refresh(): void {
    this.getVerificationDetails();
    this.isRefreshClicked = true;
    this.timer();
    this.refreshInterval();
  }

  public cancelPlan(): void {
    if (!!this.userAccount && !!this.acpPlan && !this.acpPlan.portInRequestNumber && !this.acpPlan.canceledOnExpiry && !this.acpPlan.canceled) {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.acpPlan.id;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.CANCEL_PLAN}`, params]);
    }
  }

  public cancelOrder(): void {
    this.modalHelper.showConfirmMessageModal('Cancel order', 'Are you sure you want to cancel your order ?',
      'Yes', 'No', 'clean-cart-modal')
      .result.then((result) => {
        if (!!result) {
          this.appState.loading = true;
          this.accountOrderService.cancelWithRefund(this.acpPlan?.orderId).then((order) => {
            if (!!order) {
              this.appState.loading = false;
              this.toastHelper.showSuccess('Your order has been canceled successfully!');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
            }
          }).catch((error) => {
            this.appState.loading = false;
            this.toastHelper.showAlert(error.message);
          });
        }
      });
  }

  public goToAccountSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }

  public goToNationalVerifier(): void {
    window.open('https://acpbenefit.org/do-i-qualify/', '_self');
    this.appState.loading = true;
  }

  public applyNow(): void {
    if (!!this.userProfile) {
      this.appState.loading = true;
      delete this.userProfile.ebbId;
      this.userAccountService.deleteEbb().then(() => {
        this.ebbService.deleteEbbData(this.userProfile?.id);
        this.appState.loading = false;
        this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
      }).catch((error) => {
        this.appState.loading = false;
        this.toastHelper.showAlert(error.message);
      });
    }
  }
  public addNewLine(): void {
    this.router.navigate([`${ACP_ROUTE_URLS.BASE}/${ACP_ROUTE_URLS.ENROLLMENT_NEW_LINE}`]);

  }
  public selectExistingLine(): void {
    this.router.navigate([`${ACP_ROUTE_URLS.BASE}/${ACP_ROUTE_URLS.ENROLLMENT_EXISTING_LINE}`]);

  }
  public goToAcp(): void {
    window.open(`${this.verificationDetails?.link}`, "_self");
  }
  public goToAcpForm(): void {
    this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
  }
  public goToContactUs(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.CONTACT_US}`]);

  }
  private getVerificationDetails(): void {
    this.userProfileService.userProfileObservable.subscribe((user) => {
      this.userProfile = user;
      if (!!this.userProfile && !this.userProfile.ebbId) {
        this.appState.loading = true;
        this.ebbService.getActiveInternalApplication(this.userProfile.customerId).then((res) => {
          if (!!res) {
            this.acpAppDetails = res;
            this.appState.loading = false;
            this.appStatus = 'In Progress';
            this.showAcpApplicationCard = true;
          }
        }, (error) => {
          this.appStatus = 'On Hold';
          this.showAlert = true;
          this.showAcpApplicationCard = true;
          this.appState.loading = false;
        });
      } else if (!!this.userProfile && !!this.userProfile.ebbId) {
        this.appState.loading = true;
        this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
          if (!!plans) {
            this.acpPlan = plans.find((plan) => !!plan.basePlan.ebb && !plan.canceled);
            this.isActivatedAcpPlan = !!this.acpPlan?.mdn ? true : false;
            this.activePlans = plans.filter(
              (plan) =>
                !!plan.mdn &&
                !plan.portInRequestNumber &&
                !plan.canceled
            );
            if (!!this.isActivatedAcpPlan || !!this.acpPlan) {
              this.showAcpPlanActivationCard = true;
              this.ebbService.getInternalApplication(user.customerId, user.ebbId).then((res) => {
                if (!!res) {
                  this.verificationDetails = res.data;
                  this.showNVCard = true;
                  this.nvStatus = this.ACP_STATUS.COMPLETE;
                  this.showSPCard = true;
                  this.hideSuccessBanner();
                  this.appState.loading = false;
                  this.hideCardContentSP = true;
                  this.hideCardContentNV = true;
                }
              }, (error) => {
                this.appState.loading = false;
              });
              this.userAccountService.userAccounts.pipe(take(1)).subscribe((accounts) => {
                const account = accounts.find((planAccount) => planAccount.mdn === this.acpPlan.mdn);
                if (!!account) {
                  this.userAccount = account;
                }
              });
              this.appDetails.updatedAt = this.acpPlan?.updatedAt;
              if (!this.isActivatedAcpPlan) {
                this.planActivationStatus = 'PENDING_ACTIVATION';
              } else if (!!this.isActivatedAcpPlan) {
                this.planActivationStatus = 'ENROLLED';
              }
            } else {
              this.ebbService.getACPApplicationStatus(this.userProfile.ebbId, this.userProfile.customerId, this.callBackUrl).then((details) => {
                this.appState.loading = false;
                if (!!details) {
                  this.appDetails = details;
                  if (details.status === this.ACP_STATUS.COMPLETE) {
                    this.showSPCard = true;
                    this.hideSuccessBanner();
                    this.hideCardContentSP = true;
                    this.hideCardContentNV = true;

                    if (!this.acpPlan) {
                      this.showAcpPlanActivationCard = true;
                      if (!!this.activePlans && this.activePlans.length > 0) {
                        this.planActivationStatus = 'PENDING_WITH_MDN';
                      } else {
                        this.planActivationStatus = 'PENDING';
                      }
                    }
                  }
                  this.showNVCard = true;
                  this.verificationDetails = details;
                  this.nvStatus = this.verificationDetails?.status;
                  if (this.verificationDetails?.status === this.ACP_STATUS.PENDING_CERT || this.verificationDetails?.status === this.ACP_STATUS.IN_PROGRESS || this.verificationDetails?.status === 'PENDING_ELIGIBILITY') {
                    this.showCardDesc = true;
                  }
                  if (this.verificationDetails?.status === this.ACP_STATUS.PENDING_RESOLUTION && !this.verificationDetails?.link) {
                    this.nvStatus = this.ACP_STATUS.PENDING;
                  } else if (this.verificationDetails?.status === this.ACP_STATUS.PENDING_RESOLUTION && !!this.verificationDetails?.link) {
                    this.showCardDesc = true;
                  }
                  if (this.verificationDetails?.status === 'PENDING_ELIGIBILITY') {
                    this.showNVOnHoldSection = true;
                    this.showAlert = true;
                  } else {
                    this.showNVOnHoldSection = false;
                  }
                }
              }, (error) => {
                this.showNVCard = true;
                this.showAlert = true;
                if (error.error.errors[0].code === 'APP_CLOSED_OR_EXPIRED') {
                  this.showExpiredSection = true;
                  this.nvStatus = 'EXPIRED';
                } else if (error.error.errors[0].code === '1421') {
                  this.showNVErrorSection = true;
                  this.nvStatus = 'NV_ERROR';
                } else {
                  this.showGenericError = true;
                  this.nvStatus = 'GENERIC';
                }
                this.appState.loading = false;
              });
            }
          }
        });
      } else {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      }
    });
  }
  private refreshInterval(): void {
    this.interval = setInterval(() => {
      this.timeLeft = this.timeLeft - 1000;
      sessionStorage.setItem('refreshTime', JSON.stringify(this.timeLeft));
      if (this.timeLeft > 0) {
        this.timer();
      } else if (this.timeLeft === 0) {
        this.isRefreshClicked = false;
        this.stopTimer();
        this.timeLeft = 300000; // 5 Minutes
      }
    }, 1000)
  }
  private stopTimer() {
    if (this.timer) {
      clearInterval(this.interval);
    }
  }
  private timer(): void {
    this.seconds = Math.floor(this.timeLeft / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.minutes %= 60;
    this.seconds %= 60;
    this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
  }
}
