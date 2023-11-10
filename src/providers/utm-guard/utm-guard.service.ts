import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ROUTE_URLS } from 'src/app/app.routes.names';

@Injectable()
export class UtmGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const routeData = route.data;
    const utmCriteria = routeData.utmCriteria;
    // check UTM parameters and decide whether to allow access
    const queryParams = route.queryParams;
    const utmSource = queryParams['utm_source'];
    const utmMedium = queryParams['utm_medium'];
    const utmCampaign = queryParams['utm_campaign'];
    const utmId = queryParams['utm_id'];

    if (
      utmSource === utmCriteria.utmSource &&
      utmMedium === utmCriteria.utmMedium &&
      utmCampaign === utmCriteria.utmCampaign && 
      utmId === utmCriteria.utmId
    ) {
      // Allow access to the special page
      return true;
    } else {
      // Redirect or deny access as needed
      this.router.navigate([ROUTE_URLS.ACP]); // Redirect to a default page
      return false; // Deny access
    }
  }
}
