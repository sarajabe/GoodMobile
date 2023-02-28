import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseEBBService, FirebaseUserProfileService, IFirebaseEbbDetails, IUser, IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { MatDialogRef } from '@angular/material/dialog';
import { PageScrollService } from 'ngx-page-scroll-core';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { InformationMessageModalComponent, InformationMessageModalContext } from 'src/modals/information-message-modal/information-message-modal.component';
import { ModalHelperService, ModalSetting } from 'src/services/modal-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS, ROUTE_URLS } from '../../app.routes.names';
import { AcpValidationComponent } from './acp-validation.component';
fdescribe('AcpValidationComponent', () => {
    let component: AcpValidationComponent;
    let fixture: ComponentFixture<AcpValidationComponent>;
    let informationMessageModalComponent: InformationMessageModalComponent;
    let informationMessageModalfixture: ComponentFixture<InformationMessageModalComponent>;
    let mockFirebaseEBBService;
    let mockEbbService;
    let mockUserPlansService;
    let mockFirebaseUserProfileService;
    let mockModalHelperService;
    const PLANS = [
        {
            activationCode: '0494791',
            autoRenewPlan: true,
            basePlan: {
                cycleDays: 0,
                ebb: false,
                id: 'GOODMOBILE-6GB-30',
                parentId: 'GOODMOBILE-UNLIMITED-CATEGORY',
                price: 25,
                promoMoPrice: 0,
                promoted: true,
                specialPromotion: {
                    promotionAmount: 0,
                    promotionCycles: 1,
                    promotionDescription: 'First 3 months for 50% discount',
                    promotionDiscount: '50%',
                    promotionTitle: '3-month introductory at our lowest price ever'
                },
                subscriptionCycles: 1,
                subtitle: '3GB 4G LTE',
                title: 'Unlimited Talk, Text & Data',
                type: 'base-plan',
                unlimited: true
            },
            cartType: 'new_plan',
            createdAt: 1645701146256,
            id: '-MwfQeP8xm9JmjakEJyk',
            mdn: '5122031956',
            noPlan: false,
            orderId: 'BWVOYIGCBCK6FNI1',
            orderShipMethod: 'usps_first_class_mail/letter',
            orders: {
                BWVOYIGCBCK6FNI1: {
                    intent: 'NEW',
                    orderId: 'BWVOYIGCBCK6FNI1'
                }
            },
            paymentMethodId: '060046714620220224',
            planDevice: {
                brand: 'Apple',
                capableOf5G: false,
                compatible: true,
                eSimCapable: false,
                equipmentType: '4GLTE',
                iccidRequired: false,
                id: '353260073063169',
                make: 'Apple',
                manufacturer: 'Apple',
                marketingName: 'iPhone 6S',
                model: 'iPhone 6S (A1633)',
                network: 'tmo',
                networkType: 'GSM',
                os: 'iOS',
                portRequired: false,
                postalCode: '00962',
                serialNumber: '353260073063169',
                serialType: 'imei',
                simSize: 'Nano',
                skuIdentifier: 'T',
                skuNumber: 'SIMGWLTMO4GLTE',
                technology: 'LTE',
                valid: true
            },
            serverSyncTimestamp: '2022-02-24T05:14:02.920902-06:00[US/Central]',
            shippingAddress: {
                address1: '800 North 23rd Street',
                address2: '',
                alias: 'rashed rabadi',
                city: 'Philadelphia',
                country: 'United States',
                id: '-MwfQeFE_JwD6NDxhPhp',
                postalCode: '19130',
                state: 'PA'
            },
            shippingAddressId: '-MwfQeFE_JwD6NDxhPhp',
            showActivationNotification: true,
            simsQuantity: 1,
            title: 'Unlimited Talk, Text & Data',
            transactionId: '3aac22c8-0593-4e83-82dc-e6594b956cb7',
            trialPlanId: '',
            updatedAt: 1645701242924,
            userId: 'zRIcMhANxvSmKnWTu7MJ7kEQ43u1'
        }
    ];
    const USER = {
        createdAt: 1642697057082,
        customerId: 'A6426970504',
        email: 'rashed.rabadi@pavocom.com',
        firstName: 'Rashed',
        id: 'zRIcMhANxvSmKnWTu7MJ7kEQ43u1',
        lastName: 'Rabadi',
        paymentMethods: [
            {
                address1: '800 North 23rd Street',
                address2: '',
                alias: 'VISA Ending in 1111',
                brand: 'VISA',
                city: 'Philadelphia',
                country: 'United States',
                defaultCreditCard: false,
                expirationDate: '0430',
                fullName: 'rashed rabadi',
                id: '666114721020220224',
                isDefault: true,
                last4: '1111',
                lastUpdate: 1645721456215,
                method: 'Credit Card',
                name: 'rashed rabadi',
                postalCode: '19130',
                state: 'PA',
                updatedAt: 1645721456215
            },
            {
                address1: '800 North 23rd Street',
                alias: 'VISA Ending in 1111',
                brand: 'VISA',
                city: 'Philadelphia',
                country: 'United States',
                defaultCreditCard: false,
                expirationDate: '0431',
                fullName: 'rashed rabadi',
                id: '060046714620220224',
                isDefault: true,
                last4: '1111',
                lastUpdate: 1645701145617,
                method: 'Credit Card',
                name: 'rashed rabadi',
                postalCode: '19130',
                state: 'PA',
                updatedAt: 1645701145617
            }
        ],
        shippingAddresses: [
            {
                address1: '800 North 23rd Street',
                address2: '',
                city: 'Philadelphia',
                country: 'United States',
                createdAt: 1645701145620,
                id: '-MwfQeFE_JwD6NDxhPhp',
                isDefault: true,
                name: 'rashed rabadi',
                postalCode: '19130',
                state: 'PA'
            }
        ],
        updatedAt: 1645785895947,
        verified: false,
        fullName: 'Rashed Rabadi'
    };
    const IUSER = {} as IUser;
    const DATA_OBJECT = {
        data: {
            eligibilityCodes: [
                { code: 'Medicaid ' }, { code: 'Supplemental Nutrition Assistance Program (SNAP) ' },
                { code: 'School Lunch/Breakfast Program ' }
            ]
        }
    };
    const MODAL_CONTEXT = {
        message: 'ACP Plan Exist',
        title: true,
        btnText: 'Account Summary',
        btnUrl: `${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`,
        hasCloseLink: false,
        customClass: '',
        customHTML: '',
        cancelBtn: false,
        cancelText: '',
        noteText: 'You already have a Federal Affordable Connectivity plan!'
    } as InformationMessageModalContext;
    const mockedDialog = { result: true, context: MODAL_CONTEXT, setCloseGuard: () => { } };
    @Component({ selector: 'app-invisible-recaptcha', template: '' })
    class MockRecaptchaComponent { }
    beforeEach(async () => {
        mockEbbService = jasmine.createSpyObj(['EBBService', 'sign', 'verifyACP', 'logVerifyError', 'getACPApplicationStatus', 'getCodes']);
        mockFirebaseEBBService = jasmine.createSpyObj(['FirebaseEBBService', 'clearEBBDetails', 'saveEbbDetails', 'ebbDetails']);
        mockUserPlansService = jasmine.createSpyObj(['UserPlansService', 'userPlans']);
        mockFirebaseUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
        mockModalHelperService = jasmine.createSpyObj(['ModalHelperService', 'showInformationMessageModal', 'setCloseGuard']);
        await TestBed.configureTestingModule({
            declarations: [AcpValidationComponent, InformationMessageModalComponent, MockRecaptchaComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                NgxPrintModule,
                ToastrModule.forRoot()
            ],
            providers: [
                { provide: EbbService },
                { provide: ToastrService, useValue: ToastrService },
                { provide: FirebaseEBBService },
                { provide: ModalHelperService },
                { provide: UserPlansService },
                { provide: PageScrollService },
                { provide: FirebaseUserProfileService },
                { provide: MatDialogRef },
                { provide: InvisibleRecaptchaComponent, useClass: MockRecaptchaComponent },
                { provide: ReCaptchaComponent, useClass: MockRecaptchaComponent },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        TestBed.overrideProvider(EbbService, { useValue: mockEbbService });
        TestBed.overrideProvider(FirebaseEBBService, { useValue: mockFirebaseEBBService });
        TestBed.overrideProvider(UserPlansService, { useValue: mockUserPlansService });
        TestBed.overrideProvider(FirebaseUserProfileService, { useValue: mockFirebaseUserProfileService });
        TestBed.overrideProvider(ModalHelperService, { useValue: mockModalHelperService });
        TestBed.overrideProvider(MatDialogRef, { useValue: mockedDialog });
        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AcpValidationComponent);
        component = fixture.componentInstance;
        informationMessageModalfixture = TestBed.createComponent(InformationMessageModalComponent);
        informationMessageModalComponent = informationMessageModalfixture.componentInstance;
        component.captchaValid = true;
        component.SITE_ID = INVISIBLE_CAPTCHA_ID;
        mockFirebaseEBBService.ebbDetails.and.returnValue({} as IFirebaseEbbDetails);
        mockFirebaseEBBService.ebbDetails = of({});
        mockUserPlansService.userPlans.and.returnValue(PLANS);
        mockUserPlansService.userPlans = of(PLANS);
        mockFirebaseUserProfileService.userProfileObservable.and.returnValue(USER);
        mockFirebaseUserProfileService.userProfileObservable = of(USER);
        mockEbbService.getCodes.and.resolveTo(DATA_OBJECT);
        mockModalHelperService.setCloseGuard.and.resolveTo(mockedDialog);
        mockModalHelperService.showInformationMessageModal.and.resolveTo(mockedDialog);
        component.userProfile = IUSER;
        spyOn(component.router, 'navigate');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should check if Verfy is on step 4 instead of step 3', () => {
        component.activeStep = 4;
        fixture.detectChanges();
        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();
        expect(nextVerifyButton).toBeDefined();
        expect(nextVerifyButton.innerHTML).toEqual('Verify');
    });
    it('should check if step 3 will have a regular next button', () => {
        component.activeStep = 3;
        fixture.detectChanges();
        const nextVerifyButton = fixture.debugElement.query(By.css('#next-verify-button')).nativeElement;
        fixture.detectChanges();
        expect(nextVerifyButton).toBeDefined();
        expect(nextVerifyButton.innerHTML).toEqual('Next');
    });
    it('should check if the user already enrolled and purchased the ACP plan (he completed the step5) a popup will appear', () => {
        component.activeStep = 5;
        component.alreadyEnrolled = true;
        component.isActivatedWithEbbPlan = true;
        component.router.url.includes(ACP_ROUTE_URLS.BASE);
        fixture.detectChanges();
        fixture.detectChanges();
        const submitButton = fixture.debugElement.query(By.css('#submit-button')).nativeElement;
        fixture.detectChanges();
        submitButton.click();
        fixture.detectChanges();
        expect(submitButton.innerHTML).toEqual('Submit');
    });
});

