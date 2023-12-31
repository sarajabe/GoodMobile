import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountPaymentService, ActionsAnalyticsService, CART_TYPES, CustomizableMobilePlan, FirebaseUserProfileService, IAutoCompletePrediction, IDeviceCompatibilityV1, IFirebaseAddress, IMarketingDetails, INewPlanCartItem, MobileCustomPlansService, MobilePlanItem, OrderCheckoutService, PlacesAutocompleteService, ShippingService, UserAccountService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService, EquipmentService, IAddress, OrdersService } from '@ztarmobile/zwp-service-backend-v2';
import { PageScrollService } from 'ngx-page-scroll-core';
import { Observable, Subscription } from 'rxjs';
import { filter, take, takeWhile } from 'rxjs/operators';
import { ACP_ROUTE_URLS, ROUTE_URLS, ACCOUNT_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ACP_CALLBACK_URL, INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';

@Component({
  selector: 'app-enrollment-add-new-line',
  templateUrl: './enrollment-add-new-line.component.html',
  styleUrls: ['./enrollment-add-new-line.component.scss']
})
export class EnrollmentAddNewLineComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  @ViewChild('shippingMethodForm') shippingMethodForm: NgForm;
  @ViewChild('pickupOptionsForm') pickupOptionsForm: NgForm;
  public steps = [1, 2];
  public activeStep: number;
  public newMobileServiceFrom: FormGroup;
  public simOptionsForm: FormGroup;
  public ebbPlan: MobilePlanItem;
  public compatibileDevice: IDeviceCompatibilityV1 = {} as IDeviceCompatibilityV1;
  public addressesList: Array<IFirebaseAddress> = [];
  public shippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public marketingDetails = {} as IMarketingDetails;
  public invalidAddress = false;
  public displayedAddressModel: any;
  public address: any;
  public isValidAddress: boolean;
  public cart: CustomizableMobilePlan;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public addressWithIdSection = false;
  public addressNoOptionSection = false;
  public addressNoOptionNotVerfiedSection = false;
  public addressOption;
  public selectedShippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public captchaValid = false;
  public successCehck = false;
  public isEsim = false;
  public errorCheck = false;
  public showAllAddresses = false;
  public showShippingForm = false;
  public isAddressVerified = false;
  public isAdressAddedSuccessfully = false;
  public touchShippingForm = false;
  public planPurchased = false;
  public verifiedAddress: IFirebaseAddress;
  public applicationAddress: IFirebaseAddress;
  public addressCard = false;
  public simOption: string;
  public simOptions = [{ id: 'esim', value: 'Yes, let’s go!' }, { id: 'physical', value: 'No, send me a physical SIM' }];
  public utms;
  public barCode = false;
  public option;
  public filteredOptions: Observable<Array<IAutoCompletePrediction>>;
  public filteredOptionsSubscription: Subscription;
  public isPersonStepValidated = false;
  public isPersonOption = false;
  public resetInPersonDelivery = false;
  public planPuchasedClicked = false;
  private TRIBAL_PROGRAMS = {
    E8: "Bureau of Indian Affairs General Assistance",
    E9: "Tribal Temporary Assistance for Needy Families (Tribal TANF)",
    E10: "Food Distribution Program on Indian Reservations (FDPIR)",
    E11: "Head Start"
  };

  private tribals = [];
  private alive = true;
  private captchaResponse: string;
  private streetSearchText: string;
  isStorePickup: boolean;
  private dataCollected = false;
  private acpData: any;

  constructor(private formBuilder: FormBuilder, private placesAutoCompleteService: PlacesAutocompleteService,
    private accountPaymentService: AccountPaymentService, private appState: AppState, private modalHelper: ModalHelperService,
    public router: Router, private equipmentService: EquipmentService,
    private ebbService: EbbService, private mobilePlansService: MobileCustomPlansService,
    private userProfileService: FirebaseUserProfileService, private userPlansService: UserPlansService,
    private toastHelper: ToastrHelperService, private shippingService: ShippingService,
    private orderCheckoutService: OrderCheckoutService, private analyticsService: ActionsAnalyticsService,
    private pageScrollService: PageScrollService,
    private ordersService: OrdersService,
    private userAccountService: UserAccountService
  ) {
    this.appState.isMarketingCampaign.pipe(takeWhile(() => this.alive)).subscribe((isCampaign) => {
      this.utms = JSON.parse(sessionStorage.getItem('utms'));
      this.setMarketingObjectToCart();
    });
  }

  ngOnInit(): void {
    this.mobilePlansService.isConfigurationReady
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.ebbPlan = this.mobilePlansService.allBasePlans.find(
          (plan) => !!plan.ebb
        );
      });
    this.mobilePlansService.currentPlan
      .pipe(takeWhile(() => this.alive))
      .subscribe((plan) => {
        this.cart = plan;
      });
    this.showShippingForm = false;
    this.prepareMarketingDetails();
    const callBackUrl = `${ACP_CALLBACK_URL}/${ACP_ROUTE_URLS.BASE}`;
    this.userPlansService.userPlans
      .pipe(takeWhile(() => this.alive))
      .pipe(filter((plans) => !!plans))
      .subscribe((plans) => {
        if (!!plans) {
          setTimeout(() => {
            const userEbbPlan = plans.find((p) => p.basePlan && !!p.basePlan.ebb);
            if (!userEbbPlan) {
              this.userProfileService.userProfileObservable
                .pipe(
                  take(1),
                  filter((user) => !!user)
                )
                .subscribe((user) => {
                  if (!!user && !!user?.ebbId) {
                    this.appState.loading = true;
                    this.appState.acpAppResObs.pipe(takeWhile(() => this.alive)).subscribe(details => {
                      if (!!details && details?.status === 'COMPLETE') {
                        if (!this.dataCollected) { // we added this because when we add new shipping address the profile observable gets updated and it repeats all the API calls again so this check is to make sure not to call the APIs again
                          this.addressesList = !!user?.shippingAddresses ? user.shippingAddresses : [];
                          this.selectedShippingAddress = {} as IFirebaseAddress;
                          this.verifiedAddress = {} as IFirebaseAddress;
                          this.dataCollected = true;
                          this.ebbService.getInternalApplication(user?.customerId, user?.ebbId).then((res) => {
                            if (!!res?.data) {
                              this.acpData = res?.data;
                              if (!!this.acpData?.providerApplicationId || !this.acpData?.eligibilityCode) {
                                this.addressWithIdSection = true;
                                this.addressCard = true;
                              } else {
                                if (!!this.acpData?.eligibilityCode) {
                                  const codes = this.acpData.eligibilityCode.split(',');
                                  codes.map((code) => {
                                    if (!!this.TRIBAL_PROGRAMS[code]) {
                                      this.tribals.push(this.TRIBAL_PROGRAMS[code]);
                                    }
                                  });
                                }
                                this.addressCard = false;
                                this.validateAddressInfoFromACPApplication();
                              }
                              this.appState.loading = false;
                            }
                          },
                            (error) => {
                              this.appState.loading = false;
                            }
                          );
                        }
                      } else {
                        this.appState.loading = false;
                        this.goToAcpLanding();
                      }
                    });
                  } else {
                    this.goToAcpLanding();
                  }
                });
            }
            else if (!!userEbbPlan && !this.planPuchasedClicked) {
              this.goToAcpLanding();
            }
          }, 200);
        }
      });
    this.activeStep = 1;
    this.newMobileServiceFrom = this.formBuilder.group({
      imei: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(18),
        ]),
      ],
      address: [
        "",
        Validators.required
      ],
    });
    this.simOptionsForm = new FormGroup({
      option: new UntypedFormControl('', Validators.required)
    });
    setInterval(() => {
      this.reCaptcha?.execute(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
    }, 1.8 * 60 * 1000);
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.filteredOptionsSubscription?.unsubscribe();
  }
  public showWhatIsIMEI(): void {
    this.modalHelper.showInformationMessageModal('3 Ways to find your MEID or IMEI', '', 'Got it', null,
      true, 'compatibility-help-modal-IME',
      `<div class="description-content">
    <div class="intro">
    Your IMEI number is needed if you want to unlock your device to use
    on other networks. Here’s 3 ways how to find it on your phone: </div>
       <div class="note-dial"> <b>Enter *#06# on your phone’s dial pad.</b></div>
       <b>OR</b>
       <div class="menu-margins">
       <b>Check your phone’s settings menu:</b>
       <p class="p-nowrap">Android: Go to Settings > About device > Status</p>
       <p class="p-nowrap">iPhone: Go to Settings > General > About</p>
       <p class="p-nowrap">Windows Phone: Go to Settings > About > More info</p>
       </div>
       <b>OR</b>
       <div class="menu-margins">
       <p class="p-nowrap"><b>Check the sticker under your device’s battery.</b></p>
       <p class="p-nowrap"> Note: It may be listed as “DEC.” </p> </div>
      </div>
        `);
  }

  public selectPersonOption(event): void {
    if (!!event) {
      this.option = event;
    }
  }

  public validatePersonStep(event): void {
    this.isPersonStepValidated = event;
  }

  public pickupOptionChanged(): void {
    if (this.option === 'store') {
      this.resetAddressFields();
      this.resetInPersonDelivery = true;
    } else if (this.option === 'home') {
      this.barCode = false;
      this.resetInPersonDelivery = true;
      setTimeout(() => {
        this.validateAddressInfoFromACPApplication();
      }, 200);
    } else if (this.option === 'person') {
      this.barCode = false;
      this.resetAddressFields();
    }
  }
  private resetAddressFields(): void {
    this.selectedShippingAddress = null;
    this.shippingAddress = {} as IFirebaseAddress;
    this.addressCard = false;
    this.selectedShippingAddress = {} as IFirebaseAddress;
    this.isAddressVerified = false;
    this.showShippingForm = false;
    this.addressOption = '';
  }
  public optionChanged(): void {
    this.addressCard = false;
    this.showShippingForm = false;
    this.isAddressVerified = true;
    this.isAdressAddedSuccessfully = false;
    this.shippingAddress = {} as IFirebaseAddress;
    this.selectedShippingAddress = {} as IFirebaseAddress;
  }
  public changedAddress(): void {
    this.findPlace(this.newMobileServiceFrom.controls.address.value);
    this.displayedAddressModel = null;
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public goToAcpSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`]);
  }
  public goToPendingActivation(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS}`]);
  }
  public goToStep2(): void {
    if (!!this.isEsim) {
      this.simOptionsForm.markAllAsTouched();
      if (this.simOptionsForm.valid) {
        if (this.simOption === 'esim') {
          this.modalHelper.showConfirmMessageModal(
            `Confirmation`, 'You will be recieving an eSIM for your device instead of a physical SIM, would you like to proceed? ',
            'Yes', 'No', 'auto-renew-modal')
            .afterClosed().subscribe((result) => {
              if (result) {
                this.purchasePlan(true);
              }
            }, (error) => {
              console.error('error', error);
              this.toastHelper.showAlert(error.message);
              this.appState.loading = false;
            });
        } else if (this.simOption === 'physical') {
          this.activeStep = 2;
        }
      }
    } else {
      this.activeStep = 2;
    }
  }
  public changeAddressOption(): void {
    this.addressOption = 'another';
    this.addressCard = !this.addressCard;
    this.isAddressVerified = false;
    this.isAdressAddedSuccessfully = false;
    this.selectedShippingAddress = {} as IFirebaseAddress;
  }
  public purchasePlan(isEsim?): void {
    if (!!this.newMobileServiceFrom.valid && (!isEsim && !!this.option && ((this.option === 'home' && !!this.isAddressVerified) || (this.option === 'store' && !!this.barCode) || (this.option === 'person' && !!this.isPersonStepValidated)) || !!isEsim)) {
      this.clearCart();
      this.isStorePickup = this.option === 'store' ? true : false;
      this.isPersonOption = this.option === 'person' ? true : false;
      this.mobilePlansService.setActivePlanId("");
      if ((!isEsim && !!this.option && this.option !== 'person') || !!this.isEsim) {
        this.mobilePlansService.setPlanDevice(this.compatibileDevice);
      }
      this.mobilePlansService.setPlanExpectedDevice(null);
      this.mobilePlansService.setBasePlan(this.ebbPlan);
      this.mobilePlansService.setCartType(CART_TYPES.NEW_PLAN);
      this.mobilePlansService.setMarketingObject(this.marketingDetails);
      if (!!isEsim) {
        this.mobilePlansService.seteSIM(true);
        this.mobilePlansService.setQrScanned(false);
      }
      if (!!this.isStorePickup) {
        this.mobilePlansService.setStorePickup(this.isStorePickup);
      }
      setTimeout(() => {
        let data = {} as any;
        if (!!this.option && this.option === 'home' && !isEsim) {
          data = {
            autoRenewPlan: true,
            orderShipMethod: "usps_first_class_mail/letter",
            shippingAddress: { id: !!this.addressNoOptionSection && this.addressOption === 'mail' ? this.verifiedAddress?.id : this.selectedShippingAddress?.id },
            haseSIM: false,
            deliveryMethod: 'homeDelivery'
          };
        } else {
          data = {
            autoRenewPlan: true,
            haseSIM: !!isEsim ? true : false,
            deliveryMethod: !isEsim ? (!!this.isStorePickup ? 'storePickup' : 'inPersonDelivery'): null
          };
        }
        this.appState.loading = true;
        this.ordersService.placeOrder(data).then((result) => {
          if (!!result) {
            this.appState.loading = false;
            const data: any = {
              event: 'ACP_new_purchase',
              category: 'ACP Activation',
              label: 'ACP Step 5',
              action: 'new ACP purchase',
            }
            if (!!this.tribals && this.tribals.length > 0) {
              data.tribalPrograms = this.tribals;
            }
            if (!!this.marketingDetails && !!this.marketingDetails.utm_medium) {
              data.marketingDetails = this.marketingDetails;
            }
            this.analyticsService.trackACPEvent(data);
            this.analyticsService.trackSucceededCheckout(result.orderId, this.cart, 0, 0, 0, true, true, { id: !!this.compatibileDevice.skuNumber ? this.compatibileDevice.skuNumber : "SIMGWLTMO4GLTE", price: 5 });
            this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((data) => {
              if (!!data && data.activeCampaign) {
                data.activeCampaign = {} as IMarketingDetails;
                this.userProfileService.updateUserProfile(data);
              }
            });
            this.planPuchasedClicked = true;
            this.appState.clearSessionStorage();
            this.planPurchased = true;
            const params = {};
            params[ROUTE_URLS.PARAMS.USER_ORDER_ID] = result?.orderId;
            params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = result?.userPlanId;
            params[ROUTE_URLS.PARAMS.SELECTED_PLAN] = result?.userPlanId;
            this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CHECKOUT_RESULTS}`, params]);
            window.scroll(0, 0);
          }
        },
          (error) => {
            this.planPuchasedClicked = true;
            this.toastHelper.showAlert(error.message);
            this.appState.loading = false;
            this.planPurchased = false;
            this.mobilePlansService.clearUserCart();
          }).catch(error => {
            this.planPuchasedClicked = true;
            this.toastHelper.showAlert(error.message);
            this.appState.loading = false;
            this.planPurchased = false;
            this.mobilePlansService.clearUserCart();
          });
      }, 500);
    }
  }

  public onOptionChange(): void {
    this.simOption = this.simOptionsForm.get('option').value;
  }

  public checkDevice(): void {
    this.newMobileServiceFrom.markAllAsTouched();
    if (!!this.newMobileServiceFrom.valid && !!this.displayedAddressModel) {
      const equipment = this.newMobileServiceFrom.controls.imei.value;
      this.appState.loading = true;
      this.equipmentService.checkDeviceCompatibilityV2(this.captchaResponse, this.displayedAddressModel?.postalCode,
        this.displayedAddressModel?.address1, this.displayedAddressModel?.city,
        this.displayedAddressModel?.state, this.displayedAddressModel?.address2, equipment).then(res => {
          if (!!res) {
            this.appState.loading = false;
            if (!!res?.tmo?.covered || !!res?.att?.covered) {
              this.compatibileDevice.manufacturer = res?.details?.make;
              this.compatibileDevice.marketingName = res?.details?.name;
              this.compatibileDevice.address1 = this.displayedAddressModel?.address1;
              this.compatibileDevice.address2 = this.displayedAddressModel?.address2;
              this.compatibileDevice.city = this.displayedAddressModel?.city;
              this.compatibileDevice.state = this.displayedAddressModel?.state;
              this.compatibileDevice.postalCode = this.displayedAddressModel?.postalCode;
              this.compatibileDevice.id = res?.details?.serialNumber;
              if (!!res?.details?.eSimOnly) {
                this.successCehck = false;
                this.errorCheck = true;
              } else {
                if (!!res?.tmo?.covered) {
                  this.compatibileDevice.skuIdentifier = res?.tmo?.details?.skuIdentifier;
                  this.compatibileDevice.skuNumber = res?.tmo?.details?.skuNumber;
                  this.compatibileDevice.network = 'tmo';
                } else if (!!res?.att?.covered) {
                  this.compatibileDevice.skuIdentifier = res?.att?.details?.skuIdentifier;
                  this.compatibileDevice.skuNumber = res?.att?.details?.skuNumber;
                  this.compatibileDevice.network = 'att';
                }
                this.successCehck = true;
                this.mobilePlansService.setPlanDevice(this.compatibileDevice);
                this.mobilePlansService.setPlanExpectedDevice(null);
              }
            } else {
              this.successCehck = false;
              this.errorCheck = true;
            }
          }
        }, (error) => {
          this.appState.loading = false;
          this.successCehck = false;
          this.errorCheck = true;
        });
    }
  }

  public tryAgain(): void {
    this.successCehck = false;
    this.errorCheck = false;
    this.newMobileServiceFrom.reset();
    this.reCaptcha.resetReCaptcha();
    this.reCaptcha.execute();
  }
  public cancel(): void {
    this.router.navigate([`${ROUTE_URLS.ACP}`]);
  }
  public findPlace(keyword: ''): Observable<Array<IAutoCompletePrediction>> {
    this.filteredOptions = this.placesAutoCompleteService.findAddress(keyword);
    this.filteredOptionsSubscription = this.filteredOptions.subscribe();
    return this.filteredOptions;
  }
  public addressDetails(eventFire: IAutoCompletePrediction): void {
    if (!!eventFire && !!this.newMobileServiceFrom.controls.address?.value && this.newMobileServiceFrom.controls.address?.value?.main_text) {
      const event = this.newMobileServiceFrom.controls.address?.value;
      if (!!event.place_id) {
        this.appState.loading = true;
        this.invalidAddress = false;
        //this is a default value until address have the value from api
        this.newMobileServiceFrom.controls.address.setValue(event?.main_text);
        this.placesAutoCompleteService
          .findDetailedAddressFields(event.place_id)
          .subscribe(
            (place) => {
              this.streetSearchText =
                !!place.address1 && place.address1.length > 0
                  ? place.address1
                  : null;
              this.displayedAddressModel = this.getAddressValues(
                place,
                event.main_text
              );
              this.address = `${this.displayedAddressModel?.address1}, ${this.displayedAddressModel?.city
                }, ${this.displayedAddressModel?.state} ${this.displayedAddressModel?.postalCode
                  ? this.displayedAddressModel?.postalCode
                  : ''
                }`;
              this.newMobileServiceFrom.controls.address.setValue(this.address);
              this.appState.loading = false;
            },
            (error) => {
              this.appState.loading = false;
              console.warn(
                `Google can't find details for place: ${event.place_id}`,
                error
              );
            }
          );
      } else {
        this.invalidAddress = true;
        console.warn(`Google can't find place: ${event.main_text}`);
      }
    } else {
      this.invalidAddress = true;
    }
  }

  public addAddress(): void {
    this.shippingMethodForm.form.markAllAsTouched();
    this.touchShippingForm = true;
    if (!!this.shippingMethodForm.valid && !!this.isValidAddress) {
      this.appState.loading = true;
      const address = this.checkExsitingAddresses(this.shippingAddress);
      if (!!address) {
        this.toastHelper.showWarning("Shipping Address already exists!");
        this.selectedShippingAddress = this.addressesList.find(
          (add) => add.id === address.id
        );
        this.shippingAddress = {} as IFirebaseAddress;
        this.showShippingForm = false;
        this.appState.loading = false;
        this.isAddressVerified = true;
      } else {
        this.shippingService.verifyShippingAddress(this.shippingAddress).then(
          (addresses) => {
            this.appState.loading = false;
            if (!!addresses) {
              const name = this.shippingAddress?.name;
              this.shippingAddress = addresses[0];
              this.shippingAddress.name = name;
              this.shippingAddress.alias = name;
              this.isAddressVerified = true;
              this.userProfileService
                .addShippingAddress(this.shippingAddress)
                .then((newAddress) => {
                  newAddress.name = this.shippingAddress.name;
                  this.addressesList.unshift(newAddress);
                  this.selectedShippingAddress = newAddress;
                  this.addressCard = true;
                  this.verifiedAddress = this.selectedShippingAddress;
                  this.showShippingForm = false;
                  this.shippingAddress = {} as IFirebaseAddress;
                  this.isAdressAddedSuccessfully = true;
                  this.pageScrollService.scroll({
                    document,
                    scrollTarget: `#addressDetails`,
                    scrollOffset: 100,
                    speed: 150
                  });
                });
            }
          },
          (error) => {
            this.isAddressVerified = false;
            this.isAdressAddedSuccessfully = false;
            const customHtml = `
        <div class="flex-container">
          <div class="pop-header1">
            <p>Please revisit the possible issues:</p>
          </div>
          <ul class="pop-header2">
              <li>Are there and typos or misspellings?</li>
              <li>Does the city, state and Zip Code conflict?</li>
            </ul>
        </div>`;
            this.appState.loading = false;
            this.modalHelper.showInformationMessageModal(
              "We couldn’t validate your address",
              "",
              "Back",
              null,
              false,
              "usp-pop-up-modal3",
              customHtml
            );
          }
        );
      }
    }
  }

  public addressLookUpChanged(address: IAddress): void {
    this.shippingAddress = Object.assign(this.shippingAddress, address);
  }

  public setValidAddress(isValid: boolean): void {
    this.isValidAddress = isValid;
  }

  private validateAddressInfoFromACPApplication() {
    const acpData = this.acpData;
    if (!!acpData?.user?.address?.mail) {
      const mailing = acpData?.user?.address?.mail;
      this.appState.loading = true;
      const shipping = {
        // fixed format in address1 so verify API accept and verify it
        address1: mailing?.address1?.includes(',') ? mailing?.address1?.split(',')[0] : mailing?.address1,
        address2: mailing?.address2,
        postalCode: mailing?.zipCode,
        city: mailing?.city,
        state: mailing?.state,
        name: mailing?.name || acpData?.user?.firstName,
        country: "United States",
      };
      if (!this.verifiedAddress.address1) {
        this.shippingService.verifyShippingAddress(shipping).then(
          (result) => {
            if (!!result) {
              this.applicationAddress = result[0];
              this.applicationAddress.name = shipping?.name;
              this.applicationAddress.alias = shipping?.name;
              this.verifiedAddress = this.applicationAddress;
              this.isAddressVerified = true;
              this.addressNoOptionSection = true;
              this.addressNoOptionNotVerfiedSection = false;
              this.addressOption = 'mail';
              if(!this.verifiedAddress?.id) {
                this.userAccountService.addShippingAddress(this.verifiedAddress).then((newAddressId) => {
                  this.verifiedAddress.id = newAddressId;
                  this.appState.loading = false;
                }, (error) => {
                  this.appState.loading = false;
                  this.toastHelper.showAlert(error.message);
                });
              }
            }
          },
          (error) => {
            this.appState.loading = false;
            this.isAddressVerified = false;
            this.addressNoOptionSection = false;
            this.addressNoOptionNotVerfiedSection = true;
            this.addressCard = true;
          }
        );
      } else {
        // We have to add this vrfied address to user profile for tracking and to get an ID for it
        this.appState.loading = true;
        if(!this.verifiedAddress?.id) {
        this.userAccountService.addShippingAddress(this.verifiedAddress).then((newAddressId) => {
          this.verifiedAddress.id = newAddressId;

          this.appState.loading = false;
        }, (error) => {
          this.appState.loading = false;
          this.toastHelper.showAlert(error.message);
        });
      }
        this.isAddressVerified = true;
        this.addressNoOptionSection = true;
        this.addressNoOptionNotVerfiedSection = false;
        this.addressOption = 'mail';
        this.appState.loading = false;
      }
    } else {
      this.addressWithIdSection = true;
      this.appState.loading = false;
    }
  }

  public clearCart(): void {
    sessionStorage.removeItem("useFromBalance");
    sessionStorage.removeItem("useFromReward");
    sessionStorage.removeItem("removeFromCart");
    this.mobilePlansService.setSimPurchaseQuantity(0);
    this.mobilePlansService.setAddonsList(null, this.cart);
    this.appState.clearSessionStorage();
  }
  private checkExsitingAddresses(address): IFirebaseAddress {
    if (!!this.addressesList && this.addressesList?.length > 0) {
      return this.addressesList.find((existingAddress) =>
        this.compareAddressInfo(address, existingAddress)
      );
    }
    return null;
  }
  private compareAddressInfo(enteredAddress: any, existingAddress: IAddress): boolean {
    let isAddress2Equal: boolean;
    if (enteredAddress && enteredAddress.address1 && enteredAddress.address1?.main_text) {
      enteredAddress.address1 = enteredAddress.address1?.main_text;
    }
    if ((!!enteredAddress.address2 && !!existingAddress.address2 && enteredAddress.address2.trim() === existingAddress.address2.trim())
      // eslint-disable-next-line @typescript-eslint/quotes
      || (enteredAddress.address2 === "" && existingAddress.address2 === "") || (!enteredAddress.address2 && !existingAddress.address2)) {
      isAddress2Equal = true;
    } else {
      isAddress2Equal = false;
    }
    return enteredAddress?.country === existingAddress?.country &&
      enteredAddress?.address1?.toLowerCase() === existingAddress?.address1?.toLowerCase() &&
      isAddress2Equal &&
      enteredAddress?.state?.toLowerCase() === existingAddress?.state?.toLowerCase() &&
      enteredAddress?.city?.toLowerCase() === existingAddress?.city?.toLowerCase() &&
      enteredAddress?.postalCode === existingAddress?.postalCode;
  }
  private getAddressValues(
    placeInfo: any,
    searchTerms?: string
  ): IFirebaseAddress {
    let address: IFirebaseAddress = {
      name: !!this.displayedAddressModel?.name
        ? this.displayedAddressModel?.name
        : this.displayedAddressModel?.alias,
      address1: placeInfo.address1,
      address2: placeInfo.address2,
      state: placeInfo.state ? placeInfo.state.toUpperCase() : placeInfo.state,
      city: placeInfo.city,
      country: placeInfo.country || 'United States',
      postalCode: placeInfo.postalCode,
    } as IFirebaseAddress;

    if (!!this.displayedAddressModel?.id) {
      address.id = this.displayedAddressModel?.id;
      address.isDefault = this.displayedAddressModel?.isDefault;
    }
    if (!!searchTerms && typeof searchTerms === 'string') {
      if (!!this.streetSearchText) {
        if (!searchTerms.match(this.streetSearchText)) {
          this.streetSearchText = null;
        }
      }
      address.address1 = !!this.streetSearchText
        ? address.address1
        : searchTerms.trim();
    }
    if (!!address && address.address1)
      address.address1 = AccountPaymentService.shortenAddress(address.address1, 30);

    // Clean Out empty values,
    address = this.appState.removeEmptyValues(address);
    return Object.assign({}, address);
  }
  private goToAcpLanding(): void {
    this.router.navigate([`${ROUTE_URLS.ACP}`]);
  }
  private setMarketingObjectToCart(): void {
    if (!!this.utms) {
      const marketingObject: IMarketingDetails = {
        timestamp: new Date().toISOString(), utm_campaign: this.utms.utm_campaign,
        utm_medium: this.utms.utm_medium, utm_source: this.utms.utm_source, attributes: []
      };
      if (!!this.utms.agentID || !!this.utms.agentid) {
        marketingObject.attributes.push({ name: 'agentID', value: !!this.utms.agentID ? this.utms.agentID : this.utms.agentid });
      }
      marketingObject.attributes.push({ name: 'vendorID', value: !!this.utms && !!this.utms.vendorID ? this.utms.vendorID : 'g2g' });
      this.mobilePlansService.setMarketingObject(marketingObject);
    }
  }
  private prepareMarketingDetails(): void {
    const utms = JSON.parse(sessionStorage.getItem('utms'));
    this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((data) => {
      if (!!data) {
        const savedActiveCampaign = !!data.activeCampaign ? data.activeCampaign : {} as IMarketingDetails;
        if (!!utms) {
          const sessionMarketingDetails = this.appState.setMarketingObject(utms);
          if (sessionMarketingDetails.utm_campaign === savedActiveCampaign.utm_campaign && sessionMarketingDetails.utm_medium === savedActiveCampaign.utm_medium
            && sessionMarketingDetails.utm_source === savedActiveCampaign.utm_source) {
            this.marketingDetails = this.appState.setMarketingObject(savedActiveCampaign);
          } else {
            this.marketingDetails = this.appState.setMarketingObject(sessionMarketingDetails);;
            data.activeCampaign = this.marketingDetails;
            if (!!data.campaignsHistory) {
              data.campaignsHistory.push(this.marketingDetails)
            } else {
              data.campaignsHistory = [];
              data.campaignsHistory.push(this.marketingDetails)
            }
            this.userProfileService.updateUserProfile(data);
          }
        } else {
          this.marketingDetails = this.appState.setMarketingObject(savedActiveCampaign);
        }
      }
    });
  }
}
