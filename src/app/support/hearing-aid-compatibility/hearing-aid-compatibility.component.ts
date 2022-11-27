import { Component } from '@angular/core';
import { MetaService } from '../../../services/meta-service.service';

@Component({
  selector: 'app-hearing-aid-compatibility',
  templateUrl: './hearing-aid-compatibility.component.html',
  styleUrls: ['./hearing-aid-compatibility.component.scss']
})
export class HearingAidCompatibilityComponent {
  constructor(private metaService: MetaService) {
    this.metaService.createCanonicalUrl();
  }

}
