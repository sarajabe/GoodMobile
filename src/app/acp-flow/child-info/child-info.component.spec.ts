import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseEBBService, IFirebaseEbbDetails } from '@ztarmobile/zwp-service-backend';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ChildInfoComponent } from './child-info.component';
let component: ChildInfoComponent;
let fixture: ComponentFixture<ChildInfoComponent>;

let qualifyProgramInputField;
let schoolNameInputField;
let fNameInputField;
let mNameInputField;
let lNameInputField;
let monthSelectField;
let dayInputField;
let yearInputField;
let idTypeInputField;
let ssnInputField;
let tribalInputField;
let mockEbbService;
let mockFirebaseEBBService;

describe('EBB child info Component - Unit Testing', async () => {
    const DATA_OBJECT = {
        data: {
            eligibilityCodes: [
                { code: 'Medicaid ' }, { code: 'Supplemental Nutrition Assistance Program (SNAP) ' },
                { code: 'School Lunch/Breakfast Program ' }
            ]
        }
    };
    beforeEach(async () => {
        mockEbbService = jasmine.createSpyObj(['EBBService', 'getCodes']);
        mockFirebaseEBBService = jasmine.createSpyObj(['FirebaseEBBService', 'clearEBBDetails', 'saveEbbDetails', 'ebbDetails']);
        await TestBed.configureTestingModule({
            declarations: [ChildInfoComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                RouterTestingModule
            ],
            providers: [
                { provide: EbbService },
                { provide: ToastrService, useValue: ToastrService },
                { provide: FirebaseEBBService }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        TestBed.overrideProvider(EbbService, { useValue: mockEbbService });
        TestBed.overrideProvider(FirebaseEBBService, { useValue: mockFirebaseEBBService });
        TestBed.compileComponents();
    });
    beforeEach(async () => {
        fixture = TestBed.createComponent(ChildInfoComponent);
        component = fixture.componentInstance;

        mockEbbService.getCodes.and.resolveTo(DATA_OBJECT);
        component.eligibilityCodes = [
            { code: 'School Lunch/Breakfast Program ', description: 'School Lunch/Breakfast Program ' }];
        mockFirebaseEBBService.ebbDetails.and.returnValue({} as IFirebaseEbbDetails);
        mockFirebaseEBBService.ebbDetails = of({});
        fixture.detectChanges();

        qualifyProgramInputField = component.codesForm.controls.eligibilityCode;
        schoolNameInputField = component.codesForm.controls.schoolName;

        fNameInputField = component.childInfoForm.controls.firstName;
        mNameInputField = component.childInfoForm.controls.middleName;
        lNameInputField = component.childInfoForm.controls.lastName;
        monthSelectField = component.childInfoForm.controls.month;
        dayInputField = component.childInfoForm.controls.day;
        yearInputField = component.childInfoForm.controls.year;
        idTypeInputField = component.childInfoForm.controls.identityType;
        ssnInputField = component.childInfoForm.controls.ssn;
        tribalInputField = component.childInfoForm.controls.tribalId;
        fixture.detectChanges();
    });

    it('should create', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('Test a form group element count', waitForAsync(() => {
        const formElement = fixture.nativeElement.querySelector('form');
        const inputElements = formElement.querySelectorAll('input');
        const selectElements = formElement.querySelectorAll('select');
        expect(inputElements.length).toEqual(0);
        expect(selectElements.length).toEqual(0);
    }));

    it('Should cover the initial state (drop down is empty, checkbox is unchecked and qualified form is hidden)', waitForAsync(() => {
        fixture.whenStable().then(() => {
            const iQualifyChildCheckbox = fixture.debugElement.query(By.css('#confirmChild')).nativeElement;
            const childInfoForm = fixture.nativeElement.querySelector('#childInfoForm');
            expect(qualifyProgramInputField.pristine).toBeTruthy();
            expect(iQualifyChildCheckbox.checked).toBeFalsy();
            expect(childInfoForm).toBeNull();
        });
    }));

    it('Should checks if the qualified form appears when checkbox is checked', waitForAsync(() => {
        fixture.whenStable().then(() => {

            const iQualifyChildCheckbox = fixture.debugElement.query(By.css('#confirmChild')).nativeElement;
            iQualifyChildCheckbox.click();
            const childInfoForm = fixture.nativeElement.querySelector('#childInfoForm');

            expect(iQualifyChildCheckbox.checked).toBeTruthy();
            expect(childInfoForm).toBeDefined();
        });
    }));

    it('Should show validation messages for the required elements when the values are empty of the child form', waitForAsync(() => {
        fixture.whenStable().then(() => {

            qualifyProgramInputField.markAsTouched();

            const iQualifyChildCheckbox = fixture.debugElement.query(By.css('#confirmChild')).nativeElement;
            iQualifyChildCheckbox.click();

            fNameInputField.markAsTouched();
            lNameInputField.markAsTouched();
            monthSelectField.markAsTouched();
            dayInputField.markAsTouched();
            yearInputField.markAsTouched();
            idTypeInputField.markAsTouched();

            fixture.detectChanges();

            const requiredQualifyingProgramMsg = fixture.debugElement.query(By.css('#required-qualifying-program-msg'));

            const requiredFNameMsg = fixture.debugElement.query(By.css('#required-fname-msg'));
            const requiredLNameMsg = fixture.debugElement.query(By.css('#required-lname-msg'));

            const requiredMonthMsg = fixture.debugElement.query(By.css('#required-month-msg'));
            const requiredDayMsg = fixture.debugElement.query(By.css('#required-day-msg'));
            const requiredYearMsg = fixture.debugElement.query(By.css('#required-year-msg'));

            const requiredIdTypeMsg = fixture.debugElement.query(By.css('#required-idType-msg'));

            expect(qualifyProgramInputField.pristine).toBeTruthy();
            expect(requiredQualifyingProgramMsg.nativeElement).toBeDefined();

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

            expect(component.childInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages for the required school input when the value is empty', waitForAsync(() => {
        fixture.whenStable().then(() => {

            const schoolSelect = 'E50';

            qualifyProgramInputField.setValue(schoolSelect);
            qualifyProgramInputField.markAsTouched();
            qualifyProgramInputField.markAsDirty();
            fixture.detectChanges();

            schoolNameInputField.markAsTouched();
            fixture.detectChanges();

            expect(schoolNameInputField.errors.required).toBeTruthy();

            expect(component.codesForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages for the other required elements of the child form - [ ssn - tripal ]', waitForAsync(() => {
        fixture.whenStable().then(() => {

            const iQualifyChildCheckbox = fixture.debugElement.query(By.css('#confirmChild')).nativeElement;
            iQualifyChildCheckbox.click();

            fixture.detectChanges();

            const ssnId = fixture.debugElement.query(By.css('#idType')).nativeElement.options[0].value;

            idTypeInputField.setValue(ssnId);
            idTypeInputField.markAsTouched();
            idTypeInputField.markAsDirty();
            fixture.detectChanges();
            component.updateIdentitiyType();
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
            component.updateIdentitiyType();
            tribalInputField.markAsTouched();

            fixture.detectChanges();

            const requiredTribalMsg = fixture.debugElement.query(By.css('#required-tribal-msg'));

            expect(tribalInputField.errors.required).toBeTruthy();
            expect(requiredTribalMsg.nativeElement).toBeDefined();

            expect(component.childInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages when the values are invalid for the school input and the child form', waitForAsync(() => {
        fixture.whenStable().then(() => {
            const schoolSelect = 'E50';
            fixture.detectChanges();
            qualifyProgramInputField.setValue(schoolSelect);
            qualifyProgramInputField.markAsTouched();
            qualifyProgramInputField.markAsDirty();
            fixture.detectChanges();
            schoolNameInputField.setValue('....');
            schoolNameInputField.markAsTouched();
            schoolNameInputField.markAsDirty();
            fixture.detectChanges();
            const iQualifyChildCheckbox = fixture.debugElement.query(By.css('#confirmChild')).nativeElement;
            iQualifyChildCheckbox.click();

            fixture.detectChanges();

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

            ssnInputField.setValue('12');
            ssnInputField.markAsTouched();
            ssnInputField.markAsDirty();
            fixture.detectChanges();

            const invalidFNameMsg = fixture.debugElement.query(By.css('#invalid-fname-msg'));
            const invalidMNameMsg = fixture.debugElement.query(By.css('#invalid-mname-msg'));
            const invalidLNameMsg = fixture.debugElement.query(By.css('#invalid-lname-msg'));
            const invalidYearMsg = fixture.debugElement.query(By.css('#invalid-year-msg'));

            const invalidSsnMsg = fixture.debugElement.query(By.css('#invalid-ssn-msg'));
            expect(schoolNameInputField.hasError('pattern')).toBeTruthy();
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
            dayInputField.setValue('0');
            dayInputField.markAsTouched();
            dayInputField.markAsDirty();
            fixture.detectChanges();
            expect(dayInputField.hasError('min')).toBeTruthy();
            expect(component.childInfoForm.valid).toBeFalsy();
        });
    }));

    it('Should not show validation messages when the values are valid for the school input and the child form', waitForAsync(() => {
        fixture.whenStable().then(() => {
            const schoolSelect = 'E50';
            fixture.detectChanges();
            qualifyProgramInputField.setValue(schoolSelect);
            qualifyProgramInputField.markAsTouched();
            qualifyProgramInputField.markAsDirty();
            fixture.detectChanges();
            schoolNameInputField.setValue('Abc1234');
            schoolNameInputField.markAsTouched();
            schoolNameInputField.markAsDirty();
            fixture.detectChanges();

            const iQualifyChildCheckbox = fixture.debugElement.query(By.css('#confirmChild')).nativeElement;
            iQualifyChildCheckbox.click();

            fixture.detectChanges();

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
            fixture.detectChanges();

            expect(schoolNameInputField.hasError('pattern')).toBeFalsy();
            expect(fNameInputField.hasError('pattern')).toBeFalsy();
            expect(mNameInputField.hasError('pattern')).toBeFalsy();
            expect(lNameInputField.hasError('pattern')).toBeFalsy();
            expect(dayInputField.hasError('max')).toBeFalsy();
            expect(yearInputField.hasError('max')).toBeFalsy();
            expect(ssnInputField.hasError('minlength')).toBeFalsy();

            expect(component.codesForm.errors).toBeNull();
            expect(component.childInfoForm.errors).toBeNull();
        });
    }));
    it('Should check if Eligibility code field accepts multiple values', waitForAsync(() => {
        fixture.whenStable().then(() => {
            spyOn(component, 'onItemSelect');
            qualifyProgramInputField.setValue(['Medicaid', 'Supplemental Security']);
            qualifyProgramInputField.markAsTouched();
            qualifyProgramInputField.markAsDirty();
            fixture.detectChanges();
            expect(qualifyProgramInputField).toBeDefined();
            expect(qualifyProgramInputField.value.length).toEqual(2);

        });
    }));
    it('Should checks if all fields are disabled when the user is already enrolled (step 2)', waitForAsync(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            component.disable = true;
            fixture.detectChanges();
            expect(component.childInfoForm.disable).toBeTruthy();
        });
    }));
});
