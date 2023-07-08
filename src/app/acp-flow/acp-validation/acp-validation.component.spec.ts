import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseEBBService, FirebaseUserProfileService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { PageScrollService } from 'ngx-page-scroll-core';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { InformationMessageModalComponent } from 'src/modals/information-message-modal/information-message-modal.component';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { AcpValidationComponent } from './acp-validation.component';
import { EbbManager } from 'src/services/ebb.service';
fdescribe('AcpValidationComponent', () => {
    let component: AcpValidationComponent;
    let fixture: ComponentFixture<AcpValidationComponent>;
    let mockEbbService;
    let mockFirebaseUserProfileService;
    let mockModalHelperService;
    let mockEbbManager;

    @Component({ selector: 'app-invisible-recaptcha', template: '' })
    class MockRecaptchaComponent { }
    beforeEach(async () => {
        mockEbbService = jasmine.createSpyObj(['EBBService', 'verifyACP', 'logVerifyError', 'getACPApplicationStatus', 'getActiveInternalApplication', 'createInternalApplication', 'verifyACPWithOrWithoutAppId', 'getCodes', 'getPublicHousingPrograms']);
        mockFirebaseUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
        mockModalHelperService = jasmine.createSpyObj(['ModalHelperService', 'showInformationMessageModal', 'closeDialog']);
        mockEbbManager = jasmine.createSpyObj(['EbbManager', 'activeStep', 'validateCurrentStep', 'acpFlowSelected', 'eligibilityCodeDescs', 'setCodesDescs']);
        await TestBed.configureTestingModule({
            declarations: [AcpValidationComponent, InformationMessageModalComponent, MockRecaptchaComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                NgxPrintModule,
                ToastrModule.forRoot()
            ],
            providers: [
                { provide: PageScrollService},
                { provide: EbbService },
                { provide: EbbManager },
                { provide: ToastrService, useValue: ToastrService },
                { provide: FirebaseEBBService },
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
        TestBed.overrideProvider(EbbManager, { useValue: mockEbbManager });
        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AcpValidationComponent);
        fixture.detectChanges();
    });

    it('should create', () => {
       // expect(component).toBeTruthy();
    });
});

