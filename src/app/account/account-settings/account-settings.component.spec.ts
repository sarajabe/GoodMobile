import { HttpHandler, HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EndpointUrl, ZMP_G2G_BFF_ENDPOINT_URL } from '@ztarmobile/zwp-service';
import { AuthHttp } from '@ztarmobile/zwp-services-auth';
import { ToastrModule } from 'ngx-toastr';
import { ENV_FIREBASE_CONFIG } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { AddressLookupComponent } from 'src/widgets/address-lookup/address-lookup.component';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';
import { ExpirationDateFormatPipe } from 'src/widgets/pipes/expiration-date-format.pipe';
import { SimpleDateFormatPipe } from 'src/widgets/pipes/simple-date-format.pipe';
import { AccountSettingsComponent } from './account-settings.component';
describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let component2: AddressLookupComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let fixture2: ComponentFixture<AddressLookupComponent>;
  let aliasInput;
  let aliasInput2;
  let addressLookupInput;
  let address2Input;
  let billingCityInput;
  let billingStateInput;
  let billingPostalInput;
  let countryInput;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSettingsComponent, UiBlockButtonDirective, ExpirationDateFormatPipe, AddressLookupComponent],
      imports: [
        AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatAutocompleteModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: ModalHelperService },
        { provide: EndpointUrl },
        HttpHandler,
        HttpClient,
        AuthHttp,
        { provide: ZMP_G2G_BFF_ENDPOINT_URL },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture2 = TestBed.createComponent(AddressLookupComponent);
    component2 = fixture2.componentInstance;
    fixture.detectChanges();
    aliasInput = component.billingAddressForm.controls.alias;
    aliasInput2 = component2.addressFieldsForm.controls.alias;
    addressLookupInput = component2.addressFieldsForm.controls.address1;
    address2Input = component2.addressFieldsForm.controls.address2;
    billingCityInput = component2.addressFieldsForm.controls.city;
    billingStateInput = component2.addressFieldsForm.controls.state;
    billingPostalInput = component2.addressFieldsForm.controls.postalCode;
    countryInput = component2.addressFieldsForm.controls.country;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should check initial form values for add new address', () => {
    component.showShippingAddress = true;
    fixture.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('#save-address-button'));
    fixture2.detectChanges();
    fixture.detectChanges();
    expect(aliasInput.pristine).toBeTruthy();
    expect(addressLookupInput.pristine).toBeTruthy();
    expect(address2Input.pristine).toBeTruthy();
    expect(billingCityInput.pristine).toBeTruthy();
    expect(billingStateInput.pristine).toBeTruthy();
    expect(billingPostalInput.pristine).toBeTruthy();
    expect(submitBtn.nativeElement.disabled).toBeTruthy();
    expect(component.billingAddressForm.valid).toBeFalsy();
    expect(component.billingAddressForm.status).toBeTruthy();
  });
  it('Should show required validation messages when values are empty for add billing address form', () => {
    component.showShippingAddress = true;
    fixture.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('#save-address-button')).nativeElement;
    addressLookupInput = component2.addressFieldsForm.controls.address1;
    address2Input = component2.addressFieldsForm.controls.address2;
    billingCityInput = component2.addressFieldsForm.controls.city;
    billingStateInput = component2.addressFieldsForm.controls.state;
    billingPostalInput = component2.addressFieldsForm.controls.postalCode;
    countryInput = component2.addressFieldsForm.controls.country;
    fixture.detectChanges();
    fixture2.detectChanges();
    aliasInput.setValue('');
    aliasInput.markAsTouched();
    fixture.detectChanges();
    addressLookupInput.setValue('');
    addressLookupInput.markAsTouched();
    fixture2.detectChanges();
    address2Input.setValue('');
    address2Input.markAsTouched();
    fixture2.detectChanges();
    billingCityInput.setValue('');
    billingCityInput.markAsTouched();
    fixture2.detectChanges();
    billingStateInput.setValue('');
    billingStateInput.markAsTouched();
    fixture2.detectChanges();
    billingPostalInput.setValue('');
    billingPostalInput.markAsTouched();
    fixture.detectChanges();
    fixture2.detectChanges();
    const requiredaliasMsg = fixture.debugElement.query(By.css('#required-alias-msg')).nativeElement;
    const requiredAddressLookupMsg = fixture2.debugElement.query(By.css('#billingAddress-msg')).nativeElement;
    const requiredCityMsg = fixture2.debugElement.query(By.css('#city-msg')).nativeElement;
    const requiredStateMsg = fixture2.debugElement.query(By.css('#state-msg')).nativeElement;
    const requiredPostalCodeMsg = fixture2.debugElement.query(By.css('#postalCode-msg')).nativeElement;
    fixture.detectChanges();
    fixture2.detectChanges();
    expect(submitBtn.disabled).toBeTruthy();
    expect(requiredaliasMsg).toBeDefined();
    expect(requiredAddressLookupMsg).toBeDefined();
    expect(requiredCityMsg).toBeDefined();
    expect(requiredStateMsg).toBeDefined();
    expect(requiredPostalCodeMsg).toBeDefined();
  });
  it('Should show invalid validation messages when values are not valid for add billing address form', () => {
    component.showShippingAddress = true;
    fixture.detectChanges();
    fixture2.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('#save-address-button')).nativeElement;
    billingCityInput = component2.addressFieldsForm.controls.city;
    billingStateInput = component2.addressFieldsForm.controls.state;
    billingPostalInput = component2.addressFieldsForm.controls.postalCode;
    fixture.detectChanges();
    fixture2.detectChanges();
    billingCityInput.setValue('Irbid&Amman');
    billingCityInput.markAsTouched();
    billingCityInput.markAsDirty();
    fixture2.detectChanges();
    billingStateInput.setValue('A2');
    billingStateInput.markAsTouched();
    billingStateInput.markAsDirty();
    fixture2.detectChanges();
    billingPostalInput.setValue('1234');
    billingPostalInput.markAsTouched();
    billingPostalInput.markAsDirty();
    fixture.detectChanges();
    fixture2.detectChanges();
    const invalidCityMsg = fixture2.debugElement.query(By.css('#city-invalid-msg')).nativeElement;
    const invalidStateMsg = fixture2.debugElement.query(By.css('#state-invalid-msg')).nativeElement;
    const invalidPostalCodeMsg = fixture2.debugElement.query(By.css('#postalCode-invalid-msg')).nativeElement;
    fixture.detectChanges();
    fixture2.detectChanges();
    expect(submitBtn.disabled).toBeTruthy();
    expect(invalidCityMsg).toBeDefined();
    expect(invalidStateMsg).toBeDefined();
    expect(invalidPostalCodeMsg).toBeDefined();
  });
  it('should submit and call save address when VALID cardinals are inserted in add billing address form', () => {
    component.showShippingAddress = true;
    fixture.detectChanges();
    fixture2.detectChanges();
    aliasInput = component.billingAddressForm.controls.alias;
    aliasInput2 = component2.addressFieldsForm.controls.alias;
    addressLookupInput = component2.addressFieldsForm.controls.address1;
    address2Input = component2.addressFieldsForm.controls.address2;
    billingCityInput = component2.addressFieldsForm.controls.city;
    billingStateInput = component2.addressFieldsForm.controls.state;
    billingPostalInput = component2.addressFieldsForm.controls.postalCode;
    countryInput = component2.addressFieldsForm.controls.country;
    fixture.detectChanges();
    fixture2.detectChanges();
    spyOn(component, 'saveAddress');
    fixture.detectChanges();
    fixture2.detectChanges();
    aliasInput.setValue('Ztar Mobile');
    aliasInput.markAsTouched();
    aliasInput.markAsDirty();
    fixture.detectChanges();
    aliasInput2.setValue('Ztar Mobile');
    aliasInput2.markAsTouched();
    aliasInput2.markAsDirty();
    fixture.detectChanges();
    addressLookupInput.setValue('Route 66');
    addressLookupInput.markAsTouched();
    addressLookupInput.markAsDirty();
    fixture2.detectChanges();
    fixture.detectChanges();
    address2Input.setValue('rash');
    address2Input.markAsTouched();
    address2Input.markAsDirty();
    fixture2.detectChanges();
    fixture.detectChanges();
    billingCityInput.setValue('Anaheim');
    billingCityInput.markAsTouched();
    billingCityInput.markAsDirty();
    fixture2.detectChanges();
    fixture.detectChanges();
    billingStateInput.setValue('CA');
    billingStateInput.markAsTouched();
    billingStateInput.markAsDirty();
    fixture2.detectChanges();
    fixture.detectChanges();
    billingPostalInput.setValue('92802');
    billingPostalInput.markAsTouched();
    billingPostalInput.markAsDirty();
    fixture.detectChanges();
    fixture2.detectChanges();
    countryInput.setValue('USA');
    countryInput.markAsTouched();
    countryInput.markAsDirty();
    fixture.detectChanges();
    fixture2.detectChanges();
    component.isValidAddress = true;
    component.captchaValid = true;
    component.isValidShippingAddress = true;
    fixture.detectChanges();
    fixture2.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('#save-address-button')).nativeElement;
    fixture.detectChanges();
    fixture2.detectChanges();
    submitBtn.click();
    fixture.detectChanges();
    fixture2.detectChanges();
    expect(submitBtn.disabled).toBeFalsy();
    expect(component.saveAddress).toHaveBeenCalled();
    expect(component2.addressFieldsForm.valid).toBeTruthy();
    expect(component.billingAddressForm.valid).toBeTruthy();
  });
});
