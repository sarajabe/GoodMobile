import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'expirationDateFormat'})
export class ExpirationDateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!!value) {
      return value.substring(0, 2) + '/20' + value.substring(2, 4);
    }
    return '';
  }
}
