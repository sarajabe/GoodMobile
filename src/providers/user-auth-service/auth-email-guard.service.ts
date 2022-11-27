import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { Observable } from 'rxjs/Observable';
import { LOGIN_ROUTE_URLS } from 'src/app/app.routes.names';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthEmailGuardService implements CanActivate {
  constructor(private router: Router, private simpleAuthService: SimpleAuthService) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.simpleAuthService.userState.pipe(map((authState) => {
      if (!authState || !authState.email) {
        this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.LOGIN}`, {nextPage: state.url}]);
      }
      return !!authState && !!authState.email;
    }), take(1));
  }
}

export const AUTH_GUARD_PROVIDERS = [
  AuthEmailGuardService
];
