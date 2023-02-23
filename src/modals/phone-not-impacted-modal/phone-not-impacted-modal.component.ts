import { Component, Inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { ModalSetting } from 'src/services/modal-helper.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class PhoneNotWorkingContext {
  public message: string;
  public title: string;
  public settings: ModalSetting;
}

@Component({
  selector: 'app-phone-not-impacted-modal',
  templateUrl: './phone-not-impacted-modal.component.html'
})
export class PhoneNotImpactedModalComponent {
  public context: any;
  public settings: ModalSetting;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialogRef<PhoneNotWorkingContext>, private location: PlatformLocation) {
    this.context = data;
    this.settings = this.context.settings || {};
    location.onPopState(() => { this.beforeDismiss();this.dialog.close();});
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

  closeDialog(res?): void {
    this.beforeDismiss();
    this.dialog.close(res);
  }

  public takeAction(action?: string): void {
    this.closeDialog(action);
  }
}
