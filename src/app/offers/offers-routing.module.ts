import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { AuthEmailGuardService } from 'src/providers/user-auth-service/auth-email-guard.service';
import { OFFERS_ROUTE_URLS } from '../app.routes.names';
import { OffersComponent } from './offers.component';
import { UpgradeConfirmationComponent } from './upgrade-confirmation/upgrade-confirmation.component';
import { UpgradeOfferComponent } from './upgrade-offer/upgrade-offer.component';

const routes: Routes = [{
  path: '', component: OffersComponent, children: [
    { path: OFFERS_ROUTE_URLS.UPGRADE_OFFER, component: UpgradeOfferComponent, data: { title: 'Upgrade to 6 months plan | Offers', description:
      'Special offer for a limited time! Keep the savings by switching to a 6 month plan' } as IPageMeta, canActivate: [AuthEmailGuardService] },
    { path: OFFERS_ROUTE_URLS.CONFIRM_UPGRADE, component: UpgradeConfirmationComponent, data: { title: 'Upgrade plan Confirmation | Offers', description:
      'Keep the savings by switching to a 6 month plan' } as IPageMeta, canActivate: [AuthEmailGuardService] },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule { }
