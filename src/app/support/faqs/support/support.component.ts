import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetaService } from '../../../../services/meta-service.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';
import { UserDeviceService } from '@ztarmobile/zwp-service-backend';
import { ContentfulService } from '../../../../services/contentful.service';
import { ENDPOINT_URL } from '../../../../environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrHelperService } from '../../../../services/toast-helper.service';
import { SUPPORT_ROUTE_URLS } from '../../../app.routes.names';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnDestroy, OnInit {
  public questionIdParam: string;
  public mdn: string;
  public network: string;
  public SupportData: any;
  public category = 'support';
  public isReload = false;
  public isCopied = false;
  public processingRequest = false;
  public validMDN = false;
  public collapsed = false;
  private routerSubscription: Subscription;
  public showMore = false;
  public allQuestions = [];
  public filteredQuestions = [];
  public firstTenQuestions;
  public restQuestions;
  public innerWidth: any;
  public innerHeight: any;
  public filterText;
  public carrierId;

  constructor(
    private metaService: MetaService,
    private location: Location,
    private pageScrollService: PageScrollService,
    private userDeviceService: UserDeviceService,
    private contentful: ContentfulService,
    private toastHelper: ToastrHelperService,
    private router: Router,
    private clipboardService: ClipboardService) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.pageYOffset;
    this.pageScrollService.scroll({
      document,
      scrollTarget: '#titleTarget',
      scrollOffset: 0,
      speed: 500
    });
    this.questionIdParam = this.router.url.split('/')[5];
    if (!!this.questionIdParam) {
      const hashId = '#' + this.questionIdParam;
      setTimeout(() => {
        this.pageScrollService.scroll({
          document,
          scrollTarget: hashId,
          scrollOffset: 150,
          speed: 500
        });
      }, 1000);
    }
    this.showData();
  }

  ngOnDestroy(): void {
    if (!!this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  public toggleActive(questionId, carrierID, answerId, copy?): void {
    this.network = carrierID === 'tmo' ? 'tmo' : 'att';
    if (this.questionIdParam === questionId && !this.collapsed && !copy) {
      this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.category}/${this.network}`);
      this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.category}/${this.network}`);
      this.questionIdParam = 'q0';
    } else {
      this.questionIdParam = questionId;
      this.collapsed = false;
      this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.category}/${this.network}/${this.questionIdParam}`);
      this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.category}/${this.network}/${this.questionIdParam}`);
      this.callRichText(answerId);
    }
    if (!!copy && this.questionIdParam === questionId) {
      const url = window.location.host + this.location.path();
      this.clipboardService.copy(url);
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 1500);
    }
  }

  public checkMdn(mdn): void {
    this.processingRequest = true;
    this.userDeviceService.checkDeviceNetworkByMdn(mdn).then((result) => {
      this.validMDN = true;
      this.network = result.network;
      this.showData(true);
    }, (error) => {
      this.validMDN = false;
      this.toastHelper.showAlert(error.message || error);
      this.processingRequest = false;
    });
  }

  public copy(copy, reload, questionId?, carrierID?, answerId?) {
    if (!!copy && !!questionId && !!carrierID && !!answerId && !reload) {
      this.toggleActive(questionId, carrierID, answerId, copy);
    }
    else if (!!copy && !!reload) {
      const url = window.location.host + this.location.path();
      this.clipboardService.copy(url);
      this.isReload = false;
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 1500);
    }
  }

  public filterTextChanged(filterText): void {
    this.getFilteredQuestions(filterText);
  }

  private getFilteredQuestions(filterText): void {
    this.filteredQuestions = this.allQuestions.filter((qst) => {
      if (qst.fields?.questionText.toLowerCase().includes(filterText.toLowerCase())) {
        return qst;
      }
    });
    this.firstTenQuestions = this.filteredQuestions.slice(0, 10);
    if (this.filteredQuestions?.length > 10) {
      this.restQuestions = this.filteredQuestions.slice(10);
    } else {
      this.showMore = false;
    }
  }

  private showData(isValidMdn?: boolean): void {
    if(!isValidMdn) {
      this.network = this.router.url.split('/')[4];
      this.questionIdParam = this.router.url.split('/')[5];
    }
    if (!!this.network) {
      this.validMDN = true;
      this.SupportData = this.contentful.getContentByCarrierId('supportFaqs', this.network).subscribe(questions => {
        if (!!questions) {
          this.carrierId = questions[0]?.fields?.carrierId;
          this.allQuestions = questions[0].fields?.supportQuestions;
          this.filteredQuestions = this.allQuestions;
          this.firstTenQuestions = this.allQuestions.slice(0, 10);
          this.restQuestions = this.allQuestions.slice(10);
        }
      });
      this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.category}/${this.network}`);
      this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.category}/${this.network}`);
      if (!!this.questionIdParam) {
        this.isReload = true;
        this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.category}/${this.network}/${this.questionIdParam}`);
        this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.category}/${this.network}/${this.questionIdParam}`);
        this.contentful.getAnswerIdByQstId('questions', this.questionIdParam).subscribe(val =>
          this.callRichText(val['answerId']));
      }
    }
  }

  private callRichText(id) {
    this.contentful.getRichText('questions', id);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.innerHeight = window.pageYOffset;
  }
}

