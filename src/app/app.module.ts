import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { ModalsModule } from '../modals/modals.module';

import { ENDPOINT_URL, ENV_FIREBASE_CONFIG, BFF_ENDPOINT_URL, ZMP_G2G_BFF_ENDPOINT_URL } from '../environments/environment';

import { AuthModule, ErrorHandlerService } from '@ztarmobile/zwp-services-auth';
import { Metadata, ZwpConfig, CoreModule } from '@ztarmobile/zwp-service';
import { UtilModule } from '@ztarmobile/zwp-services-util';
import { BackendModule } from '@ztarmobile/zwp-service-backend';
import { BackendV2Module } from '@ztarmobile/zwp-service-backend-v2';
import { SwiperModule } from 'swiper/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastrModule } from 'ngx-toastr';
import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import 'leaflet';
import 'leaflet.vectorgrid';
import '../styles/styles.scss';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { HomeComponent } from './home/home.component';
import { TelecomsServicesModule } from '../providers/providers';
import { WidgetsModule } from '../widgets/widgets.module';
import { MetaService } from '../services/meta-service.service';
import { EbbManager } from '../services/ebb.service';
import { ContentfulService } from '../services/contentful.service';
import { ToastrHelperService } from '../services/toast-helper.service';
import { ModalHelperService } from '../services/modal-helper.service';
import { BringPhoneComponent } from './bring-phone/bring-phone.component';
import { HdVoiceComponent } from './hd-voice/hd-voice.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { WifiCallingComponent } from './wifi-calling/wifi-calling.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { LandingEbbComponent } from './landing-ebb/landing-ebb.component';
import { PhoneManagementService } from 'src/services/phones.service';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const metadata: Metadata = {
  author: 'ZtarMobile',
  keywords: 'Good Mobile, Mobile Plans, 4G LTE network, Nationwide 4G Coverage, Two networks, GOVERNMENT BENEFIT PROGRAM, ACP,',
  description: 'Good Mobile offers nationwide wireless phone plans with no contracts. Buy the data that you need. Low-cost prepaid phone plans for iPhone and Android devices.'
};
const zwpConfig: ZwpConfig = {
  endpointUrl: `${ENDPOINT_URL || ''}`,
  BffEndPointURL: `${BFF_ENDPOINT_URL}`,
  ZMP_G2G_BFF_ENDPOINT_URL: `${ZMP_G2G_BFF_ENDPOINT_URL}`,
  consoleErrorReporting: true,
  firebaseAppConfig: ENV_FIREBASE_CONFIG,
  metadata
};

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BringPhoneComponent,
        HdVoiceComponent,
        NotFoundComponent,
        WifiCallingComponent,
        NewsletterComponent,
        LandingEbbComponent
    ],
    imports: [
        AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        TelecomsServicesModule,
        TooltipModule,
        ShareButtonModule,
        NgxPageScrollCoreModule.forRoot({ duration: 200 }),
        ToastrModule.forRoot(),
        CoreModule.forRoot(zwpConfig),
        BackendModule,
        BackendV2Module,
        AuthModule,
        UtilModule,
        WidgetsModule,
        MatDialogModule,
        SwiperModule,
        QRCodeModule,
        AppRoutingModule,
        MatAutocompleteModule,
        ModalsModule
    ],
    exports: [],
    providers: [AppState, MetaService, ContentfulService, ToastrHelperService, ModalHelperService, EbbManager, PhoneManagementService,
        { provide: ErrorHandler, useClass: ErrorHandlerService }],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
