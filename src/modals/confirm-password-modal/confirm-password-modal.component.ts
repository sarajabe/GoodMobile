import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';

export class ConfirmPasswordModalContext extends BSModalContext {
  public message: string;
  public title: boolean;
  public customClass?: string;
}

@Component({
  selector: 'app-confirm-password-modal',
  templateUrl: './confirm-password-modal.component.html'
})
export class ConfirmPasswordModalComponent implements CloseGuard, ModalComponent<ConfirmPasswordModalContext> {
  public context: ConfirmPasswordModalContext;
  public confirmCurrentPassword: string;

  constructor(public dialog: DialogRef<ConfirmPasswordModalContext>, private location: PlatformLocation) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
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
    this.dialog.dismiss();
  }

  submitPassword(): void {
    this.dialog.close(this.confirmCurrentPassword);
  }
}
