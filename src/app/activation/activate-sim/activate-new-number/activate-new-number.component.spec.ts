import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointUrl } from '@ztarmobile/zwp-service';
import { ActionsAnalyticsService, IUserDevice, IUserPlan, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { CustomFormsModule } from 'ng4-validators';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';

import { ActivateNewNumberComponent } from './activate-new-number.component';

describe('ActivateNewNumberComponent', () => {
    let component: ActivateNewNumberComponent;
    let fixture: ComponentFixture<ActivateNewNumberComponent>;
    const USER_OBJECT = { config: true };
    let activationCodeInput;
    let postalCodeInput;
    let pinCodeInput;
    let pinCodeConfirmInput;
    let mockUserPlansService;
    beforeEach(async () => {
        mockUserPlansService = jasmine.createSpyObj(['UserPlansService', 'plansConf']);
        await TestBed.configureTestingModule({
            declarations: [ActivateNewNumberComponent,
                UiBlockButtonDirective,
            ],
            imports: [FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                CustomFormsModule],
            providers: [
                { provide: ToastrService, useValue: ToastrService },
                { provide: EndpointUrl },
                { provide: UserPlansService },
                { provide: UserAccountService },
                { provide: ModalHelperService },
                { provide: ActionsAnalyticsService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        TestBed.compileComponents();
        TestBed.overrideProvider(UserPlansService, { useValue: mockUserPlansService });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivateNewNumberComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');
        mockUserPlansService.plansConf.and.returnValue(USER_OBJECT);
        mockUserPlansService.plansConf = of(true);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Should show form group element count', () => {
        spyOn(component, 'activateNewNumber');
        const formElement = fixture.nativeElement.querySelector('form');
        const inputElements = formElement.querySelectorAll('input');
        expect(inputElements.length).toEqual(4);
    });
    it('Should show initial state of the form', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.userPlan = {} as IUserPlan;
            component.userPlan.planDevice = {} as IUserDevice;
            fixture.detectChanges();
            activationCodeInput = component.activateSimForm.controls['activationCode'];
            postalCodeInput = component.activateSimForm.controls['postalCode'];
            pinCodeInput = component.activateSimForm.controls['pinCode'];
            pinCodeConfirmInput = component.activateSimForm.controls['pinCodeConfirm'];
            spyOn(component, 'activateNewNumber');
            const submitBtn = fixture.debugElement.query(By.css('#activate-button'));
            fixture.detectChanges();
            const planDeviceValue = component.userPlan.planDevice.postalCode;
            fixture.detectChanges();
            postalCodeInput.setValue(planDeviceValue);
            postalCodeInput.markAsTouched();
            postalCodeInput.markAsDirty();
            fixture.detectChanges();
            expect(component.postalCode).toEqual(planDeviceValue);
            expect(pinCodeInput.dirty).toBeFalsy();
            expect(activationCodeInput.dirty).toBeFalsy();
            expect(pinCodeConfirmInput.dirty).toBeFalsy();
            expect(component.activateSimForm.valid).toBeFalsy();
            expect(submitBtn.nativeElement.disabled).toBeTruthy();
        });
    }));
    it('Should postal code should change based on the planDevice Value', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.userPlan = {} as IUserPlan;
            component.userPlan.planDevice = {} as IUserDevice;
            fixture.detectChanges();
            postalCodeInput = component.activateSimForm.controls['postalCode'];
            spyOn(component, 'activateNewNumber');
            fixture.detectChanges();
            const planDeviceValue = component.userPlan.planDevice.postalCode = '75201' as string;
            fixture.detectChanges();
            postalCodeInput.setValue(planDeviceValue);
            postalCodeInput.markAsTouched();
            postalCodeInput.markAsDirty();
            fixture.detectChanges();
            expect(component.postalCode).toEqual(planDeviceValue);
        });
    }));
    it('Should show required validation messages when values are empty', waitForAsync(() => {
        fixture.whenStable().then(() => {
            activationCodeInput = component.activateSimForm.controls['activationCode'];
            postalCodeInput = component.activateSimForm.controls['postalCode'];
            pinCodeInput = component.activateSimForm.controls['pinCode'];
            pinCodeConfirmInput = component.activateSimForm.controls['pinCodeConfirm'];
            spyOn(component, 'activateNewNumber');
            const submitBtn = fixture.debugElement.query(By.css('#activate-button'));
            fixture.detectChanges();
            activationCodeInput.setValue('');
            activationCodeInput.markAsTouched();
            fixture.detectChanges();
            postalCodeInput.setValue('');
            postalCodeInput.markAsTouched();
            fixture.detectChanges();
            pinCodeInput.setValue('');
            pinCodeInput.markAsTouched();
            fixture.detectChanges();
            const requiredActivationCodeMsg = fixture.debugElement.query(By.css('#required-activation-code-label')).nativeElement;
            const requiredPostalCodeMsg = fixture.debugElement.query(By.css('#required-postal-code-label')).nativeElement;
            const requiredPinNumberMsg = fixture.debugElement.query(By.css('#required-pin-label')).nativeElement;
            fixture.detectChanges();
            expect(requiredActivationCodeMsg).toBeDefined();
            expect(requiredPostalCodeMsg).toBeDefined();
            expect(requiredPinNumberMsg).toBeDefined();
            expect(activationCodeInput.dirty).toBeFalsy();
            expect(postalCodeInput.dirty).toBeFalsy();
            expect(pinCodeInput.dirty).toBeFalsy();
            expect(pinCodeConfirmInput.dirty).toBeFalsy();
            expect(component.activateSimForm.valid).toBeFalsy();
            expect(submitBtn.nativeElement.disabled).toBeTruthy();
        });
    }));
    it('Should show invalid validation messages when values are invalid', waitForAsync(() => {
        fixture.whenStable().then(() => {
            spyOn(component, 'activateNewNumber');
            activationCodeInput = component.activateSimForm.controls['activationCode'];
            postalCodeInput = component.activateSimForm.controls['postalCode'];
            pinCodeInput = component.activateSimForm.controls['pinCode'];
            pinCodeConfirmInput = component.activateSimForm.controls['pinCodeConfirm'];
            const submitBtn = fixture.debugElement.query(By.css('#activate-button'));
            fixture.detectChanges();
            activationCodeInput.setValue('1234');
            activationCodeInput.markAsTouched();
            activationCodeInput.markAsDirty();
            fixture.detectChanges();
            postalCodeInput.setValue('@');
            postalCodeInput.markAsTouched();
            postalCodeInput.markAsDirty();
            fixture.detectChanges();
            pinCodeInput.setValue('@@@@');
            pinCodeInput.markAsTouched();
            pinCodeInput.markAsDirty();
            fixture.detectChanges();
            pinCodeConfirmInput.setValue('abccd');
            pinCodeConfirmInput.markAsTouched();
            pinCodeConfirmInput.markAsDirty();
            fixture.detectChanges();
            component.invalidPostalCode = !(/^\d{5}(-\d{4})?$/.test(postalCodeInput));
            fixture.detectChanges();
            const invalidPostalCodeMsg = fixture.debugElement.query(By.css('#invalid-postal-label')).nativeElement;
            const invalidPinNumberMsg = fixture.debugElement.query(By.css('#invalid-pin-label')).nativeElement;
            const invalidMismatchMsg = fixture.debugElement.query(By.css('#mismatch-label')).nativeElement;
            fixture.detectChanges();
            pinCodeInput.setValue('1234');
            pinCodeInput.markAsTouched();
            pinCodeInput.markAsDirty();
            fixture.detectChanges();
            expect(invalidPostalCodeMsg).toBeDefined();
            expect(invalidPinNumberMsg).toBeDefined();
            expect(invalidMismatchMsg).toBeDefined();
            expect(component.activateSimForm.valid).toBeFalsy();
            expect(submitBtn.nativeElement.disabled).toBeTruthy();
        });
    }));
    it('Should show invalid validation message when pin code value is under 4 digits ', waitForAsync(() => {
        fixture.whenStable().then(() => {
            spyOn(component, 'activateNewNumber');
            pinCodeInput = component.activateSimForm.controls['pinCode'];
            component.invalidPostalCode = !(/^\d{5}(-\d{4})?$/.test(postalCodeInput));
            fixture.detectChanges();
            pinCodeInput.setValue('127');
            pinCodeInput.markAsTouched();
            pinCodeInput.markAsDirty();
            fixture.detectChanges();
            const invalidPinNumberMsg = fixture.debugElement.query(By.css('#invalid-pin-label')).nativeElement;
            fixture.detectChanges();
            expect(invalidPinNumberMsg).toBeDefined();
        });
    }));
    it('Should show invalid validation message when pin code value is not on pattern', waitForAsync(() => {
        fixture.whenStable().then(() => {
            spyOn(component, 'activateNewNumber');
            pinCodeInput = component.activateSimForm.controls['pinCode'];
            fixture.detectChanges();
            pinCodeInput.setValue('1234');
            pinCodeInput.markAsTouched();
            pinCodeInput.markAsDirty();
            fixture.detectChanges();
            const invalidPinNumberMsg = fixture.debugElement.query(By.css('#invalid-pin-label')).nativeElement;
            fixture.detectChanges();
            expect(invalidPinNumberMsg).toBeDefined();
        });
    }));
    it('Should show invalid validation message when pin code value is over 4 digits', waitForAsync(() => {
        fixture.whenStable().then(() => {
            spyOn(component, 'activateNewNumber');
            pinCodeInput = component.activateSimForm.controls['pinCode'];
            fixture.detectChanges();
            pinCodeInput.setValue('234556');
            pinCodeInput.markAsTouched();
            pinCodeInput.markAsDirty();
            fixture.detectChanges();
            const invalidPinNumberMsg = fixture.debugElement.query(By.css('#invalid-pin-label')).nativeElement;
            fixture.detectChanges();
            expect(invalidPinNumberMsg).toBeDefined();
        });
    }));
    it('Should show submit and not show validation messages when values are valid', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.userPlan = {} as IUserPlan;
            component.userPlan.planDevice = {} as IUserDevice;
            spyOn(component, 'activateNewNumber').and.callThrough();
            fixture.detectChanges();
            activationCodeInput = component.activateSimForm.controls['activationCode'];
            postalCodeInput = component.activateSimForm.controls['postalCode'];
            pinCodeInput = component.activateSimForm.controls['pinCode'];
            pinCodeConfirmInput = component.activateSimForm.controls['pinCodeConfirm'];
            const submitBtn = fixture.debugElement.query(By.css('#activate-button'));
            fixture.detectChanges();
            activationCodeInput.setValue('4435345');
            activationCodeInput.markAsTouched();
            activationCodeInput.markAsDirty();
            fixture.detectChanges();
            postalCodeInput.setValue('75201');
            postalCodeInput.markAsTouched();
            postalCodeInput.markAsDirty();
            fixture.detectChanges();
            pinCodeInput.setValue('1510');
            pinCodeInput.markAsTouched();
            pinCodeInput.markAsDirty();
            fixture.detectChanges();
            pinCodeConfirmInput.setValue('1510');
            pinCodeConfirmInput.markAsTouched();
            pinCodeConfirmInput.markAsDirty();
            component.userPlan.isPhonePurchased = true;
            fixture.detectChanges();
            expect(component.activateSimForm.valid).toBeTruthy();
            expect(component.validatePin()).toEqual(component.PIN_VALIDATE.VALID);
            fixture.detectChanges();
            component.captchaValid = true;
            fixture.detectChanges();
            const submitBtnActivated = fixture.debugElement.query(By.css('#activate-button'));
            fixture.detectChanges();
            submitBtnActivated.nativeElement.click();
            fixture.detectChanges();
            expect(component.activateNewNumber).toHaveBeenCalled();
        });
    }));
});
