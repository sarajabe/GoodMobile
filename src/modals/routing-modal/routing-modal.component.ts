import { Component, Inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class RoutingModalContext {
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
export class RoutingModalComponent {
  public context: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialogRef<RoutingModalContext>, private location: PlatformLocation) {
    this.context = data;
    location.onPopState(() => { this.beforeDismiss();this.dialog.close();});
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
    this.beforeDismiss();
    this.dialog.close();
  }

  OK(): void {
    this.beforeDismiss();
    this.dialog.close(true);
  }
}
