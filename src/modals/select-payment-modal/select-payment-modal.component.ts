import { Component, Inject } from '@angular/core';
import { IFirebasePaymentMethod } from '@ztarmobile/zwp-service-backend';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class PlanCreditCardContext {
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
export class SelectPaymentModalComponent {
  public context: any;
  public selectedCard: IFirebasePaymentMethod;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialogRef<PlanCreditCardContext>, private location: PlatformLocation) {
    this.context = data;
    location.onPopState(() => { this.beforeDismiss(); this.dialog.close(); });
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

  beforeDismiss(): boolean {
    return this.beforeClose();
  }
  public savePayment(): void {
    this.closeDialog(this.selectedCard.id);
  }

  public closeDialog(action?: any): void {
    this.beforeDismiss();
    this.dialog.close(action);
  }
}
