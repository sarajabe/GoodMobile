import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { IShipmentTracking, ShipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { CUSTOMER_CARE_NUMBER } from 'src/environments/environment';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../../account-header.service';

@Component({
  selector: 'app-return-reason',
  templateUrl: './return-reason.component.html',
  styleUrls: ['./return-reason.component.scss']
})
export class ReturnReasonComponent implements OnInit, OnDestroy {

  public returnReason;
  public REASONS = {
    CHANGE: 2,
    MONEY: 1,
    WARRANTY: 3
  }
  public CUSTOMER_CARE_NUMBER = CUSTOMER_CARE_NUMBER;
  public reasonRequired = false;
  public orderId;
  public orderInfo: OrderInfo;
  public trackingInfo: IShipmentTracking;
  public canReturnDevice = true;
  public isDelivered = false;
  public canChange = true;
  public lastChangeDay;
  private alive = true;

  constructor(@Inject(DOCUMENT) private dom, private accountHeaderService: AccountHeaderService, private router: Router, private route: ActivatedRoute ,private appState: AppState,
    private accountOrderService: UserOrdersService, private shippmentService: ShipmentService, private toastHelper: ToastrHelperService) {
    this.accountHeaderService.setRemovePadding(true);
    this.route.params.subscribe(params => {
      if (!!params) {
        this.orderId = params.id;
      }
    });
   }

  ngOnInit(): void {
    const savedSelection = parseInt(sessionStorage.getItem('returnReason'));
    Object.keys(this.REASONS).map((reason) => {
      if (this.REASONS[reason] === savedSelection) {
        this.returnReason = this.REASONS[reason];

      }
    })
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
  public selectReturnReason(reason): void {
    this.returnReason = reason;
    this.reasonRequired = false;
  }

  public next(): void {
    this.reasonRequired = !this.returnReason;
    if (!this.reasonRequired) {
      console.info('---------------------------');
      sessionStorage.setItem('returnReason', this.returnReason);
      const params = {};
      params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
      this.router.navigate([`/${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.RMA}/${ACCOUNT_ROUTE_URLS.CHANGE_OF_MIND}`, params])
    }
  }

  public goToReportIssue(): void {
    sessionStorage.removeItem('returnReason');
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REPORT_ISSUE}`, params]);
  }

  public goToFAQs(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/order-help`]);
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
      this.checkDeliveryDetails();
    }, (error) => {
      this.appState.loading = false;
      //add fake response just for testing because FEdex API doesn't work all the time
      this.trackingInfo = {
        trackInfo: {
            "class": "FedEx Home Delivery",
            "classOfMailCode": "HD",
            "destinationCity": "Sacramento",
            "destinationState": "CA",
            "destinationZip": "",
            "emailEnabled": false,
            "kahalaIndicator": false,
            "originCity": "COLUMBUS",
            "originState": "OH",
            "originZip": "",
            "status": "Delivered",
            "statusCategory": "Delivered",
            "statusSummary": "Delivered",
            "tABLECODE": "DE",
            mailTypeCode: "",
            mPDATE:"",
            mPSUFFIX:"",
            podEnabled:true,
            restoreEnabled: true,
            rramEnabled: true,
            rreEnabled: true,
            service: 'fedex',
            serviceTypeCode: "FX",
            tPodEnabled: true,
            trackSummary: {
                "eventTime": "13:14:00 GMT+0000 (Coordinated Universal Time)",
                "eventDate": "2013-12-11T13:14:00.000Z",
                "event": "Initiated",
                "eventCity": "",
                "eventState": "",
                firmName: "John",
                "eventZIPCode": "43068",
                "eventCountry": "US",
                "name": "",
                "authorizedAgent": false,
                "eventCode": "IN"
            },
            "trackDetail": [
                {
                    "eventTime": "19:22:15 GMT+0000 (Coordinated Universal Time)",
                    "eventDate": "2022-08-10T19:22:15.000Z",
                    "event": "Delivered",
                    "eventCity": "SACRAMENTO",
                    "eventState": "CA",
                    "eventZIPCode": "95828",
                    "eventCountry": "US",
                    "firmName": "",
                    "name": "",
                    "authorizedAgent": false,
                    "eventCode": "DE"
                },
                {
                    "eventTime": "16:25:00 GMT+0000 (Coordinated Universal Time)",
                    "eventDate": "2013-12-18T16:25:00.000Z",
                    "event": "In transit",
                    "eventCity": "SACRAMENTO",
                    "eventState": "CA",
                    "eventZIPCode": "95828",
                    "eventCountry": "US",
                    "firmName": "",
                    "name": "",
                    "authorizedAgent": false,
                    "eventCode": "IT"
                },
                {
                    "eventTime": "09:08:00 GMT+0000 (Coordinated Universal Time)",
                    "eventDate": "2013-12-18T09:08:00.000Z",
                    "event": "In transit",
                    "eventCity": "SACRAMENTO",
                    "eventState": "CA",
                    "eventZIPCode": "95828",
                    "eventCountry": "US",
                    "firmName": "",
                    "name": "",
                    "authorizedAgent": false,
                    "eventCode": "IT"
                }
            ]
        }
      }
      this.checkDeliveryDetails();
    });
  }

  private checkDeliveryDetails(): void {
    this.isDelivered = this.trackingInfo.trackInfo.status === 'Delivered';
    if (this.isDelivered) {
      const deliveryDetails = this.trackingInfo.trackInfo.trackDetail.find((detail) => detail.event === 'Delivered');
      const today = new Date();
      const deliveryDate = new Date(deliveryDetails.eventDate);
      const diffInTime = today.getTime() - deliveryDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      this.canReturnDevice = diffInDays > 30 ? false : true;
      this.canChange = diffInDays > 14 ? false : true;
      this.lastChangeDay = new Date(deliveryDate.setDate(deliveryDate.getDate() + 14));
    } else {
      this.toastHelper.showAlert('Your Order is not delivered yet! You can start the return flow once your device is delivered');
      this.goToReportIssue();
    }
  }

 
}
