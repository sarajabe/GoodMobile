import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IAcpUser } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { EBB_NAME_PATTERN, EMAIL_PATTERN, NUMBERS_ONLY_PATTERN } from 'src/app/app.config';
import { EbbManager } from 'src/services/ebb.service';

@Component({
  selector: 'app-non-exiting-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoNonExisitngAppComponent implements OnInit, OnDestroy, OnChanges {
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  @Output() setUserInfo: EventEmitter<IAcpUser> = new EventEmitter<IAcpUser>();
  @Input() savedInfo: IAcpUser;
  @Input() disable: boolean;

  public personalInfoForm: UntypedFormGroup;
  public userInfo: IAcpUser;
  public namePattern = new RegExp(EBB_NAME_PATTERN);
  public years = [];
  public showInvalidDateError = false;
  private alive = true;
  leapYear: boolean;
  constructor(private formBuilder: UntypedFormBuilder, private ebbManager: EbbManager) {
    this.getYearsValues();
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(this.namePattern), Validators.minLength(1), Validators.maxLength(50)])],
      middleName: ['', Validators.compose([Validators.pattern(this.namePattern), Validators.minLength(1), Validators.maxLength(50)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(this.namePattern), Validators.minLength(2), Validators.maxLength(50)])],
      day: ['', Validators.compose([Validators.required, Validators.pattern(NUMBERS_ONLY_PATTERN), Validators.maxLength(2), Validators.min(1), Validators.max(31)])],
      month: ['', Validators.compose([Validators.required, Validators.maxLength(2), Validators.pattern(NUMBERS_ONLY_PATTERN)])],
      year: ['', Validators.compose([Validators.required, Validators.pattern(NUMBERS_ONLY_PATTERN)])],
      option: ['', Validators.required],
      ssn: ['', Validators.compose([Validators.pattern(NUMBERS_ONLY_PATTERN), Validators.minLength(4), Validators.maxLength(4)])],
      tribalId: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(20)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN), Validators.maxLength(50)])],
    });
  }

  ngOnInit(): void {
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 1) {
        this.personalInfoForm.markAllAsTouched();
        if (!!this.personalInfoForm.valid && !this.showInvalidDateError) {
          this.userInfo = {} as IAcpUser;
          const dayFormat = this.personalInfoForm?.controls.day.value;
          this.userInfo.firstName = this.personalInfoForm?.controls.firstName.value.replace(/\s/g, "");;
          this.userInfo.middleName = !!this.personalInfoForm.controls.middleName.value ? this.personalInfoForm.controls.middleName.value : '';
          this.userInfo.lastName = this.personalInfoForm?.controls.lastName.value.replace(/\s/g, "");;
          this.userInfo.identityVerification = this.personalInfoForm?.controls.option.value;
          this.userInfo.consumerEmail = this.personalInfoForm?.controls.email.value;
          this.userInfo.last4ssn =
            this.personalInfoForm?.controls.option.value === 'ssn'
              ? this.personalInfoForm?.controls.ssn.value || null
              : null;
          this.userInfo.tribalId =
            this.personalInfoForm?.controls.option.value === 'tribal'
              ? this.personalInfoForm?.controls.tribalId.value || null
              : null;
          this.userInfo.dob = this.personalInfoForm?.controls.month.value + '/' + dayFormat + '/' + this.personalInfoForm.controls.year.value;
          this.goToNext.emit(2);
          this.setUserInfo.emit(this.userInfo);
        }
      }
    });
    if (!!this.savedInfo && !!this.savedInfo.firstName) {
      this.populateForm();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.disable) {
      this.disable = changes?.disable?.currentValue;
      if (!!this.disable) {
        this.personalInfoForm?.disable();
      }
    }
    if (!!changes.savedInfo) {
      this.savedInfo = changes.savedInfo.currentValue;
      this.populateForm();
    }
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public checkMiddleName(): void {
    if (!this.personalInfoForm.controls.middleName.value) {
      this.personalInfoForm.controls.middleName.markAsPristine();
    }
  }
  public checkMonth(): void {
    if (
      this.personalInfoForm.controls.month.value &&
      this.personalInfoForm.controls.day.value &&
      this.personalInfoForm.controls.month.value === '02' &&
      (this.personalInfoForm.controls.day.value === '30' ||
        this.personalInfoForm.controls.day.value === '31')
    ) {
      this.personalInfoForm.controls.day.setValue('');
    } else if (
      this.personalInfoForm.controls.month.value &&
      this.personalInfoForm.controls.day.value &&
      (this.personalInfoForm.controls.month.value === '02' ||
        this.personalInfoForm.controls.month.value === '04' ||
        this.personalInfoForm.controls.month.value === '06' ||
        this.personalInfoForm.controls.month.value === '09' ||
        this.personalInfoForm.controls.month.value === '11') &&
      this.personalInfoForm.controls.day.value === '31'
    ) {
      this.personalInfoForm.controls.day.setValue('');
    }
    let date = new Date();
    let todaysDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const year = this.personalInfoForm.controls.year.value;
    this.leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) ? true : false
    if (this.personalInfoForm.controls.month.value && this.personalInfoForm.controls.year.value && this.personalInfoForm.controls.day.value) {
      let selectedDate = new Date(parseInt(this.personalInfoForm.controls.year.value), parseInt(this.personalInfoForm.controls.month.value) - 1, parseInt(this.personalInfoForm.controls.day.value));
      if (selectedDate.getTime() > todaysDate.getTime() || (!this.leapYear && this.personalInfoForm.controls.day.value === '29' && this.personalInfoForm.controls.month.value === '02') || ((this.personalInfoForm.controls.day.value === '30' || this.personalInfoForm.controls.day.value === '31') && this.personalInfoForm.controls.month.value === '02')) {
        this.showInvalidDateError = true;
      } else {
        this.showInvalidDateError = false;
      }
    }
  }
  public checkIdentityType() {
    if (this.personalInfoForm.controls.option.value === 'ssn') {
      this.personalInfoForm.get('ssn').setValidators([
        Validators.compose([
          Validators.required,
          Validators.pattern(NUMBERS_ONLY_PATTERN),
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
      ]);
      this.personalInfoForm.get('ssn').updateValueAndValidity();
      this.personalInfoForm.get('tribalId').setValidators(null);
      this.personalInfoForm.get('tribalId').reset();
    } else if (this.personalInfoForm.controls.option.value === 'tribal') {
      this.personalInfoForm.get('ssn').setValidators(null);
      this.personalInfoForm.get('tribalId').setValidators([
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
      ]);
      this.personalInfoForm.get('tribalId').updateValueAndValidity();
      this.personalInfoForm.get('ssn').reset();
    }
  }
  private getYearsValues(): void {
    const today = new Date();
    const currentYear = today.getFullYear();
    for (let i = 1892; i <= currentYear; i++) {
      this.years.push(i);
    }
  }
  private populateForm(): void {
    this.personalInfoForm?.controls.firstName.setValue(this.savedInfo?.firstName);
    this.personalInfoForm?.controls.middleName.setValue(this.savedInfo?.middleName);
    this.personalInfoForm?.controls.lastName.setValue(this.savedInfo?.lastName);
    this.personalInfoForm?.controls.option.setValue(this.savedInfo?.identityVerification);
    this.personalInfoForm?.controls.ssn.setValue(this.savedInfo?.last4ssn);
    this.personalInfoForm?.controls.tribalId.setValue(this.savedInfo?.tribalId);
    this.personalInfoForm?.controls.email.setValue(this.savedInfo?.consumerEmail);
    this.checkIdentityType();
    if (!!this.savedInfo?.dob) {
      this.personalInfoForm?.controls.day.setValue(this.savedInfo?.dob.split('/')[1]);
      this.personalInfoForm?.controls.month.setValue(this.savedInfo?.dob.split('/')[0]);
      this.personalInfoForm?.controls.year.setValue(this.savedInfo?.dob.split('/')[2]);
    }
  }
}
