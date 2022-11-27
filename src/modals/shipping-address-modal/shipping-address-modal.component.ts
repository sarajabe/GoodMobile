import { Component, OnInit } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { IFirebaseAddress } from '@ztarmobile/zwp-service-backend';
import { PlatformLocation } from '@angular/common';

export class ShippingModalContext extends BSModalContext {
  public title: string;
  public shippingAddress?: IFirebaseAddress;
  public customClass?: string;
}

@Component({
  selector: 'app-shipping-address-modal',
  templateUrl: './shipping-address-modal.component.html'
})
export class ShippingAddressModalComponent implements CloseGuard, ModalComponent<ShippingModalContext> {
  public context: ShippingModalContext;
  public address: IFirebaseAddress;
  public isValidAddress: boolean;
  private editedAddress: IFirebaseAddress = {} as IFirebaseAddress;
  constructor(public dialog: DialogRef<ShippingModalContext>, private location: PlatformLocation) {
      this.context = dialog.context;
      dialog.setCloseGuard(this);
      location.onPopState(() => this.dialog.close());
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
    this.dialog.close(this.editedAddress);
  }

}
