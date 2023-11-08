import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomizableMobilePlan, IAcpDevice, MobileCustomPlansService, UserDevice } from '@ztarmobile/zwp-service-backend';
import { drawerSlideInOutAnimation, drawerFadeInOutAnimation } from 'src/app/app.animations';
import { ContentfulService } from 'src/services/contentful.service';

@Component({
    selector: 'app-in-person-delivery-selector',
    templateUrl: './in-person-delivery-selector.component.html',
    styleUrls: ['./in-person-delivery-selector.component.scss'],
    animations: [drawerSlideInOutAnimation, drawerFadeInOutAnimation],
})

export class InPersonDeliverySelectorComponent implements OnInit {
    @Output() personOption: EventEmitter<string> = new EventEmitter<string>();
    @Output() isValidateClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() option;
    @Input() cart: CustomizableMobilePlan;

    public agentForm: FormGroup;
    public itemsForm: FormGroup;
    public fulfilledPlanDevice = {} as UserDevice;
    public fulfilledAcpDevice = {} as IAcpDevice;
    public agentCodes = [];
    public isAgentCodeVerified = false;
    public isValidateButtonClicked = false;
    public showSideBar = false;
    public showActivationCodeBox = false;
    public innerWidth;
    public isFulfilledItem = false;

    constructor(
        private contentfulService: ContentfulService,
        private formBuilder: FormBuilder,
        private renderer: Renderer2,
        private mobilePlansService: MobileCustomPlansService) {

        this.agentForm = formBuilder.group({
            code: ['', Validators.required]
        });

        this.itemsForm = formBuilder.group({
            fulfilledItem: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.innerWidth = window.screen.width;
        this.contentfulService.getContent('agentCodes').subscribe(res => {
            if (!!res && res?.length > 0) {
                this.agentCodes = res;
            }
        });
    }

    public validateAgentCode(): void {
        this.agentForm.markAllAsTouched();
        this.isValidateButtonClicked = true;
        if (!!this.agentForm.valid) {
            if (this.agentCodes.some(code => code?.fields?.code === this.agentForm?.controls?.code?.value)) {
                this.isAgentCodeVerified = true;
                this.showSideBar = true;
            } else {
                this.isAgentCodeVerified = false;
                this.isValidateClicked.emit(false);
                this.showSideBar = false;
            }
            this.checkDrawer();
        }
    }

    public submitItems(): void {
        this.itemsForm.markAllAsTouched();
        if (!!this.itemsForm.valid && !!this.cart) {
            const fulfilledObject = {
                fulfillmentData: {
                    value: this.itemsForm.controls.fulfilledItem.value
                }
            };
            if (!!this.cart?.acpDevice) {
                this.fulfilledAcpDevice = Object.assign(this.cart?.acpDevice, fulfilledObject);
                this.mobilePlansService.setAcpDevice(this.fulfilledAcpDevice);
                this.handleSuccessOverview();
            } else if (!!this.cart?.planDevice) {
                this.fulfilledPlanDevice = Object.assign(this.cart?.planDevice, fulfilledObject);
                this.mobilePlansService.setPlanDevice(this.fulfilledPlanDevice);
                this.handleSuccessOverview();
            }
        } else {
            this.isValidateClicked.emit(false);
        }
    }

    public handleSuccessOverview(): void {
        this.isValidateClicked.emit(true);
        this.showSideBar = false;
        this.checkDrawer();
        this.isFulfilledItem = true;
    }

    public selectPersonOption(): void {
        this.personOption.emit(this.option);
    }

    public checkDrawer(): void {
        if (!!this.showSideBar) {
            this.renderer.addClass(document.body, 'modal-open');
            this.renderer.removeClass(document.body, 'modal-closed');
        } else {
            this.renderer.removeClass(document.body, 'modal-open');
            this.renderer.addClass(document.body, 'modal-closed');
        }
    }

    public addValidatorsForFulfillItem(): void {
        if (!!this.cart) {
            if (!!this.cart?.acpDevice) {
                this.itemsForm.controls.fulfilledItem.setValidators([
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(11),
                        Validators.maxLength(18)
                    ]),
                ]);
                this.itemsForm.controls.fulfilledItem.updateValueAndValidity();
            } else if (!!this.cart?.planDevice) {
                this.itemsForm.controls.fulfilledItem.setValidators([
                    Validators.compose([
                        Validators.required,
                        Validators.pattern('^[A-Z]+\\d{6}|\\d{7}$')
                    ]),
                ]);
                this.itemsForm.controls.fulfilledItem.updateValueAndValidity();
            }
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event): void {
        this.innerWidth = window.screen.width;
    }
}