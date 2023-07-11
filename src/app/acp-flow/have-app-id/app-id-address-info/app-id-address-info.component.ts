import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionsAnalyticsService, FirebaseEBBService, IAutoCompletePrediction, IFirebaseAddress, PlacesAutocompleteService } from '@ztarmobile/zwp-service-backend';
import { IAcpAddress } from '@ztarmobile/zwp-service-backend-v2';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { EBB_NAME_PATTERN } from 'src/app/app.config';
import { AppState } from 'src/app/app.service';
import { EbbManager } from 'src/services/ebb.service';

@Component({
  selector: 'app-app-id-address-info',
  templateUrl: './app-id-address-info.component.html',
  styleUrls: ['./app-id-address-info.component.scss']
})
export class AppIdAddressInfoComponent implements OnInit, OnChanges, OnDestroy {

  @Input() trackingSubscription: Observable<number>;
  @Input() primary: IAcpAddress;
  @Input() userId: string;
  @Input() disable: boolean;
  @Output() setAddresses: EventEmitter<{ primary: IAcpAddress; mail: IAcpAddress }> = new EventEmitter<{ primary: IAcpAddress; mail: IAcpAddress }>();
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();
  public addressInfoForm: FormGroup;
  public primaryAddress: IAcpAddress;
  public namePattern = new RegExp(EBB_NAME_PATTERN);
  public primaryDisplayedAddressModel: any = {};
  public filteredOptions: Observable<Array<IAutoCompletePrediction>>;
  public filteredOptionsSubscription: Subscription;
  
  private displayedAddressModel: any = {};
  private alive = true;
  private streetSearchText: string;

  constructor(private formBuilder: FormBuilder, private ebbManager: EbbManager, private firebaseEBBService: FirebaseEBBService,
    private analyticsService: ActionsAnalyticsService,   private placesAutoCompleteService: PlacesAutocompleteService,
    private appState: AppState) {
    this.addressInfoForm = formBuilder.group({
      address1: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      address2: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      zipCode: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)])],
      city: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\.\s]*$/)])],
      state: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/), Validators.maxLength(2)])]
    });
  }

  ngOnInit(): void {
    this.trackEvent();
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 2) {
        this.addressInfoForm.markAllAsTouched();
        if (!!this.addressInfoForm.valid && !!this.primaryDisplayedAddressModel) {
          this.prepareData();
          this.setAddresses.emit({ primary: this.primaryAddress, mail: {} as IAcpAddress });          
          this.goToNext.emit(3);
        }
      }
    });
    this.populateForms();
  }
  ngOnDestroy(): void {
    this.filteredOptionsSubscription?.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.disable) {
      this.disable = changes.disable.currentValue;
      if (!!this.disable) {
        this.addressInfoForm.disable();
      }
    }
  }
  public findPlace(keyword: ''): Observable<Array<IAutoCompletePrediction>> {
    this.filteredOptions = this.placesAutoCompleteService.findAddress(keyword);
    this.filteredOptionsSubscription = this.filteredOptions.subscribe();
    return this.filteredOptions;
  }

  public changedAddress(form): void {
    this.findPlace(form?.controls?.address1?.value);
    this.primaryDisplayedAddressModel = null;
  }
  public addressDetails(eventFire: IAutoCompletePrediction, formName, form): void {
    if (!!eventFire && !!form.controls.address1?.value && form.controls.address1?.value?.main_text) {
      const event = form.controls.address1?.value;
      if (!!event.place_id) {
        this.appState.loading = true;
        //this is a default value until address have the value from api
        form.controls.address1.setValue(event?.main_text);
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
              const address = `${this.displayedAddressModel?.address1}, ${this.displayedAddressModel?.city
              }, ${this.displayedAddressModel?.state} ${this.displayedAddressModel?.zipCode
                ? this.displayedAddressModel?.zipCode
                : ''
              }`;
              form.controls.city.setValue(this.displayedAddressModel.city);
              form.controls.state.setValue(this.displayedAddressModel.state);
              form.controls.zipCode.setValue(this.displayedAddressModel.zipCode);
              form.controls.address1.setValue(this.displayedAddressModel?.address1);
              if(formName === 'addressInfoForm'){
                this.primaryDisplayedAddressModel = this.displayedAddressModel;
              } else {
                this.primaryDisplayedAddressModel = this.displayedAddressModel;
              }
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
        this.appState.loading = false;
        console.warn(`Google can't find place: ${event.main_text}`);
      }
    } else {
      this.appState.loading = false;
    }
  }
  private getAddressValues(placeInfo: any, searchTerms?: string): any {
    let address: any = {
      address1: placeInfo.address1,
      address2: placeInfo.address2,
      state: placeInfo.state ? placeInfo.state.toUpperCase() : placeInfo.state,
      city: placeInfo.city,
      country: placeInfo.country || 'United States',
      zipCode: placeInfo.postalCode
    } as any;

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
      address.address1 = !!this.streetSearchText ? address.address1 : searchTerms.trim();
    }

    // Clean Out empty values so they dont get assigned to Credit card info,
    address = this.removeEmptyValues(address);
    return Object.assign({}, address);
  }
  private prepareData(): void {
    this.primaryAddress = {} as IAcpAddress;
    this.primaryAddress.address1 = this.addressInfoForm.controls.address1.value;
    this.primaryAddress.address2 = this.addressInfoForm.controls.address2.value;
    this.primaryAddress.state = this.addressInfoForm.controls.state.value;
    this.primaryAddress.state = !!this.primaryAddress.state ? this.primaryAddress.state.toUpperCase() : this.primaryAddress.state;
    this.primaryAddress.city = this.addressInfoForm.controls.city.value;
    this.primaryAddress.zipCode = this.addressInfoForm.controls.zipCode.value;
  }

  private populateForms(): void {
    if (!!this.primary) {
      this.addressInfoForm.controls.address1.setValue(this.primary.address1);
      this.addressInfoForm.controls.address2.setValue(this.primary.address2);
      this.addressInfoForm.controls.state.setValue(this.primary.state);
      this.addressInfoForm.controls.city.setValue(this.primary.city);
      this.addressInfoForm.controls.zipCode.setValue(this.primary.zipCode);
    }
  }
  private trackEvent(): void {
    const data = {
      event: 'addresses_Info',
      category: 'ACP',
      label: 'ACP Step 2',
      action: 'verify address'
    }
    this.analyticsService.trackACPEvent(data);
  }
  private removeEmptyValues(obj): any {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === 'object') {
        this.removeEmptyValues(obj[key]);
      } else if (obj[key] == null || obj[key] === '') {
        delete obj[key];
      }
    });
    return obj;
  }
}

