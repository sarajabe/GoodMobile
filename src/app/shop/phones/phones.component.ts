import { Component, OnInit } from '@angular/core';

@Component({
 template: `
    <section>
      <router-outlet #outlet></router-outlet>
    </section>
  `,
  selector: 'app-phones'
})
export class PhonesComponent implements OnInit{
  constructor() {
  }
  ngOnInit(): void{}
}
