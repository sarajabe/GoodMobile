import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { PlatformLocation } from '@angular/common';

export class ReferralPromotionContext extends BSModalContext {
  public customClass?: string;
}

@Component({
  selector: 'app-referral-promotion',
  templateUrl: './referral-promotion.component.html'
})
export class ReferralPromotionComponent implements CloseGuard, ModalComponent<ReferralPromotionContext> {

  public context: ReferralPromotionContext;
  public index = 0;
  constructor(public dialog: DialogRef<ReferralPromotionContext>, private router: Router, private location: PlatformLocation) {
    this.context = dialog.context;
    sessionStorage.setItem('hideReferral', 'hide');
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

 closeDialog(result?: any): void {
    sessionStorage.setItem('hideReferral', 'hide');
    this.dialog.close(result);
  }

  public goToReferFriend(): void {
    this.closeDialog();
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REFER_FRIEND}`]);
  }

  public goToTerms(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.TERMS_AND_CONDITIONS}/${SUPPORT_ROUTE_URLS.REFER_A_FRIEND}`]);
    this.closeDialog();
  }

  public skipPromo(): void {
    this.closeDialog();
  }
}
