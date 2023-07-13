import { Component, CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsAnalyticsService, FirebaseEBBService, FirebaseUserProfileService, PlacesAutocompleteService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { NgxPageScrollCoreModule, PageScrollService } from 'ngx-page-scroll-core';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule } from 'ngx-toastr';
import { InformationMessageModalComponent } from 'src/modals/information-message-modal/information-message-modal.component';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { AppIdValidationComponent } from './app-id-validation.component';
import { EbbManager } from 'src/services/ebb.service';
import { By } from '@angular/platform-browser';
import { ACP_MOCKS } from 'src/mocks';
import { AppIdPersonalInfoComponent } from '../app-id-personal-info/app-id-personal-info.component';
import { IGoogleTagManagerEventsConfig } from '@ztarmobile/zwp-service';
import { of } from 'rxjs';
import { AppIdAddressInfoComponent } from '../app-id-address-info/app-id-address-info.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SignatureInfoComponent } from '../../signature-info/signature-info.component';

fdescribe('Acp app id Validation Component - Unit Testing', () => {
    let component: AppIdValidationComponent;
    let fixture: ComponentFixture<AppIdValidationComponent>;
    let appIdPersonalInfoComponent: AppIdPersonalInfoComponent;
    let personalFixture: ComponentFixture<AppIdPersonalInfoComponent>;
    let addressComponent: AppIdAddressInfoComponent;
    let addressFixture: ComponentFixture<AppIdAddressInfoComponent>;
    let signatureComponent: SignatureInfoComponent;
    let signatureFixture: ComponentFixture<SignatureInfoComponent>;

    let mockEbbService;
    let mockFirebaseUserProfileService;
    let mockModalHelperService;
    let mockEbbManager;
    let mockPlacesAutocompleteService;
    let appPersonalInfo;
    let appAddressInfo;

    let mockAnalyticService;

    let acpData = ACP_MOCKS.ACP_DATA;

    @Component({ selector: 'app-invisible-recaptcha', template: '' })

    class MockRecaptchaComponent { }

    beforeEach(async () => {
        mockEbbService = jasmine.createSpyObj(['EBBService', 'logVerifyError', 'getActiveInternalApplication', 'createInternalApplication', 'verifyACPWithOrWithoutAppId']);
        mockFirebaseUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
        mockModalHelperService = jasmine.createSpyObj(['ModalHelperService', 'showInformationMessageModal', 'closeDialog']);
        mockAnalyticService = jasmine.createSpyObj(['ActionsAnalyticsService', 'trackACPEvent']);
        mockEbbManager = jasmine.createSpyObj(['EbbManager', 'activeStep', 'validateCurrentStep', 'acpFlowSelected']);
        mockPlacesAutocompleteService = jasmine.createSpyObj(['PlacesAutocompleteService', 'findAddress', 'findDetailedAddressFields']);

        await TestBed.configureTestingModule({
            declarations: [
                AppIdValidationComponent,
                AppIdPersonalInfoComponent,
                AppIdAddressInfoComponent,
                SignatureInfoComponent,
                InformationMessageModalComponent,
                MockRecaptchaComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                NgxPrintModule,
                MatAutocompleteModule,
                ToastrModule.forRoot(),
                NgxPageScrollCoreModule.forRoot({ duration: 200 }),
            ],
            providers: [
                { provide: PageScrollService },
                { provide: EbbService },
                { provide: EbbManager },
                { provide: PlacesAutocompleteService },
                { provide: FirebaseEBBService },
                { provide: ActionsAnalyticsService, useValue: new InjectionToken<IGoogleTagManagerEventsConfig>('GoogleTagManagerEvents') },
                { provide: ModalHelperService },
                { provide: UserPlansService },
                { provide: FirebaseUserProfileService },
                { provide: InvisibleRecaptchaComponent, useClass: MockRecaptchaComponent },
                { provide: ReCaptchaComponent, useClass: MockRecaptchaComponent },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });

        TestBed.overrideProvider(EbbService, { useValue: mockEbbService });
        TestBed.overrideProvider(FirebaseUserProfileService, { useValue: mockFirebaseUserProfileService });
        TestBed.overrideProvider(ModalHelperService, { useValue: mockModalHelperService });
        TestBed.overrideProvider(ActionsAnalyticsService, { useValue: mockAnalyticService });
        TestBed.overrideProvider(EbbManager, { useValue: mockEbbManager });
        TestBed.overrideProvider(PlacesAutocompleteService, { useValue: mockPlacesAutocompleteService });
        TestBed.compileComponents();

        fixture = TestBed.createComponent(AppIdValidationComponent);
        component = fixture.componentInstance;

        personalFixture = TestBed.createComponent(AppIdPersonalInfoComponent);
        appIdPersonalInfoComponent = personalFixture.componentInstance;

        addressFixture = TestBed.createComponent(AppIdAddressInfoComponent);
        addressComponent = addressFixture.componentInstance;

        signatureFixture = TestBed.createComponent(SignatureInfoComponent);
        signatureComponent = signatureFixture.componentInstance;


        mockEbbManager.activeStep.and.returnValue(1);
        mockEbbManager.activeStep = of(1);

        mockEbbManager.acpFlowSelected.and.returnValue('');
        mockEbbManager.acpFlowSelected = of(1);

        spyOn(component.router, 'navigate');

        fixture.detectChanges();
    });

    it('should create component successfully', () => {
        expect(component).toBeTruthy();
    });

    it('Should check if the activeStep is 1, so the app-personal-info should be rendered in the DOM', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.activeStep = 1;
            fixture.detectChanges();

            appPersonalInfo = fixture.debugElement.query(By.css('app-app-id-personal-info'));
            const stepTitle = fixture.debugElement.query(By.css('#stepTitle')).nativeElement;

            expect(appPersonalInfo).toBeTruthy();
            expect(stepTitle.innerHTML).toEqual('Please provide the following information to verify your application!');
        });
    }));

    it('Should check if step 1 will have a regular next button', () => {
        component.activeStep = 1;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        expect(nextVerifyButton).toBeDefined();
        expect(nextVerifyButton.innerHTML).toEqual('Next');
    });

    it('Should click on next from the step 1 and make sure that the validateCurrentStep is called', () => {
        component.activeStep = 1;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        nextVerifyButton.click();

        expect(mockEbbManager.validateCurrentStep).toHaveBeenCalledWith(1, true);
    });

    it('Should check if the activeStep is 2, so the app-app-id-address-info should be rendered in the DOM', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.activeStep = 2;
            fixture.detectChanges();

            appAddressInfo = fixture.debugElement.query(By.css('app-app-id-address-info'));
            const stepTitle = fixture.debugElement.query(By.css('#stepTitle')).nativeElement;

            expect(appAddressInfo).toBeTruthy();
            expect(stepTitle.innerHTML).toEqual('Please provide the following information to verify your application!');
        });
    }));

    it('Should check if step 2 will have a regular next button', () => {
        component.activeStep = 2;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        expect(nextVerifyButton).toBeDefined();
        expect(nextVerifyButton.innerHTML).toEqual('Next');
    });

    it('Should click on next from the step 2 and make sure that the validateCurrentStep is called', () => {
        component.activeStep = 2;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        nextVerifyButton.click();

        expect(mockEbbManager.validateCurrentStep).toHaveBeenCalledWith(2, true);
    });

    it('Should check if the activeStep is 3, so the app-signature-info should be rendered in the DOM', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.activeStep = 3;
            component.acpData = acpData;
            fixture.detectChanges();

            const appSignatureInfo = fixture.debugElement.query(By.css('app-signature-info'));
            const stepTitle = fixture.debugElement.query(By.css('#stepTitle')).nativeElement;
            const stepDesc = fixture.debugElement.query(By.css('#stepDesc')).nativeElement;

            expect(appSignatureInfo).toBeTruthy();
            expect(stepTitle.innerHTML).toEqual('Customer Notice and Agreement');
            expect(stepDesc.innerHTML).toEqual('To apply for service under the Federal ACP with Good Mobile, you should agree and initial the following:');
        });
    }));

    it('Should check if Verify button is on step 3', () => {
        component.acpData = acpData;
        component.activeStep = 3;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        expect(nextVerifyButton).toBeDefined();
        expect(nextVerifyButton.innerHTML).toEqual('Submit');
    });

    it('Should listens for setUserInfo changes in activeStep = 1 and make sure that the form is mark as touched in the personal component', () => {
        spyOn(appIdPersonalInfoComponent.setUserInfo, 'emit');
        spyOn(component, 'callCreateInternalApp');
        spyOn(component, 'setPersonalInfo');

        personalFixture.detectChanges();
        fixture.detectChanges();

        component.activeStep = 1;
        component.acpData = acpData;
        component.goNext();
        fixture.detectChanges();

        appIdPersonalInfoComponent.ngOnInit();
        personalFixture.detectChanges();

        expect(appIdPersonalInfoComponent.personalInfoForm.touched).toBeTruthy();
    });

    it('Should listens for setAddresses changes in activeStep = 2 and make sure that the addressInfoForm is markasTouched in the address component', () => {
        mockEbbManager.activeStep = of(2);

        spyOn(component, 'callCreateInternalApp');
        spyOn(component, 'setUserAddresses');

        addressFixture.detectChanges();
        fixture.detectChanges();

        component.activeStep = 2;
        component.goNext();
        fixture.detectChanges();

        addressComponent.ngOnInit();
        addressFixture.detectChanges();

        expect(addressComponent.addressInfoForm.touched).toBeTruthy();
    });
    it('Should listens for setSignature changes in activeStep = 3 and make sure that the signatureForm is markasTouched in the signature component', () => {
        mockEbbManager.activeStep = of(5);
        mockEbbManager.acpFlowSelected = of('no');

        spyOn(component, 'callCreateInternalApp');
        spyOn(component, 'setSignedValue');
        spyOn(String.prototype, 'toUpperCase')
        spyOn(signatureComponent, 'matchingFullName');

        signatureFixture.detectChanges();
        fixture.detectChanges();

        component.activeStep = 3;
        component.acpData = acpData;
        component.goNext();
        fixture.detectChanges();

        signatureComponent.fullName = `${ACP_MOCKS.USER_INFO.firstName} ${ACP_MOCKS.USER_INFO.lastName}`;
        signatureComponent.ngOnInit();
        signatureFixture.detectChanges();

        expect(signatureComponent.signatureForm.touched).toBeTruthy();
    });

    it('Should click on back when active step is 1 and make sure the back emitter is emitted with true', () => {
        spyOn(component, 'goBack').and.callThrough();
        spyOn(component.back, 'emit');
        fixture.detectChanges();

        component.activeStep = 1;
        fixture.detectChanges();

        const backButton = fixture.debugElement.query(By.css('#backBtn')).nativeElement;
        backButton.click();

        expect(component.goBack).toHaveBeenCalled();
        expect(backButton).toBeTruthy();
        expect(component.back.emit).toHaveBeenCalledWith(true);
    });

    it('Should click on back when active step is 2 to make sure that the active step will be equals -1 and the rendered compoenent will be the personal info', () => {
        fixture.detectChanges();
        spyOn(component, 'goBack').and.callThrough();
        fixture.detectChanges();

        component.activeStep = 2;
        fixture.detectChanges();

        const backButton = fixture.debugElement.query(By.css('#backBtn')).nativeElement;
        backButton.click();

        appPersonalInfo = fixture.debugElement.query(By.css('app-app-id-personal-info'));

        expect(mockEbbService.getActiveInternalApplication).toHaveBeenCalled();
        expect(component.goBack).toHaveBeenCalled();
        expect(component.activeStep).toEqual(1);
        expect(appPersonalInfo).toBeTruthy();
        expect(backButton).toBeTruthy();
    });

    it('Should click on back when active step is 3 to make sure that the active step will be equals -1 and the rendered compoenent will be the address', () => {
        fixture.detectChanges();
        spyOn(component, 'goBack').and.callThrough();
        fixture.detectChanges();

        component.acpData = acpData;
        component.activeStep = 3;
        fixture.detectChanges();

        const backButton = fixture.debugElement.query(By.css('#backBtn')).nativeElement;
        backButton.click();

        appAddressInfo = fixture.debugElement.query(By.css('app-app-id-address-info'));

        expect(mockEbbService.getActiveInternalApplication).toHaveBeenCalled();
        expect(component.goBack).toHaveBeenCalled();
        expect(component.activeStep).toEqual(2);
        expect(appAddressInfo).toBeTruthy();
        expect(backButton).toBeTruthy();
    });

    it('Should click on cancel button and make sure it will call the correct function and it navigates to the landing page ', waitForAsync(() => {
        const cancelButton = fixture.debugElement.query(By.css('#cancelBtn')).nativeElement;
        cancelButton.click();
        fixture.detectChanges();

        expect(component.router.navigate).toHaveBeenCalled();
    }));

    it('Should check if there is acp errors so app-acp-error should be rendered in the dom', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.acpError = true;
            fixture.detectChanges();

            const appAcpError = fixture.debugElement.query(By.css('app-acp-error'));
            expect(appAcpError).toBeTruthy();
        });
    }));

    it('Should check if the user is complete with the acp flow  so app-acp-success should be rendered in the dom', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.acpSuccess = true;
            fixture.detectChanges();

            const appAcpSuccess = fixture.debugElement.query(By.css('app-acp-success'));
            expect(appAcpSuccess).toBeTruthy();
        });
    }));
});