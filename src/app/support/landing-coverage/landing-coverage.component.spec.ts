import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileCustomPlansService, UserDeviceService } from '@ztarmobile/zwp-service-backend';
import { ToastrService } from 'ngx-toastr';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { QuestionAnswerComponent } from 'src/widgets/question-answer/question-answer.component';
import { LandingCoverageComponent } from './landing-coverage.component';

let component: LandingCoverageComponent;
let fixture: ComponentFixture<LandingCoverageComponent>;

let zipCodeInputField;
let equipmentNumberInputField;

describe('Coverage Component - Unit Test', async () => {

    @Component({ selector: 'app-invisible-recaptcha', template: '' })
    class MockRecaptchaComponent { }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                LandingCoverageComponent,
                MockRecaptchaComponent,
                UiBlockButtonDirective,
                QuestionAnswerComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule
            ],
            providers: [
                { provide: InvisibleRecaptchaComponent, useClass: MockRecaptchaComponent },
                { provide: UserDeviceService },
                { provide: ToastrService, useValue: ToastrService },
                { provide: MobileCustomPlansService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        TestBed.compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LandingCoverageComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');
        fixture.detectChanges();

        // zipCodeInputField = component.checkCoverageForm.controls.zipCode;
        // equipmentNumberInputField = component.checkCoverageForm.controls.equipmentNumber;
        // fixture.detectChanges();
    });

    it('should create', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    // it('Test a form group element count', waitForAsync(() => {
    //     const formElement = fixture.nativeElement.querySelector('form');
    //     const inputElements = formElement.querySelectorAll('input');

    //     expect(inputElements.length).toEqual(2);
    // }));

    // it('Should show validation messages when zip code is empty', waitForAsync(() => {
    //     fixture.whenStable().then(() => {
    //         zipCodeInputField.setValue('');
    //         zipCodeInputField.markAsTouched();

    //         fixture.detectChanges();

    //         const requiredZipCodeMsg = fixture.debugElement.query(By.css('#required-zip-code-label'));

    //         expect(zipCodeInputField.errors.required).toBeTruthy();
    //         expect(requiredZipCodeMsg.nativeElement).toBeDefined();

    //         expect(component.checkCoverageForm.valid).toBeFalsy();
    //     });
    // }));

    // it('Should show validation messages when values are invalid', waitForAsync(() => {
    //     fixture.whenStable().then(() => {
    //         zipCodeInputField.setValue('24');
    //         zipCodeInputField.markAsTouched();

    //         equipmentNumberInputField.setValue('24');
    //         equipmentNumberInputField.markAsTouched();

    //         fixture.detectChanges();

    //         const invalidZipCodeMsg = fixture.debugElement.query(By.css('#invalid-zipcode-msg'));
    //         const invalidEquipmentNumberMsg = fixture.debugElement.query(By.css('#invalid-equipmentNumber-msg'));

    //         expect(zipCodeInputField.hasError('pattern')).toBeTruthy();
    //         expect(invalidZipCodeMsg.nativeElement).toBeDefined();

    //         expect(equipmentNumberInputField.hasError('minlength')).toBeTruthy();
    //         expect(invalidEquipmentNumberMsg.nativeElement).toBeDefined();

    //         expect(component.checkCoverageForm.valid).toBeFalsy();
    //     });
    // }));

    // it('Should not show validation messages when values are valid', waitForAsync(() => {
    //     fixture.whenStable().then(() => {
    //         zipCodeInputField.setValue('73301');
    //         zipCodeInputField.markAsTouched();
    //         zipCodeInputField.markAsDirty();
    //         fixture.detectChanges();

    //         equipmentNumberInputField.setValue('353260073063169');
    //         equipmentNumberInputField.markAsTouched();
    //         equipmentNumberInputField.markAsDirty();
    //         fixture.detectChanges();

    //         spyOn(component, 'checkCoverage');
    //         const signupBtn: DebugElement = fixture.debugElement.query(By.css('#check-coverage-button'));
    //         signupBtn.nativeElement.click();
    //         fixture.detectChanges();

    //         expect(zipCodeInputField.hasError('pattern')).toBeFalsy();
    //         expect(equipmentNumberInputField.hasError('minlength')).toBeFalsy();

    //         expect(component.checkCoverageForm.valid).toBeTruthy();
    //     });
    // }));
});
