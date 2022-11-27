import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUserProfileService, IUser } from '@ztarmobile/zwp-service-backend';
import { filter, takeWhile } from 'rxjs/operators';
import { DUPLICATE_PAYMENTS_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';

@Component({
  selector: 'app-check-payments',
  templateUrl: './check-payments.component.html',
  styleUrls: ['./check-payments.component.scss']
})
export class CheckPaymentsComponent implements OnInit, OnDestroy {
  public numberOfDuplicatePayments;
  public user: IUser;
  private alive = true;
  constructor(private userProfileService: FirebaseUserProfileService, private appState: AppState, private router: Router) { 
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.user = user;
      console.info('user ', this.user);
      this.user.duplicatePaymentId = this.user.duplicatePaymentId.filter((p) => !!p.id);
      this.numberOfDuplicatePayments = !!this.user.duplicatePaymentId ? this.user.duplicatePaymentId.length : 0;
    });
    this.appState.loading = false;
  }

  ngOnInit(): void {
  }

  public goToPaymentsList(): void {
    this.router.navigate([`/${DUPLICATE_PAYMENTS_ROUTE_URLS.BASE}/${DUPLICATE_PAYMENTS_ROUTE_URLS.PAYMENTS_LIST}`])
  }
  ngOnDestroy(): void {
      this.alive = false;
  }

}
