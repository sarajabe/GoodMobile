import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterHelperService } from '@ztarmobile/zwp-services-util';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import 'rxjs/add/observable/of';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';
import { ForgetPasswordComponent } from './forget-password.component';

let component: ForgetPasswordComponent;
let fixture: ComponentFixture<ForgetPasswordComponent>;
let params: Subject<Params>;
let emailInputField;

describe('Forget Password Component - Unit Test', async () => {
    beforeEach(async () => {
        params = new Subject<Params>();
        await TestBed.configureTestingModule({
            declarations: [ForgetPasswordComponent,
                UiBlockButtonDirective],
            imports: [FormsModule,
                ReactiveFormsModule,
                RouterTestingModule],
            providers: [{ provide: AngularFireAuth },
            { provide: ToastrService, useValue: ToastrService },
                RouterHelperService,
            { provide: ActivatedRoute, useValue: { params } }
            ]
        }).compileComponents();
    });
    beforeEach(async () => {
        fixture = TestBed.createComponent(ForgetPasswordComponent);
        component = fixture.componentInstance;

        emailInputField = component.forgetPasswordForm.controls.email;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should check the validity of the populated email', fakeAsync(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            params.next({ email: 'rana.haddad@ztarmobile.com' });
            tick();

            const popEmail = component.email;
            emailInputField.setValue(popEmail);
            fixture.detectChanges();

            spyOn(component, 'sendEmail');
            const submitBtn: DebugElement = fixture.debugElement.query(By.css('#submit-button'));
            submitBtn.nativeElement.click();
            fixture.detectChanges();

            expect(popEmail).toEqual('rana.haddad@ztarmobile.com');
            expect(emailInputField.hasError('email')).toBeFalsy();

            expect(submitBtn.nativeElement.disabled).toBeFalsy();
            expect(component.sendEmail).toHaveBeenCalledTimes(1);

            expect(component.forgetPasswordForm.valid).toBeTruthy();
        });
    }));

    it('Should check the validity of the empty email', fakeAsync(() => {
        const popEmail = component.email;
        params.next({});
        tick();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(popEmail).toEqual(undefined);
            expect(emailInputField.errors.required).toBeTruthy();
            expect(emailInputField.hasError('email')).toBeFalsy();
        });
    }));

    it('Should test a form group element count', () => {
        const formElement = fixture.nativeElement.querySelector('form');
        const inputElements = formElement.querySelectorAll('input');
        expect(inputElements.length).toEqual(1);
    });

    it('Should show the validation message when the email is empty', waitForAsync(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            emailInputField.setValue('');
            emailInputField.markAsTouched();
            fixture.detectChanges();

            spyOn(component, 'sendEmail');
            const submitBtn: DebugElement = fixture.debugElement.query(By.css('#submit-button'));
            submitBtn.nativeElement.click();
            fixture.detectChanges();

            const requiredEmailMsg = fixture.debugElement.query(By.css('#required-email-msg'));

            expect(emailInputField.errors.required).toBeTruthy();
            expect(requiredEmailMsg.nativeElement).toBeDefined();

            expect(submitBtn.nativeElement.disabled).toBeTruthy();
            expect(component.sendEmail).toHaveBeenCalledTimes(0);

            expect(component.forgetPasswordForm.valid).toBeFalsy();
        });
    }));

    it('Should show the validation message when the email is invalid', waitForAsync(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            emailInputField.setValue('william.bawwab');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            spyOn(component, 'sendEmail');
            const submitBtn: DebugElement = fixture.debugElement.query(By.css('#submit-button'));
            submitBtn.nativeElement.click();
            fixture.detectChanges();

            const invalidEmailNameMsg = fixture.debugElement.query(By.css('#invalid-email-msg'));

            expect(emailInputField.hasError('email')).toBeTruthy();
            expect(invalidEmailNameMsg.nativeElement).toBeDefined();

            expect(submitBtn.nativeElement.disabled).toBeTruthy();
            expect(component.sendEmail).toHaveBeenCalledTimes(0);

            expect(component.forgetPasswordForm.valid).toBeFalsy();
        });
    }));

    it('Should not show the validation message when the email is valid', waitForAsync(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            emailInputField.setValue('william.bawwab@pavocom.com');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            spyOn(component, 'sendEmail');
            const submitBtn: DebugElement = fixture.debugElement.query(By.css('#submit-button'));
            submitBtn.nativeElement.click();
            fixture.detectChanges();

            expect(emailInputField.hasError('email')).toBeFalsy();

            expect(submitBtn.nativeElement.disabled).toBeFalsy();
            expect(component.sendEmail).toHaveBeenCalledTimes(1);

            expect(component.forgetPasswordForm.valid).toBeTruthy();
        });
    }));
});
