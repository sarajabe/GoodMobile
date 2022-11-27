import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, FirebaseUserProfileService,
  InternationalCallingConfigurationService, IPlanAddOn, IUser, IUserAccount, IUserPlan,
  MobileCustomPlansService, PlansConfigurationService, PURCHASE_INTENT, UserAccountService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { filter, takeWhile } from 'rxjs/operators';
import { FadeInOutAnimation } from 'src/app/app.animations';
import { ACCOUNT_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService, AccountPageDescription } from '../account-header.service';

@Component({
  selector: 'app-account-plan-add-ons',
  templateUrl: './account-plan-add-ons.component.html',
  animations: [FadeInOutAnimation],
  styleUrls: ['./account-plan-add-ons.component.scss']
})
export class AccountPlanAddOnsComponent implements OnInit, OnDestroy, AccountPageDescription {
  @Input() quantity = 0;
  @Input() talkAndTextQuantity = 0;

  public user: IUser;
  public selectedPlan: IUserPlan;
  public userAccount: IUserAccount;
  public selectedAddon: IPlanAddOn;
  public selectedAddons: Array<IPlanAddOn> = [];
  public compaitableAddons: Array<string> = [];
  public allAddons: Array<IPlanAddOn>;
  public dataAddonPlans: Array<IPlanAddOn>;
  public talkAndTextAddonPlans;
  public callsAddonPlans: Array<IPlanAddOn>;
  public gigPlanAddon: IPlanAddOn;
  public halfGigAddon: IPlanAddOn;
  public payGoAddon: IPlanAddOn;
  public unlimitedCalls: IPlanAddOn;
  public userCart: CustomizableMobilePlan;
  public countries: Array<{ name: string, isLandline: boolean, isCellular: boolean }>;
  public filteredCountries: Array<{ name: string, isLandline: boolean, isCellular: boolean }>;
  public letters: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  public payGoCountries: Array<{ name: string, value: any }>;
  public filteredPayGoCountries: Array<{ name: string, value: any }>;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public mdnFromEmail;
  public compaitableBundles;
  public talkAndTextAddon;
  public selected = 'A';
  public selectedPayGoLetter = 'A';
  public selectedType = 'Data';
  public maxNumberOfGigs = 5;
  public totalDataPrice = 0;
  public totalTalkAndTextPrice = 0;
  public talkAndTextAddonPrice = 0;
  public isCompaitableWithHalfGigAddon = false;
  public isCompaitableWithGigAddon = false;
  public isCompaitableWithInternationalAddon = false;
  public isCompaitableWith100MinsAddon = false;
  public isCompaitableWith500MinsAddon = false;
  public isCompaitableWithPayGo = false;
  public showUnlimited = true;
  public showPayGo = false;
  public showDataForm = true;
  public isDataActive = false;
  public showInternationalForm = false;
  public showTextForm = false;
  public isAccountLoading = false;
  public isAddonSelected = false;
  public processingRequest = false;
  public userHasPendingPlans = false;
  public userHasActivePlans = false;
  public isChangeAddon = false;
  public isEmailRedirect = false;
  public isChecked = false;
  public isTracked = false;
  private userHasPlans = false;
  private alive = true;

  constructor(private userAccountService: UserAccountService,
              private plansConf: PlansConfigurationService,
              private internationalCallingConfigurationService: InternationalCallingConfigurationService,
              private router: Router,
              private route: ActivatedRoute,
              private appState: AppState,
              private userPlansService: UserPlansService,
              private accountHeaderService: AccountHeaderService,
              private mobilePlansService: MobileCustomPlansService,
              private toastHelper: ToastrHelperService,
              private metaService: MetaService,
              private userProfileService: FirebaseUserProfileService,
              private analyticsService: ActionsAnalyticsService,
              private modalHelper: ModalHelperService) {

    this.plansConf.planConfiguration.pipe(takeWhile(() => this.alive)).subscribe((planConfig) => {
      this.allAddons = planConfig.planAddOns;
      this.dataAddonPlans = this.allAddons.filter((plan) => plan.type === 'add-on-data');
      this.gigPlanAddon = this.dataAddonPlans.find((plan) => plan.data === 1024);
      this.halfGigAddon = this.dataAddonPlans.find((plan) => plan.data === 500);
      this.unlimitedCalls = this.allAddons.find((plan) => plan.id.includes('INTERNATIONAL'));
      this.payGoAddon = this.allAddons.find((plan) => plan.id === 'GOODMOBILE-PAYASYOUGO-CALLING');
      this.talkAndTextAddonPlans = this.allAddons.filter((plan) => plan.id.includes('MINUTES'));
    });
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params) {
        this.showInternationalForm = true;
        this.isDataActive = params[ACCOUNT_ROUTE_URLS.PARAMS.INTERNATIONAL_CALLING] ? false : true;
        this.showDataForm = params[ACCOUNT_ROUTE_URLS.PARAMS.INTERNATIONAL_CALLING] ? false : true;
        if (params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
          this.userPlansService.selectUserPlan(params[ROUTE_URLS.PARAMS.USER_PLAN_ID]);
        }
        if (params[ACCOUNT_ROUTE_URLS.PARAMS.CHANGE_ADDON]) {
          this.isChangeAddon = true;
        }
        if (params[SHOP_ROUTE_URLS.PARAMS.MDN]) {
          this.isEmailRedirect = true;
          this.mdnFromEmail = params[SHOP_ROUTE_URLS.PARAMS.MDN];
        }
      }
    });
    this.metaService.createCanonicalUrl();
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      this.appState.loading = false;
      if (userPlanReady && !!this.userPlansService.selectedUserPlan) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
        const isActivePlan = !!this.selectedPlan.mdn;
        this.compaitableBundles = [];
        this.compaitableAddons = [];
        this.compaitableBundles = this.mobilePlansService.getAllBundleIdsOfPlanById(this.selectedPlan.basePlan.id);
        this.enableCompaitableAddons(this.compaitableBundles);
      } else {
        this.userPlansService.selectFirstUserPlan(true);
      }
    });
    this.internationalCallingConfigurationService.isReady.pipe(takeWhile(() => this.alive)).subscribe((ready) => {
      if (ready) {
        this.countries = this.internationalCallingConfigurationService.eligibility;
        this.filteredCountries = this.countries.filter((country) => country.name.startsWith('A') === true);
        this.payGoCountries = this.internationalCallingConfigurationService.payGo;
        this.filteredPayGoCountries = this.payGoCountries.filter((country) => country.name.startsWith('A') === true);
      }
    });
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((cart) => {
      this.userCart = cart;
      if (!!this.userCart && this.userCart.activePlanId && this.selectedPlan.id !== this.userCart.activePlanId) {
        this.userPlansService.selectUserPlan(this.userCart.activePlanId);
      }
    });
    this.accountHeaderService.setPageTitle('Plan add-ons');
  }
  public getDescription(): string {
    if (this.userHasPlans) {
      const storeLocatorUrl = '/' + SUPPORT_ROUTE_URLS.STORE_LOCATOR;
      return `<div class="page-description">You should have received a SIM card through mail by now, or purchased one from
       <a href="${storeLocatorUrl}"> an authorised retail store</a> near you in order to activated your pending plan?</div>`;
    } else {
      return `<div class="page-description plan-selector-space">You can always update your account details and settings here. You can also manage
        devices and activated accounts or add numbers to your existing account.</div>`;
    }
  }
  public userPlanSelected(userPlan: IUserPlan): void {
    if (!!userPlan.mdn) {
      if (!this.selectedPlan || (!!userPlan && userPlan.id !== this.selectedPlan.id)) {
        if (!!this.userCart && this.userCart.cartType && this.userCart.cartType !== CART_TYPES.NEW_PLAN) {
          this.modalHelper.showConfirmMessageModal('Clear Cart', 'Changing your selected account will clear the items in your cart. Do you want to proceed?',
            'Yes', 'No', 'clean-cart-modal')
            .result.then((result) => {
              if (!!result) {
                this.mobilePlansService.clearUserCart();
                this.appState.clearSessionStorage();
                if (!!this.userCart.voucherData) {
                  this.mobilePlansService.removeVoucherCode();
                }
                const removedItems = [];
                if (this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
                  removedItems.push(this.userCart.basePlan);
                } else {
                  if (this.userCart.simsQuantity > 0) {
                    removedItems.push({ id: 'SIMGWLTMO4GLTE', quantity: this.userCart.simsQuantity, price: 5, type: 'plan-item', title: 'SIM CARD' });
                  }
                  if (!!this.userCart.addOns) {
                    removedItems.push(this.userCart.addOns);
                  }
                }
                this.analyticsService.trackRermoveFromCartGA4(removedItems);
                this.userPlansService.selectUserPlan(userPlan.id);
                this.mobilePlansService.removePhonesFromCart();
                this.selectedAddons = [];
              } else {
                this.userPlansService.selectUserPlan(this.selectedPlan.id);
              }
            }, (error) => {
              console.error('error', error);
            });
        } else {
          this.userPlansService.selectUserPlan(userPlan.id);
          this.selectedAddons = [];
        }
      } else {
        if (!userPlan) {
          console.warn('User trying to select undefined user plan, that\'s weird!!');
        }
      }
    } else {
      this.userPlansService.selectFirstUserPlan(true);
    }
  }
  ngOnInit(): void {
    this.accountHeaderService.setPageDescription(this.getDescription());
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.user = user;
    });
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => {
      this.userAccount = account;
      if (!!this.userAccount && this.userAccount.activeAddOns) {
        const activeDataAddons = this.userAccount.activeAddOns.filter((plan) => plan.type === 'add-on-data');
        this.maxNumberOfGigs = 5 - activeDataAddons.length;
      }
    });
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
      this.userHasPlans = plans.length > 0;
      const pendingActivationPlans = plans.filter((plan) => !plan.mdn);
      const activatedPlans = plans.filter((plan) => !!plan.mdn);
      this.userHasPendingPlans = (!!pendingActivationPlans && pendingActivationPlans.length > 0);
      this.userHasActivePlans = (!!activatedPlans && activatedPlans.length > 0);
      if (!!this.isEmailRedirect && !this.isChecked) {
        // eslint-disable-next-line no-shadow
        const plan = activatedPlans.find((plan) => plan.mdn === this.mdnFromEmail);
        if (!!plan) {
          this.userPlansService.selectUserPlan(plan.id);
      } else {
          this.toastHelper.showAlert(`This Mobile number ${this.mdnFromEmail} is not found in your account`);
      }
        this.isChecked = true;
      }
    });
    this.userAccountService.isSyncingAccount.pipe(takeWhile(() => this.alive)).subscribe((isSyncing) => this.appState.loading = isSyncing);
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  /**
   * a method to set the selected type of addon based on user selection
   * @param type : parameter to specify the type of requested addon
   */
  public setSelectedAddonType(type: string): void {
    this.isAddonSelected = true;
    switch (type) {
      case 'Data':
        this.setDataAddonType();
        break;
      case 'International':
        this.setInternationalAddonType();
        break;
      case 'Minutes':
        this.setTalkAndTextAddonType();
        break;
      case 'payGo':
        this.setPayGoAddonType();
        break;
    }
  }
  public goToCart(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.selectedPlan.id;
    sessionStorage.setItem('plan_id', this.selectedPlan.id);
    if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Purchasing plan addOns will remove any plan in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
        .result.then((result) => {
          if (!!result) {
            this.appState.clearSessionStorage();
            this.mobilePlansService.removePhonesFromCart();
            this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
            if (!!this.userCart.voucherData) {
              this.mobilePlansService.removeVoucherCode();
            }
            this.mobilePlansService.setAddonsList(this.selectedAddons, this.mobilePlansService.getNoPlanMobilePlan()).then(() => {
            }).catch((error) => console.warn(error));
            setTimeout(() => {
              this.mobilePlansService.setCartType(CART_TYPES.PLAN_ITEMS);
              this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
              sessionStorage.setItem('plan_id', this.selectedPlan.id);
              if (!this.isTracked) {
                this.trackAddons();
                this.isTracked = true;
              }
              this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
            }, 200);
          } else {
          }
        }, (error) => {
          console.error('error', error);
        });
    } else {
      if (!this.isTracked) {
        this.trackAddons();
        this.isTracked = true;
      }
      this.mobilePlansService.setAddonsList(this.selectedAddons, this.mobilePlansService.getNoPlanMobilePlan()).then(() => {
      }).catch((error) => console.warn(error));
      this.mobilePlansService.removePhonesFromCart();
      this.mobilePlansService.setCartType(CART_TYPES.PLAN_ITEMS);
      this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
      sessionStorage.setItem('plan_id', this.selectedPlan.id);
      if (!this.isTracked) {
        this.trackAddons();
        this.isTracked = true;
      }
      this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
    }
  }
  public incrementDataAddOn(compaitableDataAddon): void {
    if (compaitableDataAddon === 'both') {
      this.quantity = this.quantity + 0.5;
      if ((this.quantity - Math.floor(this.quantity)) > 0) {
        this.totalDataPrice = this.totalDataPrice + this.halfGigAddon.price;
      } else {
        this.totalDataPrice = Math.floor(this.quantity) * this.gigPlanAddon.price;
      }
    } else if (compaitableDataAddon === 'gig') {
      if (this.quantity <= 99) {
        this.quantity = this.quantity + 1;
        this.totalDataPrice = this.quantity * this.gigPlanAddon.price;
      }
    } else if (compaitableDataAddon === 'halfGig') {
      this.quantity = this.quantity + 1;
      this.totalDataPrice = this.quantity * this.halfGigAddon.price;
    }
  }
  public decrementDataAddOn(compaitableDataAddon): void {
    if (this.quantity > 0) {
      if (compaitableDataAddon === 'both') {
        this.quantity = this.quantity - 0.5;
        if ((this.quantity - Math.floor(this.quantity)) === 0) {
          this.totalDataPrice = this.totalDataPrice - this.halfGigAddon.price;
        } else {
          this.totalDataPrice = Math.floor(this.quantity) * this.gigPlanAddon.price + this.halfGigAddon.price;
        }
      } else if (compaitableDataAddon === 'gig') {
        this.quantity = this.quantity - 1;
        this.totalDataPrice = this.totalDataPrice - this.gigPlanAddon.price;
      } else if (compaitableDataAddon === 'halfGig') {
        this.quantity = this.quantity - 1;
        this.totalDataPrice = this.totalDataPrice - this.halfGigAddon.price;
      }
    }
  }
  /**
   * a method to update the desired quantity of the talk and text addon
   * @param operation : parameter to specify the type of operation to make on quantity ('decrement' or 'increment')
   */
  public updateTextAddonQuanity(operation): void {
    if (!!this.talkAndTextAddon) {
      if (operation === 'decrement') {
        if (this.talkAndTextQuantity > 0) {
          this.talkAndTextQuantity = this.talkAndTextQuantity - 1;
          this.totalTalkAndTextPrice = this.talkAndTextAddonPrice * this.talkAndTextQuantity;
        }
      } else {
        if (this.talkAndTextQuantity >= 0) {
          this.talkAndTextQuantity = this.talkAndTextQuantity + 1;
          this.totalTalkAndTextPrice = this.talkAndTextAddonPrice * this.talkAndTextQuantity;
        }
      }
    }
  }
  /**
   * a method to update the type and price of talk and text addon based on user selection, and resets the quantity to 1
   * @param talkAndTextAddonType : a parameter to specify the selected type of talk and text addon
   */
  public updateTalkAndTextAddonType(talkAndTextAddonType): void {
    this.talkAndTextAddon = this.talkAndTextAddonPlans.find((plan) => plan.id === talkAndTextAddonType.value);
    this.talkAndTextAddonPrice = this.talkAndTextAddon.price;
    this.talkAndTextQuantity = 1;
    this.totalTalkAndTextPrice = this.talkAndTextAddonPrice;
  }
  /**
   * a method to filter the countries list and get all countries that starts with the selected letter
   * @param filterLetter : a parameter to specify the selected letter
   */
  public filterCountries(filterLetter: string, category?: string): void {
    if (category === 'payGo') {
      this.filteredPayGoCountries = this.payGoCountries.filter((country) => country.name.startsWith(filterLetter) === true);
    } else {
      this.filteredCountries = this.countries.filter((country) => country.name.startsWith(filterLetter) === true);
    }
  }
  /**
   * a method to change view based on user add-on type selection
   * @param type : a pramater to set the view based on the selected add-on type
   */
  public updateSelectedType(type: string): void {
    this.selectedType = type;
    switch (type) {
      case 'Data': {
        this.showDataForm = true;
        this.showInternationalForm = false;
        this.showTextForm = false;
        this.totalTalkAndTextPrice = 0;
        break;
      }
      case 'International': {
        this.showInternationalForm = true;
        this.showDataForm = false;
        this.showTextForm = false;
        this.totalTalkAndTextPrice = 0;
        break;
      }
      case 'Minutes': {
        this.showDataForm = false;
        this.showInternationalForm = false;
        this.showTextForm = true;
        break;
      }
    }
  }

  public selectAddOn(type: string): void {
    this.isAddonSelected = true;
    if (!!this.userCart && !!this.userCart.cartType && this.userCart.cartType !== CART_TYPES.PLAN_ITEMS) {
      this.modalHelper.showConfirmMessageModal('Clear Cart', 'Purchasing plan addOns will remove any plan in your cart. Do you want to proceed?', 'Yes', 'No', 'clean-cart-modal')
        .result.then((result) => {
          if (!!result) {
            this.appState.clearSessionStorage();
            if (!!this.userCart.voucherData) {
              this.mobilePlansService.removeVoucherCode();
            }
            this.analyticsService.trackRermoveFromCartGA4([this.userCart.basePlan]);
            this.setSelectedAddonType(type);
            this.mobilePlansService.setCartType(CART_TYPES.PLAN_ITEMS);
            this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
            this.mobilePlansService.setAddonsList(this.selectedAddons, this.mobilePlansService.getNoPlanMobilePlan()).then(() => {
              this.trackAddons();
              this.isTracked = true;
            }).catch((error) => console.warn(error));
            this.mobilePlansService.removePhonesFromCart();
            this.modalHelper.showConfirmMessage(`Now you can continue shopping or proceed to checkout`, {
              title: 'Your Plan Add-on has been added To your cart',
              okText: 'Proceed to checkout', cancelText: 'Continue Shopping', enableHTML: true, customClass: 'select-addon-modal'
              // eslint-disable-next-line no-shadow
            }).result.then((result) => {
              if (!!result) {
                this.goToCart();
              } else {
              }
            });
          } else {
            this.trackAddons();
            this.isTracked = true;
          }
        });
    } else {
      this.setSelectedAddonType(type);
      this.mobilePlansService.setCartType(CART_TYPES.PLAN_ITEMS);
      this.mobilePlansService.setActivePlanId(this.selectedPlan.id);
      this.mobilePlansService.setAddonsList(this.selectedAddons, this.mobilePlansService.getNoPlanMobilePlan()).then(() => {
        this.trackAddons();
        this.isTracked = true;
      }).catch((error) => console.warn(error));
      this.mobilePlansService.removePhonesFromCart();
      this.modalHelper.showConfirmMessage(`Now you can continue shopping or proceed to checkout`, {
        title: 'Your Plan Add-on has been added To your cart',
        okText: 'Proceed to checkout', cancelText: 'Continue Shopping', enableHTML: true, customClass: 'select-addon-modal'
      }).result.then((result) => {
        if (!!result) {
          this.goToCart();
        } else {
        }
      });
    }
  }
  public isILDSelected(): boolean {
    if (!!this.userCart && !!this.userCart.addOns) {
      const existedAddon = this.userCart.addOns.some((addOnObject) => addOnObject.id.includes('INTERNATIONAL'));
      return existedAddon;
    } else {
      return false;
    }
  }
  public isPayGoSelected(): boolean {
    if (!!this.userCart && !!this.userCart.addOns) {
      const existedAddon = this.userCart.addOns.some((addOnObject) => addOnObject.id.includes('PAY'));
      return existedAddon;
    } else {
      return false;
    }
  }
  public addActivatedAccount(): void {
    this.modalHelper.showAddActivatedNumberModal('add-number-modal').result.then((result) => {
      if (!!result) {
        this.userPlansService.bffAddUserPlanMDN(result).then((userPlanId) =>
          this.userPlansService.selectUserPlan(userPlanId), (error) => this.toastHelper.showAlert(error.error.message));
      }
    }).catch((error) => {
    });
  }
  private checkAddonExistence(addOn, quantity, type?): void {
    if (!!this.userCart && this.userCart.addOns) {
      this.selectedAddons = this.userCart.addOns;
    }
    if (!!this.isChangeAddon) {
      const talkTextCartAddons = this.selectedAddons.filter((r) => r.type !== 'add-on-data');
      if (talkTextCartAddons.length === 0) {
        this.selectedAddons = [];
      } else if (talkTextCartAddons.length === 1) {
        this.selectedAddons = this.selectedAddons.filter((r) => r.type !== 'add-on-data');
      } else {

      }
    }
    if (this.isCompaitableWithGigAddon && this.isCompaitableWithHalfGigAddon && !!type) {
      this.selectedAddons = this.selectedAddons.filter((r) => r.type !== 'add-on-data');
      if (type === 'multiple') {
        this.selectedAddons.push(addOn[0], addOn[1]);
      } else {
        this.selectedAddons.push(this.selectedAddon);
      }
    } else {
      const isExistedAddon = this.selectedAddons.some((addOnObject) => addOnObject.id === addOn.id);
      if (isExistedAddon) {
        const existedAddon = this.selectedAddons.find((addon) => addon.id === this.selectedAddon.id);
        this.selectedAddons[this.selectedAddons.indexOf(existedAddon)].quantity = quantity;
      } else if (!isExistedAddon) {
        this.selectedAddons.push(addOn);
      }
    }
  }
  private setDataAddonType(): void {
    if (this.isCompaitableWithHalfGigAddon && !this.isCompaitableWithGigAddon) {
      this.selectedAddon = {
        id: this.halfGigAddon.id,
        price: this.halfGigAddon.price,
        quantity: this.quantity,
        title: this.halfGigAddon.title,
        subtitle: this.halfGigAddon.subtitle,
        type: this.halfGigAddon.type
      };
      this.checkAddonExistence(this.selectedAddon, this.quantity);
    } else if (this.isCompaitableWithGigAddon && this.isCompaitableWithHalfGigAddon) {
      if (Math.floor(this.quantity) === 0) {
        this.selectedAddon = {
          id: this.halfGigAddon.id,
          price: this.halfGigAddon.price,
          quantity: 1,
          title: this.halfGigAddon.title,
          subtitle: this.halfGigAddon.subtitle,
          type: this.halfGigAddon.type
        };
        this.checkAddonExistence(this.selectedAddon, 1, 'data');
      } else if ((this.quantity - Math.floor(this.quantity)) === 0.5) {
        const dataAddons = [{
          id: this.halfGigAddon.id,
          price: this.halfGigAddon.price,
          quantity: 1,
          title: this.halfGigAddon.title,
          subtitle: this.halfGigAddon.subtitle,
          type: this.halfGigAddon.type
        }, {
          id: this.gigPlanAddon.id,
          price: this.gigPlanAddon.price,
          quantity: Math.floor(this.quantity),
          title: this.gigPlanAddon.title,
          subtitle: this.gigPlanAddon.subtitle,
          type: this.gigPlanAddon.type
        }];
        this.checkAddonExistence(dataAddons, Math.floor(this.quantity), 'multiple');
      } else {
        this.selectedAddon = {
          id: this.gigPlanAddon.id,
          price: this.gigPlanAddon.price,
          quantity: Math.floor(this.quantity),
          title: this.gigPlanAddon.title,
          subtitle: this.gigPlanAddon.subtitle,
          type: this.gigPlanAddon.type
        };
        this.checkAddonExistence(this.selectedAddon, Math.floor(this.quantity), 'data');
      }
    } else if (this.isCompaitableWithGigAddon && !this.isCompaitableWithHalfGigAddon) {
      this.selectedAddon = {
        id: this.gigPlanAddon.id,
        price: this.gigPlanAddon.price,
        quantity: this.quantity,
        title: this.gigPlanAddon.title,
        subtitle: this.gigPlanAddon.subtitle,
        type: this.gigPlanAddon.type
      };
      this.checkAddonExistence(this.selectedAddon, this.quantity);
    }
  }
  private setInternationalAddonType(): void {
    this.selectedAddon = {
      id: this.unlimitedCalls.id,
      quantity: 1,
      price: this.unlimitedCalls.price,
      title: this.unlimitedCalls.title,
      subtitle: this.unlimitedCalls.subtitle,
      type: this.unlimitedCalls.type
    };
    this.checkAddonExistence(this.selectedAddon, 1);
  }
  private setPayGoAddonType(): void {
    this.selectedAddon = {
      id: this.payGoAddon.id,
      quantity: 1,
      price: this.payGoAddon.price,
      title: this.payGoAddon.title,
      subtitle: this.payGoAddon.subtitle,
      type: this.payGoAddon.type
    };
    this.checkAddonExistence(this.selectedAddon, 1);
  }
  private setTalkAndTextAddonType(): void {
    this.selectedAddon = {
      id: this.talkAndTextAddon.id,
      quantity: this.talkAndTextQuantity,
      price: this.talkAndTextAddon.price,
      title: this.talkAndTextAddon.title,
      subtitle: this.talkAndTextAddon.subtitle,
      type: this.talkAndTextAddon.type
    };
    this.checkAddonExistence(this.selectedAddon, this.talkAndTextQuantity);
  }
  /**
   * a method to enable compatible add-ons with user's selected plan
   * @param bundles : a parameter that contains the ids of compatiable bundles of the user's selected plan
   */
  private enableCompaitableAddons(bundles): void {
    this.resetAddons();
    bundles.forEach((element) => {
      this.allAddons.forEach((addon) => {
        let compaitableWith = [];
        compaitableWith = addon.compatibleWith.toString().split(',');
        if (compaitableWith.indexOf(element) > -1) {
          this.compaitableAddons.push(addon.id);
        }
      });
    });
    this.compaitableAddons.forEach((addonId) => {
      switch (addonId) {
        case 'GOODMOBILE-DATA-1GB':
          this.isCompaitableWithGigAddon = true;
          this.gigPlanAddon = this.dataAddonPlans.find((plan) => plan.id === addonId);
          break;
        case 'GOODMOBILE-UNLIMITED-INTERNATIONAL':
          this.isCompaitableWithInternationalAddon = true;
          break;
        case 'GOODMOBILE-PAYASYOUGO-CALLING':
          this.isCompaitableWithPayGo = true;
          break;
      }
    });
  }
  private resetAddons(): void {
    this.isCompaitableWith100MinsAddon = false;
    this.isCompaitableWith500MinsAddon = false;
    this.isCompaitableWithGigAddon = false;
    this.isCompaitableWithHalfGigAddon = false;
    this.isCompaitableWithInternationalAddon = false;
    this.quantity = 0;
    this.totalDataPrice = 0;
    this.showDataForm = true;
    this.showInternationalForm = false;
    this.showTextForm = false;
    this.totalTalkAndTextPrice = 0;
    this.talkAndTextQuantity = 0;
  }
  private trackAddons(): void {
    this.analyticsService.trackAddToCartGA4(PURCHASE_INTENT.ADDON, this.selectedAddons);
  }
}
