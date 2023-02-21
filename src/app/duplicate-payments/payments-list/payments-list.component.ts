import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from "lodash";
import { filter, take, takeWhile } from 'rxjs/operators';
import { AccountPaymentService, FirebaseUserProfileService, IFirebaseAddress, IUser, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { AppState } from 'src/app/app.service';
import { CreditCardValidator } from 'src/widgets/validators/credit-card.validator';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { DUPLICATE_PAYMENTS_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss']
})
export class PaymentsListComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  public user: IUser;
  public duplicatePayments = [];
  public editCards;
  public paymentInfoForm: UntypedFormGroup
  public expirationYearRange: Array<number>;isValidAddress: boolean;
  public touchAddressForm = false;
  public billingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public billingAddressForm: UntypedFormGroup;
  public recaptchaResponse: any;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public captchaValid = false;
  public newMethodId;
  public updatedPayment;
  private currentDate: Date;
  private alive = true;
  showSuccessBanner: boolean;

  constructor(private userProfileService: FirebaseUserProfileService, private appState: AppState, private router: Router, private formBuilder: UntypedFormBuilder, private route: ActivatedRoute,
    private userPlansService: UserPlansService, private accountPaymentService: AccountPaymentService, private toastHelper: ToastrHelperService, private modalHelper: ModalHelperService) { 
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => {
      this.user = user;
      if (!!this.user.duplicatePaymentId) {
        this.user.duplicatePaymentId.map((p) => {
          const matchingPayment = this.user.paymentMethods.find((method) => method.id === p.id);
          if (!!matchingPayment) {
            this.duplicatePayments.push(matchingPayment);
          }
          this.editCards = Array(this.duplicatePayments.length).fill(false);
        });
        this.route.params.pipe(takeWhile(() => this.alive)).subscribe(params => {
          if (!!params && !!params.id) {
            const paymentId = params.id;
            this.updatedPayment = this.duplicatePayments.find((p) => p.id === paymentId);
            this.showSuccessBanner = true;
            setInterval(() => {
              this.showSuccessBanner = false;
              this.updatedPayment = '';
            }, 7000);
          }
        });
      }
    });
    this.paymentInfoForm = formBuilder.group({
      fullName: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
      cardNumber: new UntypedFormControl('', Validators.compose([Validators.required, CreditCardValidator.validateCCNumber])),
      cardCode: new UntypedFormControl('', Validators.compose([Validators.required,
      Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])),
      cardExpirationMonth: ['', Validators.required],
      cardExpirationYear: ['', Validators.required],
    }, { validator: this.validExpirationDate('cardExpirationMonth', 'cardExpirationYear') });

    this.expirationYearRange = [];
    this.currentDate = new Date();
    const year = parseInt(this.currentDate.getFullYear().toString().substr(-2), 10);
    for (let i = 0; i < 20; i++) {
      this.expirationYearRange.push(year + i);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public toggleEditCard(index): void {
    this.editCards = Array(this.duplicatePayments.length).fill(false);
    this.editCards[index] = !this.editCards[index];
    this.fillFormData(index);
  }

  public validExpirationDate(month: string, year: string): any {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      const expMonth = group.controls[month];
      const expYear = group.controls[year];
      this.currentDate = new Date();
      const currentYear = this.currentDate.getFullYear() % 100;
      if (!!expYear.value && !!expMonth.value) {
        if (this.currentDate.getMonth() + 1 > +expMonth.value && currentYear >= +expYear.value) {
          return {
            cardExpirationInvalid: true
          };
        }
      }
    };
  }
  
  public setValidAddress(isValid: boolean): void {
    this.isValidAddress = isValid;
  }
  public addressLookUpChanged(address): void {
    this.billingAddress = Object.assign(this.billingAddress, address);
  }

  public updateDuplicateCard(index): void {
    this.touchAddressForm = true;
    this.paymentInfoForm.markAllAsTouched();
    if (!!this.isValidAddress && this.paymentInfoForm.valid) {

        const addedPayment = _.cloneDeep(this.duplicatePayments[index]);
        const paymentId = addedPayment.id;
        addedPayment.fullName = this.paymentInfoForm.get('fullName').value;
        addedPayment.cardNumber = this.paymentInfoForm.get('cardNumber').value;
        addedPayment.cardCode = this.paymentInfoForm.get('cardCode').value;
        addedPayment.expirationDate = this.paymentInfoForm.get('cardExpirationMonth').value + this.paymentInfoForm.get('cardExpirationYear').value;
        delete addedPayment.last4;
        delete addedPayment.id;
        addedPayment.name = this.billingAddress.name;
        addedPayment.alias = this.billingAddress.name;
        Object.assign(addedPayment, this.billingAddress);
        this.appState.loading = true;
        this.accountPaymentService.addPaymentMethod(addedPayment, this.recaptchaResponse, true).then((methodId) => {
          // debugger;
          this.duplicatePayments = this.duplicatePayments.filter((payment) => payment.id !== paymentId);
          if (!!this.duplicatePayments && this.duplicatePayments.length > 0) {
            this.modalHelper.showInformationMessageModal('Not Done Yet!', 'There are still payment method(s) that require your attention', 'Back', '', false, 'duplicate-result-modal');
            this.user.duplicatePaymentId = this.user.duplicatePaymentId.filter((p) => p.id === this.duplicatePayments[index].id);
          } else {
            this.user.duplicatePaymentId = [];
          }
          this.appState.loading = false;
          this.user.paymentUpdateNeeded = !!this.duplicatePayments && this.duplicatePayments.length > 0 ? true : false;
          this.userProfileService.updateUserProfile(this.user);
        }, (error) => {
          this.appState.loading = false;
          this.modalHelper.showInformationMessageModal('Error!', 'An error has occured, kindly double check the card information entered. ', 'Back', '', false, 'duplicate-result-modal error');
          this.editCards[index] = false;
        });
    }
  }

  private fillFormData(index): void {
    if (this.editCards[index]) {
      this.paymentInfoForm.controls.fullName.setValue(this.duplicatePayments[index].fullName);
      this.paymentInfoForm.controls.cardNumber.reset()
      this.paymentInfoForm.controls.cardCode.reset();
      this.paymentInfoForm.controls.cardNumber.markAsPristine();
      this.paymentInfoForm.controls.cardCode.markAsPristine();
      this.paymentInfoForm.controls.cardExpirationMonth.setValue(this.duplicatePayments[index].expirationDate.substring(0, 2));
      this.paymentInfoForm.controls.cardExpirationYear.setValue(this.duplicatePayments[index].expirationDate.substring(2));
    } else {
      this.paymentInfoForm.reset();
    }
  }


  public deletePaymentMethod(index) {
    const deletedPayment = this.duplicatePayments[index];
    this.userPlansService.userPlans.pipe(take(1)).subscribe((plans) => {
      this.appState.loading = false;
      const filteredPlansUsingSameMethodId = plans.filter((plan) => plan.paymentMethodId === this.duplicatePayments[index].id);
      if (filteredPlansUsingSameMethodId.length >= 1) {
        console.warn('Plans using same method: ', filteredPlansUsingSameMethodId);
        this.modalHelper.showMdnsListModal('Attention!', filteredPlansUsingSameMethodId, deletedPayment.id, 'mdn-list').result.then((res) => {
          if (!!res) {
            const params = {};
            params[DUPLICATE_PAYMENTS_ROUTE_URLS.PARAMS.ID] = this.duplicatePayments[index].id;
            this.router.navigate(['/' + DUPLICATE_PAYMENTS_ROUTE_URLS.BASE+ '/' + DUPLICATE_PAYMENTS_ROUTE_URLS.CHANGE_PREFERRED_PAYMENT,params]);
          }
        })
      } else {
        this.modalHelper.showConfirmMessageModal('Are you sure you want to delete this payment card?',
        `This card will be deleted`, 'Yes', 'No', 'confirm-modal delete-duplicate')
        .result.then((result) => {
          if (!!result) {
            this.appState.loading = true;
            this.accountPaymentService.deletePaymentMethod(deletedPayment.id).then((data) => {
              this.user.duplicatePaymentId = this.user.duplicatePaymentId.filter((p) => !!p.id && p.id !== deletedPayment.id);
              this.user.paymentUpdateNeeded = this.user.duplicatePaymentId.length > 0 ? true : false; 
              this.userProfileService.updateUserProfile(this.user).then(() => {
                this.appState.loading = false;
                this.duplicatePayments = this.duplicatePayments.filter((payment) => payment.id !== this.duplicatePayments[index].id);
                this.modalHelper.showInformationMessageModal('Successfully deleted!', 'Card has been successfully deleted.', 'Done', '', false, 'duplicate-result-modal');
              }, (error) => {
                this.appState.loading = false;
                this.toastHelper.showAlert('An error occured while updating your payment, please try again!');
              })
            }, (error) => {
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message);
            });
          }
        });
      }
    });
  }

  public goToHomePage(): void {
    this.router.navigate([ROUTE_URLS.HOME]);
  }
}
