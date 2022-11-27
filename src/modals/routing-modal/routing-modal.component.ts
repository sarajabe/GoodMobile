import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';

export class RoutingModalContext extends BSModalContext {
  public message: string;
  public title: string;
  public hasCloseLink?: boolean;
  public yesButtonText?: string;
  public noButtonText?: string;
  public skipButtonText?: string;
  public yesButtonLink?: string;
  public noButtonLink?: string;
  public skipButtonLink?: string;
  public customClass?: string;
}

@Component({
  selector: 'app-routing-modal',
  templateUrl: './routing-modal.component.html'
})
export class RoutingModalComponent implements CloseGuard, ModalComponent<RoutingModalContext> {
  public context: RoutingModalContext;

  constructor(public dialog: DialogRef<RoutingModalContext>, private location: PlatformLocation) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
  }

  public goToFirstPage(): void{
      this.dialog.close('check-phone');
  }

  public goToSecondPage(): void {
   this.dialog.close('shop-phone');
  }

 public goToThirdPage(): void {
  this.dialog.close('skip');
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
}
