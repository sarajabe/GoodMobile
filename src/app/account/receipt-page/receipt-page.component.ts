import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountPaymentService, IReceiptDetails } from '@ztarmobile/zwp-service-backend';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../account-header.service';

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrls: ['./receipt-page.component.scss']
})
export class ReceiptPageComponent implements OnInit {
  public order: IReceiptDetails;
  public sub: any;
  public orderId: string;
  public page: string;
  public email: string;
  public cartItems = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public shipmentMethods: Array<any> = [
    { shippingMethod: 'USPS First Class Mail', shipmentMethodId: 'usps_first_class_mail/letter' },
    { shippingMethod: 'USPS Priority', shipmentMethodId: 'usps_priority_mail/large_envelope_or_flat' },
    { shippingMethod: 'USPS Priority Express', shipmentMethodId: 'usps_priority_mail_express/large_envelope_or_flat' }
  ];
  public merchant = { merchant: 'GoodMobile', merchantId: 'goodmobileus' };
  public isDetails = false;

  constructor(private metaService: MetaService,
              private accountHeaderService: AccountHeaderService,
              private router: Router,
              private route: ActivatedRoute,
              private accountPaymentService: AccountPaymentService,
              private toastHelper: ToastrHelperService,
              private modalHelper: ModalHelperService,
              private appState: AppState,
              private activatedRoute: ActivatedRoute) {
    this.appState.loading = true;
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      if (!!params) {
        this.orderId = params.id;
        if (!!params.fromDetails) {
          this.isDetails = true;
        }
      }
    });
    this.page = this.router.url.split('/')[2];
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setAccountMenuVisibility(false);
    this.accountHeaderService.setPageDescription('');
    this.getReceiptDetails();
  }

  public sendEmail(): void {
    const descBefore = 'The receipt will be emailed to your primary account email,';
    const descAfter = 'The receipt has successfully been emailed to';
    const customHtmlBefore = `
    <div class="details">
      <p>${descBefore}<br> ${this.email}
      </p>
    </div>`;

    const customHtmlAfter = `
    <div class="details">
      <p>${descAfter}<br> ${this.email}
      </p>
    </div>`;
    this.modalHelper.showInformationMessageModal('', '', 'Send', '', true,
      'send-receipt-email-modal', customHtmlBefore, true).result.then((result) => {
        if (!!result) {
          this.appState.loading = true;
          this.accountPaymentService.sendReceiptEmail(this.orderId).then(() => {
            this.appState.loading = false;
            this.modalHelper.showInformationMessageModal('', '', 'Close', '', true,
              'send-receipt-email-modal', customHtmlAfter);
          }, (error) => {
            this.appState.loading = false;
            this.toastHelper.showAlert(error.message || error);
          });
        }
      });
  }

  public goToOrderDetail(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDER_DETAILS}`, params]);
  }

  private getReceiptDetails(): void {
    this.activatedRoute.data.subscribe(result => {
      if (!!result.receipt) {
        this.order = result.receipt;
        this.email = this.order.customerInfo.email;
        this.appState.loading = false;
        this.order.items.reverse().map(item => {
          const exsistItem = this.cartItems.find(elm => elm.mdn === item.mdn);
          if (!!exsistItem) {
            const index = this.cartItems.findIndex(x => x.mdn === item.mdn);
            this.cartItems[index].items.splice(index, 0, item);
            this.cartItems[index].subTotal += item.unitPrice;
          } else {
            this.cartItems.push({ mdn: item.mdn, items: [{ ...item }], subTotal: item.unitPrice });
          }
        });
        this.shipmentMethods.find(method => {
          if (this.order.shippingMethod === method.shipmentMethodId) {
            this.order.shippingMethod = method.shippingMethod;
          }
        });
        if (this.order.brand === this.merchant.merchantId) {
          this.order.brand = this.merchant.merchant;
        }
      }
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message || error);
    });
  }

}
