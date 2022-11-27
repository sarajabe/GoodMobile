import { PlatformLocation } from '@angular/common';
import { Component } from '@angular/core';
import { IShipmentTracking } from '@ztarmobile/zwp-service-backend-v2';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';

export class TrackingModalContext extends BSModalContext {
  public title: string;
  public trackingDetails: IShipmentTracking;
  public trackingNumber: string;
  public customClass?: string;
}

@Component({
  selector: 'app-tracking-modal',
  templateUrl: './tracking-details-modal.component.html'
})
export class TrackingModalComponent implements CloseGuard, ModalComponent<TrackingModalContext> {
  public context: TrackingModalContext;
  public trackingStatuses = [];
  constructor(public dialog: DialogRef<TrackingModalContext>, private location: PlatformLocation) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
    this.setDatedEvents();
  }
  onKeydown(event) {
    event.stopImmediatePropagation();
  }
  beforeClose(): boolean {
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
    }
    return false;
  }

  beforeDismiss(): boolean {
    return this.beforeClose();
  }

  public closeDialog(result?): void {
    this.dialog.close(result);
  }

  private setDatedEvents(): void {
    
    this.context.trackingDetails.trackInfo.trackDetail.map((i) => {
        i.eventTime = i.eventDate;
        const sameDateItems = this.context.trackingDetails.trackInfo.trackDetail.filter((it) => new Date(it.eventDate).toDateString() === new Date(i.eventDate).toDateString());
        if (!!sameDateItems && sameDateItems.length > 0) {
            sameDateItems.map((item)=> { // remove items that has the same date as the i then remove it from the main array so it won't be checked
                item.eventTime = item.eventDate;
                this.context.trackingDetails.trackInfo.trackDetail.splice(this.context.trackingDetails.trackInfo.trackDetail.indexOf(item), 1);
            })
            this.trackingStatuses.push(sameDateItems);
        } else {
            this.trackingStatuses.push([i]);
        }
        // this.context.trackingDetails.trackInfo.trackDetail.map((status) => {
        //     status.eventTime = status.eventDate;
        // })
    } );
    console.info('tracking after ', this.trackingStatuses);
  }
}
