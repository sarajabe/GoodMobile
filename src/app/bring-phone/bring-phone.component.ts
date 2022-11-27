import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentfulService } from 'src/services/contentful.service';
import { ACTIVATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../app.routes.names';

@Component({
  selector: 'app-bring-phone',
  templateUrl: './bring-phone.component.html',
  styleUrls: ['./bring-phone.component.scss']
})
export class BringPhoneComponent implements OnInit {
  public questionIdParam: any;
  public collapsed: boolean;
  public firstThreeQuestions;
  public restQuestions;
  public ACTIVATION_ROUTE_URLS = ACTIVATION_ROUTE_URLS;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public showMore = false;

  constructor(private contentfulService: ContentfulService, private router: Router) { }

  ngOnInit(): void {
    this.contentfulService.getQuestionsByCategoryId('goodmobileFaqs', 'byod-questions').subscribe(questions => {
      if (!!questions) {
        const allQuestions = questions[0].fields.questions;
        this.firstThreeQuestions = allQuestions.slice(0, 3);
        this.restQuestions = allQuestions.slice(3);
      }
    });
  }

  public goToplanDetails(id): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PLANS_SHOP_ROUTE_URLS.BASE}/${id}/${PLANS_SHOP_ROUTE_URLS.DETAILS}`]);
  }
  public toggleActive(questionId, answerId): void {
    if (this.questionIdParam === questionId && !this.collapsed) {
      this.questionIdParam = 'q0';
    } else {
      this.questionIdParam = questionId;
      this.collapsed = false;
      this.callRichText(answerId);
    }
  }
  private callRichText(answerId): void {
    this.contentfulService.getRichText('questions', answerId);
  }

}
