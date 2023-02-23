import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointUrl } from '@ztarmobile/zwp-service';
import { UserPlansService } from '@ztarmobile/zwp-service-backend';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { of } from 'rxjs';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';
import { SelectLineComponent } from './select-line.component';

describe('SelectLineComponent', () => {
  let component: SelectLineComponent;
  let fixture: ComponentFixture<SelectLineComponent>;
  let mockSimpleAuthService;
  let mockUserPlansService;
  const AUTH_STATE_OBJECT = { authState: true };
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
        subtitle: '6GB 4G LTE ',
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
  beforeEach(async () => {
    mockSimpleAuthService = jasmine.createSpyObj(['SimpleAuthService', 'userState']);
    mockUserPlansService = jasmine.createSpyObj(['UserPlansService', 'userPlans']);

    await TestBed.configureTestingModule({
      declarations: [SelectLineComponent, PhonePipe],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: SimpleAuthService },
        { provide: UserPlansService },
        { provide: EndpointUrl },
      ]
    });
    TestBed.overrideProvider(SimpleAuthService, { useValue: mockSimpleAuthService });
    TestBed.overrideProvider(UserPlansService, { useValue: mockUserPlansService });
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLineComponent);
    component = fixture.componentInstance;
    spyOn(component.router, 'navigate');
    mockSimpleAuthService.userState.and.returnValue(AUTH_STATE_OBJECT);
    mockSimpleAuthService.userState = of(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    mockUserPlansService.userPlans.and.returnValue(PLANS_OBJECT);
    mockUserPlansService.userPlans = of(PLANS_OBJECT);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should check if initially both add new line and current mobile number radio buttons are not selected', () => {
    mockUserPlansService.userPlans.and.returnValue(PLANS_OBJECT);
    mockUserPlansService.userPlans = of(PLANS_OBJECT);
    fixture.detectChanges();
    const addNewLine = fixture.debugElement.query(By.css('#add-new-line')).nativeElement;
    const currentMobile = fixture.debugElement.query(By.css('#current-mobile')).nativeElement;
    fixture.detectChanges();
    expect(addNewLine.clicked).toBeFalsy();
    expect(currentMobile.clicked).toBeFalsy();
    expect(component.isNewMobileService).toBeFalsy();
    expect(component.isCurrentMobileNumber).toBeFalsy();
  });
  it('should check if the user selects current mobile number while not logged in then the sign in section will be shown', () => {
    mockUserPlansService.userPlans.and.returnValue(PLANS_OBJECT);
    mockUserPlansService.userPlans = of(PLANS_OBJECT);
    fixture.detectChanges();
    component.isLoggedIn = false;
    fixture.detectChanges();
    const currentMobile = fixture.debugElement.query(By.css('#current-mobile')).nativeElement;
    fixture.detectChanges();
    currentMobile.click();
    fixture.detectChanges();
    const loginBtn = fixture.debugElement.query(By.css('#login-section')).nativeElement;
    expect(currentMobile.clicked).toBeFalsy();
    expect(component.isNewMobileService).toBeFalsy();
    expect(component.isCurrentMobileNumber).toBeTruthy();
    expect(loginBtn).toBeDefined();
  });
  it('Should check if the user selects current mobile number while logged in but he has no active plans then the validation message will appear', waitForAsync(() => {
    mockUserPlansService.userPlans.and.returnValue({});
    mockUserPlansService.userPlans = of({});
    fixture.detectChanges();
    component.isLoggedIn = true;
    component.hasActivePlans = false;
    component.isCurrentMobileNumber = true;
    fixture.detectChanges();
    const noActivePlansValidation = fixture.debugElement.query(By.css('#no-active-plans-validation')).nativeElement;
    fixture.detectChanges();
    expect(component.isNewMobileService).toBeFalsy();
    expect(component.isCurrentMobileNumber).toBeTruthy();
    expect(noActivePlansValidation).toBeDefined();
  }));
  it('Should check Test if the user selects current mobile number while logged in and he has active plans then the dropdown with mdns will appear', () => {
    mockUserPlansService.userPlans.and.returnValue(PLANS_OBJECT);
    mockUserPlansService.userPlans = of(PLANS_OBJECT);
    fixture.detectChanges();
    component.isLoggedIn = true;
    component.hasActivePlans = true;
    component.isCurrentMobileNumber = true;
    fixture.detectChanges();
    const phonePlanDropDwon = fixture.debugElement.query(By.css('#phonePlan')).nativeElement;
    fixture.detectChanges();
    expect(component.isNewMobileService).toBeFalsy();
    expect(component.isCurrentMobileNumber).toBeTruthy();
    expect(phonePlanDropDwon).toBeDefined();
  });
});
