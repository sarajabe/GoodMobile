/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFirebaseAddress, OrderInfo, ShippingService, UserOrdersService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { CatalogCoreService, IACPDevice, IShipmentTracking, ShipmentService } from '@ztarmobile/zwp-service-backend-v2';
import { take } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ContentfulService } from 'src/services/contentful.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';
import { AccountHeaderService } from '../../account-header.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('delivery') delivery: ElementRef;
  @ViewChild('details') details: ElementRef;
  public orderInfo: OrderInfo;
  public orderId: string;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
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
  public STATUS_TITLE= {
    UPDATE_NEEDED: 'Action Required',
    INVESTIGATE: 'Pending',
    PENDING: 'Pending',
    PROCESSED: 'Pending',
    CANCELED: 'Canceled',
    SVC_PURCHASED: 'Purchased',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    VOIDED: 'Voided',
    COLLECTED: 'Collected'
  };
  public items = true;
  public summary = true;
  public shipping = true;
  public line = true;
  public packages = true;
  public address = true;
  public changeAddressClicked = false;
  public screenWidth;
  public summaryCard = document.getElementById('summary-card');
  public shippingCard = document.getElementById('delivery-card');
  public detailsCard = document.getElementById('details-card');
  public currentShippingAddress: IFirebaseAddress;
  public orderShippingMethod: string;
  public shipmentMethods: Array<any> = [
    { shippingMethod: 'USPS First Class Mail', shipmentMethodId: 'usps_first_class_mail/letter' },
    { shippingMethod: 'USPS Priority', shipmentMethodId: 'usps_priority_mail/large_envelope_or_flat' },
    { shippingMethod: 'USPS Priority Express', shipmentMethodId: 'usps_priority_mail_express/large_envelope_or_flat' }
  ];
  public trackingInfo: IShipmentTracking;
  public phoneImageSrc = 'assets/img/loading-copy.gif';
  public deviceDetails: IACPDevice;
  public isCollected = false;
  constructor(private accountOrderService: UserOrdersService, private accountHeaderService: AccountHeaderService, private route: ActivatedRoute, private catalogService: CatalogCoreService,
              private router: Router, private appState: AppState, private shippingService: ShippingService,  private modalHelper: ModalHelperService,
              private toastHelper: ToastrHelperService, private shippmentService: ShipmentService, private contentful: ContentfulService, private userPlansService: UserPlansService) {
    this.accountHeaderService.setAccountMenuVisibility(false);
    this.route.params.subscribe(params => {
      if (!!params) {
        this.orderId = params.id;
        this.getOrderDetails(this.orderId);
      }
    });
    this.accountHeaderService.setPageTitle('');
    this.screenWidth = window.innerWidth;
    this.shipping = window.innerWidth > 1024 && this.shipping ? true : false;
   }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }

  public scrollToDetails(): void {
    let el = document.getElementById('details-card');
    el.scrollIntoView();
  }

  public scrollToDeliveryDetails(): void {
    this.shipping = true;
    let el = document.getElementById('delivery-card');
    el.scrollIntoView();
  }

  public reportIssue(orderID): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = orderID;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REPORT_ISSUE}`, params]);
  }

  public goToReceiptDetails(order): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = order?.id;
    params[ACCOUNT_ROUTE_URLS.PARAMS.FROM_DETAILS] = true;
    if(!!order?.storePickup) {
      params[ACCOUNT_ROUTE_URLS.PARAMS.STORE_PICKUP] = order?.storePickup;
      params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_STATUS] = order?.status;
      if(!!order?.cards && order?.cards?.length > 0) {
        params[ACCOUNT_ROUTE_URLS.PARAMS.ITEM_ID] = order?.cards[0]?.itemId;
      }
    }
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS_RECEIPT_DETAILS}`, params]);
  }
  public editShippingAddress(currentAddress, orderId): void {
    let selectedAddress = {} as IFirebaseAddress;
    this.currentShippingAddress = currentAddress;
    const original = JSON.stringify(this.currentShippingAddress);
    this.currentShippingAddress.name = currentAddress.shippingName;
    this.changeAddressClicked = true;
    this.modalHelper.showShippingAddressModal('Edit Shipping Address', this.currentShippingAddress,
      'shipping-address-modal').afterClosed().subscribe((address) => {
        this.changeAddressClicked = false;
        if (!!address) {
          this.appState.loading = true;
          this.shippingService.verifyShippingAddress(address).then((addresses) => {
            if (!!addresses) {
              const customHtml =
                `<div class="flex-container">
              <div class="pop-header">
                <p><img src='/assets/img/location.svg'><b> Current Customer Address:</b></p>
                <p class="sub-padding">` + address.address1 + ', ' + address.state + ' ' + address.postalCode + `</p>
              </div>
              <div class="pop-header">
                <p><img src='/assets/img/location.svg'><b> Verified Address from USPS</b></p>
                <p class="sub-padding"> ` + addresses[0].address1 + ', ' + addresses[0].state + ' ' + addresses[0].postalCode + `</p>
              </div>
            </div>`;
              this.appState.loading = false;
              this.modalHelper.showInformationMessageModal('Verify your shipping address', '',
              'Keep current address', null, true, 'usp-pop-up-modal', customHtml, true, 'Use verified address',
              '', 'verified')
                .afterClosed().subscribe((result) => {
                  if (result) {
                    if(result === 'verified') { 
                      selectedAddress = addresses[0];
                      selectedAddress.name = address.name;
                      currentAddress.shippingName = selectedAddress.name;
                    } else {
                    selectedAddress = address;
                    currentAddress.shippingName = selectedAddress.name;
                    }
                    this.appState.loading = true;
                    this.accountOrderService.updateOrderShippingAddress(orderId, selectedAddress).then(() => {
                      this.appState.loading = false;
                      this.currentShippingAddress = selectedAddress;
                      this.orderInfo.shippingInfo.shippingAddress.address1 = selectedAddress.address1;
                      this.orderInfo.shippingInfo.shippingAddress.address2 = !!selectedAddress.address2 ? selectedAddress.address2 : '';
                      this.orderInfo.shippingInfo.shippingAddress.city = selectedAddress.city;
                      this.orderInfo.shippingInfo.shippingAddress.state = selectedAddress.state;
                      this.orderInfo.shippingInfo.shippingAddress.postalCode = selectedAddress.postalCode;
                      this.orderInfo.shippingInfo.shippingAddress.shippingName = selectedAddress.name;
                      this.address = true;
                      this.toastHelper.showSuccess('Shipping address updated successfully!');
                    }, (error) => {
                      this.appState.loading = false;
                      this.currentShippingAddress = currentAddress;
                      this.orderInfo.shippingInfo.shippingAddress = Object.assign({} as IFirebaseAddress, JSON.parse(original));
                      this.toastHelper.showAlert(error.message);
                    });
                  } 
                }, (error) => {
                  this.appState.loading = false;
                });
            } 
          }, (error) => {
            this.appState.loading = false;
            const customHtml2 =
            `<div class="flex-container">
            <div class="pop-header1">
              <p>There’s a chance that you may not receive your package by mail. Please re-visit the possible issues:</p>
            </div>
            <div class="pop-header2">
              <p><b> Do the city, state and ZIP code conflict?</b></p>
              <p><b> Are there any typos or misspellings?</b></p>
            </div>
          </div>`;
            this.modalHelper.showInformationMessageModal('We couldn’t validate your address', '', 'Try again', null,
              false, 'usp-pop-up-modal2', customHtml2).afterClosed().subscribe((result) => {
                this.appState.loading = false;
              });
          });
        }
      });
  }

  public getMdnFormatted(mdn): string {
    mdn = (new PhonePipe()).transform(mdn);
    return mdn;
  }

  public cancelOrderWithRefund(isReplacement?: boolean): void {
    this.modalHelper.showConfirmMessageModal('Cancel order', 'Are you sure you want to cancel your order ?',
      'Yes', 'No', 'clean-cart-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.appState.loading = true;
            this.accountOrderService.cancelWithRefund(this.orderId).then((order) => {
              this.appState.loading = false;
              if (!!isReplacement) {
                this.userPlansService.userPlans.pipe(take(1)).subscribe((plans) => {
                  const associatedPlan = plans.find((p) => p.mdn === this.orderInfo.mdn);
                  if (!!associatedPlan) {
                    associatedPlan.planDevice.pendingNewSim = false;
                    this.userPlansService.updateUserPlan(associatedPlan.userId, associatedPlan);
                  }
                });
              }
              this.toastHelper.showSuccess('Your order has been canceled successfully!');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
            }).catch((error) => {
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message);
              console.error(error);
            });
        }
      });
  }
  public showTrackingInfo(): void {
    this.modalHelper.showTrackingModal('Delivery updates', this.trackingInfo , this.orderInfo.shipments[0].trackingNumber, 'delivery')
  }

  public open(): void {
   if(!this.changeAddressClicked){
     this.address = !this.address;
   }
  }
  private getOrderDetails(orderId): void {
    this.appState.loading = true;
    this.accountOrderService.getOrderById(orderId).then((order) => {
      if (!!order) {
        this.orderInfo = order;
        if (!!this.orderInfo.devices && this.orderInfo.devices.length > 0) {
          const orderTemp:any = order;
          this.orderInfo.status =  orderTemp.storePickup && this.orderInfo.status === 'SHIPPED' ? 'COLLECTED' : this.orderInfo.status
          this.appState.loading = true;
          this.catalogService.getAcpDeviceBySkuFromContentful(this.orderInfo.devices[0].sku).then((data) => {
            this.deviceDetails = data;
            this.phoneImageSrc = 'assets/icon/device-icon.png'
            this.appState.loading = false;
          },(error) => {
            this.appState.loading = false;
            this.toastHelper.showAlert(error?.error?.message || error?.message);
          });
        }
        if (!!this.orderInfo.shipments && this.orderInfo.shipments.length > 0) {
          this.shippmentService.trackingShipmentAddress(this.orderInfo.shipments[0].trackingNumber, this.orderInfo.shipments[0].carrier).then((data) => {
            this.trackingInfo = data;
            this.appState.loading = false;
            this.trackingInfo = data;
          }, (error) => {
            this.appState.loading = false;
          });
        } else {
          this.appState.loading = false;
        }
        if (!!this.orderInfo.shippingInfo && !!this.orderInfo.shippingInfo.shipmentMethodId) {
          this.orderShippingMethod = this.shipmentMethods.find((method) => method.shipmentMethodId === this.orderInfo.shippingInfo.shipmentMethodId);
        }

      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
    });
    // this.accountOrderService.getTrackingInfo(orderId).then((data) => {
    //   console.info('data ', data);
    // }, (error) => {
    //   console.info('wee ', error);
    // });
  }
   // eslint-disable-next-line @typescript-eslint/member-ordering
   @HostListener('window:resize', ['$event'])
   onResize(event): void {
       this.screenWidth = window.screen.width;
       this.shipping = window.innerWidth > 1024 ? true : false;
   }
}
