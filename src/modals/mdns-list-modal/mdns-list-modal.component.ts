import { PlatformLocation } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUserPlan } from '@ztarmobile/zwp-service-backend';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { DUPLICATE_PAYMENTS_ROUTE_URLS } from 'src/app/app.routes.names';

export class MdnsListModalContext extends BSModalContext {
  public title: string;
  public associatedPlans: Array<IUserPlan>;
  public paymentId: string
  public customClass?: string;
}

@Component({
  selector: 'mdns-list-modal',
  templateUrl: './mdns-list-modal.component.html'
})
export class MdnsListModalComponent implements CloseGuard, ModalComponent<MdnsListModalContext> {
  public context: MdnsListModalContext;
  public plans: Array<IUserPlan>;
  public duplicatePaymentId:string;

  constructor(public dialog: DialogRef<MdnsListModalContext>, private location: PlatformLocation, private router: Router) {
    this.context = dialog.context;
    this.plans = this.context.associatedPlans;
    this.duplicatePaymentId = this.context.paymentId;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
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

  public navigateToList(): void {
    this.dialog.close(true);
  }
}
