import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SupportRoutingModule } from './support-routing.module';
import { SupportMainComponent } from './support.component';
import { AboutGoodMobileComponent } from './about-goodmobile/about-goodmobile.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { WidgetsModule } from 'src/widgets/widgets.module';
import { CoveragesComponent } from './coverages/coverages.component';
import { MapNavigatorComponent } from './coverages/components/map-navigator/map-navigator.component';
import { MapToolbarComponent } from './coverages/components/map-toolbar/map-toolbar.component';
import { FaqsComponent } from './faqs/faqs.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CovidComponent } from './faqs/covid/covid.component';
import { SupportComponent } from './faqs/support/support.component';
import { DataSetupComponent } from './data-setup/data-setup.component';
import { AndroidGsmComponent } from './data-setup/android/gsm/gsm.component';
import { AndroidTmoComponent } from './data-setup/android/tmo/tmo.component';
import { IosTmoComponent } from './data-setup/ios/tmo/tmo.component';
import { TMobileComponent } from './data-setup/t-mobile/t-mobile.component';
import { HearingAidCompatibilityComponent } from './hearing-aid-compatibility/hearing-aid-compatibility.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { InternationalCallingComponent } from './international-calling/international-calling.component';
import { LandingCoverageComponent } from './landing-coverage/landing-coverage.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { StoreLocatorComponent } from './store-locator/store-locator.component';
import { WhyGoodMobileComponent } from './why-goodmobile/why-goodmobile.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [SupportMainComponent, AboutGoodMobileComponent, ContactUsComponent, CoveragesComponent, MapNavigatorComponent, MapToolbarComponent,
    FaqsComponent, CovidComponent, SupportComponent, DataSetupComponent, AndroidGsmComponent,
     TMobileComponent, IosTmoComponent, AndroidTmoComponent, HearingAidCompatibilityComponent,
    HowItWorksComponent, InternationalCallingComponent, LandingCoverageComponent, SitemapComponent, StoreLocatorComponent, WhyGoodMobileComponent,
    TermsAndConditionsComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    WidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatAutocompleteModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SupportModule { }
