import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UserAuthService } from '@ztarmobile/zwp-services-auth';
import { ActionsAnalyticsService, FirebaseMobilePlansCartService, FirebaseUserProfileService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { RouterHelperService } from '@ztarmobile/zwp-services-util';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ENV_FIREBASE_CONFIG } from 'src/environments/environment';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { SignUpComponent } from './sign-up.component';

let component: SignUpComponent;
let fixture: ComponentFixture<SignUpComponent>;
let mockUserAuthService;
let mockFirebaseMobilePlansCartService;
let mockFirebaseUserProfileService;

let firstNameInputField;
let lastNameInputField;
let emailInputField;
let passwordInputField;
let confirmPasswordInputField;

describe('Signup Component - Unit Test', async () => {
    const CART_OBJECT = { cart: true };
    const USER_OBJECT = { user: true };
    @Component({ selector: 'app-re-captcha', template: '' })
    class MockRecaptchaComponent { }
    beforeEach(async () => {
        mockUserAuthService = jasmine.createSpyObj(['UserAuthService', '_endpointUrl']);
        mockFirebaseMobilePlansCartService = jasmine.createSpyObj(['FirebaseMobilePlansCartService', 'userCart']);
        mockFirebaseUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
        await TestBed.configureTestingModule({
            declarations: [SignUpComponent,
                UiBlockButtonDirective, MockRecaptchaComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
                AngularFireDatabaseModule,
                RouterTestingModule
            ],
            providers: [UserAuthService,
                RouterHelperService,
                { provide: ActionsAnalyticsService },
                { provide: ToastrService, useValue: ToastrService },
                { provide: FirebaseMobilePlansCartService },
                { provide: UserPlansService },
                { provide: FirebaseUserProfileService },
                { provide: ReCaptchaComponent, useClass: MockRecaptchaComponent }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        TestBed.overrideProvider(UserAuthService, { useValue: mockUserAuthService });
        TestBed.overrideProvider(FirebaseMobilePlansCartService, { useValue: mockFirebaseMobilePlansCartService });
        TestBed.overrideProvider(FirebaseUserProfileService, { useValue: mockFirebaseUserProfileService });
        TestBed.compileComponents();
    });
    beforeEach(async () => {
        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');
        mockFirebaseMobilePlansCartService.userCart.and.returnValue(CART_OBJECT);
        mockFirebaseMobilePlansCartService.userCart = of(true);

        mockFirebaseUserProfileService.userProfileObservable.and.returnValue(USER_OBJECT);
        mockFirebaseUserProfileService.userProfileObservable = of(true);
        fixture.detectChanges();

        firstNameInputField = component.userForm.controls.firstName;
        lastNameInputField = component.userForm.controls.lastName;
        emailInputField = component.userForm.controls.email;
        passwordInputField = component.userForm.controls.password;
        confirmPasswordInputField = component.userForm.controls.confirmPassword;
        fixture.detectChanges();
        component.captchaValid = true;
        component.SITE_ID = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Test a form group element count', () => {
        const formElement = fixture.nativeElement.querySelector('form');
        const inputElements = formElement.querySelectorAll('input');
        expect(inputElements.length).toEqual(5);
    });

    it('Check initial form values for login form group', () => {
        const signupFormGroup = component.userForm;
        const signupFormValues = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        };

        expect(signupFormGroup.value).toEqual(signupFormValues);
    });

    it('Should show validation messages when values are empty', fakeAsync((done) => {
        fixture.whenStable().then(() => {
            component.reCaptcha = TestBed.get(ReCaptchaComponent);
            fixture.detectChanges();
            firstNameInputField.value = '';
            firstNameInputField.markAsTouched();
            lastNameInputField.value = '';
            lastNameInputField.markAsTouched();
            emailInputField.value = '';
            emailInputField.markAsTouched();
            passwordInputField.value = '';
            passwordInputField.markAsTouched();
            confirmPasswordInputField.value = '';
            confirmPasswordInputField.markAsTouched();
            fixture.detectChanges();

            const requiredFirstNameMsg = fixture.debugElement.query(By.css('#required-firstName-msg'));
            const requiredLastNameMsg = fixture.debugElement.query(By.css('#required-lastName-msg'));
            const requiredEmailNameMsg = fixture.debugElement.query(By.css('#required-email-msg'));
            const requiredPasswordNameMsg = fixture.debugElement.query(By.css('#password-validation-msg'));

            expect(firstNameInputField.errors.required).toBeTruthy();
            expect(requiredFirstNameMsg.nativeElement).toBeDefined();

            expect(lastNameInputField.errors.required).toBeTruthy();
            expect(requiredLastNameMsg.nativeElement).toBeDefined();

            expect(emailInputField.errors.required).toBeTruthy();
            expect(requiredEmailNameMsg.nativeElement).toBeDefined();

            expect(passwordInputField.errors.required).toBeTruthy();
            expect(requiredPasswordNameMsg.nativeElement).toBeDefined();

            expect(confirmPasswordInputField.errors.required).toBeTruthy();
        });
        tick();
    }));

    it('Should show validation messages when values are invalid', fakeAsync((done) => {
        fixture.whenStable().then(() => {
            component.reCaptcha = TestBed.get(ReCaptchaComponent);
            fixture.detectChanges();
            firstNameInputField.setValue('2');
            firstNameInputField.markAsTouched();
            firstNameInputField.markAsDirty();
            fixture.detectChanges();

            lastNameInputField.setValue('2');
            lastNameInputField.markAsTouched();
            lastNameInputField.markAsDirty();
            fixture.detectChanges();

            emailInputField.setValue('2');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            passwordInputField.setValue('Abc');
            passwordInputField.markAsTouched();
            passwordInputField.markAsDirty();
            fixture.detectChanges();

            confirmPasswordInputField.setValue('Abcc');
            confirmPasswordInputField.markAsTouched();
            confirmPasswordInputField.markAsDirty();
            fixture.detectChanges();

            const invalidFirstNameMsg = fixture.debugElement.query(By.css('#invalid-firstName-msg'));
            const invalidLastNameMsg = fixture.debugElement.query(By.css('#invalid-lastName-msg'));
            const invalidEmailNameMsg = fixture.debugElement.query(By.css('#invalid-email-msg'));
            const invalidPasswordNameMsg = fixture.debugElement.query(By.css('#password-validation-msg'));

            expect(firstNameInputField.hasError('pattern')).toBeTruthy();
            expect(invalidFirstNameMsg.nativeElement).toBeDefined();

            expect(lastNameInputField.hasError('pattern')).toBeTruthy();
            expect(invalidLastNameMsg.nativeElement).toBeDefined();

            expect(emailInputField.hasError('email')).toBeTruthy();
            expect(invalidEmailNameMsg.nativeElement).toBeDefined();

            expect(component.userForm.controls.password.valid).toBeFalsy();
            expect(invalidPasswordNameMsg.nativeElement).toBeDefined();

            expect(component.userForm.hasError('mismatchedPasswords')).toBeTruthy();
        });
        tick();
    }));

    it('Should not show validation messages when values are valid', fakeAsync((done) => {
        fixture.whenStable().then(() => {
            component.reCaptcha = TestBed.get(ReCaptchaComponent);
            fixture.detectChanges();
            firstNameInputField.setValue('william');
            firstNameInputField.markAsTouched();
            firstNameInputField.markAsDirty();
            fixture.detectChanges();

            lastNameInputField.setValue('bawwab');
            lastNameInputField.markAsTouched();
            lastNameInputField.markAsDirty();
            fixture.detectChanges();

            emailInputField.setValue('william.bawwab@pavocom.com');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            passwordInputField.setValue('Abc123');
            passwordInputField.markAsTouched();
            passwordInputField.markAsDirty();
            fixture.detectChanges();

            confirmPasswordInputField.setValue('Abc123');
            confirmPasswordInputField.markAsTouched();
            confirmPasswordInputField.markAsDirty();
            fixture.detectChanges();

            spyOn(component, 'signUp');
            const signupBtn: DebugElement = fixture.debugElement.query(By.css('#verifyButton'));
            signupBtn.nativeElement.click();
            fixture.detectChanges();

            expect(firstNameInputField.hasError('pattern')).toBeFalsy();
            expect(lastNameInputField.hasError('pattern')).toBeFalsy();
            expect(emailInputField.hasError('email')).toBeFalsy();
            expect(component.userForm.controls.password.valid).toBeTruthy();
            expect(component.userForm.hasError('mismatchedPasswords')).toBeFalsy();
        });
        tick();
    }));
});
