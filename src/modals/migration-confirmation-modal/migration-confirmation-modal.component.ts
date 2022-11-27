import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { PlatformLocation } from '@angular/common';

export class MigrationConfirmationModalContext extends BSModalContext {
  public phone: string;
  public imei: string;
  public customClass: string;
}
@Component({
  selector: 'app-migration-confirmation-modal',
  templateUrl: './migration-confirmation-modal.component.html'
})
export class MigrationConfirmationModalComponent implements CloseGuard, ModalComponent<MigrationConfirmationModalContext> {
  public context: MigrationConfirmationModalContext;

  constructor(public dialog: DialogRef<MigrationConfirmationModalContext>, private modalHelper: ModalHelperService, private location: PlatformLocation) {
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

  confirm(response): void {
      this.dialog.close(response);
   
  }
}
