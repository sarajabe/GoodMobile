import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IOrderItem, Order, OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { PaginationInstance } from 'ngx-pagination';
import { take } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ContentfulService } from 'src/services/contentful.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../account-header.service';

@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.scss']
})
export class AccountOrdersComponent implements OnInit {
  @ViewChild('container') container;
  @ViewChild('filterMenu') filterMenu;
  @ViewChild('sort') sort;
  @ViewChild('startDate') startDate;
  @ViewChild('endDate') endDate;
  @ViewChild('pickerend') pickerend;
  @ViewChild('picker') pickerStart;
  public dateForm: UntypedFormGroup;
  public allOrders: OrderInfo[] = [];
  public totalPages: number;
  public totalAllPages: number;
  public shippedOrders: OrderInfo[] = [];
  public noneShippedOrders: OrderInfo[] = [];
  public showDetails: boolean[] = [];
  public hideCard: boolean[] = [];
  public showCardAlwaysOnDesktop = false;
  public processingRequest = false;
  public cancelProcessingRequest = false;
  public selectedDate: number;
  public innerWidth: any;
  public title : string;
  public quantity: number;
  public ORDER_INTENT = {
    NEW: 'NEW',
    REPLACEMENT: 'REPLACEMENT_SIM',
    ADDON: 'ADDON',
    REFILL: 'REFILL',
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
  public shipmentMethods: Array<any> = [
    { shippingMethod: 'USPS First Class Mail', shipmentMethodId: 'usps_first_class_mail/letter' },
    { shippingMethod: 'USPS Priority', shipmentMethodId: 'usps_priority_mail/large_envelope_or_flat' },
    { shippingMethod: 'USPS Priority Express', shipmentMethodId: 'usps_priority_mail_express/large_envelope_or_flat' }
  ];
  public dates = [6, 12];
  public config: PaginationInstance = {
    id: 'orders',
    itemsPerPage: 3,
    currentPage: 1,
    totalItems: 0
  };
  public orderId;
  public showFilter = false;
  public range;
  public maxDate;
  public orderStatuses: Array<{name: string, value: string,checked: boolean}> = [
    { name: 'Canceled' , value: 'CANCELED', checked: false},
    { name: 'Delivered' , value: 'DELIVERED', checked: false},
    { name: 'Pending' , value: 'PENDING', checked: false},
    { name: 'Purchased' , value: 'SVC_PURCHASED', checked: false},
    { name: 'Shipped' , value: 'SHIPPED', checked: false},
    { name: 'Voided' , value: 'VOIDED', checked: false}
  ];
  public orderIntents: Array<{name: string, value: string,checked: boolean}> = [
    { name: 'Add-on' , value: 'addon', checked: false},
    { name: 'Change plan' , value: 'change_plan', checked: false},
    { name: 'New plan' , value: 'new', checked: false},
    { name: 'Refill' , value: 'refill', checked: false},
    { name: 'Replacement SIM' , value: 'replacement_sim', checked: false}
  ];
  public statusForm: UntypedFormGroup;
  public intentForm;
  public sortForm;
  public showSortMenu = false;
  public viewedOrders:OrderInfo[] = [];
  public sortValue = 'desc';
  public filterCount = 0;
  public filterApplied = false;
  public searchByID = false;
  public filterCriteria;
  public firstTimeFilter = true;
  public phonesImages = [];
  public maxStart;
  public minEnd;
  public totalStatusFilter = 0;
  public totalIntentFilter = 0;
  public canClearDate = false;
  public validStartInput; // we need to check for the manually entered data in the date field because the angular material checks selected dates from calender only
  public validEndInput;
  public minStart;
  public promoDetails = {
    "2X2GHolidays2022": {img: "assets/icon/2X2GHolidays2022.svg"},
    "2X6GHolidays2022": {img: "assets/icon/2X6GHolidays2022.svg"},
    "2X3GHolidays2022": {img: "assets/icon/2X3GHolidays2022.svg"},
  }
  
  constructor(private accountHeaderService: AccountHeaderService,
              private metaService: MetaService,
              private router: Router,
              private modalHelper: ModalHelperService,
              private accountOrderService: UserOrdersService,
              private appState: AppState,
              private formBuilder: UntypedFormBuilder,
              private contentful: ContentfulService,
              private toastHelper: ToastrHelperService) {

    this.accountHeaderService.setPageTitle('Your orders');
    this.range = this.formBuilder.group({
      start: new UntypedFormControl(),
      end: new UntypedFormControl(),
    });
    this.statusForm = this.formBuilder.group({
      statusArray: this.formBuilder.array([])
    });
    this.intentForm = this.formBuilder.group({
      intentArray: this.formBuilder.array([])
    });
    this.sortForm = new UntypedFormGroup({
      option: new UntypedFormControl('desc')
    });
    this.maxDate = new Date();
    this.maxStart = new Date();
    this.minStart = new Date('01/01/2000');
    document.addEventListener('click', this.offClickHandler.bind(this)); // bind on doc
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.selectedDate = 1780;
    this.getOrders(this.config.itemsPerPage, this.config.currentPage, this.selectedDate);
  }
  public validateDate(testdate) {
    var date_regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
    return date_regex.test(testdate);
  }
  public offClickHandler(event:any): void {
    if (!this.filterMenu.nativeElement.contains(event.target)) { // check click origin and close the menu if you click outside it
        this.showFilter = false;
        if (this.pickerend.opened || this.pickerStart.opened) { // when the user clicks on the month or year in teh calender the filter closes so this check is to make sure it stays opened
          this.showFilter = true;
        }
    }
    if (!this.sort.nativeElement.contains(event.target)) { // check click origin and close the menu if you click outside it
      this.showSortMenu = false;
  }
  }
  public calendarClosed(): void {
    this.showFilter = true;
  }
  public goToReceiptDetails(order): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = order?.id;
    if(!!order?.storePickup) {
      params[ACCOUNT_ROUTE_URLS.PARAMS.STORE_PICKUP] = order?.storePickup;
      if(!!order?.cards && order?.cards?.length > 0) {
        params[ACCOUNT_ROUTE_URLS.PARAMS.ITEM_ID] = order?.cards[0]?.itemId;
      }
    }
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS_RECEIPT_DETAILS}`, params]);
  }
  
  public pageChanged(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      const index = page - 1;
      this.config.currentPage = page;
      const offset = this.config.itemsPerPage;
      if (!this.filterApplied) {
        this.getOrders(offset, page, this.selectedDate);
      } else {
        this.filterCriteria.pageNumber = page;
        this.filterOrders();
      }
    }
  }

  public goToOrderDetail(orderId: string): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDER_DETAILS}`, params]);
  }

  public getOrders(offset, page, filter): void {
    this.appState.loading = true;
    this.shippedOrders = [];
    this.noneShippedOrders = [];
    this.accountOrderService.getOrders(offset, page, filter).then((data) => {
      this.appState.loading = false;
      this.allOrders = data.orders;
      this.viewedOrders = data.orders;
      this.getPhoneImage();
      this.totalPages = data.meta.totalPages;
      this.totalAllPages = data.meta.totalPages;
      this.config.totalItems = data.meta.totalOrders;
    }, (error) => {
      console.error(error);
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message);
    });
  }
  public reportIssue(orderID): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = orderID;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REPORT_ISSUE}`, params]);
  }

  public closeFilters(): void {
    this.showFilter = false;
  }
  public toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.showSortMenu = false;
  }

  public onCheckboxChange(e, formName) {
    let checkArray: UntypedFormArray;
    let changedItem;
    if (formName === 'statusForm') {
      changedItem = this.orderStatuses.find((x) => x.value === e.target.value);
    } else {
      changedItem = this.orderIntents.find((x) => x.value === e.target.value);
    }
    if (!!e.target && e.target.checked) {
      changedItem.checked = true
    } else {
      changedItem.checked = false;
    }
    this.totalStatusFilter = this.orderStatuses.filter((x) => x.checked).length;
    this.totalIntentFilter = this.orderIntents.filter((x) => x.checked).length;
  }
  public applyFilters(): void {
    const statuses = [];
    const intents = [];
    this.orderStatuses.map((x) => {
      if (x.checked) {
        statuses.push(x.value);
      }
    });
    this.orderIntents.map((x) => {
      if (x.checked) {
        if ((x.value === 'new_phone' || x.value === 'replacement_sim') && (intents.findIndex((i) => i === 'replacement_sim') < 0)) {
          intents.push('replacement_sim');
        } else {
          intents.push(x.value);
        }
      }
    });
    if (this.range.valid) {
      this.searchByID = false;
      this.config.currentPage = 1
      this.firstTimeFilter = false;
      this.orderId = '';
      this.filterCriteria = {
        status: statuses,
        dateFrom: new Date(this.range.controls.start.value).getTime(),
        dateTo: new Date(this.range.controls.end.value).getTime() > 0 ? new Date(this.range.controls.end.value.setHours(23, 59, 59, 999)).getTime() : new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
        sortBy: "createdDate",
        sortDirection: this.sortValue,
        intent: intents,
        pageSize: 3,
        pageNumber: this.config.currentPage
      };
      this.filterCount = 0;
      this.showFilter = false;
      this.appState.loading = true;
      this.filterCount = !!this.range.controls.start.value || !!this.range.controls.end.value ? (this.filterCount + 1) : this.filterCount;
      this.filterCount = (this.orderIntents.filter((x) => x.checked)).length > 0 ? (this.filterCount + 1) : this.filterCount;
      this.filterCount = (this.orderStatuses.filter((x) => x.checked)).length > 0 ? (this.filterCount + 1) : this.filterCount;
      this.filterOrders();
    }
  }

  public dateChange(event): void {
    if (event === 'start') {
      this.minEnd = this.startDate.nativeElement.value;
      this.validStartInput =  !!this.validateDate(this.startDate.nativeElement.value) && !!(Date.parse(this.startDate.nativeElement.value)) && (new Date(this.startDate.nativeElement.value).getTime() <= (!!(Date.parse(this.endDate.nativeElement.value)) ? new Date(this.endDate.nativeElement.value).getTime() : new Date().getTime()));
    } else {
      this.maxStart = !!this.endDate.nativeElement.value && !!this.range.controls.end.valid ? this.range.controls.end.value : new Date();
      this.validEndInput =  !!this.validateDate(this.endDate.nativeElement.value) && !!(Date.parse(this.endDate.nativeElement.value)) && (new Date(this.endDate.nativeElement.value).getTime() >= (!!(Date.parse(this.startDate.nativeElement.value)) ? new Date(this.startDate.nativeElement.value).getTime() : this.minStart.getTime()));

    }
    this.canClearDate = !!this.endDate.nativeElement.value || !!this.range.controls.start.errors || !this.validStartInput || !this.validEndInput || !!this.range.controls.end.errors || !!this.startDate.nativeElement.value ? true : false;
    this.showFilter = true;
  }
  public clearDates(): void {
    this.range.reset();
    this.maxDate = new Date();
    this.maxStart = new Date();
    this.canClearDate = !!this.range.controls.end.value || !!this.range.controls.start.value ? true : false;
    this.showFilter = true;
  }
  public clearFilters(): void {
    this.range.reset();
    this.range.get('start').clearValidators();
    this.range.get('end').clearValidators();
    this.range.controls.start.updateValueAndValidity();
    this.range.get('end').updateValueAndValidity();
    this.resetFormArray('status');
    this.resetFormArray('intent');
    this.viewedOrders = [];
    this.getOrders(this.config.itemsPerPage, 1, this.selectedDate);
    this.getPhoneImage();
    this.showFilter = false;
    this.totalPages = this.totalAllPages;
    this.config.totalItems = this.totalAllPages;
    this.filterCount = 0;
    this.config.currentPage = 1;
    this.filterApplied = false;
    this.searchByID = false;
    this.orderId = '';
    this.totalStatusFilter = 0;
    this.totalIntentFilter = 0;
  }

  public toggleSort(): void {
    this.showSortMenu = !this.showSortMenu;
    this.showFilter = false;
  }

  public onOptionChange(): void {
    this.sortValue = this.sortForm.get('option').value;
    this.showSortMenu = false;
    this.applyFilters();
  }

  public goToFAQs(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/order-help`]);
  }

  public updateDateValidations(): void {
    if (this.range.controls.start.value || !!this.range.controls.end.value) {
      this.range.get('start').setValidators(Validators.required);
      this.range.get('end').setValidators(Validators.required);
    } else {
      this.range.get('start').clearValidators();
      this.range.get('end').clearValidators();
      this.range.get('start').updateValueAndValidity();
      this.range.get('end').updateValueAndValidity();
    }
  }
  public searchOrderByID(): void {
    this.appState.loading = true;
    this.searchByID = true;
    this.filterApplied = false;
    this.accountOrderService.getOrderById(this.orderId).then((data) => {
      this.viewedOrders = [];
      this.viewedOrders.push(data);
      this.totalAllPages = 1;
      this.config.totalItems = 1;
      this.config.currentPage = 1;
      this.appState.loading = false;
      this.orderId = '';
    }, (error) => {
      this.appState.loading = false;
      this.viewedOrders = [];
      this.totalAllPages = 0;
      this.config.totalItems = 0;
      this.config.currentPage = 1;
    });
  }

  public resetOrderId(): void {
    this.orderId = '';
  }
  public getPhoneImage(): void {
  {
    this.viewedOrders.map((order) => {
      if (!!order.devices && order.devices.length > 0) {
        const orderTemp: any = order;
        if (orderTemp.storePickup && order.status === 'SHIPPED') {
          order.status = 'COLLECTED';
        }
      }
    });
  }
}

  public resetFormArray(arrayName): void {
    switch (arrayName) {
      case 'status': {
        this.orderStatuses.forEach((item, i) => {
          item.checked = false;
        });
        this.totalStatusFilter = 0;
        break;
      }
      case 'intent': {
        this.orderIntents.forEach((item, i) => {
          item.checked = false;
        });
        this.totalIntentFilter = 0;
        break;
      }
    }
  }

  private filterOrders(): void {
    this.accountOrderService.getFilteredOrders(this.filterCriteria).then((data) => {
      this.viewedOrders = [];
      this.viewedOrders = data.orders;
      // this.getPhoneImage();
      this.filterApplied = true;
      this.appState.loading = false;
      this.totalPages = data.meta.totalPages;
      this.config.totalItems = data.meta.totalOrders;
      // this.config.currentPage = data.meta.page;
      this.config.itemsPerPage = 3;
    },(error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message);
    });
  }
}
