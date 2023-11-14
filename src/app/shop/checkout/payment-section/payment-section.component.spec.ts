import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, IFirebaseAddress, IFirebasePaymentMethod, PlansConfigurationService, UserPlansService } from "@ztarmobile/zwp-service-backend";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EndpointUrl, IGoogleTagManagerEventsConfig, ZMP_G2G_BFF_ENDPOINT_URL } from "@ztarmobile/zwp-service";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireModule } from "@angular/fire/compat";
import { ENV_FIREBASE_CONFIG } from "src/environments/environment";
import { AuthHttp } from "@ztarmobile/zwp-services-auth";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { CheckoutService } from "../checkout.service";
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { PageScrollService } from "ngx-page-scroll-core";
import { PaymentSectionComponent } from "./payment-section.component";

let component: PaymentSectionComponent;
let fixture: ComponentFixture<PaymentSectionComponent>;

let mockActionsAnalyticsService;

fdescribe('Payment section Component - Unit Testing', async () => {

    beforeEach(async () => {

        mockActionsAnalyticsService = jasmine.createSpyObj(['ActionsAnalyticsService', 'trackCheckoutSteps']);

        await TestBed.configureTestingModule({
            declarations: [
                PaymentSectionComponent
            ],
            imports: [
                AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
                ReactiveFormsModule,
                FormsModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                MatDialogModule
            ],
            providers: [
                FormBuilder,
                { provide: EndpointUrl, useValue: true },
                { provide: PlansConfigurationService },
                { provide: AngularFireDatabase },
                UserPlansService,
                AuthHttp,
                HttpClient,
                HttpHandler,
                { provide: ActionsAnalyticsService, useValue: new InjectionToken<IGoogleTagManagerEventsConfig>('GoogleTagManagerEvents') },
                { provide: ToastrService, useValue: ToastrService },
                { provide: ZMP_G2G_BFF_ENDPOINT_URL, useValue: true },
                MatDialog
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        TestBed.overrideProvider(PageScrollService, { useValue: {} });
        TestBed.overrideProvider(ActionsAnalyticsService, { useValue: mockActionsAnalyticsService });
        TestBed.compileComponents();

        fixture = TestBed.createComponent(PaymentSectionComponent);
        component = fixture.componentInstance;

        spyOn(component.router, 'navigate');

        fixture.detectChanges();
    });

    it('Should create a component successfully', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));
    it('Should toggle payWithCash when togglePayWithCash is called', () => {
        component.payWithCash = false;
        component.togglePayWithCash();
        expect(component.payWithCash).toBe(false);
        expect(component.payWithCard).toBe(false);
    });
    it('Should toggle payWithCash to false when it is initially true', () => {
        component.payWithCash = true;
        component.togglePayWithCash();
        expect(component.payWithCash).toBe(true);
        expect(component.payWithCard).toBe(false);
    });
    it('Should reset other properties when resetPayWithCard is called', () => {
        component.payWithCard = true;
        component.selectedPaymentMethod = {} as IFirebasePaymentMethod;
        const billingAdress = { city: 'new york', state: 'NY', country: 'united states', address1: '123 new york' } as IFirebaseAddress;
        component.billingAddress = billingAdress;
        // Call the resetPayWithCard function
        component.resetPayWithCard();
        // Check if the properties are reset as expected
        expect(component.payWithCard).toBe(false);
        expect(component.selectedPaymentMethod).toBeNull();
        expect(component.billingAddress).toEqual({} as IFirebaseAddress);
    });
    it('Should hide the checkout-card div with id pay-with-cash when payWithCash is false', () => {
        component.payWithCash = false;
        fixture.detectChanges();
        const checkoutCardDiv = fixture.nativeElement.querySelector('#pay-with-cash');
        expect(checkoutCardDiv).toBeNull();
    });
    it('Should show the checkout-card div with id pay-with-cash when payWithCash is true', () => {
        component.payWithCash = true;
        component.cart = {} as CustomizableMobilePlan;
        component.cart.cartType = CART_TYPES.GENERIC_CART;
        fixture.detectChanges();
        const checkoutCardDiv = fixture.nativeElement.querySelector('#pay-with-cash');
        expect(checkoutCardDiv).toBeTruthy();
    });
    it('Should call resetPayWithCard when togglePayWithCash is called', () => {
        spyOn(component, 'resetPayWithCard');
        component.togglePayWithCash();
        expect(component.resetPayWithCard).toHaveBeenCalled();
    });

    it('should toggle payWithCash when the input radio button is clicked', () => {
        component.cart = {} as CustomizableMobilePlan;
        component.cart.cartType = CART_TYPES.GENERIC_CART;
        fixture.detectChanges();

        const radioInput = fixture.nativeElement.querySelector('#payWithCash');
        component.payWithCash = false;
        radioInput.click();
        expect(component.payWithCash).toBe(true);
    });
});