import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { take, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ContentfulService } from 'src/services/contentful.service';
import { AccountHeaderService } from '../../account-header.service';

@Component({
  selector: 'app-wrong-items',
  templateUrl: './wrong-items.component.html',
  styleUrls: ['./wrong-items.component.scss']
})
export class WrongItemsComponent implements OnInit, OnDestroy {
  public showContactForm = false;
  public orderId;
  public orderInfo: OrderInfo;
  public items = true;
  public line = true;
  public selectedItem: string;
  public selectedDevice: string;
  public selectedAddon: string;
  public selectedSIM: string;
  public showValidationError = false;
  public ORDER_INTENT = {
    NEW: 'NEW',
    REPLACEMENT: 'REPLACEMENT_SIM',
    ADDON: 'ADDON',
    REFILL: 'REFILL',
    MIGRATION: 'MIGRATION_SIM',
    CHANGE: 'CHANGE_PLAN',
    NEW_SIM: 'NEW_SIM'
  };
  public ORDER_STATUS= {
    UPDATE_NEEDED: 'UPDATE_NEEDED',
    INVESTIGATE: 'INVESTIGATE',
    PENDING: 'PENDING',
    PROCESSED: 'PROCESSED',
    CANCELED: 'CANCELED',
    SVC_PURCHASED: 'SVC_PURCHASED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    VOIDED: 'VOIDED'
  };
  public phoneImageSrc = 'assets/img/loading-copy.gif';
  public setSticky = false;
  private alive = true;

  constructor(private router: Router, private route: ActivatedRoute, private accountHeaderService: AccountHeaderService,
    private accountOrderService: UserOrdersService, private appState: AppState, private contentful: ContentfulService) {
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
      if (!!this.orderInfo && !!this.orderInfo.devices) {
        this.getPhoneImage(this.orderInfo.devices[0]);
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
  public goToReportIssue(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REPORT_ISSUE}`, params]);
  }

  public setItems(): void {
    if (!!this.selectedItem || !!this.selectedDevice || !!this.selectedAddon || !!this.selectedSIM) {
      this.showContactForm = true;
    } else {
      this.showValidationError = true;
      let el = document.getElementById('title');
      el.scrollIntoView();
    }
  }
  private getPhoneImage(device): void {
    this.contentful.getPhoneImgBySku('sku', device.sku).pipe(take(1)).subscribe((finishID) => {
      if (!!finishID) {
        this.contentful.getPhoneImg('finishes', finishID).pipe(take(1)).subscribe((src) => {
          if (!!src) {
            this.phoneImageSrc =  src.imageUrl;
          }
        });
      }
    });
  }
  private getOrderDetails(orderId): void {
    this.appState.loading = true;
    this.accountOrderService.getOrderById(orderId).then((order) => {
      if (!!order) {
        this.orderInfo = order;
        this.appState.loading = false;
        if (!!this.orderInfo && !!this.orderInfo.devices) {
          this.getPhoneImage(this.orderInfo.devices[0]);
        }
      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
      this.goToReportIssue();
    });
  }
  // @HostListener('window:resize', ['$event'])
  // onWindowResize() {
  //   let height = window.innerHeight;
  //   console.info('************************* ', height);
  // }

  // @HostListener('window:scroll', ['$event']) 
  // setStickfooter(event) {
  //   let footer = document.getElementById('footer');
  //   let parent = document.getElementById('parent');
  //   console.info('footer offeset ', footer.offsetHeight);
  //   console.info('inneerheight ', window.innerHeight);
  //   console.info('yoffset ', window.pageYOffset);
  //   console.info('page height  ', parent.offsetHeight);
  //   if (window.innerWidth > 1024) {
  //     this.setSticky = window.pageYOffset >= (parent.offsetHeight - 92) ? false : true;
  //   } else {
  //     if (window.innerWidth > 639) {
  //       this.setSticky = window.pageYOffset >= (footer.offsetHeight - 170) ? false : true;
  //     } else {
  //         this.setSticky = window.pageYOffset >= (footer.offsetHeight - 350 ) ? false : true;
  //     }
  //   }
  // }
}
