import { Component, Inject } from '@angular/core';
import { IFirebaseAddress } from '@ztarmobile/zwp-service-backend';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class WifiModalContext {
  public title: string;
  public termsRoute;
  public customClass?: string;
  public wifiAddress?: IFirebaseAddress;
}

@Component({
  selector: 'app-wifi-calling-modal',
  templateUrl: './wifi-calling-modal.component.html'
})
export class WifiCallingModalComponent {
  public context: any;
  public address: IFirebaseAddress = {} as IFirebaseAddress;
  public isValidAddress: boolean;
  public termsAgreed: boolean;
  public updateConfirmed: boolean;
  public newAddress: IFirebaseAddress = {} as IFirebaseAddress;
  private editedAddress: IFirebaseAddress = {} as IFirebaseAddress;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialogRef<WifiModalContext>, private router: Router, private location: PlatformLocation) {
    this.context = data;
    this.termsAgreed = true;
    this.updateConfirmed = true;
    this.address = !!this.context.wifiAddress ? this.context.wifiAddress : {} as IFirebaseAddress;
    this.editedAddress = this.address;
    location.onPopState(() => { this.beforeDismiss(); this.dialog.close(); });
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
    this.newAddress = Object.assign(this.newAddress, address);
  }
  public saveAddress(): void {
    this.editedAddress = Object.assign(this.editedAddress, this.newAddress);
    this.beforeDismiss();
    this.dialog.close(this.editedAddress);
  }
  public goToTerms(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/${this.context.termsRoute}`])
    );
    window.open(url, '_blank');
  }
}

