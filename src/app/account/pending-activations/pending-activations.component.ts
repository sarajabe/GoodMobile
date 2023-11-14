import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import {
  AccountPaymentService, FirebaseUserProfileService, IFirebaseAddress, IFirebasePaymentMethod,
  IPaymentMethod, IUser, IUserPlan, ShippingConfigurationService, ShippingService, UserOrdersService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { PaginationInstance } from 'ngx-pagination';
import { takeWhile, take } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, PLANS_SHOP_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ContentfulService } from 'src/services/contentful.service';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService, AccountPageDescription } from '../account-header.service';
import { ClipboardService } from 'ngx-clipboard';
import { LookupsService } from '@ztarmobile/zwp-service-backend-v2';

@Component({
  selector: 'app-pending-activations',
  templateUrl: './pending-activations.component.html',
  styleUrls: ['./pending-activations.component.scss']
})
export class PendingActivationsComponent implements OnInit, OnDestroy, AccountPageDescription {
  public user: IUser;
  public pendingPlans: IUserPlan[];
  public currentUserPlan: IUserPlan;
  public currentShippingAddress: IFirebaseAddress;
  public currentPaymentMethod: IFirebasePaymentMethod;
  public planPaymentMethod: IPaymentMethod;
  public innerWidth: any;
  public deviceImageURL;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public PLANS_SHOP_ROUTE_URLS = PLANS_SHOP_ROUTE_URLS;
  public config: PaginationInstance = {
    id: 'plans',
    itemsPerPage: 1,
    currentPage: 1,
    totalItems: 0
  };
  public planIndex = 0;
  public loadingPlan = true;
  public discountAmount: number;
  public totalUserPrice: number;
  public isEBBPlan = false;
  public purchasedPhone;
  public phoneImageLink;
  public deliveredPhone = false;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public deviceExpanded = true;
  public paymentExpanded = true;
  public barCodeValues;
  public customerId;
  public newSimOrder: { price: number, fees: number, id?: string };
  public orderPicked = false;
  public iccid;
  public stores = [];
  public viewStores = false;
  activationCode: Params;
  public isInPersonDelivery = false;

  private userId: string;
  private alive = true;

  constructor(private toastHelper: ToastrHelperService,
    private accountHeaderService: AccountHeaderService,
    private router: Router,
    private appState: AppState,
    private shippingService: ShippingService,
    private modalHelper: ModalHelperService,
    private userPlansService: UserPlansService,
    private userProfileService: FirebaseUserProfileService,
    private simpleAuthService: SimpleAuthService,
    private accountPaymentService: AccountPaymentService,
    private metaService: MetaService,
    private contentful: ContentfulService,
    private route: ActivatedRoute,
    private shippingConfigurationService: ShippingConfigurationService,
    private accountOrderService: UserOrdersService,
    private lookupsService: LookupsService,
    private clipboardService: ClipboardService) {

    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE]) {
        this.activationCode = params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE];
      } else {
        const sim: any = Object.assign({}, JSON.parse(sessionStorage.getItem('activation')));
        if (!!sim) {
          this.activationCode = sim.activationCode;
        }
      }
    });
    this.shippingConfigurationService.newSimOrder.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.newSimOrder = order;
    });
  }

  public getDescription(): string {
    const purchasedPlan = '/' + ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS;
    return `Look out for your new SIM card in the mail. Once your SIM card arrives , go to your
    <a href="${purchasedPlan}"> Purchased Plans </a> tab
    to activate your SIM with a new number or transfer your existing number to Good Mobile.`;
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setPageTitle('Purchased plans');
    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((auth) => this.userId = !!auth ? auth.uid : undefined);
    this.accountHeaderService.setPageDescription(this.getDescription());
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => {
      this.user = user;
      this.customerId = this.user?.customerId;
    });
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((pendingPlans) => {
      this.pendingPlans = pendingPlans.filter((plan) => !plan.mdn);
      if (!this.currentUserPlan && !!pendingPlans[0]) {
        this.userPlansService.selectUserPlan(this.pendingPlans[0]?.id);
        this.currentUserPlan = this.pendingPlans[0];
        this.getUserPlan(this.pendingPlans[0]?.id);
      } else {
        this.currentUserPlan = this.pendingPlans[this.planIndex];
      }
      if (!!this.currentUserPlan) {
        this.getShippingAddres();
        this.calculateTotal(this.currentUserPlan);
        if ((!!this.currentUserPlan?.planDevice && !!this.currentUserPlan?.planDevice?.fulfillmentData) || (!!this.currentUserPlan?.acpDevice && !!this.currentUserPlan?.acpDevice?.fulfillmentData)) {
          this.isInPersonDelivery = true;
        } else {
          this.isInPersonDelivery = false;
        }
      }
      if (!!this.currentUserPlan?.storePickup) {
        this.getOrderDetails();
        this.appState.loading = true;
        this.lookupsService.getAvailableStores().then(stores => {
          if (stores?.storesLocations?.length > 0) {
            this.stores = stores?.storesLocations;
          }
          this.appState.loading = false;
        }, error => {
          this.toastHelper.showAlert(error.error.errors[0].message);
          this.appState.loading = false;
        })
      } else {
        this.iccid = null;
        this.orderPicked = false;
      }
      this.isEBBPlan = !!this.currentUserPlan && !!this.currentUserPlan.basePlan && !!this.currentUserPlan.basePlan.ebb ? true : false;
      this.config.totalItems = this.pendingPlans.length;
      this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((ready) => {
        this.loadingPlan = !ready;
      });

    });
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public getUserPlan(planId?): void {
    if (!!this.currentUserPlan) {
      this.accountPaymentService.getPaymentMethod(this.currentUserPlan.paymentMethodId).then((method) => {
        this.planPaymentMethod = method;
      });
      if (!!this.currentUserPlan.phones) {
        const allPhones = Object.values(this.currentUserPlan.phones);
        this.purchasedPhone = allPhones[0];
        if (!!this.purchasedPhone) {
          this.contentful.getPhoneImgBySku('sku', this.purchasedPhone.sku).pipe(take(1)).subscribe((finishID) => {
            if (!!finishID) {
              this.contentful.getPhoneImg('finishes', finishID).pipe(take(1)).subscribe((src) => {
                if (!!src) {
                  this.phoneImageLink = src.imageUrl;
                }
              });
            }
          });
          this.appState.loading = true;
          this.accountOrderService.getOrderById(this.currentUserPlan.orderId).then((order) => {
            this.deliveredPhone = order.status === 'SHIPPED' ? true : false;
            this.appState.loading = false;
          }, (error) => {
            this.appState.loading = false;
            this.toastHelper.showWarning(`An error occured while trying to get the status of your phone's shipment status`);
          });
        }
      } else {
        this.purchasedPhone = null;
      }
    }
  }

  public goToPlans(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.PLANS_AND_FEATURES}/${PLANS_SHOP_ROUTE_URLS.NEW_PLAN}`]);
  }

  public activatePlan(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.currentUserPlan.id;
    if (!!this.activationCode) {
      params[ACTIVATION_ROUTE_URLS.PARAMS.ACTIVATION_CODE] = this.activationCode;
    }
    if (!!this.currentUserPlan && !!this.currentUserPlan.planDevice && this.currentUserPlan.planDevice.id && !this.currentUserPlan.phones) {
      const customHtml = `<p class="note">You will be activating your <b>${this.currentUserPlan.title}</b> Plan on your <b>${this.currentUserPlan.planDevice.marketingName}</b> Device</p>
      <p class="note">Do you wish to proceed or would you like to change the device?</p>`;
      this.modalHelper.showInformationMessageModal('Confirmation', '', 'Activate Plan', null,
        true, 'pending-confirmation', customHtml, true, 'Change Device', '', 'change'
      ).afterClosed().subscribe((res) => {
        if (res) {
          if (res === 'change') {
            this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
          } else {
            this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
          }
        }
      })
    } else {
      if (!!this.currentUserPlan && !!this.purchasedPhone && !!this.deliveredPhone) {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
      } else {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
      }
    }


  }

  public pageChanged(page: number): void {
    if (page > 0 && page <= this.pendingPlans.length) {
      const index = page - 1;
      this.planIndex = index;
      this.userPlansService.selectUserPlan(this.pendingPlans[index].id);
      this.currentUserPlan = this.pendingPlans[index];
      if ((!!this.currentUserPlan?.planDevice && !!this.currentUserPlan?.planDevice?.fulfillmentData) || (!!this.currentUserPlan?.acpDevice && !!this.currentUserPlan?.acpDevice?.fulfillmentData)) {
        this.isInPersonDelivery = true;
      } else {
        this.isInPersonDelivery = false;
      }
      this.isEBBPlan = !!this.currentUserPlan && !!this.currentUserPlan.basePlan && !!this.currentUserPlan.basePlan.ebb ? true : false;
      this.getShippingAddres();
      this.getUserPlan(this.pendingPlans[index].id);
      this.calculateTotal(this.currentUserPlan);
      if (!!this.currentUserPlan?.storePickup) {
        this.getOrderDetails();
      } else {
        this.iccid = null;
        this.orderPicked = false;
      }
      sessionStorage.removeItem('pendingAddress');
      let el = document.getElementById('counter');
      el.scrollIntoView();
    } else {
      console.warn('Wow you trying to get plan that does not exist in this universe :O');
    }
  }

  public editShippingAddress(): void {
    sessionStorage.setItem('pendingAddress', JSON.stringify(this.currentShippingAddress));
    let selectedAddress = {} as IFirebaseAddress;
    this.modalHelper.showShippingAddressModal('Edit Shipping Address', this.currentShippingAddress,
      'shipping-address-modal').afterClosed().subscribe((address) => {
        if (!!address) {
          this.appState.loading = true;
          this.shippingService.verifyShippingAddress(address).then((addresses) => {
            if (!!addresses) {
              const customHtml =
                `<div class="flex-container">
              <div class="pop-header">
                <p><img src='/assets/img/location.svg'><b> Current Customer Address:</b></p>
                <p class="sub-padding">` + address.address1 + ', ' + address.state + ' ' + address.postalCode + `</p>
              </div>
              <div class="pop-header">
                <p><img src='/assets/img/location.svg'><b> Verified Address from USPS</b></p>
                <p class="sub-padding"> ` + addresses[0].address1 + ', ' + addresses[0].state + ' ' + addresses[0].postalCode + `</p>
              </div>
            </div>`;
              this.appState.loading = false;
              this.modalHelper.showInformationMessageModal('Verify your shipping address', '',
                'Keep current address', null, true, 'usp-pop-up-modal', customHtml, true, 'Use verified address', '', 'verified')
                .afterClosed().subscribe((result) => {
                  if (result) {
                    if (result === 'verified') {
                      selectedAddress = addresses[0];
                      selectedAddress.name = address.name;
                    } else {
                      selectedAddress = address;
                    }
                    this.appState.loading = true;
                    this.userPlansService.updatePendingPlanShippingAddress(this.currentUserPlan.id, selectedAddress, this.currentUserPlan.orderId).then(() => {
                      this.appState.loading = false;
                      this.currentShippingAddress = selectedAddress;
                      sessionStorage.removeItem('pendingAddress');
                    }, (error) => {
                      this.appState.loading = false;
                      const storedShippingAddress = JSON.parse(sessionStorage.getItem('pendingAddress'));
                      if (!!storedShippingAddress) {
                        this.currentShippingAddress = Object.assign({}, storedShippingAddress) as IFirebaseAddress;
                        sessionStorage.removeItem('pendingAddress');
                      }
                      this.toastHelper.showAlert(error.message);
                    });
                  }
                }, (error) => {
                  this.appState.loading = false;
                });
            }
          }, (error) => {
            this.appState.loading = false;
            const customHtml2 =
              `<div class="flex-container">
              <div class="pop-header1">
                <p>There’s a chance that you may not receive your package by mail. Please re-visit the possible issues:</p>
              </div>
              <div class="pop-header2">
                <p><b> Do the city, state and ZIP code conflict?</b></p>
                <p><b> Are there any typos or misspellings?</b></p>
              </div>
            </div>`;
            this.modalHelper.showInformationMessageModal('We couldn’t validate your address', '', 'Try again', null,
              false, 'usp-pop-up-modal2', customHtml2).afterClosed().subscribe((result) => {
                this.appState.loading = false;
              });
            const storedShippingAddress = JSON.parse(sessionStorage.getItem('pendingAddress'));
            if (!!storedShippingAddress) {
              this.currentShippingAddress = Object.assign({}, storedShippingAddress) as IFirebaseAddress;
              sessionStorage.removeItem('pendingAddress');
            }
          });
        }
      });
  }

  public editDevice(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.currentUserPlan.id;
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
  }
  public domainFromUrl(url): string {
    let result;
    if (!!url) {
      let match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im);
      if (!!match) {
        result = match[1];
        match = result.match(/^[^\.]+\.(.+\..+)$/);
        if (!!match) {
          result = match[1];
        }
      }
      return result;
    }
    return '';
  }
  public goToCompatiblity(): void {
    const params = {};
    params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.currentUserPlan.id;
    this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
  }

  public goToOrderDetails(orderId): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDER_DETAILS}`, params]);
  }
  public copyLink(): void {
    this.clipboardService.copy(this.currentUserPlan.activationCode);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }

  private calculateTotal(plan: IUserPlan): void {
    /* eslint-disable max-len */
    if (!!plan.basePlan.specialPromotion && !!plan.basePlan.specialPromotion.promotionDiscount) {
      const discountAmountValue = this.currentUserPlan.basePlan.specialPromotion.promotionDiscount.split('%')[0];
      this.discountAmount = parseInt(discountAmountValue, 10);
    }
    if (!!plan.autoRenewPlan) {
      if (!!plan.basePlan.specialPromotion && !!plan.basePlan.specialPromotion.promotionDiscount) {
        this.totalUserPrice = ((plan?.basePlan?.specialPromotion?.promotionCycles * plan?.basePlan?.price) - (plan?.basePlan?.specialPromotion?.promotionCycles * 5)) * (this.discountAmount / 100);
      } else {
        this.totalUserPrice = plan?.basePlan?.price - 5;
      }
    } else {
      if (!!plan.basePlan.specialPromotion && !!plan.basePlan.specialPromotion.promotionDiscount) {
        this.totalUserPrice = (plan?.basePlan?.specialPromotion?.promotionCycles * plan?.basePlan?.price) * (this.discountAmount / 100);
      } else {
        this.totalUserPrice = plan?.basePlan?.price;
      }
    }
  }
  private getShippingAddres(): void {
    if (!!this.currentUserPlan.shippingAddress) {
      this.currentShippingAddress = this.currentUserPlan.shippingAddress;
    } else if (!!this.currentUserPlan.shippingAddressId) {
      this.userPlansService.getShippingAddressById(this.currentUserPlan.shippingAddressId).then((address) => {
        this.currentShippingAddress = address;
      });
    } else {
      this.currentShippingAddress = null;
    }
  }
  private getOrderDetails(): void {
    this.appState.loading = true;;
    this.accountOrderService.getOrderById(this.currentUserPlan?.orderId).then((order) => {
      if (!!order) {
        this.appState.loading = false;
        this.orderPicked = order.status === 'SHIPPED' ? true : false;
        if (!!order?.id && !!order?.cards && order?.cards?.length > 0) {
          this.barCodeValues = `${order?.cards[0]?.itemId}`;
          this.iccid = order?.cards[0]?.simNumber;
        }
      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
    });
  }
}
