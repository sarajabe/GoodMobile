import * as L from 'leaflet';
import { LatLngBounds } from 'leaflet';

export interface ILatLng {
  latitude: number;
  longitude: number;
}

export class Location implements ILatLng {
  latitude: number;
  longitude: number;
  address: string;
  viewBounds: LatLngBounds;
}

export class MapLayer extends L.TileLayer {
  private url;
  private sprintMapLayerUrl = 'http://coverage.sprint.com/MapTile';
  private tMobileMapLayerUrl = 'https://maps.engineering.t-mobile.com';

  constructor(urlTemplate: string, options: L.TileLayerOptions) {
    super(urlTemplate, options);
    this.url = urlTemplate;
  }

  getTileUrl(coord): any{
    if (coord.x < 0 || coord.y < 0) { return 'https://maps.gstatic.com/mapfiles/transparent.png'; }
    const base = this.tMobileMapLayerUrl;
    return [base, '/', this.url, '/', (coord.z + 1), '/', (coord.x + 1), ':', (coord.y + 1), '/tile.png'].join('');
  }

  private _quadKey(x, y, z) {
    const quadKey = [];
    for (let i = z; i > 0; i--) {
      let digit = 0;
      const mask = 1 << (i - 1);
      if ((x & mask) !== 0) {
        digit++;
      }
      if ((y & mask) !== 0) {
        digit++;
        digit++;
      }
      quadKey.push(digit);
    }
    return quadKey.join('');
  }
}
