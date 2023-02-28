import { Component, Inject } from '@angular/core';
import { ModalSetting } from '../../services/modal-helper.service';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ConfirmMessageModalContext{
  public message: string;
  public title: boolean;
  public settings: ModalSetting;
}

@Component({
  selector: 'app-confirm-message-modal',
  templateUrl: './confirm-message-modal.component.html'
})
export class ConfirmMessageModalComponent {
  public context: any;
  public settings: ModalSetting;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialogRef<ConfirmMessageModalContext>, private location: PlatformLocation) {
    this.context = data;
    this.settings = this.context.settings || {};
    location.onPopState(() => {this.beforeDismiss();this.dialog.close();});
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


  closeDialog(res?): void{
    this.beforeDismiss();
    this.dialog.close(res);
  }

  cancel(): void {
    this.closeDialog(false);
  }

  OK(): void {
    this.closeDialog(true);
  }
}

