import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from './toast-helper.service';
import { OrdersService } from '@ztarmobile/zwp-service-backend-v2';

@Injectable({
  providedIn: 'root'
})
export class ReceiptResolverService implements Resolve<any> {

  constructor(private ordersService: OrdersService,
              private toastHelper: ToastrHelperService,
              private appState: AppState,
              private router: Router) { }
  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const orderId = route.paramMap.get('id');
    this.appState.loading = true;
    return this.ordersService.getOrderReceipt(orderId).then((result) => {
      if (!!result) {
        this.appState.loading = false;
        return result;
      }
    }).catch(error => {
      this.appState.loading = false;
      this.router.navigate([this.router.url]);
      if (this.router.url.includes(ACCOUNT_ROUTE_URLS.PAYMENTS)) {
        return this.toastHelper.showAlert('Cannot generate receipt for selected payment');
      } else if (this.router.url.includes(ACCOUNT_ROUTE_URLS.ORDERS)) {
        return this.toastHelper.showAlert('Cannot generate receipt for selected order');
      }
    });
  }
}
