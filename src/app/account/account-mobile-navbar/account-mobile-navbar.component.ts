import { Component, Input, OnInit } from '@angular/core';
import { IUser, IUserPlan, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { SlideInOutAnimationMobMenu } from '../../app.animations';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-account-mobile-navbar',
  templateUrl: './account-mobile-navbar.component.html',
  animations: [SlideInOutAnimationMobMenu],
  styleUrls: ['./account-mobile-navbar.component.scss']
})
export class AccountMobileNavbarComponent implements OnInit {
  @Input() pendingPlans: IUserPlan[];
  @Input() user: IUser;
  @Input() title: string;

  public PhonePipe: PhonePipe;
  public selectedPlan: IUserPlan;
  public animationState = 'out';
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public menuShown = false;
  public isActiveAccount = false;
  public isExpiredAccount = false;
  public isPortIn = false;
  public displayAcpSection = false;

  constructor(private router: Router,
    private userAccountService: UserAccountService,
    private userPlansService: UserPlansService,
    private appState: AppState) {
  }

  ngOnInit(): void {
    this.userAccountService.selectedAccount.subscribe((selectedAccount) => {
      this.isActiveAccount = !!selectedAccount && selectedAccount.activatedSim;
      this.isExpiredAccount = !!selectedAccount && selectedAccount.pastDue;
    });
    this.userPlansService.selectedUserPlanObservable.subscribe((plan) => {
      if (!!plan) {
        this.selectedPlan = plan;
        this.isPortIn = !!plan.portInRequestNumber ? !!plan.portInRequestNumber : false;
      }
    });
    this.appState.displayAcpSectionObs.subscribe(res => {
      this.displayAcpSection = res;
    });
  }

  public toggleMenu(): void {
    this.menuShown = !this.menuShown;
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  public goToAddons(event?): void {
    if (!!event) {
      event.preventDefault();
    }
    if (!this.isExpiredAccount) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS}`]);
      this.toggleMenu();
    }
  }
  public goToOrders(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
    this.toggleMenu();
  }
  public goToPaymentHistory(): void {
    if (!this.isPortIn) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PAYMENTS}`]);
      this.toggleMenu();
    }
  }
  public goToUsageHistory(): void {
    if (!this.isPortIn) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.USAGE}`]);
      this.toggleMenu();
    }
  }
  public goToPayAndRefill(): void {
    if (!this.isPortIn) {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PAY_AND_RENEW}`]);
      this.toggleMenu();
    }
  }
}
