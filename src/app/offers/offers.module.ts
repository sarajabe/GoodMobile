import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffersRoutingModule } from './offers-routing.module';
import { OffersComponent } from './offers.component';
import { UpgradeConfirmationComponent } from './upgrade-confirmation/upgrade-confirmation.component';
import { WidgetsModule } from 'src/widgets/widgets.module';
import { UpgradeOfferComponent } from './upgrade-offer/upgrade-offer.component';

@NgModule({
  declarations: [UpgradeOfferComponent, OffersComponent, UpgradeConfirmationComponent],
  imports: [
    CommonModule,
    OffersRoutingModule,
    WidgetsModule,
  ]
})
export class OffersModule { }
