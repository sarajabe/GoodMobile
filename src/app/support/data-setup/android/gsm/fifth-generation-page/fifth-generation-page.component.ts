import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS, ROUTE_URLS, SUPPORT_ROUTE_URLS } from '../../../../../app.routes.names';
@Component({
  selector: 'app-fifth-generation-page',
  templateUrl: './fifth-generation-page.component.html',
  styleUrls: ['./fifth-generation-page.component.scss']
})
export class FifthGenerationPageComponent implements OnInit {
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  public done(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.ANDROID}`]);
  }
}
