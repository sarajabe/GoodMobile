import { Component } from '@angular/core';
import { SHOP_ROUTE_URLS, LOGIN_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { InternationalCallingConfigurationService } from '@ztarmobile/zwp-service-backend';
import { Router } from '@angular/router';
import { MetaService } from '../../../services/meta-service.service';

@Component({
  selector: 'app-international-calling',
  templateUrl: './international-calling.component.html',
  styleUrls: ['./international-calling.component.scss']
})
export class InternationalCallingComponent {

  public countries: Array<{ name: string, isLandline: boolean, isCellular: boolean }>;
  public filteredCountries: Array<{ name: string, isLandline: boolean, isCellular: boolean }>;
  public payGoCountries: Array<{ name: string, value: any }>;
  public filteredPayGoCountries: Array<{ name: string, value: any }>;
  public letters: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P' , 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  public selected = 'A';
  public showUnlimited = true;
  public showPayGo = false;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public LOGIN_ROUTE_URLS = LOGIN_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;

  constructor(private InternationalCallingConfigurationService: InternationalCallingConfigurationService, private router: Router, private metaService: MetaService) {
      this.InternationalCallingConfigurationService.isReady.subscribe((ready) => {
          if (ready) {
            this.countries = this.InternationalCallingConfigurationService.eligibility;
            this.filteredCountries = this.countries.filter((country) => country.name.startsWith('A') === true);
              this.payGoCountries = this.InternationalCallingConfigurationService.payGo;
              this.filteredPayGoCountries = this.payGoCountries.filter((country) => country.name.startsWith('A') === true);
          }
      });
      this.metaService.createCanonicalUrl();
  }
  /**
   * a method to filter the countries list and get all countries that starts with the selected letter
   * @param filterLetter : a parameter to specify the selected letter
   */
  public filterCountries(filterLetter: string, category?: string): void {
    if (category === 'payGo') {
      this.filteredPayGoCountries = this.payGoCountries.filter((country) => country.name.startsWith(filterLetter) === true);
    } else {
      this.filteredCountries = this.countries.filter((country) => country.name.startsWith(filterLetter) === true);
    }
  }
}
