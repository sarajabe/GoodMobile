import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IAutoCompletePrediction, IFirebaseAddress, PlacesAutocompleteService } from '@ztarmobile/zwp-service-backend';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-address-lookup',
  templateUrl: 'address-lookup.html'
})
export class AddressLookupComponent implements OnDestroy, OnInit, OnChanges {
  public static ADDRESS_DETAILS_FIELD = {
    COUNTRY: 'COUNTRY',
    CITY: 'CITY',
    STATE: 'STATE',
    POSTAL: 'POSTAL'
  };

  @Input() displayedAddress: IFirebaseAddress;
  @Input() showAlias = false;
  @Input() readonly = false;
  @Input() billingAddressAlias = false;
  @Input() touchForm = false;
  @Input() resetForm = false;
  @Output() addressChange: EventEmitter<IFirebaseAddress> = new EventEmitter();
  @Output() isValid: EventEmitter<boolean> = new EventEmitter();

  public displayedAddressModel: IFirebaseAddress = {} as IFirebaseAddress;
  public addressFieldsForm: UntypedFormGroup;
  public hasDetails = false;
  public isValidCity = true;
  public isValidState = true;
  public isValidPostal = true;
  public isValidAlias = true;
  public filteredOptions: Observable<Array<IAutoCompletePrediction>>;
  public filteredOptionsSubscription: Subscription;
  private streetSearchText: string;

  constructor(private cdRef: ChangeDetectorRef, private placesAutoCompleteService: PlacesAutocompleteService,
              private formBuilder: UntypedFormBuilder,private appState: AppState) {
    this.addressFieldsForm = formBuilder.group({
      alias: [''],
      address1: ['', Validators.required],
      address2: [''],
      country: [''],
      city: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\.\s]*$/)])],
      state: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
      postalCode: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)])],
    });
    this.hasDetails = false;
    this.displayedAddressModel = this.displayedAddress;
    // eslint-disable-next-line max-len
    this.addressFieldsForm.valueChanges.subscribe((formValue) => this.isValid.emit(this.addressFieldsForm.valid &&
      this.validateCityName(formValue.city) && this.validateStateName(formValue.state) &&
      this.validatePostalCode(formValue.postalCode)
      && this.validateAlias(formValue.alias) && this.validateAddress1(formValue.address1)));
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
    if (!!this.showAlias) {
      this.addressFieldsForm.controls.alias.setValidators(Validators.required);
      this.addressFieldsForm.controls.alias.updateValueAndValidity();
    } else {
      this.addressFieldsForm.controls.alias.clearValidators();
      this.addressFieldsForm.controls.alias.updateValueAndValidity();
    }
  }
  public changedAddress(): void {
    this.findPlace(this.addressFieldsForm.controls.address1.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.displayedAddress) {
      const address: IFirebaseAddress = changes.displayedAddress.currentValue;
      this.hasDetails = !!address && !!address.postalCode;
      if (!!address) {
        if (!address.main_text) {
          address.main_text = `${!!address.address1 ? address.address1 : ''}`;
        }
        this.addressFieldsForm.controls.alias.setValue(!!address.name ? address.name : address.alias);
        this.addressFieldsForm.controls.address1.setValue(address.address1);
        this.addressFieldsForm.controls.address2.setValue(address.address2);
        this.addressFieldsForm.controls.city.setValue(address.city);
        this.addressFieldsForm.controls.state.setValue(address.state);
        this.addressFieldsForm.controls.postalCode.setValue(address.postalCode);
        this.addressFieldsForm.controls.country.setValue(address.country);
        this.displayedAddressModel = Object.assign({}, address);
      }
    }
    if (!!changes.touchForm && !!changes.touchForm.currentValue) {
      this.addressFieldsForm.markAllAsTouched();
    }
    if (!!changes.resetForm && !!changes.resetForm.currentValue) {
      this.addressFieldsForm.reset();
    }
  }

  ngOnDestroy(): void {
    this.cdRef.detach();
  }

  public findPlace(keyword: ''): Observable<Array<IAutoCompletePrediction>> {
    this.hasDetails = keyword !== '';
    this.filteredOptions = this.placesAutoCompleteService.findAddress(keyword);
    this.filteredOptionsSubscription = this.filteredOptions.subscribe();
    return this.filteredOptions;
  }

  public addressFieldChanged(value): void {
    this.displayedAddressModel.name = this.addressFieldsForm.get('alias').value;
    this.displayedAddressModel.address2 = this.addressFieldsForm.get('address2').value;
    this.displayedAddressModel.city = this.addressFieldsForm.get('city').value;
    this.displayedAddressModel.state = this.addressFieldsForm.get('state').value;
    this.displayedAddressModel.postalCode = this.addressFieldsForm.get('postalCode').value;
    this.addressChange.emit(this.getAddressValues(this.displayedAddressModel));
  }

  public addressLookupChanged(value): void {
    this.displayedAddressModel.address1 = this.addressFieldsForm.get('address1').value;
    this.addressChange.emit(this.getAddressValues(this.displayedAddressModel, value));
  }

  public addressDetails(eventFire: IAutoCompletePrediction): void {
    if (this.readonly) {
      return;
    }
    if (!!eventFire && !!this.addressFieldsForm.controls.address1?.value && this.addressFieldsForm.controls.address1?.value?.main_text) {
      const event = this.addressFieldsForm.controls.address1?.value;
      if (!!event.place_id) {
        this.appState.loading = true;
        this.placesAutoCompleteService.findDetailedAddressFields(event.place_id).subscribe((place) => {
          this.streetSearchText = !!place.address1 && place.address1.length > 0 ? place.address1 : null;
          this.displayedAddressModel = this.getAddressValues(place, event.main_text);
          const address = `${this.displayedAddressModel?.address1}, ${this.displayedAddressModel?.city
          }, ${this.displayedAddressModel?.state} ${this.displayedAddressModel?.postalCode
            ? this.displayedAddressModel?.postalCode
            : ''
          }`;
          this.addressFieldsForm.controls.city.setValue(this.displayedAddressModel.city);
          this.addressFieldsForm.controls.state.setValue(this.displayedAddressModel.state);
          this.addressFieldsForm.controls.postalCode.setValue(this.displayedAddressModel.postalCode);
          this.addressChange.emit(this.displayedAddressModel);
          this.addressFieldsForm.controls.address1.setValue(address);
          this.appState.loading = false;
        }, (error) => {
          this.appState.loading = false;
          console.warn(`Google can't find details for place: ${event.place_id}`, error);
          this.addressChange.emit(this.getAddressValues(this.displayedAddressModel, event.main_text));
        });
      } else {
        console.warn(`Google can't find place: ${event.main_text}`);
        this.addressChange.emit(this.getAddressValues(this.displayedAddressModel, event.main_text));
      }
    } else {
      this.displayedAddressModel.address1 = this.addressFieldsForm.get('address1').value;
      this.addressChange.emit(this.getAddressValues(this.displayedAddressModel, this.displayedAddressModel.address1));
    }
  }

  public validateAlias(alias): boolean {
    if (!!this.showAlias) {
      if (!!alias) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  public validateAddress1(name): boolean {
    if (!!name || !!this.displayedAddress.address1) {
      return true;
    } else {
      return false;
    }
  }
  public validateCityName(name: string): boolean {
    this.isValidCity = /^[a-zA-Z][a-zA-Z\.\s]*$/.test(name);
    return this.isValidCity;
  }
  public validateStateName(name: string): boolean {
    this.isValidState = /^[a-zA-Z][a-zA-Z\s]*$/.test(name);
    return this.isValidState;
  }

  public validatePostalCode(code: string): boolean {
    this.isValidPostal = /^\d{5}(-\d{4})?$/.test(code);
    return this.isValidPostal;
  }
  private getAddressValues(placeInfo: any, searchTerms?: string): IFirebaseAddress {
    let address: IFirebaseAddress = {
      name: !!this.displayedAddressModel.name ? this.displayedAddressModel.name : this.displayedAddressModel.alias,
      address1: placeInfo.address1,
      address2: placeInfo.address2,
      state: placeInfo.state ? placeInfo.state.toUpperCase() : placeInfo.state,
      city: placeInfo.city,
      country: placeInfo.country || 'United States',
      postalCode: placeInfo.postalCode
    } as IFirebaseAddress;

    if (!!this.displayedAddressModel.id) {
      address.id = this.displayedAddressModel.id;
      address.isDefault = this.displayedAddressModel.isDefault;
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
