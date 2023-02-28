import { Component, Inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class InputModalContext {
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
export class InputModalComponent {
  public context: any;
  public userInputValue: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialogRef<InputModalContext>, private location: PlatformLocation) {
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
    this.dialog.close(false);
  }

  submitUserInput(): void {
    this.beforeDismiss();
    this.dialog.close(this.userInputValue);
  }
}
