import { Component, OnInit } from '@angular/core';
import { ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../app.routes.names';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public ROUTE_URLS = ROUTE_URLS;
  constructor() { }

  ngOnInit(): void {
  }

}
