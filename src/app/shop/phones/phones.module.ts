import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { WidgetsModule } from '../../../widgets/widgets.module';
import { SwiperModule } from 'swiper/angular';
import { PhonesRoutingModule } from './phones-routing.module';
import { PhonesComponent } from './phones.component';
import { DetailsComponent } from './details/details.component';
import { ModelComponent } from './model/model.component';
import { TypeComponent } from './type/type.component';
import { SelectLineComponent } from './select-line/select-line.component';
import { CheckPhoneCoverageComponent } from './check-phone-coverage/check-phone-coverage.component';
import { AddPhoneStepsComponent } from './add-phone-steps/add-phone-steps.component';
import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [PhonesComponent, DetailsComponent, ModelComponent, TypeComponent, SelectLineComponent, CheckPhoneCoverageComponent, AddPhoneStepsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetsModule,
    SwiperModule,
    PhonesRoutingModule,
    MatAutocompleteModule,
    TooltipModule,
    NgCircleProgressModule.forRoot({
      showTitle: true,
      showSubtitle: false,
      showUnits: false,
      showInnerStroke: false
    })
  ]
})
export class PhonesModule { }
