import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MobileCustomPlansService, MobilePlanItem } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-filters-column',
  templateUrl: './filters-column.component.html',
  styleUrls: ['./filters-column.component.scss']
})
export class FiltersColumnComponent implements OnDestroy {
  @Output()
  public filteredPlansList: EventEmitter<Array<MobilePlanItem>> = new EventEmitter<Array<MobilePlanItem>>();

  public FILTERS_VISIBILITY = {
    PRICE_FILTER: false,
    DATA_FILTER: false,
    MESSAGES_FILTER: false,
    MINUTES_FILTER: false,
  };

  public filtersValues: any = {
    textMessages: 0,
    minutes: 0,
    data: 0,
    price: 50
  };

  public filtersValuesShadowCopy: any = {
    textMessages: 0,
    minutes: 0,
    data: 0,
    price: 50
  };

  private filteredPlans: Array<MobilePlanItem>;
  private alive = true;
  private allBasePlans: Array<MobilePlanItem>;

  constructor(private router: Router, private mobilePlansService: MobileCustomPlansService) {
    this.mobilePlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe((isReady) => {
      if (isReady) {
        this.allBasePlans = mobilePlansService.allBasePlans;

        this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId);
        setTimeout(() => this.filteredPlansList.emit(this.filteredPlans));
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public filterByTextMessages(filterBy): void {
    if (filterBy === this.filtersValues.textMessages) {
      this.filtersValues.textMessages = 0;
      this.filtersValuesShadowCopy.textMessages = 0;
    } else {
      this.filtersValuesShadowCopy.textMessages = filterBy;
    }
    this.combineFilters();
  }

  public filterByMinutes(filterBy): void {
    if (filterBy === this.filtersValues.minutes) {
      this.filtersValues.minutes = 0;
      this.filtersValuesShadowCopy.minutes = 0;
    } else {
      this.filtersValuesShadowCopy.minutes = filterBy;
    }
    this.combineFilters();
  }

  public filterByData(filterBy): void {
    if (filterBy === this.filtersValues.data) {
      this.filtersValues.data = 0;
      this.filtersValuesShadowCopy.data = 0;
    } else {
      this.filtersValuesShadowCopy.data = filterBy;
    }
    this.combineFilters();
  }

  public filterByPrice(filterBy): void {
    this.filtersValues.price = filterBy;
    this.filtersValuesShadowCopy.price = filterBy;
    this.combineFilters();
  }

  public showFilterContent(filterType: string): void {
    switch (filterType) {
      case 'PRICE_FILTER':
        this.FILTERS_VISIBILITY.PRICE_FILTER = !this.FILTERS_VISIBILITY.PRICE_FILTER;
        break;
      case 'DATA_FILTER':
        this.FILTERS_VISIBILITY.DATA_FILTER = !this.FILTERS_VISIBILITY.DATA_FILTER;
        break;
      case 'MESSAGES_FILTER':
        this.FILTERS_VISIBILITY.MESSAGES_FILTER = !this.FILTERS_VISIBILITY.MESSAGES_FILTER;
        break;
      case 'MINUTES_FILTER':
        this.FILTERS_VISIBILITY.MINUTES_FILTER = !this.FILTERS_VISIBILITY.MINUTES_FILTER;
        break;
    }
  }

  private combineFilters(): void {
    this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId);
    this.filteredPlansList.emit(this.filteredPlans);
    const filterMode = 'INCLUSIVE';
    if (filterMode === 'INCLUSIVE') {
      this.inclusiveFilter();
    } else if (filterMode === 'EXCLUSIVE') {
      this.exclusiveFilter();
    }
  }

  private exclusiveFilter(): void {
    this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId);
    if (this.filtersValuesShadowCopy.data !== 0) {
      switch (this.filtersValuesShadowCopy.data) {
        // Unlimited
        case 99999:
          this.filteredPlans = this.filteredPlans.filter((plan) => plan.details.data >= 1024);
          break;
        // 3GB - 8GB
        case 2:
          this.filteredPlans = this.filteredPlans.filter((plan) => plan.details.data >= 3072 && plan.details.data <= 8192);
          break;
        // 500MB - 1GB
        case 1:
          this.filteredPlans = this.filteredPlans.filter((plan) => plan.details.data <= 1024);
          break;
      }
    }

    if (this.filtersValuesShadowCopy.minutes !== 0) {
      this.filteredPlans = this.filteredPlans.filter((plan) => plan.details.minutes === this.filtersValuesShadowCopy.minutes);
    }

    if (this.filtersValuesShadowCopy.textMessages !== 0) {
      this.filteredPlans = this.filteredPlans.filter((plan) => plan.details.messages === this.filtersValuesShadowCopy.textMessages);
    }

    if (this.filtersValuesShadowCopy.price !== 0) {
      this.filteredPlans = this.filteredPlans.filter((plan) => (plan.price - Number(plan.promoPrice)) <= this.filtersValuesShadowCopy.price);
    }

    this.filteredPlansList.emit(this.filteredPlans);
  }

  private inclusiveFilter(): void {
    this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId);

    let dataFilteredPlans: Array<MobilePlanItem> = [];
    let textFilteredPlans: Array<MobilePlanItem> = [];
    let minutesFilteredPlans: Array<MobilePlanItem> = [];

    if (this.filtersValuesShadowCopy.data !== 0) {
      switch (this.filtersValuesShadowCopy.data) {
        // Unlimited
        case 99999:
          dataFilteredPlans = this.filteredPlans.filter((plan) => plan.details.data >= 1024);
          break;
        // 3GB - 8GB
        case 2:
          dataFilteredPlans = this.filteredPlans.filter((plan) => plan.details.data >= 3072 && plan.details.data <= 8192);
          break;
        // 500MB - 1GB
        case 1:
          dataFilteredPlans = this.filteredPlans.filter((plan) => plan.details.data <= 1024);
          break;
      }
    }

    if (this.filtersValuesShadowCopy.minutes !== 0) {
      minutesFilteredPlans = this.filteredPlans.filter((plan) => plan.details.minutes === this.filtersValuesShadowCopy.minutes);
    }

    if (this.filtersValuesShadowCopy.textMessages !== 0) {
      textFilteredPlans = this.filteredPlans.filter((plan) => plan.details.messages === this.filtersValuesShadowCopy.textMessages);
    }

    this.filteredPlans = dataFilteredPlans.concat(textFilteredPlans.concat(minutesFilteredPlans));
    this.filteredPlans = this.uniqueArr(this.filteredPlans);
    // since its inclusive search there shouldn't be a case where the filteredPlan is empty so reset to all plans
    if (this.filteredPlans.length === 0) {
      this.filteredPlans = this.allBasePlans.filter((plan) => !!plan.parentId);
    }

    if (this.filtersValuesShadowCopy.price !== 0) {
      this.filteredPlans = this.filteredPlans.filter((plan) => (plan.price - plan.promoPrice) <= this.filtersValuesShadowCopy.price);
    }

    this.filteredPlansList.emit(this.filteredPlans);
  }

  private uniqueArr(inpArr: any[]): any {
    const a = inpArr;
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }

    return a;
  }
}
