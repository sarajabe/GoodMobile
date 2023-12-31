import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsModule } from '../widgets/widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageAddressModalComponent } from './manage-address-modal/manage-address-modal.component';
import { ManagePaymentSpecificModalComponent } from './manage-payment-specific-modal/manage-payment-specific-modal.component';
import { ConfirmMessageModalComponent } from './confirm-message-modal/confirm-message-modal.component';
import { ConfirmPasswordModalComponent } from './confirm-password-modal/confirm-password-modal.component';
import { InformationMessageModalComponent } from './information-message-modal/information-message-modal.component';
import { AddActivatedNumberModalComponent } from './add-activated-number-modal/add-activated-number-modal.component';
import { InputModalComponent } from './input-modal/input-modal.component';
import { RoutingModalComponent } from './routing-modal/routing-modal.component';
import { EditCcModalComponent } from './edit-cc-modal/edit-cc-modal.component';
import { SelectPaymentModalComponent } from './select-payment-modal/select-payment-modal.component';
import { ShippingAddressModalComponent } from './shipping-address-modal/shipping-address-modal.component';
import { SimReplacementModalComponent } from './sim-replacement-modal/sim-replacement-modal.component';
import { WifiCallingModalComponent } from './wifi-calling-modal/wifi-calling-modal.component';
import { FiveGModalComponent } from './five-gmodal/five-gmodal.component';
import { OutOfStockItemModalComponent } from './out-of-stock-item-modal/out-of-stock-item-modal.component';
import { AcpModalComponent } from './acp-modal/acp-modal.component';
import { PhoneNotImpactedModalComponent } from './phone-not-impacted-modal/phone-not-impacted-modal.component';
import { TrackingModalComponent } from './tracking-details-modal/tracking-details-modal.component';
import { MdnsListModalComponent } from './mdns-list-modal/mdns-list-modal.component';
import { CompatibilitySkipModalComponent } from './compatibility-skip-modal/compatibility-skip-modal.component';
import { eSimReplacementModalComponent } from './esim-replacement-modal/esim-replacement-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BarCodeModalComponent } from './bar-code-modal/bar-code-modal.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { AlertSecurityModalComponent } from './alert-security-modal/alert-security-modal.component';


@NgModule({
    declarations: [ManageAddressModalComponent, ManagePaymentSpecificModalComponent, ConfirmMessageModalComponent, ConfirmPasswordModalComponent,
        InformationMessageModalComponent,
        AddActivatedNumberModalComponent,
        InputModalComponent,
        RoutingModalComponent,
        EditCcModalComponent,
        SelectPaymentModalComponent,
        ShippingAddressModalComponent,
        SimReplacementModalComponent,
        WifiCallingModalComponent,
        FiveGModalComponent,
        OutOfStockItemModalComponent,
        AcpModalComponent,
        PhoneNotImpactedModalComponent,
        MdnsListModalComponent,
        TrackingModalComponent,
        eSimReplacementModalComponent,
        CompatibilitySkipModalComponent,
        BarCodeModalComponent,
        AlertSecurityModalComponent],
    imports: [
        CommonModule, WidgetsModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, NgxBarcode6Module
    ],
    exports: [ManageAddressModalComponent, ManagePaymentSpecificModalComponent, ConfirmMessageModalComponent, ConfirmPasswordModalComponent,
        InformationMessageModalComponent, AddActivatedNumberModalComponent, InputModalComponent, EditCcModalComponent, SelectPaymentModalComponent, ShippingAddressModalComponent, SimReplacementModalComponent,
        WifiCallingModalComponent, TrackingModalComponent,
        RoutingModalComponent, FiveGModalComponent, eSimReplacementModalComponent,
        OutOfStockItemModalComponent, AcpModalComponent, PhoneNotImpactedModalComponent,MdnsListModalComponent, CompatibilitySkipModalComponent,
        AlertSecurityModalComponent],
})
export class ModalsModule { }
