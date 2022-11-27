import { Component, OnInit, Input } from '@angular/core';
import { BingLayer, GeocodingService, MapService } from '@ztarmobile/zwp-services-util';
import { ToastrHelperService } from '../../services/toast-helper.service';
import { Map } from 'leaflet';
import * as L from 'leaflet';
import { GEOCODE_API_KEY } from '../../environments/environment';
import { MapLayer } from './mapLayer';

@Component({
  selector: 'app-map',
  templateUrl: './coverage-map.component.html',
  styleUrls: ['./coverage-map.component.scss']
})
export class CoverageMapComponent implements OnInit {
  @Input() networkType: string;
  @Input() zipCode: string;
  public readMore = false;
  public coverageChecked = false;
  address: string;
  private GEOCODE_API_KEY = GEOCODE_API_KEY;
  private map: Map;
  constructor(private mapService: MapService, private geocoder: GeocodingService,  private toastHelper: ToastrHelperService) {
  }

  ngOnInit(): void {
    const attLayer = new BingLayer('https://zigmat.att.com//GLA6/OneMap/OneMap.Web/Home/TileService?quadKey={q}&returnType=png&csLayerIds=Coverage_Roam_Data_Zig,' +
      'Mti_Coverage_UMTS_Data_Zig,Coverage_HSPAPlus_Data_Zig,Coverage_4GLTE_Data_Zig', {
      subdomains: ['0', '1', '2', '3', '4'],
      attribution: '&copy; <a href="https://www.att.com">AT&T</a>',
      opacity: 0.5,
      zIndex: 100
    });

    const tLayer = new MapLayer('Partner_Tech3G_Map', {
      attribution: '&copy; <a href="https://www.T-mobile.com">T-Mobile</a>',
      zoomOffset: 1,
      minZoom: 1,
      maxZoom: 19,
      opacity: 0.5,
      zIndex: 100
    });

    this.map = L.map('map', {
      zoomControl: false,
      center: L.latLng(40.731253, -73.996139),
      zoom: 8,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.mapService.baseMaps.OpenStreetMap]
    });

    L.control.zoom({position: 'topright'}).addTo(this.map);
    L.control.layers(this.mapService.baseMaps, null, {position: 'bottomright'}).addTo(this.map);
    L.control.scale().addTo(this.map);
    this.mapService.map = this.map;
    this.geocoder.getCurrentLocation()
      .subscribe(
        (location) => this.map.panTo([location.latitude, location.longitude]),
        (err) => console.error(err)
      );
    setTimeout(() => {
      if (this.networkType === 'att') {
          this.map.addLayer(attLayer);
      } else {
          this.map.addLayer(tLayer);
      }
      if (!!this.zipCode) {
        this.address = this.zipCode;
        this.goTo();
      }
    }, 200);
  }
  public goTo(): void {
    if (!this.address) {
      return;
    }
    this.geocoder.geocode(this.address, this.GEOCODE_API_KEY)
      .subscribe((location) => {
        let southWest = L.latLng(location.viewBounds.getNorthEast().lat, location.viewBounds.getNorthEast().lng);
        let northEast = L.latLng(location.viewBounds.getSouthWest().lat, location.viewBounds.getSouthWest().lng);
        let bounds = L.latLngBounds(southWest, northEast);

        this.map.fitBounds(bounds, {});
        this.address = location.address;
      }, (error) => {
        this.toastHelper.showWarning('Please enter a valid zip code!', '', 1200);
        console.error(error);
      });
  }
}
