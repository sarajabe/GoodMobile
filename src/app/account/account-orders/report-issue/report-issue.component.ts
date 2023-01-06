import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../../account-header.service';
import { FirebaseUserProfileService, OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { AppState } from 'src/app/app.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.scss']
})
export class ReportIssueComponent implements OnInit, OnDestroy {
  public optionsForm: FormGroup;
  public orderInfo: OrderInfo;
  public selectedOption: string;
  public orderId: string;
  public sub: any;
  public showContactForm = false;
  public showShippingDelayedSection = false;
  public showEditShippingAddress = false;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public reportOptions = [];
  public showReturnDevice = false;
  public showWrongItems = false;
  public showMainSection = true;
  private alive = true;
  constructor(private accountHeaderService: AccountHeaderService,
    private metaService: MetaService,
    private router: Router,
    private route: ActivatedRoute,
    private accountOrderService: UserOrdersService,
    private appState: AppState,
    private userProfileService: FirebaseUserProfileService,
    private toastHelper: ToastrHelperService) {

    this.accountHeaderService.setAccountMenuVisibility(false);
    this.accountHeaderService.setRemovePadding(false);
    this.reportOptions = [{
      title: 'Order not received',
      icon: 'assets/img/order-not-recevied.svg',
      disabledIcon: 'assets/img/order-not-recevied-disabled.svg',
      id: 'order-not-recieved',
      url: `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDER_NOT_RECIEVED}`,
      isDisabled: false
    },
    {
      title: 'Wrong or missing item(s)',
      icon: 'assets/img/wrong-items.svg',
      id: 'missing-items',
      disabledIcon: 'assets/img/wrong-items-disabled.svg',
      url: `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.WRONG_ITEMS}`
    },
    {
      title: 'Update shipping address',
      icon: 'assets/img/update-address.svg',
      id: 'update-address',
      disabledIcon: 'assets/img/update-address-disabled.svg',
      url: `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.EDIT_ADDRESS}`,
      isDisabled: false
    },
    {
      title: 'FAQs',
      icon: 'assets/img/faqs.svg',
      id: 'faqs'
    },
    {
      title: 'Something else',
      icon: 'assets/img/something-else.svg',
      id: 'somthing-else',
      url: `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SOMETHING_ELSE}`
    }
    ]
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.optionsForm = new FormGroup({
      option: new FormControl('', Validators.required)
    });
    this.sub = this.route.params.subscribe(params => {
      if (!!params) {
        this.orderId = params.id;
      }
    });
    this.getOrderDetails(this.orderId);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.accountHeaderService.setRemovePadding(false);
    this.alive = false;
  }
  public goToOrderDetail(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDER_DETAILS}`, params]);
  }

  public hiddenContactForm(event): void {
    this.showContactForm = event;
  }

  public setSelectedOption(option): void {
    this.selectedOption = option.id;
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    switch (this.selectedOption) {
      case ('faqs'): {
        this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/order-help`])
        break;
      }
      default: {
        if (!option.isDisabled) {
          this.router.navigate([`${option.url}`, params]);
        }
        break;
      }

    }
  }

  public resetSections(): void {
    this.showContactForm = false;
    this.showEditShippingAddress = false;
    this.showReturnDevice = false;
    this.showWrongItems = false;
  }
  private getOrderDetails(orderId): void {
    this.appState.loading = true;
    this.accountOrderService.getOrderById(orderId).then((order) => {
      if (!!order) {
        this.orderInfo = order;
        this.appState.loading = false;
        this.accountHeaderService.setOrderInfo(this.orderInfo);
        this.reportOptions.map((option) => {
          if (!this.orderInfo.shipmentRequired) {
            if (option.id === 'order-not-recieved' || option.id === 'return-device' || option.id === 'update-address') {
              option.isDisabled = true;
            }
          }
          if (!this.orderInfo.devices || (!!this.orderInfo.devices && this.orderInfo.devices.length < 1)) {
            if (option.id === 'return-device') {
              option.isDisabled = true;
            }
          }
        })
      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
    });
  }
}
