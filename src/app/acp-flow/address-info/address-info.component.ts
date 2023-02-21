import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActionsAnalyticsService, FirebaseEBBService } from '@ztarmobile/zwp-service-backend';
import { IAcpAddress } from '@ztarmobile/zwp-service-backend-v2';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { EBB_NAME_PATTERN } from 'src/app/app.config';
import { EbbManager } from 'src/services/ebb.service';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})
export class AddressInfoComponent implements OnInit, OnChanges {

  @Input() trackingSubscription: Observable<number>;
  @Input() primary: IAcpAddress;
  @Input() mailing: IAcpAddress;
  @Input() userId: string;
  @Input() disable: boolean;
  @Output() setAddresses: EventEmitter<{ primary: IAcpAddress; mail: IAcpAddress }> = new EventEmitter<{ primary: IAcpAddress; mail: IAcpAddress }>();
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  public addressInfoForm: UntypedFormGroup;
  public mailingAddressForm: UntypedFormGroup;
  public primaryAddress: IAcpAddress;
  public mailingAddress: IAcpAddress;
  public useSameAddress = false;
  public namePattern = new RegExp(EBB_NAME_PATTERN);
  public displayedAddressModel: any = {};
  private alive = true;

  constructor(private formBuilder: UntypedFormBuilder, private ebbManager: EbbManager, private firebaseEBBService: FirebaseEBBService,
    private analyticsService: ActionsAnalyticsService) {
    this.addressInfoForm = formBuilder.group({
      address1: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      address2: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      zipCode: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)])],
      city: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\.\s]*$/)])],
      state: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/), Validators.maxLength(2)])]
    });
    this.mailingAddressForm = formBuilder.group({
      address1: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      address2: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      zipCode: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)])],
      city: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\.\s]*$/)])],
      state: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/), Validators.maxLength(2)])]
    });
  }

  ngOnInit(): void {
    this.trackEvent();
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 3) {
        this.addressInfoForm.markAllAsTouched();
        if (!this.useSameAddress) {
          this.mailingAddressForm.markAllAsTouched();
        }
        if (!!this.addressInfoForm.valid && (!!this.useSameAddress || (!this.useSameAddress && this.mailingAddressForm.valid))) {
          this.prepareData();
          this.setAddresses.emit({ primary: this.primaryAddress, mail: this.mailingAddress });          
          this.goToNext.emit(4);
        }
      }
    });
    this.populateForms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.disable) {
      this.disable = changes.disable.currentValue;
      if (!!this.disable) {
        this.addressInfoForm.disable();
        this.mailingAddressForm.disable();
      }
    }
  }
 
  public checkMailingAddress() : void {
    if(!this.useSameAddress) {
      this.mailingAddress = {} as IAcpAddress;
      this.mailingAddressForm.reset();
    }
  }
  private prepareData(): void {
    this.primaryAddress = {} as IAcpAddress;
    this.mailingAddress = {} as IAcpAddress;
    this.primaryAddress.address1 = this.addressInfoForm.controls.address1.value;
    this.primaryAddress.address2 = this.addressInfoForm.controls.address2.value;
    this.primaryAddress.state = this.addressInfoForm.controls.state.value;
    this.primaryAddress.state = !!this.primaryAddress.state ? this.primaryAddress.state.toUpperCase() : this.primaryAddress.state;
    this.primaryAddress.city = this.addressInfoForm.controls.city.value;
    this.primaryAddress.zipCode = this.addressInfoForm.controls.zipCode.value;
    if (!!this.useSameAddress) {
      this.mailingAddress = this.primaryAddress;
    } else {
      this.mailingAddress.address1 = this.mailingAddressForm.controls.address1.value;
      this.mailingAddress.address2 = this.mailingAddressForm.controls.address2.value;
      this.mailingAddress.state = this.mailingAddressForm.controls.state.value;
      this.mailingAddress.city = this.mailingAddressForm.controls.city.value;
      this.mailingAddress.zipCode = this.mailingAddressForm.controls.zipCode.value;
    }
  }

  private populateForms(): void {
    if (!!this.primary) {
      this.addressInfoForm.controls.address1.setValue(this.primary.address1);
      this.addressInfoForm.controls.address2.setValue(this.primary.address2);
      this.addressInfoForm.controls.state.setValue(this.primary.state);
      this.addressInfoForm.controls.city.setValue(this.primary.city);
      this.addressInfoForm.controls.zipCode.setValue(this.primary.zipCode);
    }
    if (!!this.mailing && !!this.mailing.address1) {
      const compare = JSON.stringify(this.mailing).toLowerCase() === JSON.stringify(this.primary).toLowerCase();
      this.useSameAddress = compare;
      this.mailingAddressForm.controls.address1.setValue(this.mailing.address1);
      this.mailingAddressForm.controls.address2.setValue(this.mailing.address2);
      this.mailingAddressForm.controls.state.setValue(this.mailing.state);
      this.mailingAddressForm.controls.city.setValue(this.mailing.city);
      this.mailingAddressForm.controls.zipCode.setValue(this.mailing.zipCode);
    }
  }
  private trackEvent(): void {
    const data = {
      event: 'addresses_Info',
      category: 'ACP',
      label: 'ACP Step 2',
      action: 'verify address'
    }
    this.analyticsService.trackACPEvent(data);
  }
}
