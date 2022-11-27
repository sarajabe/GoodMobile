import { Component, OnDestroy, HostListener } from '@angular/core';
import { PlansShopService } from './plans-shop.service';
import { MobilePlanItem } from '@ztarmobile/zwp-service-backend';
import { Router, NavigationEnd } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { SUPPORT_ROUTE_URLS, ACTIVATION_ROUTE_URLS } from '../../app.routes.names';
import { AppState } from 'src/app/app.service';
import { ModalHelperService } from 'src/services/modal-helper.service';

@Component({
  templateUrl: './plans-and-features.component.html',
  selector: 'app-plans-and-features'
})
export class PlansAndFeaturesComponent implements OnDestroy{
  public isChangePlan = false;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public storedChange = false;
  public planSelected = false;
  public showPromo = false;
  private alive = true;

  constructor(public plansShopService: PlansShopService, private router: Router, private appState: AppState, private modalHelper: ModalHelperService) {
    this.router.events.pipe(takeWhile(() => this.alive)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('change') > -1) {
          this.isChangePlan = true;
        } else {
          this.isChangePlan = false;
        }
      }
    });
    this.appState.isMarketingCampaign.pipe(takeWhile(() => this.alive)).subscribe((isCampaign) => {
      this.showPromo = isCampaign;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public isExpanded(readMorePressed: boolean): void {
    this.plansShopService.setIsExpanded(readMorePressed);
  }
  public goToPlans(selectedPlan: MobilePlanItem): void {
    this.plansShopService.selectMobilePlanItem(selectedPlan);
    this.planSelected = true;
  }

  public openTerms(): void {
    const customHtml = `
    <div class="christmas-pop">
   </div>`;
    this.modalHelper.showDynamicModal( 'ONE MONTH FREE', '' , '', '', true, 'christmas-tc' , customHtml, 'valentinePopup', 'richText', 'description');
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event): void {
    if (sessionStorage.getItem('activation_step') === 'step2'){
    event.preventDefault();
    sessionStorage.setItem('activation_step', 'step1');
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.No_SIM}`]);
    }
  }

}
