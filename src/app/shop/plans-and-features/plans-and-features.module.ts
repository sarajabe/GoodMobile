import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlansAndFeaturesRoutingModule } from './plans-and-features-routing.module';
import { WidgetsModule } from '../../../widgets/widgets.module';
import { FormsModule } from '@angular/forms';
import { PlansAndFeaturesComponent } from './plans-and-features.component';
import { PlansShopService } from './plans-shop.service';
import { ChangePlanShopComponent } from './change-plan-shop/change-plan-shop.component';
import { NewPlanShopComponent } from './new-plan-shop/new-plan-shop.component';

@NgModule({
  declarations: [PlansAndFeaturesComponent, ChangePlanShopComponent, NewPlanShopComponent],
  imports: [
    CommonModule,
    FormsModule,
    WidgetsModule,
    PlansAndFeaturesRoutingModule
  ],
  providers: [
    PlansShopService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlansAndFeaturesModule { }
