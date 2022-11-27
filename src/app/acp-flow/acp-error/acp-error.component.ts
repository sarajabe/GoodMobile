import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_URLS } from 'src/app/app.routes.names';

@Component({
  selector: 'app-acp-error',
  templateUrl: './acp-error.component.html',
  styleUrls: ['./acp-error.component.scss']
})
export class AcpErrorComponent implements OnInit {
  @Input() acpStatus: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  public goToAcp(): void {
     this.router.navigate([`${ROUTE_URLS.ACP}`]);
  }
  public goToLanding(): void {
    window.location.reload();
  }
}
