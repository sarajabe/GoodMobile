import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { IShipmentTracking, ShipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { AccountHeaderService } from '../../account-header.service';

@Component({
  selector: 'app-return-device',
  templateUrl: './return-device.component.html',
  styleUrls: ['./return-device.component.scss']
})
export class ReturnDeviceComponent implements OnInit, OnDestroy {
  public showContactForm = false;
  public orderId;
  public orderInfo: OrderInfo;
  public trackingInfo: IShipmentTracking;
  public canReturnDevice = false;
  public isDelivered = false;
  public ACCOUNT_ROUTE_URLS =ACCOUNT_ROUTE_URLS;
  private alive = true;

  constructor(private router: Router, private route: ActivatedRoute, private accountHeaderService: AccountHeaderService, private appState: AppState,
    private accountOrderService: UserOrdersService, private shippmentService: ShipmentService) {
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
      if (!!this.orderInfo.shipments && this.orderInfo.shipments.length > 0) {
        this.getTrackingDetails()
      }
    });
    if (!this.orderInfo) {
      this.getOrderDetails(this.orderId);
    }
    
  }
  
  ngOnDestroy(): void {
    this.accountHeaderService.setRemovePadding(false);
    this.alive = false;
  }

  public goToReasonsPage(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`/${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.RMA}/${ACCOUNT_ROUTE_URLS.RETUREN_REASON}`, params])
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
        if (!!this.orderInfo.shipments && this.orderInfo.shipments.length > 0) {
          this.getTrackingDetails()
        } else {
          this.appState.loading = false;
        }
      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
      this.goToReportIssue();
    });
  }

  private getTrackingDetails(): void {
    this.appState.loading = true;
    this.shippmentService.trackingShipmentAddress(this.orderInfo.shipments[0].trackingNumber, this.orderInfo.shipments[0].carrier).then((data) => {
      this.trackingInfo = data;
      this.appState.loading = false;
      this.isDelivered = this.trackingInfo.trackInfo.status === 'Delivered';
      if (this.isDelivered) {
        const deliveryDetails = this.trackingInfo.trackInfo.trackDetail.find((detail) => detail.event === 'Delivered');
        const today = new Date();
        const deliveryDate = new Date(deliveryDetails.eventDate);
        const diffInTime = today.getTime() - deliveryDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        this.canReturnDevice = diffInDays > 30 ? false : true;
      }
    }, (error) => {
      this.appState.loading = false;
    });
  }
}
