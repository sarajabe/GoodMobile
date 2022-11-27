import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-successful-order',
  templateUrl: './successful-order.component.html',
  styleUrls: ['./successful-order.component.scss']
})
export class SuccessfulOrderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public goToHome(): void {
    this.router.navigate([ROUTE_URLS.HOME]);
  }
}
