import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GeocodingService, MapService } from '@ztarmobile/zwp-services-util';
import { ToastrHelperService } from '../../../../../services/toast-helper.service';
import { GEOCODE_API_KEY } from '../../../../../environments/environment';
import { Map } from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-navigator',
  templateUrl: './map-navigator.component.html',
  styleUrls: ['./map-navigator.component.scss']
})
export class MapNavigatorComponent implements OnInit {
  @Input() postal: string;
  @Output() navigatedToZip: EventEmitter<boolean> = new EventEmitter<boolean>();
  address: string;
  private GEOCODE_API_KEY = GEOCODE_API_KEY;
  private map: Map;

  constructor(private geocoder: GeocodingService, private mapService: MapService, private toastHelper: ToastrHelperService) {
    this.address = '';
  }

  ngOnInit(): void {
    this.mapService.disableMouseEvent('goTo');
    this.mapService.disableMouseEvent('place-input');
    this.map = this.mapService.map;
    if (!!this.postal) {
      this.address = this.postal;
      this.goTo();
    }
  }

  public goTo(): void {
    if (!this.address) {
      return;
    }

    this.geocoder.geocode(this.address, this.GEOCODE_API_KEY)
      .subscribe((location) => {
        const southWest = L.latLng(location.viewBounds.getNorthEast().lat, location.viewBounds.getNorthEast().lng);
        const northEast = L.latLng(location.viewBounds.getSouthWest().lat, location.viewBounds.getSouthWest().lng);
        const bounds = L.latLngBounds(southWest, northEast);

        this.map.fitBounds(bounds, {});
        this.address = location.address;
        this.navigatedToZip.emit(true);
      }, (error) => {
        this.toastHelper.showWarning('Please enter a valid zip code!', '', 1200);
        this.navigatedToZip.emit(false);
        console.error(error);
      });
  }
}

