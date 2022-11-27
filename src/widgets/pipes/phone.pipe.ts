import { Pipe, PipeTransform } from '@angular/core';
import { format, parseNumber, parsePhoneNumber } from 'libphonenumber-js';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }
    const phoneNumber = parsePhoneNumber(`${value}`, 'US')
    return phoneNumber.formatNational();
  }

}
