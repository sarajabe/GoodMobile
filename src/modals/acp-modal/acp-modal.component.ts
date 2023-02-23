import { PlatformLocation } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class AcpModalContext {
  public title: string;
  public customHTML: string;
  public primaryButton?: string;
  public secondaryButton?: string;
  public customClass?: string;
  public hasCloseLink?: boolean;
}

@Component({
  selector: 'app-acp-modal',
  templateUrl: './acp-modal.component.html'
})
export class AcpModalComponent{
  public context: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialogRef<AcpModalContext>, private location: PlatformLocation) {
    this.context = data;
    location.onPopState(() => {this.beforeDismiss();this.dialog.close();});

  }
  onKeydown(event) {
    event.stopImmediatePropagation();
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

  public closeDialog(result?): void {
    this.beforeDismiss();
    this.dialog.close(result);
  }
}
