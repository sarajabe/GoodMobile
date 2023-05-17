import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivationRoutingModule } from './activation-routing.module';
import { ActivatePlanComponent } from './activate-plan/activate-plan.component';
import { CompatibilityMainComponent } from './activation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from 'src/widgets/widgets.module';
import { ActivateSimComponent } from './activate-sim/activate-sim.component';
import { ActivateCurrentNumberComponent } from './activate-current-number/activate-current-number.component';
import { ActivateNewNumberComponent } from './activate-new-number/activate-new-number.component';
import { ActivationCheckCompatibilityComponent } from './activation-check-compatibility/activation-check-compatibility.component';
import { ActivationSummaryComponent } from './activation-summary/activation-summary.component';
import { CheckCompatibilityResultComponent } from './check-compatibility-result/check-compatibility-result.component';
import { ChooseActivationPathComponent } from './choose-activation-path/choose-activation-path.component';
import { ChoosePlanPathComponent } from './choose-plan-path/choose-plan-path.component';
import { NoSIMComponent } from './no-sim/no-sim.component';
import { ReplaceSimComponent } from './replace-sim/replace-sim.component';
import { SIMCheckComponent } from './sim-check/sim-check.component';
import { SuccessSwapComponent } from './success-swap/success-swap.component';
import { PortSubmittedComponent } from './port-submitted/port-submitted.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxBarcode6Module } from 'ngx-barcode6';


@NgModule({
  declarations: [ActivatePlanComponent,
    CompatibilityMainComponent,
    ActivateSimComponent,
    ActivateCurrentNumberComponent,
    ActivateNewNumberComponent,
    ActivationCheckCompatibilityComponent,
    ActivationSummaryComponent,
    CheckCompatibilityResultComponent,
    ChooseActivationPathComponent,
    ChoosePlanPathComponent,
    NoSIMComponent,
    ReplaceSimComponent,
    SIMCheckComponent,
    SuccessSwapComponent,
    PortSubmittedComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ActivationRoutingModule,
    WidgetsModule,
    MatAutocompleteModule,
    NgxBarcode6Module
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivationModule { }
