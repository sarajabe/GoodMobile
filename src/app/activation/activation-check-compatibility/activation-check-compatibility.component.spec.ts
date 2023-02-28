import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { FirebaseUserProfileService, MobileCustomPlansService, UserDeviceService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';
import { ActivationCheckCompatibilityComponent } from './activation-check-compatibility.component';

let component: ActivationCheckCompatibilityComponent;
let fixture: ComponentFixture<ActivationCheckCompatibilityComponent>;

let mockMobileCustomPlansService;
let mockSimpleAuthService;
let mockFirebaseUserProfileService;

let equipmentNumberInputField: AbstractControl;
let zipCodeInputField: AbstractControl;

describe('Activation Check Compatibility - Unit Test', async () => {
  const CART_OBJECT = { cart: true };
  const AUTH_STATE_OBJECT = { authState: true };
  const USER_OBJECT = { user: true };

  @Component({ selector: 'app-re-captcha', template: '' })
  class MockRecaptchaComponent { }
  beforeEach(async () => {
    mockSimpleAuthService = jasmine.createSpyObj(['SimpleAuthService', 'userState']);
    mockMobileCustomPlansService = jasmine.createSpyObj(['MobileCustomPlansService', 'currentPlan']);
    mockFirebaseUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
    await TestBed.configureTestingModule({
      declarations: [ActivationCheckCompatibilityComponent,
        UiBlockButtonDirective,
        MockRecaptchaComponent],
      imports: [FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
        ],
      providers: [{ provide: UserDeviceService },
      { provide: UserPlansService },
        SimpleAuthService,
        MobileCustomPlansService,
        NgForm,
      { provide: FirebaseUserProfileService },
      { provide: ToastrService, useValue: ToastrService },
      { provide: ModalHelperService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    TestBed.overrideProvider(SimpleAuthService, { useValue: mockSimpleAuthService });
    TestBed.overrideProvider(MobileCustomPlansService, { useValue: mockMobileCustomPlansService });
    TestBed.overrideProvider(FirebaseUserProfileService, { useValue: mockFirebaseUserProfileService });
    TestBed.compileComponents();
  });
  beforeEach(async () => {
    fixture = TestBed.createComponent(ActivationCheckCompatibilityComponent);
    component = fixture.componentInstance;
    spyOn(component.router, 'navigate');
    mockSimpleAuthService.userState.and.returnValue(AUTH_STATE_OBJECT);
    mockSimpleAuthService.userState = of(true);

    mockMobileCustomPlansService.currentPlan.and.returnValue(CART_OBJECT);
    mockMobileCustomPlansService.currentPlan = of(true);

    mockFirebaseUserProfileService.userProfileObservable.and.returnValue(USER_OBJECT);
    mockFirebaseUserProfileService.userProfileObservable = of(true);

    component.captchaValid = true;
    component.SITE_ID = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

    fixture.detectChanges();
  });

  it('Should check that component is created', () => {
    expect(component).toBeTruthy();
  });

  it('Should check the form group element count', () => {
    const formElement = fixture.nativeElement.querySelector('form');
    const inputElements = formElement.querySelectorAll('input');
    expect(inputElements.length).toEqual(2);
  });

  it('Should check initial form values for check compatibility form group', () => {
    const ccFormEquipment = component.equipment;
    const ccFormZipCode = component.zipCode;
    const loginFormValues = {
      equipment: '',
      zipCode: '',
    };
    expect(ccFormEquipment).toEqual(loginFormValues.equipment);
    expect(ccFormZipCode).toEqual(loginFormValues.zipCode);
  });

  it('Should show validation messages when values are empty', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      equipmentNumberInputField = component.compatibilityForm.controls.equipmentNumber;
      zipCodeInputField = component.compatibilityForm.controls.zipCodeRef;

      fixture.detectChanges();

      equipmentNumberInputField.setValue('');
      equipmentNumberInputField.markAsTouched();

      zipCodeInputField.setValue('');
      zipCodeInputField.markAsTouched();
      fixture.detectChanges();

      const requiredEquipmentNumberMsg = fixture.debugElement.query(By.css('#required-equipment-msg'));
      const requiredZipCodeMsg = fixture.debugElement.query(By.css('#required-zip-code-label'));

      expect(equipmentNumberInputField.errors.required).toBeTruthy();
      expect(requiredEquipmentNumberMsg.nativeElement).toBeDefined();

      expect(zipCodeInputField.errors.required).toBeTruthy();
      expect(requiredZipCodeMsg.nativeElement).toBeDefined();

      expect(component.compatibilityForm.valid).toBeFalsy();
    });
  }));

  it('Should check valid equipment number and valid zipcode', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      equipmentNumberInputField = component.compatibilityForm.controls.equipmentNumber;
      zipCodeInputField = component.compatibilityForm.controls.zipCodeRef;

      fixture.detectChanges();

      equipmentNumberInputField.setValue('353260073063169');
      equipmentNumberInputField.markAsTouched();
      equipmentNumberInputField.markAsDirty();
      fixture.detectChanges();

      zipCodeInputField.setValue('73301');
      zipCodeInputField.markAsTouched();
      zipCodeInputField.markAsDirty();
      fixture.detectChanges();

      spyOn(component, 'resolvedCaptcha');
      const captchaClick: DebugElement = fixture.debugElement.query(By.css('#captcha-box'));
      captchaClick.nativeElement.click();
      fixture.detectChanges();

      spyOn(component, 'checkPhoneCompatibility');
      const checkPhoneBtn: DebugElement = fixture.debugElement.query(By.css('#check-phone-button'));
      checkPhoneBtn.nativeElement.click();
      fixture.detectChanges();

      expect(equipmentNumberInputField.errors).toBeNull();
      expect(zipCodeInputField.errors).toBeNull();

      expect(checkPhoneBtn.nativeElement.disabled).toBeFalsy();

      expect(component.checkPhoneCompatibility).toHaveBeenCalled();

      expect(component.compatibilityForm.valid).toBeTruthy();
    });
  }));

  it('Should check invalid equipment number and valid zipcode', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      equipmentNumberInputField = component.compatibilityForm.controls.equipmentNumber;
      zipCodeInputField = component.compatibilityForm.controls.zipCodeRef;

      fixture.detectChanges();

      equipmentNumberInputField.setValue('353260');
      equipmentNumberInputField.markAsTouched();
      equipmentNumberInputField.markAsDirty();
      fixture.detectChanges();

      zipCodeInputField.setValue('73301');
      zipCodeInputField.markAsTouched();
      zipCodeInputField.markAsDirty();
      fixture.detectChanges();

      spyOn(component, 'resolvedCaptcha');
      const captchaClick: DebugElement = fixture.debugElement.query(By.css('#captcha-box'));
      captchaClick.nativeElement.click();
      fixture.detectChanges();

      spyOn(component, 'checkPhoneCompatibility');
      const checkPhoneBtn: DebugElement = fixture.debugElement.query(By.css('#check-phone-button'));
      checkPhoneBtn.nativeElement.click();
      fixture.detectChanges();

      const invalidEquipmentNumberMsg = fixture.debugElement.query(By.css('#invalid-equipment-msg'));

      expect(equipmentNumberInputField.hasError('minlength')).toBeTruthy();
      expect(invalidEquipmentNumberMsg.nativeElement).toBeDefined();

      expect(zipCodeInputField.errors).toBeNull();

      expect(checkPhoneBtn.nativeElement.disabled).toBeTruthy();

      expect(component.checkPhoneCompatibility).toHaveBeenCalledTimes(0);

      expect(component.compatibilityForm.valid).toBeFalsy();
    });
  }));

  it('Should check valid equipment number and invalid zipcode', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      equipmentNumberInputField = component.compatibilityForm.controls.equipmentNumber;
      zipCodeInputField = component.compatibilityForm.controls.zipCodeRef;

      fixture.detectChanges();

      equipmentNumberInputField.setValue('353260073063169');
      equipmentNumberInputField.markAsTouched();
      equipmentNumberInputField.markAsDirty();
      fixture.detectChanges();

      zipCodeInputField.setValue('7');
      zipCodeInputField.markAsTouched();
      zipCodeInputField.markAsDirty();
      fixture.detectChanges();

      component.invalidZipCode = !(/^\d{5}(-\d{4})?$/.test('7'));

      spyOn(component, 'resolvedCaptcha');
      const captchaClick: DebugElement = fixture.debugElement.query(By.css('#captcha-box'));
      captchaClick.nativeElement.click();
      fixture.detectChanges();

      spyOn(component, 'checkPhoneCompatibility');
      const checkPhoneBtn: DebugElement = fixture.debugElement.query(By.css('#check-phone-button'));
      checkPhoneBtn.nativeElement.click();
      fixture.detectChanges();

      const invalidZipCodeMsg = fixture.debugElement.query(By.css('#invalid-zipcode-msg'));

      expect(equipmentNumberInputField.errors).toBeNull();

      expect(component.invalidZipCode).toBeTruthy();
      expect(invalidZipCodeMsg.nativeElement).toBeDefined();

      expect(checkPhoneBtn.nativeElement.disabled).toBeTruthy();

      expect(component.checkPhoneCompatibility).toHaveBeenCalledTimes(0);
    });
  }));

  it('Should check invalid equipment number and invalid zipcode', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      equipmentNumberInputField = component.compatibilityForm.controls.equipmentNumber;
      zipCodeInputField = component.compatibilityForm.controls.zipCodeRef;

      fixture.detectChanges();

      equipmentNumberInputField.setValue('35326');
      equipmentNumberInputField.markAsTouched();
      equipmentNumberInputField.markAsDirty();
      fixture.detectChanges();

      zipCodeInputField.setValue('7');
      zipCodeInputField.markAsTouched();
      zipCodeInputField.markAsDirty();
      fixture.detectChanges();

      component.invalidZipCode = !(/^\d{5}(-\d{4})?$/.test('7'));

      spyOn(component, 'resolvedCaptcha');
      const captchaClick: DebugElement = fixture.debugElement.query(By.css('#captcha-box'));
      captchaClick.nativeElement.click();
      fixture.detectChanges();

      spyOn(component, 'checkPhoneCompatibility');
      const checkPhoneBtn: DebugElement = fixture.debugElement.query(By.css('#check-phone-button'));
      checkPhoneBtn.nativeElement.click();
      fixture.detectChanges();

      const invalidEquipmentNumberMsg = fixture.debugElement.query(By.css('#invalid-equipment-msg'));
      const invalidZipCodeMsg = fixture.debugElement.query(By.css('#invalid-zipcode-msg'));

      expect(equipmentNumberInputField.hasError('minlength')).toBeTruthy();
      expect(invalidEquipmentNumberMsg.nativeElement).toBeDefined();

      expect(component.invalidZipCode).toBeTruthy();
      expect(invalidZipCodeMsg.nativeElement).toBeDefined();

      expect(checkPhoneBtn.nativeElement.disabled).toBeTruthy();

      expect(component.checkPhoneCompatibility).toHaveBeenCalledTimes(0);
    });
  }));
});
