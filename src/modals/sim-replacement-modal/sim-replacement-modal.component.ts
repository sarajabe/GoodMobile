import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { PlatformLocation } from '@angular/common';

export class SIMReplacementModalContext extends BSModalContext {
  public title: string;
  public message: string;
  public okText: string;
  public okBtnClass: string;
  public customClass: string;
  public network: string;
  public labelText: string;
  public showRecaptcha?: boolean;
  public disabledIccid?: boolean;
  public iccid?: string;
}
@Component({
  selector: 'app-sim-replacement-modal',
  templateUrl: './sim-replacement-modal.component.html'
})
export class SimReplacementModalComponent implements CloseGuard, ModalComponent<SIMReplacementModalContext> {
  public context: SIMReplacementModalContext;
  public userInputValue: string;
  public validLength;
  public showRecaptcha: boolean;
  public SITE_ID = CAPTCHA_SITE_ID;
  public disabledIccid = false;
  private captchaResponse: string;
  public captchaValid = false;

  constructor(public dialog: DialogRef<SIMReplacementModalContext>, private modalHelper: ModalHelperService, private location: PlatformLocation) {
    this.context = dialog.context;
    this.showRecaptcha = !!this.context.showRecaptcha ? this.context.showRecaptcha : false;
    this.captchaValid = !this.showRecaptcha ? true : false;
    this.disabledIccid = !!this.context.disabledIccid ? this.context.disabledIccid : false;
    if (!!this.context && this.context.iccid) {
      this.userInputValue = this.context.iccid;
    }
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
    this.validLength = 20;
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
  }
  public showIccidModal(): void {
    this.modalHelper.showInformationMessageModal('How to find your SIM card (ICCID)', '', 'Got it!', null, true, 'iccid-info-modal',
      `<div class="text-content-holder">
          <p class="text"> You can find your SIM card (ICCID) on the back of your SIM card. Or through:<b> Settings>About Phone> Status <b></p>
       </div>
       <div class="image-container">
        <span class="pointer-holder"></span>
        <span class="rect rect1">89</span>
        <span class="rect rect2"></span>
        <span class="rect rect4"></span>
        <img src="assets/img/Sim graphic.svg"/>
        <span class="big-rect rect4"></span>
        <span class="image-pointer">Your SIM card (ICCID) is a 20 digit number on the back of your SIM card beginning with the numbers 89.</span>
       </div>`
    );
  }
  closeDialog(): void {
    this.dialog.close(false);
  }

  submitUserInput(): void {
    this.dialog.close({ input: this.userInputValue, captcha: this.captchaResponse });
  }

  checkLength(): void {
    if (this.context.network && this.context.network === 'tmo') {
      this.validLength = 19;
    } else {
      this.validLength = 20;
    }
    return this.validLength;
  }
}
