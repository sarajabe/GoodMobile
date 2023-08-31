import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ICreditCardInfo } from '@ztarmobile/zwp-service-backend';
import { CreditCardValidator } from '../validators/credit-card.validator';

@Component({
  selector: 'app-credit-card-payment',
  templateUrl: 'credit-card-payment.component.html'
})
export class CreditCardPaymentComponent implements OnDestroy, OnInit, OnChanges {

  @Input() paymentInfo: ICreditCardInfo;
  @Output() paymentInfoChange: EventEmitter<ICreditCardInfo> = new EventEmitter();
  @Output() isValid: EventEmitter<any> = new EventEmitter();

  public paymentInfoForm: UntypedFormGroup;
  public expirationYearRange: Array<number>;
  public isValidName = true;

  private currentDate: Date;
  private cardFormCtrl: UntypedFormControl;

  constructor(private cdRef: ChangeDetectorRef, private formBuilder: FormBuilder) {
    this.expirationYearRange = [];
    this.currentDate = new Date();

    for (let i = 0; i < 20; i++) {
      this.expirationYearRange.push(this.currentDate.getFullYear() + i);
    }

    this.cardFormCtrl = new UntypedFormControl('', [CreditCardValidator.validateCCNumber]);

    this.paymentInfoForm = formBuilder.group(
      {
        fullName: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
        cardNumber: this.cardFormCtrl,
        cardCode: new UntypedFormControl('', Validators.compose([Validators.required,
          Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])),
        cardExpirationMonth: ['', Validators.required],
        cardExpirationYear: ['', Validators.required],
      }, {validator: this.validExpirationDate('cardExpirationMonth', 'cardExpirationYear')});

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.paymentInfoForm.controls['cardExpirationYear'].setValue(this.expirationYearRange[0].toString());
  }

  public validExpirationDate(month: string, year: string): any {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      const expMonth = group.controls[month];
      const expYear = group.controls[year];
      const combinedDate = new UntypedFormControl('', Validators.required);
      if (!!this.paymentInfo && !!expYear.value && !!expMonth.value) {
        this.paymentInfo.expirationDate = expMonth.value.substring(0, 2) + expYear.value.substring(2, 4);
      }

      if (!!expYear.value && !!expMonth.value) {
        if (this.currentDate.getMonth() > +expMonth.value && this.currentDate.getFullYear() >= +expYear.value) {
          return {
            cardExpirationInvalid: true
          };
        }
      }
    };
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.paymentInfo) {
      this.paymentInfo = changes.paymentInfo.currentValue || {
        cardNumber: '',
        cardCode: '',
      } as ICreditCardInfo;
    }
  }

  ngOnDestroy(): void {
    this.cdRef.detach();
  }

  public updateData(): void{
    this.paymentInfo.cardNumber = this.paymentInfoForm.get('cardNumber').value;
    this.paymentInfo.fullName = this.paymentInfoForm.get('fullName').value;
    this.paymentInfo.cardCode = this.paymentInfoForm.get('cardCode').value;
    this.paymentInfoChange.emit(this.paymentInfo);
    this.isValid.emit(this.paymentInfoForm.valid && !!this.isValidName);
  }

  public validateName(): boolean {
    this.isValidName = /^[a-zA-Z][a-zA-Z\s]*$/.test(this.paymentInfo.fullName);
    console.log('name validation ', this.isValidName);
    return this.isValidName;
  }
}
