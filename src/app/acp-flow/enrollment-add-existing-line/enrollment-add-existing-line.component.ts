import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionsAnalyticsService, CART_TYPES, IChangePlanCartItem, IUserPlan, MobileCustomPlansService, MobilePlanItem, OrderCheckoutService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { filter, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS, ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ACP_CALLBACK_URL } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';

@Component({
  selector: 'app-enrollment-add-existing-line',
  templateUrl: './enrollment-add-existing-line.component.html',
  styleUrls: ['./enrollment-add-existing-line.component.scss']
})
export class EnrollmentAddExistingLineComponent implements OnInit {
  public currentMobileNumberForm: UntypedFormGroup;
  public activePlans: Array<IUserPlan>;
  public ebbPlan: MobilePlanItem;
  public planPurchased = false;

  private planPuchasedClicked = false;
  private alive = true;
  constructor(private router: Router, private formBuilder: FormBuilder,
    private userPlansService: UserPlansService, private appState: AppState,
    private modalHelper: ModalHelperService,
    private mobilePlansService: MobileCustomPlansService, private orderCheckoutService: OrderCheckoutService,
    private toastHelper: ToastrHelperService, private analyticsService: ActionsAnalyticsService) {
    this.mobilePlansService.isConfigurationReady
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.ebbPlan = this.mobilePlansService.allBasePlans.find(
          (plan) => !!plan.ebb
        );
      });
  }

  ngOnInit(): void {
    this.currentMobileNumberForm = this.formBuilder.group({
      mdn: ["", Validators.required],
    });
    this.userPlansService.userPlans
      .pipe(takeWhile(() => this.alive))
      .pipe(filter((plans) => !!plans))
      .subscribe((plans) => {
        if (!!plans) {
          setTimeout(() => {
            const userEbbPlan = plans.find((p) => p.basePlan && !!p.basePlan.ebb);
            this.activePlans = plans.filter(
              (plan) =>
                !!plan.mdn &&
                !plan.portInRequestNumber &&
                !plan.canceled
            );
            if (!userEbbPlan) {
              this.appState.loading = true;
              this.appState.acpAppResObs.subscribe(details => {
                if (!!details && details?.status !== 'COMPLETE') {
                  this.goToAcpLanding();
                  this.appState.loading = false;
                } else {
                  this.appState.loading = false;
                }
              });
            } else if (!!userEbbPlan && !this.planPuchasedClicked) {
              this.goToAcpLanding();
            }
          }, 200);
        }
      });
  }
  public cancel(): void {
    this.router.navigate([`${ROUTE_URLS.ACP}`]);
  }
  public purchasePlan(): void {
    this.currentMobileNumberForm.markAllAsTouched();
    if (!!this.currentMobileNumberForm.valid) {
      this.currentMobileNumberForm.markAllAsTouched();
      if (!!this.currentMobileNumberForm.valid) {
        let selectedMdn = this.currentMobileNumberForm.controls.mdn.value;
        const selectedPlan = this.activePlans.find(
          (p) => p.mdn === selectedMdn
        );
        selectedMdn = new PhonePipe().transform(selectedMdn);
        const message = `Are you sure you want to change your $${selectedPlan.basePlan.price} ${selectedPlan.title} of number ${selectedMdn} to ACP plan (Your plan change will take affect immediately)?`;
        this.modalHelper
          .showConfirmMessageModal(
            "Change to ACP plan",
            message,
            "Yes",
            "No",
            "clean-cart-modal"
          )
          .afterClosed().subscribe((result) => {
            if (result) {
              // this session waitingAcpActivation should be cleared once 
              // the user access his ACP summary page and his plan has been successfully activated with exiting plan
              sessionStorage.setItem('waitingAcpActivation', 'true');
              this.appState.loading = true;
              this.mobilePlansService.clearUserCart().then(() => {
                this.mobilePlansService.setBasePlan(this.ebbPlan);
                this.mobilePlansService.setCartType(
                  CART_TYPES.CHANGE_PLAN
                );
                sessionStorage.removeItem("useFromBalance");
                sessionStorage.removeItem("useFromReward");
                this.mobilePlansService.setActivePlanId(selectedPlan.id).then(() => {
                  const data: IChangePlanCartItem = {
                    nextCycleRenew: false,
                    basePlanId: this.ebbPlan.id,
                    paymentInfo: null,
                    autoRenewPlan: true,
                    promoCode: this.ebbPlan.promoCode,
                    usingPaymentProfile: false,
                    savePaymentMethod: false,
                  };
                  setTimeout(() => {
                    this.orderCheckoutService
                      .checkoutChangePlan(selectedPlan.id, data)
                      .then(
                        () => {
                          const data = {
                            event: 'ACP_change_plan',
                            category: 'ACP Activation',
                            label: 'ACP Step 5',
                            action: 'change to ACP plan'
                          }
                          this.analyticsService.trackACPEvent(data);
                          this.planPuchasedClicked = true;
                          this.appState.loading = false;
                          this.planPurchased = true;
                        },
                        (error) => {
                          this.appState.loading = false;
                          this.planPuchasedClicked = true;
                          this.toastHelper.showAlert(error.message);
                          this.mobilePlansService.clearUserCart();
                          this.planPurchased = false;
                        }
                      );
                  }, 300);
                });
              });
            }
          });
      }
    }
  }
  public goToAcpSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`]);
  }
  private goToAcpLanding(): void {
    this.router.navigate([`${ROUTE_URLS.ACP}`]);
  }
}
