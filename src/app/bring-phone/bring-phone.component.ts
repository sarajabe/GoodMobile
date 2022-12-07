import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentfulService } from 'src/services/contentful.service';
import { ACTIVATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../app.routes.names';
import { Location } from '@angular/common';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-bring-phone',
  templateUrl: './bring-phone.component.html',
  styleUrls: ['./bring-phone.component.scss']
})
export class BringPhoneComponent implements OnInit {
  public questionIdParam: any;
  public collapsed: boolean;
  public bringYourPhoneQsts;
  public isCopied = false;

  constructor(private contentfulService: ContentfulService, private router: Router,
    private location: Location,private clipboardService: ClipboardService) { }

  ngOnInit(): void {
    this.contentfulService.getQuestionsByCategoryId('good2goFaqs', 'byod-questions').subscribe(questions => {
      if (!!questions) {
        const allQuestions = questions[0].fields.questions;
        this.bringYourPhoneQsts = allQuestions;
      }
    });
  }
  public goToPlans(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PLANS_SHOP_ROUTE_URLS.BASE}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }
  public goToCompatibility(): void {
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`]);
  }
  public toggleActive(questionId, answerId, copy?): void {
    if (this.questionIdParam === questionId && !this.collapsed && !copy) {
      this.questionIdParam = 'q0';
    } else {
      this.questionIdParam = questionId;
      this.collapsed = false;
      this.callRichText(answerId);
    }
    if (!!copy && this.questionIdParam === questionId){
      const url = window.location.host + this.location.path();
      this.clipboardService.copy(url);
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 1500);
    }
  }
  private callRichText(answerId): void {
    this.contentfulService.getRichText('questions', answerId);
  }

}
