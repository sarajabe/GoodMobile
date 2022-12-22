import { Component, OnInit } from '@angular/core';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-about-goodmobile',
  templateUrl: './about-goodmobile.component.html',
  styleUrls: ['./about-goodmobile.component.scss']
})
export class AboutGoodMobileComponent implements OnInit {
  public viewContent = false;

  constructor(private metaService: MetaService) { }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
  }
}
