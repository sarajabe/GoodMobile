import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonalInfoComponent } from './personal-info.component';
import { ACP_MOCKS } from 'src/mocks';
import { ActionsAnalyticsService } from '@ztarmobile/zwp-service-backend';
import { InjectionToken } from '@angular/core';
import { IGoogleTagManagerEventsConfig } from '@ztarmobile/zwp-service';

let component: PersonalInfoComponent;
let fixture: ComponentFixture<PersonalInfoComponent>;

let fNameInputField;
let mNameInputField;
let lNameInputField;
let monthSelectField;
let daySelectField;
let yearSelectField;
let ssnInputField;
let tribalInputField;
let phoneNumInputField;
let emailInputField;
let govOption;

let savedInfo = ACP_MOCKS.SAVED_INFO;

fdescribe('No Flow - EBB Personal Information Component - Unit Testing', async () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                PersonalInfoComponent
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

        fixture = TestBed.createComponent(PersonalInfoComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');

        fNameInputField = component.personalInfoForm.controls.firstName;
        mNameInputField = component.personalInfoForm.controls.middleName;
        lNameInputField = component.personalInfoForm.controls.lastName;
        monthSelectField = component.personalInfoForm.controls.month;
        daySelectField = component.personalInfoForm.controls.day;
        yearSelectField = component.personalInfoForm.controls.year;
        phoneNumInputField = component.personalInfoForm.controls.phoneNumber;
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

        expect(inputElements.length).toEqual(9);
        expect(selectElements.length).toEqual(3);
    }));

    it('Should show a validation messages for the required elements when the values are empty', waitForAsync(() => {
        fixture.whenStable().then(() => {
            // setting empty values
            fNameInputField.setValue('');
            mNameInputField.setValue('');
            lNameInputField.setValue('');
            daySelectField.setValue('');
            monthSelectField.setValue('');
            yearSelectField.setValue('');
            emailInputField.setValue('');

            // mark the form as touched
            component.personalInfoForm.markAllAsTouched();
            fixture.detectChanges();

            const requiredFNameMsg = fixture.debugElement.query(By.css('#required-fname-msg'));
            const requiredLNameMsg = fixture.debugElement.query(By.css('#required-lname-msg'));
            const requiredDateMsg = fixture.debugElement.query(By.css('#required-date-msg'));
            const requiredIdTypeMsg = fixture.debugElement.query(By.css('#required-idType-msg'));
            const requiredEmailMsg = fixture.debugElement.query(By.css('#required-email-msg'));

            expect(fNameInputField.errors.required).toBeTruthy();
            expect(requiredFNameMsg.nativeElement).toBeDefined();

            expect(lNameInputField.errors.required).toBeTruthy();
            expect(requiredLNameMsg.nativeElement).toBeDefined();

            expect(daySelectField.errors.required).toBeTruthy();
            expect(monthSelectField.errors.required).toBeTruthy();
            expect(yearSelectField.errors.required).toBeTruthy();
            expect(requiredDateMsg.nativeElement).toBeDefined();

            expect(govOption.errors.required).toBeTruthy();
            expect(requiredIdTypeMsg.nativeElement).toBeDefined();

            expect(emailInputField.errors.required).toBeTruthy();
            expect(requiredEmailMsg.nativeElement).toBeDefined();

            expect(component.personalInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages for the other required elements - [ ssn - tripalId - checkboxes for email and phones ]', waitForAsync(() => {
        fixture.whenStable().then(() => {
            // set gov option as ssn
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

            // set gov option as tribal
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

            // set phone number value
            phoneNumInputField.setValue('0123456789');
            phoneNumInputField.markAsTouched();
            phoneNumInputField.markAsDirty();
            fixture.detectChanges();

            // set email value
            emailInputField.setValue('william.bawwab@pavocom.com');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            const receiveEmailCheckbox = fixture.debugElement.query(By.css('#getEmails'));
            receiveEmailCheckbox.nativeElement.click();

            expect(emailInputField.errors).toBeNull();
            expect(receiveEmailCheckbox.nativeElement.checked).toBeTruthy();
            expect(component.personalInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should check that email and phone number is required when the checkbox for them is selected', waitForAsync(() => {
        fixture.whenStable().then(() => {
            // set phone number value
            phoneNumInputField.setValue('');
            phoneNumInputField.markAsTouched();
            phoneNumInputField.markAsDirty();
            fixture.detectChanges();

            // set email value
            emailInputField.setValue('');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            const receiveEmailCheckbox = fixture.debugElement.query(By.css('#getEmails'));
            receiveEmailCheckbox.nativeElement.click();

            const receivePhoneNumCheckbox = fixture.debugElement.query(By.css('#getPhones'));
            receivePhoneNumCheckbox.nativeElement.click();

            expect(emailInputField.errors).toEqual({ required: true });
            expect(receiveEmailCheckbox.nativeElement.checked).toBeTruthy();

            expect(phoneNumInputField.errors).toEqual({ required: true });
            expect(receivePhoneNumCheckbox.nativeElement.checked).toBeTruthy();

            expect(component.personalInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages when the values are invalid and gov option is ssn ', waitForAsync(() => {
        fixture.whenStable().then(() => {
            fNameInputField.setValue('33');
            fNameInputField.markAsTouched();
            fNameInputField.markAsDirty();
            fixture.detectChanges();

            mNameInputField.setValue('33');
            mNameInputField.markAsTouched();
            mNameInputField.markAsDirty();
            fixture.detectChanges();

            lNameInputField.setValue('33');
            lNameInputField.markAsTouched();
            lNameInputField.markAsDirty();
            fixture.detectChanges();

            daySelectField.setValue('12');
            daySelectField.markAsTouched();
            daySelectField.markAsDirty();
            fixture.detectChanges();

            monthSelectField.setValue('13');
            monthSelectField.markAsTouched();
            monthSelectField.markAsDirty();
            fixture.detectChanges();

            yearSelectField.setValue('2024');
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

            ssnInputField.setValue('44');
            ssnInputField.markAsTouched();
            ssnInputField.markAsDirty();
            fixture.detectChanges();

            phoneNumInputField.setValue('123');
            phoneNumInputField.markAsTouched();
            phoneNumInputField.markAsDirty();
            fixture.detectChanges();

            emailInputField.setValue('abc');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            const invalidFNameMsg = fixture.debugElement.query(By.css('#invalid-fname-msg'));
            const invalidMNameMsg = fixture.debugElement.query(By.css('#invalid-mname-msg'));
            const invalidLNameMsg = fixture.debugElement.query(By.css('#invalid-lname-msg'));
            const invalidDateMsg = fixture.debugElement.query(By.css('#invalid-date-msg'));

            const invalidSsnMsg = fixture.debugElement.query(By.css('#invalid-ssn-msg'));

            const invalidPhoneMsg = fixture.debugElement.query(By.css('#invalid-phone-msg'));
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

            expect(phoneNumInputField.hasError('minlength')).toBeTruthy();
            expect(invalidPhoneMsg.nativeElement).toBeDefined();

            expect(emailInputField.hasError('pattern')).toBeTruthy();
            expect(invalidEmailMsg.nativeElement).toBeDefined();

            expect(component.personalInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages when the values are invalid and gov option is tribal', waitForAsync(() => {
        fixture.whenStable().then(() => {
            fNameInputField.setValue('33');
            fNameInputField.markAsTouched();
            fNameInputField.markAsDirty();
            fixture.detectChanges();

            mNameInputField.setValue('33');
            mNameInputField.markAsTouched();
            mNameInputField.markAsDirty();
            fixture.detectChanges();

            lNameInputField.setValue('33');
            lNameInputField.markAsTouched();
            lNameInputField.markAsDirty();
            fixture.detectChanges();

            daySelectField.setValue('12');
            daySelectField.markAsTouched();
            daySelectField.markAsDirty();
            fixture.detectChanges();

            monthSelectField.setValue('13');
            monthSelectField.markAsTouched();
            monthSelectField.markAsDirty();
            fixture.detectChanges();

            yearSelectField.setValue('2024');
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

            tribalInputField.setValue('4493837973986911123jkbsjssss');
            tribalInputField.markAsTouched();
            tribalInputField.markAsDirty();
            fixture.detectChanges();

            phoneNumInputField.setValue('123');
            phoneNumInputField.markAsTouched();
            phoneNumInputField.markAsDirty();
            fixture.detectChanges();

            emailInputField.setValue('abc');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            const invalidFNameMsg = fixture.debugElement.query(By.css('#invalid-fname-msg'));
            const invalidMNameMsg = fixture.debugElement.query(By.css('#invalid-mname-msg'));
            const invalidLNameMsg = fixture.debugElement.query(By.css('#invalid-lname-msg'));
            const invalidDateMsg = fixture.debugElement.query(By.css('#invalid-date-msg'));

            const invalidTribalMsg = fixture.debugElement.query(By.css('#invalid-tribal-msg'));

            const invalidPhoneMsg = fixture.debugElement.query(By.css('#invalid-phone-msg'));
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

            expect(phoneNumInputField.hasError('minlength')).toBeTruthy();
            expect(invalidPhoneMsg.nativeElement).toBeDefined();

            expect(emailInputField.hasError('pattern')).toBeTruthy();
            expect(invalidEmailMsg.nativeElement).toBeDefined();

            expect(component.personalInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should show a validation messages for the invalid date , if we select the day as 30 or 31 and pick a 2 as a month ', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.savedInfo = ACP_MOCKS.SAVED_INFO;
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

            yearSelectField.setValue('2021');
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

    it('Should show a validation messages for the invalid date , if we select none leap year (1997) and the day is 29 and pick a 2 as a month', waitForAsync(() => {
        fixture.whenStable().then(() => {
            // added this to make all values are correct , and if we changed dob the form will be not valid
            component.savedInfo = savedInfo;
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

            yearSelectField.setValue('1997');
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

    it('Should not show a validation messages , if we select a leap year (2000) and the day is 29 and pick a 2 as a month', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.savedInfo = savedInfo;
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

            yearSelectField.setValue('2000');
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
            fNameInputField.setValue('william');
            fNameInputField.markAsTouched();
            fNameInputField.markAsDirty();
            fixture.detectChanges();

            mNameInputField.setValue('ghaleb');
            mNameInputField.markAsTouched();
            mNameInputField.markAsDirty();
            fixture.detectChanges();

            lNameInputField.setValue('bawwab');
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

            yearSelectField.setValue('1997');
            yearSelectField.markAsTouched();
            yearSelectField.markAsDirty();
            fixture.detectChanges();

            component.checkEmail();
            fixture.detectChanges();

            govOption.setValue('ssn');
            govOption.markAsTouched();
            govOption.markAsDirty();
            fixture.detectChanges();

            ssnInputField.setValue('1234');
            ssnInputField.markAsTouched();
            ssnInputField.markAsDirty();
            fixture.detectChanges();

            phoneNumInputField.setValue('0123456789');
            phoneNumInputField.markAsTouched();
            phoneNumInputField.markAsDirty();
            fixture.detectChanges();

            component.checkPhoneNumber();

            const receivePhoneNumCheckbox = fixture.debugElement.query(By.css('#getPhones')).nativeElement;

            emailInputField.setValue('william.bawwab@pavocom.com');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            component.checkEmail();

            const receiveEmailCheckbox = fixture.debugElement.query(By.css('#getEmails')).nativeElement;

            spyOn(component.goToNext, 'emit').and.callThrough();
            component.goToNext.emit();

            expect(fNameInputField.hasError('pattern')).toBeFalsy();
            expect(mNameInputField.hasError('pattern')).toBeFalsy();
            expect(lNameInputField.hasError('pattern')).toBeFalsy();
            expect(ssnInputField.hasError('minlength')).toBeFalsy();

            expect(phoneNumInputField.hasError('minlength')).toBeFalsy();
            expect(receivePhoneNumCheckbox.checked).toBeTruthy();

            expect(emailInputField.hasError('email')).toBeFalsy();
            expect(receiveEmailCheckbox.checked).toBeTruthy();

            expect(component.personalInfoForm.errors).toBeNull();

            expect(component.goToNext.emit).toHaveBeenCalled();
        });
    }));

    it('Should make sure that 29,30,31 are disabled if the month is "02" with non leap year ', waitForAsync(() => {
        fixture.whenStable().then(() => {
            // added this to make all values are correct , and if we changed dob the form will be not valid
            component.savedInfo = savedInfo;
            fixture.detectChanges();

            const selectMonth = fixture.debugElement.query(By.css('#month')).nativeElement.options[1].value;

            monthSelectField.setValue(selectMonth);
            monthSelectField.markAsTouched();
            monthSelectField.markAsDirty();
            fixture.detectChanges();

            yearSelectField.setValue('1997');
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

    it('Should populate the form when there is saved info already', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.savedInfo = savedInfo;
            component.populateForm();
            fixture.detectChanges();

            component.personalInfoForm.markAllAsTouched();
            fixture.detectChanges();

            spyOn(component.goToNext, 'emit').and.callThrough();
            component.goToNext.emit();

            expect(component.personalInfoForm.errors).toBeNull();
            expect(fNameInputField.value).toEqual(savedInfo.firstName);
            expect(mNameInputField.value).toEqual(undefined);
            expect(lNameInputField.value).toEqual(savedInfo.lastName);
            expect(daySelectField.value).toEqual(savedInfo?.dob?.split('/')[1]);
            expect(monthSelectField.value).toEqual(savedInfo?.dob?.split('/')[0]);
            expect(yearSelectField.value).toEqual(savedInfo?.dob?.split('/')[2]);
            expect(ssnInputField.value).toEqual(savedInfo?.last4ssn);
            expect(emailInputField.value).toEqual(savedInfo?.consumerEmail);
            expect(component.goToNext.emit).toHaveBeenCalled();

        });
    }));
});
