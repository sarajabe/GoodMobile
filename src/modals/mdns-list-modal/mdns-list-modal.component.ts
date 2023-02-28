import { PlatformLocation } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUserPlan } from '@ztarmobile/zwp-service-backend';

export class MdnsListModalContext {
  public title: string;
  public associatedPlans: Array<IUserPlan>;
  public paymentId: string
  public customClass?: string;
}

@Component({
  selector: 'mdns-list-modal',
  templateUrl: './mdns-list-modal.component.html'
})
export class MdnsListModalComponent{
  public context: any;
  public plans: Array<IUserPlan>;
  public duplicatePaymentId:string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialogRef<MdnsListModalContext>, private location: PlatformLocation, private router: Router) {
    this.context = data;
    this.plans = this.context.associatedPlans;
    this.duplicatePaymentId = this.context.paymentId;
    location.onPopState(() => { this.beforeDismiss();this.dialog.close();});
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
    this.beforeDismiss();
    this.dialog.close(result);
  }

  public navigateToList(): void {
    this.beforeDismiss();
    this.dialog.close(true);
  }
}
