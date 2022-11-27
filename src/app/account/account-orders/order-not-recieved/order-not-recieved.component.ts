import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { AccountHeaderService } from '../../account-header.service';

@Component({
  selector: 'app-order-not-recieved',
  templateUrl: './order-not-recieved.component.html',
  styleUrls: ['./order-not-recieved.component.scss']
})
export class OrderNotRecievedComponent implements OnInit, OnDestroy {

  public orderId = '';
  public orderInfo: OrderInfo;
  public showContactForm = false;
  public isNewOrder = false;
  public setSticky = false;
  private alive = true;

  constructor(private route: ActivatedRoute, private appState: AppState, private router: Router,
              private accountOrderService: UserOrdersService, private accountHeaderService: AccountHeaderService) {
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
        const today = new Date();
        const billingDate = new Date(this.orderInfo.createdDate);
        const diffInTime = today.getTime() - billingDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        this.isNewOrder = !!diffInDays && diffInDays > 5 ? false : true;
        this.showContactForm = this.isNewOrder ? false : true;
        this.accountHeaderService.setOrderInfo(this.orderInfo);
        this.appState.loading = false;
      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
      this.goToReportIssue();
    });
  }
  // @HostListener('window:scroll', ['$event']) 
  // setStickfooter(event) {
  //   let footer = document.getElementById('footer');
  //   let offset = window.pageYOffset;
  //   if (window.innerWidth > 1024) {
  //     this.setSticky = window.pageYOffset >= (footer.offsetHeight - 92) ? false : true;
  //   } else {
  //     if (window.innerWidth > 639) {
  //       this.setSticky = window.pageYOffset >= (footer.offsetHeight - 170) ? false : true;
  //     } else {
  //         this.setSticky = window.pageYOffset >= (footer.offsetHeight - 350 ) ? false : true;
  //     }
  //   }
  // }

}
