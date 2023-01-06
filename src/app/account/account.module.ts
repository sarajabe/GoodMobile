import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountHeaderService } from './account-header.service';
import { WidgetsModule } from 'src/widgets/widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAccountComponent } from './user-account.component';
import { AccountMobileNavbarComponent } from './account-mobile-navbar/account-mobile-navbar.component';
import { AccountNavbarComponent } from './account-navbar/account-navbar.component';
import { AccountPaymentHistoryComponent } from './account-payment-history/account-payment-history.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { TooltipModule } from 'ng2-tooltip-directive';

import { AccountUsageHistoryComponent } from './account-usage-history/account-usage-history.component';
import { AccountPlanAddOnsComponent } from './account-plan-add-ons/account-plan-add-ons.component';
import { PendingActivationsComponent } from './pending-activations/pending-activations.component';
import { AccountManageDeviceComponent } from './account-manage-device/account-manage-device.component';
import { AccountCancelPlanComponent } from './account-cancel-plan/account-cancel-plan.component';
import { AccountCancelPlanFeedbackComponent } from './account-cancel-plan-feedback/account-cancel-plan-feedback.component';
import { AccountPayAndRenewComponent } from './account-pay-and-renew/account-pay-and-renew.component';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AccountOrdersComponent } from './account-orders/account-orders.component';
import { ConfirmationComponent } from './account-orders/confirmation/confirmation.component';
import { ContactFormComponent } from './account-orders/contact-form/contact-form.component';
import { EditShippingAddressComponent } from './account-orders/edit-shipping-address/edit-shipping-address.component';
import { PackageTrackingComponent } from './account-orders/package-tracking/package-tracking.component';
import { ReportIssueComponent } from './account-orders/report-issue/report-issue.component';
import { ShippingDelayedComponent } from './account-orders/shipping-delayed/shipping-delayed.component';
import { AccountPhoneDetailsComponent } from './account-phone-details/account-phone-details.component';
import { ReceiptPageComponent } from './receipt-page/receipt-page.component';
import { NgxPrintModule } from 'ngx-print';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { OrderDetailsComponent } from './account-orders/order-details/order-details.component';
import { AccountAcpApplicationComponent } from './account-acp-application/account-acp-application.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrderNotRecievedComponent } from './account-orders/order-not-recieved/order-not-recieved.component';
import { ReturnDeviceComponent } from './account-orders/return-device/return-device.component';
import { SomethingElseComponent } from './account-orders/something-else/something-else.component';
import { WrongItemsComponent } from './account-orders/wrong-items/wrong-items.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { OrderRmaComponent } from './order-rma/order-rma.component';
import { ReturnReasonComponent } from './order-rma/return-reason/return-reason.component';
import { ChangeOfMindComponent } from './order-rma/change-of-mind/change-of-mind.component';
import { ReturnFormComponent } from './order-rma/return-form/return-form.component';
import { AccountEsimSetupComponent } from './account-esim-setup/account-esim-setup.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [UserAccountComponent,
    AccountMobileNavbarComponent,
    AccountNavbarComponent,
    AccountPaymentHistoryComponent,
    AccountUsageHistoryComponent,
    AccountPlanAddOnsComponent,
    PendingActivationsComponent,
    AccountManageDeviceComponent,
    AccountCancelPlanComponent,
    AccountCancelPlanFeedbackComponent,
    AccountPayAndRenewComponent,
    AccountSummaryComponent,
    AccountSettingsComponent,
    AccountOrdersComponent,
    ConfirmationComponent,
    ContactFormComponent,
    EditShippingAddressComponent,
    PackageTrackingComponent,
    ReportIssueComponent,
    ShippingDelayedComponent,
    AccountPhoneDetailsComponent,
    ReceiptPageComponent,
    AccountAcpApplicationComponent,
    OrderDetailsComponent,
    OrderNotRecievedComponent,
    ReturnDeviceComponent,
    SomethingElseComponent,
    WrongItemsComponent,
    OrderRmaComponent,
    ReturnReasonComponent,
    ChangeOfMindComponent,
    ReturnFormComponent,
    AccountEsimSetupComponent
  ],
  imports: [
    NguiAutoCompleteModule,
    CommonModule,
    AccountRoutingModule,
    WidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgPipesModule,
    TooltipModule,
    ShareButtonModule,
    NgxPrintModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    QRCodeModule,
    NgCircleProgressModule.forRoot({
      showTitle: true,
      showSubtitle: false,
      showUnits: false,
      showInnerStroke: false
    }),
    NgxBarcodeModule
  ],
  providers: [AccountHeaderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule { }
