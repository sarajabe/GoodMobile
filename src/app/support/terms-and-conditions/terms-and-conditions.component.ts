import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentfulService } from '../../../services/contentful.service';
import { SUPPORT_ROUTE_URLS } from '../../app.routes.names';
import { Location } from '@angular/common';
import { ENDPOINT_URL } from '../../../environments/environment';
import { MetaService } from '../../../services/meta-service.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {
  public categories: any;
  public targetCategory: string;
  public activeCategory: string;
  public info: Subscription;
  public routerSubscription: Subscription;
  public isDesc2Exist = false;
  public isShowFirst = true;
  public isShowSecond = false;
  constructor(private contentFulService: ContentfulService, private location: Location, private metaService: MetaService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.contentFulService.getContent('termsAndConditionsSection').subscribe(result => {
      if (!!result) {
        this.categories = result;
        this.routerSubscription = this.route.params.subscribe(params => {
          if (!!params.category) {
            this.targetCategory = params.category;
            this.activeCategory = this.targetCategory;
          }
          else {
            this.targetCategory = this.categories[0].fields.termsAndSectionCategories[0].fields.categoryId;
            this.activeCategory = this.targetCategory;
          }
          this.info = this.contentFulService.getQuestionsByCategoryId('termsAndConditions', this.targetCategory).subscribe((result) => {
            this.contentFulService.getDescriptions('termsAndConditions', 'rich-text-desc-1', this.targetCategory, 'description');
            this.isDesc2Exist = false;
            if (!!result[0].fields.description2 && result[0].fields.description2.content.length > 0) {
              this.isDesc2Exist = true;
              this.contentFulService.getDescriptions('termsAndConditions', 'rich-text-desc-2', this.targetCategory, 'description2');
            }
          });
        });
      }
    });
  }
  ngOnDestroy(): void {
    if (!!this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (!!this.info) {
      this.info.unsubscribe();
    }
  }
  public setCategory(category, categoryId): void {
    if (!!category && !!categoryId) {
      this.targetCategory = categoryId;
      if (category !== this.activeCategory) {
        this.activeCategory = this.targetCategory;
        this.info = this.contentFulService.getQuestionsByCategoryId('termsAndConditions', this.targetCategory).subscribe((result) => {
          this.contentFulService.getDescriptions('termsAndConditions', 'rich-text-desc-1', this.targetCategory, 'description');
          this.isDesc2Exist = false;
          if (!!result[0].fields.description2 && result[0].fields.description2.content.length > 0) {
            this.isDesc2Exist = true;
            this.contentFulService.getDescriptions('termsAndConditions', 'rich-text-desc-2', this.targetCategory, 'description2');
          }
        })
        this.location.replaceState(`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TERMS_AND_CONDITIONS}/${this.targetCategory}`);
        this.metaService.createCanonicalUrl(`${ENDPOINT_URL}/${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TERMS_AND_CONDITIONS}/${this.targetCategory}`);
      }
    }
  }
  public goSecond(): void {
    this.contentFulService.getDescriptions('termsAndConditions', 'rich-text-desc-2', this.targetCategory, 'description2');
    this.isShowFirst = false;
    this.isShowSecond = true;
    window.scroll(0, 0);
  }

  public backFirst(): void {
    this.contentFulService.getDescriptions('termsAndConditions', 'rich-text-desc-1', this.targetCategory, 'description');
    this.isShowFirst = true;
    this.isShowSecond = false;
    window.scroll(0, 0);
  }
}
