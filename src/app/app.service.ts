import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { IMarketingDetails } from '@ztarmobile/zwp-service-backend';
import { ActivatedRoute } from '@angular/router';

export interface InternalStateType {
  [key: string]: any;
}

@Injectable({providedIn: 'root'})
export class AppState {
  public state: InternalStateType = {};
  public loading = false;
  public isCampaign = false;
  public userLoggedIn: ReplaySubject<boolean> = new ReplaySubject(1);
  public isMarketingCampaign: Observable<boolean>;
  public isMarktingCampaignReplySubject: ReplaySubject<boolean> = new ReplaySubject(1);
  public campaignQueryParams: Observable<any>;
  public campaignQueryParamsReplySubject: ReplaySubject<any> = new ReplaySubject(1);
  public utmsCampaign: Observable<boolean>;
  public utmsCampaignReplySubject: ReplaySubject<boolean> = new ReplaySubject(1);
  public utmsCampaignParams: Observable<any>;
  public utmsCampaignParamsReplySubject: ReplaySubject<any> = new ReplaySubject(1);
  public isMoneySavingProCampaign: Observable<boolean>;
  public isMoneySavingProReplySubject: ReplaySubject<boolean> = new ReplaySubject(1);
  public globalAlertHeightReplySubject: ReplaySubject<number> = new ReplaySubject(1);
  public globalAlertHeight: Observable<number>;
  public jsonLDString: any;

  private jsonLd: any = {};

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) {
    this.isMarketingCampaign = this.isMarktingCampaignReplySubject.asObservable();
    this.campaignQueryParams = this.campaignQueryParamsReplySubject.asObservable();
    this.isMoneySavingProCampaign = this.isMoneySavingProReplySubject.asObservable();
    this.globalAlertHeight = this.globalAlertHeightReplySubject.asObservable();
    this.utmsCampaign = this.utmsCampaignReplySubject.asObservable();
    this.utmsCampaignParams = this.utmsCampaignParamsReplySubject.asObservable();
  }

  public clearSessionStorage(): void {
    sessionStorage.removeItem('shippingAddress');
    sessionStorage.removeItem('storePickup');
    sessionStorage.removeItem('shippingMethod');
    sessionStorage.removeItem('plan_id');
    sessionStorage.removeItem('payment_id');
    sessionStorage.removeItem('auto_renew');
    sessionStorage.removeItem('purchased');
    sessionStorage.removeItem('activation');
    sessionStorage.removeItem('device');
    sessionStorage.removeItem('emailMdn');
    sessionStorage.removeItem('MoneyProReferral');
    sessionStorage.removeItem('tracked');
    sessionStorage.removeItem('anonymous');
    sessionStorage.removeItem('pendingAddress');
    sessionStorage.removeItem('changeNextCycle');
    sessionStorage.removeItem('skippedPlans');
    sessionStorage.removeItem('termsAccepted');
    sessionStorage.removeItem('referralCode');
    sessionStorage.removeItem('useFromBalance');
    sessionStorage.removeItem('useFromReward');
    sessionStorage.removeItem('removeFromCart');
    sessionStorage.removeItem('editPayment');
    sessionStorage.removeItem('isMigrationSimRemoved');
    sessionStorage.removeItem('selectedPlan');
    sessionStorage.removeItem('checkedDevice');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('navigatedToPayment');
    sessionStorage.removeItem('acp-device');
  }

  public setJsonLdData(data): any {
    this.jsonLd = data;
    this.jsonLd = Object.assign({'@context': 'http://schema.org/'}, this.jsonLd);
    this.jsonLDString = '<script type="application/ld+json">' + JSON.stringify(this.jsonLd) + '</script>';
    this.jsonLDString = this.sanitizer.bypassSecurityTrustHtml(this.jsonLDString);
    return this.jsonLDString;
  }

  public removeEmptyValues(obj): any {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === 'object') {
        this.removeEmptyValues(obj[key]);
      } else if (obj[key] == null || obj[key] === '' || obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  }

  public setMarketingObject(utms): IMarketingDetails {
    const marketingObject: IMarketingDetails = {
      timestamp: new Date().toISOString(), utm_campaign: utms.utm_campaign,
      utm_medium: utms.utm_medium, utm_source: utms.utm_source, attributes: [], url: utms.url, utm_content: !!utms.utm_content ? utms.utm_content : null,
      utm_term: !!utms.utm_term ? utms.utm_term : null
    };
    if (!!utms.agentID || !!utms.agentid) {
      marketingObject.attributes.push({ name: 'agentID', value: !!utms.agentID ? utms.agentID : utms.agentid });
    }
    marketingObject.attributes.push({ name: 'vendorID', value: !!utms && !!utms.vendorID ? utms.vendorID : 'g2g' });
    return marketingObject;
  }

}
