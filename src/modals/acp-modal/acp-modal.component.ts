import { PlatformLocation } from '@angular/common';
import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';

export class AcpModalContext extends BSModalContext {
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
export class AcpModalComponent implements CloseGuard, ModalComponent<AcpModalContext> {
  public context: AcpModalContext;
  constructor(public dialog: DialogRef<AcpModalContext>, private location: PlatformLocation) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
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
    this.dialog.close(result);
  }
}
