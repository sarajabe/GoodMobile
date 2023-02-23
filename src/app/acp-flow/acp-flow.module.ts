import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcpFlowRoutingModule } from './acp-flow-routing.module';
import { AcpFlowLandingComponent } from './acp-flow-landing/acp-flow-landing.component';
import { AddressInfoComponent } from './address-info/address-info.component';
import { ChildInfoComponent } from './child-info/child-info.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { NoticeAgreementComponent } from './notice-agreement/notice-agreement.component';
import { AcpValidationComponent } from './acp-validation/acp-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WidgetsModule } from 'src/widgets/widgets.module';
import { ModalsModule } from 'src/modals/modals.module';
import { AcpFlowComponent } from './acp-flow.component';
import { NotExistingAppValidationComponent } from './do-not-have-app-id/not-existing-app-validation/not-existing-app-validation.component';
import { PersonalInfoNonExisitngAppComponent } from './do-not-have-app-id/personal-info/personal-info.component';
import { AddressInfoNonAppExisitngComponent } from './do-not-have-app-id/address-info/address-info.component';
import { QualifyingInfoComponent } from './do-not-have-app-id/qualifying-info/qualifying-info.component';
import { SignatureInfoComponent } from './signature-info/signature-info.component';
import { AcpErrorComponent } from './acp-error/acp-error.component';
import { AcpSuccessComponent } from './acp-success/acp-success.component';
import { AppIdPersonalInfoComponent } from './have-app-id/app-id-personal-info/app-id-personal-info.component';
import { AppIdValidationComponent } from './have-app-id/app-id-validation/app-id-validation.component';
import { AcpAppInfoComponent } from './acp-app-info/acp-app-info.component';
import { EnrollmentAddNewLineComponent } from './enrollment-add-new-line/enrollment-add-new-line.component';
import { EnrollmentAddExistingLineComponent } from './enrollment-add-existing-line/enrollment-add-existing-line.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AcpFlowComponent,
    AcpFlowLandingComponent,
    AddressInfoComponent,
    ChildInfoComponent,
    PersonalInfoComponent,
    NoticeAgreementComponent,
    AcpValidationComponent,
    NotExistingAppValidationComponent,
    PersonalInfoNonExisitngAppComponent,
    AddressInfoNonAppExisitngComponent,
    QualifyingInfoComponent,
    SignatureInfoComponent,
    AcpErrorComponent,
    AcpSuccessComponent,
    AppIdPersonalInfoComponent,
    AppIdValidationComponent,
    AcpAppInfoComponent,
    EnrollmentAddNewLineComponent,
    EnrollmentAddExistingLineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AcpFlowRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    WidgetsModule,
    ModalsModule,
    QRCodeModule,
    MatAutocompleteModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AcpFlowModule { }
