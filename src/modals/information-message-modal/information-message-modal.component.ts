import { Component, Inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class InformationMessageModalContext {
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
  public specificCancelReturn?: string;
}

@Component({
  selector: 'app-information-message-modal',
  templateUrl: './information-message-modal.component.html'
})
export class InformationMessageModalComponent {
  public context: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialogRef<InformationMessageModalContext>, private location: PlatformLocation) {
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

  closeDialog(res?): void {
    this.beforeDismiss();
    this.dialog.close(res);
  }

  OK(): void {
    this.closeDialog(true);
  }
  cancel(): void{
    if(this.context?.specificCancelReturn) {
      this.closeDialog(this.context?.specificCancelReturn);
    } else{
      this.closeDialog(false);
    }
  }
}
