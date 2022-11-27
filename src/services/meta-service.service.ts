import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ENDPOINT_URL } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MetaService {
  constructor(@Inject(DOCUMENT) private dom, private router: Router) {}

  createCanonicalUrl(url?: string, keepRouteParam?: boolean): void {
        const head = this.dom.getElementsByTagName('head')[0];
        let link: HTMLLinkElement = this.dom.querySelector(`link[rel='canonical']`) || null;
        if (!link) {
            link = this.dom.createElement('link') as HTMLLinkElement;
            head.appendChild(link);
        }
        link.setAttribute('rel', 'canonical');
        this.dom.head.appendChild(link);
        const requiredUrl = !!keepRouteParam ? this.router.url.split('?')[0] : this.router.url.split('?')[0].split(';')[0];
        const fullPath = !!url ? url : ENDPOINT_URL + requiredUrl;
        link.setAttribute('href', fullPath);
  }
}
