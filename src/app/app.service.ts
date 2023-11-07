import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseUserProfileService, IMarketingDetails } from '@ztarmobile/zwp-service-backend';
import { ActivatedRoute } from '@angular/router';
import { ACP_CALLBACK_URL } from 'src/environments/environment';
import { ACP_ROUTE_URLS } from './app.routes.names';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';

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
  public displayAcpSection: ReplaySubject<boolean> = new ReplaySubject(1);
  public displayAcpSectionObs:  Observable<boolean>;
  public acpAppRes: ReplaySubject<any> = new ReplaySubject(1);
  public acpAppResObs:  Observable<any>;
  public acpAppError: ReplaySubject<any> = new ReplaySubject(1);
  public acpAppErrorObs:  Observable<any>;
  public acpActiveAppRes: ReplaySubject<any> = new ReplaySubject(1);
  public acpActiveAppResObs:  Observable<any>;

  private jsonLd: any = {};

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute,
    private ebbService: EbbService, private userProfileService: FirebaseUserProfileService) {
    this.isMarketingCampaign = this.isMarktingCampaignReplySubject.asObservable();
    this.campaignQueryParams = this.campaignQueryParamsReplySubject.asObservable();
    this.isMoneySavingProCampaign = this.isMoneySavingProReplySubject.asObservable();
    this.globalAlertHeight = this.globalAlertHeightReplySubject.asObservable();
    this.utmsCampaign = this.utmsCampaignReplySubject.asObservable();
    this.utmsCampaignParams = this.utmsCampaignParamsReplySubject.asObservable();
    this.displayAcpSectionObs = this.displayAcpSection.asObservable();
    this.acpAppResObs = this.acpAppRes.asObservable();
    this.acpActiveAppResObs = this.acpActiveAppRes.asObservable();
    this.acpAppErrorObs = this.acpAppError.asObservable();
  }

  public clearSessionStorage(): void {
    sessionStorage.removeItem('shippingAddress');
    sessionStorage.removeItem('storePickup');
    sessionStorage.removeItem('personPickup');
    sessionStorage.removeItem('shippingMethod');
    sessionStorage.removeItem('plan_id');
    sessionStorage.removeItem('payment_id');
    sessionStorage.removeItem('auto_renew');
    sessionStorage.removeItem('purchased');
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
  public checkInternalEbbApp(): void {
    this.userProfileService.userProfileObservable.subscribe((user) => {
      if (!!user && !!user.ebbId) {
        const callBackUrl = `${ACP_CALLBACK_URL}/${ACP_ROUTE_URLS.BASE}`;
        this.ebbService.getACPApplicationStatus(user.ebbId, user.customerId, callBackUrl).then((res) => {
          if (!!res) {
           this.displayAcpSection.next(true);
           this.acpAppRes.next(res);
           this.acpAppError.next(null);
          } else {
            this.displayAcpSection.next(false);
            this.acpAppRes.next(null);
            this.acpAppError.next(null);
          }
        }, (error) => {
          if (!!error?.error && !!error?.error?.errors[0] && error?.error?.errors[0]?.code === 'APP_CLOSED_OR_EXPIRED') {
            this.displayAcpSection.next(true);
            this.acpAppRes.next(null);
            this.acpAppError.next(error);
          } else {
            this.displayAcpSection.next(false);
            this.acpAppRes.next(null);
            this.acpAppError.next(error);
          }
        });
      } else if (!!user && !user.ebbId) {
        this.ebbService.getActiveInternalApplication(user.customerId).then((res) => {
          if (!!res) {
            this.displayAcpSection.next(true);
            this.acpActiveAppRes.next(res);
          } else {
            this.displayAcpSection.next(false);
            this.acpActiveAppRes.next(null);
          }
        }, (error) => {
          this.displayAcpSection.next(false);
          this.acpActiveAppRes.next(null);
        });
      }
    });
  }
}
