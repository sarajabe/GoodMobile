import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CART_TYPES, CustomizableMobilePlan, ICatalogItem, IUserPlan, MobileCustomPlansService, MobilePlanItem, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { ICarrierValidity } from '@ztarmobile/zwp-service-backend-v2';
import { take, takeWhile } from 'rxjs/operators';
import { PHONES_SHOP_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { PhoneManagementService } from 'src/services/phones.service';


@Component({
  selector: 'app-add-phone-steps',
  templateUrl: './add-phone-steps.component.html',
  styleUrls: ['./add-phone-steps.component.scss']
})
export class AddPhoneStepsComponent implements OnInit, OnDestroy {
  public activeStep = 1;
  public circlePercentage = 50;
  public selectedOption = '';
  public showSelectionError = false;
  public showSelectedMdnError = false;
  public isSelectedMdnCoveredByTmo = false;
  public stepsDetails: Array<{ stepNumber: number; title: string; description: string }>;
  public newPlan: MobilePlanItem;
  public selectedCoverage: ICarrierValidity;
  public selectedPhone: ICatalogItem;
  public addressVal = '';
  public showCoverageError = false;
  public isValidProcess = false;
  public isDeclinedTerms = false;
  public hasActivePlans = false;
  public isPlanFlow = false;
  public userCart: CustomizableMobilePlan;
  public selectedUserPlan: IUserPlan;
  private alive = false;
  constructor(private stepsManagement: PhoneManagementService, public router: Router, private mobilePlansService: MobileCustomPlansService,
              private userPlansService: UserPlansService) {
    this.stepsDetails = [
      { stepNumber: 1, title: 'Before we add to Cart', description: 'Please select an active Good Mobile number or purchase a new line in order to proceed.' },
      { stepNumber: 2, title: 'Service Coverage Check', description: 'Enter your ZIP code below and find out if Good Mobile is the best fit for your location.' },
    ];
    const savedFlow = sessionStorage.getItem('planFlow');
    this.isPlanFlow = !!savedFlow ? true : false;
    this.stepsManagement.setPlanFlow(!!this.isPlanFlow ? true : false);
    if (!!this.isPlanFlow) {
      this.stepsManagement.updateSelectedLineOption('new');
    }
  }

  ngOnInit(): void {
    this.stepsManagement.planFlow.pipe(takeWhile(() => this.alive)).subscribe((result) => {
      this.isPlanFlow = result;
    });
    this.userPlansService.userPlans.pipe(take(1)).subscribe((plans) => {
      if (!!plans) {
        const userPlans = plans.filter((plan) => !!plan.mdn && !plan.canceled && (!plan.phonePurchaseDate || (((new Date().getTime() - new Date(plan.phonePurchaseDate).getTime()) / (1000 * 3600 * 24)) > 90)));
        this.hasActivePlans = !!userPlans && userPlans.length > 0 ? true : false;
      }
    });
    this.stepsManagement.activeStep.pipe(takeWhile(() => this.alive)).subscribe((step) => {
      this.activeStep = step;
      this.circlePercentage = (this.activeStep / 2) * 100;
    });
    this.stepsManagement.selectedOption.subscribe((option) => {
      if (!!option) {
        this.selectedOption = option;
        this.showSelectionError = false;
        if (this.selectedOption !== 'new') {
          // check the selectedMdn is valid or not if the user select current mobile number option ,
          // if not then we gonna display a validation message to the user to select an active mdn
            this.stepsManagement.selectedMdn.subscribe((valid) => {
            if (!!valid) {
              this.showSelectedMdnError = false;
            } else {
              this.showSelectedMdnError = !!this.hasActivePlans ? true : false;
            }
          });
        }
      }
    });
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.userCart = cart;
    });
    this.stepsManagement.validProcess.subscribe((valid) => {
      this.addressVal = JSON.parse(sessionStorage.getItem('address'));
      this.isValidProcess = valid;
      this.showCoverageError = this.isValidProcess === true ? false : true;
    });
    this.stepsManagement.declinedTerms.subscribe((option) => {
      this.isDeclinedTerms = option;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public updateStep(data): void { // this function will run when any component of the router-outlet is initiated and gives access to the data of that component
    this.activeStep = data.activeStep;
    this.circlePercentage = (this.activeStep / 2) * 100;
  }
  public validateStep(): void {
    if (!!this.selectedOption) {
      this.showSelectionError = false;
      if (this.activeStep === 1) {
        if (this.selectedOption === 'new') { // user selected new mobile number
          const params = {};
          params[SHOP_ROUTE_URLS.PARAMS.PHONE_PURCHASE] = true;
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`, params]);
        } else { // user selected current mobile number
          const savedMdn = JSON.parse(sessionStorage.getItem('selectedUserPlan'));
          if (!!savedMdn) {
            this.showSelectedMdnError = false;
            this.activeStep = 2;
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.ADD_STEPS}/${PHONES_SHOP_ROUTE_URLS.CHECK_COVERAGE}`]);
          } else {
            this.showSelectedMdnError = !!this.hasActivePlans ? true : false;
          }
        }
      } else { // user in step 2 and clicked done
        if (this.isValidProcess) {
          this.showCoverageError = false;
          sessionStorage.removeItem('shippingMethod');
          sessionStorage.removeItem('shippingAddress');
          sessionStorage.removeItem('storePickup');
          if (this.selectedOption === 'new') {
            if (!this.isDeclinedTerms) {
              const id = JSON.parse(sessionStorage.getItem('selectedPlanId'));
              this.newPlan = this.mobilePlansService.allBasePlans.find((plan) => plan.id === id);
              if (!!this.isPlanFlow) {
                this.handleItemCart(CART_TYPES.NEW_PLAN);
              } else {
                if (!!this.newPlan) {
                  this.mobilePlansService.clearUserCart();
                  this.handleItemCart(CART_TYPES.NEW_PLAN);
                }
              }
            } else {
              this.clearProcessStorage();
              this.mobilePlansService.clearUserCart();
              this.router.navigate([ROUTE_URLS.HOME]);
            }
          } else {
              // current option selected and covered checked
              this.selectedUserPlan = JSON.parse(sessionStorage.getItem('selectedUserPlan'));
              if (!!this.selectedUserPlan) {
                this.mobilePlansService.clearUserCart();
                this.handleItemCart(CART_TYPES.GENERIC_CART);
              }
          }
        } else {
          if (this.activeStep === 2) {
            // if the process is invalid
            this.clearProcessStorage();
            this.mobilePlansService.clearUserCart();
            this.router.navigate([ROUTE_URLS.HOME]);
          }
        }
      }
    } else {
      // if the user click on next and he does not select an option , then display a validation msg for him
      this.showSelectionError = true;
      this.clearProcessStorage();
    }

  }

  public cancel(): void {
    this.clearProcessStorage();
    if (this.isPlanFlow) {
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
    } else {
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`]);
    }
  }

  public back(): void {
    this.activeStep = 1;
    this.showSelectionError = false;
    this.showSelectedMdnError = false;
    this.showCoverageError = false;
    this.circlePercentage = (this.activeStep / 2) * 100;
    this.stepsManagement.setProcessValidity(false);
    // when the user clicks on refresh then back we have to set the values as saved in session because the subscribe will be empty after refresh
    const newPlan = JSON.parse(sessionStorage.getItem('selectedPlanId'));
    const current = JSON.parse(sessionStorage.getItem('selectedUserPlan'));
    if (!!newPlan) {
      this.stepsManagement.updateSelectedLineOption('new');
    }
    if (!!current) {
      this.stepsManagement.updateSelectedLineOption('current');
    }
    sessionStorage.removeItem('checkedDevice');
    sessionStorage.removeItem('zipCode');
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.ADD_STEPS}/${PHONES_SHOP_ROUTE_URLS.SELECT_LINE}`]);
  }

  private handleItemCart(cartType: string): void {
    this.selectedCoverage = JSON.parse(sessionStorage.getItem('checkedDevice'));
    this.selectedPhone = JSON.parse(sessionStorage.getItem('phone'));
    if (!!this.selectedPhone && !!this.selectedCoverage) {
      setTimeout(() => { // without the timeout a race condition shows and not all cart properties are updated as required
        this.mobilePlansService.setAddonsList(null, this.userCart);
        this.mobilePlansService.setCartType(cartType);
        this.mobilePlansService.setPhones([this.selectedPhone]);
        this.mobilePlansService.setPlanDevice(this.selectedCoverage);
        if (this.selectedCoverage.network === 'tmo') {
          this.mobilePlansService.seteSIM(true);
          this.mobilePlansService.setQrScanned(false);
        }
        if (cartType === CART_TYPES.NEW_PLAN) {
          this.mobilePlansService.setActivePlanId(null);
          if (!!this.newPlan) {
            this.mobilePlansService.setBasePlan(this.newPlan);
            this.mobilePlansService.setAutoRenewPlan(true);
          }
        } else {
          // this is to clear base plan in case the user already was in the new plan flow then changed to mdn flow
          this.mobilePlansService.setBasePlan(null);
          if (!!this.selectedUserPlan) {
            this.mobilePlansService.setActivePlanId(this.selectedUserPlan.id);
          }
        }
      }, 500);
      // clean the session storage
      this.clearProcessStorage();
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    }
  }

  private clearProcessStorage(): void {
    sessionStorage.removeItem('checkedDevice');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('selectedPlanId');
    sessionStorage.removeItem('selectedUserPlan');
    sessionStorage.removeItem('zipCode');
    sessionStorage.removeItem('planFlow');
  }
}
