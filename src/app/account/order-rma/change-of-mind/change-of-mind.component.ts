import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOrdersService } from '@ztarmobile/zwp-service-backend';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { AccountHeaderService } from '../../account-header.service';

@Component({
  selector: 'app-change-of-mind',
  templateUrl: './change-of-mind.component.html',
  styleUrls: ['./change-of-mind.component.scss']
})
export class ChangeOfMindComponent implements OnInit {
  public consentRequired = false;
  public consent = '';
  public orderId;

  constructor(private accountHeaderService: AccountHeaderService, private router: Router, private route: ActivatedRoute ,private appState: AppState,
    private accountOrderService: UserOrdersService) {
      this.accountHeaderService.setRemovePadding(true);
      this.route.params.subscribe(params => {
        if (!!params) {
          this.orderId = params.id;
        }
      });
  }

  ngOnInit(): void {
  }

  public setConsent(value): void {
    this.consent = value;
    this.consentRequired = false;
  }

  public goToReasonsPage(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`/${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.RMA}/${ACCOUNT_ROUTE_URLS.RETUREN_REASON}`, params])
  }

  public goToReportIssue(): void {
    sessionStorage.removeItem('returnReason');
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REPORT_ISSUE}`, params]);
  }

  public next(): void {
    this.consentRequired = !this.consent;
    if (!this.consentRequired && this.consent !== 'no') {
      const params = {};
      params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
      this.router.navigate([`/${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.RMA}/${ACCOUNT_ROUTE_URLS.RETURN_FORM}`, params]);
    }
  }
}
