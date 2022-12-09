import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointUrl } from '@ztarmobile/zwp-service';
import { CustomizableMobilePlan, MobileCustomPlansService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { CustomFormsModule } from 'ng4-validators';
import { of } from 'rxjs';
import { PhoneManagementService } from 'src/services/phones.service';
import { AddPhoneStepsComponent } from './add-phone-steps.component';

describe('AddPhoneStepsComponent', () => {
  let component: AddPhoneStepsComponent;
  let fixture: ComponentFixture<AddPhoneStepsComponent>;
  let mockUserPlansService;
  let mockMobileCustomPlansService;
  let mockPhoneManagementService;
  const PLANS_OBJECT = [
    {
      activationCode: '9548993',
      autoRenewPlan: true,
      basePlan: {
        cycleDays: 0,
        ebb: false,
        id: 'GOODMOBILE-6GB-30',
        parentId: 'GOODMOBILE-UNLIMITED-CATEGORY',
        price: 25,
        promoMoPrice: 0,
        promoted: true,
        renewDate: '2022-03-26T00:00:00-05:00',
        subscriptionCycles: 1,
        subtitle: '2GB 4G LTE ',
        title: 'Unlimited Talk, Text & Data',
        type: 'base-plan',
        unlimited: true
      },
      cartType: 'new_plan',
      createdAt: 1645721461005,
      id: '-Mwgd9-e9b1N0TSHgXQf',
      mdn: '9395776000',
      noPlan: false,
      orderId: 'UP5WKSITR2BU9ALT',
      orderShipMethod: 'usps_first_class_mail/letter',
      orders: {
        UP5WKSITR2BU9ALT: {
          intent: 'NEW',
          orderId: 'UP5WKSITR2BU9ALT'
        }
      },
      paymentMethodId: '666114721020220224',
      planDevice: {
        brand: 'Apple',
        capableOf5G: false,
        compatible: true,
        eSimCapable: false,
        equipmentType: '4GLTE',
        iccidRequired: false,
        id: '353260073063169',
        make: 'Apple',
        manufacturer: 'apple',
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
      serverSyncTimestamp: '2022-02-25T04:40:30.110937-06:00[US/Central]',
      shippingAddress: {
        address1: '800 North 23rd Street',
        address2: '',
        city: 'Philadelphia',
        country: 'United States',
        createdAt: 1645701145620,
        id: '-MwfQeFE_JwD6NDxhPhp',
        name: 'rashed rabadi',
        postalCode: '19130',
        state: 'PA'
      },
      shippingAddressId: '-MwfQeFE_JwD6NDxhPhp',
      showActivationNotification: true,
      simsQuantity: 1,
      title: 'Unlimited Talk, Text & Data',
      transactionId: 'd69706f3-02e6-451a-8748-0946928c70b3',
      trialPlanId: '',
      updatedAt: 1645785630114,
      userId: 'zRIcMhANxvSmKnWTu7MJ7kEQ43u1'
    }
  ];
  const CART = {} as CustomizableMobilePlan;
  beforeEach(async () => {
    mockUserPlansService = jasmine.createSpyObj(['UserPlansService', 'userPlans']);
    mockMobileCustomPlansService = jasmine.createSpyObj(['MobileCustomPlansService', 'currentPlan']);
    mockPhoneManagementService = jasmine.createSpyObj(['PhoneManagementService', 'setPlanFlow', 'planFlow', 'activeStep', 'selectedOption', 'validProcess', 'declinedTerms']);
    await TestBed.configureTestingModule({
      declarations: [AddPhoneStepsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CustomFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: EndpointUrl },
        { provide: UserPlansService },
        { provide: MobileCustomPlansService },
        { provide: PhoneManagementService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    TestBed.overrideProvider(UserPlansService, { useValue: mockUserPlansService });
    TestBed.overrideProvider(MobileCustomPlansService, { useValue: mockMobileCustomPlansService });
    TestBed.overrideProvider(PhoneManagementService, { useValue: mockPhoneManagementService });
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhoneStepsComponent);
    component = fixture.componentInstance;
    spyOn(component.router, 'navigate');
    mockUserPlansService.userPlans.and.returnValue(PLANS_OBJECT);
    mockUserPlansService.userPlans = of(PLANS_OBJECT);
    mockPhoneManagementService.planFlow.and.returnValue(true);
    mockPhoneManagementService.planFlow = of(true);
    mockPhoneManagementService.activeStep.and.returnValue(1);
    mockPhoneManagementService.activeStep = of(1);
    mockPhoneManagementService.validProcess.and.returnValue(true);
    mockPhoneManagementService.validProcess = of(true);
    mockPhoneManagementService.declinedTerms.and.returnValue(true);
    mockPhoneManagementService.declinedTerms = of(true);
    mockPhoneManagementService.selectedOption.and.returnValue('new');
    mockPhoneManagementService.selectedOption = of('new');
    mockMobileCustomPlansService.currentPlan.and.returnValue(CART);
    mockMobileCustomPlansService.currentPlan = of(CART);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should check If none of the options selected and the user click on next an error message should appear', () => {
    component.showSelectionError = true;
    fixture.detectChanges();
    const noneSelection = fixture.debugElement.query(By.css('#none-selection-validation')).nativeElement;
    fixture.detectChanges();
    expect(noneSelection).toBeTruthy();
  });
});
