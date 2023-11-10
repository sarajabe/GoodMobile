import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ACP_ROUTE_URLS, LOGIN_ROUTE_URLS, ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../app.routes.names';
import { takeWhile } from 'rxjs/operators';
import { ActionsAnalyticsService, MobileCustomPlansService } from '@ztarmobile/zwp-service-backend';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-care-wise',
  templateUrl: './care-wise.component.html',
  styleUrls: ['./care-wise.component.scss']
})
export class CareWiseComponent implements OnInit, OnDestroy {
  public ROUTE_URLS = ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ebbPlan: any;
  public isLoggedIn = false;
  public hideCardContent = true;

  private alive = true;

  constructor(
   private analyticsService: ActionsAnalyticsService,
    private mobilePlansService: MobileCustomPlansService, private router: Router, private simpleAuthService: SimpleAuthService,
    private el: ElementRef
    ) {
    this.mobilePlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.ebbPlan = this.mobilePlansService.allBasePlans.find((plan) =>
        plan.ebb
      );
    });
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive))
      .subscribe((authState) => this.isLoggedIn = !!authState && !authState.isAnonymous);
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public trackEvent(): void {
    const data = {
      event: 'Apply Now',
      category: 'ACP',
      label: 'Apply for ACP',
      action: 'apply'
    };
    this.analyticsService.trackACPEvent(data);
  }
  public goToEssentials(): void {
    const element = this.el.nativeElement.querySelector(`#acpDocs`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  public goToACPForm(): void {
    this.trackEvent();
    if (!this.isLoggedIn) {
      this.router.navigate([LOGIN_ROUTE_URLS.BASE + '/' + LOGIN_ROUTE_URLS.ACP_SIGNUP]);
    } else {
      this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
    }
  }

}
