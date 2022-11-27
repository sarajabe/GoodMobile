import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { MIGRATION_ROUTE_URLS } from '../app.routes.names';
import { CompatibilityComponent } from './compatibility/compatibility.component';
import { ConfirmDeviceComponent } from './confirm-device/confirm-device.component';
import { CompatibleDeviceComponent } from './compatible-device/compatible-device.component';
import { MigrationComponent } from './migration.component';
import { SimRecievedComponent } from './sim-recieved/sim-recieved.component';
import { NotCompatibleDeviceComponent } from './not-compatible-device/not-compatible-device.component';
import { SuccessfulOrderComponent } from './successful-order/successful-order.component';

const routes: Routes = [
  {
    path: '', component: MigrationComponent, children: [
      { path: MIGRATION_ROUTE_URLS.SIM_RECEIVED, component: SimRecievedComponent, data: { title: 'Migration | SIM Received' } as IPageMeta },
      { path: MIGRATION_ROUTE_URLS.CONFIRM_DEVICE, component: ConfirmDeviceComponent, data: { title: 'Migration | Confirm Device',
        description: `We need to check your phone’s compatibility before migrating your number to the new service.` } as IPageMeta },
      { path: MIGRATION_ROUTE_URLS.CHECK_COMPATIBILITY, component: CompatibilityComponent, data: { title: 'Migration | Check Device',
        description: `Let's check your phone and coverage` } as IPageMeta },
      { path: MIGRATION_ROUTE_URLS.COMPATIBLE_DEVIE, component: CompatibleDeviceComponent, data: { title: 'Migration | Compatible Device',
        description: `Your phone is eligible for Migration.` } as IPageMeta },
      { path: MIGRATION_ROUTE_URLS.INCOMPATIBLE_DEVICE, component: NotCompatibleDeviceComponent, data: { title: 'Migration | Incompatible Device',
        description: `Your phone is not compatible with our network.` } as IPageMeta },
      { path: MIGRATION_ROUTE_URLS.SUCCESS_ORDER, component: SuccessfulOrderComponent, data: { title: 'Migration | Successful Order',
        description: `We have started your migration process and SIM will be on its way soon.` } as IPageMeta },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigrationRoutingModule { }
