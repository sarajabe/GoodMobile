import { Injectable } from '@angular/core';
import { IAutoCompleteAddressComponents, IAddress, IShipmentValidity } from '@ztarmobile/zwp-service-backend-v2';
import 'rxjs/add/observable/of';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteAddressService {
  public allAddresses: IAddress[] = [];
  public GOV_CITIES = ['APO', 'DPO', 'FPO'];
  public findDetailedAddressFields(addresses: IAddress[]): any {
    this.allAddresses = [];
    if (!!addresses && addresses.length > 0) {
      addresses.forEach(address => {
        const addressDetails = address.components;
        if (!!addressDetails) {
          const country = this.getAddressComponentByType(addressDetails, 'country', true);
          let state = this.getAddressComponentByType(addressDetails, 'administrative_area_level_1', true);
          if (country === 'PR') {
            // Paurto Rico
            state = country;
          }
          let city = this.getAddressComponentByType(addressDetails, 'locality');
          if (city === '') {
            // test case for this try look up for '3738 Park Avenue'
            city = this.getAddressComponentByType(addressDetails, 'sublocality') || this.getAddressComponentByType(addressDetails, 'city');
          }
          const fullStreet = (
            this.getAddressComponentByType(addressDetails, 'street_number', true) +
            ' ' +
            this.getAddressComponentByType(addressDetails, 'street_name', true) +
            ' ' +
            this.getAddressComponentByType(addressDetails, 'route', true)
          ).trim();

          const newAddress: IAddress = {
            address1: fullStreet,
            address2: '',
            country: this.getAddressComponentByType(addressDetails, 'country'),
            city,
            state,
            postalCode: this.getAddressComponentByType(addressDetails, 'postal_code') || this.getAddressComponentByType(addressDetails, 'postalCode'),
            name: address.name,
            id: address.id
          } as unknown as IAddress;
          this.allAddresses.push(newAddress);
        }
      });

    } else {
      console.warn('data is undefined');
    }
    return this.allAddresses;
  }
  public mapIntoIAddressFromComponents(address: IAddress): any {
    let mappedAddress;
    if (!!address) {
      const addressDetails = address.components;
      if (!!addressDetails) {
        const country = this.getAddressComponentByType(addressDetails, 'country', true);
        let state = this.getAddressComponentByType(addressDetails, 'administrative_area_level_1', true);
        if (country === 'PR') {
          // Paurto Rico
          state = country;
        }
        let city = this.getAddressComponentByType(addressDetails, 'locality');
        if (city === '') {
          // test case for this try look up for '3738 Park Avenue'
          city = this.getAddressComponentByType(addressDetails, 'sublocality') || this.getAddressComponentByType(addressDetails, 'city');
        }
        const fullStreet = (
          this.getAddressComponentByType(addressDetails, 'street_number', true) +
          ' ' +
          this.getAddressComponentByType(addressDetails, 'street_name', true) +
          ' ' +
          this.getAddressComponentByType(addressDetails, 'route', true)
        ).trim();
        const newAddress: IAddress = {
          address1: fullStreet,
          address2: '',
          country: this.getAddressComponentByType(addressDetails, 'country'),
          city,
          state,
          postalCode: this.getAddressComponentByType(addressDetails, 'postal_code') || this.getAddressComponentByType(addressDetails, 'postalCode'),
          name: address.name,
          id: address.id
        } as unknown as IAddress;
        mappedAddress = newAddress;
      }

    } else {
      console.warn('data is undefined');
    }
    return mappedAddress;
  }
  public mapIntoIAddressFromIShipmentValidity(address: IShipmentValidity): any {
    let mappedAddress;
    if (!!address) {
      if (!!address.postalCode.includes('-')) {
        address.postalCode = address.postalCode.split('-')[0];
      }
      const newAddress: IAddress = {
        address1: address.address1,
        address2: '',
        city: address.locality,
        state: address.administrative_area_level_1,
        postalCode: address.postalCode
      } as IAddress;
      mappedAddress = newAddress;
    } else {
      console.warn('data is undefined');
    }
    return mappedAddress;
  }
  public mapIntoComponentsWithArrayReturning(address: IAddress): any {
    const addressComponents = [];

    // Split address1 to streetName, streetNumber
    const { street_number, street_name } = this.splitAddress1(address.address1.trim());

    // Handle address1 - special handling for government/military addresses
    if (this.GOV_CITIES.includes(address.city.trim().toUpperCase())) {
      const govAddress = `${street_number} ${street_name} ${!!address.address2 ? address.address2.trim() : ''}`;
      addressComponents.push(this.getAddressComponent(govAddress, 'address1'));
    } else {
      addressComponents.push(this.getAddressComponent(street_number, 'street_number'));

      addressComponents.push(this.getAddressComponent(street_name, 'street_name'));

      if (!!address.address2) {
        addressComponents.push(this.getAddressComponent(address.address2.trim(), 'address2'));
      }
    }

    // All addresss have these components
    addressComponents.push(this.getAddressComponent(address.city, 'city'));
    addressComponents.push(this.getAddressComponent(address.state, 'state'));
    addressComponents.push(this.getAddressComponent(address.country, 'country'));

    const [zip5, zip4] = address.postalCode.split('-');
    addressComponents.push(this.getAddressComponent(zip5, 'zip5'));
    if (!!zip4) {
      addressComponents.push(this.getAddressComponent(zip4, 'zip4'));
    }
    const addresses = [];
    addresses.push({ components: addressComponents, name: address.name || '', isDefault: address.isDefault || false });
    return { addresses };
  }
  public mapIntoComponentsWithObjectReturning(address: IAddress): any {
    const addressComponents = [];
    // Split address1 to streetName, streetNumber
    const { street_number, street_name } = this.splitAddress1(address.address1.trim());

    // Handle address1 - special handling for government/military addresses
    if (this.GOV_CITIES.includes(address.city.trim().toUpperCase())) {
      const govAddress = `${street_number} ${street_name} ${!!address.address2 ? address.address2.trim() : ''}`;
      addressComponents.push(this.getAddressComponent(govAddress, 'address1'));
    } else {
      addressComponents.push(this.getAddressComponent(street_number, 'street_number'));

      addressComponents.push(this.getAddressComponent(street_name, 'street_name'));

      if (!!address.address2) {
        addressComponents.push(this.getAddressComponent(address.address2.trim(), 'address2'));
      }
    }

    // All addresss have these components
    addressComponents.push(this.getAddressComponent(address.city, 'city'));
    addressComponents.push(this.getAddressComponent(address.state, 'state'));
    addressComponents.push(this.getAddressComponent(address.country, 'country'));

    const [zip5, zip4] = address.postalCode.split('-');
    addressComponents.push(this.getAddressComponent(zip5, 'zip5'));
    if (!!zip4) {
      addressComponents.push(this.getAddressComponent(zip4, 'zip4'));
    }
    return { components: addressComponents, name: address.name || '', isDefault: address.isDefault || false };
  }

  public shortenAddress(text: string, maxLen: number = 30, separator: string = ' '): string {
    if (!text || text.length <= maxLen) {
      return text;
    }
    return text.substr(0, text.lastIndexOf(separator, maxLen));
  }

  private splitAddress1(address1): any {
    const components = address1.split(' ');
    const num = components[0];
    const name = components.slice(1).join(' ');

    return { street_number: num, street_name: name };
  }
  private getComponentType(type): any {
    switch (type) {
      case 'address1':
      case 'address2':
        return 'secondary_unit_designator';
      case 'state':
        return 'administrative_area_level_1';
      case 'street_number':
        return 'street_number';
      case 'street_name':
        return 'route';
      case 'route':
        return 'route';
      case 'city':
        return 'locality';
      case 'zip5':
        return 'postal_code';
      case 'zip4':
        return 'postal_code_suffix';
      case 'country':
        return 'country';
      default:
        return null;
    }
  }
  private getAddressComponent(name, type): any {
    return {
      longName: name.trim() || '',
      shortName: name.trim() || '',
      types: [this.getComponentType(type)] || '',
    };
  }
  private getAddressComponentByType(addressComponents: Array<IAutoCompleteAddressComponents>, type: string, short?: boolean): string {
    let selectedComponentText = '';
    let selectedComponent;
    if (addressComponents) {
      selectedComponent = addressComponents.find((ac) => ac.types.indexOf(type) !== -1);
    }
    if (!!selectedComponent) {
      if (short) {
        selectedComponentText = selectedComponent.shortName;
      } else {
        selectedComponentText = selectedComponent.longName;
      }
    } else {
      selectedComponentText = '';
    }

    return selectedComponentText;
  }
}
