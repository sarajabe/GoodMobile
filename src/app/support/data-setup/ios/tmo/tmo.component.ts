import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-ios-tmo',
  templateUrl: './tmo.component.html',
  styleUrls: ['./tmo.component.scss']
})
export class IosTmoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  public goToDataSetup(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.DATA_SETUP}`]);
  }

}
