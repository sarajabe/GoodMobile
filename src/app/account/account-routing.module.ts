import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { AuthEmailGuardService } from 'src/providers/user-auth-service/auth-email-guard.service';
import { ACCOUNT_ROUTE_URLS, LOGIN_ROUTE_URLS } from '../app.routes.names';
import { AccountCancelPlanFeedbackComponent } from './account-cancel-plan-feedback/account-cancel-plan-feedback.component';
import { AccountCancelPlanComponent } from './account-cancel-plan/account-cancel-plan.component';
import { AccountManageDeviceComponent } from './account-manage-device/account-manage-device.component';
import { AccountOrdersComponent } from './account-orders/account-orders.component';
import { ConfirmationComponent } from './account-orders/confirmation/confirmation.component';
import { PackageTrackingComponent } from './account-orders/package-tracking/package-tracking.component';
import { ReportIssueComponent } from './account-orders/report-issue/report-issue.component';
import { AccountPayAndRenewComponent } from './account-pay-and-renew/account-pay-and-renew.component';
import { AccountPaymentHistoryComponent } from './account-payment-history/account-payment-history.component';
import { AccountPlanAddOnsComponent } from './account-plan-add-ons/account-plan-add-ons.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { AccountUsageHistoryComponent } from './account-usage-history/account-usage-history.component';
import { PendingActivationsComponent } from './pending-activations/pending-activations.component';
import { UserAccountComponent } from './user-account.component';
import { AccountPhoneDetailsComponent } from './account-phone-details/account-phone-details.component';
import { ReceiptPageComponent } from './receipt-page/receipt-page.component';
import { ReceiptResolverService } from 'src/services/receipt-resolver.service';
import { OrderDetailsComponent } from './account-orders/order-details/order-details.component';
import { AccountAcpApplicationComponent } from './account-acp-application/account-acp-application.component';
import { OrderNotRecievedComponent } from './account-orders/order-not-recieved/order-not-recieved.component';
import { ReturnDeviceComponent } from './account-orders/return-device/return-device.component';
import { SomethingElseComponent } from './account-orders/something-else/something-else.component';
import { EditShippingAddressComponent } from './account-orders/edit-shipping-address/edit-shipping-address.component';
import { WrongItemsComponent } from './account-orders/wrong-items/wrong-items.component';
import { OrderRmaComponent } from './order-rma/order-rma.component';
import { ReturnReasonComponent } from './order-rma/return-reason/return-reason.component';
import { ChangeOfMindComponent } from './order-rma/change-of-mind/change-of-mind.component';
import { ReturnFormComponent } from './order-rma/return-form/return-form.component';
import { AccountEsimSetupComponent } from './account-esim-setup/account-esim-setup.component';

const routes: Routes = [
  {
    path: '', component: UserAccountComponent, children: [
      { path: ACCOUNT_ROUTE_URLS.PAYMENTS, component: AccountPaymentHistoryComponent, data: { title: 'GoodMobile | Payment History', description: 'Access your account payments and reciepts easily' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.USAGE, component: AccountUsageHistoryComponent, data: { title: 'Usage History' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.PLAN_ADD_ONS, component: AccountPlanAddOnsComponent, data: { title: 'Plan addOns' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      {
        path: ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS, component: PendingActivationsComponent, data: {
          title: 'Purchased Plans'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      { path: ACCOUNT_ROUTE_URLS.MANAGE_DEVICES, component: AccountManageDeviceComponent, data: { title: 'Manage Devices' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.CANCEL_PLAN, component: AccountCancelPlanComponent, data: { title: 'Cancel plan' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      {
        path: ACCOUNT_ROUTE_URLS.USER_CANCEL_PLAN_FEEDBACK, component: AccountCancelPlanFeedbackComponent, data: {
          title: 'Feedback'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      {
        path: ACCOUNT_ROUTE_URLS.PAYMENTS_RECEIPT_DETAILS, component: ReceiptPageComponent, resolve: { receipt: ReceiptResolverService }, data: {
          title: 'Receipt details'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      {
        path: ACCOUNT_ROUTE_URLS.ORDERS_RECEIPT_DETAILS, component: ReceiptPageComponent, resolve: { receipt: ReceiptResolverService }, data: {
          title: 'Receipt details'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      {
        path: ACCOUNT_ROUTE_URLS.PAY_AND_RENEW, component: AccountPayAndRenewComponent, data: {
          title: 'Account Pay and Renew'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      { path: ACCOUNT_ROUTE_URLS.ORDER_DETAILS, component: OrderDetailsComponent, data: { title: 'Order Details', description: 'Check all your order details' } as IPageMeta,
        canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.ORDERS, component: AccountOrdersComponent, data: { title: 'Orders' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.ORDER_NOT_RECIEVED, component: OrderNotRecievedComponent, data: { title: 'Order Not Recieved' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.RETURN_DEVICE, component: ReturnDeviceComponent, data: { title: 'Return Device' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.SOMETHING_ELSE, component: SomethingElseComponent, data: { title: 'Something Else' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.ACP_APPLICATION, component: AccountAcpApplicationComponent, data: { title: 'ACP application' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.EDIT_ADDRESS, component: EditShippingAddressComponent, data: { title: 'Edit Order Address ' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.WRONG_ITEMS, component: WrongItemsComponent, data: { title: 'Wrong or missing items ' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.REPORT_ISSUE, component: ReportIssueComponent, data: { title: 'Report an issue' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.SUMMARY, component: AccountSummaryComponent, data: { title: 'Account Summary' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.SETTINGS, component: AccountSettingsComponent, data: { title: 'Settings' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACCOUNT_ROUTE_URLS.PHONE_DETAILS, component: AccountPhoneDetailsComponent, data: {title: 'Phone Details'} as IPageMeta, canActivate: [AuthEmailGuardService]},
      // { path: ACCOUNT_ROUTE_URLS.RMA, data: {title: '', description: 'Friends who are new to GoodMobile get $10 and you get $10 after they activate their first purchase'} as IPageMeta, canActivate: [AuthEmailGuardService], 
      //   children: [
      //   {
      //      path: '',
      //      component: OrderRmaComponent
      //   },
      //   {
      //      path: ACCOUNT_ROUTE_URLS.RETUREN_REASON, data: {title: 'Device Return | Reason', description: 'Please select why do you want to return your device.'},
      //      component: ReturnReasonComponent,
      //   },
      //   {
      //     path: ACCOUNT_ROUTE_URLS.CHANGE_OF_MIND, data: {title: 'Device Return | Change of Mind', description: 'Change of mind about the purchased device'},
      //     component: ChangeOfMindComponent,
      //   },
      //   {
      //     path: ACCOUNT_ROUTE_URLS.RETURN_FORM, data: {title: 'Device Return | Form', description: 'Please fill the details required for the return details'},
      //     component: ReturnFormComponent,
      //   },
      // ]},
      // { path: ACCOUNT_ROUTE_URLS.ESIM_SETUP, component: AccountEsimSetupComponent, canActivate: [AuthEmailGuardService]},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
