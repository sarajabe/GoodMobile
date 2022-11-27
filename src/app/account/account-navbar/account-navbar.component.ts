import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FirebaseUserProfileService, IUser, IUserPlan, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { take, takeWhile } from 'rxjs/operators';
import { ACP_CALLBACK_URL } from 'src/environments/environment';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS } from '../../../app/app.routes.names';

@Component({
  selector: 'app-account-navbar',
  templateUrl: './account-navbar.component.html',
  styleUrls: ['./account-navbar.component.scss']
})
export class AccountNavbarComponent implements OnInit {
  @Input() pendingPlans: IUserPlan[];
  @Input() isAccountMenuVisible: boolean;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public href = '';
  public pageSection = '';
  public isPayRefill = false;
  public isPlanAddOns = false;
  public isPaymentHistory = false;
  public isUsageHistory = false;
  public isOrders = false;
  public isAcp = false;
  public isActiveAccount = false;
  public isExpiredAccount = false;
  public isRefer = false;
  public isPortIn = false;
  public userProfile: IUser;
  public displayAcpSection = false;

  constructor(
    private router: Router,
    private userAccountService: UserAccountService,
    private userPlansService: UserPlansService,
    private userProfileService: FirebaseUserProfileService,
    private ebbService: EbbService) {

    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.href = route.url.substr(route.url.lastIndexOf('/') + 1);
        switch (this.href) {
          case (ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS): {
            this.pageSection = ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.SUMMARY): {
            this.pageSection = ACCOUNT_ROUTE_URLS.SUMMARY;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.PAY_AND_RENEW): {
            this.pageSection = ACCOUNT_ROUTE_URLS.PAY_AND_RENEW;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS): {
            this.pageSection = ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.ORDERS): {
            this.pageSection = ACCOUNT_ROUTE_URLS.ORDERS;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.ACP_APPLICATION): {
            this.pageSection = ACCOUNT_ROUTE_URLS.ACP_APPLICATION;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.PAYMENTS): {
            this.pageSection = ACCOUNT_ROUTE_URLS.PAYMENTS;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.USAGE): {
            this.pageSection = ACCOUNT_ROUTE_URLS.USAGE;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.MANAGE_DEVICES): {
            this.pageSection = ACCOUNT_ROUTE_URLS.MANAGE_DEVICES;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.SETTINGS): {
            this.pageSection = ACCOUNT_ROUTE_URLS.SETTINGS;
            break;
          }
          case (ACCOUNT_ROUTE_URLS.REFER_FRIEND): {
            this.pageSection = ACCOUNT_ROUTE_URLS.REFER_FRIEND;
            break;
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.userAccountService.selectedAccount.subscribe((selectedAccount) => {
      this.isActiveAccount = !!selectedAccount && selectedAccount.activatedSim;
      this.isExpiredAccount = !!selectedAccount && selectedAccount.pastDue;
    });
    this.userPlansService.userPlans.pipe(take(1)).subscribe((plans) => {
      if (!!plans) {
        const acpPlan = plans.find((plan) => !!plan.basePlan.ebb && !plan.canceled);
        this.displayAcpSection = !!acpPlan ? true : false;
        if (!acpPlan) {
          this.userProfileService.userProfileObservable.subscribe((user) => {
            if (!!user && !!user.ebbId) {
              const callBackUrl = `${ACP_CALLBACK_URL}/${ACP_ROUTE_URLS.BASE}`;
              this.ebbService.getACPApplicationStatus(user.ebbId, user.customerId, callBackUrl).then((res) => {
                if (!!res) {
                  this.displayAcpSection = true;
                } else {
                  this.displayAcpSection = false;
                }
              }, (error) => {
                if (error.error.errors[0].code === 'APP_CLOSED_OR_EXPIRED') {
                  this.displayAcpSection = true;
                } else {
                  this.displayAcpSection = false;
                }
              });
            } else if (!!user && !user.ebbId) {
              this.ebbService.getActiveInternalApplication(user.customerId).then((res) => {
                if (!!res) {
                  this.displayAcpSection = true;
                } else {
                  this.displayAcpSection = false;
                }
              }, (error) => {
                this.displayAcpSection = false;
              });
            }
          });
        }
      }
    });

    this.userPlansService.selectedUserPlanObservable.subscribe((plan) => {
      if (!!plan) {
        this.isPortIn = !!plan.portInRequestNumber ? !!plan.portInRequestNumber : false;
      }
    });
  }
  public resetAll(): void {
    this.isOrders = false;
    this.isAcp = false;
    this.isPlanAddOns = false;
    this.isPaymentHistory = false;
    this.isUsageHistory = false;
    this.isPayRefill = false;
    this.isRefer = false;
  }
}
