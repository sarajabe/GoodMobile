import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseEBBService, IFirebaseEbbDetails } from '@ztarmobile/zwp-service-backend';
import { of } from 'rxjs';
import { AddressInfoComponent } from './address-info.component';

let component: AddressInfoComponent;
let fixture: ComponentFixture<AddressInfoComponent>;

let addressOneInputField;
let addressTwoInputField;
let cityInputField;
let stateInputField;
let zipCodeInputField;

let mailingAddressOneInputField;
let mailingAddressTwoInputField;
let mailingCityInputField;
let mailingStateInputField;
let mailingZipCodeInputField;
let mockFirebaseEBBService;

describe('EBB address info Component - Unit Testing', async () => {
    beforeEach(async () => {
        mockFirebaseEBBService = jasmine.createSpyObj(['FirebaseEBBService', 'clearEBBDetails', 'saveEbbDetails', 'ebbDetails']);
        await TestBed.configureTestingModule({
            declarations: [AddressInfoComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                RouterTestingModule
            ],
            providers: [
                FirebaseEBBService
            ]
        });
        TestBed.overrideProvider(FirebaseEBBService, { useValue: mockFirebaseEBBService });
        TestBed.compileComponents();
    });
    beforeEach(async () => {
        fixture = TestBed.createComponent(AddressInfoComponent);
        component = fixture.componentInstance;

        addressOneInputField = component.addressInfoForm.controls.address1;
        addressTwoInputField = component.addressInfoForm.controls.address2;
        cityInputField = component.addressInfoForm.controls.city;
        stateInputField = component.addressInfoForm.controls.state;
        zipCodeInputField = component.addressInfoForm.controls.zipCode;

        mailingAddressOneInputField = component.mailingAddressForm.controls.address1;
        mailingAddressTwoInputField = component.mailingAddressForm.controls.address2;
        mailingCityInputField = component.mailingAddressForm.controls.city;
        mailingStateInputField = component.mailingAddressForm.controls.state;
        mailingZipCodeInputField = component.mailingAddressForm.controls.zipCode;
        mockFirebaseEBBService.ebbDetails.and.returnValue({} as IFirebaseEbbDetails);
        mockFirebaseEBBService.ebbDetails = of({});
        fixture.detectChanges();
    });

    it('should create', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('Test a form group element count', waitForAsync(() => {
        const addressInfoFormElement = fixture.nativeElement.querySelector('#addressInfoForm');
        const addressInfoInputElements = addressInfoFormElement.querySelectorAll('input');

        const mailingAddressFormElement = fixture.nativeElement.querySelector('#mailingAddressForm');
        const mailingAddressInputElements = mailingAddressFormElement.querySelectorAll('input');

        expect(addressInfoInputElements.length + mailingAddressInputElements.length).toEqual(10);
    }));

    it('Should covers the initial state (both forms appear and the mailing checkbox is unchecked)', waitForAsync(() => {
        fixture.whenStable().then(() => {

            const addressInfoForm = fixture.nativeElement.querySelector('#addressInfoForm');
            const mailingAddressForm = fixture.nativeElement.querySelector('#mailingAddressForm');

            const useMailingAddressCheckbox = fixture.debugElement.query(By.css('#useSameAddress')).nativeElement;

            expect(addressInfoForm).toBeDefined();
            expect(useMailingAddressCheckbox.checked).toBeFalsy();
            expect(mailingAddressForm).toBeDefined();
        });
    }));

    it('Should show validation messages for the required elements when the values are empty for both forms', waitForAsync(() => {
        fixture.whenStable().then(() => {

            addressOneInputField.markAsTouched();
            cityInputField.markAsTouched();
            stateInputField.markAsTouched();
            zipCodeInputField.markAsTouched();
            fixture.detectChanges();

            mailingAddressOneInputField.markAsTouched();
            mailingCityInputField.markAsTouched();
            mailingStateInputField.markAsTouched();
            mailingZipCodeInputField.markAsTouched();
            fixture.detectChanges();

            const useMailingAddressCheckbox = fixture.debugElement.query(By.css('#useSameAddress')).nativeElement;

            const requiredAddressOneMsg = fixture.debugElement.query(By.css('#required-address-one-msg'));
            const requiredCityMsg = fixture.debugElement.query(By.css('#required-city-msg'));
            const requiredStateMsg = fixture.debugElement.query(By.css('#required-state-msg'));
            const requiredZipCodeMsg = fixture.debugElement.query(By.css('#required-zipcode-msg'));

            const requiredMailingAddressOneMsg = fixture.debugElement.query(By.css('#required-mailing-address-one-msg'));
            const requiredMailingCityMsg = fixture.debugElement.query(By.css('#required-mailing-city-msg'));
            const requiredMailingStateMsg = fixture.debugElement.query(By.css('#required-mailing-state-msg'));
            const requiredMailingZipCodeMsg = fixture.debugElement.query(By.css('#required-mailing-zipcode-msg'));

            expect(addressOneInputField.errors.required).toBeTruthy();
            expect(requiredAddressOneMsg.nativeElement).toBeDefined();

            expect(cityInputField.errors.required).toBeTruthy();
            expect(requiredCityMsg.nativeElement).toBeDefined();

            expect(stateInputField.errors.required).toBeTruthy();
            expect(requiredStateMsg.nativeElement).toBeDefined();

            expect(zipCodeInputField.errors.required).toBeTruthy();
            expect(requiredZipCodeMsg.nativeElement).toBeDefined();

            expect(useMailingAddressCheckbox.checked).toBeFalsy();

            expect(mailingAddressOneInputField.errors.required).toBeTruthy();
            expect(requiredMailingAddressOneMsg.nativeElement).toBeDefined();

            expect(mailingCityInputField.errors.required).toBeTruthy();
            expect(requiredMailingCityMsg.nativeElement).toBeDefined();

            expect(mailingStateInputField.errors.required).toBeTruthy();
            expect(requiredMailingStateMsg.nativeElement).toBeDefined();

            expect(mailingZipCodeInputField.errors.required).toBeTruthy();
            expect(requiredMailingZipCodeMsg.nativeElement).toBeDefined();

            expect(component.addressInfoForm.valid).toBeFalsy();
            expect(component.mailingAddressForm.valid).toBeFalsy();
        });
    }));

    it('Should check that the mailing form is hidden when the chcekbox is checked', waitForAsync(() => {
        fixture.whenStable().then(() => {

            const useMailingAddressCheckbox = fixture.debugElement.query(By.css('#useSameAddress')).nativeElement;
            useMailingAddressCheckbox.click();

            component.useSameAddress = true;
            fixture.detectChanges();

            const mailingAddressForm = fixture.nativeElement.querySelector('#mailingAddressForm');

            expect(useMailingAddressCheckbox.checked).toBeTruthy();
            expect(mailingAddressForm).toBeNull();
        });
    }));

    it('Should show validation messages when the values are invalid for both forms', waitForAsync(() => {
        fixture.whenStable().then(() => {

            cityInputField.setValue('6');
            cityInputField.markAsTouched();
            cityInputField.markAsDirty();
            fixture.detectChanges();

            stateInputField.setValue('6');
            stateInputField.markAsTouched();
            stateInputField.markAsDirty();
            fixture.detectChanges();

            zipCodeInputField.setValue('6');
            zipCodeInputField.markAsTouched();
            zipCodeInputField.markAsDirty();
            fixture.detectChanges();

            mailingCityInputField.setValue('6');
            mailingCityInputField.markAsTouched();
            mailingCityInputField.markAsDirty();
            fixture.detectChanges();

            mailingStateInputField.setValue('6');
            mailingStateInputField.markAsTouched();
            mailingStateInputField.markAsDirty();
            fixture.detectChanges();

            mailingZipCodeInputField.setValue('6');
            mailingZipCodeInputField.markAsTouched();
            mailingZipCodeInputField.markAsDirty();
            fixture.detectChanges();

            const useMailingAddressCheckbox = fixture.debugElement.query(By.css('#useSameAddress')).nativeElement;

            const invalidCityMsg = fixture.debugElement.query(By.css('#invalid-city-msg'));
            const invalidStateMsg = fixture.debugElement.query(By.css('#invalid-state-msg'));
            const invalidZipCodeMsg = fixture.debugElement.query(By.css('#invalid-zipcode-msg'));

            const invalidMailingCityMsg = fixture.debugElement.query(By.css('#invalid-mailing-city-msg'));
            const invalidMailingStateMsg = fixture.debugElement.query(By.css('#invalid-mailing-state-msg'));
            const invalidMailingZipCodeMsg = fixture.debugElement.query(By.css('#invalid-mailing-zipcode-msg'));

            expect(cityInputField.hasError('pattern')).toBeTruthy();
            expect(invalidCityMsg.nativeElement).toBeDefined();

            expect(stateInputField.hasError('pattern')).toBeTruthy();
            expect(invalidStateMsg.nativeElement).toBeDefined();

            expect(zipCodeInputField.hasError('pattern')).toBeTruthy();
            expect(invalidZipCodeMsg.nativeElement).toBeDefined();

            expect(useMailingAddressCheckbox.checked).toBeFalsy();

            expect(mailingCityInputField.hasError('pattern')).toBeTruthy();
            expect(invalidMailingCityMsg.nativeElement).toBeDefined();

            expect(mailingStateInputField.hasError('pattern')).toBeTruthy();
            expect(invalidMailingStateMsg.nativeElement).toBeDefined();

            expect(mailingZipCodeInputField.hasError('pattern')).toBeTruthy();
            expect(invalidMailingZipCodeMsg.nativeElement).toBeDefined();

            expect(component.addressInfoForm.valid).toBeFalsy();
            expect(component.mailingAddressForm.valid).toBeFalsy();
        });
    }));

    it('Should not show validation messages when the values are valid for both forms', waitForAsync(() => {
        fixture.whenStable().then(() => {

            cityInputField.setValue('NY');
            cityInputField.markAsTouched();
            cityInputField.markAsDirty();
            fixture.detectChanges();

            stateInputField.setValue('NY');
            stateInputField.markAsTouched();
            stateInputField.markAsDirty();
            fixture.detectChanges();

            zipCodeInputField.setValue('70012');
            zipCodeInputField.markAsTouched();
            zipCodeInputField.markAsDirty();
            fixture.detectChanges();

            mailingCityInputField.setValue('NY');
            mailingCityInputField.markAsTouched();
            mailingCityInputField.markAsDirty();
            fixture.detectChanges();

            mailingStateInputField.setValue('NY');
            mailingStateInputField.markAsTouched();
            mailingStateInputField.markAsDirty();
            fixture.detectChanges();

            mailingZipCodeInputField.setValue('70012');
            mailingZipCodeInputField.markAsTouched();
            mailingZipCodeInputField.markAsDirty();
            fixture.detectChanges();

            expect(cityInputField.hasError('pattern')).toBeFalsy();
            expect(stateInputField.hasError('pattern')).toBeFalsy();
            expect(zipCodeInputField.hasError('pattern')).toBeFalsy();

            expect(mailingCityInputField.hasError('pattern')).toBeFalsy();
            expect(mailingStateInputField.hasError('pattern')).toBeFalsy();
            expect(mailingZipCodeInputField.hasError('pattern')).toBeFalsy();

            expect(component.addressInfoForm.errors).toBeNull();
            expect(component.mailingAddressForm.errors).toBeNull();
        });
    }));
    it('Should check if address info form is disabled after the user had already enrolled (step 3)', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.disable = true;
            fixture.detectChanges();
            expect(component.addressInfoForm.disable).toBeTruthy();
            expect(component.mailingAddressForm.disable).toBeTruthy();
        });
    }));
});
