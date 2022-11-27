import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PageScrollService } from 'ngx-page-scroll-core';
import { ACP_ROUTE_URLS, ROUTE_URLS } from '../app.routes.names';

@Component({
  selector: 'app-acp-details',
  templateUrl: './acp-details.component.html',
  styleUrls: ['./acp-details.component.scss']
})
export class AcpDetailsComponent implements OnInit {

  constructor(private router: Router, private pageScrollService: PageScrollService) { 
    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          setTimeout(() => {
            this.pageScrollService.scroll({
              document,
              scrollTarget: `#${tree.fragment}`,
              scrollOffset: 100,
              speed: 150
            });
          }, 400);
        }
      }
    });
  }

  ngOnInit(): void {
  }


  public goToACPForm(): void {
    this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
  }

  public scrollToPrograms(): void {
    this.pageScrollService.scroll({
      document,
      scrollTarget: `#medicaid`,
      scrollOffset: 100,
      speed: 150
    });
  }
}
