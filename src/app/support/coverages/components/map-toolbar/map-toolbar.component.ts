import { Component, OnInit } from '@angular/core';
import { MapService } from '@ztarmobile/zwp-services-util';
import * as L from 'leaflet';
import { LeafletMouseEvent } from 'leaflet';

@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss']
})
export class MapToolbarComponent implements OnInit {
  editing: boolean;
  removing: boolean;
  airportLayerAdded: boolean;
  markerCount: number;

  constructor(private mapService: MapService) {
    this.editing = false;
    this.removing = false;
    this.markerCount = 0;
  }

  ngOnInit(): void {
    this.mapService.disableMouseEvent('add-marker');
    this.mapService.disableMouseEvent('remove-marker');
    this.mapService.disableMouseEvent('toggle-layer');
  }

  Initialize(): void{
    this.mapService.map.on('click', (e: LeafletMouseEvent) => {
      if (this.editing) {
        const marker = L.marker(e.latlng, {
          draggable: true
        })
          .bindPopup('Marker #' + (this.markerCount + 1).toString(), {
            offset: L.point(12, 6)
          })
          .addTo(this.mapService.map)
          .openPopup();

        this.markerCount += 1;

        marker.on('click', (event) => {
          if (this.removing) {
            this.mapService.map.removeLayer(marker);
            this.markerCount -= 1;
          }
        });
      }
    });
  }

  toggleEditing(): void {
    this.editing = !this.editing;

    if (this.editing && this.removing) {
      this.removing = false;
    }
  }

  toggleRemoving(): void {
    this.removing = !this.removing;

    if (this.editing && this.removing) {
      this.editing = false;
    }
  }

  toggleCoverageLayer(): void {
    this.airportLayerAdded = !this.airportLayerAdded;
    this.mapService.toggleCoverageLayer();
  }
}

