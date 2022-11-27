import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MobilePlanItem, MobileCustomPlansService, CART_TYPES } from '@ztarmobile/zwp-service-backend';
import { SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ROUTE_URLS } from '../../app.routes.names';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { throttleTime } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PlansShopService {
  public selectedMobilePlan: Observable<MobilePlanItem>;
  public showPlanSummary: boolean;
  public nextCycle: boolean;
  public isChangePlanPage: Observable<boolean>;
  public isExpanded: Observable<boolean>;

  private selectedMobilePlanSubject: ReplaySubject<MobilePlanItem>;
  private isChangePlanPageSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private isExpandedSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private fullRoute: string = SHOP_ROUTE_URLS.BASE + '/' +  SHOP_ROUTE_URLS.PLANS_AND_FEATURES + '/' + PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN;

  constructor(private router: Router, private location: Location, private mobilePlansService: MobileCustomPlansService) {
    this.reset();
    this.isChangePlanPage = this.isChangePlanPageSubject.asObservable();
    this.isExpanded = this.isExpandedSubject.asObservable();
  }

  public selectMobilePlanItem(selectedMobilePlan: MobilePlanItem): void {
    this.selectedMobilePlanSubject.next(selectedMobilePlan);
  }
  public setIsExpanded(isExpandedSection: boolean): void {
    this.isExpandedSubject.next(isExpandedSection);
  }

  public showPlanSummaryPage(plan: MobilePlanItem, changePlanNextCycle: boolean): void {
    const newParams = {};
    newParams[ROUTE_URLS.PARAMS.SELECTED_PLAN] = plan.id;
    newParams[SHOP_ROUTE_URLS.PARAMS.CHANGE_NEXT_CYCLE] = changePlanNextCycle;
    this.showPlanSummary = true;
    this.nextCycle = changePlanNextCycle;
  }

  public checkoutPlan(userPlanId: string): void{
    if (userPlanId) {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = userPlanId;
      this.mobilePlansService.setCartType(CART_TYPES.CHANGE_PLAN);
      this.mobilePlansService.setActivePlanId(userPlanId);
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    } else {
      console.error('User plan ID not provided');
    }
  }

  public hidePlanSummaryPage(): void {
    this.showPlanSummary = false;
    this.router.navigate([this.fullRoute]);
  }

  public reset(): void {
    if (!!this.selectedMobilePlanSubject) {
      this.selectedMobilePlanSubject.complete(); // close previous subject, avoids any memory leaks issues and unexpected flows
    }

    const isChangePlanPage = this.location.isCurrentPathEqualTo(`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN}`);
    this.isChangePlanPageSubject.next(isChangePlanPage);
    this.selectedMobilePlanSubject = new ReplaySubject<MobilePlanItem>(1);
    this.selectedMobilePlan = this.selectedMobilePlanSubject.asObservable().pipe(throttleTime(500));
    this.showPlanSummary = false;
  }
}
