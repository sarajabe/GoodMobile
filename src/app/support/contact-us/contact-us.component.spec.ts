import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactEmailService, FirebaseUserProfileService } from '@ztarmobile/zwp-service-backend';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { ContactUsComponent } from './contact-us.component';

let component: ContactUsComponent;
let fixture: ComponentFixture<ContactUsComponent>;
let mockFirebaseUserProfileService;

let nameInputField;
let emailInputField;
let phoneInputField;
let contactInputField;
let messageTextAreaField;

describe('Contact Us Component - Unit Test', async () => {
    const USER_OBJECT = { user: true };
    @Component({ selector: 'app-re-captcha', template: '' })
    class MockRecaptchaComponent { }

    beforeEach(async () => {
        mockFirebaseUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
        await TestBed.configureTestingModule({
            declarations: [ContactUsComponent,
                UiBlockButtonDirective,
                MockRecaptchaComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                RouterTestingModule
            ],
            providers: [
                { provide: ContactEmailService },
                { provide: FirebaseUserProfileService },
                { provide: ToastrService, useValue: ToastrService },
                { provide: ReCaptchaComponent, useClass: MockRecaptchaComponent }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        TestBed.overrideProvider(FirebaseUserProfileService, { useValue: mockFirebaseUserProfileService });
        TestBed.compileComponents();
    });
    beforeEach(async () => {
        fixture = TestBed.createComponent(ContactUsComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');
        mockFirebaseUserProfileService.userProfileObservable.and.returnValue(USER_OBJECT);
        mockFirebaseUserProfileService.userProfileObservable = of(true);
        fixture.detectChanges();

        nameInputField = component.contactUsForm.controls.name;
        emailInputField = component.contactUsForm.controls.email;
        phoneInputField = component.contactUsForm.controls.phone;
        contactInputField = component.contactUsForm.controls.contact;
        messageTextAreaField = component.contactUsForm.controls.message;
        fixture.detectChanges();
    });

    it('should create', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('Test a form group element count', waitForAsync(() => {
        const formElement = fixture.nativeElement.querySelector('form');
        const inputElements = formElement.querySelectorAll('input');
        const textAreaElement = formElement.querySelectorAll('textarea');

        expect(inputElements.length).toEqual(4);
        expect(textAreaElement.length).toEqual(1);
    }));

    it('Should show validation messages when values are empty', waitForAsync(() => {
        fixture.whenStable().then(() => {
            nameInputField.setValue('');
            nameInputField.markAsTouched();

            emailInputField.setValue('');
            emailInputField.markAsTouched();

            phoneInputField.setValue('');
            phoneInputField.markAsTouched();

            contactInputField.setValue('');
            contactInputField.markAsTouched();

            messageTextAreaField.setValue('');
            messageTextAreaField.markAsTouched();
            fixture.detectChanges();

            const requiredNameMsg = fixture.debugElement.query(By.css('#required-name-msg'));
            const requiredEmailMsg = fixture.debugElement.query(By.css('#required-email-msg'));
            const requiredMsg = fixture.debugElement.query(By.css('#required-msg'));

            expect(nameInputField.errors.required).toBeTruthy();
            expect(requiredNameMsg.nativeElement).toBeDefined();

            expect(emailInputField.errors.required).toBeTruthy();
            expect(requiredEmailMsg.nativeElement).toBeDefined();

            expect(phoneInputField.errors).toBeNull();

            expect(contactInputField.errors).toBeNull();

            expect(messageTextAreaField.errors.required).toBeTruthy();
            expect(requiredMsg.nativeElement).toBeDefined();

            expect(component.contactUsForm.valid).toBeFalsy();
        });
    }));

    it('Should show validation messages when values are invalid', waitForAsync(() => {
        fixture.whenStable().then(() => {
            nameInputField.setValue('2');
            nameInputField.markAsTouched();
            nameInputField.markAsDirty();
            fixture.detectChanges();

            emailInputField.setValue('2');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            phoneInputField.setValue('2');
            phoneInputField.markAsTouched();
            phoneInputField.markAsDirty();
            fixture.detectChanges();

            contactInputField.setValue('2');
            contactInputField.markAsTouched();
            contactInputField.markAsDirty();
            fixture.detectChanges();

            const invalidNameMsg = fixture.debugElement.query(By.css('#invalid-name-msg'));
            const invalidEmailMsg = fixture.debugElement.query(By.css('#invalid-email-msg'));
            const invalidPhoneMsg = fixture.debugElement.query(By.css('#invalid-phone-msg'));
            const invalidContactMsg = fixture.debugElement.query(By.css('#invalid-contact-msg'));

            expect(nameInputField.hasError('pattern')).toBeTruthy();
            expect(invalidNameMsg.nativeElement).toBeDefined();

            expect(emailInputField.hasError('email')).toBeTruthy();
            expect(invalidEmailMsg.nativeElement).toBeDefined();

            expect(phoneInputField.hasError('minlength')).toBeTruthy();
            expect(invalidPhoneMsg.nativeElement).toBeDefined();

            expect(contactInputField.hasError('minlength')).toBeTruthy();
            expect(invalidContactMsg.nativeElement).toBeDefined();

            expect(component.contactUsForm.valid).toBeFalsy();
        });
    }));

    it('Should not show validation messages when values are valid', waitForAsync(() => {
        fixture.whenStable().then(() => {
            nameInputField.setValue('william');
            nameInputField.markAsTouched();
            nameInputField.markAsDirty();
            fixture.detectChanges();

            emailInputField.setValue('william.bawwab@pavocom.com');
            emailInputField.markAsTouched();
            emailInputField.markAsDirty();
            fixture.detectChanges();

            messageTextAreaField.setValue('HEY TEST');
            messageTextAreaField.markAsTouched();
            messageTextAreaField.markAsDirty();
            fixture.detectChanges();

            spyOn(component, 'resolvedCaptcha');
            const captchaClick: DebugElement = fixture.debugElement.query(By.css('#captcha-box'));
            captchaClick.nativeElement.click();
            fixture.detectChanges();

            spyOn(component, 'sendMessage');
            const signupBtn: DebugElement = fixture.debugElement.query(By.css('#submitButton'));
            signupBtn.nativeElement.click();
            fixture.detectChanges();

            expect(nameInputField.hasError('pattern')).toBeFalsy();
            expect(emailInputField.hasError('email')).toBeFalsy();
            expect(component.contactUsForm.valid).toBeTruthy();
        });
    }));

    it('Should click on facbook icon and redirect to the right page', waitForAsync(() => {
        fixture.whenStable().then(() => {
            const facebookIcon: DebugElement = fixture.debugElement.query(By.css('#facebookLink'));
            fixture.detectChanges();

            expect(facebookIcon.nativeElement.getAttribute('href')).toEqual('https://www.facebook.com/goodmobileusa/');
        });
    }));

    it('Should click on twitter icon and redirect to the right page', waitForAsync(() => {
        fixture.whenStable().then(() => {
            const twitterIcon: DebugElement = fixture.debugElement.query(By.css('#twitterLink'));
            fixture.detectChanges();

            expect(twitterIcon.nativeElement.getAttribute('href')).toEqual('https://twitter.com/goodmobileusa');
        });
    }));

    it('Should click on instagram icon and redirect to the right page', waitForAsync(() => {
        fixture.whenStable().then(() => {
            const instagramIcon: DebugElement = fixture.debugElement.query(By.css('#instagramLink'));
            fixture.detectChanges();

            expect(instagramIcon.nativeElement.getAttribute('href')).toEqual('https://www.instagram.com/goodmobileusa/');
        });
    }));
});
