import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';

export class FiveGModalContext extends BSModalContext {
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
export class FiveGModalComponent implements CloseGuard, ModalComponent<FiveGModalContext> {
  public context: FiveGModalContext;
  constructor(public dialog: DialogRef<FiveGModalContext>, private location: PlatformLocation) {
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

  closeDialog(result): void {
      this.dialog.close(result);
  }

  download(): void {
    this.dialog.close(true);
  }
}

