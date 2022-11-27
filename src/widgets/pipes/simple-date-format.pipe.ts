import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simpleDateFormat'
})
export class SimpleDateFormatPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
