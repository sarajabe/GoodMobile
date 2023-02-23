import { Component, Inject } from '@angular/core';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class eSIMReplacementModalContext {
  public iccid: string;
  public mdn: string;
  public customClass: string;
}
@Component({
  selector: 'app-esim-replacement-modal',
  templateUrl: './esim-replacement-modal.component.html'
})
export class eSimReplacementModalComponent {
  public context: any;
  public SITE_ID = CAPTCHA_SITE_ID;
  private captchaResponse: string;
  public captchaValid = false;
  public showValidation = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialogRef<eSIMReplacementModalContext>, private modalHelper: ModalHelperService, private location: PlatformLocation) {
    this.context = data;
    location.onPopState(() => {this.beforeDismiss();this.dialog.close();});
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

  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    this.showValidation = false;
  }

  closeDialog(): void {
    this.beforeDismiss();
    this.dialog.close(false);
  }

  confirm(): void {
    if (!!this.captchaResponse) {
      this.beforeDismiss();
      this.dialog.close(this.captchaResponse);
    } else {
      this.showValidation = true;
    }
  }
}
