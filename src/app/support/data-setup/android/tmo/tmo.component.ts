import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-android-tmo',
  templateUrl: './tmo.component.html',
  styleUrls: ['./tmo.component.scss']
})
export class AndroidTmoComponent implements OnInit {
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  public goToDataSetup(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.DATA_SETUP}`]);
  }

}
