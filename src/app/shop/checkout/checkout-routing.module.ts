import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutPageComponent } from './checkout.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { CHECKOUT_ROUTE_URLS, SHOP_ROUTE_URLS } from '../../app.routes.names';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { ShippingAddressSubpageComponent } from './shipping-address-subpage/shipping-address-subpage.component';
import { PaymentSectionComponent } from './payment-section/payment-section.component';

const routes: Routes = [
  { path: '', component: CheckoutPageComponent, children: [
    {path: CHECKOUT_ROUTE_URLS.NEW_CUSTOMER, redirectTo: `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`, pathMatch: 'full'},
    {path: CHECKOUT_ROUTE_URLS.EXISTING_CUSTOMER, redirectTo: `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`, pathMatch: 'full'},
    {path: CHECKOUT_ROUTE_URLS.SHIPPING_SECTION, component: ShippingAddressSubpageComponent, data: {title: 'Shipping',
    description: 'Enter your shipping details to get your SIM'} as IPageMeta},
    {path: CHECKOUT_ROUTE_URLS.PLACE_ORDER, component: PlaceOrderComponent, data: {title: 'Place your order',
    description: 'Place your order and enjoy Good Mobile services'} as IPageMeta},
    {path: CHECKOUT_ROUTE_URLS.PAYMENT_SECTION, component: PaymentSectionComponent, data: {title: 'Payment',
    description: 'Enter your payment details to proceed with your order'} as IPageMeta},  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
