import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acp-flow',
  template: `
    <section>
      <router-outlet #outlet></router-outlet>
    </section>
  `
})
export class AcpFlowComponent implements OnInit {
  public ngOnInit(): void {
  }
}
