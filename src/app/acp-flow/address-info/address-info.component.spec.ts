import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsAnalyticsService, FirebaseUserProfileService, PlacesAutocompleteService } from '@ztarmobile/zwp-service-backend';
import { AddressInfoComponent } from './address-info.component';
import { InjectionToken, SimpleChange } from '@angular/core';
import { IGoogleTagManagerEventsConfig } from '@ztarmobile/zwp-service';
import { AppState } from 'src/app/app.service';
import { EbbService, IAcpAddress } from '@ztarmobile/zwp-service-backend-v2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ACP_MOCKS } from 'src/mocks';

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

let mockAnalyticService;
let mockPlacesAutocompleteService;
let mockEbbService;
let mockFirebaseUserProfileService;

fdescribe('No flow - EBB Address Info Component - Unit Testing', async () => {
    beforeEach(async () => {
        mockEbbService = jasmine.createSpy('EBBService');
        mockFirebaseUserProfileService = jasmine.createSpy('FirebaseUserProfileService');
        mockAnalyticService = jasmine.createSpyObj(['ActionsAnalyticsService', 'trackACPEvent']);
        mockPlacesAutocompleteService = jasmine.createSpyObj(['PlacesAutocompleteService', 'findAddress', 'findDetailedAddressFields']);

        await TestBed.configureTestingModule({
            declarations: [
                AddressInfoComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                MatAutocompleteModule
            ],
            providers: [
                { provide: AppState },
                { provide: EbbService },
                { provide: FirebaseUserProfileService },
                { provide: ActionsAnalyticsService, useValue: new InjectionToken<IGoogleTagManagerEventsConfig>('GoogleTagManagerEvents') },
                { provide: PlacesAutocompleteService }
            ]
        });

        TestBed.overrideProvider(EbbService, { useValue: mockEbbService });
        TestBed.overrideProvider(FirebaseUserProfileService, { useValue: mockFirebaseUserProfileService });
        TestBed.overrideProvider(ActionsAnalyticsService, { useValue: mockAnalyticService });
        TestBed.overrideProvider(PlacesAutocompleteService, { useValue: mockPlacesAutocompleteService });
        TestBed.compileComponents();

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
        fixture.detectChanges();
    });

    it('Should create a component successfully', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('Should test a form group element count', waitForAsync(() => {
        const addressInfoFormElement = fixture.nativeElement.querySelector('#addressInfoForm');
        const addressInfoInputElements = addressInfoFormElement.querySelectorAll('input');

        const mailingAddressFormElement = fixture.nativeElement.querySelector('#mailingAddressForm');
        const mailingAddressInputElements = mailingAddressFormElement.querySelectorAll('input');

        expect(addressInfoInputElements.length).toEqual(5);
        expect(mailingAddressInputElements.length).toEqual(5);
    }));

    it('Should covers the initial state ( both forms appear and the mailing checkbox is unchecked )', waitForAsync(() => {
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

    it('Should check that the mailing form is hidden when the chcekbox is checked and the values should be same as physical address as well as the checkMailingAddress is called', waitForAsync(() => {
        fixture.whenStable().then(() => {

            const useMailingAddressCheckbox = fixture.debugElement.query(By.css('#useSameAddress')).nativeElement;
            useMailingAddressCheckbox.click();

            component.useSameAddress = true;
            spyOn(component, 'checkMailingAddress');
            fixture.detectChanges();

            const mailingAddressForm = fixture.nativeElement.querySelector('#mailingAddressForm');

            // Set physical address values 
            addressOneInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.address1);
            addressOneInputField.markAsTouched();
            addressOneInputField.markAsDirty();
            fixture.detectChanges();

            addressTwoInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.address2);
            addressTwoInputField.markAsTouched();
            addressTwoInputField.markAsDirty();
            fixture.detectChanges();

            cityInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.city);
            cityInputField.markAsTouched();
            cityInputField.markAsDirty();
            fixture.detectChanges();

            stateInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.state);
            stateInputField.markAsTouched();
            stateInputField.markAsDirty();
            fixture.detectChanges();

            zipCodeInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.zipCode);
            zipCodeInputField.markAsTouched();
            zipCodeInputField.markAsDirty();
            fixture.detectChanges();

            useMailingAddressCheckbox.dispatchEvent(new Event('change'));
            fixture.detectChanges();

            expect(useMailingAddressCheckbox.checked).toBeTruthy();
            expect(component.checkMailingAddress).toHaveBeenCalled();
            expect(mailingAddressForm).toBeNull();
            expect(component.mailingAddress).toEqual(component.primaryAddress);
        });
    }));

    it('Should check that the mailing form is visible with empty values when the chcekbox is unchecked and the mailing address object should be resetted  as well as the checkMailingAddress is called', waitForAsync(() => {
        fixture.whenStable().then(() => {
            const useMailingAddressCheckbox = fixture.debugElement.query(By.css('#useSameAddress')).nativeElement;
            useMailingAddressCheckbox.click();

            // Click again on the check box to uncheck it 
            useMailingAddressCheckbox.click();

            component.useSameAddress = false;
            spyOn(component, 'checkMailingAddress');
            fixture.detectChanges();

            const mailingAddressForm = fixture.nativeElement.querySelector('#mailingAddressForm');

            useMailingAddressCheckbox.dispatchEvent(new Event('change'));
            fixture.detectChanges();

            expect(useMailingAddressCheckbox.checked).toBeFalsy();
            expect(mailingAddressForm).toBeDefined();
            expect(component.checkMailingAddress).toHaveBeenCalled();
            expect(component.mailingAddress).toEqual({} as IAcpAddress);
        });
    }));

    it('Should show validation messages when the values are invalid for both forms', waitForAsync(() => {
        fixture.whenStable().then(() => {
            addressOneInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.address1);
            addressOneInputField.markAsTouched();
            addressOneInputField.markAsDirty();
            fixture.detectChanges();

            addressTwoInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.address2);
            addressTwoInputField.markAsTouched();
            addressTwoInputField.markAsDirty();
            fixture.detectChanges();

            cityInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.city);
            cityInputField.markAsTouched();
            cityInputField.markAsDirty();
            fixture.detectChanges();

            stateInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.state);
            stateInputField.markAsTouched();
            stateInputField.markAsDirty();
            fixture.detectChanges();

            zipCodeInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.zipCode);
            zipCodeInputField.markAsTouched();
            zipCodeInputField.markAsDirty();
            fixture.detectChanges();

            mailingAddressOneInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.address1);
            mailingAddressOneInputField.markAsTouched();
            mailingAddressOneInputField.markAsDirty();
            fixture.detectChanges();

            mailingAddressTwoInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.address2);
            mailingAddressTwoInputField.markAsTouched();
            mailingAddressTwoInputField.markAsDirty();
            fixture.detectChanges();

            mailingCityInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.city);
            mailingCityInputField.markAsTouched();
            mailingCityInputField.markAsDirty();
            fixture.detectChanges();

            mailingStateInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.state);
            mailingStateInputField.markAsTouched();
            mailingStateInputField.markAsDirty();
            fixture.detectChanges();

            mailingZipCodeInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.zipCode);
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

            expect(addressOneInputField.hasError('maxlength')).toBeTruthy();
            expect(addressTwoInputField.hasError('maxlength')).toBeTruthy();

            expect(cityInputField.hasError('pattern')).toBeTruthy();
            expect(invalidCityMsg.nativeElement).toBeDefined();

            expect(stateInputField.hasError('pattern')).toBeTruthy();
            expect(invalidStateMsg.nativeElement).toBeDefined();

            expect(zipCodeInputField.hasError('pattern')).toBeTruthy();
            expect(invalidZipCodeMsg.nativeElement).toBeDefined();

            expect(useMailingAddressCheckbox.checked).toBeFalsy();

            expect(mailingAddressOneInputField.hasError('maxlength')).toBeTruthy();
            expect(mailingAddressTwoInputField.hasError('maxlength')).toBeTruthy();

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

    it('Should show one validation messages at the time incase of typing an invalid value then removing it or vise-versa', waitForAsync(() => {
        fixture.whenStable().then(() => {
            // First check is inserting invalid value
            addressOneInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.address1);
            addressOneInputField.markAsTouched();
            addressOneInputField.markAsDirty();
            fixture.detectChanges();

            addressTwoInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.address2);
            addressTwoInputField.markAsTouched();
            addressTwoInputField.markAsDirty();
            fixture.detectChanges();

            cityInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.city);
            cityInputField.markAsTouched();
            cityInputField.markAsDirty();
            fixture.detectChanges();

            stateInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.state);
            stateInputField.markAsTouched();
            stateInputField.markAsDirty();
            fixture.detectChanges();

            zipCodeInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.zipCode);
            zipCodeInputField.markAsTouched();
            zipCodeInputField.markAsDirty();
            fixture.detectChanges();

            mailingAddressOneInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.address1);
            mailingAddressOneInputField.markAsTouched();
            mailingAddressOneInputField.markAsDirty();
            fixture.detectChanges();

            mailingAddressTwoInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.address2);
            mailingAddressTwoInputField.markAsTouched();
            mailingAddressTwoInputField.markAsDirty();
            fixture.detectChanges();

            mailingCityInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.city);
            mailingCityInputField.markAsTouched();
            mailingCityInputField.markAsDirty();
            fixture.detectChanges();

            mailingStateInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.state);
            mailingStateInputField.markAsTouched();
            mailingStateInputField.markAsDirty();
            fixture.detectChanges();

            mailingZipCodeInputField.setValue(ACP_MOCKS.INVALID_ADDRESS_INFO.zipCode);
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

            expect(addressOneInputField.hasError('maxlength')).toBeTruthy();
            expect(addressTwoInputField.hasError('maxlength')).toBeTruthy();
            expect(addressOneInputField.errors.required).toBeFalsy();

            expect(cityInputField.hasError('pattern')).toBeTruthy();
            expect(cityInputField.errors.required).toBeFalsy();
            expect(invalidCityMsg.nativeElement).toBeDefined();

            expect(stateInputField.hasError('pattern')).toBeTruthy();
            expect(stateInputField.errors.required).toBeFalsy();
            expect(invalidStateMsg.nativeElement).toBeDefined();

            expect(zipCodeInputField.hasError('pattern')).toBeTruthy();
            expect(zipCodeInputField.errors.required).toBeFalsy();
            expect(invalidZipCodeMsg.nativeElement).toBeDefined();

            expect(useMailingAddressCheckbox.checked).toBeFalsy();

            expect(mailingAddressOneInputField.hasError('maxlength')).toBeTruthy();
            expect(mailingAddressTwoInputField.hasError('maxlength')).toBeTruthy();
            expect(mailingAddressOneInputField.errors.required).toBeFalsy();

            expect(mailingCityInputField.hasError('pattern')).toBeTruthy();
            expect(mailingCityInputField.errors.required).toBeFalsy();
            expect(invalidMailingCityMsg.nativeElement).toBeDefined();

            expect(mailingStateInputField.hasError('pattern')).toBeTruthy();
            expect(mailingStateInputField.errors.required).toBeFalsy();
            expect(invalidMailingStateMsg.nativeElement).toBeDefined();

            expect(mailingZipCodeInputField.hasError('pattern')).toBeTruthy();
            expect(mailingZipCodeInputField.errors.required).toBeFalsy();
            expect(invalidMailingZipCodeMsg.nativeElement).toBeDefined();

            expect(component.addressInfoForm.valid).toBeFalsy();
            expect(component.mailingAddressForm.valid).toBeFalsy();

            // Second check is inserting empty values 
            addressOneInputField.setValue('');
            addressOneInputField.markAsTouched();
            cityInputField.setValue('');
            cityInputField.markAsTouched();
            stateInputField.setValue('');
            stateInputField.markAsTouched();
            zipCodeInputField.setValue('');
            zipCodeInputField.markAsTouched();
            fixture.detectChanges();

            mailingAddressOneInputField.setValue('');
            mailingAddressOneInputField.markAsTouched();
            mailingCityInputField.setValue('');
            mailingCityInputField.markAsTouched();
            mailingStateInputField.setValue('');
            mailingStateInputField.markAsTouched();
            mailingZipCodeInputField.setValue('');
            mailingZipCodeInputField.markAsTouched();
            fixture.detectChanges();


            const requiredAddressOneMsg = fixture.debugElement.query(By.css('#required-address-one-msg'));
            const requiredCityMsg = fixture.debugElement.query(By.css('#required-city-msg'));
            const requiredStateMsg = fixture.debugElement.query(By.css('#required-state-msg'));
            const requiredZipCodeMsg = fixture.debugElement.query(By.css('#required-zipcode-msg'));

            const requiredMailingAddressOneMsg = fixture.debugElement.query(By.css('#required-mailing-address-one-msg'));
            const requiredMailingCityMsg = fixture.debugElement.query(By.css('#required-mailing-city-msg'));
            const requiredMailingStateMsg = fixture.debugElement.query(By.css('#required-mailing-state-msg'));
            const requiredMailingZipCodeMsg = fixture.debugElement.query(By.css('#required-mailing-zipcode-msg'));

            expect(addressOneInputField.errors.required).toBeTruthy();
            expect(addressOneInputField.hasError('maxlength')).toBeFalsy();
            expect(requiredAddressOneMsg.nativeElement).toBeDefined();

            expect(cityInputField.errors.required).toBeTruthy();
            expect(cityInputField.hasError('pattern')).toBeFalsy();
            expect(requiredCityMsg.nativeElement).toBeDefined();

            expect(stateInputField.errors.required).toBeTruthy();
            expect(stateInputField.hasError('pattern')).toBeFalsy();
            expect(requiredStateMsg.nativeElement).toBeDefined();

            expect(zipCodeInputField.errors.required).toBeTruthy();
            expect(zipCodeInputField.hasError('pattern')).toBeFalsy();
            expect(requiredZipCodeMsg.nativeElement).toBeDefined();

            expect(useMailingAddressCheckbox.checked).toBeFalsy();

            expect(mailingAddressOneInputField.errors.required).toBeTruthy();
            expect(mailingAddressOneInputField.hasError('maxlength')).toBeFalsy();
            expect(requiredMailingAddressOneMsg.nativeElement).toBeDefined();

            expect(mailingCityInputField.errors.required).toBeTruthy();
            expect(mailingCityInputField.hasError('pattern')).toBeFalsy();
            expect(requiredMailingCityMsg.nativeElement).toBeDefined();

            expect(mailingStateInputField.errors.required).toBeTruthy();
            expect(mailingStateInputField.hasError('pattern')).toBeFalsy();
            expect(requiredMailingStateMsg.nativeElement).toBeDefined();

            expect(mailingZipCodeInputField.errors.required).toBeTruthy();
            expect(mailingZipCodeInputField.hasError('pattern')).toBeFalsy();
            expect(requiredMailingZipCodeMsg.nativeElement).toBeDefined();

            expect(component.addressInfoForm.valid).toBeFalsy();
            expect(component.mailingAddressForm.valid).toBeFalsy();
        });
    }));

    it('Should not show validation messages when the values are valid for both forms', waitForAsync(() => {
        fixture.whenStable().then(() => {
            addressOneInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.address1);
            addressOneInputField.markAsTouched();
            addressOneInputField.markAsDirty();
            fixture.detectChanges();

            addressTwoInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.address2);
            addressTwoInputField.markAsTouched();
            addressTwoInputField.markAsDirty();
            fixture.detectChanges();

            cityInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.city);
            cityInputField.markAsTouched();
            cityInputField.markAsDirty();
            fixture.detectChanges();

            stateInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.state);
            stateInputField.markAsTouched();
            stateInputField.markAsDirty();
            fixture.detectChanges();

            zipCodeInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.zipCode);
            zipCodeInputField.markAsTouched();
            zipCodeInputField.markAsDirty();
            fixture.detectChanges();

            mailingAddressOneInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.address1);
            mailingAddressOneInputField.markAsTouched();
            mailingAddressOneInputField.markAsDirty();
            fixture.detectChanges();

            mailingAddressTwoInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.address2);
            mailingAddressTwoInputField.markAsTouched();
            mailingAddressTwoInputField.markAsDirty();
            fixture.detectChanges();


            mailingCityInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.city);
            mailingCityInputField.markAsTouched();
            mailingCityInputField.markAsDirty();
            fixture.detectChanges();

            mailingStateInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.state);
            mailingStateInputField.markAsTouched();
            mailingStateInputField.markAsDirty();
            fixture.detectChanges();

            mailingZipCodeInputField.setValue(ACP_MOCKS.VALID_ADDRESS_INFO.zipCode);
            mailingZipCodeInputField.markAsTouched();
            mailingZipCodeInputField.markAsDirty();
            fixture.detectChanges();

            expect(addressOneInputField.hasError('maxlength')).toBeFalsy();
            expect(addressTwoInputField.hasError('maxlength')).toBeFalsy();
            expect(cityInputField.hasError('pattern')).toBeFalsy();
            expect(stateInputField.hasError('pattern')).toBeFalsy();
            expect(zipCodeInputField.hasError('pattern')).toBeFalsy();

            expect(mailingAddressOneInputField.hasError('maxlength')).toBeFalsy();
            expect(mailingAddressTwoInputField.hasError('maxlength')).toBeFalsy();
            expect(mailingCityInputField.hasError('pattern')).toBeFalsy();
            expect(mailingStateInputField.hasError('pattern')).toBeFalsy();
            expect(mailingZipCodeInputField.hasError('pattern')).toBeFalsy();

            expect(component.addressInfoForm.errors).toBeNull();
            expect(component.mailingAddressForm.errors).toBeNull();
        });
    }));

    it('Should check that the mailing and physical address are not empty when there is a primary and mailing address already sent from main component', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.primary = ACP_MOCKS.VALID_ADDRESS_INFO;
            component.mailing = ACP_MOCKS.VALID_ADDRESS_INFO;
            component.populateForms();
            fixture.detectChanges();

            const mailingAddressForm = fixture.nativeElement.querySelector('#mailingAddressForm');
            const physicalAddressForm = fixture.nativeElement.querySelector('#addressInfoForm');

            expect(mailingAddressForm).toBeDefined();
            expect(physicalAddressForm).toBeDefined();

            expect(component.addressInfoForm.controls.address1.value).toEqual(ACP_MOCKS.VALID_ADDRESS_INFO.address1);
            expect(component.addressInfoForm.controls.city.value).toEqual(ACP_MOCKS.VALID_ADDRESS_INFO.city);
            expect(component.addressInfoForm.controls.state.value).toEqual(ACP_MOCKS.VALID_ADDRESS_INFO.state);
            expect(component.addressInfoForm.controls.zipCode.value).toEqual(ACP_MOCKS.VALID_ADDRESS_INFO.zipCode);

            // Mailing address expectation
            expect(component.mailingAddressForm.controls.address1.value).toEqual(ACP_MOCKS.VALID_ADDRESS_INFO.address1);
            expect(component.mailingAddressForm.controls.city.value).toEqual(ACP_MOCKS.VALID_ADDRESS_INFO.city);
            expect(component.mailingAddressForm.controls.state.value).toEqual(ACP_MOCKS.VALID_ADDRESS_INFO.state);
            expect(component.mailingAddressForm.controls.zipCode.value).toEqual(ACP_MOCKS.VALID_ADDRESS_INFO.zipCode);

        });
    }));
    
    it('Should check that the forms is disabled when disable property is set to true', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.disable = true;
            component.ngOnChanges({ disable: new SimpleChange(null, true, true) });
            fixture.detectChanges();

            expect(component.addressInfoForm.disabled).toBe(true);
            expect(component.mailingAddressForm.disabled).toBe(true);
        });
    }));
});
