import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InPersonDeliverySelectorComponent } from "./in-person-delivery-selector.component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ContentfulService } from "src/services/contentful.service";
import { of } from "rxjs";
import { CustomizableMobilePlan, IAcpDevice, MobileCustomPlansService, PlansConfigurationService, UserDevice, UserPlansService } from "@ztarmobile/zwp-service-backend";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EndpointUrl } from "@ztarmobile/zwp-service";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireModule } from "@angular/fire/compat";
import { ENV_FIREBASE_CONFIG } from "src/environments/environment";
import { AuthHttp } from "@ztarmobile/zwp-services-auth";
import { HttpClient, HttpHandler } from "@angular/common/http";

let component: InPersonDeliverySelectorComponent;
let fixture: ComponentFixture<InPersonDeliverySelectorComponent>;

let agentInputField;
let itemInputField;

fdescribe('In Person Delivery Component - Unit Testing', async () => {

    const contentfulServiceMock = {
        getContent: () => {
            return of([{
                fields: {
                    code: '123'
                }
            }]);
        }
    };
    beforeEach(async () => {

        await TestBed.configureTestingModule({
            declarations: [
                InPersonDeliverySelectorComponent
            ],
            imports: [
                AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
                ReactiveFormsModule,
                FormsModule,
                BrowserAnimationsModule
            ],
            providers: [
                FormBuilder,
                { provide: EndpointUrl, useValue: true },
                { provide: PlansConfigurationService },
                { provide: AngularFireDatabase },
                UserPlansService,
                AuthHttp,
                HttpClient,
                HttpHandler
            ]
        });
        TestBed.overrideProvider(ContentfulService, { useValue: contentfulServiceMock });
        TestBed.compileComponents();

        fixture = TestBed.createComponent(InPersonDeliverySelectorComponent);
        component = fixture.componentInstance;

        component.option = 'person';
        agentInputField = component.agentForm.controls.code;
        itemInputField = component.itemsForm.controls.fulfilledItem;

        fixture.detectChanges();
    });

    it('Should create a component successfully', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('Should check that the input is selected', waitForAsync(() => {
        spyOn(component.personOption, 'emit');
        component.selectPersonOption();

        expect(component.option).toEqual('person');
        expect(component.personOption.emit).toHaveBeenCalledWith('person');
    }));

    it('Should test the count of the agent form group element', waitForAsync(() => {
        const agentFormElement = fixture.nativeElement.querySelector('#agentForm');
        const agentFormInputElement = agentFormElement.querySelectorAll('input');

        expect(agentFormInputElement.length).toEqual(1);
    }));

    it('Should set agent field as required when value is empty', waitForAsync(() => {
        agentInputField.setValue('');

        component.agentForm.markAllAsTouched();
        fixture.detectChanges();

        const requiredAgentMsg = fixture.debugElement.query(By.css('#required-agent-msg'));

        expect(agentInputField.errors.required).toBeTruthy();
        expect(requiredAgentMsg.nativeElement).toBeDefined();

        expect(component.agentForm.valid).toBeFalsy();
    }));

    it('should set isAgentCodeVerified to false when the code not exists', waitForAsync(() => {
        component.agentForm.controls.code.setValue('333');
        spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();

        expect(component.isAgentCodeVerified).toBe(false);
        expect(component.isValidateClicked.emit).toHaveBeenCalledWith(false);
        expect(component.showSideBar).toBe(false);
    }));

    it('should set isAgentCodeVerified to true when the code exists', waitForAsync(() => {
        component.agentForm.controls.code.setValue('123');
        spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();

        expect(component.isAgentCodeVerified).toBe(true);
        expect(component.showSideBar).toBe(true);
    }));

    it('Should test the count of the items form group element', waitForAsync(() => {
        component.agentForm.controls.code.setValue('123');
        spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();
        fixture.detectChanges();

        const itemsFormElement = fixture.nativeElement.querySelector('#itemsForm');
        const itemsFormInputElement = itemsFormElement.querySelectorAll('input');

        expect(itemsFormInputElement.length).toEqual(1);
    }));

    it('Should set item field as required when value is empty', waitForAsync(() => {
        component.agentForm.controls.code.setValue('123');
        spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();
        fixture.detectChanges();

        itemInputField.setValue('');

        component.itemsForm.markAllAsTouched();
        fixture.detectChanges();

        const requiredItemMsg = fixture.debugElement.query(By.css('#required-item-msg'));

        expect(itemInputField.errors.required).toBeTruthy();
        expect(requiredItemMsg.nativeElement).toBeDefined();

        expect(component.itemsForm.valid).toBeFalsy();
    }));

    it('Should set item field as invalid when value is invalid ( Activation Code )', waitForAsync(() => {
        component.agentForm.controls.code.setValue('123');
        spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();
        fixture.detectChanges();

        component.cart = {} as CustomizableMobilePlan;
        component.cart.planDevice = {} as UserDevice;

        itemInputField.setValue('000');
        itemInputField.markAsTouched();
        component.itemsForm.markAllAsTouched();

        component.addValidatorsForFulfillItem();
        fixture.detectChanges();

        const invalidItemMsg = fixture.debugElement.query(By.css('#invalid-item-msg'));

        expect(itemInputField.hasError('pattern')).toBeTruthy();
        expect(itemInputField.hasError('minlength')).toBeFalsy();
        expect(invalidItemMsg.nativeElement).toBeDefined();

        expect(component.itemsForm.valid).toBeFalsy();
    }));

    it('Should set item field as invalid when value is invalid ( Device IMEI )', waitForAsync(() => {
        component.agentForm.controls.code.setValue('123');
        spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();
        fixture.detectChanges();

        component.cart = {} as CustomizableMobilePlan;
        component.cart.acpDevice = {} as IAcpDevice;

        itemInputField.setValue('14555');
        itemInputField.markAsTouched();
        component.itemsForm.markAllAsTouched();

        component.addValidatorsForFulfillItem();
        fixture.detectChanges();

        const invalidItemMsg = fixture.debugElement.query(By.css('#invalid-item-msg'));

        expect(itemInputField.hasError('pattern')).toBeFalsy();
        expect(itemInputField.hasError('minlength')).toBeTruthy();
        expect(invalidItemMsg.nativeElement).toBeDefined();

        expect(component.itemsForm.valid).toBeFalsy();
    }));

    it('Should not call submitItems and emit isValidateClicked when form is invalid', () => {
        component.agentForm.controls.code.setValue('123');
        const isValidateClickedEmitSpy = spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();
        fixture.detectChanges();

        itemInputField.setValue('');
        const submitButton = fixture.debugElement.query(By.css('#submit'));
        fixture.detectChanges();

        component.cart = {} as CustomizableMobilePlan;
        fixture.detectChanges();

        const handleSuccessOverviewSpy = spyOn(component, 'handleSuccessOverview');
        const submitItemsSpy = spyOn(component, 'submitItems').and.callThrough();
        fixture.detectChanges();

        submitButton.nativeElement.click();

        expect(submitItemsSpy).toHaveBeenCalled();
        expect(isValidateClickedEmitSpy).toHaveBeenCalledWith(false);
        expect(handleSuccessOverviewSpy).not.toHaveBeenCalledWith();
    });

    it('Should call submitItems for cart with ACP device and emit isValidateClicked when form is valid', () => {
        component.agentForm.controls.code.setValue('123');
        const isValidateClickedEmitSpy = spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();
        fixture.detectChanges();

        itemInputField.setValue('123456');
        const submitButton = fixture.debugElement.query(By.css('#submit'));
        fixture.detectChanges();

        component.cart = {} as CustomizableMobilePlan;
        component.cart.acpDevice = {} as IAcpDevice;
        fixture.detectChanges();

        const handleSuccessOverviewSpy = spyOn(component, 'handleSuccessOverview').and.callThrough();
        const mobileCustomPlansService = TestBed.inject(MobileCustomPlansService);
        spyOn(mobileCustomPlansService, 'setAcpDevice');
        spyOn(mobileCustomPlansService, 'setPlanDevice');
        const submitItemsSpy = spyOn(component, 'submitItems').and.callThrough();
        fixture.detectChanges();

        submitButton.nativeElement.click();

        expect(submitItemsSpy).toHaveBeenCalled();
        expect(isValidateClickedEmitSpy).toHaveBeenCalledWith(true);
        expect(handleSuccessOverviewSpy).toHaveBeenCalledWith();
        expect(mobileCustomPlansService.setAcpDevice).toHaveBeenCalledWith(component.fulfilledAcpDevice);
        expect(mobileCustomPlansService.setPlanDevice).not.toHaveBeenCalled();
    });

    it('Should call submitItems for cart with Plan device and emit isValidateClicked when form is valid', () => {
        component.agentForm.controls.code.setValue('123');
        const isValidateClickedEmitSpy = spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();
        fixture.detectChanges();

        itemInputField.setValue('123456');
        const submitButton = fixture.debugElement.query(By.css('#submit'));
        fixture.detectChanges();

        component.cart = {} as CustomizableMobilePlan;
        component.cart.planDevice = {} as UserDevice;
        fixture.detectChanges();

        const handleSuccessOverviewSpy = spyOn(component, 'handleSuccessOverview').and.callThrough();
        const mobileCustomPlansService = TestBed.inject(MobileCustomPlansService);
        spyOn(mobileCustomPlansService, 'setAcpDevice');
        spyOn(mobileCustomPlansService, 'setPlanDevice');
        const submitItemsSpy = spyOn(component, 'submitItems').and.callThrough();
        fixture.detectChanges();

        submitButton.nativeElement.click();

        expect(submitItemsSpy).toHaveBeenCalled();
        expect(isValidateClickedEmitSpy).toHaveBeenCalledWith(true);
        expect(handleSuccessOverviewSpy).toHaveBeenCalledWith();
        expect(mobileCustomPlansService.setPlanDevice).toHaveBeenCalledWith(component.fulfilledPlanDevice);
        expect(mobileCustomPlansService.setAcpDevice).not.toHaveBeenCalled();
    });
});