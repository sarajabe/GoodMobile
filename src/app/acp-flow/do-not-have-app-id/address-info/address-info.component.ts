import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IAutoCompletePrediction, PlacesAutocompleteService } from '@ztarmobile/zwp-service-backend';
import { IAcpAddress } from '@ztarmobile/zwp-service-backend-v2';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AppState } from 'src/app/app.service';
import { EbbManager } from 'src/services/ebb.service';

@Component({
  selector: 'app-non-appId-existing-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})
export class AddressInfoNonAppExisitngComponent implements OnInit, OnChanges {
  @Input() disable: boolean;
  @Input() address: IAcpAddress;
  @Output() setAddresses: EventEmitter<IAcpAddress> = new EventEmitter<IAcpAddress>();
  @Output() goToNext: EventEmitter<number> = new EventEmitter<number>();

  public addressInfoForm: UntypedFormGroup;
  public userAddress: IAcpAddress = {} as IAcpAddress;
  public filteredOptions: Observable<Array<IAutoCompletePrediction>>;
  public filteredOptionsSubscription: Subscription;
  public displayedAddressModel: any = {};

  private alive = true;
  private streetSearchText: string;

  constructor(
    private formBuilder: FormBuilder,
    private ebbManager: EbbManager,
    private placesAutoCompleteService: PlacesAutocompleteService,
    private appState: AppState) {
    this.addressInfoForm = this.formBuilder.group({
      address1: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      address2: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      zipCode: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)])],
      city: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\.\s]*$/)])],
      state: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/), Validators.maxLength(2)])]
    });
  }

  ngOnInit(): void {
    this.ebbManager.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      if (!!step && step === 2) {
        this.addressInfoForm.markAllAsTouched();
        if (!!this.addressInfoForm.valid && !!this.displayedAddressModel) {
          this.userAddress.address1 = this.addressInfoForm?.controls.address1.value;
          this.userAddress.address2 = this.addressInfoForm?.controls.address2.value;
          this.userAddress.state = this.addressInfoForm?.controls.state.value;
          this.userAddress.state = !!this.userAddress.state ? this.userAddress.state.toUpperCase() : this.userAddress.state;
          this.userAddress.city = this.addressInfoForm?.controls.city.value;
          this.userAddress.zipCode = this.addressInfoForm?.controls.zipCode.value;
          this.setAddresses.emit(this.userAddress);
          this.goToNext.emit(3);
        }
      }
    });
    if (!!this.address) {
      this.addressInfoForm.controls.address1.setValue(this.address.address1);
      this.addressInfoForm.controls.address2.setValue(this.address.address2);
      this.addressInfoForm.controls.state.setValue(this.address.state);
      this.addressInfoForm.controls.city.setValue(this.address.city);
      this.addressInfoForm.controls.zipCode.setValue(this.address.zipCode);
    }
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

  public changedAddress(formName, form): void {
    this.findPlace(form?.controls?.address1?.value);
    this.displayedAddressModel = null;
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
              form.controls.address1.setValue(address);
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
