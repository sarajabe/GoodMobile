import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shipping-delayed',
  templateUrl: './shipping-delayed.component.html',
  styleUrls: ['./shipping-delayed.component.scss']
})
export class ShippingDelayedComponent implements OnInit {
  @Output() showShippingDelayedSection: EventEmitter<boolean> = new EventEmitter<boolean>();

  public shippingDelayedForm: UntypedFormGroup;
  constructor() { }

  ngOnInit(): void {
    this.shippingDelayedForm = new UntypedFormGroup({
      option: new UntypedFormControl('', Validators.required)
    });
  }
  public backToReportIssue(): void {
    this.showShippingDelayedSection.emit(false);
  }
}
