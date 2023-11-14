import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EnrollmentAddNewLineComponent } from './enrollment-add-new-line.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ENV_FIREBASE_CONFIG } from 'src/environments/environment';
import { ActionsAnalyticsService, CART_TYPES, MobileCustomPlansService, MobilePlanItem, PlacesAutocompleteService } from '@ztarmobile/zwp-service-backend';
import { EndpointUrl, IGoogleTagManagerEventsConfig, ZMP_G2G_BFF_ENDPOINT_URL } from '@ztarmobile/zwp-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppState } from 'src/app/app.service';
import { EbbService, OrdersService } from '@ztarmobile/zwp-service-backend-v2';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { of } from 'rxjs';

fdescribe('EnrollmentAddNewLineComponent', () => {

  const CART = { cart: true };

  let component: EnrollmentAddNewLineComponent;
  let fixture: ComponentFixture<EnrollmentAddNewLineComponent>;

  let mockAnalytics;
  let mockMobileCustomPlansService;

  beforeEach(async () => {
    mockAnalytics = jasmine.createSpyObj(['ActionsAnalyticsService', 'trackACPEvent', 'trackSucceededCheckout']);
    mockMobileCustomPlansService = jasmine.createSpyObj(['MobileCustomPlansService', 'setPlanDevice', 'setPlanExpectedDevice', 'setBasePlan', 'setCartType', 'setMarketingObject', 'seteSIM', 'setQrScanned', 'setStorePickup', 'setActivePlanId', 'clearUserCart', 'isConfigurationReady', 'currentPlan', 'allBasePlans']);

    await TestBed.configureTestingModule({
      declarations: [EnrollmentAddNewLineComponent],
      imports: [
        AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        MatAutocompleteModule,
        HttpClientTestingModule
      ],
      providers: [
        PlacesAutocompleteService,
        { provide: EndpointUrl, useValue: true },
        AppState,
        EbbService,
        { provide: ZMP_G2G_BFF_ENDPOINT_URL, useValue: true },
        { provide: ToastrHelperService },
        { provide: ToastrService, useValue: ToastrService },
        { provide: ActionsAnalyticsService, useValue: new InjectionToken<IGoogleTagManagerEventsConfig>('GoogleTagManagerEvents') },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    TestBed.overrideProvider(PageScrollService, { useValue: {} });
    TestBed.overrideProvider(ActionsAnalyticsService, { useValue: mockAnalytics });
    TestBed.overrideProvider(MobileCustomPlansService, { useValue: mockMobileCustomPlansService });
    TestBed.compileComponents();

    fixture = TestBed.createComponent(EnrollmentAddNewLineComponent);
    component = fixture.componentInstance;

    spyOn(component.router, 'navigate');
    mockMobileCustomPlansService.isConfigurationReady.and.returnValue(CART);
    mockMobileCustomPlansService.isConfigurationReady = of(true);
    mockMobileCustomPlansService.currentPlan.and.returnValue(CART);
    mockMobileCustomPlansService.currentPlan = of(true);
    mockMobileCustomPlansService.allBasePlans = [{} as MobilePlanItem];

    fixture.detectChanges();
  });

  it('Should create a component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('Should place an order when conditions are met for In Person Delivery', fakeAsync(() => {
    component.option = 'person';
    component.isPersonStepValidated = true;
    component.newMobileServiceFrom.controls.imei.setValue('359367214299213');
    component.newMobileServiceFrom.controls.address.setValue('123 dallas texas');
    fixture.detectChanges();

    spyOn(component, 'clearCart');
    const ordersService = TestBed.inject(OrdersService);
    spyOn(ordersService, 'placeOrder').and.returnValue(Promise.resolve({ userPlanId: '456', orderId: 'testorder' }));

    component.purchasePlan();
    const data = {
      autoRenewPlan: true,
      haseSIM: false,
      deliveryMethod: 'inPersonDelivery'
    };
    fixture.detectChanges();
    tick(500);

    // Assertions to check that the service and router methods are called
    expect(component.clearCart).toHaveBeenCalled();
    expect(ordersService.placeOrder).toHaveBeenCalledWith(data);
    expect(component.planPuchasedClicked).toBeTruthy();
    expect(component.planPurchased).toBeTruthy();

    expect(mockMobileCustomPlansService.setPlanDevice).not.toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setPlanExpectedDevice).toHaveBeenCalledWith(null);
    expect(mockMobileCustomPlansService.setBasePlan).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setCartType).toHaveBeenCalledWith(CART_TYPES.NEW_PLAN);
    expect(mockMobileCustomPlansService.setMarketingObject).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.seteSIM).not.toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setQrScanned).not.toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setStorePickup).not.toHaveBeenCalled();

    expect(component.router.navigate).toHaveBeenCalledWith([
      `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`,
      {
        [ROUTE_URLS.PARAMS.USER_ORDER_ID]: 'testorder',
        [ROUTE_URLS.PARAMS.USER_PLAN_ID]: '456',
        [ROUTE_URLS.PARAMS.SELECTED_PLAN]: '456'
      }
    ]);
  }));
  it('Should place an order when conditions are met for home Delivery', fakeAsync(() => {
    component.option = 'home';
    component.isAddressVerified = true;
    component.selectedShippingAddress = { address1: '123 dallas texas', id: '12344', city: 'Dallas', state: 'TX', postalCode: '73301', country: 'united states', alias: 'home', isDefault: false };
    component.newMobileServiceFrom.controls.imei.setValue('359367214299213');
    component.newMobileServiceFrom.controls.address.setValue('123 dallas texas');
    fixture.detectChanges();

    spyOn(component, 'clearCart');
    const ordersService = TestBed.inject(OrdersService);
    spyOn(ordersService, 'placeOrder').and.returnValue(Promise.resolve({ userPlanId: '456', orderId: 'testorder' }));

    component.purchasePlan();
    const data = {
      autoRenewPlan: true,
      orderShipMethod: "usps_first_class_mail/letter",
      shippingAddress: { id: '12344' },
      haseSIM: false,
      deliveryMethod: 'homeDelivery'
    };
    fixture.detectChanges();
    tick(500);

    // Assertions to check that the service and router methods are called
    expect(component.clearCart).toHaveBeenCalled();
    expect(ordersService.placeOrder).toHaveBeenCalledWith(data);
    expect(component.planPuchasedClicked).toBeTruthy();
    expect(component.planPurchased).toBeTruthy();

    expect(mockMobileCustomPlansService.setPlanDevice).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setPlanExpectedDevice).toHaveBeenCalledWith(null);
    expect(mockMobileCustomPlansService.setBasePlan).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setCartType).toHaveBeenCalledWith(CART_TYPES.NEW_PLAN);
    expect(mockMobileCustomPlansService.setMarketingObject).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.seteSIM).not.toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setQrScanned).not.toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setStorePickup).not.toHaveBeenCalled();

    expect(component.router.navigate).toHaveBeenCalledWith([
      `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`,
      {
        [ROUTE_URLS.PARAMS.USER_ORDER_ID]: 'testorder',
        [ROUTE_URLS.PARAMS.USER_PLAN_ID]: '456',
        [ROUTE_URLS.PARAMS.SELECTED_PLAN]: '456'
      }
    ]);
  }));
  it('Should place an order when conditions are met for store pickup', fakeAsync(() => {
    component.option = 'store';
    component.barCode = true;
    component.selectedShippingAddress = { address1: '123 dallas texas', id: '12344', city: 'Dallas', state: 'TX', postalCode: '73301', country: 'united states', alias: 'home', isDefault: false };
    component.newMobileServiceFrom.controls.imei.setValue('359367214299213');
    component.newMobileServiceFrom.controls.address.setValue('123 dallas texas');
    fixture.detectChanges();

    spyOn(component, 'clearCart');
    const ordersService = TestBed.inject(OrdersService);
    spyOn(ordersService, 'placeOrder').and.returnValue(Promise.resolve({ userPlanId: '456', orderId: 'testorder' }));

    component.purchasePlan();
    const data = {
      autoRenewPlan: true,
      haseSIM: false,
      deliveryMethod: 'storePickup'
    };
    fixture.detectChanges();
    tick(500);

    // Assertions to check that the service and router methods are called
    expect(component.clearCart).toHaveBeenCalled();
    expect(ordersService.placeOrder).toHaveBeenCalledWith(data);
    expect(component.planPuchasedClicked).toBeTruthy();
    expect(component.planPurchased).toBeTruthy();

    expect(mockMobileCustomPlansService.setPlanDevice).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setPlanExpectedDevice).toHaveBeenCalledWith(null);
    expect(mockMobileCustomPlansService.setBasePlan).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setCartType).toHaveBeenCalledWith(CART_TYPES.NEW_PLAN);
    expect(mockMobileCustomPlansService.setMarketingObject).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.seteSIM).not.toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setQrScanned).not.toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setStorePickup).toHaveBeenCalled();

    expect(component.router.navigate).toHaveBeenCalledWith([
      `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`,
      {
        [ROUTE_URLS.PARAMS.USER_ORDER_ID]: 'testorder',
        [ROUTE_URLS.PARAMS.USER_PLAN_ID]: '456',
        [ROUTE_URLS.PARAMS.SELECTED_PLAN]: '456'
      }
    ]);
  }));
  it('Should place an order when conditions are met for eSim', fakeAsync(() => {
    component.newMobileServiceFrom.controls.imei.setValue('359367214299213');
    component.newMobileServiceFrom.controls.address.setValue('123 dallas texas');
    fixture.detectChanges();

    spyOn(component, 'clearCart');
    const ordersService = TestBed.inject(OrdersService);
    spyOn(ordersService, 'placeOrder').and.returnValue(Promise.resolve({ userPlanId: '456', orderId: 'testorder' }));

    component.purchasePlan(true);
    const data = {
      autoRenewPlan: true,
      haseSIM: true,
      deliveryMethod: null
    };
    fixture.detectChanges();
    tick(500);

    // Assertions to check that the service and router methods are called
    expect(component.clearCart).toHaveBeenCalled();
    expect(ordersService.placeOrder).toHaveBeenCalledWith(data);
    expect(component.planPuchasedClicked).toBeTruthy();
    expect(component.planPurchased).toBeTruthy();

    expect(mockMobileCustomPlansService.setPlanDevice).not.toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setPlanExpectedDevice).toHaveBeenCalledWith(null);
    expect(mockMobileCustomPlansService.setBasePlan).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setCartType).toHaveBeenCalledWith(CART_TYPES.NEW_PLAN);
    expect(mockMobileCustomPlansService.setMarketingObject).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.seteSIM).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setQrScanned).toHaveBeenCalled();
    expect(mockMobileCustomPlansService.setStorePickup).not.toHaveBeenCalled();

    expect(component.router.navigate).toHaveBeenCalledWith([
      `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`,
      {
        [ROUTE_URLS.PARAMS.USER_ORDER_ID]: 'testorder',
        [ROUTE_URLS.PARAMS.USER_PLAN_ID]: '456',
        [ROUTE_URLS.PARAMS.SELECTED_PLAN]: '456'
      }
    ]);
  }));
  it('Should not place an order when conditions are not met', fakeAsync(() => {
    // that make the conditions false.
    component.option = 'person';
    component.isPersonStepValidated = true;
    fixture.detectChanges();

    spyOn(component, 'clearCart');

    const ordersService = TestBed.inject(OrdersService);
    spyOn(ordersService, 'placeOrder').and.returnValue(Promise.resolve());

    component.purchasePlan();
    fixture.detectChanges();
    tick(500);

    // Assert: Check the expected behavior
    expect(component.clearCart).not.toHaveBeenCalled();
    expect(ordersService.placeOrder).not.toHaveBeenCalled();
    expect(component.router.navigate).not.toHaveBeenCalled();
  }));

});
