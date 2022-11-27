import { Component } from '@angular/core';

@Component({
    selector: 'app-compatibility-main',
    template: `
    <section>
      <router-outlet #outlet></router-outlet>
    </section>`
})
export class CompatibilityMainComponent {

    constructor() {
    }
}
