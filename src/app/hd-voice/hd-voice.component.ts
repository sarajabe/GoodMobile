import { Component, OnInit } from '@angular/core';
import { ContentfulService } from 'src/services/contentful.service';
import { SUPPORT_ROUTE_URLS } from '../app.routes.names';

@Component({
  selector: 'app-hd-voice',
  templateUrl: './hd-voice.component.html',
  styleUrls: ['./hd-voice.component.scss']
})
export class HdVoiceComponent implements OnInit {
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public firstThreeQuestions;
  public restQuestions;
  public questionIdParam: any;
  public collapsed: boolean;
  public showMore = false;

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit(): void {
    this.contentfulService.getQuestionsByCategoryId('goodmobileFaqs', 'hd-voice-questions').subscribe(questions => {
      if (!!questions) {
        const allQuestions = questions[0].fields.questions;
        this.firstThreeQuestions = allQuestions.slice(0, 3);
        this.restQuestions = allQuestions.slice(3);
      }
    });
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
