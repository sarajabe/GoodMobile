import { Injectable } from '@angular/core';
import { OrderInfo } from '@ztarmobile/zwp-service-backend';
import { Observable, ReplaySubject } from 'rxjs';

export interface AccountPageDescription {
  getDescription(): string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountHeaderService {
  public pageDescription: Observable<string>;
  public pageTitle: Observable<string>;
  public isMenuVisible: Observable<boolean>;
  public removePadding: Observable<boolean>;
  public orderInfo: Observable<OrderInfo>;
  public ownContainer:Observable<boolean>;
  private pageDescriptionSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
  private pageTitleSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
  private accountMenuVisibleSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private ownContainerSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private removePaddingSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private orderInfoSubject: ReplaySubject<OrderInfo> = new ReplaySubject<OrderInfo>(1);

  constructor() {
    this.pageDescription = this.pageDescriptionSubject.asObservable();
    this.isMenuVisible = this.accountMenuVisibleSubject.asObservable();
    this.pageTitle = this.pageTitleSubject.asObservable();
    this.removePadding = this.removePaddingSubject.asObservable();
    this.orderInfo = this.orderInfoSubject.asObservable();
    this.ownContainer = this.ownContainerSubject.asObservable();
  }

  public setPageDescription(html: string): void {
    this.pageDescriptionSubject.next(html);
  }

  public setAccountMenuVisibility(isVisible: boolean): void {
    this.accountMenuVisibleSubject.next(isVisible);
  }

  public setPageTitle(title: string): void {
    this.pageTitleSubject.next(title);
  }

  public setRemovePadding(remove: boolean): void {
    this.removePaddingSubject.next(remove);
  }

  public setOrderInfo(order: OrderInfo): void {
    this.orderInfoSubject.next(order);
  }
  public setownContainer(ownContainer: boolean): void {
    this.ownContainerSubject.next(ownContainer);
  }
}
