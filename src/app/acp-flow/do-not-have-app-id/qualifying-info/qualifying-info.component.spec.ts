import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseUserProfileService } from '@ztarmobile/zwp-service-backend';
import { QualifyingInfoComponent } from './qualifying-info.component';
import { ACP_MOCKS } from 'src/mocks';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { AppState } from 'src/app/app.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EbbManager } from 'src/services/ebb.service';

let component: QualifyingInfoComponent;
let fixture: ComponentFixture<QualifyingInfoComponent>;

let qualifyingOptionInputField;
let fNameInputField;
let mNameInputField;
let lNameInputField;
let monthSelectField;
let daySelectField;
let yearSelectField;
let identityTypeInputField;
let ssnInputField;
let tribalInputField;

let userInfo = ACP_MOCKS.USER_INFO;

describe('Yes Flow- without app id - EBB qualifying Info Component - Unit Testing', async () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        QualifyingInfoComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        SimpleAuthService,
        { provide: AppState },
        { provide: EbbManager },
        { provide: FirebaseUserProfileService, useValue: AngularFireDatabase },
        { provide: AngularFireAuth }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    TestBed.compileComponents();

    fixture = TestBed.createComponent(QualifyingInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // QualifyingOptionInputField
    qualifyingOptionInputField = component.qualifyingForm.controls.option;

    // Child form         
    fNameInputField = component.childInfoForm.controls.firstName;
    mNameInputField = component.childInfoForm.controls.middleName;
    lNameInputField = component.childInfoForm.controls.lastName;
    monthSelectField = component.childInfoForm.controls.month;
    daySelectField = component.childInfoForm.controls.day;
    yearSelectField = component.childInfoForm.controls.year;
    identityTypeInputField = component.childInfoForm.controls.identityType;
    ssnInputField = component.childInfoForm.controls.ssn;
    tribalInputField = component.childInfoForm.controls.tribalId;
    fixture.detectChanges();
  });

  it('Should create a component successfully', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('Should test a form group element count at inital state and it should be 1 form', waitForAsync(() => {
    const forms = fixture.nativeElement.querySelectorAll('form');
    // Main form
    const mainFormElement = forms[0];
    const mainInputElements = mainFormElement.querySelectorAll('input');
    const mainSelectElements = mainFormElement.querySelectorAll('select');

    expect(forms.length).toEqual(1);
    expect(mainInputElements.length).toEqual(2);
    expect(mainSelectElements.length).toEqual(0);
  }));

  it('Should cover the initial state (qualyfying form options are not selected )', waitForAsync(() => {
    fixture.whenStable().then(() => {
      expect(qualifyingOptionInputField.pristine).toBeTruthy();
    });
  }));
  it('Should show validation messages for the required elements when the values are empty of the qualifying form', waitForAsync(() => {
    fixture.whenStable().then(() => {
      qualifyingOptionInputField.setValue('');

      // Mark the form as touched
      component.qualifyingForm.markAllAsTouched();
      fixture.detectChanges();

      const requiredQualifyingOptionMsg = fixture.debugElement.query(By.css('#qualifying-validation-message'));

      expect(qualifyingOptionInputField.errors.required).toBeTruthy();
      expect(requiredQualifyingOptionMsg.nativeElement).toBeDefined();
      expect(component.qualifyingForm.valid).toBeFalsy();
    });
  }));
  it('Should checks if the child form appears when qualifying option is selected', waitForAsync(() => {
    fixture.whenStable().then(() => {
      qualifyingOptionInputField.setValue('child');
      fixture.detectChanges();

      const childInfoForm = fixture.nativeElement.querySelector('#childForm');

      expect(childInfoForm).toBeDefined();
    });
  }));

  it('Should show validation messages for the required elements when the values are empty of the child form without showing any another error messages', waitForAsync(() => {
    fixture.whenStable().then(() => {
      qualifyingOptionInputField.setValue('child');
      fixture.detectChanges();

      component.childInfoForm.markAllAsTouched();
      fixture.detectChanges();

      const requiredFNameMsg = fixture.debugElement.query(By.css('#required-fname-msg'));
      const requiredLNameMsg = fixture.debugElement.query(By.css('#required-lname-msg'));
      const requiredDateMsg = fixture.debugElement.query(By.css('#required-date-msg'));
      const requiredIdTypeMsg = fixture.debugElement.query(By.css('#required-idType-msg'));

      expect(fNameInputField.errors.required).toBeTruthy();
      expect(requiredFNameMsg.nativeElement).toBeDefined();
      expect(fNameInputField.hasError('pattern')).toBeFalsy();

      expect(lNameInputField.errors.required).toBeTruthy();
      expect(requiredLNameMsg.nativeElement).toBeDefined();
      expect(lNameInputField.hasError('pattern')).toBeFalsy();

      expect(daySelectField.errors.required).toBeTruthy();
      expect(daySelectField.hasError('pattern')).toBeFalsy();

      expect(monthSelectField.errors.required).toBeTruthy();
      expect(monthSelectField.hasError('pattern')).toBeFalsy();

      expect(yearSelectField.errors.required).toBeTruthy();
      expect(yearSelectField.hasError('pattern')).toBeFalsy();

      expect(requiredDateMsg.nativeElement).toBeDefined();

      expect(identityTypeInputField.pristine).toBeTruthy();
      expect(requiredIdTypeMsg.nativeElement).toBeDefined();

      expect(component.childInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should show validation messages for the other required elements of the child form - [ ssn - tribal ]', waitForAsync(() => {
    fixture.whenStable().then(() => {
      qualifyingOptionInputField.setValue('child');
      fixture.detectChanges();

      // Set ssn as identity type
      identityTypeInputField.setValue('ssn');
      identityTypeInputField.markAsTouched();
      identityTypeInputField.markAsDirty();
      fixture.detectChanges();

      component.updateIdentitiyType();
      ssnInputField.markAsTouched();

      fixture.detectChanges();

      const requiredSsnMsg = fixture.debugElement.query(By.css('#required-ssn-msg'));

      expect(ssnInputField.errors.required).toBeTruthy();
      expect(requiredSsnMsg.nativeElement).toBeDefined();

      // Set tribal as identity type
      identityTypeInputField.setValue('tribal');
      identityTypeInputField.markAsTouched();
      identityTypeInputField.markAsDirty();
      fixture.detectChanges();
      component.updateIdentitiyType();
      tribalInputField.markAsTouched();

      fixture.detectChanges();

      const requiredTribalMsg = fixture.debugElement.query(By.css('#required-tribal-msg'));

      expect(tribalInputField.errors.required).toBeTruthy();
      expect(requiredTribalMsg.nativeElement).toBeDefined();

      expect(component.childInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should show validation messages when the values are invalid for the child form', waitForAsync(() => {
    fixture.whenStable().then(() => {
      qualifyingOptionInputField.setValue('child');
      fixture.detectChanges();

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

      daySelectField.setValue(ACP_MOCKS.VALID_DATA.day);
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

      identityTypeInputField.setValue('ssn');
      identityTypeInputField.markAsTouched();
      identityTypeInputField.markAsDirty();
      fixture.detectChanges();

      ssnInputField.setValue(ACP_MOCKS.INVALID_FULL_USER_INFO.ssn);
      ssnInputField.markAsTouched();
      ssnInputField.markAsDirty();
      fixture.detectChanges();

      const invalidFNameMsg = fixture.debugElement.query(By.css('#invalid-fname-msg'));
      const invalidMNameMsg = fixture.debugElement.query(By.css('#invalid-mname-msg'));
      const invalidLNameMsg = fixture.debugElement.query(By.css('#invalid-lname-msg'));
      const invalidDateMsg = fixture.debugElement.query(By.css('#invalid-date-msg'));
      const invalidSsnMsg = fixture.debugElement.query(By.css('#invalid-ssn-msg'));

      expect(fNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidFNameMsg.nativeElement).toBeDefined();
      expect(fNameInputField.errors.required).toBeFalsy();

      expect(mNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidMNameMsg.nativeElement).toBeDefined();

      expect(lNameInputField.hasError('pattern')).toBeTruthy();
      expect(invalidLNameMsg.nativeElement).toBeDefined();
      expect(fNameInputField.errors.required).toBeFalsy();

      expect(invalidDateMsg.nativeElement).toBeDefined();
      expect(ssnInputField.hasError('minlength')).toBeTruthy();
      expect(invalidSsnMsg.nativeElement).toBeDefined();

      daySelectField.setValue('0');
      daySelectField.markAsTouched();
      daySelectField.markAsDirty();
      fixture.detectChanges();

      expect(daySelectField.hasError('min')).toBeTruthy();
      expect(daySelectField.errors.required).toBeFalsy();

      expect(component.childInfoForm.valid).toBeFalsy();

      // Check tribal if its invalid 
      identityTypeInputField.setValue('tribal');
      identityTypeInputField.markAsTouched();
      identityTypeInputField.markAsDirty();
      fixture.detectChanges();

      tribalInputField.setValue('1');
      tribalInputField.markAsTouched();
      tribalInputField.markAsDirty();
      fixture.detectChanges();

      expect(tribalInputField.hasError('minlength')).toBeTruthy();
      expect(component.childInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should not show a validation messages, if we select a leap year (2000) and the day is 29 and pick a 2 as a month', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.bbqInfo = userInfo;

      qualifyingOptionInputField.setValue('child');
      fixture.detectChanges();

      component.populateForm();
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

      component.childInfoForm.markAllAsTouched();
      fixture.detectChanges();
      expect(component.showInvalidDateError).toBeFalsy();
      expect(component.childInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should make sure that 29, 30, 31 are disabled if the month is "02" with non leap year', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // Added this to make all values are correct, and if we changed dob the form will be not valid
      component.bbqInfo = userInfo;

      qualifyingOptionInputField.setValue('child');
      fixture.detectChanges();

      component.populateForm();
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

  it('Should not show validation messages when the values are valid for the whole forms', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // Qualifying form
      qualifyingOptionInputField.setValue('child');
      fixture.detectChanges();

      // Child form
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


      identityTypeInputField.setValue('ssn');
      identityTypeInputField.markAsTouched();
      identityTypeInputField.markAsDirty();
      fixture.detectChanges();

      ssnInputField.setValue(ACP_MOCKS.VALID_DATA.ssn);
      ssnInputField.markAsTouched();
      fixture.detectChanges();

      expect(fNameInputField.hasError('pattern')).toBeFalsy();
      expect(mNameInputField.hasError('pattern')).toBeFalsy();
      expect(lNameInputField.hasError('pattern')).toBeFalsy();
      expect(daySelectField.hasError('max')).toBeFalsy();
      expect(yearSelectField.hasError('max')).toBeFalsy();
      expect(ssnInputField.hasError('minlength')).toBeFalsy();

      expect(component.qualifyingForm.errors).toBeNull();
      expect(component.childInfoForm.errors).toBeNull();
    });
  }));
});
