import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PlansShopService } from '../plans-shop.service';
import { ModalHelperService } from '../../../../services/modal-helper.service';
import { MetaService } from '../../../../services/meta-service.service';
import { takeWhile } from 'rxjs/operators';
import { ROUTE_URLS, SHOP_ROUTE_URLS } from '../../../app.routes.names';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-new-plan-shop',
  templateUrl: './new-plan-shop.component.html',
  styleUrls: ['./new-plan-shop.component.scss']
})
export class NewPlanShopComponent implements OnDestroy {
  public readMore = true;
  public readLess = false;
  public showDefault = true;
  public customHtml;
  public showPromo = false;
  private alive = true;

  constructor(private router: Router, private plansShopService: PlansShopService, private modalHelper: ModalHelperService, private metaService: MetaService,
              private appState: AppState) {
    this.plansShopService.selectedMobilePlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      const params = {};
      params[ROUTE_URLS.PARAMS.SELECTED_PLAN] = plan.id;
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLAN_DETAILS}`, params]);
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.plansShopService.reset();
  }

}
