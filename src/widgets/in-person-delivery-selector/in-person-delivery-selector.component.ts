import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentfulService } from 'src/services/contentful.service';

@Component({
    selector: 'app-in-person-delivery-selector',
    templateUrl: './in-person-delivery-selector.component.html',
    styleUrls: ['./in-person-delivery-selector.component.scss']
})
export class InPersonDeliverySelectorComponent implements OnInit {
    @Output() personOption: EventEmitter<string> = new EventEmitter<string>();
    @Output() isValidateClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() option;

    public isAgentCodeVerified = false;
    public agentForm: FormGroup;
    public agentCodes = [];
    public isValidateButtonClicked = false;

    constructor(
        private contentfulService: ContentfulService,
        private formBuilder: FormBuilder) {

        this.agentForm = formBuilder.group({
            code: ['', Validators.required]
        });
    }

    ngOnInit(): void {
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
                this.isValidateClicked.emit(true);
            } else {
                this.isAgentCodeVerified = false;
                this.isValidateClicked.emit(false);
            }
        }
    }

    public selectPersonOption(): void {
        this.personOption.emit(this.option);
    }
}