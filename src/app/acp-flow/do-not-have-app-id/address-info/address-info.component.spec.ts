import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsAnalyticsService, FirebaseUserProfileService, PlacesAutocompleteService } from '@ztarmobile/zwp-service-backend';
import { AddressInfoNonAppExisitngComponent } from './address-info.component';
import { InjectionToken, SimpleChange } from '@angular/core';
import { IGoogleTagManagerEventsConfig } from '@ztarmobile/zwp-service';
import { AppState } from 'src/app/app.service';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ACP_MOCKS } from 'src/mocks';

let component: AddressInfoNonAppExisitngComponent;
let fixture: ComponentFixture<AddressInfoNonAppExisitngComponent>;

let addressOneInputField;
let addressTwoInputField;
let cityInputField;
let stateInputField;
let zipCodeInputField;

let mockAnalyticService;
let mockPlacesAutocompleteService;
let mockEbbService;
let mockFirebaseUserProfileService;

describe('Yes flow - without app id- EBB Address Info Component - Unit Testing', async () => {
  beforeEach(async () => {
    mockEbbService = jasmine.createSpy('EBBService');
    mockFirebaseUserProfileService = jasmine.createSpy('FirebaseUserProfileService');
    mockAnalyticService = jasmine.createSpyObj(['ActionsAnalyticsService', 'trackACPEvent']);
    mockPlacesAutocompleteService = jasmine.createSpyObj(['PlacesAutocompleteService', 'findAddress', 'findDetailedAddressFields']);

    await TestBed.configureTestingModule({
      declarations: [
        AddressInfoNonAppExisitngComponent
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

    fixture = TestBed.createComponent(AddressInfoNonAppExisitngComponent);
    component = fixture.componentInstance;

    addressOneInputField = component.addressInfoForm.controls.address1;
    addressTwoInputField = component.addressInfoForm.controls.address2;
    cityInputField = component.addressInfoForm.controls.city;
    stateInputField = component.addressInfoForm.controls.state;
    zipCodeInputField = component.addressInfoForm.controls.zipCode;

    fixture.detectChanges();
  });

  it('Should create a component successfully', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('Should test a form group element count', waitForAsync(() => {
    const addressInfoFormElement = fixture.nativeElement.querySelector('#addressInfoForm');
    const addressInfoInputElements = addressInfoFormElement.querySelectorAll('input');

    expect(addressInfoInputElements.length).toEqual(5);
  }));

  it('Should covers the initial state for the address form', waitForAsync(() => {
    fixture.whenStable().then(() => {
      const addressInfoForm = fixture.nativeElement.querySelector('#addressInfoForm');
      expect(addressInfoForm).toBeDefined();
    });
  }));

  it('Should show validation messages for the required elements when the values are empty for the address form', waitForAsync(() => {
    fixture.whenStable().then(() => {

      addressOneInputField.markAsTouched();
      cityInputField.markAsTouched();
      stateInputField.markAsTouched();
      zipCodeInputField.markAsTouched();
      fixture.detectChanges();

      const requiredAddressOneMsg = fixture.debugElement.query(By.css('#required-address-one-msg'));
      const requiredCityMsg = fixture.debugElement.query(By.css('#required-city-msg'));
      const requiredStateMsg = fixture.debugElement.query(By.css('#required-state-msg'));
      const requiredZipCodeMsg = fixture.debugElement.query(By.css('#required-zipcode-msg'));

      expect(addressOneInputField.errors.required).toBeTruthy();
      expect(requiredAddressOneMsg.nativeElement).toBeDefined();

      expect(cityInputField.errors.required).toBeTruthy();
      expect(requiredCityMsg.nativeElement).toBeDefined();

      expect(stateInputField.errors.required).toBeTruthy();
      expect(requiredStateMsg.nativeElement).toBeDefined();

      expect(zipCodeInputField.errors.required).toBeTruthy();
      expect(requiredZipCodeMsg.nativeElement).toBeDefined();

      expect(component.addressInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should show validation messages when the values are invalid for the address form', waitForAsync(() => {
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

      const invalidCityMsg = fixture.debugElement.query(By.css('#invalid-city-msg'));
      const invalidStateMsg = fixture.debugElement.query(By.css('#invalid-state-msg'));
      const invalidZipCodeMsg = fixture.debugElement.query(By.css('#invalid-zipcode-msg'));

      expect(addressOneInputField.hasError('maxlength')).toBeTruthy();
      expect(addressTwoInputField.hasError('maxlength')).toBeTruthy();

      expect(cityInputField.hasError('pattern')).toBeTruthy();
      expect(invalidCityMsg.nativeElement).toBeDefined();

      expect(stateInputField.hasError('pattern')).toBeTruthy();
      expect(invalidStateMsg.nativeElement).toBeDefined();

      expect(zipCodeInputField.hasError('pattern')).toBeTruthy();
      expect(invalidZipCodeMsg.nativeElement).toBeDefined();

      expect(component.addressInfoForm.valid).toBeFalsy();
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

      const invalidCityMsg = fixture.debugElement.query(By.css('#invalid-city-msg'));
      const invalidStateMsg = fixture.debugElement.query(By.css('#invalid-state-msg'));
      const invalidZipCodeMsg = fixture.debugElement.query(By.css('#invalid-zipcode-msg'));

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

      expect(component.addressInfoForm.valid).toBeFalsy();

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

      const requiredAddressOneMsg = fixture.debugElement.query(By.css('#required-address-one-msg'));
      const requiredCityMsg = fixture.debugElement.query(By.css('#required-city-msg'));
      const requiredStateMsg = fixture.debugElement.query(By.css('#required-state-msg'));
      const requiredZipCodeMsg = fixture.debugElement.query(By.css('#required-zipcode-msg'));

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

      expect(component.addressInfoForm.valid).toBeFalsy();
    });
  }));

  it('Should not show validation messages when the values are valid for the address form', waitForAsync(() => {
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

      expect(addressOneInputField.hasError('maxlength')).toBeFalsy();
      expect(addressTwoInputField.hasError('maxlength')).toBeFalsy();
      expect(cityInputField.hasError('pattern')).toBeFalsy();
      expect(stateInputField.hasError('pattern')).toBeFalsy();
      expect(zipCodeInputField.hasError('pattern')).toBeFalsy();

      expect(component.addressInfoForm.errors).toBeNull();
    });
  }));
  it('Should check that the form is disabled when disable property is set to true', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.disable = true;
      component.ngOnChanges({ disable: new SimpleChange(null, true, true) });
      fixture.detectChanges();

      expect(component.addressInfoForm.disabled).toBe(true);
    });
  }));
});
