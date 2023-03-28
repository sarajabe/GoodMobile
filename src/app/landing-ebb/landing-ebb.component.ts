import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ActionsAnalyticsService, MobileCustomPlansService, MobilePlanItem } from '@ztarmobile/zwp-service-backend';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { PageScrollService } from 'ngx-page-scroll-core';
import { takeWhile } from 'rxjs/operators';
import { ContentfulService } from 'src/services/contentful.service';
import { ACP_ROUTE_URLS, LOGIN_ROUTE_URLS, ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../app.routes.names';

@Component({
  selector: 'app-landing-ebb',
  templateUrl: './landing-ebb.component.html',
  styleUrls: ['./landing-ebb.component.scss']
})
export class LandingEbbComponent implements OnInit, OnDestroy {
  public ROUTE_URLS = ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ebbPlan: any;
  public questionIdParam: any;
  public collapsed: boolean;
  public firstThreeQuestions;
  public restQuestions;
  public showMore = false;
  public elem: any;
  public isLoggedIn = false;
  public showList = false;
  public hideCardContent = false;
  private shouldScroll;
  private allBasePlans: Array<MobilePlanItem>;
  private alive = true;

  constructor(
    private contentfulService: ContentfulService, private analyticsService: ActionsAnalyticsService,
    private mobilePlansService: MobileCustomPlansService, private router: Router, private simpleAuthService: SimpleAuthService,
    private pageScrollService: PageScrollService) {
    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          setTimeout(() => {
            this.pageScrollService.scroll({
              document,
              scrollTarget: `#${tree.fragment}`,
              scrollOffset: 100,
              speed: 150
            });
          }, 400);
        }
      }
    });
    this.mobilePlansService.isConfigurationReady.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.ebbPlan = this.mobilePlansService.allBasePlans.find((plan) =>
        plan.ebb
      );
    });
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive))
      .subscribe((authState) => this.isLoggedIn = !!authState && !authState.isAnonymous);
  }
  ngOnInit(): void {
    this.contentfulService.getQuestionsByCategoryId('good2goFaqs', 'acp').subscribe(questions => {
      if (!!questions) {
        const allQuestions = questions[0].fields.questions;
        this.firstThreeQuestions = allQuestions.slice(0, 3);
        this.restQuestions = allQuestions.slice(3);
      }
    });
  }
  ngOnDestroy(): void {
    this.alive = false;
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
  public trackEvent(): void {
    const data = {
      event: 'Apply Now',
      category: 'ACP',
      label: 'Apply for ACP',
      action: 'apply'
    };
    this.analyticsService.trackACPEvent(data);
  }

  public goToACPForm(): void {
    this.trackEvent();
    if (!this.isLoggedIn) {
      this.router.navigate([LOGIN_ROUTE_URLS.BASE + '/' + LOGIN_ROUTE_URLS.ACP_SIGNUP]);
    } else {
      this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
    }
  }
  private callRichText(answerId): void {
    this.contentfulService.getRichText('questions', answerId);
  }

}
