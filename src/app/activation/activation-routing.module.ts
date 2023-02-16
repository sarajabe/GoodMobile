import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { AuthEmailGuardService } from 'src/providers/user-auth-service/auth-email-guard.service';
import { ACTIVATION_ROUTE_URLS } from '../app.routes.names';
import { ActivateCurrentNumberComponent } from './activate-current-number/activate-current-number.component';
import { ActivateNewNumberComponent } from './activate-new-number/activate-new-number.component';
import { ActivatePlanComponent } from './activate-plan/activate-plan.component';
import { ActivationCheckCompatibilityComponent } from './activation-check-compatibility/activation-check-compatibility.component';
import { ActivationSummaryComponent } from './activation-summary/activation-summary.component';
import { CompatibilityMainComponent } from './activation.component';
import { CheckCompatibilityResultComponent } from './check-compatibility-result/check-compatibility-result.component';
import { ChooseActivationPathComponent } from './choose-activation-path/choose-activation-path.component';
import { ChoosePlanPathComponent } from './choose-plan-path/choose-plan-path.component';
import { NoSIMComponent } from './no-sim/no-sim.component';
import { PortSubmittedComponent } from './port-submitted/port-submitted.component';
import { ReplaceSimComponent } from './replace-sim/replace-sim.component';
import { SIMCheckComponent } from './sim-check/sim-check.component';
import { SuccessSwapComponent } from './success-swap/success-swap.component';

const routes: Routes = [
  {
    path: '', component: CompatibilityMainComponent,
    children: [
      { path: ACTIVATION_ROUTE_URLS.ACTIVATE_PLAN, component: ActivatePlanComponent, data: { title: 'Activate Your Plan', description:
      `Activate your Good Mobile SIM card here with your activation code to start your service.` } as IPageMeta },
      { path: ACTIVATION_ROUTE_URLS.ACTIVATE_NEW, component: ActivateNewNumberComponent, data: { title: 'Activate New Number', description:
      `Provide us with your activation code and postal code and let us generate you a Good Mobile new number to start the service` } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.PORT_NUMBER, component: ActivateCurrentNumberComponent, data: { title: 'Keep your Number', description:
      `You can keep your current your number and port in to Good Mobile` } as IPageMeta, canActivate: [AuthEmailGuardService] },
      {
        path: ACTIVATION_ROUTE_URLS.CHECK_PHONE, component: ActivationCheckCompatibilityComponent, data: {
          title: 'Check Compatibility',
          description: 'Is your phone compatible with Good Mobile? Check your phone here so you can activate your SIM card.'
        } as IPageMeta
      },
      {
        path: ACTIVATION_ROUTE_URLS.ACTIVATION_SUMMARY, component: ActivationSummaryComponent, data: {
          title: 'Activation Summary', description: 'Enjoy Good Mobile service'
        } as IPageMeta, canActivate: [AuthEmailGuardService]
      },
      { path: ACTIVATION_ROUTE_URLS.CHECK_PHONE_RESULT, component: CheckCompatibilityResultComponent, data: { title: 'Compatability Result', description:
      'Is your phone compatible with Good Mobile? Check your phone here so you can activate your SIM card.' } as IPageMeta },
      {
        path: ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH, component: ChooseActivationPathComponent, data: { title: 'Activate | Port your SIM', description:
        'Activate your new Good Mobile number or Port your own number'} as IPageMeta,
        canActivate: [AuthEmailGuardService]
      },
      { path: ACTIVATION_ROUTE_URLS.CHOOSE_PLANS_PATH, component: ChoosePlanPathComponent, data: { title: 'Choose Your Plan', description:
        'Select the plan you want to activate with Good Mobile' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.No_SIM, component: NoSIMComponent, data: { title: 'No SIM', description: 'Please check your order delivery details to track your SIM and start your activation.' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.REPLACE_SIM, component: ReplaceSimComponent, data: { title: 'SIM Replacement', description: 'Activate your replacement SIM card and continue enjoying the service from Good Mobile' } as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.SIM_CHECK, component: SIMCheckComponent, data: { title: 'SIM check',  description: 'Let us start your activation process, but first select what how do you want to use your SIM'} as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.SUCCESS_SWAP, component: SuccessSwapComponent, data: { title: 'Successful SIM Swap',  description: 'You have successfully swapped your SIM'} as IPageMeta, canActivate: [AuthEmailGuardService] },
      { path: ACTIVATION_ROUTE_URLS.PORT_SUBMITTED, component: PortSubmittedComponent, data: { title: 'Port Request Submitted',  description: 'Your port in request has been submitted successfully!'} as IPageMeta, canActivate: [AuthEmailGuardService] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivationRoutingModule { }
