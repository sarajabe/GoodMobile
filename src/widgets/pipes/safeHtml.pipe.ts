import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  // eslint-disable-next-line
  transform(url) {
    return this.sanitizer.bypassSecurityTrustHtml(url);
  }
}
