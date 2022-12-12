import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MetaService } from '../../../services/meta-service.service';
import { ENDPOINT_URL } from '../../../environments/environment';
import { ContentfulService } from '../../../services/contentful.service';
import { PageScrollService } from 'ngx-page-scroll-core';
import { Subscription } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';
import { SUPPORT_ROUTE_URLS } from '../../app.routes.names';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit, OnDestroy {
  public questionIdParam: string;
  public faqsCategories: any;
  public questions: any;
  public targetCategory: string;
  public activeCategory: string;
  public collapsed = false;
  public isCopied = false;
  public isCovid = false;
  public isSupport = false;
  public routerSubscription: Subscription;
  constructor(private metaService: MetaService, private router: Router, private contentFulService: ContentfulService, private location: Location,
    private pageScrollService: PageScrollService, private route: ActivatedRoute, private clipboardService: ClipboardService) {
    this.metaService.createCanonicalUrl();
  }
  ngOnInit(): void {
    this.contentFulService.getContent('faqsSection').subscribe(result => {
      if (!!result) {
        this.faqsCategories = result;
        this.targetCategory = this.faqsCategories[0].fields.g2gFaqs[0].fields.categoryId;
        this.activeCategory = this.targetCategory;
        this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}`);
        this.questions = this.contentFulService.getQuestionsByCategoryId('good2goFaqs', this.targetCategory);
        this.checkParams();
      }
    });
  }
  ngOnDestroy(): void {
    if (!!this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  private checkParams(): void {
    if (this.router.url.split('/')[3] === 'support') {
      this.isSupport = true;
      this.activeCategory = 'support';
    }
    this.routerSubscription = this.route.params.subscribe(params => {
      if (!!params.category) {
        this.targetCategory = params.category;
        this.activeCategory = this.targetCategory;
        this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}`);
        this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}`);
        this.questions = this.contentFulService.getQuestionsByCategoryId('good2goFaqs', this.targetCategory);
        if (this.targetCategory === 'covid') {
          this.isCovid = true;
        }
        if (!!params.id) {
          this.questionIdParam = params.id;
          this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}/${this.questionIdParam}`);
          this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}/${this.questionIdParam}`);
          this.contentFulService.getAnswerIdByQstId('questions', this.questionIdParam).subscribe(val => {
            if (!!val.answerId) {
              this.callRichText(val.answerId);
            }
          });
          this.collapsed = true;
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
      }
    });
  }
  public setCategory(category, categoryId): void {
    this.pageScrollService.scroll({
      document,
      scrollTarget: '.content-section',
      scrollOffset: 100,
      speed: 200
    });
    if (!!category && !!categoryId) {
      this.isCovid = false;
      this.isSupport = false;
      this.questionIdParam = 'q0';
      this.targetCategory = categoryId;
      if (category !== this.activeCategory) {
        this.activeCategory = this.targetCategory;
        this.questions = this.contentFulService.getQuestionsByCategoryId('good2goFaqs', categoryId);
        this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}`);
        this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}`);
        if (this.targetCategory === 'covid') {
          this.isCovid = true;
        }
        else if (this.targetCategory === 'support') {
          this.isSupport = true;
          this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.SUPPORT_CATEGORY}`]);
          this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.SUPPORT_CATEGORY}`);
        }
      }
    }
  }
  public toggleActive(questionId, answerId, copy?): void {
    if (this.questionIdParam === questionId && !this.collapsed && !copy) {
      this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}`);
      this.metaService.createCanonicalUrl(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}`);
      this.questionIdParam = 'q0';
    } else {
      this.questionIdParam = questionId;
      this.collapsed = false;
      this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}/${this.questionIdParam}`);
      this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.FAQS}/${this.targetCategory}/${this.questionIdParam}`);
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
  private callRichText(answerId): void {
    this.contentFulService.getRichText('questions', answerId);
  }
}

