import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseUserProfileService, IUser, IUserAccount, IUserPlan, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { filter, take, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { AccountHeaderService } from '../account-header.service';

@Component({
  selector: 'app-account-cancel-plan',
  templateUrl: './account-cancel-plan.component.html',
  styleUrls: ['./account-cancel-plan.component.scss']
})
export class AccountCancelPlanComponent implements OnInit {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;

  public selectedPlan: IUserPlan;
  public userAccount: IUserAccount;
  public userInfo: IUser = {} as IUser;
  public feedbackDetails: string;
  public cancelDate: string;
  public SITE_ID: string = CAPTCHA_SITE_ID;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
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
  public planCanceling = false;
  public captchaValid = false;
  public processingRequest = false;
  public open = false;

  private alive = true;
  private captchaResponse: string;

  constructor(private userAccountService: UserAccountService,
              private userPlansService: UserPlansService,
              private router: Router,
              private route: ActivatedRoute,
              private modalHelper: ModalHelperService,
              private metaService: MetaService,
              private userProfileService: FirebaseUserProfileService,
              private toastHelper: ToastrHelperService,
              private accountHeaderService: AccountHeaderService) {

    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params) {
        if (!!params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
          this.userPlansService.getUserPlan(params[ROUTE_URLS.PARAMS.USER_PLAN_ID]).then((plan) => {
            if (!!plan) {
              this.selectedPlan = plan;
              console.info('selected plan ', this.selectedPlan);
              this.userAccountService.userAccounts.pipe(take(1)).subscribe((accounts) => {
                const account = accounts.find((planAccount) => planAccount.mdn === this.selectedPlan.mdn);
                if (!!account) {
                  this.userAccount = account;
                }
              });
            } else {
              this.toastHelper.showWarning('Plan not found');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
            }
          });
        }
      }
    });
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.userInfo = user;
    });
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setAccountMenuVisibility(false);
    this.accountHeaderService.setPageDescription('');
    this.accountHeaderService.setPageTitle('Cancel plan');
  }

  public cancelPlan(): void {
    this.modalHelper.showConfirmMessage(`<p class="first">If you choose to cancel plan now, Your plan cancellation will take affect immediately,
    and any remaining service balances on your account may be lost.</p>
    <p class="second">If you choose to cancel plan on the expiration date, your plan will be cancelled on your
     Plan Expiration Date.</p>`, {
      okText: 'Cancel on expiry date', cancelText: 'Cancel plan now', enableHTML: true, customClass: 'change-plan-modal cancel'
    }).result.then((result) => {
      const params = {};
      params[ROUTE_URLS.PARAMS.SELECTED_PLAN_ID] = this.selectedPlan.id;
      if (result) {
        this.processingRequest = true;
        params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = false;
        this.userAccountService.cancelUserAccount(this.userAccount, false).then(() => {
          this.userPlansService.selectUserPlan(this.selectedPlan.id);
          this.cancelDate = this.selectedPlan.basePlan.renewDate;
          this.planCanceling = true;
          this.processingRequest = false;
          this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.USER_CANCEL_PLAN_FEEDBACK}`, params]);
        }, (error) => {
          this.toastHelper.showAlert(error.message || error);
          this.processingRequest = false;
        });
      } else {
        this.processingRequest = false;
        if (result === false) {
          params[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = true;
          this.processingRequest = true;
          this.userAccountService.cancelUserAccount(this.userAccount, true).then(() => {
            this.userPlansService.selectUserPlan(this.selectedPlan.id);
            this.planCanceling = true;
            this.processingRequest = false;
            this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.USER_CANCEL_PLAN_FEEDBACK}`, params]);
          }, (error) => {
            this.toastHelper.showAlert(error.message || error);
            this.processingRequest = false;
          });
        }
      }
    }, (error) => {
      this.processingRequest = false;
    });
  }

  public updateCancelPlanProblem(event): void {
    this.cancelPlanProblem = event;
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
}
