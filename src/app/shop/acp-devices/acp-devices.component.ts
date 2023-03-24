import { Component, OnInit } from '@angular/core';
import { CatalogCoreService } from '@ztarmobile/zwp-service-backend-v2';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-acp-devices',
  templateUrl: './acp-devices.component.html',
  styleUrls: ['./acp-devices.component.scss']
})
export class AcpDevicesComponent implements OnInit {
  public acpDevices = [];
  constructor(private catalogServices: CatalogCoreService,
    private appState: AppState) { }

  ngOnInit(): void {
    this.getAcpDevices();
  }
  public selectDevice(): void {

  }
  private getAcpDevices(): void {
    this.appState.loading = true;
    this.catalogServices.getAcpDevicesFromContentful().then(res => {
      if (!!res) {
        this.appState.loading = false;
        this.acpDevices = res;
        console.log('acppp', this.acpDevices)
      }
    }, error => {
      this.appState.loading = false;
    })
  }
}
