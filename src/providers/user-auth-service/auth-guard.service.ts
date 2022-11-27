import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { Observable } from 'rxjs/Observable';
import { RouterHelperService } from '@ztarmobile/zwp-services-util';
import { map, take } from 'rxjs/operators';
import { LOGIN_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, SHOP_ROUTE_URLS } from '../../app/app.routes.names';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: RouterHelperService, private simpleAuthService: SimpleAuthService) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.simpleAuthService.userState.pipe(map((authState) => {
      if (!authState) {
        if (!!state.url.match(`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CUSTOMIZE_PLAN}`)) {
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`], true);
        } else {
          this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.LOGIN}`, {nextPage: state.url}], true);
        }
      }
      return !!authState;
    }), take(1));
  }
}

export const AUTH_GUARD_PROVIDERS = [
  AuthGuardService
];
