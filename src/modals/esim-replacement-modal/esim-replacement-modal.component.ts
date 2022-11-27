import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { PlatformLocation } from '@angular/common';

export class eSIMReplacementModalContext extends BSModalContext {
  public iccid: string;
  public mdn: string;
  public customClass: string;
}
@Component({
  selector: 'app-esim-replacement-modal',
  templateUrl: './esim-replacement-modal.component.html'
})
export class eSimReplacementModalComponent implements CloseGuard, ModalComponent<eSIMReplacementModalContext> {
  public context: eSIMReplacementModalContext;
  public SITE_ID = CAPTCHA_SITE_ID;
  private captchaResponse: string;
  public captchaValid = false;
  public showValidation = false;

  constructor(public dialog: DialogRef<eSIMReplacementModalContext>, private modalHelper: ModalHelperService, private location: PlatformLocation) {
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

  beforeDismiss(): boolean {
    return this.beforeClose();
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    this.showValidation = false;
  }

  closeDialog(): void {
    this.dialog.close(false);
  }

  confirm(): void {
    if (!!this.captchaResponse) {
      this.dialog.close(this.captchaResponse);
    } else {
      this.showValidation = true;
    }
  }
}
