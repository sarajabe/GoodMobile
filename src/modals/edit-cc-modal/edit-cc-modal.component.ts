import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { ModalComponent, DialogRef, CloseGuard } from 'ngx-modialog-7';
import { IFirebasePaymentMethod, PlacesAutocompleteService, IAutoCompletePrediction, IAddress, AccountPaymentService } from '@ztarmobile/zwp-service-backend';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PlatformLocation } from '@angular/common';

export class CreditCardContext extends BSModalContext {
  public paymentMethod: IFirebasePaymentMethod;
  public title: string;
  public note: string;
  public noteLinkText: string;
  public customClass?: string;
}

@Component({
  selector: 'app-edit-cc-modal',
  templateUrl: './edit-cc-modal.component.html'
})
export class EditCcModalComponent implements CloseGuard, ModalComponent<CreditCardContext>, OnInit, OnDestroy {
  public context: CreditCardContext;
  public paymentInfo: IFirebasePaymentMethod;
  public methodsList: IFirebasePaymentMethod[];
  public billingAddress: IAddress;
  public expirationYearRange: Array<number>;
  public ccForm: UntypedFormGroup;
  public addressForm: UntypedFormGroup;
  public selectedMethodId: string;
  public isValidPaymentInfo = false;
  public processingRequest = false;
  public setDefaultRequest = false;
  public isEditMode = false;
  private currentDate: Date;
  private streetSearchText: string;

  constructor(public dialog: DialogRef<CreditCardContext>, private formBuilder: UntypedFormBuilder, private cdRef: ChangeDetectorRef,
              private placesAutoCompleteService: PlacesAutocompleteService, private location: PlatformLocation) {
    this.context = dialog.context;
    location.onPopState(() => this.dialog.close());
    dialog.setCloseGuard(this);
    this.addressForm = formBuilder.group({
      alias: ['', Validators.required],
      address1: ['', Validators.required],
      city: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
      state: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
      postalCode: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)])],
    });
    this.currentDate = new Date();
    this.ccForm = formBuilder.group({
      fullName: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
      cardCode: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]*$/)])],
      cardExpirationMonth: ['', Validators.required],
      cardExpirationYear: ['', Validators.required],
    }, { validator: this.validExpirationDate('cardExpirationMonth', 'cardExpirationYear') });
    this.ccForm.controls.cardExpirationMonth.setValue(this.context.paymentMethod.expirationDate.substring(0, 2));
    this.ccForm.controls.cardExpirationYear.setValue(this.context.paymentMethod.expirationDate.substring(2, 4));
    this.ccForm.controls.fullName.setValue(this.context.paymentMethod.fullName);
    this.addressForm.controls.alias.setValue(!!this.context.paymentMethod.name ? this.context.paymentMethod.name : this.context.paymentMethod.alias);
    this.addressForm.controls.address1.setValue(this.context.paymentMethod.address1);
    this.addressForm.controls.city.setValue(this.context.paymentMethod.city);
    this.addressForm.controls.state.setValue(this.context.paymentMethod.state);
    this.addressForm.controls.postalCode.setValue(this.context.paymentMethod.postalCode);
    this.expirationYearRange = [];
    const year = parseInt(this.currentDate.getFullYear().toString().substr(-2), 10);
    for (let i = 0; i < 20; i++) {
      this.expirationYearRange.push(year + i);
    }
    this.billingAddress = {} as IAddress;
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.cdRef.detach();
  }

  beforeClose(): boolean {
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
    }
    return false;
  }

  public addNewPayment(): void {
    this.closeDialog('new');
  }

  public validExpirationDate(month: string, year: string): any {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      const expMonth = group.controls[month];
      const expYear = group.controls[year];
      if (!!this.context.paymentMethod && !!expYear.value && !!expMonth.value) {
        this.context.paymentMethod.expirationDate = expMonth.value + expYear.value;
      }
      const currentYear = this.currentDate.getFullYear() % 100;
      if (!!expYear.value && !!expMonth.value) {
        if (this.currentDate.getMonth() + 1 > +expMonth.value && currentYear >= +expYear.value) {
          return {
            cardExpirationInvalid: true
          };
        }
      }
    };
  }

  public savePaymentInfo(): void {
    this.context.paymentMethod.fullName = this.ccForm.get('fullName').value;
    this.context.paymentMethod.name = this.addressForm.get('alias').value;
    this.billingAddress.state = this.addressForm.get('state').value;
    this.billingAddress.city = this.addressForm.get('city').value;
    this.ccForm.markAllAsTouched();
    this.addressForm.markAllAsTouched();
    if (!!this.addressForm.valid && !!this.ccForm.valid) {
      if (!!this.isEditMode) {
        this.billingAddress.address1 = AccountPaymentService.shortenAddress(this.billingAddress.address1, 30);
        this.billingAddress.city = AccountPaymentService.shortenAddress(this.billingAddress.city, 20);
        Object.assign(this.context.paymentMethod, this.billingAddress);
      }
      this.context.paymentMethod.expirationDate = this.ccForm.get('cardExpirationMonth').value + this.ccForm.get('cardExpirationYear').value;
      this.closeDialog({ paymentMethod: this.context.paymentMethod, cardCode: this.ccForm.get('cardCode').value });
    }
  }

  public enableEditAddress(): void {
    this.billingAddress.address1 = this.context.paymentMethod.address1;
    this.billingAddress.city = this.context.paymentMethod.city;
    this.billingAddress.state = this.context.paymentMethod.state;
    this.billingAddress.postalCode = this.context.paymentMethod.postalCode;
    this.isEditMode = true;
  }

  public addressDetails(event: IAutoCompletePrediction): void {
    if (!!event && !!event.main_text) {
      this.billingAddress.address1 = this.addressForm.get('address1').value;
      if (!!event.place_id) {
        this.placesAutoCompleteService.findDetailedAddressFields(event.place_id).subscribe((place) => {
          this.streetSearchText = !!place.address1 && place.address1.length > 0 ? place.address1 : null;
          this.getAddressValues(place, event.main_text);
          this.addressForm.controls.city.setValue(this.billingAddress.city);
          this.addressForm.controls.state.setValue(this.billingAddress.state);
          this.addressForm.controls.postalCode.setValue(this.billingAddress.postalCode);
        }, (error) => {
          console.warn(`Google can't find details for place: ${event.place_id}`, error);
          this.getAddressValues(this.billingAddress, event.main_text);
        });
      } else {
        console.warn(`Google can't find place: ${event.main_text}`);
        this.getAddressValues(this.billingAddress, event.main_text);
      }
    } else {
      this.getAddressValues(this.billingAddress, this.billingAddress.address1);
    }
  }

  public findPlace(keyword: any): Observable<Array<IAutoCompletePrediction>> {
    return this.placesAutoCompleteService.findAddress(keyword);
  }

  public closeDialog(action?: any): void {
    this.dialog.close(action);
  }

  private getAddressValues(placeInfo: any, searchTerms?: string): IAddress {
    let address: IAddress = {
      name: !!this.context.paymentMethod.name ? this.context.paymentMethod.name : this.context.paymentMethod.alias,
      address1: placeInfo.address1,
      state: placeInfo.state ? placeInfo.state.toUpperCase() : placeInfo.state,
      city: placeInfo.city,
      country: placeInfo.country || 'United States',
      postalCode: placeInfo.postalCode
    } as IAddress;
    if (!!searchTerms && typeof searchTerms === 'string') {
      if (!!this.streetSearchText) {
        if (!searchTerms.match(this.streetSearchText)) {
          this.streetSearchText = null;
        }
      }
      address.address1 = !!this.streetSearchText ? address.address1 : searchTerms.trim();
    }
    address = this.removeEmptyValues(address);
    return Object.assign(this.billingAddress, address);
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
