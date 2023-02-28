import { Component, Inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class FiveGModalContext{
  public title: string;
  public linkRoute;
  public linkText: string;
  public customHTML: string;
  public customClass?: string;
  public hasCloseLink?: boolean;
}

@Component({
  selector: 'app-fiveg-modal',
  templateUrl: './five-gmodal.component.html'
})
export class FiveGModalComponent {
  public context: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialogRef<FiveGModalContext>, private location: PlatformLocation) {
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

  closeDialog(result): void {
    this.beforeDismiss();
      this.dialog.close(result);
  }

  download(): void {
    this.beforeDismiss();
    this.dialog.close(true);
  }
}

