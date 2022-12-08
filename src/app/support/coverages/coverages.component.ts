import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BingLayer, GeocodingService, MapService } from '@ztarmobile/zwp-services-util';
import * as L from 'leaflet';
import { SUPPORT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS} from '../../app.routes.names';
import { MetaService } from '../../../services/meta-service.service';
import { MapLayer } from '../../../widgets/coverage-map/mapLayer';

@Component({
  selector: 'app-coverages',
  templateUrl: './coverages.component.html',
  styleUrls: ['./coverages.component.scss']
})
export class CoveragesComponent implements OnInit {
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public readMore = false;
  public coverageChecked = false;
  public networkType: string;
  public zipCode: string;
  constructor(private mapService: MapService, private geocoder: GeocodingService, private router: Router, private metaService: MetaService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    const layer = new BingLayer('https://zigmat.att.com//GLA6/OneMap/OneMap.Web/Home/TileService?quadKey={q}&returnType=png&csLayerIds=Coverage_Roam_Data_Zig,' +
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
    const map = L.map('map', {
      zoomControl: false,
      center: L.latLng(40.731253, -73.996139),
      zoom: 8,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.mapService.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.layers(this.mapService.baseMaps, null, { position: 'bottomright' }).addTo(map);
    L.control.scale().addTo(map);
    this.mapService.map = map;
    this.geocoder.getCurrentLocation()
      .subscribe(
        (location) => map.panTo([location.latitude, location.longitude]),
        (err) => console.error(err)
      );
    this.route.params.subscribe((params: Params) => {
      if (!!params && params[SUPPORT_ROUTE_URLS.PARAMS.NETWORKTYPE]) {
        this.networkType = params[SUPPORT_ROUTE_URLS.PARAMS.NETWORKTYPE];
        if (this.networkType === 'att') {
          map.addLayer(layer);
        } else {
          map.addLayer(tLayer);
        }
      }
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ZIP_CODE]) {
        this.zipCode = params[ACTIVATION_ROUTE_URLS.PARAMS.ZIP_CODE];
        this.coverageChecked = true;
      }
    });
  }

  public udpateStatus($event): void {
    this.coverageChecked = $event;
  }

  public goToPlans(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

}
