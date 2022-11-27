import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  public sub: any;
  public ticketNumber: string;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      if (!!params) {
        this.ticketNumber = params.ticketNumber;
      }
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
