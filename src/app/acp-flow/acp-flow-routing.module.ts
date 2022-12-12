import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { ACP_ROUTE_URLS } from '../app.routes.names';
import { AcpAppInfoComponent } from './acp-app-info/acp-app-info.component';
import { AcpFlowLandingComponent } from './acp-flow-landing/acp-flow-landing.component';
import { AcpFlowComponent } from './acp-flow.component';
import { EnrollmentAddExistingLineComponent } from './enrollment-add-existing-line/enrollment-add-existing-line.component';
import { EnrollmentAddNewLineComponent } from './enrollment-add-new-line/enrollment-add-new-line.component';

const routes: Routes = [
  {
    path: '', component: AcpFlowComponent, children: [
      {
        path: '', component: AcpFlowLandingComponent, data: {
          title: 'Free UNLIMITED cell phone service with Government program | Good Mobile',
          description: 'Get FREE UNLIMITED Data, Talk and Text with the Affordable Connectivity Program (ACP). Check to see if you’re eligible and apply to the ACP benefits to reduce your monthly bills'
        } as IPageMeta
      },
      {
        path: ACP_ROUTE_URLS.DETAILS, component: AcpAppInfoComponent, data: {
          title: 'ACP Application | Affordable Connectivity Program | Good Mobile',
          description: 'Get FREE UNLIMITED Data, Talk and Text with the Affordable Connectivity Program (ACP). Check your verified ACP application details.'
        } as IPageMeta
      },
      {
        path: ACP_ROUTE_URLS.ENROLLMENT_NEW_LINE, component: EnrollmentAddNewLineComponent
      },
      {
        path: ACP_ROUTE_URLS.ENROLLMENT_EXISTING_LINE, component: EnrollmentAddExistingLineComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcpFlowRoutingModule { }
