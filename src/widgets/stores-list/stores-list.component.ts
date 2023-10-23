import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppState } from 'src/app/app.service';
import { ContentfulService } from 'src/services/contentful.service';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit {
  @ViewChild('storesForm') storesForm: NgForm;
  public citiesList;
  public selectedCity = 'Albuquerque';
  allStores: any;
  today: Date;
  stores = [];
  

  constructor(public appState: AppState,
    private contentfulService: ContentfulService) { 
  }

  public selectCity(): void {
    this.stores = [];
    this.stores = this.allStores.filter((store) => store?.fields?.city === this.selectedCity && new Date(this.mapDate(store?.fields?.launchDate)) <= this.today);
  }
  
  ngOnInit(): void {
    this.today = new Date();
    this.appState.loading = true;
    this.contentfulService.getContent('storeLocations').subscribe(res => {
      if(!!res && !!res[0]?.fields && res[0]?.fields?.stores?.length > 0) {
        this.appState.loading = false;
        this.allStores = res[0]?.fields?.stores;
        this.allStores = this.allStores.filter((store) => new Date(this.mapDate(store?.fields?.launchDate)) <= this.today)
        this.citiesList = [...new Set(this.allStores.map(item => item?.fields?.city))];
        this.stores = this.allStores.filter((store) => store?.fields?.city === this.selectedCity && new Date(this.mapDate(store?.fields?.launchDate)) <= this.today);

      }
    }, error => {
      this.appState.loading = false;
    })
  }

  public mapDate(launchDate): any {
    return new Date(launchDate).toJSON();
  }

}
