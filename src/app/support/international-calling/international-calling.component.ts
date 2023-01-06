import { Component, HostListener, OnInit } from '@angular/core';
import { SHOP_ROUTE_URLS, LOGIN_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS } from '../../app.routes.names';
import { InternationalCallingConfigurationService } from '@ztarmobile/zwp-service-backend';
import { Router } from '@angular/router';
import { MetaService } from '../../../services/meta-service.service';
import { PaginationInstance } from 'ngx-pagination';
import { ContentfulService } from 'src/services/contentful.service';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-international-calling',
  templateUrl: './international-calling.component.html',
  styleUrls: ['./international-calling.component.scss']
})
export class InternationalCallingComponent implements OnInit {

  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public LOGIN_ROUTE_URLS = LOGIN_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public type = 'int-calling';
  public config: PaginationInstance = {
    id: 'countries',
    itemsPerPage: 30,
    currentPage: 1,
    totalItems: 0
  };
   public internationalCountriesContent;
  public countriesLength = 0;
  public filterOptions = [];
  public selected;
  public countries;
  public allCountries;
  public filterText;
  public splitLimit = 15;
  public innerWidth;
  filtered: boolean;

  constructor( private contentful: ContentfulService, private router: Router, private metaService: MetaService, private appState: AppState) {
    this.metaService.createCanonicalUrl();
    this.getInternationalCountriesContent(this.type, 'en-US');
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
      
  }
 
  public changeCategory(): void {
    this.getInternationalCountriesContent(this.type, 'en-US');
  }

  public filterTextChanged(filterText): void {
    this.getInternationalFilteredCountries(filterText);
  }

  public pageChanged(page: number): void {
    if (page > 0 && page <= this.countries.length) {
      const index = page - 1;
      this.config.currentPage = page;
      this.getInternationalCountriesContent(this.type, 'en-US');
    }
  }
  public filteringPageChanged(page: number): void {
    if (page > 0 && page <= this.countries.length) {
      const index = page - 1;
      this.config.currentPage = page;
    }
  }
  public selectOption(optionName): void {
    this.selected = optionName;
    this.filterText = '';
    this.getInternationalFilteredRegions(this.selected);
  }
  private getInternationalCountriesContent(category, locale): void {
    this.filterText = '';
    this.filterOptions = [];
    this.contentful.getInternationalCallingContentByCategory('internationalCallingCategories', this.config.itemsPerPage, category, locale).subscribe((result) => {
      if (!!result) {
        this.internationalCountriesContent = result;
        if (this.internationalCountriesContent.length > 0) {
          this.allCountries = result[0].fields.countries;
          this.allCountries.forEach(element => {
            if (!this.filterOptions.includes(element.fields.countryRegion)) {
              this.filterOptions.push(element.fields.countryRegion);
              this.filterOptions.sort((a, b) => a.localeCompare(b));
            }
          });
          if (this.filterOptions.includes('Other')) {
            // Move Other option to be the last option
            let indexOfOther = this.filterOptions.indexOf('Other');
            this.filterOptions.push(this.filterOptions.splice(indexOfOther, 1)[0]);
          }
          this.filterOptions.unshift('All');
          this.selected = 'All';
          this.countries = this.allCountries;
          this.countriesLength = this.countries.length;
          this.config.totalItems = this.countriesLength;
        }
      }
      this.appState.loading = false;
    });
  }
  private getInternationalFilteredCountries(filterText): void {
    if (!this.selected || this.selected === 'All') {
      this.countries = this.allCountries.filter((country) => {
        if (country.fields.countryName.toLowerCase().includes(filterText.toLowerCase())) {
          return country;
        }
      });
    } else {
      this.countries = this.allCountries.filter((country) => country.fields.countryName.toLowerCase().includes(filterText.toLowerCase()) &&
        country.fields.countryRegion.toLowerCase().includes(this.selected.toLowerCase()));
    }
    this.filtered = true;
    this.config.currentPage = 1;
    this.countriesLength = this.countries.length;
    this.config.totalItems = this.countriesLength;
  }

  private getInternationalFilteredRegions(region): void {
    if (region !== 'All') {
      this.filtered = true;
      this.countries = this.allCountries.filter(country => {
        if (country.fields.countryRegion.includes(region.toLowerCase()) || country.fields.countryRegion.toLowerCase().includes(region.toLowerCase())) { return country; }
      });
    } else {
      this.countries = this.allCountries;
    }
    this.config.currentPage = 1;
    this.countriesLength = this.countries.length;
    this.config.totalItems = this.countriesLength;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
      this.innerWidth = window.innerWidth;
  }
}
