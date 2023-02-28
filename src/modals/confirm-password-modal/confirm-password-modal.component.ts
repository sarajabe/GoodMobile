import { Component, Inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ConfirmPasswordModalContext {
  public message: string;
  public title: boolean;
  public customClass?: string;
}

@Component({
  selector: 'app-confirm-password-modal',
  templateUrl: './confirm-password-modal.component.html'
})
export class ConfirmPasswordModalComponent {
  public context: any;
  public confirmCurrentPassword: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialogRef<ConfirmPasswordModalContext>, private location: PlatformLocation) {
    this.context = data;
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

  closeDialog(): void {
    this.beforeDismiss();
    this.dialog.close();
  }

  submitPassword(): void {
    this.beforeDismiss();
    this.dialog.close(this.confirmCurrentPassword);
  }
}
