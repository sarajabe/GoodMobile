import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import firebase from 'firebase/compat/app';
import { UserAccountService } from '@ztarmobile/zwp-service-backend';
import { ToastrHelperService } from '../../services/toast-helper.service';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ActivatedNumberModalContext {
  public customClass?: string;
  public label?: string;
  public title?: string;
}

@Component({
  selector: 'app-add-activated-number-modal',
  templateUrl: './add-activated-number-modal.component.html'
})
export class AddActivatedNumberModalComponent implements AfterViewInit {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  public context: any;
  public phoneNumber: string;
  public verificationCode: string;
  public recaptchaResponse: any;
  public waitingConfirmCode = false;
  public processingRequest = false;
  public processingMdnRequest = false;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public captchaValid = false;
  private verificationId: string;
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<ActivatedNumberModalContext>,
    private toastHelper: ToastrHelperService,
    private userAccountService: UserAccountService,
    private location: PlatformLocation) {
    this.context = data;
    location.onPopState(() => { this.beforeDismiss(); this.dialog.close(); });
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }

  ngAfterViewInit(): void {
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

  cancel(): void {
    this.beforeDismiss();
    this.dialog.close();
  }

  public sendCode(captchaResponse?: string): void {
    if (!!this.phoneNumber && this.phoneNumber.length > 8) {
      this.processingMdnRequest = true;
      this.userAccountService.isValidPhoneNumber(this.phoneNumber, this.recaptchaResponse).then(() => {
        this.sendVerificationCode();
      }, (error) => {
        this.processingMdnRequest = false;
        this.toastHelper.showAlert(error.message);
      });
    } else {
      this.toastHelper.showAlert('Please enter valid phone number');
    }
  }

  public verifyLoginCode(): void {
    this.processingRequest = true;
    if (this.verificationCode === '999999') {
      console.log('pass verification code');
    }
    const cred = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.verificationCode);
    firebase.auth().currentUser.updatePhoneNumber(cred).then(() => {
      this.processingRequest = false;
      this.dialog.close(this.phoneNumber);
    }).catch((error) => {
      this.processingRequest = false;
      this.toastHelper.showAlert(error.message);
    });
  }

  private sendVerificationCode(): void {
    const provider = new firebase.auth.PhoneAuthProvider();
    provider.verifyPhoneNumber(`+1${this.phoneNumber}`, this.recaptchaVerifier).then((result) => {
      this.verificationId = result;
      this.waitingConfirmCode = !!result;
      this.processingMdnRequest = false;
    }).catch((error) => {
      this.processingMdnRequest = false;
      this.toastHelper.showAlert(error.message);
    });
  }
}

