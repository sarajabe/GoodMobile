import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonalInfoNonExisitngAppComponent } from './personal-info.component';
import { ACP_MOCKS } from 'src/mocks';
import { ActionsAnalyticsService } from '@ztarmobile/zwp-service-backend';
import { InjectionToken } from '@angular/core';
import { IGoogleTagManagerEventsConfig } from '@ztarmobile/zwp-service';

let component: PersonalInfoNonExisitngAppComponent;
let fixture: ComponentFixture<PersonalInfoNonExisitngAppComponent>;

let fNameInputField;
let mNameInputField;
let lNameInputField;
let monthSelectField;
let daySelectField;
let yearSelectField;
let ssnInputField;
let tribalInputField;
let emailInputField;
let govOption;

let savedUserInfo = ACP_MOCKS.SAVED_INFO;

describe('Yes Flow - EBB Personal Information Component - Unit Testing', async () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PersonalInfoNonExisitngAppComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActionsAnalyticsService, useValue: new InjectionToken<IGoogleTagManagerEventsConfig>('GoogleTagManagerEvents') }
      ]
    });

    TestBed.compileComponents();

    fixture = TestBed.createComponent(PersonalInfoNonExisitngAppComponent);
    component = fixture.componentInstance;

    fNameInputField = component.personalInfoForm.controls.firstName;
    mNameInputField = component.personalInfoForm.controls.middleName;
    lNameInputField = component.personalInfoForm.controls.lastName;
    monthSelectField = component.personalInfoForm.controls.month;
    daySelectField = component.personalInfoForm.controls.day;
    yearSelectField = component.personalInfoForm.controls.year;
    emailInputField = component.personalInfoForm.controls.email;
    ssnInputField = component.personalInfoForm.controls.ssn;
    tribalInputField = component.personalInfoForm.controls.tribalId;
    govOption = component.personalInfoForm.controls.option;

    fixture.detectChanges();
  });

  it('Should create compoenet successfully', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('Should test a form group element count', waitForAsync(() => {
    const formElement = fixture.nativeElement.querySelector('form');
    const inputElements = formElement.querySelectorAll('input');
    const selectElements = formElement.querySelectorAll('select');

    expect(inputElements.length).toEqual(6);
    expect(selectElements.length).toEqual(3);
  }));

  it('Should show a validation messages for the required elements when the values are empty without showing the invalid messages', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // Setting empty values
      fNameInputField.setValue('');
      mNameInputField.setValue('');
      lNameInputField.setValue('');
      daySelectField.setValue('');
      monthSelectField.setValue('');
      yearSelectField.setValue('');
      emailInputField.setValue('');

      // Mark the form as touched
      component.personalInfoForm.markAllAsTouched();
      fixture.detectChanges();

      const requiredFNameMsg = fixture.debugElement.query(By.css('#required-fname-msg'));
      const requiredLNameMsg = fixture.debugElement.query(By.css('#required-lname-msg'));
      const requiredDateMsg = fixture.debugElement.query(By.css('#required-date-msg'));
      const requiredIdTypeMsg = fixture.debugElement.query(By.css('#required-idType-msg'));
      const requiredEmailMsg = fixture.debugElement.query(By.css('#required-email-msg'));

      expect(fNameInputField.errors.required).toBeTruthy();
      expect(fNameInputField.errors.pattern).toBeFalsy();
      expect(requiredFNameMsg.nativeElement).toBeDefined();

      expect(lNameInputField.errors.required).toBeTruthy();
      expect(lNameInputField.errors.pattern).toBeFalsy();
      expect(requiredLNameMsg.nativeElement).toBeDefined();

      expect(daySelectField.errors.required).toBeTruthy();
      expect(monthSelectField.errors.required).toBeTruthy();
      expect(yearSelectField.errors.required).toBeTruthy();
      expect(daySelectField.errors.pattern).toBeFalsy();
      expect(monthSelectField.errors.pattern).toBeFalsy();
      expect(yearSelectField.errors.pattern).toBeFalsy();
      expect(requiredDateMsg.nativeElement).toBeDefined();

      expect(govOption.errors.required).toBeTruthy();
      expect(requiredIdTypeMsg.nativeElement).toBeDefined();

      expect(emailInputField.errors.required).toBeTruthy();
      expect(emailInputField.errors.pattern).toBeFalsy();
      expect(requiredEmailMsg.nativeElement).toBeDefined();

      expect(component.personalInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should show a validation messages for the required elements when the values are empty, then enter an invalid values to check that invalid messages appears, after that entering a valid values and check that all errors are null', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // First check is required 

      // Setting empty values
      fNameInputField.setValue('');
      mNameInputField.setValue('');
      lNameInputField.setValue('');
      daySelectField.setValue('');
      monthSelectField.setValue('');
      yearSelectField.setValue('');
      emailInputField.setValue('');

      // Mark the form as touched
      component.personalInfoForm.markAllAsTouched();
      fixture.detectChanges();

      const requiredFNameMsg = fixture.debugElement.query(By.css('#required-fname-msg'));
      const requiredLNameMsg = fixture.debugElement.query(By.css('#required-lname-msg'));
      const requiredDateMsg = fixture.debugElement.query(By.css('#required-date-msg'));
      const requiredIdTypeMsg = fixture.debugElement.query(By.css('#required-idType-msg'));
      const requiredEmailMsg = fixture.debugElement.query(By.css('#required-email-msg'));

      expect(fNameInputField.errors.required).toBeTruthy();
      expect(fNameInputField.hasError('pattern')).toBeFalsy();
      expect(requiredFNameMsg.nativeElement).toBeDefined();

      expect(lNameInputField.errors.required).toBeTruthy();
      expect(lNameInputField.hasError('pattern')).toBeFalsy();
      expect(requiredLNameMsg.nativeElement).toBeDefined();

      expect(daySelectField.errors.required).toBeTruthy();
      expect(monthSelectField.errors.required).toBeTruthy();
      expect(yearSelectField.errors.required).toBeTruthy();
      expect(daySelectField.hasError('pattern')).toBeFalsy();
      expect(monthSelectField.hasError('pattern')).toBeFalsy();
      expect(yearSelectField.hasError('pattern')).toBeFalsy();
      expect(requiredDateMsg.nativeElement).toBeDefined();

      expect(govOption.errors.required).toBeTruthy();
      expect(requiredIdTypeMsg.nativeElement).toBeDefined();

      expect(emailInputField.errors.required).toBeTruthy();
      expect(emailInputField.hasError('pattern')).toBeFalsy();
      expect(requiredEmailMsg.nativeElement).toBeDefined();

      expect(component.personalInfoForm.valid).toBeFalsy();

      // Second check is invalid cases to see the invalid messages

      fNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.firstName);
      fNameInputField.markAsTouched();
      fNameInputField.markAsDirty();
      fixture.detectChanges();

      mNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.middleName);
      mNameInputField.markAsTouched();
      mNameInputField.markAsDirty();
      fixture.detectChanges();

      lNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.lastName);
      lNameInputField.markAsTouched();
      lNameInputField.markAsDirty();
      fixture.detectChanges();

      daySelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.day);
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      monthSelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.month);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.year);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();
      component.checkMonth();
      fixture.detectChanges();

      govOption.setValue('ssn');
      govOption.markAsTouched();
      govOption.markAsDirty();
      fixture.detectChanges();

      component.checkIdentityType();
      fixture.detectChanges();

      ssnInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.ssn);
      ssnInputField.markAsTouched();
      ssnInputField.markAsDirty();
      fixture.detectChanges();

      emailInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.consumerEmail);
      emailInputField.markAsTouched();
      emailInputField.markAsDirty();
      fixture.detectChanges();

      const invalidFNameMsg = fixture.debugElement.query(By.css('#invalid-fname-msg'));
      const invalidMNameMsg = fixture.debugElement.query(By.css('#invalid-mname-msg'));
      const invalidLNameMsg = fixture.debugElement.query(By.css('#invalid-lname-msg'));
      const invalidDateMsg = fixture.debugElement.query(By.css('#invalid-date-msg'));

      const invalidSsnMsg = fixture.debugElement.query(By.css('#invalid-ssn-msg'));

      const invalidEmailMsg = fixture.debugElement.query(By.css('#invalid-email-msg'));

      expect(fNameInputField.hasError('pattern')).toBeTruthy();
      expect(fNameInputField.errors.required).toBeFalsy();
      expect(invalidFNameMsg.nativeElement).toBeDefined();

      expect(mNameInputField.hasError('pattern')).toBeTruthy();
      expect(mNameInputField.errors.required).toBeFalsy();
      expect(invalidMNameMsg.nativeElement).toBeDefined();

      expect(lNameInputField.hasError('pattern')).toBeTruthy();
      expect(lNameInputField.errors.required).toBeFalsy();
      expect(invalidLNameMsg.nativeElement).toBeDefined();

      expect(invalidDateMsg.nativeElement).toBeDefined();

      expect(ssnInputField.hasError('minlength')).toBeTruthy();
      expect(ssnInputField.errors.required).toBeFalsy();
      expect(invalidSsnMsg.nativeElement).toBeDefined();

      expect(emailInputField.hasError('pattern')).toBeTruthy();
      expect(emailInputField.errors.required).toBeFalsy();
      expect(invalidEmailMsg.nativeElement).toBeDefined();

      expect(component.personalInfoForm.valid).toBeFalsy();

      // Set a valid values and make sure that no error messages are appear

      fNameInputField.setValue(ACP_MOCKS.FULL_USER_INFO.firstName);
      fNameInputField.markAsTouched();
      fNameInputField.markAsDirty();
      fixture.detectChanges();

      mNameInputField.setValue(ACP_MOCKS.FULL_USER_INFO.middleName);
      mNameInputField.markAsTouched();
      mNameInputField.markAsDirty();
      fixture.detectChanges();

      lNameInputField.setValue(ACP_MOCKS.FULL_USER_INFO.lastName);
      lNameInputField.markAsTouched();
      lNameInputField.markAsDirty();
      fixture.detectChanges();

      daySelectField.setValue(ACP_MOCKS.VALID_DATA.day);
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      monthSelectField.setValue(ACP_MOCKS.VALID_DATA.month);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.VALID_DATA.year);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();
      component.checkMonth();
      fixture.detectChanges();

      govOption.setValue('ssn');
      govOption.markAsTouched();
      govOption.markAsDirty();
      fixture.detectChanges();
      component.checkIdentityType();
      fixture.detectChanges();

      ssnInputField.setValue(ACP_MOCKS.FULL_USER_INFO.last4ssn);
      ssnInputField.markAsTouched();
      ssnInputField.markAsDirty();
      fixture.detectChanges();

      emailInputField.setValue(ACP_MOCKS.FULL_USER_INFO.consumerEmail);
      emailInputField.markAsTouched();
      emailInputField.markAsDirty();
      fixture.detectChanges();

      expect(fNameInputField.errors).toBeFalsy();
      expect(mNameInputField.errors).toBeFalsy();
      expect(lNameInputField.errors).toBeFalsy();

      expect(ssnInputField.errors).toBeFalsy();

      expect(emailInputField.errors).toBeFalsy();

      expect(component.personalInfoForm.valid).toBeTruthy();
    });
  }));

  it('Should show validation messages for the other required elements - [ ssn - tribalId ]', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // Set gov option as ssn
      govOption.setValue('ssn');
      govOption.markAsTouched();
      govOption.markAsDirty();
      fixture.detectChanges();
      component.checkIdentityType();

      ssnInputField.setValue('');
      ssnInputField.markAsTouched();

      fixture.detectChanges();

      const requiredSsnMsg = fixture.debugElement.query(By.css('#required-ssn-msg'));

      expect(ssnInputField.errors.required).toBeTruthy();
      expect(requiredSsnMsg.nativeElement).toBeDefined();

      // Set gov option as tribal
      govOption.setValue('tribal');
      govOption.markAsTouched();
      govOption.markAsDirty();
      fixture.detectChanges();

      component.checkIdentityType();

      tribalInputField.setValue('');
      tribalInputField.markAsTouched();

      fixture.detectChanges();

      const requiredTribalMsg = fixture.debugElement.query(By.css('#required-tribal-msg'));

      expect(tribalInputField.errors.required).toBeTruthy();
      expect(requiredTribalMsg.nativeElement).toBeDefined();

      expect(component.personalInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should show validation messages when the values are invalid and gov option is ssn', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.firstName);
      fNameInputField.markAsTouched();
      fNameInputField.markAsDirty();
      fixture.detectChanges();

      mNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.middleName);
      mNameInputField.markAsTouched();
      mNameInputField.markAsDirty();
      fixture.detectChanges();

      lNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.lastName);
      lNameInputField.markAsTouched();
      lNameInputField.markAsDirty();
      fixture.detectChanges();

      daySelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.day);
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      monthSelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.month);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.year);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();
      component.checkMonth();
      fixture.detectChanges();

      govOption.setValue('ssn');
      govOption.markAsTouched();
      govOption.markAsDirty();
      fixture.detectChanges();
      component.checkIdentityType();
      fixture.detectChanges();

      ssnInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.ssn);
      ssnInputField.markAsTouched();
      ssnInputField.markAsDirty();
      fixture.detectChanges();

      emailInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.consumerEmail);
      emailInputField.markAsTouched();
      emailInputField.markAsDirty();
      fixture.detectChanges();

      const invalidFNameMsg = fixture.debugElement.query(By.css('#invalid-fname-msg'));
      const invalidMNameMsg = fixture.debugElement.query(By.css('#invalid-mname-msg'));
      const invalidLNameMsg = fixture.debugElement.query(By.css('#invalid-lname-msg'));
      const invalidDateMsg = fixture.debugElement.query(By.css('#invalid-date-msg'));

      const invalidSsnMsg = fixture.debugElement.query(By.css('#invalid-ssn-msg'));

      const invalidEmailMsg = fixture.debugElement.query(By.css('#invalid-email-msg'));

      expect(fNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidFNameMsg.nativeElement).toBeDefined();

      expect(mNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidMNameMsg.nativeElement).toBeDefined();

      expect(lNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidLNameMsg.nativeElement).toBeDefined();

      expect(invalidDateMsg.nativeElement).toBeDefined();

      expect(ssnInputField.hasError('minlength')).toBeTruthy();
      expect(invalidSsnMsg.nativeElement).toBeDefined();

      expect(emailInputField.hasError('pattern')).toBeTruthy();
      expect(invalidEmailMsg.nativeElement).toBeDefined();

      expect(component.personalInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should show validation messages when the values are invalid and gov option is tribal', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.firstName);
      fNameInputField.markAsTouched();
      fNameInputField.markAsDirty();
      fixture.detectChanges();

      mNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.middleName);
      mNameInputField.markAsTouched();
      mNameInputField.markAsDirty();
      fixture.detectChanges();

      lNameInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.lastName);
      lNameInputField.markAsTouched();
      lNameInputField.markAsDirty();
      fixture.detectChanges();

      daySelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.day);
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      monthSelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.month);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.year);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();
      component.checkMonth();
      fixture.detectChanges();

      govOption.setValue('tribal');
      govOption.markAsTouched();
      govOption.markAsDirty();
      fixture.detectChanges();
      component.checkIdentityType();
      fixture.detectChanges();

      tribalInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.tribal);
      tribalInputField.markAsTouched();
      tribalInputField.markAsDirty();
      fixture.detectChanges();

      emailInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.consumerEmail);
      emailInputField.markAsTouched();
      emailInputField.markAsDirty();
      fixture.detectChanges();

      const invalidFNameMsg = fixture.debugElement.query(By.css('#invalid-fname-msg'));
      const invalidMNameMsg = fixture.debugElement.query(By.css('#invalid-mname-msg'));
      const invalidLNameMsg = fixture.debugElement.query(By.css('#invalid-lname-msg'));
      const invalidDateMsg = fixture.debugElement.query(By.css('#invalid-date-msg'));

      const invalidTribalMsg = fixture.debugElement.query(By.css('#invalid-tribal-msg'));

      const invalidEmailMsg = fixture.debugElement.query(By.css('#invalid-email-msg'));

      expect(fNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidFNameMsg.nativeElement).toBeDefined();

      expect(mNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidMNameMsg.nativeElement).toBeDefined();

      expect(lNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidLNameMsg.nativeElement).toBeDefined();

      expect(invalidDateMsg.nativeElement).toBeDefined();

      expect(tribalInputField.hasError('maxlength')).toBeTruthy();
      expect(invalidTribalMsg.nativeElement).toBeDefined();

      expect(emailInputField.hasError('pattern')).toBeTruthy();
      expect(invalidEmailMsg.nativeElement).toBeDefined();

      expect(component.personalInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should show a validation messages for the date is required, if we select the day as 30 or 31 and pick a 2 as a month as in check month function we set the day empty if there is an invalid date', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.savedInfo = component.savedInfo = ACP_MOCKS.SAVED_INFO;
      fixture.detectChanges();

      const selectDay = fixture.debugElement.query(By.css('#day')).nativeElement.options[30].value;
      daySelectField.setValue(selectDay);
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      const selectMonth = fixture.debugElement.query(By.css('#month')).nativeElement.options[1].value;

      monthSelectField.setValue(selectMonth);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.VALID_DATA.year);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();

      component.checkMonth();
      fixture.detectChanges();

      component.personalInfoForm.markAllAsTouched();
      fixture.detectChanges();

      const requiredDateMsg = fixture.debugElement.query(By.css('#required-date-msg'));

      expect(requiredDateMsg.nativeElement).toBeDefined();
      expect(component.showInvalidDateError).toBeFalsy();
      expect(component.personalInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should show a validation messages for the invalid date, if we select none leap year (1997) and the day is 29 and pick a 2 as a month', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.savedInfo = ACP_MOCKS.SAVED_INFO;
      fixture.detectChanges();

      const selectDay = fixture.debugElement.query(By.css('#day')).nativeElement.options[28].value;
      daySelectField.setValue(selectDay);
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      const selectMonth = fixture.debugElement.query(By.css('#month')).nativeElement.options[1].value;

      monthSelectField.setValue(selectMonth);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.VALID_DATA.year);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();

      component.checkMonth();
      fixture.detectChanges();

      component.personalInfoForm.markAllAsTouched();
      fixture.detectChanges();

      expect(component.showInvalidDateError).toBeTruthy();
      expect(component.personalInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should not show a validation messages, if we select a leap year (2000) and the day is 29 and pick a 2 as a month', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.savedInfo = component.savedInfo = ACP_MOCKS.SAVED_INFO;
      fixture.detectChanges();

      const selectDay = fixture.debugElement.query(By.css('#day')).nativeElement.options[28].value;
      daySelectField.setValue(selectDay);
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      const selectMonth = fixture.debugElement.query(By.css('#month')).nativeElement.options[1].value;

      monthSelectField.setValue(selectMonth);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.VALID_DATA.leapYear);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();

      component.checkMonth();
      fixture.detectChanges();

      component.personalInfoForm.markAllAsTouched();
      fixture.detectChanges();

      expect(component.showInvalidDateError).toBeFalsy();
      expect(component.personalInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should not show validation messages when values are valid', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fNameInputField.setValue(ACP_MOCKS.FULL_USER_INFO.firstName);
      fNameInputField.markAsTouched();
      fNameInputField.markAsDirty();
      fixture.detectChanges();

      mNameInputField.setValue(ACP_MOCKS.FULL_USER_INFO.middleName);
      mNameInputField.markAsTouched();
      mNameInputField.markAsDirty();
      fixture.detectChanges();

      lNameInputField.setValue(ACP_MOCKS.FULL_USER_INFO.lastName);
      lNameInputField.markAsTouched();
      lNameInputField.markAsDirty();
      fixture.detectChanges();

      const selectMonth = fixture.debugElement.query(By.css('#month')).nativeElement.options[2].value;

      monthSelectField.setValue(selectMonth);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      const selectDay = fixture.debugElement.query(By.css('#day')).nativeElement.options[3].value;
      daySelectField.setValue(selectDay);
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.VALID_DATA.year);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();

      fixture.detectChanges();

      govOption.setValue('ssn');
      govOption.markAsTouched();
      govOption.markAsDirty();
      fixture.detectChanges();

      ssnInputField.setValue(ACP_MOCKS.VALID_DATA.ssn);
      ssnInputField.markAsTouched();
      ssnInputField.markAsDirty();
      fixture.detectChanges();


      emailInputField.setValue(ACP_MOCKS.FULL_USER_INFO.consumerEmail);
      emailInputField.markAsTouched();
      emailInputField.markAsDirty();
      fixture.detectChanges();

      spyOn(component.goToNext, 'emit').and.callThrough();
      component.goToNext.emit();

      expect(fNameInputField.hasError('pattern')).toBeFalsy();
      expect(mNameInputField.hasError('pattern')).toBeFalsy();
      expect(lNameInputField.hasError('pattern')).toBeFalsy();
      expect(ssnInputField.hasError('minlength')).toBeFalsy();

      expect(emailInputField.hasError('email')).toBeFalsy();

      expect(component.personalInfoForm.errors).toBeNull();

      expect(component.goToNext.emit).toHaveBeenCalled();
    });
  }));

  it('Should make sure that 29, 30, 31 are disabled if the month is "02" with non leap year', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.savedInfo = component.savedInfo = ACP_MOCKS.SAVED_INFO;
      fixture.detectChanges();

      const selectMonth = fixture.debugElement.query(By.css('#month')).nativeElement.options[1].value;

      monthSelectField.setValue(selectMonth);
      monthSelectField.markAsTouched();
      monthSelectField.markAsDirty();
      fixture.detectChanges();

      yearSelectField.setValue(ACP_MOCKS.VALID_DATA.year);
      yearSelectField.markAsTouched();
      yearSelectField.markAsDirty();
      fixture.detectChanges();

      const selectDay_29 = fixture.debugElement.query(By.css('#day')).nativeElement.options[28].disabled;
      const selectDay_30 = fixture.debugElement.query(By.css('#day')).nativeElement.options[29].disabled;
      const selectDay_31 = fixture.debugElement.query(By.css('#day')).nativeElement.options[30].disabled;

      fixture.detectChanges();

      expect(selectDay_29).toBeTruthy();
      expect(selectDay_30).toBeTruthy();
      expect(selectDay_31).toBeTruthy();
    });
  }));

  it('Should check that the year min value is current year -130 and the max year value is current year', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.savedInfo = component.savedInfo = ACP_MOCKS.SAVED_INFO;
      fixture.detectChanges();

      const selectMinYear = fixture.debugElement.query(By.css('#year')).nativeElement.options[0].value;
      const selectMaxYear = fixture.debugElement.query(By.css('#year')).nativeElement.options[component.years.length - 1].value;
      fixture.detectChanges();
      const minYear = new Date().getFullYear() - 130;
      const maxYear = new Date().getFullYear();
      expect(selectMinYear).toEqual(minYear.toString());
      expect(selectMaxYear).toEqual(maxYear.toString());
    });
  }));

  it('Should populate the form when there is saved info already', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.savedInfo = component.savedInfo = ACP_MOCKS.SAVED_INFO;
      component.populateForm();
      fixture.detectChanges();

      component.personalInfoForm.markAllAsTouched();
      fixture.detectChanges();

      spyOn(component.goToNext, 'emit').and.callThrough();
      component.goToNext.emit();

      expect(component.personalInfoForm.errors).toBeNull();
      expect(fNameInputField.value).toEqual(savedUserInfo.firstName);
      expect(mNameInputField.value).toEqual(undefined);
      expect(lNameInputField.value).toEqual(savedUserInfo.lastName);
      expect(daySelectField.value).toEqual(savedUserInfo?.dob?.split('/')[1]);
      expect(monthSelectField.value).toEqual(savedUserInfo?.dob?.split('/')[0]);
      expect(yearSelectField.value).toEqual(savedUserInfo?.dob?.split('/')[2]);
      expect(ssnInputField.value).toEqual(savedUserInfo?.last4ssn);
      expect(emailInputField.value).toEqual(savedUserInfo?.consumerEmail);
      expect(component.goToNext.emit).toHaveBeenCalled();

    });
  }));
});
