import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { AuthEmailGuardService } from 'src/providers/user-auth-service/auth-email-guard.service';
import { DUPLICATE_PAYMENTS_ROUTE_URLS } from '../app.routes.names';
import { ChangePaymentComponent } from './change-payment/change-payment.component';
import { CheckPaymentsComponent } from './check-payments/check-payments.component';
import { DuplicatePaymentsComponent } from './duplicate-payments.component';
import { PaymentsListComponent } from './payments-list/payments-list.component';

const routes: Routes = [
  {
    path: '', component: DuplicatePaymentsComponent, children: [
      { path: DUPLICATE_PAYMENTS_ROUTE_URLS.PAYMENT_ATTENTION, component: CheckPaymentsComponent, data: { title: 'Attention | Action Required', description: 'Your payment methods need attention' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: DUPLICATE_PAYMENTS_ROUTE_URLS.PAYMENTS_LIST, component: PaymentsListComponent, data: { title: 'Attention | Payments List', description: 'Your payment methods need attention, please update your payment methods as soon as possible to prevent service loss' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: DUPLICATE_PAYMENTS_ROUTE_URLS.CHANGE_PREFERRED_PAYMENT, component: ChangePaymentComponent, data: { title: 'Attention | Change preffered payment', description: 'Your payment methods need attention' } as IPageMeta, canActivate: [AuthEmailGuardService] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuplicatePaymentsRoutingModule { }
