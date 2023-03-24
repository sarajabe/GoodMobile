import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CART_TYPES, IAcpDevice, IUserPlan, MobileCustomPlansService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { CatalogCoreService } from '@ztarmobile/zwp-service-backend-v2';
import { filter, takeWhile } from 'rxjs/operators';
import { SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-acp-devices',
  templateUrl: './acp-devices.component.html',
  styleUrls: ['./acp-devices.component.scss']
})
export class AcpDevicesComponent implements OnInit, OnDestroy {
  public acpDevices = [];
  public hasAcpPlan = false;
  public acpPlan: IUserPlan;
  private alive = true;
  constructor(private catalogServices: CatalogCoreService, private userPlansService: UserPlansService,
    private appState: AppState, private mobilePlansService: MobileCustomPlansService,private router: Router) { 
      this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
        this.acpPlan = plans.find((p) => p.mdn && !p.portInRequestNumber && !!p.basePlan.ebb);
        this.hasAcpPlan = !!this.acpPlan ? true : false;
      });
    }

  ngOnInit(): void {
    this.getAcpDevices();
  }
  ngOnDestroy(): void {
      this.alive = false;
  }
  public selectDevice(item): void {
    if (!!this.hasAcpPlan) {
      const selectedDevice: IAcpDevice = {id: item?.id, deviceMake: item?.fields?.deviceMake, deviceModel: item?.fields?.deviceModel, sku: item?.fields?.sku, modelId: item?.fields?.modelId, marketValue: parseFloat(item?.fields?.marketValue), price: parseFloat(item?.fields?.price), modelNumber: item?.fields?.modelNumber, typeId: item?.fields?.typeId, imgUrl: item?.fields?.deviceImg?.fields.file.url, title: item?.fields?.deviceMake + ' ' + item?.fields?.deviceModel}
      this.mobilePlansService.setActivePlanId(this.acpPlan.id);
      this.mobilePlansService.setAcpDevice(selectedDevice);
      this.mobilePlansService.setCartType(CART_TYPES.GENERIC_CART);
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    }

  }
  private getAcpDevices(): void {
    this.appState.loading = true;
    this.catalogServices.getAcpDevicesFromContentful().then(res => {
      if (!!res) {
        this.appState.loading = false;
        this.acpDevices = res;
        console.log('acppp', this.acpDevices)
      }
    }, error => {
      this.appState.loading = false;
    })
  }
}
