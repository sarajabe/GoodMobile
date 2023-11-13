import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EnrollmentAddNewLineComponent } from './enrollment-add-new-line.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ENV_FIREBASE_CONFIG } from 'src/environments/environment';
import { ActionsAnalyticsService, CART_TYPES, MobileCustomPlansService, PlacesAutocompleteService } from '@ztarmobile/zwp-service-backend';
import { EndpointUrl, IGoogleTagManagerEventsConfig, ZMP_G2G_BFF_ENDPOINT_URL } from '@ztarmobile/zwp-service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppState } from 'src/app/app.service';
import { EbbService, OrdersService } from '@ztarmobile/zwp-service-backend-v2';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ToastrService } from 'ngx-toastr';
import { InjectionToken } from '@angular/core';
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
    mockMobileCustomPlansService = jasmine.createSpyObj(['MobileCustomPlansService', 'setPlanDevice', 'setPlanExpectedDevice', 'setBasePlan', 'setCartType', 'setMarketingObject', 'seteSIM', 'setQrScanned', 'setStorePickup', 'setActivePlanId', 'clearUserCart', 'isConfigurationReady', 'currentPlan']);

    await TestBed.configureTestingModule({
      declarations: [EnrollmentAddNewLineComponent],
      imports: [
        AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        MatAutocompleteModule
      ],
      providers: [
        PlacesAutocompleteService,
        { provide: EndpointUrl, useValue: true },
        HttpClient,
        HttpHandler,
        AppState,
        EbbService,
        { provide: ZMP_G2G_BFF_ENDPOINT_URL, useValue: true },
        { provide: ToastrHelperService },
        { provide: ToastrService, useValue: ToastrService },
        { provide: ActionsAnalyticsService, useValue: new InjectionToken<IGoogleTagManagerEventsConfig>('GoogleTagManagerEvents') },
      ]
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

    fixture.detectChanges();
  });

  it('Should create a component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('Should not place an order when conditions are not met', fakeAsync(() => {
    // that make the conditions false.
    component.option = 'person';
    component.isPersonStepValidated = false;
    fixture.detectChanges();

    // const mockResponse = new Error({message: 'error'});
    const ordersService = TestBed.inject(OrdersService);
    spyOn(ordersService, 'placeOrder').and.returnValue(Promise.reject({message: 'error'}));
    spyOn(component, 'clearCart');
    fixture.detectChanges();

    component.purchasePlan();
    tick(1000);

    // Assertions to check that the service and router methods are not called
    expect(component.clearCart).not.toHaveBeenCalled();
    expect(ordersService.placeOrder).not.toHaveBeenCalled();
    expect(component.router.navigate).not.toHaveBeenCalled();
    expect(component.planPuchasedClicked).toBeTruthy();
    expect(component.planPurchased).toBeFalsy();
    expect(mockMobileCustomPlansService.clearUserCart).toHaveBeenCalled();
  }));

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
});
