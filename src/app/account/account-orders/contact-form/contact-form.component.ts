import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OrderInfo, UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { SupportService } from '../../../../services/support.service';
import { ACCOUNT_ROUTE_URLS } from '../../../app.routes.names';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  @Input() orderInfo: OrderInfo;
  @Input() isSomethingElse: boolean;
  @Input() hasBack: boolean;
  @Output() backToMain: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() backOneStep: EventEmitter<boolean> = new EventEmitter<boolean>();
  public contactForm: UntypedFormGroup;
  public shippingAddress: any;
  public processingRequest = false;
  public ticketNumber: string;
  public orderId;
  public optionTitles = {
    'order-not-recieved': 'Order not received',
    'missing-items': 'Wrong or missing item(s)'
  };
  public ticketSubmitted = false;
  public setSticky = false;

  constructor(
    private supportService: SupportService,
    private toastHelper: ToastrHelperService,
    private route: ActivatedRoute,
    private appState: AppState,
    private accountOrderService: UserOrdersService,
    private router: Router) {
      this.route.params.subscribe(params => {
        if (!!params) {
          this.orderId = params.id;
          // this.getOrderDetails(this.orderId);
        }
      });
  }

  ngOnInit(): void {
    this.contactForm = new UntypedFormGroup({
      phoneNumber: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[1-9][0-9]*$/)])),
      description: new UntypedFormControl('', Validators.required)
    });
  }
  public backToReportIssue(): void {
    this.backToMain.emit(true);
  }
  public submitUserIssue(): void {
    if (!this.ticketSubmitted) {
      this.contactForm.markAllAsTouched();
      if (this.contactForm.valid) {
        this.appState.loading  = true;
        let name = '';
        const phone = this.contactForm.get('phoneNumber').value;
        const description = this.contactForm.get('description').value;
        const email = this.orderInfo.customer.email;
        if (!!email) {
          name = email.substring(0, email.lastIndexOf("@"))
        }
        const body = {
          phone: `${phone}`,
          description,
          name: this.orderInfo.customer.fullName || name,
          shippingAddress: this.orderInfo.shippingInfo.shippingAddress ? `${this.orderInfo.shippingInfo.shippingAddress.address1},
          ${this.orderInfo.shippingInfo.shippingAddress.city},${this.orderInfo.shippingInfo.shippingAddress.state},
          ${this.orderInfo.shippingInfo.shippingAddress.postalCode}` : '',
          orderId: this.orderInfo.id,
          customerId: this.orderInfo.customer.customerId,
          orderDate: new Date(this.orderInfo.createdDate).toISOString(),
          processedDate: new Date(this.orderInfo.updateDate).toISOString(),
          shippingType: this.orderInfo.shippingInfo.shipmentMethodId,
          trackingNumber: this.orderInfo.shippingInfo.trackingNumber
        };
        this.supportService.createTicket(body).then((result) => {
          if (!!result) {
            this.appState.loading = false;
            this.ticketNumber = result.ticketId;
            this.ticketSubmitted = true;
          }
        }).catch(error => {
          this.appState.loading = false;
          this.ticketSubmitted = false;
          console.error(error);
          this.toastHelper.showAlert(error.message);
        });
      }
    } else {
      this.backToReportIssue();
    }
  }

  public back(): void {
    this.backOneStep.emit(true);
  }

  // @HostListener('window:scroll', ['$event']) 
  // setStickfooter(event) {
  //   let footer = document.getElementById('footer');
  //   let offset = window.pageYOffset;
  //   if (window.innerWidth > 1024) {
  //     this.setSticky = window.pageYOffset >= (footer.offsetHeight - 92) ? false : true;
  //   } else {
  //     if (window.innerWidth > 639) {
  //       this.setSticky = window.pageYOffset >= (footer.offsetHeight - 165) ? false : true;
  //     } else {
  //         this.setSticky = window.pageYOffset >= (footer.offsetHeight - 350 ) ? false : true;
  //     }
  //   }
  // }

}
