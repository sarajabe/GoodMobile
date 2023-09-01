import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FirebaseAccountPaymentService, IAddress, ICreditCardInfo, IFirebaseAddress,
  IFirebasePaymentMethod, CART_TYPES, IUserPlan, UserPlansService, CustomizableMobilePlan,
  IUser, FirebaseUserProfileService, MobileCustomPlansService } from '@ztarmobile/zwp-service-backend';
import { CreditCardValidator } from '../validators/credit-card.validator';
import { CheckoutService } from '../../app/shop/checkout/checkout.service';
import { FadeInOutAnimation, ShakeAnimation } from '../../app/app.animations';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-credit-card-payment-section',
  templateUrl: './credit-card-payment-section.component.html',
  styleUrls: ['./credit-card-payment-section.component.scss'],
  animations: [ShakeAnimation, FadeInOutAnimation]
})
export class CreditCardPaymentSectionComponent  implements OnInit, OnDestroy {
  @Input() voucherPaymentUsed: boolean;
  @Input() isVoucherNotEnough: boolean;
  @Output() paymentInfoChange: EventEmitter<ICreditCardInfo> = new EventEmitter<ICreditCardInfo>();
  @Output() isPaymentInfoCollected: EventEmitter<boolean> = new EventEmitter<boolean>();
  public paymentInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public autoRenewEnabled: boolean;
  public cart: CustomizableMobilePlan;
  public CART_TYPES = CART_TYPES;
  public isItemsCart: boolean;
  public shippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public paymentInfoForm: UntypedFormGroup;
  public autoRenewForm: UntypedFormGroup;
  public billingAddressForm: UntypedFormGroup;
  public expirationYearRange: Array<number>;
  public autoRenew: boolean;
  public userPlan: IUserPlan;
  public methodsList: IFirebasePaymentMethod[];
  public selectedPaymentMethod: IFirebasePaymentMethod;
  public showAddCardSection = false;
  public animationState = 'small';
  public sharedAddressAsShipping = false;
  public usingPaymentProfile: boolean;
  public saveCCInfo = true;
  public isValidAddress = false;
  public billingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public userBillingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public noPayment: boolean;
  public disableAutoRenew: boolean;
  public toggleCount = 1;
  public storedPaymentId: string;
  public isPaymentAvailable = false;
  public user: IUser;
  public isPromo = false;
  public currentYear;
  public currentMonth;
  private alive = true;
  private currentDate: Date;
  private cardFormCtrl: UntypedFormControl;

  constructor(private firebaseAccountPaymentService: FirebaseAccountPaymentService, private formBuilder: FormBuilder, private mobilePlansService: MobileCustomPlansService,
              private userPlanService: UserPlansService, private checkoutService: CheckoutService, private userProfileService: FirebaseUserProfileService) {
    this.expirationYearRange = [];
    this.currentDate = new Date();
    const year = parseInt(this.currentDate.getFullYear().toString().substr(-2), 10);
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    for (let i = 0; i < 20; i++) {
      this.expirationYearRange.push(year + i);
    }
    this.cardFormCtrl = new UntypedFormControl('', [CreditCardValidator.validateCCNumber]);
    this.autoRenewForm = formBuilder.group(
      {
        autoRenew: new UntypedFormControl({value: this.autoRenew}),
      });
    this.paymentInfoForm = formBuilder.group(
      {
        fullName: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
        cardNumber: this.cardFormCtrl,
        saveCard: [''],
        cardCode: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])),
        cardExpirationMonth: ['', Validators.required],
        cardExpirationYear: ['', Validators.required],
      }, {validator: this.validExpirationDate('cardExpirationMonth', 'cardExpirationYear')});

    this.billingAddressForm = formBuilder.group({
      alias: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.storedPaymentId = sessionStorage.getItem('payment_id');
    const storedAutoRenew = sessionStorage.getItem('auto_renew');
    if (!!storedAutoRenew) {
      this.autoRenewEnabled = storedAutoRenew === 'true' ? true : false;
      this.autoRenew = this.autoRenewEnabled;
    }
    this.firebaseAccountPaymentService.paymentMethodsList.pipe(takeWhile(() => this.alive)).subscribe((methods) => {
      if (!!methods) {
        this.methodsList = methods;
        if (!!this.storedPaymentId && this.storedPaymentId !== '1') {
          this.toggleCount = 2;
          this.selectedPaymentMethod = this.methodsList.find((method) => method.id === this.storedPaymentId);
          this.usingPaymentProfile = true;
          this.validateAllInfoCollected();
        }
        this.showAddCardSection = this.methodsList.length > 0;
        if (!!this.storedPaymentId && this.storedPaymentId === '1') {
            this.showAddCardSection = false;
            this.paymentInfoChange.emit({id: '2', cardNumber: ''} as ICreditCardInfo); // send CC empty to checkout component to reset taxes
         }
      } else {
        this.showAddCardSection = false;
      }
      if (!!this.methodsList && this.methodsList.length > 0) {
        this.noPayment = false;
      } else {
        this.noPayment = true;
      }
    });
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);

    this.checkoutService.userCartReplySubject.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      if (!!cart) {
        this.cart = cart;
        this.disableAutoRenew = cart.cartType === CART_TYPES.PLAN_ITEMS;
        /* eslint-disable no-shadow */
        const storedAutoRenew = sessionStorage.getItem('auto_renew');
        if (!storedAutoRenew) {
          this.autoRenewEnabled = cart.cartType === CART_TYPES.NEW_PLAN && cart.basePlan ? true : false;
          this.autoRenew = this.autoRenewEnabled;
        }
        if (cart.cartType === CART_TYPES.TOPUP_PLAN || cart.cartType === CART_TYPES.CHANGE_PLAN) {
          const userPlanId = sessionStorage.getItem('plan_id');
          this.userPlanService.getUserPlan(userPlanId).then((plan) => {
            this.userPlan = plan;
            if (!!this.userPlan) {
              const storedAutoRenew = sessionStorage.getItem('auto_renew');
              if (!!storedAutoRenew) {
                this.autoRenewEnabled = storedAutoRenew === 'true' ? true : false;
                this.autoRenew = this.autoRenewEnabled;
              } else {
                this.autoRenewEnabled = this.userPlan.autoRenewPlan;
                this.autoRenew = this.autoRenewEnabled;
                sessionStorage.setItem('auto_renew', !!this.autoRenew ? 'true' : 'false');
                this.checkoutService.autoRenewSubject.next(this.autoRenew);
              }
            } else{
                this.autoRenew = this.autoRenewEnabled;
            }
          });
        }
        if (cart.cartType === CART_TYPES.PLAN_ITEMS && !!cart.addOns) {
          this.isItemsCart = true;
          this.sharedAddressAsShipping = false;
        } else {
          this.isItemsCart = false;
        }
        if (!!this.cart.voucherData) {
          if (!!this.voucherPaymentUsed && !this.isVoucherNotEnough) { // remove credit card if user enters enough voucher amount
            this.selectedPaymentMethod = {} as IFirebasePaymentMethod;
            this.paymentInfo = {} as ICreditCardInfo;
            this.paymentInfoChange.emit({id: '2', cardNumber: ''} as ICreditCardInfo);
            this.showAddCardSection = true;
          } else if (!!this.voucherPaymentUsed && !!this.isVoucherNotEnough && !this.isPaymentAvailable){
            this.validateAllInfoCollected();
          }
        }
      }
    });
    const storedShippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress'));
    if (!!storedShippingAddress) {
      this.shippingAddress = Object.assign({} , storedShippingAddress) as IFirebaseAddress;
    } else {
      this.shippingAddress = null;
    }
  }

  public showHideExistingMethods(): void {
    if (!(!!this.voucherPaymentUsed && !this.isVoucherNotEnough)) {
      if (!!this.methodsList && this.methodsList.length > 0) {
        this.showAddCardSection = !this.showAddCardSection;
      }
      if (!this.showAddCardSection) {
        // eslint-disable-next-line max-len
        if (!!this.selectedPaymentMethod) { // if there is a selected CC and the user clicks on add new card => uncheck the CC and send it empty to checkout component to reset taxes
          this.paymentInfoChange.emit({id: '2', cardNumber: ''} as ICreditCardInfo);
          this.selectedPaymentMethod = null;
          this.usingPaymentProfile = false;
          this.sharedAddressAsShipping = false;
        }
        if (!!this.autoRenew) {
          this.saveCCInfo = true;
        }
      }
      this.animationState = this.showAddCardSection ? 'large' : 'small';
      // force revalidate form
      this.validateAllInfoCollected();
    }
}

  public validExpirationDate(month: string, year: string): any {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      const expMonth = group.controls[month];
      const expYear = group.controls[year];
      if (!!this.paymentInfo && !!expYear.value && !!expMonth.value) {
        this.paymentInfo.expirationDate = expMonth.value + expYear.value;
      }
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

  public toggleExistingPaymentMethod(paymentMethod: IFirebasePaymentMethod, event?): void {
    if (!!event) {
      event.preventDefault();
    }
    if (this.toggleCount === 1 && !this.storedPaymentId) {
      this.selectedPaymentMethod = paymentMethod;
    }
    if (this.selectedPaymentMethod === paymentMethod && this.toggleCount > 1){
      this.selectedPaymentMethod = undefined;

    }else{
      this.toggleCount = 2;
      this.selectedPaymentMethod = paymentMethod;
      this.showAddCardSection = true;
    }
    this.usingPaymentProfile = !!this.selectedPaymentMethod;
    this.billingAddressForm.reset();
    this.paymentInfoForm.reset();
    this.sharedAddressAsShipping = false;
    this.billingAddress = {address1: '', address2: '', alias: '', city: '', state: '', postalCode: ''} as IFirebaseAddress;
    this.paymentMethodChanged(this.selectedPaymentMethod);

  }

  public updateData(): void{
    this.usingPaymentProfile = false;
    this.paymentInfo = Object.assign(this.paymentInfo, this.billingAddress);
    const cardExpirationMonth = this.paymentInfoForm.get('cardExpirationMonth').value;
    const cardExpirationYear = this.paymentInfoForm.get('cardExpirationYear').value;
    if (!!cardExpirationMonth && !!cardExpirationYear ) {
      this.paymentInfo.expirationDate = cardExpirationMonth + cardExpirationYear;
    }
    this.paymentInfo.id = '';
    if (!!this.billingAddress && this.billingAddress.address1) {
      this.validateAllInfoCollected();
      if (!!this.validateAllInfoCollected()) {
        this.isPaymentAvailable = true;
      }
    }
    this.paymentInfoChange.emit(this.paymentInfo);
    if (!!this.paymentInfoForm.valid) {
       this.validateAllInfoCollected();
    }
  }

  public updateAutoRenew(): void {
    if (!this.disableAutoRenew) {
      this.checkoutService.updateAutoRenew(this.autoRenew);
      this.mobilePlansService.setAutoRenewPlan(this.autoRenew);
      sessionStorage.setItem('auto_renew', !!this.autoRenew ? 'true' : 'false');
      this.autoRenewEnabled = this.autoRenew;
      if (!!this.autoRenew) {
        this.saveCCInfo = true;
      }
    }
  }

  public updateSaveCCInfoChanged(): void {
    if (!!this.autoRenew) {
      this.saveCCInfo = true; // if there is auto renew then we save the cc
    }
    this.checkoutService.updateSaveCC(this.saveCCInfo);
  }

  public toggleSharedAddress(): void {
    if (!!this.sharedAddressAsShipping) {
      this.billingAddress = this.shippingAddress;
    } else {
      this.billingAddress = {address1: '', address2: '', alias: '', city: '', state: '', postalCode: ''} as IFirebaseAddress;
      this.isValidAddress = false;
      this.paymentInfoChange.emit({id: '2', cardNumber: ''} as ICreditCardInfo);
    }
    this.updateData();
    this.validateAllInfoCollected();
  }
  public addressLookUpChanged(address: IAddress): void {
    this.billingAddress = Object.assign(this.billingAddress, address);
    if (typeof this.billingAddress.address1 === 'object' && !!this.billingAddress?.address1) {
      this.billingAddress.address1 = this.billingAddress.address1['main_text'];
    }
    this.updateData();
  }

  public setValidAddress(isValid: boolean): void{
    this.isValidAddress = isValid;
    if (!!this.billingAddressForm.dirty) {
      this.validateAllInfoCollected();
    }
  }

  private paymentMethodChanged(paymentMethod: IFirebasePaymentMethod): void {
    if (!!paymentMethod) {
      if (paymentMethod.id) {
        const cardInfo: ICreditCardInfo = {
          id: paymentMethod.id,
          cardNumber: '',
          cardCode: '',
          fullName: '',
          email: '',
          type: 'creditCardProfile',
          primary: paymentMethod.isDefault,
          expirationDate: paymentMethod.expirationDate,
          address1: paymentMethod.address1,
          address2: paymentMethod.address2,
          state: paymentMethod.state,
          country: paymentMethod.country,
          city: paymentMethod.city,
          postalCode: paymentMethod.postalCode
        } as ICreditCardInfo;
        this.validateAllInfoCollected();
        if (!!this.validateAllInfoCollected()) {
          this.isPaymentAvailable = true;
        }
        this.paymentInfoChange.emit(Object.assign({}, cardInfo, {alias: paymentMethod.alias} as IFirebaseAddress));
      }
    } else {
      this.validateAllInfoCollected();
      this.paymentInfoChange.emit({id: '2', cardNumber: ''} as ICreditCardInfo);
    }
  }

  private validateAllInfoCollected(): boolean {
    const allValid =
      (this.usingPaymentProfile)
      || (this.sharedAddressAsShipping && this.paymentInfoForm.valid)
      || (!this.sharedAddressAsShipping && this.paymentInfoForm.valid && this.billingAddressForm.valid && this.isValidAddress);
    this.isPaymentInfoCollected.emit(allValid);
    return allValid ;
  }
}

