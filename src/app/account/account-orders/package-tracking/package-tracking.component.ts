import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { AccountHeaderService } from '../../account-header.service';
import { TrackingInfo, OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';

@Component({
  selector: 'app-package-tracking',
  templateUrl: './package-tracking.component.html',
  styleUrls: ['./package-tracking.component.scss']
})
export class PackageTrackingComponent implements OnInit, OnDestroy {
  public trackingInfo: TrackingInfo;
  public orderInfo: OrderInfo;
  public orderId: string;
  public customHtml = '';
  public sub: any;
  public showOrderDetails = false;

  constructor(private accountHeaderService: AccountHeaderService,
              private metaService: MetaService,
              private modalHelper: ModalHelperService,
              private accountOrderService: UserOrdersService,
              private route: ActivatedRoute,
              private router: Router,
              private appState: AppState) {

    this.accountHeaderService.setAccountMenuVisibility(false);
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.sub = this.route.params.subscribe(params => {
      if (!!params) {
        this.orderId = params.id;
      }
    });
    this.getTrackingInfo(this.orderId);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public viewUpdatesPopUp(trackingNumber): void {
    this.trackingInfo.trackInfo.trackDetail.forEach(item => {
      if (!!item.eventTime && !!item.event) {
        this.customHtml = this.customHtml + `<div>
      <p class="date"><b>${item.eventDate}</b></p>
      <div class="display-flex">
        <p class="border-right"><b>${item.eventTime}</b></p>
        <p class="left-margins"><b>${item.event}</b></p>
      </div>`;
      }
    });
    const customHTML2 = `<div><h1>Delivery by USPS</h1><p class="track-font-size"><b>Tracking Number: ${trackingNumber}</b></p></div>
    ${this.customHtml}
    </div>`;
    this.modalHelper.showInformationMessageModal('', '', null, null, true, 'custom-modal-view-updates', customHTML2);
  }
  private getTrackingInfo(orderId): void {
    this.appState.loading = true;
    this.accountOrderService.getTrackingInfo(orderId).then((data) => {
      if (!!data) {
        this.appState.loading = false;
        this.orderInfo = data.order;
        this.trackingInfo = data.tracking;
      }
    }).catch((error) => {
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
      console.error(error);
    });
  }
}
