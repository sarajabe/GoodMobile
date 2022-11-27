import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePaymentModalComponent } from './manage-payment-modal/manage-payment-modal.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
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
import { MigrationStepsComponent } from './migration-steps/migration-steps.component';
import { SWIPER_CONFIG, SwiperConfigInterface, SwiperModule } from 'ngx-swiper-wrapper';
import { IsLteModalComponent } from './is-lte-modal/is-lte-modal.component';
import { DynamicModalsComponent } from './dynamic-modals/dynamic-modals.component';
import { ReferralPromotionComponent } from './referral-promotion-modal/referral-promotion.component';
import { FiveGModalComponent } from './five-gmodal/five-gmodal.component';
import { OutOfStockItemModalComponent } from './out-of-stock-item-modal/out-of-stock-item-modal.component';
import { AcpModalComponent } from './acp-modal/acp-modal.component';
import { PhoneNotImpactedModalComponent } from './phone-not-impacted-modal/phone-not-impacted-modal.component';
import { TrackingModalComponent } from './tracking-details-modal/tracking-details-modal.component';
import { MdnsListModalComponent } from './mdns-list-modal/mdns-list-modal.component';
import { CompatibilitySkipModalComponent } from './compatibility-skip-modal/compatibility-skip-modal.component';
import { eSimReplacementModalComponent } from './esim-replacement-modal/esim-replacement-modal.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 1
};

@NgModule({
    declarations: [ManagePaymentModalComponent, ManageAddressModalComponent, ManagePaymentSpecificModalComponent, ConfirmMessageModalComponent, ConfirmPasswordModalComponent,
        InformationMessageModalComponent,
        AddActivatedNumberModalComponent,
        InputModalComponent,
        RoutingModalComponent,
        EditCcModalComponent,
        SelectPaymentModalComponent,
        ShippingAddressModalComponent,
        SimReplacementModalComponent,
        WifiCallingModalComponent,
        MigrationStepsComponent,
        IsLteModalComponent,
        ReferralPromotionComponent,
        DynamicModalsComponent,
        FiveGModalComponent,
        OutOfStockItemModalComponent,
        AcpModalComponent,
        PhoneNotImpactedModalComponent,
        MdnsListModalComponent,
        TrackingModalComponent,
        eSimReplacementModalComponent,
        CompatibilitySkipModalComponent],
    imports: [
        SwiperModule,
        CommonModule, WidgetsModule, FormsModule, ReactiveFormsModule, NguiAutoCompleteModule
    ],
    exports: [ManagePaymentModalComponent, ManageAddressModalComponent, ManagePaymentSpecificModalComponent, ConfirmMessageModalComponent, ConfirmPasswordModalComponent,
        InformationMessageModalComponent, AddActivatedNumberModalComponent, InputModalComponent, EditCcModalComponent, SelectPaymentModalComponent, ShippingAddressModalComponent, SimReplacementModalComponent,
        WifiCallingModalComponent, MigrationStepsComponent, IsLteModalComponent, TrackingModalComponent,
        RoutingModalComponent, DynamicModalsComponent, ReferralPromotionComponent, FiveGModalComponent, eSimReplacementModalComponent,
        OutOfStockItemModalComponent, AcpModalComponent, PhoneNotImpactedModalComponent,MdnsListModalComponent, CompatibilitySkipModalComponent],
    providers: [{ provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG }]
})
export class ModalsModule { }
