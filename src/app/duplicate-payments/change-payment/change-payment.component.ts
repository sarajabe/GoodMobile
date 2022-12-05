import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountPaymentService, FirebaseUserProfileService, ICreditCardInfo, IFirebaseAddress, IFirebasePaymentMethod, IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { PageScrollService } from 'ngx-page-scroll-core';
import { filter, take, takeWhile } from 'rxjs/operators';
import { FadeInOutAnimation } from 'src/app/app.animations';
import { ACCOUNT_ROUTE_URLS, DUPLICATE_PAYMENTS_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';
import { CreditCardValidator } from 'src/widgets/validators/credit-card.validator';

@Component({
  selector: 'app-change-payment',
  templateUrl: './change-payment.component.html',
  styleUrls: ['./change-payment.component.scss'],
  animations: [FadeInOutAnimation]
})
export class ChangePaymentComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  public paymentId: string;
  public associatedPlans: Array<IUserPlan> = [];
  public associatedPendingPlans: Array<IUserPlan> = [];
  public showSavedMethods: Array<boolean>;
  public showSavedMethodsForPending: Array<boolean>;
  public paymentMethods = [];
  public totalPayments = [];
  public selectedPayments = [];
  public showAddPayment = [];
  public selectedPaymentsForPending = [];
  public showValidationForPending = [];
  public showValidation = [];
  public showAddPaymentForPending = [];
  public allowNext = false;
  public paymentInfoForm: FormGroup;
  public expirationYearRange: Array<number>;isValidAddress: boolean;
  public touchAddressForm = false;
  public billingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public recaptchaResponse: any;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public captchaValid = false;
  public newMethodId;
  public resetAddressForm = false;
  public paymentInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public updatedPlan: string;
  private currentDate: Date;
  private alive = true;
  newPaymentMethod: IFirebasePaymentMethod;
  showSuccessBanner: boolean;

  constructor(private route: ActivatedRoute, private userPlansService: UserPlansService, private appState: AppState, private userProfileService: FirebaseUserProfileService,
    private formBuilder: FormBuilder, private accountPaymentService: AccountPaymentService,private toastHelper: ToastrHelperService,private modalHelper: ModalHelperService, 
    private pageScrollService: PageScrollService, private router: Router) {
    this.route.params.subscribe(params => {
      if (!!params) {
        this.paymentId = params.id;
      }
    });
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.totalPayments = user.paymentMethods;
      this.paymentMethods = user.paymentMethods.filter((p)=> { return !user.duplicatePaymentId.some((d) => {
        return p.id === d.id;
      });});
    });
    this.paymentInfoForm = formBuilder.group({
      fullName: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
      cardNumber: new FormControl('', Validators.compose([Validators.required, CreditCardValidator.validateCCNumber])),
      cardCode: new FormControl('', Validators.compose([Validators.required,
      Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])),
      cardExpirationMonth: ['MM', Validators.required],
      cardExpirationYear: ['YY', Validators.required],
    }, { validator: this.validExpirationDate('cardExpirationMonth', 'cardExpirationYear') });

    this.expirationYearRange = [];
    this.currentDate = new Date();
    const year = parseInt(this.currentDate.getFullYear().toString().substr(-2), 10);
    for (let i = 0; i < 20; i++) {
      this.expirationYearRange.push(year + i);
    }
    setInterval(() => {
      this.reCaptcha.resetReCaptcha(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
    }, 1.8 * 60 * 1000);
   }

  ngOnInit(): void {
    sessionStorage.removeItem('attention-payment');
    this.userPlansService.userPlans.pipe(take(1)).subscribe((plans) => {
      this.associatedPlans = plans.filter((plan) => plan.paymentMethodId === this.paymentId && !!plan.mdn && !plan.portInRequestNumber);
      this.associatedPendingPlans = plans.filter((plan) => plan.paymentMethodId === this.paymentId && !plan.mdn);
      this.showSavedMethods = Array(this.associatedPlans.length).fill(false);
      this.selectedPayments = Array(this.associatedPlans.length).fill(null);
      this.showAddPayment = Array(this.associatedPlans.length).fill(false);
      this.showAddPaymentForPending = Array(this.associatedPendingPlans.length).fill(false);
      this.showSavedMethodsForPending = Array(this.associatedPendingPlans.length).fill(false);
      this.showValidationForPending = Array(this.associatedPendingPlans.length).fill(false);
      this.showValidation = Array(this.associatedPlans.length).fill(false);
      this.selectedPaymentsForPending = Array(this.associatedPendingPlans.length).fill(null);
      this.selectedPayments[0] = this.paymentMethods[1]
    });
  }

  public togglePaymentsList(index): void {
    this.showSavedMethods[index] = !this.showSavedMethods[index];
    this.selectedPayments[index] = !!this.showSavedMethods[index] ? this.showSavedMethods[index] : null;
    this.allowNext = this.selectedPayments.filter((p) => p === null)?.length > 0 ? false : true;
  }

  public togglePendingPaymentsList(index): void {
    this.showSavedMethodsForPending[index] = !this.showSavedMethodsForPending[index];
    this.selectedPaymentsForPending[index] = !!this.showSavedMethodsForPending[index] ? this.showSavedMethodsForPending[index] : null;
    this.allowNext = this.selectedPaymentsForPending.filter((p) => p === null)?.length > 0 ? false : true;
  }

  public toggleAddPayment(index, type): void {
    if (!!this.totalPayments && this.totalPayments.length < 10) {
      this.paymentInfoForm.reset();
      if (type == 'mdn') {
        const originalValue = this.showAddPayment[index];
        this.showAddPayment = Array(this.associatedPlans.length).fill(false);
        this.showAddPaymentForPending = Array(this.associatedPendingPlans.length).fill(false);
        this.showAddPayment[index] = !originalValue;
        this.selectedPayments = Array(this.associatedPlans.length).fill(null);
      } else {
        const originalValue = this.showAddPaymentForPending[index];
        this.showAddPayment = Array(this.associatedPlans.length).fill(false);
        this.showAddPaymentForPending = Array(this.associatedPendingPlans.length).fill(false);
        this.showAddPaymentForPending[index] = !originalValue;
        this.selectedPaymentsForPending = Array(this.associatedPendingPlans.length).fill(null);
      }
    } else {
      this.pageScrollService.scroll({
        document,
        scrollTarget: `#alert-note`,
        scrollOffset: 100,
        speed: 150
      });
    }

  }
  public checkSelectedPayments(index): void {
    this.allowNext = this.selectedPayments.filter((p) => p === null)?.length > 0 ? false : true;
    this.showAddPayment = Array(this.associatedPlans.length).fill(false);
    this.showAddPaymentForPending = Array(this.associatedPendingPlans.length).fill(false);
    this.paymentInfoForm.reset();
    this.showValidation[index] = false;
    this.showValidationForPending[index] = false;
    this.resetAddressForm = true;
  }
  ngOnDestroy(): void {
      this.alive = false;
  }

  public setValidAddress(isValid: boolean): void {
    this.isValidAddress = isValid;
  }
  public addressLookUpChanged(address): void {
    this.billingAddress = Object.assign(this.billingAddress, address);
    this.updateData();
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }

  public updateData(): void {
    this.paymentInfo.cardNumber = this.paymentInfoForm.get('cardNumber').value;
    this.paymentInfo.fullName = this.paymentInfoForm.get('fullName').value;
    this.paymentInfo.cardCode = this.paymentInfoForm.get('cardCode').value;
    this.paymentInfo = Object.assign(this.paymentInfo, this.billingAddress);
    this.paymentInfo.id = '';
  }

  public validExpirationDate(month: string, year: string): any {
    return (group: FormGroup): { [key: string]: any } => {
      const expMonth = group.controls[month];
      const expYear = group.controls[year];
      this.currentDate = new Date();
      const currentYear = this.currentDate.getFullYear() % 100;
      if (!!this.paymentInfo && !!expYear.value && !!expMonth.value) {
        this.paymentInfo.expirationDate = expMonth.value + expYear.value;
      }
      if (!!expYear.value && !!expMonth.value) {
        if (this.currentDate.getMonth() + 1 > +expMonth.value && currentYear >= +expYear.value) {
          return {
            cardExpirationInvalid: true
          };
        }
      }
    };
  }

  public saveCard(index, type): void {
    this.paymentInfoForm.markAllAsTouched();
    this.touchAddressForm = true;
    if (!!this.isValidAddress && this.paymentInfoForm.valid) {
      this.appState.loading = true;
      this.accountPaymentService.getExistPaymentMethod(this.paymentInfo).then((paymentMethod) => {
        if (!!paymentMethod && !!paymentMethod.id) {
          this.appState.loading = false;
          this.toastHelper.showWarning('This payment method already exists');
        } else {
          this.paymentInfo.address1 = AccountPaymentService.shortenAddress(this.paymentInfo.address1, 30);
          this.paymentInfo.address2 = AccountPaymentService.shortenAddress(this.paymentInfo.address2, 30);
          this.paymentInfo.city = AccountPaymentService.shortenAddress(this.paymentInfo.city, 20);
          this.appState.loading = true;
          this.accountPaymentService.addPaymentMethod(this.paymentInfo, this.recaptchaResponse).then((methodId) => {
            this.appState.loading = false;
            this.toastHelper.showSuccess('New payment method was added successfully');
            this.toggleAddPayment(index, type);
            this.paymentInfo.id = methodId;
            this.newPaymentMethod = {} as IFirebasePaymentMethod;
            this.newPaymentMethod.id = methodId;
            this.newPaymentMethod.address1 = this.paymentInfo.address1;
            this.newPaymentMethod.address2 = this.paymentInfo.address2;
            this.newPaymentMethod.city = this.paymentInfo.city;
            this.newPaymentMethod.state = this.paymentInfo.state;
            this.newPaymentMethod.postalCode = this.paymentInfo.postalCode;
            this.newPaymentMethod.country = this.paymentInfo.country;
            this.newPaymentMethod.name = this.billingAddress.name;
            this.newPaymentMethod.fullName = this.paymentInfo.fullName;
            this.newPaymentMethod.last4 = parseInt(this.paymentInfo.cardNumber.slice(-4), 10);
            this.newPaymentMethod.method = 'Credit Card';
            this.newPaymentMethod.isDefault = true;
            this.newPaymentMethod.defaultCreditCard = false;
            this.paymentMethods.push(this.newPaymentMethod);
            this.checkSelectedPayments(index);
            if (type === 'mdn') {
              this.showSavedMethods[index] = true;
              this.selectedPayments[index]=this.paymentMethods[this.paymentMethods.length - 1].id;
              this.showAddPayment[index] = false;
            } else {
              this.showSavedMethodsForPending[index] = true;
              this.selectedPaymentsForPending[index]=this.paymentMethods[this.paymentMethods.length - 1].id;
              this.showAddPaymentForPending[index] = false;
            }
            this.billingAddress.name = ' ';
          }, (error) => {
            this.appState.loading  = false;
            // this.toastHelper.showAlert(error.message);
            console.warn(error);
            const customHtml = `
              <div class="content">
                <p class="description">Please revisit the possible issues:</p>
                <ul class="list">
                  <li>Are there any typos or misspellings?</li>
                  <li>Does the CVV match the one on the back of your card?</li>
                  <li>Is the Expiry Month and Year correct?</li>
                </ul>
              </div>`
            this.modalHelper.showInformationMessageModal('We couldn’t validate your card', '', 'Back', null, true , 'invalid-card',customHtml);
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
          });
        }
      });
    }
  }

  public switchCard(index,type): void {
    if (type === 'mdn') {
      this.showValidation[index] = !!this.selectedPayments[index] ? false : true;
      if (!this.showValidation[index]) {
        this.setPlanPayment(this.associatedPlans[index], this.selectedPayments[index]);
      }
    } else {
      this.showValidationForPending[index] = !!this.selectedPaymentsForPending[index] ? false : true; 
      if (!this.showValidationForPending[index]) {
        this.setPlanPayment(this.associatedPendingPlans[index], this.selectedPaymentsForPending[index]);
      }
    }
  }

  public goToProfileSettings(): void {
    sessionStorage.setItem('attention-payment', this.paymentId);
    this.router.navigate([ACCOUNT_ROUTE_URLS.BASE + '/'+ACCOUNT_ROUTE_URLS.SETTINGS]);
  }
  private setPlanPayment(plan, methodId): void {
    this.updatedPlan = !!plan?.mdn ? (new PhonePipe()).transform(plan.mdn) : plan.basePlan.subtitle;
    this.appState.loading = true;
    this.accountPaymentService.updateAutoRenewPlan(plan.id, methodId, true).then((result) => {
      if (!!result) {
        this.appState.loading = false;
        this.showSuccessBanner = true;
        let el = document.getElementById('headerId');
        el.scrollIntoView();
        if (!!plan.mdn) {
          this.associatedPlans = this.associatedPlans.filter((a) => a.mdn !== plan.mdn);
        } else {
          this.associatedPendingPlans =this.associatedPendingPlans.filter((p) => p.id !== plan.id);
        }
        if ((this.associatedPendingPlans && this.associatedPendingPlans.length > 0) || (this.associatedPlans && this.associatedPlans.length > 0)) {
          setInterval(() => {
            this.showSuccessBanner = false;
            this.updatedPlan = '';
          }, 7000);
        }
      }
    }, (error) => {
      this.appState.loading = false;
      this.showSuccessBanner = false;
      const customHtml = `
      <div class="content">
        <p class="note">Your payment method for:</p>
        <p class="note"><b>${this.updatedPlan}</b></p>
        <p class="note">still needs to be revalidated. Please try again before you proceed.</p>
      </div>`
    this.modalHelper.showInformationMessageModal('Switch failed!', '', 'Next', null, true , 'invalid-card',customHtml);
    });
  }

  public backToPayments(): void {
    const params = {};
    params[DUPLICATE_PAYMENTS_ROUTE_URLS.PARAMS.ID]=this.paymentId;
    this.router.navigate([`/${DUPLICATE_PAYMENTS_ROUTE_URLS.BASE}/${DUPLICATE_PAYMENTS_ROUTE_URLS.PAYMENTS_LIST}`, params])
  }
}
