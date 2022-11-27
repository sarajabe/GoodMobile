import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-t-mobile',
  templateUrl: './t-mobile.component.html',
  styleUrls: ['./t-mobile.component.scss']
})
export class TMobileComponent implements OnInit {
  public isIos: boolean;
  private SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  constructor(private router: Router) {
    const path = this.router.url;
    this.isIos = path.indexOf(this.SUPPORT_ROUTE_URLS.TMO_IPHONE) > -1 ? true : false;
  }

  ngOnInit(): void {
  }

}
