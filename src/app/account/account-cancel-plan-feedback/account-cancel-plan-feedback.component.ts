import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactEmailService, FirebaseUserProfileService, IUser, IUserAccount, IUserPlan, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { filter, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { AccountHeaderService } from '../account-header.service';

@Component({
  selector: 'app-account-cancel-plan-feedback',
  templateUrl: './account-cancel-plan-feedback.component.html',
  styleUrls: ['./account-cancel-plan-feedback.component.scss']
})
export class AccountCancelPlanFeedbackComponent implements OnInit {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;

  public userAccount: IUserAccount;
  public userInfo: IUser = {} as IUser;
  public selectedPlan: IUserPlan;
  public emailPlan: IUserPlan;
  public cancelDate: string;
  public feedbackDetails: string;
  public recievedIDFromEmail: string;
  public SITE_ID: string = CAPTCHA_SITE_ID;
  public cancelPlanProblem = 'I don’t like the plans';
  public cancelPlanProblems = [
    { id: 0, title: 'I don’t like the plans' },
    { id: 1, title: 'Coverage in my area isn’t adequate' },
    { id: 2, title: 'I switched to another carrier ' },
    { id: 3, title: 'Because of service quality' },
    { id: 4, title: 'Because of price' },
    { id: 5, title: 'I need more GBs than you offer' },
    { id: 6, title: 'I was just traveling in the US temporarily' }];
  public planCanceled = false;
  public captchaValid = false;
  public idExistence = false;
  public cancelNow = false;
  public processingRequest = false;
  private captchaResponse: string;
  private alive = true;


  constructor(private userAccountService: UserAccountService,
              private userPlansService: UserPlansService,
              private router: Router,
              private modalHelper: ModalHelperService,
              private contactEmailService: ContactEmailService,
              private userProfileService: FirebaseUserProfileService,
              private toastHelper: ToastrHelperService,
              private route: ActivatedRoute,
              private metaService: MetaService,
              private accountHeaderService: AccountHeaderService) {

    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      if (userPlanReady) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
      }
    });

    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.userInfo = user;
    });

    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => this.userAccount = account);

    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params) {
        if (params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE]) {
          this.cancelNow = params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE];
          if (!!this.userAccount) {
            if (!!this.cancelNow) {
              this.cancelDate = this.userAccount.plan.startDate;
            } else {
              this.cancelDate = this.userAccount.plan.subscriptionRenewalDate;
            }
          }
        }
        if (params[ROUTE_URLS.PARAMS.SELECTED_PLAN_ID]) {
          this.idExistence = true;
        }
        if (params[ROUTE_URLS.PARAMS.PLAN_ID_FROM_EMAIL]) {
          this.idExistence = true;
          this.recievedIDFromEmail = params[ROUTE_URLS.PARAMS.PLAN_ID_FROM_EMAIL];
          if (!!this.recievedIDFromEmail) {
            this.userPlansService.getUserPlan(this.recievedIDFromEmail).then((result) => {
              if (result) {
                this.emailPlan = result;
              }
            }, (error) => {
              this.toastHelper.showAlert(error.message || error);
              return;
            });
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.accountHeaderService.setAccountMenuVisibility(false);
    this.accountHeaderService.setPageDescription('');
    this.accountHeaderService.setPageTitle('Cancel plan feedback');
    this.metaService.createCanonicalUrl();
  }

  public returnCancelationDate(): void {
    if (!!this.emailPlan) {
      if (!!this.emailPlan.basePlan.renewDate) {
        this.cancelDate = this.emailPlan.basePlan.renewDate;
      }
    } else {
      if (!!this.selectedPlan.basePlan.renewDate) {
        this.cancelDate = this.selectedPlan.basePlan.renewDate;
      }
    }
  }

  public updateCancelPlanProblem(event): void {
    this.cancelPlanProblem = event;
  }

  public submitUserFeedback(): void {
    this.processingRequest = true;
    if (!!this.emailPlan) {
      const formattedMdn = this.emailPlan.mdn;
      const emailMessage = !!this.feedbackDetails ? ('Issue: ' + this.cancelPlanProblem + ' / Details: ' + this.feedbackDetails) : ('Issue: ' + this.cancelPlanProblem);
      const email = {
        reCaptcha: this.captchaResponse,
        email: this.userInfo.email,
        message: emailMessage,
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        phoneNumber: !!this.userInfo.contactPhone ? this.userInfo.contactPhone : '',
        category: 'Service',
        subject: formattedMdn + ' Cancellation Feedback'
      };
      this.contactEmailService.sendContactUsEmail(email).then(() => {
        this.processingRequest = false;
        this.planCanceled = true;
        this.contactEmailService.saveCancelPlanFeedback(email, this.userInfo.id, this.selectedPlan.id);
        this.modalHelper.showInformationMessageModal('We are sorry to see you go!', 'your plan is canceled successfully', 'OK', '', false, 'information-message-modal');
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      },
        (error) => {
          this.processingRequest = false;
          this.toastHelper.showAlert(error.message);
          this.reCaptcha.resetReCaptcha();
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
        });
    } else {
      const formattedMdn = this.selectedPlan.mdn;
      const emailMessage = !!this.feedbackDetails ? ('Issue: ' + this.cancelPlanProblem + ' / Details: ' + this.feedbackDetails) : ('Issue: ' + this.cancelPlanProblem);
      const email = {
        reCaptcha: this.captchaResponse,
        email: this.userInfo.email,
        message: emailMessage,
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        phoneNumber: !!this.userInfo.contactPhone ? this.userInfo.contactPhone : '',
        category: 'Service',
        subject: formattedMdn + ' Cancellation Feedback'
      };
      this.contactEmailService.sendContactUsEmail(email).then(() => {
        this.processingRequest = false;
        this.planCanceled = true;
        this.contactEmailService.saveCancelPlanFeedback(email, this.userInfo.id, this.selectedPlan.id);
        this.modalHelper.showInformationMessageModal('We are sorry to see you go!', 'your plan is canceled successfully', 'OK', '', false, 'information-message-modal');
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      },
        (error) => {
          this.processingRequest = false;
          this.toastHelper.showAlert(error.message);
          this.reCaptcha.resetReCaptcha();
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
        });
    }
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    if (!this.idExistence) {
      this.toastHelper.showAlert('Sorry You can not submit this form without going through plan cancellation steps');
    }
  }
}
