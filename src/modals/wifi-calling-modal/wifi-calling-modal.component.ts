import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { IFirebaseAddress } from '@ztarmobile/zwp-service-backend';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';

export class WifiModalContext extends BSModalContext {
  public title: string;
  public termsRoute;
  public customClass?: string;
  public wifiAddress?: IFirebaseAddress;
}

@Component({
  selector: 'app-wifi-calling-modal',
  templateUrl: './wifi-calling-modal.component.html'
})
export class WifiCallingModalComponent implements CloseGuard, ModalComponent<WifiModalContext> {
  public context: WifiModalContext;
  public address: IFirebaseAddress = {} as IFirebaseAddress;
  public isValidAddress: boolean;
  public termsAgreed: boolean;
  public updateConfirmed: boolean;
  public newAddress: IFirebaseAddress = {} as IFirebaseAddress;
  private editedAddress: IFirebaseAddress = {} as IFirebaseAddress;
  constructor(public dialog: DialogRef<WifiModalContext>, private router: Router, private location: PlatformLocation) {
      this.context = dialog.context;
      this.termsAgreed = true;
      this.updateConfirmed = true;
      this.address = !!this.context.wifiAddress ? this.context.wifiAddress : {} as IFirebaseAddress;
      this.editedAddress = this.address;
      dialog.setCloseGuard(this);
      location.onPopState(() => this.dialog.close());
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
     this.newAddress = Object.assign(this.newAddress, address);
  }
  public saveAddress(): void {
    this.editedAddress = Object.assign(this.editedAddress , this.newAddress);
    this.dialog.close(this.editedAddress);
  }
  public goToTerms(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/${this.context.termsRoute}`])
    );
    window.open(url, '_blank');
  }
}

