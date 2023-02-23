import { Component, Inject } from '@angular/core';
import { IFirebaseAddress } from '@ztarmobile/zwp-service-backend';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ShippingModalContext {
  public title: string;
  public shippingAddress?: IFirebaseAddress;
  public customClass?: string;
}

@Component({
  selector: 'app-shipping-address-modal',
  templateUrl: './shipping-address-modal.component.html'
})
export class ShippingAddressModalComponent {
  public context: any;
  public address: IFirebaseAddress;
  public isValidAddress: boolean;
  private editedAddress: IFirebaseAddress = {} as IFirebaseAddress;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialogRef<ShippingModalContext>, private location: PlatformLocation) {
      this.context = data;
      location.onPopState(() => {this.beforeDismiss();this.dialog.close();});
      this.address = !!this.context.shippingAddress ? this.context.shippingAddress : {} as IFirebaseAddress;
      this.editedAddress = this.address;
  }
  beforeClose(): boolean {
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
    }
    return false;
  }

  beforeDismiss(): boolean {
      return this.beforeClose();
  }

  closeDialog(result): void {
    this.beforeDismiss();
      this.dialog.close(result);
  }
  public setValidAddress(isValid: boolean): void {
      setTimeout(() => {
        this.isValidAddress = isValid;
      });
  }
  public addressChanged(address: IFirebaseAddress): void {
      this.editedAddress =  address;
  }
  public saveAddress(): void {
    this.beforeDismiss();
    this.dialog.close(this.editedAddress);
  }

}
