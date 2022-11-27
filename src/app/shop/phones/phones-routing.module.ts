import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhonesComponent } from './phones.component';
import { PHONES_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS } from '../../app.routes.names';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { TypeComponent } from './type/type.component';
import { ModelComponent } from './model/model.component';
import { DetailsComponent } from './details/details.component';
import { AddPhoneStepsComponent } from './add-phone-steps/add-phone-steps.component';
import { SelectLineComponent } from './select-line/select-line.component';
import { CheckPhoneCoverageComponent } from './check-phone-coverage/check-phone-coverage.component';

const routes: Routes = [{
  path: '', component: PhonesComponent,
  children: [
    {path: PHONES_SHOP_ROUTE_URLS.TYPE, component: TypeComponent, data: {title: 'Best Refurbished iPhones | GoodMobile', description:
    'Get the best deal when you buy a refurbished iPhone SE2, iPhone XR, iPhone 11, or iPhone 12. All devices come with a 30-day warranty and FREE delivery.'} as IPageMeta},
    {path: PHONES_SHOP_ROUTE_URLS.MODEL, redirectTo: PHONES_SHOP_ROUTE_URLS.TYPE, pathMatch: 'full'},
    {path: PHONES_SHOP_ROUTE_URLS.DETAILS, component: DetailsComponent, data: {title: 'Buy Refurbished iPhone | Free SIM | GoodMobile', description:
    'Buy an unlocked refurbished iPhone. 14-days returns and up to 90-days warranty. Great value and a more sustainable option and FREE delivery.'} as IPageMeta},
    {path: PHONES_SHOP_ROUTE_URLS.ADD_STEPS, component: AddPhoneStepsComponent,
      children: [
        { path: '', component: AddPhoneStepsComponent, pathMatch: 'full' },
        {path: PHONES_SHOP_ROUTE_URLS.SELECT_LINE, component: SelectLineComponent, data: { title: 'GoodMobile| Cells Phones | Select Line',
          description : 'Please select an active GoodMobile number or purchase a new line in order to proceed.'}},
        {path: PHONES_SHOP_ROUTE_URLS.CHECK_COVERAGE, component: CheckPhoneCoverageComponent, data: { title: 'GoodMobile| Cells Phones | Check Coverage',
          description : 'Service Coverage Check'}}
      ]}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhonesRoutingModule { }
