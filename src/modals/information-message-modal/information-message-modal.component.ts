import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';

export class InformationMessageModalContext extends BSModalContext {
  public message: string;
  public title: boolean;
  public btnText: string;
  public btnUrl?: string;
  public hasCloseLink?: boolean;
  public customClass?: string;
  public customHTML?: string;
  public cancelBtn?: boolean;
  public cancelText?: string;
  public noteText?: string;
}

@Component({
  selector: 'app-information-message-modal',
  templateUrl: './information-message-modal.component.html'
})
export class InformationMessageModalComponent implements CloseGuard, ModalComponent<InformationMessageModalContext> {
  public context: InformationMessageModalContext;

  constructor(public dialog: DialogRef<InformationMessageModalContext>, private location: PlatformLocation) {
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

  OK(): void {
    this.dialog.close(true);
  }
  cancel(): void{
    this.dialog.close(false);
    this.closeDialog();
  }
}
