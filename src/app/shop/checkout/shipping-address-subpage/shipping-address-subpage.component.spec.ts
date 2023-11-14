import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActionsAnalyticsService, PlansConfigurationService, UserPlansService } from "@ztarmobile/zwp-service-backend";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EndpointUrl, IGoogleTagManagerEventsConfig, ZMP_G2G_BFF_ENDPOINT_URL } from "@ztarmobile/zwp-service";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireModule } from "@angular/fire/compat";
import { ENV_FIREBASE_CONFIG } from "src/environments/environment";
import { AuthHttp } from "@ztarmobile/zwp-services-auth";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { ShippingAddressSubpageComponent } from "./shipping-address-subpage.component";
import { CheckoutService } from "../checkout.service";
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { PageScrollService } from "ngx-page-scroll-core";

let component: ShippingAddressSubpageComponent;
let fixture: ComponentFixture<ShippingAddressSubpageComponent>;

let mockActionsAnalyticsService;

fdescribe('Shipping Address Subpage Component - Unit Testing', async () => {

    beforeEach(async () => {

        mockActionsAnalyticsService = jasmine.createSpyObj(['ActionsAnalyticsService', 'trackCheckoutSteps']);

        await TestBed.configureTestingModule({
            declarations: [
                ShippingAddressSubpageComponent
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

        fixture = TestBed.createComponent(ShippingAddressSubpageComponent);
        component = fixture.componentInstance;

        spyOn(component.router, 'navigate');

        fixture.detectChanges();
    });

    it('Should create a component successfully', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('Should set option when selectPersonOption is called with a truthy event', () => {
        const event = 'person';
        component.selectPersonOption(event);
    
        expect(component.option).toBe(event);
      });
    
      it('Should not set option when selectPersonOption is called with a falsy event', () => {
        component.option = 'person';
        component.selectPersonOption(null);
    
        expect(component.option).toBe('person');
      });
    
      it('Should set isPersonStepValidated when validatePersonStep is called with a truthy event', () => {
        const event = true;
        component.validatePersonStep(event);
    
        expect(component.isPersonStepValidated).toBe(event);
      });
    
      it('Should set isPersonStepValidated when validatePersonStep is called with a falsy event', () => {
        const event = false;
        component.validatePersonStep(event);
    
        expect(component.isPersonStepValidated).toBe(event);
      });
});