import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mobileDataFormat'
})
export class MobileFormatDataPipe implements PipeTransform {

  transform(value: number, fractionDigits?: number, nospace?: boolean): string {
    if (!!value) {
      const KILOBYTE = 1;
      const MEGABYTE = KILOBYTE * 1024;
      const GIGABYTE = MEGABYTE * 1024;

      let formatString = '';
      fractionDigits = !!fractionDigits || fractionDigits === 0 ? fractionDigits : 2;
      if (value >= GIGABYTE) {
        formatString = (value / GIGABYTE).toFixed(fractionDigits) + (nospace ? '' : ' ') + 'GB';
      } else if (value < GIGABYTE && value >= MEGABYTE) {
        formatString = (value / MEGABYTE).toFixed(fractionDigits) + (nospace ? '' : ' ') + 'MB';
      } else {
        formatString = value + (nospace ? '' : ' ') + 'KB';
      }

      return formatString;
    }
    return '';
  }

}
