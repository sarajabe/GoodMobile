import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { InPersonDeliverySelectorComponent } from "./in-person-delivery-selector.component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ContentfulService } from "src/services/contentful.service";
import { of } from "rxjs";

let component: InPersonDeliverySelectorComponent;
let fixture: ComponentFixture<InPersonDeliverySelectorComponent>;

let agentInputField;

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
                ReactiveFormsModule,
                FormsModule
            ],
            providers: [
                FormBuilder
            ]
        });
        TestBed.overrideProvider(ContentfulService, { useValue: contentfulServiceMock });
        TestBed.compileComponents();

        fixture = TestBed.createComponent(InPersonDeliverySelectorComponent);
        component = fixture.componentInstance;

        component.option = 'person';
        agentInputField = component.agentForm.controls.code;

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

    it('Should test the count of the form group element', waitForAsync(() => {
        const agentFormElement = fixture.nativeElement.querySelector('form');
        const agentFormInputElement = agentFormElement.querySelectorAll('input');

        expect(agentFormInputElement.length).toEqual(1);
    }));

    it('Should set field as required when value is empty', waitForAsync(() => {
        agentInputField.setValue('');

        component.agentForm.markAllAsTouched();
        fixture.detectChanges();

        const requiredAgentMsg = fixture.debugElement.query(By.css('#required-agent-msg'));

        expect(agentInputField.errors.required).toBeTruthy();
        expect(requiredAgentMsg.nativeElement).toBeDefined();

        expect(component.agentForm.valid).toBeFalsy();
    }));

    it('should set isAgentCodeVerified to true when the code exists', () => {
        component.agentForm.controls.code.setValue('123');
        spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();

        expect(component.isAgentCodeVerified).toBe(true);
        expect(component.isValidateClicked.emit).toHaveBeenCalledWith(true);
    });
    it('should set isAgentCodeVerified to true when the code exists', () => {
        component.agentForm.controls.code.setValue('333');
        spyOn(component.isValidateClicked, 'emit');
        component.validateAgentCode();

        expect(component.isAgentCodeVerified).toBe(false);
        expect(component.isValidateClicked.emit).toHaveBeenCalledWith(false);
    });
});