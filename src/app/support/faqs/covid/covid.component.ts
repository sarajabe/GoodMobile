import { Component, OnInit } from '@angular/core';
import { SUPPORT_ROUTE_URLS, ACCOUNT_ROUTE_URLS } from '../../../app.routes.names';

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class CovidComponent implements OnInit {
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  constructor() { }

  ngOnInit(): void {
  }
}
