import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { ShopMainComponent } from './shop.component';
import { ChangePlanSummaryComponent } from './change-plan-summary/change-plan-summary.component';
import { SHOP_ROUTE_URLS, CHECKOUT_ROUTE_URLS, PHONES_SHOP_ROUTE_URLS } from '../app.routes.names';
import { CheckCompatibilityComponent } from './check-compatibility/check-compatibility.component';
import { CheckoutResultsComponent } from './checkout-results/checkout-results.component';
import { AuthEmailGuardService } from 'src/providers/user-auth-service/auth-email-guard.service';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', component: ShopMainComponent, children: [
    {path: SHOP_ROUTE_URLS.CHANGE_SUMMARY, component: ChangePlanSummaryComponent, data: {title: 'Change plan Summary', description:
    `Check the details for your change plan request`} as IPageMeta},
    {path: SHOP_ROUTE_URLS.CHECK_PHONE, component: CheckCompatibilityComponent, data: {title: `Check Your Phone's Compatibility`, description: 'Check your phone for compatibility or purchase a compatible phone from GoodMobile.'} as IPageMeta},
    {path: CHECKOUT_ROUTE_URLS.NAME, loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule), canActivate: [AuthEmailGuardService]},
    {path: SHOP_ROUTE_URLS.PLANS_AND_FEATURES,  loadChildren: () => import('./plans-and-features/plans-and-features.module').then(m => m.PlansAndFeaturesModule), data:
    {title: `Unlimited Talk & Text 4G LTE Cell Phone Plans | GoodMobile` , description :
    // eslint-disable-next-line max-len
    `The best cell phone deal just got better! Get all the power of the nation’s largest networks for less.`} as IPageMeta},
    {path: SHOP_ROUTE_URLS.PLANS_SHOP,  loadChildren: () => import('./plans-and-features/plans-and-features.module').then(m => m.PlansAndFeaturesModule)},
    {path: SHOP_ROUTE_URLS.PLAN_DETAILS,  loadChildren: () => import('./plans-and-features/plans-and-features.module').then(m => m.PlansAndFeaturesModule)},
    {path: SHOP_ROUTE_URLS.CHANGE_PLANS_SHOP,  loadChildren: () => import('./plans-and-features/plans-and-features.module').then(m => m.PlansAndFeaturesModule)},
    {path: PHONES_SHOP_ROUTE_URLS.BASE, loadChildren: () => import('./phones/phones.module').then(m => m.PhonesModule)},
    {path: SHOP_ROUTE_URLS.CHECKOUT_RESULTS, component: CheckoutResultsComponent, data: {title: 'Purchase Successful',
    description: 'Your purchase with GoodMobile is successful'} as IPageMeta},
    {path: SHOP_ROUTE_URLS.CHECKOUT_SHORT, redirectTo: `${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT}`, pathMatch: 'full'},
    {path: SHOP_ROUTE_URLS.CART,component: CartComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
