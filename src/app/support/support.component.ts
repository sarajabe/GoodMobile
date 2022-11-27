import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-main',
  template: `
    <section>
      <router-outlet #outlet></router-outlet>
    </section>
  `
})
export class SupportMainComponent implements OnInit {
  public ngOnInit(): void {
  }
}
