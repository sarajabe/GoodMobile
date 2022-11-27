import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { AuthEmailGuardService } from 'src/providers/user-auth-service/auth-email-guard.service';
import { ACTIVATION_ROUTE_URLS } from '../app.routes.names';
import { ActivatePlanComponent } from './activate-plan/activate-plan.component';
import { ActivateSimComponent } from './activate-sim/activate-sim.component';
import { ActivationCheckCompatibilityComponent } from './activation-check-compatibility/activation-check-compatibility.component';
import { ActivationSummaryComponent } from './activation-summary/activation-summary.component';
import { CompatibilityMainComponent } from './activation.component';
import { CheckCompatibilityResultComponent } from './check-compatibility-result/check-compatibility-result.component';
import { ChooseActivationPathComponent } from './choose-activation-path/choose-activation-path.component';
import { ChoosePlanPathComponent } from './choose-plan-path/choose-plan-path.component';
import { ChooseSimPathComponent } from './choose-sim-path/choose-sim-path.component';
import { ChooseSimSourceComponent } from './choose-sim-source/choose-sim-source.component';
import { ChooseTrialPathComponent } from './choose-trial-path/choose-trial-path.component';
import { NoSIMComponent } from './no-sim/no-sim.component';
import { ReplaceResultComponent } from './replace-result/replace-result.component';
import { ReplaceSimComponent } from './replace-sim/replace-sim.component';
import { SIMArrivalComponent } from './sim-arrival/sim-arrival.component';
import { SIMCheckComponent } from './sim-check/sim-check.component';

const routes: Routes = [
  {
    path: '', component: CompatibilityMainComponent,
    children: [
      { path: ACTIVATION_ROUTE_URLS.ACTIVATE_PLAN, component: ActivatePlanComponent, data: { title: 'Activate Your Plan', description:
      `Activate your GoodMobile SIM card here with your activation code to start your service.` } as IPageMeta },
      { path: ACTIVATION_ROUTE_URLS.ACTIVATE_SIM, component: ActivateSimComponent, data: { title: 'Activate | Port your SIM', description:
      `Port your number and activate your GoodMobile SIM card here with your activation code
      to start your service.` } as IPageMeta, canActivate: [AuthEmailGuardService] },
      {
        path: ACTIVATION_ROUTE_URLS.CHECK_PHONE, component: ActivationCheckCompatibilityComponent, data: {
          title: 'Check Compatibility',
          description: 'Is your phone compatible with GoodMobile? Check your phone here so you can activate your SIM card.'
        } as IPageMeta
      },
      {
        path: ACTIVATION_ROUTE_URLS.ACTIVATION_SUMMARY, component: ActivationSummaryComponent, data: {
          title: 'Activation Summary', description: 'Enjoy GoodMobile service'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      { path: ACTIVATION_ROUTE_URLS.CHECK_PHONE_RESULT, component: CheckCompatibilityResultComponent, data: { title: 'Compatability Result', description:
      'Is your phone compatible with GoodMobile? Check your phone here so you can activate your SIM card.' } as IPageMeta },
      {
        path: ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH, component: ChooseActivationPathComponent, data: { title: 'Activate | Port your SIM', description:
        'Activate your new GoodMobile number or Port your own number'} as IPageMeta,
        canActivate: [AuthEmailGuardService]
      },
      { path: ACTIVATION_ROUTE_URLS.CHOOSE_PLANS_PATH, component: ChoosePlanPathComponent, data: { title: 'Choose Your Plan', description:
        'Select the plan you want to activate with GoodMobile' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.CHOOSE_SIM_PATH, component: ChooseSimPathComponent, data: { title: 'Choose SIM Path', description:
      'Do you have your GoodMobile SIM, Or your SIM is on the way to you?' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      {
        path: ACTIVATION_ROUTE_URLS.CHOOSE_SIM_SOURCE, component: ChooseSimSourceComponent, data: {
          title: 'Choose SIM Source', description: 'Where did you get your GoodMobile SIM from?'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      { path: ACTIVATION_ROUTE_URLS.CHOOSE_TRIAL, component: ChooseTrialPathComponent, data: { title: 'Trial Upgrade', description:
      'Upgrade your trial plan and enjoy GoodMobile service' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.No_SIM, component: NoSIMComponent, data: { title: 'No SIM' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      {
        path: ACTIVATION_ROUTE_URLS.REPLACE_RESULT, component: ReplaceResultComponent, data: {
          title: 'SIM Replacement Result'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      { path: ACTIVATION_ROUTE_URLS.REPLACE_SIM, component: ReplaceSimComponent, data: { title: 'SIM Replacement' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.SIM_ARRIVAL, component: SIMArrivalComponent, data: { title: 'SIM Arrival' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.SIM_CHECK, component: SIMCheckComponent, data: { title: 'SIM check' } as IPageMeta, canActivate: [AuthEmailGuardService] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivationRoutingModule { }
