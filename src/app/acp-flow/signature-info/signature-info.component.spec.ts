import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignatureInfoComponent } from './signature-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppState } from 'src/app/app.service';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { EbbManager } from 'src/services/ebb.service';
import { FirebaseUserProfileService } from '@ztarmobile/zwp-service-backend';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ACP_MOCKS } from 'src/mocks';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('Signature Information Component - Unit Testing', () => {
  let component: SignatureInfoComponent;
  let fixture: ComponentFixture<SignatureInfoComponent>;

  let firstCheckInputField;
  let secondCheckInputField;
  let thirdCheckInputField;
  let fourthCheckInputField;
  let nameInputField;
  let fullName;

  let mockEbbService;

  beforeEach(async () => {
    mockEbbService = jasmine.createSpyObj(['EBBService', 'getActiveInternalApplication', 'getACPApplicationStatus']);
    await TestBed.configureTestingModule({
      declarations: [SignatureInfoComponent],
      imports: [FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [{ provide: AppState }, { provide: EbbService }, { provide: EbbManager },
      { provide: FirebaseUserProfileService, useValue: AngularFireDatabase }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    TestBed.overrideProvider(EbbService, { useValue: mockEbbService });
    TestBed.compileComponents();

    fixture = TestBed.createComponent(SignatureInfoComponent);
    component = fixture.componentInstance;

    component.fName = ACP_MOCKS.SIGNATURE_INFO.fName;
    component.lName = ACP_MOCKS.SIGNATURE_INFO.lName;
    fullName = `${ACP_MOCKS.SIGNATURE_INFO.fName} ${ACP_MOCKS.SIGNATURE_INFO.lName}`;
    component.fullName = fullName;

    fixture.detectChanges();

    firstCheckInputField = component.signatureForm.controls.firstCheck;
    secondCheckInputField = component.signatureForm.controls.secondCheck;
    thirdCheckInputField = component.signatureForm.controls.thirdCheck;
    fourthCheckInputField = component.signatureForm.controls.forthCheck;
    nameInputField = component.signatureForm.controls.name;

    fixture.detectChanges();

  });

  it('should create a component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('Test a form group element count', waitForAsync(() => {
    const formElement = fixture.nativeElement.querySelector('form');
    const inputElements = formElement.querySelectorAll('input');

    expect(inputElements.length).toEqual(5);
  }));

  it('Should show a validation messages for the required elements when the values are empty', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue('');
      secondCheckInputField.setValue('');
      thirdCheckInputField.setValue('');
      fourthCheckInputField.setValue('');
      nameInputField.setValue('');

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));

      expect(firstCheckInputField.errors.required).toBeTruthy();
      expect(secondCheckInputField.errors.required).toBeTruthy();
      expect(thirdCheckInputField.errors.required).toBeTruthy();
      expect(fourthCheckInputField.errors.required).toBeTruthy();
      expect(nameInputField.errors.required).toBeTruthy();

      expect(requiredConsentsMsg.nativeElement).toBeDefined();
      expect(requiredFullNameMsg.nativeElement).toBeDefined();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show a required validation message for initials incase all elements are valid except firstCheck is empty and the invalid error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue('');
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue(fullName);

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));

      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors.required).toBeTruthy();
      expect(firstCheckInputField.errors.pattern).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg.nativeElement).toBeDefined();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg).toBeFalsy();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show a required validation message for initials incase all elements are valid except secondCheck is empty and the invalid error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue('');
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue(fullName);

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors.required).toBeTruthy();
      expect(secondCheckInputField.errors.pattern).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg.nativeElement).toBeDefined();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg).toBeFalsy();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show a required validation message for initials incase all elements are valid except thirdCheck is empty and the invalid error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue('');
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue(fullName);

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors.required).toBeTruthy();
      expect(thirdCheckInputField.errors.pattern).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg.nativeElement).toBeDefined();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg).toBeFalsy();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show a required validation message for initials incase all elements are valid except fourthCheck is empty and the invalid error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue('');
      nameInputField.setValue(fullName);

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors.required).toBeTruthy();
      expect(fourthCheckInputField.errors.pattern).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg.nativeElement).toBeDefined();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg).toBeFalsy();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show a required validation message for fullname incase all elements are valid except fullname is empty and the invalid error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue('');

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors.required).toBeTruthy();
      expect(nameInputField.errors.pattern).toBeFalsy();

      expect(requiredConsentsMsg).toBeFalsy();
      expect(requiredFullNameMsg.nativeElement).toBeDefined();
      expect(invalidConsentsMsg).toBeFalsy();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show an invalid validation message for initals incase all elements are valid except firstCheck is invalid and the required error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.invalidConsent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue(fullName);

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors.pattern).toBeTruthy();
      expect(firstCheckInputField.errors.required).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg).toBeFalsy();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg.nativeElement).toBeDefined();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show an invalid validation message for initals incase all elements are valid except secondCheck is invalid and the required error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.invalidConsent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue(fullName);

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors.pattern).toBeTruthy();
      expect(secondCheckInputField.errors.required).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg).toBeFalsy();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg.nativeElement).toBeDefined();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show an invalid validation message for initals incase all elements are valid except thirdCheck is invalid and the required error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.invalidConsent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue(fullName);

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors.pattern).toBeTruthy();
      expect(thirdCheckInputField.errors.required).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg).toBeFalsy();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg.nativeElement).toBeDefined();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show an invalid validation message for initals incase all elements are valid except fourthCheck is invalid and the required error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.invalidConsent);
      nameInputField.setValue(fullName);

      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors.pattern).toBeTruthy();
      expect(fourthCheckInputField.errors.required).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg).toBeFalsy();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg.nativeElement).toBeDefined();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should show an invalid validation message for fullname incase all elements are valid except fullname is invalid and the required error msg are not appears', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.wrongName);
      // mark the form as touched
      component.signatureForm.markAllAsTouched();
      component.matchingFullName(fullName, 'name');

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();
      expect(component.signatureForm.hasError('mismatchedFullName')).toBeTruthy();

      expect(requiredConsentsMsg).toBeFalsy();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg).toBeFalsy();
      expect(invalidFullNameMsg.nativeElement).toBeDefined();

      expect(component.signatureForm.valid).toBeFalsy();
    });
  }));

  it('Should not show any validation msgs when all values are set correctly', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // setting empty values
      firstCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      secondCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      thirdCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      fourthCheckInputField.setValue(ACP_MOCKS.SIGNATURE_INFO.consent);
      nameInputField.setValue(fullName);
      // mark the form as touched
      component.signatureForm.markAllAsTouched();

      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));
      const invalidConsentsMsg = fixture.debugElement.query(By.css('#consent-invalid-msg'));
      const invalidFullNameMsg = fixture.debugElement.query(By.css('#fullname-invalid-msg'));

      expect(firstCheckInputField.errors).toBeFalsy();
      expect(secondCheckInputField.errors).toBeFalsy();
      expect(thirdCheckInputField.errors).toBeFalsy();
      expect(fourthCheckInputField.errors).toBeFalsy();
      expect(nameInputField.errors).toBeFalsy();

      expect(requiredConsentsMsg).toBeFalsy();
      expect(requiredFullNameMsg).toBeFalsy();
      expect(invalidConsentsMsg).toBeFalsy();
      expect(invalidFullNameMsg).toBeFalsy();

      expect(component.signatureForm.valid).toBeTruthy();
    });
  }));

  it('Should check if signed property is sent then the initials should be all set correctly and disbaled', waitForAsync(() => {
    fixture.whenStable().then(() => {
      component.signed = true;
      component.ngOnInit();
      fixture.detectChanges();

      component.signatureForm.markAllAsTouched();
      fixture.detectChanges();

      const requiredConsentsMsg = fixture.debugElement.query(By.css('#consent-required-msg'));
      const requiredFullNameMsg = fixture.debugElement.query(By.css('#fullname-required-msg'));

      expect(requiredConsentsMsg).toBeFalsy();
      expect(requiredFullNameMsg).toBeFalsy();

      expect(component.signatureForm.controls.firstCheck.value).toEqual(ACP_MOCKS.SIGNATURE_INFO.consent);
      expect(component.signatureForm.controls.firstCheck.disabled).toBeTruthy();
      expect(component.signatureForm.controls.secondCheck.value).toEqual(ACP_MOCKS.SIGNATURE_INFO.consent);
      expect(component.signatureForm.controls.secondCheck.disabled).toBeTruthy();
      expect(component.signatureForm.controls.thirdCheck.value).toEqual(ACP_MOCKS.SIGNATURE_INFO.consent);
      expect(component.signatureForm.controls.thirdCheck.disabled).toBeTruthy();
      expect(component.signatureForm.controls.forthCheck.value).toEqual(ACP_MOCKS.SIGNATURE_INFO.consent);
      expect(component.signatureForm.controls.forthCheck.disabled).toBeTruthy();

    });
  }));
});
