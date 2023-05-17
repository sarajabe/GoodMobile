import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseUserProfileService, IUserAccount, IUserPlan, UserAccountService, UserDeviceService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { CUSTOMER_CARE_NUMBER } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-activation-summary',
  templateUrl: './activation-summary.component.html',
  styleUrls: ['./activation-summary.component.scss']
})
export class ActivationSummaryComponent implements OnDestroy {
  public userPlan: IUserPlan;
  public userAccount: IUserAccount;
  public os: string;
  public network: string;
  public mdn: string;
  public customerCareNumber = CUSTOMER_CARE_NUMBER;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public isNewNumber = true;
  public isTmoNetwork = false;
  public iseSIM = false;
  public barCodeVal: string;

  private alive = true;

  constructor(private router: Router,
    private userAccountService: UserAccountService,
    private userPlansService: UserPlansService,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private userDeviceService: UserDeviceService,
    private userProfileService: FirebaseUserProfileService) {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params) {
        if (params[ACTIVATION_ROUTE_URLS.PARAMS.PORTIN_NUMBER]) {
          this.isNewNumber = false;
        }
      }
    });
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => {
      this.barCodeVal = !!user?.ebbId ? `${user?.ebbId}` : null;
    })
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((ready) => {
      if (ready) {
        this.userPlan = this.userPlansService.selectedUserPlan;
        if (!!this.userPlan.eSIM) {
          this.iseSIM = true;
        }
        if (!!this.userPlan && !!this.userPlan.planDevice) {
          if (this.userPlan.planDevice.manufacturer.toLowerCase().indexOf('apple') > -1) {
            this.os = 'ios';
          } else {
            this.os = 'android';
          }
          this.network = this.userPlan.planDevice.network;
          this.mdn = this.userPlan.mdn;
          if (this.network.toLowerCase() === 'tmo') {
            this.isTmoNetwork = true;
          }
        }
      }
    });
    this.mdn = this.route.snapshot.paramMap.get(SHOP_ROUTE_URLS.PARAMS.MDN);
    if (!!this.mdn) {
      this.userDeviceService.checkDeviceNetworkByMdn(this.mdn).then((result) => {
        this.network = result.network;
        if (this.network.toLowerCase() === 'tmo') {
          this.isTmoNetwork = true;
        }
      });
    }
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public setupEsim(): void {
    if (!!this.userPlan) {
      const params = {};
      params[ACCOUNT_ROUTE_URLS.PARAMS.PLAN_ID] = this.userPlan.id;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ESIM_SETUP}`, params]);

    }
  }
  public setUpPhoneData(): void {
    // if (this.network === 'att') {
    //   if (this.os === 'ios') {
    //     this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.IPHONE}`]);
    //   } else {
    //     this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.ANDROID}`]);
    //   }
    // } 
    if (this.network === 'tmo') {
      if (this.os === 'ios') {
        this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TMO_IPHONE}`]);
      } else {
        this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TMO_Android}`]);
      }
    }
  }

  public goToAccountSummary(): void {
    const params = {};
    params[SHOP_ROUTE_URLS.PARAMS.MDN] = this.mdn;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`, params]);
  }
  public goToContactUs(): void {
    const params = {};
    params[SHOP_ROUTE_URLS.PARAMS.MDN] = this.mdn;
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.CONTACT_US}`]);
  }
}
