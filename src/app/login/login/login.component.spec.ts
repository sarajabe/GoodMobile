import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AbstractControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { ActionsAnalyticsService, FirebaseUserProfileService } from '@ztarmobile/zwp-service-backend';
import { RouterHelperService } from '@ztarmobile/zwp-services-util';
import { RouterTestingModule } from '@angular/router/testing';
import { AppState } from 'src/app/app.service';
import { ENV_FIREBASE_CONFIG } from 'src/environments/environment';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';
import { LoginComponent } from './login.component';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToastrHelperService } from 'src/services/toast-helper.service';


let component: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let mockSimpleAuthService;
let emailInputField: AbstractControl;
let passwordInputField: AbstractControl;

describe('Login Component - Unit Test', async () => {
    const USER_OBJECT = { authState: true };
    beforeEach(async () => {
        mockSimpleAuthService = jasmine.createSpyObj(['SimpleAuthService', 'userState']);
        await TestBed.configureTestingModule({
            declarations: [LoginComponent,
                UiBlockButtonDirective],
            imports: [FormsModule,
                ReactiveFormsModule,
                AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
                AngularFireDatabaseModule,
                RouterTestingModule
            ],
            providers: [{ provide: AngularFireAuth },
                SimpleAuthService,
            { provide: FirebaseUserProfileService, useValue: AngularFireDatabase },
                RouterHelperService,
            { provide: ToastrHelperService },
                AppState,
                NgForm,
            { provide: ActionsAnalyticsService }]
        });
        TestBed.overrideProvider(SimpleAuthService, { useValue: mockSimpleAuthService });
        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');
        mockSimpleAuthService.userState.and.returnValue(USER_OBJECT);
        mockSimpleAuthService.userState = of(true);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Test a form group element count', () => {
        const formElement = fixture.nativeElement.querySelector('form');
        const inputElements = formElement.querySelectorAll('input');
        expect(inputElements.length).toEqual(2);
    });

    it('Check initial form values for login form group', () => {
        const loginFormEmail = component.email;
        const loginFormPassword = component.password;
        const loginFormValues = {
            email: '',
            password: '',
        };
        expect(loginFormEmail).toEqual(loginFormValues.email);
        expect(loginFormPassword).toEqual(loginFormValues.password);
    });

    it('Should set fields as required when values are empty', waitForAsync(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            emailInputField = component.loginForm.controls.loginEmail;
            passwordInputField = component.loginForm.controls.loginPassword;
            fixture.detectChanges();

            emailInputField.setValue('');
            emailInputField.markAsTouched();
            passwordInputField.setValue('');
            passwordInputField.markAsTouched();
            fixture.detectChanges();

            const requiredEmailMsg = fixture.debugElement.query(By.css('#required-email-msg'));
            const requiredPasswordMsg = fixture.debugElement.query(By.css('#required-password-msg'));

            expect(emailInputField.errors.required).toBeTruthy();
            expect(requiredEmailMsg.nativeElement).toBeDefined();
            expect(passwordInputField.errors.required).toBeTruthy();
            expect(requiredPasswordMsg.nativeElement).toBeDefined();
            expect(component.loginForm.valid).toBeFalsy();
        });

    }));

    it('Check valid username and valid password', waitForAsync(() => {
        fixture.whenStable().then(() => {
            emailInputField = component.loginForm.controls.loginEmail;
            passwordInputField = component.loginForm.controls.loginPassword;
            fixture.detectChanges();

            emailInputField.setValue('william.bawwab@pavocom.com');
            const emailPatternResult = component.emailPattern.test('william.bawwab@pavocom.com');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            passwordInputField.setValue('Abc123');
            passwordInputField.markAsTouched();
            passwordInputField.markAsDirty();
            fixture.detectChanges();

            spyOn(component, 'login');
            const loginBtn: DebugElement = fixture.debugElement.query(By.css('#sign-in-button'));
            loginBtn.nativeElement.click();
            fixture.detectChanges();

            expect(component.login).toHaveBeenCalled();
            expect(emailPatternResult).toBe(true);
            expect(component.loginForm.valid).toBeTruthy();
        });
    }));

    it('Check invalid username and valid password', waitForAsync(() => {
        fixture.whenStable().then(() => {
            emailInputField = component.loginForm.controls.loginEmail;
            passwordInputField = component.loginForm.controls.loginPassword;
            fixture.detectChanges();

            emailInputField.setValue('william.bawwab');
            const emailPatternResult = component.emailPattern.test('william.bawwab');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            passwordInputField.setValue('Abc123');
            passwordInputField.markAsTouched();
            passwordInputField.markAsDirty();
            fixture.detectChanges();

            const invalidEmailMsg = fixture.debugElement.query(By.css('#invalid-email-msg'));

            expect(emailInputField.errors.email).toBeTruthy();
            expect(invalidEmailMsg.nativeElement).toBeDefined();
            expect(emailPatternResult).toBe(false);
            expect(component.loginForm.valid).toBeFalsy();
        });
    }));
});
