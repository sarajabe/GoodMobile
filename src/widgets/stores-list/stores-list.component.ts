import { Component, OnInit } from '@angular/core';
import { LookupsService } from '@ztarmobile/zwp-service-backend-v2';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit {
  public citiesList;
  public selectedCity = 'Albuquerque';
  allStores: any;
  today: Date;
  stores = [];
  

  constructor(private lookupsService: LookupsService, private toastHelper: ToastrHelperService, private appState: AppState) { 
    this.appState.loading = true;
    this.lookupsService.getAvailableStores().then(stores => {
      this.appState.loading = false;
      if(stores?.storesLocations?.length > 0) {
        this.today = new Date();
        this.allStores = stores?.storesLocations;
        this.allStores = this.allStores.filter((store) => new Date(store.launchDate) <= this.today)
        this.citiesList = [...new Set(this.allStores.map(item => item.city))];
        this.stores = stores?.storesLocations.filter((store) => store.city === this.selectedCity && new Date(store.launchDate) <= this.today);
      }
    }, error => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.error.errors[0].message);

    })
  }

  public selectCity(): void {
    this.stores = [];
    this.stores = this.allStores.filter((store) => store.city === this.selectedCity && new Date(store.launchDate) <= this.today);
  }
  
  ngOnInit(): void {
  }

}
