import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsAnalyticsService, FirebaseUserProfileService, PlacesAutocompleteService } from '@ztarmobile/zwp-service-backend';
import { AddressInfoComponent } from './address-info.component';
import { InjectionToken } from '@angular/core';
import { IGoogleTagManagerEventsConfig } from '@ztarmobile/zwp-service';
import { AppState } from 'src/app/app.service';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
            addressOneInputField.setValue('60284029840297492479274072047892047207429472984792847928749879274927492749274');
            addressOneInputField.markAsTouched();
            addressOneInputField.markAsDirty();
            fixture.detectChanges();

            addressTwoInputField.setValue('60284029840297492479274072047892047207429472984792847928749879274927492749274');
            addressTwoInputField.markAsTouched();
            addressTwoInputField.markAsDirty();
            fixture.detectChanges();

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

            mailingAddressOneInputField.setValue('60284029840297492479274072047892047207429472984792847928749879274927492749274');
            mailingAddressOneInputField.markAsTouched();
            mailingAddressOneInputField.markAsDirty();
            fixture.detectChanges();

            mailingAddressTwoInputField.setValue('60284029840297492479274072047892047207429472984792847928749879274927492749274');
            mailingAddressTwoInputField.markAsTouched();
            mailingAddressTwoInputField.markAsDirty();
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

    it('Should not show validation messages when the values are valid for both forms', waitForAsync(() => {
        fixture.whenStable().then(() => {
            addressOneInputField.setValue('123 dallas texas');
            addressOneInputField.markAsTouched();
            addressOneInputField.markAsDirty();
            fixture.detectChanges();

            addressTwoInputField.setValue('123');
            addressTwoInputField.markAsTouched();
            addressTwoInputField.markAsDirty();
            fixture.detectChanges();

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

            mailingAddressOneInputField.setValue('123 dallas texas');
            mailingAddressOneInputField.markAsTouched();
            mailingAddressOneInputField.markAsDirty();
            fixture.detectChanges();

            mailingAddressTwoInputField.setValue('602');
            mailingAddressTwoInputField.markAsTouched();
            mailingAddressTwoInputField.markAsDirty();
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
});
