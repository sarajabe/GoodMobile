import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from '../../widgets/widgets.module';
import { ShopMainComponent } from './shop.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ChangePlanSummaryComponent } from './change-plan-summary/change-plan-summary.component';
import { CheckCompatibilityComponent } from './check-compatibility/check-compatibility.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { CheckoutResultsComponent } from './checkout-results/checkout-results.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CartComponent } from './cart/cart.component';


@NgModule({
  declarations: [ShopMainComponent, ChangePlanSummaryComponent, CheckCompatibilityComponent, PlanDetailsComponent, CheckoutResultsComponent, CartComponent],
  imports: [
    CommonModule,
    ShopRoutingModule,
    WidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    TooltipModule,
    NgCircleProgressModule.forRoot({
      showTitle: true,
      showSubtitle: false,
      showUnits: false,
      showInnerStroke: false
    })
  ]
})
export class ShopModule { }
