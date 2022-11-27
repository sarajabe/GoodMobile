import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { PlansAndFeaturesComponent } from './plans-and-features.component';
import { NewPlanShopComponent } from './new-plan-shop/new-plan-shop.component';
import { ChangePlanShopComponent } from './change-plan-shop/change-plan-shop.component';
import { IPageMeta } from '@ztarmobile/zwp-service';

const routes: Routes = [
  {
    path: '', component: PlansAndFeaturesComponent,
    children: [
      {path: PLANS_SHOP_ROUTE_URLS.NEW_PLAN, component: NewPlanShopComponent, data: {title: `Unlimited Talk & Text 4G LTE Cell Phone Plans | GoodMobile` , description :
      // eslint-disable-next-line max-len
      `The best cell phone deal just got better! Get all the power of the nation’s largest networks for less.`} as IPageMeta},
      {path: PLANS_SHOP_ROUTE_URLS.CHANGE_PLAN, component: ChangePlanShopComponent, data: {title: 'Change Plan',
       description: 'Switch and change between GoodMobile cell phone plans'} as IPageMeta},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlansAndFeaturesRoutingModule { }
