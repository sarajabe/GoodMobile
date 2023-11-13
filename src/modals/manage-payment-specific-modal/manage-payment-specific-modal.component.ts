import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { take } from 'rxjs/operators';
import {
  AccountPaymentService,
  FirebaseAccountPaymentService,
  IAddress,
  ICreditCardInfo,
  IFirebasePaymentMethod,
  IUserPlan,
  UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';

export class G2gPaymentModalContext {
  public paymentMethodId: string;
  public isManage: boolean;
  public userPlan: IUserPlan;
  public user: IUser;
  public customClass?: string;
  public accountSettingsRoute?: string;
}

@Component({
  selector: 'app-manage-payment-specific-modal',
  templateUrl: './manage-payment-specific-modal.component.html'
})
export class ManagePaymentSpecificModalComponent implements OnInit {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;

  public paymentInfo: ICreditCardInfo;
  public isValidPaymentInfo: boolean;
  public processingRequest: boolean;
  public setDefaultRequest: boolean;
  public methodsList: IFirebasePaymentMethod[];
  public editMode: boolean;
  public context: any;
  public selectedMethodId: string;
  public recaptchaResponse: any;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public captchaValid = false;

  private isValidBillingAddress: boolean;
  private isValidCardInfo: boolean;
  private paymentMethodsListSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private firebaseAccountPaymentService: FirebaseAccountPaymentService,
    private toastHelper: ToastrHelperService,
    private accountPaymentService: AccountPaymentService,
    private userPlanService: UserPlansService,
    private router: Router,
    public dialog: MatDialogRef<G2gPaymentModalContext>,
    private location: PlatformLocation) {
    this.context = data;
    this.editMode = false;
    location.onPopState(() => { this.beforeDismiss(); this.dialog.close(); });
  }

  ngOnInit(): void {
    this.userPlanService.getUserPlan(this.context.userPlan.id).then((userPlan) => {
      this.context.userPlan = userPlan;
      this.selectedMethodId = this.context.userPlan.paymentMethodId;
    });

    this.paymentMethodsListSubscription = this.firebaseAccountPaymentService.paymentMethodsList.pipe(take(1)).subscribe((methods) => {
      this.methodsList = methods;
      this.fillPaymentInfoForm();
    });
    setInterval(() => {
      if (!!this.reCaptcha && !!this.context?.isManage) {
        this.reCaptcha.resetReCaptcha(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
        this.reCaptcha.execute();
      }
    }, 1.8 * 60 * 1000);
  }

  beforeClose(): boolean {
    if (!this.isValidPaymentInfo) {
      if (!!this.paymentMethodsListSubscription) {
        this.paymentMethodsListSubscription.unsubscribe();
      }
      if (document.body.classList.contains('modal-open')) {
        document.body.classList.remove('modal-open');
      }
    }
    return this.isValidPaymentInfo;
  }
  beforeDismiss(): boolean {
    return this.beforeClose();
  }
  public closeDialog(methodId?: string): void {
    this.isValidPaymentInfo = false;
    this.beforeDismiss();
    this.dialog.close(methodId);
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }

  public makePaymentMethodAsDefault(methodKey): void {
    if (this.setDefaultRequest) {
      return;
    }
    const userPlanId = !!this.context.userPlan ? this.context.userPlan.id : undefined;
    this.setDefaultRequest = true;
    this.accountPaymentService.setPaymentMethodAsDefault(methodKey, userPlanId).then(() => {
      setTimeout(() => {
        this.userPlanService.selectUserPlan(this.context.userPlan.id);
        this.setDefaultRequest = false;
        this.toastHelper.showSuccess('Default payment method set, it may take about 1 minute before the account getting the effect.');
        this.closeDialog('success');
      }, 2000);
    }, (error) => {
      this.setDefaultRequest = false;
      this.toastHelper.showAlert(error.message || error);
      this.closeDialog('error');
    });
  }
  public goToSettings(): void {
    this.closeDialog();
    this.router.navigate([this.context.accountSettingsRoute]);
  }
  public setValidCardInfo(isValid: boolean): void {
    setTimeout(() => {
      this.isValidCardInfo = isValid;
      this.setValidPaymentForm();
    });
  }

  public setValidBillingAddress(isValid: boolean): void {
    this.isValidBillingAddress = isValid;
    this.setValidPaymentForm();
  }

  public updateAddress(address: IAddress): void {
    if (!!this.paymentInfo) {
      this.paymentInfo = Object.assign(this.paymentInfo, address);
    }
  }

  public checkBoxLabel(address: IFirebasePaymentMethod): string {
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

  public savePaymentInfo(): void {
    this.paymentInfo.fullName = this.context.user.fullName;
    this.paymentInfo.email = this.context.user.email;
    this.paymentInfo.id = this.context.paymentMethodId;
    this.processingRequest = true;
    const mdn = !!this.context.userPlan ? this.context.userPlan.mdn : undefined;
    setTimeout(() => {
      this.accountPaymentService.getExistPaymentMethod(this.paymentInfo).then((paymentMethod) => {
        if (!!paymentMethod && !!paymentMethod.id) {
          this.processingRequest = false;
          this.toastHelper.showWarning('This payment method already exists');
        } else {
          if (this.editMode) {
            this.accountPaymentService.editPaymentMethod(paymentMethod.id, this.paymentInfo).then(() => {
              this.closeDialog();
            }, (error) => {
              this.processingRequest = false;
              this.toastHelper.showAlert(error.message);
              console.warn(error);
            });
          } else {
            this.accountPaymentService.addPaymentMethod(this.paymentInfo, this.recaptchaResponse).then((methodId) => {
              if (!!this.context.userPlan && this.context.isManage) {
                this.makePaymentMethodAsDefault(methodId);
                this.reCaptcha.resetReCaptcha();
                this.reCaptcha.execute();
              } else {
                this.reCaptcha.resetReCaptcha();
                this.reCaptcha.execute();
                this.toastHelper.showSuccess('New payment method was added successfully');
                this.closeDialog();
              }
            }, (error) => {
              this.processingRequest = false;
              this.toastHelper.showAlert(error.message);
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
              console.warn(error);
            });
          }
        }
      });
    });
  }

  private setValidPaymentForm(): void {
    this.isValidPaymentInfo = this.isValidBillingAddress && this.isValidCardInfo;
  }

  private fillPaymentInfoForm(): void {
    if (!!this.context.paymentMethodId) {
      this.editMode = true;

      const paymentMethodId = (this.context.paymentMethodId || this.context.userPlan.paymentMethodId);
      const paymentMethod = this.methodsList.find((method) => method.id == paymentMethodId) || {} as IFirebasePaymentMethod;
      this.paymentInfo = {
        id: paymentMethod.id,
        cardNumber: '',
        cardCode: '',
        fullName: this.context.user.fullName,
        email: this.context.user.email,
        type: 'creditCard',
        primary: !!this.context.userPlan ? this.context.userPlan.paymentMethodId === paymentMethod.id : false,
        expirationDate: !!paymentMethod.expirationDate ? paymentMethod.expirationDate : null,
        address1: paymentMethod.address1,
        address2: paymentMethod.address2,
        state: paymentMethod.state,
        country: paymentMethod.country,
        city: paymentMethod.city,
        postalCode: paymentMethod.postalCode
      } as ICreditCardInfo;
    } else {
      this.paymentInfo = {
        fullName: this.context.user.fullName,
        email: this.context.user.email
      } as ICreditCardInfo;
    }
  }
}
