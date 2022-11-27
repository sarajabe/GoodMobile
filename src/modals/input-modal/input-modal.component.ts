import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';

export class InputModalContext extends BSModalContext {
  public title: string;
  public message: string;
  public okText?: string;
  public okBtnClass?: string;
  public customClass?: string;
  public isCancelable?: boolean;
  public cancelText?: string;
  public cancelBtnClass?: string;
  public labelText?: string;
}

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html'
})
export class InputModalComponent implements CloseGuard, ModalComponent<InputModalContext> {
  public context: InputModalContext;
  public userInputValue: string;

  constructor(public dialog: DialogRef<InputModalContext>, private location: PlatformLocation) {
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
    this.dialog.close(false);
  }

  submitUserInput(): void {
    this.dialog.close(this.userInputValue);
  }
}
