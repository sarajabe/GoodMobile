import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseEBBService, IFirebaseEbbDetails } from '@ztarmobile/zwp-service-backend';
import { of } from 'rxjs';
import { PersonalInfoComponent } from './personal-info.component';

let component: PersonalInfoComponent;
let fixture: ComponentFixture<PersonalInfoComponent>;

let fNameInputField;
let mNameInputField;
let lNameInputField;
let monthSelectField;
let dayInputField;
let yearInputField;
let idTypeInputField;
let phoneNumInputField;
let emailInputField;

let ssnInputField;
let tribalInputField;

let mockFirebaseEBBService;

describe('EBB Personal Information Component - Unit Testing', async () => {
    beforeEach(async () => {
        mockFirebaseEBBService = jasmine.createSpyObj(['FirebaseEBBService', 'clearEBBDetails', 'saveEbbDetails', 'ebbDetails']);
        await TestBed.configureTestingModule({
            declarations: [PersonalInfoComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                RouterTestingModule
            ],
            providers: [{ provide: FirebaseEBBService }]
        });
        TestBed.overrideProvider(FirebaseEBBService, { useValue: mockFirebaseEBBService });
        TestBed.compileComponents();
    });
    beforeEach(async () => {
        fixture = TestBed.createComponent(PersonalInfoComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');

        fNameInputField = component.personalInfoForm.controls.firstName;
        mNameInputField = component.personalInfoForm.controls.middleName;
        lNameInputField = component.personalInfoForm.controls.lastName;
        monthSelectField = component.personalInfoForm.controls.month;
        dayInputField = component.personalInfoForm.controls.day;
        yearInputField = component.personalInfoForm.controls.year;
        idTypeInputField = component.personalInfoForm.controls.identityType;
        phoneNumInputField = component.personalInfoForm.controls.phoneNumber;
        emailInputField = component.personalInfoForm.controls.email;

        ssnInputField = component.personalInfoForm.controls.ssn;
        tribalInputField = component.personalInfoForm.controls.tribalId;
        mockFirebaseEBBService.ebbDetails.and.returnValue({} as IFirebaseEbbDetails);
        mockFirebaseEBBService.ebbDetails = of({});
        fixture.detectChanges();
    });

    it('should create', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('Test a form group element count', waitForAsync(() => {
        const formElement = fixture.nativeElement.querySelector('form');
        const inputElements = formElement.querySelectorAll('input');
        const selectElements = formElement.querySelectorAll('select');

        expect(inputElements.length).toEqual(8);
        expect(selectElements.length).toEqual(3);
    }));

    it('Should show validation messages for the required elements when the values are empty', waitForAsync(() => {
        fixture.whenStable().then(() => {

            fNameInputField.setValue('');
            fNameInputField.markAsTouched();

            mNameInputField.setValue('');
            mNameInputField.markAsTouched();

            lNameInputField.setValue('');
            lNameInputField.markAsTouched();

            monthSelectField.markAsTouched();

            dayInputField.setValue('');
            dayInputField.markAsTouched();

            yearInputField.setValue('');
            yearInputField.markAsTouched();

            idTypeInputField.markAsTouched();

            emailInputField.setValue('');
            emailInputField.markAsTouched();

            fixture.detectChanges();

            const requiredFNameMsg = fixture.debugElement.query(By.css('#required-fname-msg'));
            const requiredLNameMsg = fixture.debugElement.query(By.css('#required-lname-msg'));

            const requiredMonthMsg = fixture.debugElement.query(By.css('#required-month-msg'));
            const requiredDayMsg = fixture.debugElement.query(By.css('#required-day-msg'));
            const requiredYearMsg = fixture.debugElement.query(By.css('#required-year-msg'));

            const requiredIdTypeMsg = fixture.debugElement.query(By.css('#required-idType-msg'));

            const requiredEmailMsg = fixture.debugElement.query(By.css('#required-email-msg'));

            expect(fNameInputField.errors.required).toBeTruthy();
            expect(requiredFNameMsg.nativeElement).toBeDefined();

            expect(lNameInputField.errors.required).toBeTruthy();
            expect(requiredLNameMsg.nativeElement).toBeDefined();

            expect(monthSelectField.pristine).toBeTruthy();
            expect(requiredMonthMsg.nativeElement).toBeDefined();

            expect(dayInputField.errors.required).toBeTruthy();
            expect(requiredDayMsg.nativeElement).toBeDefined();

            expect(yearInputField.errors.required).toBeTruthy();
            expect(requiredYearMsg.nativeElement).toBeDefined();

            expect(idTypeInputField.pristine).toBeTruthy();
            expect(requiredIdTypeMsg.nativeElement).toBeDefined();

            expect(emailInputField.errors.required).toBeTruthy();
            expect(requiredEmailMsg.nativeElement).toBeDefined();

            expect(component.personalInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages for the other required elements - [ ssn - tripal - checkboxes ]', waitForAsync(() => {
        fixture.whenStable().then(() => {
            const ssnId = fixture.debugElement.query(By.css('#idType')).nativeElement.options[0].value;
            idTypeInputField.setValue(ssnId);
            idTypeInputField.markAsTouched();
            idTypeInputField.markAsDirty();
            fixture.detectChanges();

            ssnInputField.setValue('');
            ssnInputField.markAsTouched();

            fixture.detectChanges();

            const requiredSsnMsg = fixture.debugElement.query(By.css('#required-ssn-msg'));
            expect(ssnInputField.errors.required).toBeTruthy();
            expect(requiredSsnMsg.nativeElement).toBeDefined();

            const tribalId = fixture.debugElement.query(By.css('#idType')).nativeElement.options[1].value;

            idTypeInputField.setValue(tribalId);
            idTypeInputField.markAsTouched();
            idTypeInputField.markAsDirty();
            fixture.detectChanges();

            tribalInputField.setValue('');
            tribalInputField.markAsTouched();

            fixture.detectChanges();

            const requiredTribalMsg = fixture.debugElement.query(By.css('#required-tribal-msg'));

            expect(tribalInputField.errors.required).toBeTruthy();
            expect(requiredTribalMsg.nativeElement).toBeDefined();

            phoneNumInputField.setValue('0123456789');
            phoneNumInputField.markAsTouched();
            phoneNumInputField.markAsDirty();
            fixture.detectChanges();
            emailInputField.setValue('william.bawwab@pavocom.com');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            const receiveEmailCheckbox = fixture.debugElement.query(By.css('#getEmails'));
            receiveEmailCheckbox.nativeElement.click();

            const requiredReceiveEmailsMsg = fixture.debugElement.query(By.css('#required-receive-emails-msg'));

            expect(emailInputField.errors).toBeNull();
            expect(receiveEmailCheckbox.nativeElement.checked).toBeTruthy();
            expect(requiredReceiveEmailsMsg.nativeElement).toBeDefined();

            expect(component.personalInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages when the values are invalid', waitForAsync(() => {
        fixture.whenStable().then(() => {

            fNameInputField.setValue('12');
            fNameInputField.markAsTouched();
            fNameInputField.markAsDirty();
            fixture.detectChanges();

            mNameInputField.setValue('12');
            mNameInputField.markAsTouched();
            mNameInputField.markAsDirty();
            fixture.detectChanges();

            lNameInputField.setValue('12');
            lNameInputField.markAsTouched();
            lNameInputField.markAsDirty();
            fixture.detectChanges();

            dayInputField.setValue('99');
            dayInputField.markAsTouched();
            dayInputField.markAsDirty();
            fixture.detectChanges();

            yearInputField.setValue('5000');
            yearInputField.markAsTouched();
            yearInputField.markAsDirty();
            fixture.detectChanges();

            const ssnId = fixture.debugElement.query(By.css('#idType')).nativeElement.options[0].value;

            idTypeInputField.setValue(ssnId);
            idTypeInputField.markAsTouched();
            idTypeInputField.markAsDirty();
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
            const invalidYearMsg = fixture.debugElement.query(By.css('#invalid-year-msg'));

            const invalidSsnMsg = fixture.debugElement.query(By.css('#invalid-ssn-msg'));

            const invalidPhoneMsg = fixture.debugElement.query(By.css('#invalid-phone-msg'));
            const invalidEmailMsg = fixture.debugElement.query(By.css('#invalid-email-msg'));

            expect(fNameInputField.hasError('pattern')).toBeTruthy();
            expect(invalidFNameMsg.nativeElement).toBeDefined();

            expect(mNameInputField.hasError('pattern')).toBeTruthy();
            expect(invalidMNameMsg.nativeElement).toBeDefined();

            expect(lNameInputField.hasError('pattern')).toBeTruthy();
            expect(invalidLNameMsg.nativeElement).toBeDefined();

            expect(dayInputField.hasError('max')).toBeTruthy();

            expect(yearInputField.hasError('max')).toBeTruthy();
            expect(invalidYearMsg.nativeElement).toBeDefined();

            expect(ssnInputField.hasError('minlength')).toBeTruthy();
            expect(invalidSsnMsg.nativeElement).toBeDefined();

            expect(phoneNumInputField.hasError('minlength')).toBeTruthy();
            expect(invalidPhoneMsg.nativeElement).toBeDefined();

            expect(emailInputField.hasError('email')).toBeTruthy();
            expect(invalidEmailMsg.nativeElement).toBeDefined();

            dayInputField.setValue('0');
            dayInputField.markAsTouched();
            dayInputField.markAsDirty();
            fixture.detectChanges();

            expect(dayInputField.hasError('min')).toBeTruthy();

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

            dayInputField.setValue('13');
            dayInputField.markAsTouched();
            dayInputField.markAsDirty();
            fixture.detectChanges();

            yearInputField.setValue('1997');
            yearInputField.markAsTouched();
            yearInputField.markAsDirty();
            fixture.detectChanges();

            const ssnId = fixture.debugElement.query(By.css('#idType')).nativeElement.options[0].value;

            idTypeInputField.setValue(ssnId);
            idTypeInputField.markAsTouched();
            idTypeInputField.markAsDirty();
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
            expect(dayInputField.hasError('max')).toBeFalsy();
            expect(yearInputField.hasError('max')).toBeFalsy();
            expect(ssnInputField.hasError('minlength')).toBeFalsy();

            expect(phoneNumInputField.hasError('minlength')).toBeFalsy();
            expect(receivePhoneNumCheckbox.checked).toBeTruthy();

            expect(emailInputField.hasError('email')).toBeFalsy();
            expect(receiveEmailCheckbox.checked).toBeTruthy();

            expect(component.personalInfoForm.errors).toBeNull();

            expect(component.goToNext.emit).toHaveBeenCalled();
        });
    }));

    it('Should checks if all fields are disabled when the user is already enrolled', waitForAsync(() => {
        fixture.whenStable().then(() => {

            component.disable = true;
            fixture.detectChanges();

            expect(component.personalInfoForm.disable).toBeTruthy();
        });
    }));
});
