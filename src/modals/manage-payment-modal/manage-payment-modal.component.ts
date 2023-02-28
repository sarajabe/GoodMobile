import { Component, Inject, OnInit } from '@angular/core';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { take } from 'rxjs/operators';
import {
  AccountPaymentService,
  FirebaseAccountPaymentService,
  IAddress,
  ICreditCardInfo,
  IFirebasePaymentMethod,
  IUserPlan,
  UserPlansService,
  IFirebaseAddress
} from '@ztarmobile/zwp-service-backend';
import { Subscription } from 'rxjs/Subscription';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class PaymentModalContext {
  public paymentId: string;
  public isManage: boolean;
  public userPlan: IUserPlan;
  public user: IUser;
  public customClass?: string;
}

@Component({
  selector: 'app-manage-payment-modal',
  templateUrl: './manage-payment-modal.component.html'
})
export class ManagePaymentModalComponent implements OnInit{
  public paymentInfo: ICreditCardInfo;
  public isValidPaymentInfo: boolean;
  public processingRequest: boolean;
  public setDefaultRequest: boolean;
  public editMode: boolean;
  public isValidCardInfo: boolean;
  public isValidBillingAddress: boolean;
  public methodsList: IFirebasePaymentMethod[];
  public context: any;
  public billingAddress: IFirebaseAddress;

  private paymentMethodsListSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private firebaseAccountPaymentService: FirebaseAccountPaymentService,
              private toastHelper: ToastrHelperService,
              private accountPaymentService: AccountPaymentService,
              private userPlanService: UserPlansService,
              public dialog: MatDialogRef<PaymentModalContext>,
              private location: PlatformLocation) {
    this.context = data;
    this.editMode = false;
    this.billingAddress = {isDefault: false, alias: ''} as IFirebaseAddress;
    location.onPopState(() => { this.beforeDismiss();this.dialog.close();});
    this.methodsList = [];
  }

  ngOnInit(): void {
    this.userPlanService.getUserPlan(this.context.userPlan.id).then((userPlan) => {
      this.context.userPlan = userPlan;
    });

    this.paymentMethodsListSubscription = this.firebaseAccountPaymentService.paymentMethodsList.pipe(take(1)).subscribe((methods) => {
      this.methodsList = methods;
    });
    if (!!this.context.paymentId && this.context.paymentId !== '') {
      this.editMode = true;
      const paymentMethodId = (this.context.paymentId || this.context.userPlan.paymentMethodId);
      const paymentMethod = this.methodsList.find((method) => method.id === paymentMethodId) || {} as IFirebasePaymentMethod;
      this.paymentInfo = {
        id: paymentMethod.id,
        cardNumber: '',
        cardCode: '',
        fullName: !!paymentMethod.fullName ? paymentMethod.fullName : this.context.user.fullName,
        email: !!paymentMethod.email ? paymentMethod.email : this.context.user.email,
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
      this.billingAddress = {
        address1: paymentMethod.address1,
        address2: paymentMethod.address2,
        state: paymentMethod.state,
        country: paymentMethod.country,
        city: paymentMethod.city,
        postalCode: paymentMethod.postalCode
      } as IFirebaseAddress;
    } else {
      this.paymentInfo = {} as ICreditCardInfo;
    }
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

  public makePaymentMethodAsDefault(methodKey): void {
    if (this.setDefaultRequest) {
      return;
    }
    const userPlanId = !!this.context.userPlan ? this.context.userPlan.id : undefined;
    this.setDefaultRequest = true;
    this.accountPaymentService.setPaymentMethodAsDefault(methodKey, userPlanId).then(() => {
      setTimeout(() => {
        this.userPlanService.selectUserPlan(this.context.userPlan.id);
        this.closeDialog();
        this.toastHelper.showSuccess('Default payment method set, it may take about 1 minute before the account getting the effect.');
      }, 2000);
    }, (error) => {
      this.setDefaultRequest = false;
      this.toastHelper.showAlert(error.message || error);
    });
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

  public savePaymentInfo(): void {
    this.paymentInfo.email = this.context.user.email;
    this.paymentInfo.id = this.context.paymentId;
    this.processingRequest = true;
    const mdn = !!this.context.userPlan ? this.context.userPlan.mdn : undefined;
    setTimeout(() => {
      this.accountPaymentService.getExistPaymentMethod(this.paymentInfo).then((paymentMethod) => {
          if (this.editMode) {
            this.accountPaymentService.editPaymentMethod(this.context.paymentId, this.paymentInfo).then(() => {
              this.processingRequest = false;
              this.toastHelper.showSuccess('Payment method is updated successfully');
              this.closeDialog();
            }, (error) => {
              this.processingRequest = false;
              this.toastHelper.showAlert(error.message);
              console.warn(error);
            });
          } else {
            this.accountPaymentService.addPaymentMethod(this.paymentInfo).then((methodId) => {
              if (!!this.context.userPlan && this.context.isManage) {
                this.makePaymentMethodAsDefault(methodId);
              } else {
                this.toastHelper.showSuccess('New payment method is added successfully');
                this.closeDialog();
              }
            }, (error) => {
              this.processingRequest = false;
              this.toastHelper.showAlert(error.message);
              console.warn(error);
            });
          }
      });
    });
  }

  private setValidPaymentForm(): void {
    this.isValidPaymentInfo = this.isValidBillingAddress && this.isValidCardInfo;
  }
}

