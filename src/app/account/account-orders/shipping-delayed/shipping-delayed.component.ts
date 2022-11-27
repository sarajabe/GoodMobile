import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shipping-delayed',
  templateUrl: './shipping-delayed.component.html',
  styleUrls: ['./shipping-delayed.component.scss']
})
export class ShippingDelayedComponent implements OnInit {
  @Output() showShippingDelayedSection: EventEmitter<boolean> = new EventEmitter<boolean>();

  public shippingDelayedForm: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.shippingDelayedForm = new FormGroup({
      option: new FormControl('', Validators.required)
    });
  }
  public backToReportIssue(): void {
    this.showShippingDelayedSection.emit(false);
  }
}
