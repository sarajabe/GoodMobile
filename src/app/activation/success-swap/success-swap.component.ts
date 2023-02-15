import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-success-swap',
  templateUrl: './success-swap.component.html',
  styleUrls: ['./success-swap.component.scss']
})
export class SuccessSwapComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public goToAccountSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }

}
