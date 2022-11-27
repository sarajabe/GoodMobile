import { Component } from '@angular/core';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { ModalComponent, DialogRef, CloseGuard } from 'ngx-modialog-7';
import { IFirebasePaymentMethod } from '@ztarmobile/zwp-service-backend';
import { PlatformLocation } from '@angular/common';

export class PlanCreditCardContext extends BSModalContext {
    public paymentList: Array<IFirebasePaymentMethod>;
    public title: string;
    public mdn: string;
    public buttonText: string;
    public customClass?: string;
}

@Component({
  selector: 'app-select-payment-modal',
  templateUrl: './select-payment-modal.component.html'
})
export class SelectPaymentModalComponent implements CloseGuard, ModalComponent<PlanCreditCardContext> {
  public context: PlanCreditCardContext;
  public selectedCard: IFirebasePaymentMethod;

  constructor(public dialog: DialogRef<PlanCreditCardContext>, private location: PlatformLocation)  {
      this.context = dialog.context;
      dialog.setCloseGuard(this);
      location.onPopState(() => this.dialog.close());
  }

  beforeClose(): boolean {
      if (document.body.classList.contains('modal-open')) {
          document.body.classList.remove('modal-open');
      }
      return false;
  }
  public getPaymentDetails(id): string {
      if (!!this.context.paymentList) {
        const planMethod = this.context.paymentList.find((method) => method.id === id);
        const label = this.addressLabel(planMethod) + ' Ending in ' + planMethod.last4 +
         ', Expiration Date ' + planMethod.expirationDate.substring(0, 2) +
        '/' + planMethod.expirationDate.substring(2, 4);
        return label;
      }
  }

  public addressLabel(address: IFirebasePaymentMethod): string {
      let addressLabel = '';
      if (!!address.brand) {
        addressLabel = address.brand;
      } else {
        if (!!address.alias) {
          addressLabel = address.alias;
        }
      }
      return addressLabel.toLowerCase();
  }

  public savePayment(): void {
      this.closeDialog(this.selectedCard.id);
  }

  public closeDialog(action?: any): void {
      this.dialog.close(action);
  }
}
