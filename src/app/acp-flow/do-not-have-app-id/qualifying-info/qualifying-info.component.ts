import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IAcpUser } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { EBB_NAME_PATTERN, NUMBERS_ONLY_PATTERN } from 'src/app/app.config';
import { EbbManager } from 'src/services/ebb.service';

@Component({
  selector: 'app-qualifying-info',
  templateUrl: './qualifying-info.component.html',
  styleUrls: ['./qualifying-info.component.scss']
})
export class QualifyingInfoComponent implements OnInit, OnDestroy, OnChanges {
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  @Output() setChildInfo: EventEmitter<IAcpUser> = new EventEmitter<IAcpUser>();
  @Input() disable: boolean;
  @Input() bbqInfo: IAcpUser;
  public childInfo: IAcpUser = {} as IAcpUser;
  public qualifyingForm: FormGroup;
  public childInfoForm: FormGroup;
  public options = [{ id: 'indivisual', value: 'I qualify as an individual' },
  { id: 'child', value: 'I qualify through my child or dependent' }
  ];
  public namePattern = new RegExp(EBB_NAME_PATTERN);
  public years = [];
  public showInvalidDateError = false;

  private validateChild = false;
  private alive = true;
  leapYear: boolean;
  constructor(private ebbManager: EbbManager, private formBuilder: FormBuilder) {
    this.getYearsValues();
    this.qualifyingForm = new FormGroup({
      option: new FormControl('', Validators.required)
    });
    this.childInfoForm = this.formBuilder.group({
      firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.namePattern),
          Validators.minLength(1),
          Validators.maxLength(50),
        ]),
      ],
      middleName: [
        "",
        Validators.compose([
          Validators.pattern(this.namePattern),
          Validators.minLength(1),
          Validators.maxLength(50),
        ]),
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.namePattern),
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
      ],
      day: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(NUMBERS_ONLY_PATTERN),
          Validators.maxLength(2),
          Validators.min(1),
          Validators.max(31),
        ]),
      ],
      month: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_ONLY_PATTERN),
        ]),
      ],
      year: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(NUMBERS_ONLY_PATTERN)
        ]),
      ],
      identityType: ["", Validators.required],
      ssn: [
        "",
        Validators.compose([
          Validators.pattern(NUMBERS_ONLY_PATTERN),
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
      ],
      tribalId: [
        "",
        Validators.compose([Validators.minLength(2), Validators.maxLength(20)]),
      ],
    });
  }

  ngOnInit(): void {
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 3) {
        this.qualifyingForm.markAllAsTouched();
        this.qualifyingForm.controls.option.value === 'child' ? this.validateChild = true : this.validateChild = false;
        if (!!this.validateChild) {
          this.childInfoForm.markAllAsTouched();
        }
        if ((!!this.qualifyingForm.valid && !!this.validateChild && !!this.childInfoForm.valid  && !this.showInvalidDateError) || (!!this.qualifyingForm.valid && !this.validateChild)) {
          if (!!this.validateChild) {
            this.prepareChildData();
          }
          this.setChildInfo.emit(this.childInfo);
          this.goToNext.emit(4);
        }
      }
    });
    if (!!this.bbqInfo && Object.keys(this.bbqInfo).length !== 0  && !!this.bbqInfo.firstName) {
      this.validateChild = true;
      this.qualifyingForm.controls.option.setValue('child');
      this.populateForm();
    } else if (!!this.bbqInfo && !this.bbqInfo.firstName) {
      this.qualifyingForm.controls.option.setValue('indivisual');
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.disable) {
      this.disable = changes.disable.currentValue;
      if (!!this.disable) {
        this.childInfoForm.disable();
      }
    }
  }
  public updateIdentitiyType(): void {
    const selectedValue = this.childInfoForm.controls.identityType.value;
    if (selectedValue === "ssn") {
      this.childInfoForm.controls.ssn.setValidators([
        Validators.compose([
          Validators.required,
          Validators.pattern(NUMBERS_ONLY_PATTERN),
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
      ]);
      this.childInfoForm.controls.ssn.updateValueAndValidity();
      this.childInfoForm.controls.tribalId.clearValidators();
      this.childInfoForm.controls.tribalId.updateValueAndValidity();
      this.childInfoForm.controls.tribalId.reset();
    }
    if (selectedValue === "tribal") {
      this.childInfoForm.controls.tribalId.setValidators([
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
      ]);
      this.childInfoForm.controls.tribalId.updateValueAndValidity();
      this.childInfoForm.controls.ssn.clearValidators();
      this.childInfoForm.controls.ssn.updateValueAndValidity();
      this.childInfoForm.controls.ssn.reset();
    }
  }
  public checkMonth(): void {
    if (
      this.childInfoForm.controls.month.value &&
      this.childInfoForm.controls.day.value &&
      this.childInfoForm.controls.month.value === '02' &&
      (this.childInfoForm.controls.day.value === '30' ||
        this.childInfoForm.controls.day.value === '31')
    ) {
      this.childInfoForm.controls.day.setValue('');
    } else if (
      this.childInfoForm.controls.month.value &&
      this.childInfoForm.controls.day.value &&
      (this.childInfoForm.controls.month.value === '02' ||
        this.childInfoForm.controls.month.value === '04' ||
        this.childInfoForm.controls.month.value === '06' ||
        this.childInfoForm.controls.month.value === '09' ||
        this.childInfoForm.controls.month.value === '11') &&
      this.childInfoForm.controls.day.value === '31'
    ) {
      this.childInfoForm.controls.day.setValue('');
    }
    let date = new Date();
    let todaysDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const year = this.childInfoForm.controls.year.value;
    this.leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) ? true : false;
    if (this.childInfoForm.controls.month.value && this.childInfoForm.controls.year.value && this.childInfoForm.controls.day.value) {
      let selectedDate = new Date(parseInt(this.childInfoForm.controls.year.value), parseInt(this.childInfoForm.controls.month.value) - 1, parseInt(this.childInfoForm.controls.day.value));
      if (selectedDate.getTime() > todaysDate.getTime()  || (!this.leapYear && this.childInfoForm.controls.day.value === '29' && this.childInfoForm.controls.month.value === '02' ) || ((this.childInfoForm.controls.day.value === '30' || this.childInfoForm.controls.day.value === '31')  && this.childInfoForm.controls.month.value === '02' )) {
        this.showInvalidDateError = true;
      } else {
        this.showInvalidDateError = false;
      }
    }
  }
  private getYearsValues(): void {
    const today = new Date();
    const currentYear = today.getFullYear();
    for (let i = (currentYear - 130); i <= currentYear; i++) {
      this.years.push(i);
    }
  }
  private prepareChildData(): void {
    this.childInfo = {} as IAcpUser;
    const dayFormat = this.childInfoForm?.controls.day.value;
    this.childInfo.firstName = this.childInfoForm?.controls.firstName.value;
    this.childInfo.middleName = !!this.childInfoForm?.controls.middleName.value
      ? this.childInfoForm?.controls.middleName.value
      : undefined;
    this.childInfo.lastName = this.childInfoForm?.controls.lastName.value;
    this.childInfo.identityVerification =
      this.childInfoForm?.controls.identityType.value;
    this.childInfo.last4ssn = !!this.childInfoForm?.controls.ssn.value
      ? this.childInfoForm?.controls.ssn.value
      : undefined;
    this.childInfo.tribalId = !!this.childInfoForm?.controls.tribalId.value
      ? this.childInfoForm?.controls.tribalId.value
      : undefined;
    this.childInfo.dob =
      this.childInfoForm?.controls.month.value +
      "/" +
      dayFormat +
      "/" +
      this.childInfoForm?.controls.year.value;
  }
  public populateForm(): void {
    this.childInfoForm.controls.firstName.setValue(this.bbqInfo.firstName);
    this.childInfoForm.controls.middleName.setValue(this.bbqInfo.middleName);
    this.childInfoForm.controls.lastName.setValue(this.bbqInfo.lastName);
    this.childInfoForm.controls.identityType.setValue(
      this.bbqInfo.identityVerification
    );
    this.childInfoForm.controls.ssn.setValue(this.bbqInfo.last4ssn);
    this.childInfoForm.controls.tribalId.setValue(this.bbqInfo.tribalId);
    this.childInfoForm.controls.day.setValue(this.bbqInfo.dob.split("/")[1]);
    this.childInfoForm.controls.month.setValue(this.bbqInfo.dob.split("/")[0]);
    this.childInfoForm.controls.year.setValue(this.bbqInfo.dob.split("/")[2]);
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
}
