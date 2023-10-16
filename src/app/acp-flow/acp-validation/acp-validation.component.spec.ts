import { Component, CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsAnalyticsService, FirebaseEBBService, FirebaseUserProfileService, PlacesAutocompleteService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { NgxPageScrollCoreModule, PageScrollService } from 'ngx-page-scroll-core';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { InformationMessageModalComponent } from 'src/modals/information-message-modal/information-message-modal.component';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { AcpValidationComponent } from './acp-validation.component';
import { EbbManager } from 'src/services/ebb.service';
import { By } from '@angular/platform-browser';
import { ACP_MOCKS } from 'src/mocks';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { IGoogleTagManagerEventsConfig } from '@ztarmobile/zwp-service';
import { of, ReplaySubject } from 'rxjs';
import { AddressInfoComponent } from '../address-info/address-info.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChildInfoComponent } from '../child-info/child-info.component';
import { AcpDocumentsComponent } from '../acp-documents/acp-documents.component';
import { SignatureInfoComponent } from '../signature-info/signature-info.component';

fdescribe('Acp Validation Component - Unit Testing', () => {
    let component: AcpValidationComponent;
    let fixture: ComponentFixture<AcpValidationComponent>;
    let personalInfoComponent: PersonalInfoComponent;
    let personalFixture: ComponentFixture<PersonalInfoComponent>;
    let addressComponent: AddressInfoComponent;
    let addressFixture: ComponentFixture<AddressInfoComponent>;
    let childInfoComponent: ChildInfoComponent;
    let childFixture: ComponentFixture<ChildInfoComponent>;
    let acpDocumentsComponent: AcpDocumentsComponent;
    let documentsFixture: ComponentFixture<AcpDocumentsComponent>;
    let signatureComponent: SignatureInfoComponent;
    let signatureFixture: ComponentFixture<SignatureInfoComponent>;

    let mockEbbService;
    let mockFirebaseUserProfileService;
    let mockModalHelperService;
    let mockEbbManager;
    let mockPlacesAutocompleteService;
    let appPersonalInfo;
    let appAddressInfo;
    let appChildInfo;
    let mockAnalyticService;

    let acpData = ACP_MOCKS.ACP_DATA;

    @Component({ selector: 'app-invisible-recaptcha', template: '' })

    class MockRecaptchaComponent { }

    beforeEach(async () => {
        mockEbbService = jasmine.createSpyObj(['EBBService', 'verifyACP', 'logVerifyError', 'getACPApplicationStatus', 'getActiveInternalApplication', 'createInternalApplication', 'verifyACPWithOrWithoutAppId', 'getCodes', 'getPublicHousingPrograms']);
        mockFirebaseUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
        mockModalHelperService = jasmine.createSpyObj(['ModalHelperService', 'showInformationMessageModal', 'closeDialog']);
        mockAnalyticService = jasmine.createSpyObj(['ActionsAnalyticsService', 'trackACPEvent']);
        mockEbbManager = jasmine.createSpyObj(['EbbManager', 'activeStep', 'validateCurrentStep', 'acpFlowSelected', 'eligibilityCodeDescs', 'setCodesDescs', 'codesSubject']);
        mockPlacesAutocompleteService = jasmine.createSpyObj(['PlacesAutocompleteService', 'findAddress', 'findDetailedAddressFields']);

        await TestBed.configureTestingModule({
            declarations: [
                AcpValidationComponent,
                PersonalInfoComponent,
                AddressInfoComponent,
                ChildInfoComponent,
                AcpDocumentsComponent,
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
                { provide: ToastrService, useValue: ToastrService },
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

        fixture = TestBed.createComponent(AcpValidationComponent);
        component = fixture.componentInstance;

        personalFixture = TestBed.createComponent(PersonalInfoComponent);
        personalInfoComponent = personalFixture.componentInstance;

        addressFixture = TestBed.createComponent(AddressInfoComponent);
        addressComponent = addressFixture.componentInstance;

        childFixture = TestBed.createComponent(ChildInfoComponent);
        childInfoComponent = childFixture.componentInstance;

        documentsFixture = TestBed.createComponent(AcpDocumentsComponent);
        acpDocumentsComponent = documentsFixture.componentInstance;

        signatureFixture = TestBed.createComponent(SignatureInfoComponent);
        signatureComponent = signatureFixture.componentInstance;

        mockEbbService.getCodes.and.resolveTo(ACP_MOCKS.ELIGIBILiTY_CODES_OBJECT);
        mockEbbService.getPublicHousingPrograms.and.resolveTo(ACP_MOCKS.PUBLIC_HOUSING_CODES_OBJECT);
        mockEbbService.getActiveInternalApplication.and.resolveTo({data: acpData});

        mockEbbManager.activeStep.and.returnValue(1);
        mockEbbManager.activeStep = of(1);

        mockEbbManager.acpFlowSelected.and.returnValue('');
        mockEbbManager.acpFlowSelected = of(1);

        mockEbbManager.eligibilityCodeDescs.and.returnValue([ACP_MOCKS.ELIGIBILiTY_CODES_DESCS]);
        mockEbbManager.eligibilityCodeDescs = of([ACP_MOCKS.ELIGIBILiTY_CODES_DESCS]);

        mockEbbManager.codesSubject = new ReplaySubject<any>(1);
        mockEbbManager.codesSubject.next([ACP_MOCKS.ELIGIBILiTY_CODES_DESCS]);

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

            appPersonalInfo = fixture.debugElement.query(By.css('app-personal-info'));
            const stepTitle = fixture.debugElement.query(By.css('#stepTitle')).nativeElement;
            const stepDesc = fixture.debugElement.query(By.css('#stepDesc')).nativeElement;
            const stepExtraDesc = fixture.debugElement.query(By.css('#stepExtraDesc'));

            expect(appPersonalInfo).toBeTruthy();
            expect(stepTitle.innerHTML).toEqual(component.STEPS_CONTENT[1].stepTitle);
            expect(stepDesc.innerHTML).toEqual(component.STEPS_CONTENT[1].stepDesc);
            expect(stepExtraDesc).toBeNull();
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

    it('Should check if the activeStep is 2, so the app-address-info should be rendered in the DOM', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.activeStep = 2;
            fixture.detectChanges();

            appAddressInfo = fixture.debugElement.query(By.css('app-address-info'));
            const stepTitle = fixture.debugElement.query(By.css('#stepTitle')).nativeElement;
            const stepDesc = fixture.debugElement.query(By.css('#stepDesc')).nativeElement;
            const stepExtraDesc = fixture.debugElement.query(By.css('#stepExtraDesc'));

            expect(appAddressInfo).toBeTruthy();
            expect(stepTitle.innerHTML).toEqual(component.STEPS_CONTENT[2].stepTitle);
            expect(stepDesc.innerHTML).toEqual(component.STEPS_CONTENT[2].stepDesc);
            expect(stepExtraDesc).toBeNull();
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

    it('Should check if the activeStep is 3, so the app-child-info should be rendered in the DOM', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.activeStep = 3;
            fixture.detectChanges();

            appChildInfo = fixture.debugElement.query(By.css('app-child-info'));
            const stepTitle = fixture.debugElement.query(By.css('#stepTitle')).nativeElement;
            const stepDesc = fixture.debugElement.query(By.css('#stepDesc')).nativeElement;
            const stepExtraDesc = fixture.debugElement.query(By.css('#stepExtraDesc'));

            expect(appChildInfo).toBeTruthy();
            expect(stepTitle.innerHTML).toEqual(component.STEPS_CONTENT[3].stepTitle);
            expect(stepDesc.innerHTML).toEqual(component.STEPS_CONTENT[3].stepDesc);
            expect(stepExtraDesc).toBeNull();
        });
    }));

    it('Should check if step 3 will have a regular next button', () => {
        component.activeStep = 3;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        expect(nextVerifyButton).toBeDefined();
        expect(nextVerifyButton.innerHTML).toEqual('Next');
    });

    it('Should click on next from the step 3 and make sure that the validateCurrentStep is called', () => {
        component.activeStep = 3;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        nextVerifyButton.click();

        expect(mockEbbManager.validateCurrentStep).toHaveBeenCalledWith(3, true);
    });

    it('Should check if the activeStep is 4, so the app-acp-documents should be rendered in the DOM', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.activeStep = 4;
            component.acpData = acpData;
            fixture.detectChanges();

            const appDocsInfo = fixture.debugElement.query(By.css('app-acp-documents'));
            const stepTitle = fixture.debugElement.query(By.css('#stepTitle')).nativeElement;
            const stepDesc = fixture.debugElement.query(By.css('#stepDesc')).nativeElement;
            const stepExtraDesc = fixture.debugElement.query(By.css('#stepExtraDesc')).nativeElement;

            expect(appDocsInfo).toBeTruthy();
            expect(stepTitle.innerHTML).toEqual(component.STEPS_CONTENT[4].stepTitle);
            expect(stepDesc.innerHTML).toEqual('');
            expect(stepExtraDesc.innerHTML).toEqual(component.STEPS_CONTENT[4].stepExtraDesc);
        });
    }));

    it('Should check if step 4 will have a regular next button', () => {
        component.activeStep = 4;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        expect(nextVerifyButton).toBeDefined();
        expect(nextVerifyButton.innerHTML).toEqual('Next');
    });

    it('Should click on next from the step 4 and make sure that the validateCurrentStep is called', () => {
        component.activeStep = 4;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        nextVerifyButton.click();
        fixture.detectChanges();

        acpDocumentsComponent.docDetails.push({ id: 'generic', closeTab: false, consent: false, category: [], proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK.text });
        acpDocumentsComponent.nextClicked = true;
        documentsFixture.detectChanges();

        const requiredDocumentsMsg = documentsFixture.debugElement.query(By.css('#required-checkbox-msg'));

        expect(mockEbbManager.validateCurrentStep).toHaveBeenCalledWith(4, true);
        expect(requiredDocumentsMsg.nativeElement).toBeDefined();
    });

    it('Should check if the activeStep is 5, so the app-signature-info should be rendered in the DOM', waitForAsync(() => {
        fixture.whenStable().then(() => {
            component.activeStep = 5;
            component.acpData = acpData;
            fixture.detectChanges();

            const appSignatureInfo = fixture.debugElement.query(By.css('app-signature-info'));
            const stepTitle = fixture.debugElement.query(By.css('#stepTitle')).nativeElement;
            const stepDesc = fixture.debugElement.query(By.css('#stepDesc')).nativeElement;
            const stepExtraDesc = fixture.debugElement.query(By.css('#stepExtraDesc')).nativeElement;

            expect(appSignatureInfo).toBeTruthy();
            expect(stepTitle.innerHTML).toEqual(component.STEPS_CONTENT[5].stepTitle);
            expect(stepDesc.innerHTML).toEqual(component.STEPS_CONTENT[5].stepDesc);
            expect(stepExtraDesc.innerHTML).toEqual(component.STEPS_CONTENT[5].stepExtraDesc);
        });
    }));

    it('Should check if Verify button is on step 5', () => {
        component.acpData = acpData;
        component.activeStep = 5;
        fixture.detectChanges();

        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();

        expect(nextVerifyButton).toBeDefined();
        expect(nextVerifyButton.innerHTML).toEqual('Verify');
    });

    it('Should check if user already enrolled then call callGetVerifyAcp', () => {
        spyOn(component, 'callGetVerifyAcp');
        fixture.detectChanges();

        component.enrolled = true;
        component.ebbId = ACP_MOCKS.APPLICATION_ID.ebbId;
        fixture.detectChanges();

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.callGetVerifyAcp).toHaveBeenCalledWith(component.ebbId);
        expect(component.enrolled).toBeTruthy();
    });

    it('Should listens for setUserInfo changes in activeStep = 1 and make sure that validate email and phone is called in the personal component', () => {
        spyOn(personalInfoComponent.setUserInfo, 'emit');
        spyOn(component, 'callCreateInternalApp');
        spyOn(component, 'setPersonalInfo');
        spyOn(personalInfoComponent, 'validateEmailAndPhone');

        personalFixture.detectChanges();
        fixture.detectChanges();

        component.activeStep = 1;
        component.acpData = acpData;
        component.goNext();
        fixture.detectChanges();

        personalInfoComponent.ngOnInit();
        personalFixture.detectChanges();

        expect(personalInfoComponent.validateEmailAndPhone).toHaveBeenCalled();
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

    it('Should listens for setChildInfo changes in activeStep = 3 and make sure that the codes and qualifying forms are all markasTouched in the child component', () => {
        mockEbbManager.activeStep = of(3);

        spyOn(childInfoComponent.setChildInfo, 'emit');
        spyOn(component, 'callCreateInternalApp');
        spyOn(component, 'setBqpUserInfo');

        childFixture.detectChanges();
        fixture.detectChanges();

        component.activeStep = 3;
        component.goNext();
        fixture.detectChanges();

        childInfoComponent.ngOnInit();
        childFixture.detectChanges();

        expect(childInfoComponent.codesForm.touched).toBeTruthy();
        expect(childInfoComponent.qualifyingForm.touched).toBeTruthy();
    });

    it('Should listens for setSignature changes in activeStep = 5 and make sure that the signatureForm is markasTouched in the signature component', () => {
        mockEbbManager.activeStep = of(5);
        mockEbbManager.acpFlowSelected = of('no');

        spyOn(component, 'callCreateInternalApp');
        spyOn(component, 'setSignedValue');
        spyOn(String.prototype, 'toUpperCase')
        spyOn(signatureComponent, 'matchingFullName');

        signatureFixture.detectChanges();
        fixture.detectChanges();

        component.activeStep = 5;
        component.acpData = acpData;
        component.goNext();
        fixture.detectChanges();

        signatureComponent.fullName = 'mirna haddad';
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
        spyOn(component, 'goBack').and.callThrough();
        fixture.detectChanges();

        component.activeStep = 2;
        fixture.detectChanges();

        const backButton = fixture.debugElement.query(By.css('#backBtn')).nativeElement;
        backButton.click();

        appPersonalInfo = fixture.debugElement.query(By.css('app-personal-info'));

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

        component.activeStep = 3;
        fixture.detectChanges();

        const backButton = fixture.debugElement.query(By.css('#backBtn')).nativeElement;
        backButton.click();

        appAddressInfo = fixture.debugElement.query(By.css('app-address-info'));

        expect(mockEbbService.getActiveInternalApplication).toHaveBeenCalled();
        expect(component.goBack).toHaveBeenCalled();
        expect(component.activeStep).toEqual(2);
        expect(appAddressInfo).toBeTruthy();
        expect(backButton).toBeTruthy();
    });

    it('Should click on back when active step is 4 to make sure that the active step will be equals -1 and the rendered compoenent will be the child info', () => {
        spyOn(component, 'goBack').and.callThrough();
        fixture.detectChanges();

        component.activeStep = 4;
        fixture.detectChanges();

        const backButton = fixture.debugElement.query(By.css('#backBtn')).nativeElement;
        backButton.click();

        appChildInfo = fixture.debugElement.query(By.css('app-child-info'));

        expect(mockEbbService.getActiveInternalApplication).toHaveBeenCalled();
        expect(component.goBack).toHaveBeenCalled();
        expect(component.activeStep).toEqual(3);
        expect(appChildInfo).toBeTruthy();
        expect(backButton).toBeTruthy();
    });

    it('Should click on back when active step is 5 to make sure that the active step will be equals -1 and the rendered compoenent will be the acp documents info', () => {
        spyOn(component, 'goBack').and.callThrough();
        fixture.detectChanges();

        component.acpData = acpData;
        component.activeStep = 5;
        fixture.detectChanges();

        const backButton = fixture.debugElement.query(By.css('#backBtn')).nativeElement;
        backButton.click();

        const appDocs = fixture.debugElement.query(By.css('app-acp-documents'));

        expect(mockEbbService.getActiveInternalApplication).toHaveBeenCalled();
        expect(component.goBack).toHaveBeenCalled();
        expect(component.activeStep).toEqual(4);
        expect(appDocs).toBeTruthy();
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