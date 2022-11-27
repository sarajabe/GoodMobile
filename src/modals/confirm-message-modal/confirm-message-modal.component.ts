import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { ModalSetting } from '../../services/modal-helper.service';
import { PlatformLocation } from '@angular/common';

export class ConfirmMessageModalContext extends BSModalContext {
  public message: string;
  public title: boolean;
  public settings: ModalSetting;
}

@Component({
  selector: 'app-confirm-message-modal',
  templateUrl: './confirm-message-modal.component.html'
})
export class ConfirmMessageModalComponent implements CloseGuard, ModalComponent<ConfirmMessageModalContext> {
  public context: ConfirmMessageModalContext;
  public settings: ModalSetting;

  constructor(public dialog: DialogRef<ConfirmMessageModalContext>, private location: PlatformLocation) {
    this.context = dialog.context;
    this.settings = this.context.settings || {};
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

  closeDialog(): void{
    this.dialog.close();
  }

  cancel(): void {
    this.dialog.close(false);
  }

  OK(): void {
    this.dialog.close(true);
  }
}

