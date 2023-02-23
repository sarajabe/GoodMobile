import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MigrationRoutingModule } from './migration-routing.module';
import { MigrationComponent } from './migration.component';
import { SimRecievedComponent } from './sim-recieved/sim-recieved.component';
import { VerifiedFlowComponent } from './sim-recieved/verified-flow/verified-flow.component';
import { WidgetsModule } from 'src/widgets/widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompatibilityComponent } from './compatibility/compatibility.component';
import { ConfirmDeviceComponent } from './confirm-device/confirm-device.component';
import { CompatibleDeviceComponent } from './compatible-device/compatible-device.component';
import { NotCompatibleDeviceComponent } from './not-compatible-device/not-compatible-device.component';
import { SuccessfulOrderComponent } from './successful-order/successful-order.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [MigrationComponent, SimRecievedComponent, VerifiedFlowComponent, CompatibilityComponent, ConfirmDeviceComponent, CompatibleDeviceComponent, NotCompatibleDeviceComponent, SuccessfulOrderComponent],
  imports: [
    CommonModule,
    MigrationRoutingModule,
    WidgetsModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    NgCircleProgressModule.forRoot({
      showTitle: true,
      showSubtitle: false,
      showUnits: false,
      showInnerStroke: false
    })
  ]
})
export class MigrationModule { }
