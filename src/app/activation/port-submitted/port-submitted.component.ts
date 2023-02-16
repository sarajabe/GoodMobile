import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-port-submitted',
  templateUrl: './port-submitted.component.html',
  styleUrls: ['./port-submitted.component.scss']
})
export class PortSubmittedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public goToAccountSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }
}
