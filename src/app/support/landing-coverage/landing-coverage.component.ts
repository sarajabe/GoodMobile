import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SUPPORT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { UserDeviceService, MobileCustomPlansService, IAutoCompletePrediction, PlacesAutocompleteService, IFirebaseAddress, AccountPaymentService, IDeviceCompatibilityV1 } from '@ztarmobile/zwp-service-backend';
import { ContentfulService } from '../../../services/contentful.service';
import { ToastrHelperService } from '../../../services/toast-helper.service';
import { Router } from '@angular/router';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.service';
import { EquipmentService } from '@ztarmobile/zwp-service-backend-v2';

@Component({
  selector: 'app-landing-coverage',
  templateUrl: './landing-coverage.component.html',
  styleUrls: ['./landing-coverage.component.scss']
})
export class LandingCoverageComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;

  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ACTIVATION_ROUTE_URLS = ACTIVATION_ROUTE_URLS;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public processingRequest: boolean;
  public questions: any;
  public questionIdParam: any;
  public collapsed: boolean;
  public networkType: string;
  public recaptchaResponse: any;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public captchaValid = false;
  public invalidAddress = false;
  public displayedAddressModel: any;
  public address: any;
  public setFoucs = false;
  public displayValidation = false;
  public filteredOptions: Observable<Array<IAutoCompletePrediction>>;
  public filteredOptionsSubscription: Subscription;
  
  private streetSearchText: string;

  constructor(private modalHelper: ModalHelperService, private contentfulService: ContentfulService,
    private userDeviceService: UserDeviceService, public router: Router, private toastHelper: ToastrHelperService,
    private mobilePlansService: MobileCustomPlansService, private placesAutoCompleteService: PlacesAutocompleteService,
    private accountPaymentService: AccountPaymentService, private appState: AppState, private equipmentService: EquipmentService) {
  }

  ngOnInit(): void {
    this.questions = this.contentfulService.getQuestionsByCategoryId('good2goFaqs', 'coverage');
    setInterval(() => {
      this.reCaptcha.execute(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
    }, 1.8 * 60 * 1000);
  }
  ngOnDestroy(): void {
    this.filteredOptionsSubscription?.unsubscribe();
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public findPlace(keyword: ''): Observable<Array<IAutoCompletePrediction>> {
    this.filteredOptions = this.placesAutoCompleteService.findAddress(keyword);
    this.filteredOptionsSubscription = this.filteredOptions.subscribe();
    return this.filteredOptions;
  }
  public addressDetails(eventFire: IAutoCompletePrediction): void {
    if (!!eventFire && !!this.address && this.address?.main_text) {
      const event = this.address;
      if (!!event.place_id) {
        this.appState.loading = true;
        this.invalidAddress = false;
        this.displayValidation = false;
         //this is a default value until address have the value from api
         this.address = event?.main_text;
        this.placesAutoCompleteService
          .findDetailedAddressFields(event.place_id)
          .subscribe(
            (place) => {
              this.streetSearchText =
                !!place.address1 && place.address1.length > 0
                  ? place.address1
                  : null;
              this.displayedAddressModel = this.getAddressValues(
                place,
                event.main_text
              );
              this.address = `${this.displayedAddressModel?.address1}, ${this.displayedAddressModel?.city
                }, ${this.displayedAddressModel?.state} ${this.displayedAddressModel?.postalCode
                  ? this.displayedAddressModel?.postalCode
                  : ''
                }`;
                this.appState.loading = false;
            },
            (error) => {
              this.appState.loading = false;
              console.warn(
                `Google can't find details for place: ${event.place_id}`,
                error
              );
            }
          );
      } else {
        this.invalidAddress = true;
        this.displayValidation = false;
        console.warn(`Google can't find place: ${event.main_text}`);
      }
    } else {
      this.invalidAddress = true;
    }
  }
  public checkCoverage(): void {
    if (!!this.address && !!this.recaptchaResponse && !!this.displayedAddressModel) {
      this.displayValidation = false;
      this.processingRequest = true;
      this.equipmentService.checkDeviceCompatibilityV2(this.recaptchaResponse, this.displayedAddressModel?.postalCode,
        this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
        this.displayedAddressModel?.state, this.displayedAddressModel?.address2).then(res => {
          if (!!res) {
            const params = {};
            if (!res?.details?.eSimOnly && (!!res?.tmo?.covered || !!res?.att?.covered)) {
              this.processingRequest = false;
              this.networkType = !!res?.tmo?.covered ? 'tmo' : 'att';
              params[SUPPORT_ROUTE_URLS.PARAMS.NETWORKTYPE] = this.networkType;
              params[ACTIVATION_ROUTE_URLS.PARAMS.ZIP_CODE] = this.displayedAddressModel?.postalCode;
            }
            else {
              params[SUPPORT_ROUTE_URLS.PARAMS.NO_COVERAGE] = true;
            }
            this.reCaptcha.resetReCaptcha();
            this.reCaptcha.execute();
            this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.COVERAGE}`, params]);
          }
        }, (error) => {
          this.processingRequest = false;
          this.reCaptcha.resetReCaptcha();
          this.reCaptcha.execute();
          const params = {};
          params[SUPPORT_ROUTE_URLS.PARAMS.NO_COVERAGE] = true;
          this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.COVERAGE}`, params]);
        });
    } else if (!this.displayedAddressModel && !this.address) {
      this.displayValidation = true;
    }
  }

  public changedAddress(): void {
    this.findPlace(this.address);
    this.displayedAddressModel = null;
  }

  public showWhatIsIMEI(): void {
    this.modalHelper.showInformationMessageModal('3 Ways to find your MEID or IMEI', '', 'Got it', null,
      true, 'compatibility-help-modal-IME',
      `<div class="description-content">
    <div class="intro">
    Your IMEI number is needed if you want to unlock your device to use
    on other networks. Here’s 3 ways how to find it on your phone: </div>

       <div class="note-dial"> <b>Enter *#06# on your phone’s dial pad.</b></div>
       <b>OR</b>
       <div class="menu-margins">
       <b>Check your phone’s settings menu:</b>
       <p class="p-nowrap">Android: Go to Settings > About device > Status</p>
       <p class="p-nowrap">iPhone: Go to Settings > General > About</p>
       <p class="p-nowrap">Windows Phone: Go to Settings > About > More info</p>
       </div>
       <b>OR</b>
       <div class="menu-margins">
       <p class="p-nowrap"><b>Check the sticker under your device’s battery.</b></p>
       <p class="p-nowrap"> Note: It may be listed as “DEC.” </p> </div>
      </div>
        `);
  }
  public toggleActive(questionId, answerId): void {
    if (this.questionIdParam === questionId && !this.collapsed) {
      this.questionIdParam = 'q0';
    } else {
      this.questionIdParam = questionId;
      this.collapsed = false;
      this.callRichText(answerId);
    }
  }
  private callRichText(answerId): void {
    this.contentfulService.getRichText('questions', answerId);
  }
  private getAddressValues(
    placeInfo: any,
    searchTerms?: string
  ): IFirebaseAddress {
    let address: IFirebaseAddress = {
      name: !!this.displayedAddressModel?.name
        ? this.displayedAddressModel?.name
        : this.displayedAddressModel?.alias,
      address1: placeInfo.address1,
      address2: placeInfo.address2,
      state: placeInfo.state ? placeInfo.state.toUpperCase() : placeInfo.state,
      city: placeInfo.city,
      country: placeInfo.country || 'United States',
      postalCode: placeInfo.postalCode,
    } as IFirebaseAddress;

    if (!!this.displayedAddressModel?.id) {
      address.id = this.displayedAddressModel?.id;
      address.isDefault = this.displayedAddressModel?.isDefault;
    }
    if (!!searchTerms && typeof searchTerms === 'string') {
      if (!!this.streetSearchText) {
        if (!searchTerms.match(this.streetSearchText)) {
          this.streetSearchText = null;
        }
      }
      address.address1 = !!this.streetSearchText
        ? address.address1
        : searchTerms.trim();
    }
    if (!!address && address.address1)
      address.address1 = AccountPaymentService.shortenAddress(address.address1, 30);

    // Clean Out empty values,
    address = this.appState.removeEmptyValues(address);
    return Object.assign({}, address);
  }
}

