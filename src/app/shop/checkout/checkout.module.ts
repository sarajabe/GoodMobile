import { CUSTOM_ELEMENTS_SCHEMA , NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from 'src/widgets/widgets.module';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutPageComponent } from './checkout.component';
import { CheckoutService } from './checkout.service';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { ShippingAddressSubpageComponent } from './shipping-address-subpage/shipping-address-subpage.component';
import { VoucherPaymentSectionComponent } from './voucher-payment-section/voucher-payment-section.component';
import { PaymentSectionComponent } from './payment-section/payment-section.component';


@NgModule({
  declarations: [CheckoutPageComponent, PlaceOrderComponent, ShippingAddressSubpageComponent, VoucherPaymentSectionComponent, PaymentSectionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetsModule,
    CheckoutRoutingModule
  ],
  providers: [CheckoutService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutModule { }
