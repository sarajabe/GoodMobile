import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { AccountHeaderService } from '../../account-header.service';

@Component({
  selector: 'app-something-else',
  templateUrl: './something-else.component.html',
  styleUrls: ['./something-else.component.scss']
})
export class SomethingElseComponent implements OnInit, OnDestroy {
  public showContactForm = true;
  public orderId;
  public orderInfo: OrderInfo;
  private alive = true;

  constructor(private router: Router, private route: ActivatedRoute, private accountHeaderService: AccountHeaderService,
    private accountOrderService: UserOrdersService, private appState: AppState) {
    this.accountHeaderService.setRemovePadding(true);
    this.route.params.subscribe(params => {
      if (!!params) {
        this.orderId = params.id;
      }
    });
   }

  ngOnInit(): void {
    this.accountHeaderService.orderInfo.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.orderInfo = order;
    });
    if (!this.orderInfo) {
      this.getOrderDetails(this.orderId);
    }
  }

  ngOnDestroy(): void {
    this.accountHeaderService.setRemovePadding(false);
    this.alive = false;
  }
  public goToReportIssue(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REPORT_ISSUE}`, params]);
  }

  private getOrderDetails(orderId): void {
    this.appState.loading = true;
    this.accountOrderService.getOrderById(orderId).then((order) => {
      if (!!order) {
        this.orderInfo = order;
        this.accountHeaderService.setOrderInfo(this.orderInfo);
        this.appState.loading = false;
      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
      this.goToReportIssue();
    });
  }
}
