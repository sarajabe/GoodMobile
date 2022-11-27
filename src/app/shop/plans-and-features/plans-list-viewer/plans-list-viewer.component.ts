import { Component, EventEmitter, OnDestroy, Output, Input } from '@angular/core';
import { MobilePlanItem, UserPlansService, MobileCustomPlansService } from '@ztarmobile/zwp-service-backend';
import { PlansShopService } from '../plans-shop.service';
import { FadeInOutAnimation } from '../../../../app/app.animations';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { takeWhile, filter } from 'rxjs/operators';

@Component({
  selector: 'app-plans-list-viewer',
  templateUrl: './plans-list-viewer.component.html',
  animations: [FadeInOutAnimation],
})
export class PlansListViewerComponent implements OnDestroy {
  @Input() changeNextCycle: boolean;
  @Input() isChangePlan: boolean;
  @Output()
  public mobilePlanSelected: EventEmitter<MobilePlanItem> = new EventEmitter<MobilePlanItem>();
  @Output() returnedFromSummary: EventEmitter<boolean> = new EventEmitter<boolean>();
  public filteredPlans: Array<MobilePlanItem>;
  public showPlanSummary = false;
  public selectedPlan: MobilePlanItem;
  private alive = true;
  private selectedMobilePlanId: ReplaySubject<string> = new ReplaySubject<string>(1);
  private plans: ReplaySubject<Array<MobilePlanItem>> = new ReplaySubject<Array<MobilePlanItem>>(1);
  private allBasePlans: Array<MobilePlanItem>;

  constructor(public plansShopService: PlansShopService, private userPlansService: UserPlansService, private router: Router,
              private mobilePlansService: MobileCustomPlansService) {
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive),
      filter((ready) => ready && !!this.userPlansService.selectedUserPlan.basePlan))
      .subscribe(() => this.selectedMobilePlanId.next(this.userPlansService.selectedUserPlan.basePlan.id));

    this.mobilePlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe((isReady) => {
      if (isReady) {
        this.allBasePlans = mobilePlansService.allBasePlans;
        if (this.router.url.indexOf('change') > -1) {
          this.isChangePlan = true;
          this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId);
          this.filteredPlans.sort((a, b) => a.details.data - b.details.data);
        } else {
          this.isChangePlan = false;
          this.filteredPlans.sort((a, b) => a.details.data - b.details.data);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
