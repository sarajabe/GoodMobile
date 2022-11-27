import { Component, OnInit } from '@angular/core';
import { SUPPORT_ROUTE_URLS, ROUTE_URLS } from '../app.routes.names';
import { ContentfulService } from '../../services/contentful.service';
import { ModalHelperService } from '../../services/modal-helper.service';

@Component({
  selector: 'app-wifi-calling',
  templateUrl: './wifi-calling.component.html',
  styleUrls: ['./wifi-calling.component.scss']
})
export class WifiCallingComponent implements OnInit {
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ROUTES_URLS = ROUTE_URLS;
  public allQuestions: any;
  public questionIdParam: string;
  public collapsed: boolean;
  constructor(private contentfulService: ContentfulService, private modalHelper: ModalHelperService) { }

  ngOnInit(): void {
    this.contentfulService.getQuestionsByCategoryId('goodmobileFaqs', 'wifi-calling-page').subscribe(questions => {
      if (!!questions) {
         this.allQuestions = questions[0].fields.questions;
      }
    });
  }
  public showPopup(): void {
    const customHtml = `
    <div class="info">
    <p>Wi-Fi Calling will not support calls over TTY devices, including 911 calls. To reach 911 service, persons with communications disabilities may do one of these:
    (1) Call 911 directly using a TTY from a wireless phone over the cellular network or from a landline telephone.</p>
    <p>(2) Send a text message to 911 directly (in areas where text-to-911 is available) from a wireless device.</p>
    <p>(3) Use relay services to place a TTY or captioned telephone service (CTS) call from a wireless phone over the cellular network or from a landline telephone.</p>
    <p>(4) Use relay services to place an IP Relay or IP CTS call over a cellular data or other IP network.</p>
    <p class="note">View RTT progress can use Real-Time Text as an alternative to TTY. 911 services can be reached by either.</p>
    </div>
    `;
    this.modalHelper.showInformationMessageModal('TYY limitations for 911 calls.',
     '', null, '', true, 'tyy-message-modal', customHtml);
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
