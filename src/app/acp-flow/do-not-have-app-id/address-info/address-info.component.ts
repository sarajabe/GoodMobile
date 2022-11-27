import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAcpAddress } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { EbbManager } from 'src/services/ebb.service';

@Component({
  selector: 'app-non-appId-existing-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})
export class AddressInfoNonAppExisitngComponent implements OnInit, OnChanges {
  @Input() disable: boolean;
  @Input() address: IAcpAddress;
  @Output() setAddresses: EventEmitter<IAcpAddress> = new EventEmitter<IAcpAddress>();
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();

  public addressInfoForm: FormGroup;
  public userAddress: IAcpAddress = {} as IAcpAddress;
  private alive = true;
  constructor(private formBuilder: FormBuilder, private ebbManager: EbbManager) {
    this.addressInfoForm = this.formBuilder.group({
      address1: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      address2: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      zipCode: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)])],
      city: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\.\s]*$/)])],
      state: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/), Validators.maxLength(2)])]
    });
   }

  ngOnInit(): void {
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 2) {
        this.addressInfoForm.markAllAsTouched();
        if (!!this.addressInfoForm.valid) {
          this.userAddress.address1 = this.addressInfoForm?.controls.address1.value;
          this.userAddress.address2 = this.addressInfoForm?.controls.address2.value;
          this.userAddress.state = this.addressInfoForm?.controls.state.value;
          this.userAddress.state = !!this.userAddress.state ? this.userAddress.state.toUpperCase() : this.userAddress.state;
          this.userAddress.city = this.addressInfoForm?.controls.city.value;
          this.userAddress.zipCode = this.addressInfoForm?.controls.zipCode.value;
          this.setAddresses.emit(this.userAddress);
          this.goToNext.emit(3);
        }
      }
    });
    if(!!this.address) {
      this.addressInfoForm.controls.address1.setValue(this.address.address1);
      this.addressInfoForm.controls.address2.setValue(this.address.address2);
      this.addressInfoForm.controls.state.setValue(this.address.state);
      this.addressInfoForm.controls.city.setValue(this.address.city);
      this.addressInfoForm.controls.zipCode.setValue(this.address.zipCode);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.disable) {
      this.disable = changes.disable.currentValue;
      if (!!this.disable) {
        this.addressInfoForm.disable();
      }
    }
  }
}
