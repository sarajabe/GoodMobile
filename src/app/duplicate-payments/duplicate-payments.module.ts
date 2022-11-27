import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from 'src/widgets/widgets.module';
import { DuplicatePaymentsRoutingModule } from './duplicate-payments-routing.module';
import { DuplicatePaymentsComponent } from './duplicate-payments.component';
import { CheckPaymentsComponent } from './check-payments/check-payments.component';
import { PaymentsListComponent } from './payments-list/payments-list.component';
import { ChangePaymentComponent } from './change-payment/change-payment.component';



@NgModule({
  declarations: [DuplicatePaymentsComponent, CheckPaymentsComponent, PaymentsListComponent, ChangePaymentComponent],
  imports: [
    CommonModule,
    DuplicatePaymentsRoutingModule,
    WidgetsModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DuplicatePaymentsModule { }
