import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';
import { ModalSetting } from 'src/services/modal-helper.service';

export class PhoneNotWorkingContext extends BSModalContext {
  public message: string;
  public title: string;
  public settings: ModalSetting;
}

@Component({
  selector: 'app-phone-not-impacted-modal',
  templateUrl: './phone-not-impacted-modal.component.html'
})
export class PhoneNotImpactedModalComponent implements CloseGuard, ModalComponent<PhoneNotWorkingContext> {
  public context: PhoneNotWorkingContext;
  public settings: ModalSetting;
  constructor(public dialog: DialogRef<PhoneNotWorkingContext>, private location: PlatformLocation) {
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

  closeDialog(): void {
    this.dialog.close();
  }

  public takeAction(action?: string): void {
    this.dialog.close(action);
  }
}
