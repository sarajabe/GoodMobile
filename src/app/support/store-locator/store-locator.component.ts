import { Component, OnDestroy } from '@angular/core';
import { ShopConfigurationService, IStoresList, IStoreInfo } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.scss']
})
export class StoreLocatorComponent implements OnDestroy {
  public emptyStores = false;
  public zipCode: string;
  public radius = '10';
  public product = 'SIM';
  public storesList: Array<IStoreInfo>;
  public filteredStores: Array<IStoresList>;
  public store: string;
  public storeLists: IStoresList;
  public emptyZipCode = false;
  public config: PaginationInstance = {
    id: 'stores',
    itemsPerPage: 4,
    currentPage: 1,
    totalItems: 0
  };
  private alive = true;

  constructor(private shopConfigurationService: ShopConfigurationService) {
    this.shopConfigurationService.stores.pipe(takeWhile(() => this.alive)).subscribe((stores) => {
        this.storeLists = stores;
        this.storesList = stores.stores;
        this.config.totalItems = this.storeLists.totalItems;
    });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public updateRadius($event): void {
    this.radius = $event;
  }
  public updateProduct($event): void {
    this.product = $event;
  }
  public updateStore($event): void {
    this.store = $event;
  }
  public pageChanged(page: number): void {
    if (page > 0 && page <= this.storeLists.totalItems) {
      const index = page - 1;
      this.config.currentPage = page;
      this.searchStores();
    }
  }
  public searchStores(): void {
    this.emptyStores = true;
    if (!this.zipCode) {
      this.emptyZipCode = true;
    } else {
      this.emptyZipCode = false;
      this.shopConfigurationService.getStoresWithinRange(this.zipCode, this.radius, this.product, this.config.itemsPerPage, this.config.currentPage);
  }
    if (this.emptyZipCode === true){
    this.storesList.length = 0;
  }
  }
}

