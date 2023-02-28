/* eslint-disable @typescript-eslint/naming-convention */
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '@ztarmobile/zwp-services-auth';
import {
  AccountPaymentService, FirebaseAccountPaymentService, FirebaseUserProfileService,
  IAddress,
  ICreditCardInfo, IFirebaseAddress, IFirebasePaymentMethod, IPaymentMethod, IUser, IUserAccount,
  IUserPlan, ShippingService, UserAccountService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { filter, take, takeWhile } from 'rxjs/operators';
import { FadeInOutAnimation } from 'src/app/app.animations';
import { EMAIL_PATTERN, NAME_PATTERN, PASSWORD_PATTERN } from 'src/app/app.config';
import { AppState } from 'src/app/app.service';
import { INVISIBLE_CAPTCHA_ID} from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { CreditCardValidator } from 'src/widgets/validators/credit-card.validator';
import { InvisibleRecaptchaComponent } from '../../../widgets/invisible-recaptcha/invisible-recaptcha.component';
import { AccountHeaderService } from '../account-header.service';
import { EbbService, IEbbUser } from '@ztarmobile/zwp-service-backend-v2';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  animations: [FadeInOutAnimation],
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  public paymentInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public showShippingAddress = false;
  public cardInfo: ICreditCardInfo = {} as ICreditCardInfo;
  public selectedPayment = false;
  public selectedPaymentMethod: IFirebasePaymentMethod;
  public isValidAddress = false;
  public isValidShippingAddress = false;
  public userShippingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public userBillingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public billingAddress: IFirebaseAddress = {} as IFirebaseAddress;
  public billingAddressForm: UntypedFormGroup;
  public expirationYearRange: Array<number>;
  public paymentInfoForm: UntypedFormGroup;
  public showPaymentSection = false;
  public userEbbInfo: IEbbUser;
  public user: IUser;
  public currentUserInfo: IUser = {} as IUser;
  public selectedPlan: IUserPlan;
  public userAccount: IUserAccount;
  public isAccountLoading = false;
  public loadingPlan = true;
  public paymentMethod: IPaymentMethod;
  public paymentMethodList: Array<IFirebasePaymentMethod>;
  public shippingAddress: IFirebaseAddress;
  public shippingAddressList: Array<IFirebaseAddress>;
  public processingRequest = false;
  public userHasPendingPlans = false;
  public userHasActivePlans = false;
  public allowEditingAddresses = true;
  public showAccountPin = false;
  public showShippingAddresses = false;
  public isEditingPassword = false;
  public currentPassword: string;
  public password: string;
  public isEditingEmail = false;
  public userForm: UntypedFormGroup;
  public isActiveAccount = false;
  public showUserPassword = false;
  public PASSWORD_PATTERN = new RegExp(PASSWORD_PATTERN);
  public isEditingUserName = false;
  public processUpdateProfile = false;
  public innerWidth: any;
  public animationState = 'out';
  public namePattern = new RegExp(NAME_PATTERN);
  public isValidPassword = false;
  public firstNameValidation = true;
  public lastNameValidation = true;
  public firstName: string;
  public lastName: string;
  public activatedPlans: Array<IUserPlan>;
  public togglePaymentView = true;
  public toggleCCView = true;
  public toggleShippingView = true;
  public customHtml: string;
  public customHtml2: string;
  public recaptchaResponse: any;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public captchaValid = false;
  public isEBBPlan = false;
  public touchAddressForm = false;
  public touchShippingForm = false;
  public resetAddressForm = false;
  private alive = true;
  private cardFormCtrl: UntypedFormControl;
  private currentDate: Date;

  constructor(private userAccountService: UserAccountService,
    private fbUserProfileService: FirebaseUserProfileService,
    private formBuilder: UntypedFormBuilder,
    private appState: AppState,
    private angularFireService: AngularFireAuth,
    private userPlansService: UserPlansService,
    private accountHeaderService: AccountHeaderService,
    private toastHelper: ToastrHelperService,
    private userAuthService: UserAuthService,
    private modalHelper: ModalHelperService,
    private firebaseAccountPaymentService: FirebaseAccountPaymentService,
    private accountPaymentService: AccountPaymentService,
    private userProfileService: FirebaseUserProfileService,
    private metaService: MetaService,
    private shippingService: ShippingService,
    private ebbService: EbbService) {

    this.customHtml2 =
      `<div class="flex-container">
        <div class="pop-header1">
          <p>There’s a chance that you may not receive your package by mail. Please re-visit the possible issues:</p>
        </div>
        <div class="pop-header2">
          <p><b> Do the city, state and ZIP code conflict?</b></p>
          <p><b> Are there any typos or misspellings?</b></p>
        </div>
      </div>`;
    this.userShippingAddress = this.shippingAddress;
    this.expirationYearRange = [];
    this.currentDate = new Date();
    const year = parseInt(this.currentDate.getFullYear().toString().substr(-2), 10);
    for (let i = 0; i < 20; i++) {
      this.expirationYearRange.push(year + i);
    }
    this.cardFormCtrl = new UntypedFormControl('', [CreditCardValidator.validateCCNumber]);
    this.userShippingAddress = {} as IFirebaseAddress;
    this.userPlansService.isSelectedPlanReady.pipe(takeWhile(() => this.alive)).subscribe((userPlanReady) => {
      this.loadingPlan = !userPlanReady;
      if (userPlanReady && !!this.userPlansService.selectedUserPlan) {
        this.selectedPlan = this.userPlansService.selectedUserPlan;
        this.shippingAddress = this.userPlansService.selectedPlanShippingAddress;
        this.paymentMethod = this.userPlansService.selectedPlanPaymentMethod;
      } else {
        this.userPlansService.selectFirstUserPlan(true);
      }
    });

    this.userForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])],
    });

    this.paymentInfoForm = formBuilder.group({
      fullName: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)])],
      cardNumber: this.cardFormCtrl,
      saveCard: [''],
      cardCode: new UntypedFormControl('', Validators.compose([Validators.required,
      Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])),
      cardExpirationMonth: ['', Validators.required],
      cardExpirationYear: ['', Validators.required],
    }, { validator: this.validExpirationDate('cardExpirationMonth', 'cardExpirationYear') });

    this.billingAddressForm = formBuilder.group({
      alias: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setAccountMenuVisibility(true);
    this.accountHeaderService.setPageTitle('Account settings');
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive), filter((user) => !!user)).subscribe((user) => {
      this.user = user;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.userForm.controls.email.setValue(this.user.email);
      this.currentUserInfo = Object.assign({}, user);
      this.paymentMethodList = this.user.paymentMethods;
      this.shippingAddressList = !!this.user.shippingAddresses && this.user.shippingAddresses.length > 0 ? this.user.shippingAddresses : [];
      if (!!this.user.ebbId) {
        this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
          this.activatedPlans = plans.filter((plan) => !!plan.mdn);
          this.userHasActivePlans = (!!this.activatedPlans && this.activatedPlans.length > 0);
          if (!!this.userHasActivePlans) {
            const plan = this.activatedPlans.find((p) => !!p.basePlan.ebb);
            if (!!plan) {
              this.isEBBPlan = true;
              this.ebbService.getUserDetails(this.user.ebbId).then((result) => {
                this.userEbbInfo = result.user;
              }, (error) => {
                this.toastHelper.showAlert(error.message);
              });
            }
          }
        });
      }
    });
    this.userAccountService.selectedAccount.pipe(takeWhile(() => this.alive)).subscribe((account) => this.userAccount = account);
    this.userAccountService.selectedAccount.subscribe((account) => {
      this.isActiveAccount = !!account && !!account.mdn;
    });
   
    this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
      const pendingActivationPlans = plans.filter((plan) => !plan.mdn && !plan.basePlan.ebb);
      this.activatedPlans = plans.filter((plan) => !!plan.mdn);

      this.userHasPendingPlans = (!!pendingActivationPlans && pendingActivationPlans.length > 0);
      this.userHasActivePlans = (!!this.activatedPlans && this.activatedPlans.length > 0);
    });
    this.userAccountService.isSyncingAccount.pipe(takeWhile(() => this.alive)).subscribe((isSyncing) => this.isAccountLoading = isSyncing);
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }

  public showHideShippingAddress(): void {
    this.resetAddressForm = true;
    this.billingAddressForm.controls.alias.setValue('');
    this.billingAddressForm.controls.alias.reset();
    this.showShippingAddress = !this.showShippingAddress;
  }

  public validExpirationDate(month: string, year: string): any {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      const expMonth = group.controls[month];
      const expYear = group.controls[year];
      if (!!this.paymentInfo && !!expYear.value && !!expMonth.value) {
        this.paymentInfo.expirationDate = expMonth.value + expYear.value;
      }
      const currentYear = this.currentDate.getFullYear() % 100;
      if (!!expYear.value && !!expMonth.value) {
        if (this.currentDate.getMonth() + 1 > +expMonth.value && currentYear >= +expYear.value) {
          return {
            cardExpirationInvalid: true
          };
        }
      }
    };
  }
  public getPaymentDetails(id): string {
    if (!!this.paymentMethodList) {
      const planMethod = this.paymentMethodList.find((method) => method.id === id);
      let label = '';
      if (!!planMethod) {
        label = this.addressLabel(planMethod) + ' Ending in ' + planMethod.last4 + ', Expiration Date ' + planMethod.expirationDate.substring(0, 2) +
          '/' + planMethod.expirationDate.substring(2);
      }
      return label;
    }
  }

  public updatePassword(): void {
    this.appState.loading = true;
    this.angularFireService.signInWithEmailAndPassword(this.user.email, this.currentPassword).then((userCred) => {
      this.userAuthService.changePasswordThroughBFF(this.user.email, this.currentPassword, this.password).then((result) => {
        this.angularFireService.signInWithEmailAndPassword(this.user.email, this.password).then((auth) => {
          this.appState.loading = false;
          this.clearChangePasswordFrom();
          this.toastHelper.showSuccess('Your password was updated successfully');
        }, (error) => {
          this.toastHelper.showAlert(error.message);
          this.appState.loading = false;
        });
      }, (error) => {
        this.appState.loading = false;
        this.toastHelper.showAlert(error.message);
      });
    }, (error) => {
      this.appState.loading = false;
      if (error.code === 'auth/wrong-password') {
        this.toastHelper.showAlert('Current Password is incorrect');
      } else {
        this.toastHelper.showAlert(error.message);
      }
    });
  }
  public deEnroll(): void {
    const deEnrollCustomHtml = `To cancel your Federal Affordable Connectivity enrollment,
    please contact our customer care number <a href="tel: (800) 840-8515">(800) 840-8515</a> for assistance.`;
    this.modalHelper.showInformationMessageModal('De-Enroll Federal Affordable Connectivity ', '', 'Done', null, true, null,
      deEnrollCustomHtml, false)
      .afterClosed().subscribe((result) => {
        if (result) {
          // PRIMARY
          document.location.href = 'tel:(800) 840-8515';
        }
      }, (error) => {
        console.error('error step', error);
      });
  }
  public validatePassword(): void {
    this.isValidPassword = this.PASSWORD_PATTERN.test(this.password);
  }

  public addressLabel(address: IFirebasePaymentMethod): string {
    let addressLabel = '';
    if (!!address.brand) {
      addressLabel = address.brand;
    } else {
      if (!!address.alias) {
        addressLabel = address.alias;
      }
      if (!!address.name) {
        addressLabel = address.name;
      }

    }
    return addressLabel.toLowerCase();
  }
  public setValidAddress(isValid: boolean): void {
    /* eslint-disable max-len */
    this.isValidAddress = !!this.billingAddress.address1 && !!this.billingAddress.city && !!this.billingAddress.postalCode && !!this.billingAddress.state;
  }

  public setValidShippingAddress(isValid: boolean): void {
    // tslint:disable-next-line:max-line-length
    this.isValidShippingAddress = !!this.userShippingAddress.address1 && !!this.userShippingAddress.city && !!this.userShippingAddress.postalCode && !!this.userShippingAddress.state;
  }

  public updateData(): void {
    this.paymentInfo.cardNumber = this.paymentInfoForm.get('cardNumber').value;
    this.paymentInfo.fullName = this.paymentInfoForm.get('fullName').value;
    this.paymentInfo.cardCode = this.paymentInfoForm.get('cardCode').value;
    this.billingAddress.name = this.billingAddressForm.get('alias').value;
    this.paymentInfo = Object.assign(this.paymentInfo, this.billingAddress);
    this.paymentInfo.id = '';
  }

  public addressLookUpChanged(address: IAddress): void {
    this.billingAddress = Object.assign(this.billingAddress, address);
    this.isValidAddress = !!address.address1 && !!address.city && !!address.postalCode && !!address.state;
    this.updateData();
  }

  public shippingAddressLookUpChanged(address: IAddress): void {
    this.userShippingAddress.name = this.billingAddressForm.get('alias').value;
    this.userShippingAddress = Object.assign(this.userShippingAddress, address);
    // tslint:disable-next-line:max-line-length
    this.isValidShippingAddress = !!this.userShippingAddress.address1 && !!this.userShippingAddress.city && !!this.userShippingAddress.postalCode && !!this.userShippingAddress.state;
  }

  public savePaymentInfo(paymentInfo: IFirebaseAddress): void {
    this.billingAddressForm.markAllAsTouched();
    this.paymentInfoForm.markAllAsTouched();
    this.touchAddressForm = true;
    if (this.paymentInfoForm.valid && this.billingAddressForm.valid && this.isValidAddress) {
      setTimeout(() => {
        this.billingAddress.name = this.billingAddressForm.get('alias').value;
        this.paymentInfo.email = this.user.email;
        this.processingRequest = true;
        this.accountPaymentService.getExistPaymentMethod(this.paymentInfo).then((paymentMethod) => {
          if (!!paymentMethod && !!paymentMethod.id) {
            this.processingRequest = false;
            this.toastHelper.showWarning('This payment method already exists');
          } else {
            this.paymentInfo.address1 = AccountPaymentService.shortenAddress(this.paymentInfo.address1, 30);
            this.paymentInfo.address2 = AccountPaymentService.shortenAddress(this.paymentInfo.address2, 30);
            this.paymentInfo.city = AccountPaymentService.shortenAddress(this.paymentInfo.city, 20);
            this.appState.loading = true;
            this.accountPaymentService.addPaymentMethod(this.paymentInfo, this.recaptchaResponse).then((methodId) => {
              this.appState.loading = false;
              this.toastHelper.showSuccess('New payment method was added successfully');
              this.processingRequest = false;
              this.showPaymentSection = false;
              this.paymentInfoForm.reset();
              this.recaptchaResponse = '';
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
              this.billingAddress.name = ' ';
            }, (error) => {
              this.processingRequest = false;
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message);
              console.warn(error);
              this.recaptchaResponse = '';
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
            });
          }
        });
      });
    }
  }

  public saveAddress(): void {
    this.touchShippingForm = true;
    this.billingAddressForm.markAllAsTouched();
    if (this.billingAddressForm.valid && this.isValidShippingAddress) {
      this.userShippingAddress.name = this.billingAddressForm.get('alias').value;
      this.processingRequest = true;
      setTimeout(() => {
        this.userShippingAddress.address2 = (!!this.userShippingAddress.address2) ? this.userShippingAddress.address2 : '';
        this.fbUserProfileService.getExistShippingAddress(this.userShippingAddress).then((address) => {
          const editAlias = (!!address && this.userShippingAddress.name !== address.name);
          if (!!address && !editAlias) {
            this.processingRequest = false;
            this.toastHelper.showWarning('This shipping address already exists.');
          } else {
            this.shippingService.verifyShippingAddress(this.userShippingAddress).then((addresses) => {
              if (!!addresses) {
                this.customHtml = `
                  <div class="flex-container">
                    <div class="pop-header">
                      <p><img src='/assets/img/location.svg' alt='location'><b> Current Customer Address:</b></p>
                      <p class="sub-padding">` + this.userShippingAddress.address1 + ', ' + this.userShippingAddress.state + ' ' + this.userShippingAddress.postalCode + `</p>
                    </div>
                    <div class="pop-header">
                      <p><img src='/assets/img/location.svg' alt='location'><b> Verified Address from USPS</b></p>
                      <p class="sub-padding"> ` + addresses[0].address1 + ', ' + addresses[0].state + ' ' + addresses[0].postalCode + `</p>
                    </div>
                  </div>`;
                this.processingRequest = false;
                this.modalHelper.showInformationMessageModal('Verify your shipping address', '', 'Keep current address', null, true, 'usp-pop-up-modal',
                this.customHtml, true, 'Use verified address','', 'verified')
                  .afterClosed().subscribe((result) => {
                    if (result) {
                      // PRIMARY
                      if(result === 'verified') { 
                        addresses[0].name = this.userShippingAddress.name;
                        this.userAccountService.addShippingAddress(addresses[0]).then((newAddressId) => {
                          this.toastHelper.showSuccess('New address was added successfully.');
                          this.processingRequest = false;
                          this.showShippingAddress = false;
                          addresses[0].id = newAddressId;
                          this.shippingAddressList.push(addresses[0]);
                          this.userShippingAddress.name = ' ';
                          this.userShippingAddress = {} as IFirebaseAddress;
                          this.billingAddressForm.controls.name.setValue('');
                          this.billingAddressForm.controls.name.reset();
                          this.resetAddressForm = true;
                        }, (error) => {
                          this.processingRequest = false;
                          console.warn(error);
                          this.toastHelper.showAlert('Failed to add address.');
                        });
                      }
                      else {
                        this.userAccountService.addShippingAddress(this.userShippingAddress).then((newAddressId) => {
                          this.toastHelper.showSuccess('New address was added successfully.');
                          this.processingRequest = false;
                          this.showShippingAddress = false;
                          this.userShippingAddress.id = newAddressId;
                          this.shippingAddressList.push(this.userShippingAddress);
                          setTimeout(() => {
                            this.userShippingAddress = {} as IFirebaseAddress;
                            this.userShippingAddress.name = '';
                            this.billingAddressForm.controls.alias.setValue('');
                            this.billingAddressForm.controls.alias.reset();
                            this.resetAddressForm = true;
                          }, 500);
                        }, (error) => {
                          this.processingRequest = false;
                          console.warn(error);
                          this.resetAddressForm = true;
                          this.toastHelper.showAlert('Failed to add address.');
                        });
                      }
                    }
                  }, (error) => {
                    console.error('error step', error);
                    this.resetAddressForm = true;
                  });
              }
            }, (error) => {
              this.modalHelper.showInformationMessageModal('We couldn’t validate your address', '', 'Edit address', null,
                false, 'usp-pop-up-modal2', this.customHtml2).afterClosed().subscribe((result) => {
                  this.processingRequest = false;
                  this.resetAddressForm = true;
                });
            });
          }
        });
      });
    }
  }
  public updateUserInfo(): void {
    this.processUpdateProfile = true;
    this.appState.loading = true;
    this.user.firstName = !!this.firstNameValidation ? this.firstName : this.user.firstName;
    this.user.lastName = !!this.lastNameValidation ? this.lastName : this.user.lastName;
    this.user.email = !!this.userForm.get('email').value ? this.userForm.get('email').value : this.user.email;
    this.getConfirmPassword().then((password) => {
      this.userProfileService.bffUpdateUserProfile(this.user, password)
        .then(() => {
          this.toastHelper.showSuccess('Your profile was updated successfully');
          this.appState.loading = false;
          this.processUpdateProfile = false;
          this.isEditingUserName = false;
          this.isEditingEmail = false;
        })
        .catch((error) => {
          this.appState.loading = false;
          this.user.email = this.currentUserInfo.email;
          this.toastHelper.showAlert(error.message);
          this.processUpdateProfile = false;
        });
    });
  }
  public cancelEditNameClicked(): void {
    this.isEditingUserName = false;
    this.firstName = this.currentUserInfo.firstName;
    this.lastName = this.currentUserInfo.lastName;
    this.firstNameValidation = true;
    this.lastNameValidation = true;
  }
  public cancelEmailClicked(): void {
    this.isEditingEmail = false;
    this.userForm.controls.email.setValue(this.currentUserInfo.email);
  }
  public addPaymentMethod(): void {
    this.modalHelper.showManagePaymentModal(this.user, this.selectedPlan, false, null, 'payment-method-modal');
  }

  public editPaymentMethod(method: IFirebasePaymentMethod): void {
    const exp = method.expirationDate;
    this.modalHelper.showEditCreditCardModal(method, 'Edit payment method',
      'You can only update cvv, expiration date, and name on card. If your new card has a different 15 or 16 digit number, please exit and', 'Add a new payment card',
      'edit-payment-modal').afterClosed().subscribe((result) => {
        if (!!result) {
          if (result === 'new') {
            this.showPaymentSection = true;
          }
          else {
            let updatedPayment = {} as ICreditCardInfo;
            updatedPayment = result.paymentMethod;
            updatedPayment.cardCode = result.cardCode;
            this.appState.loading = true;
            this.accountPaymentService.editPaymentMethod(method.id, updatedPayment, this.recaptchaResponse).then((data) => {
              this.appState.loading = false;
              this.toastHelper.showSuccess('Payment method is updated successfully');
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
            }, (error) => {
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message);
              this.reCaptcha.resetReCaptcha();
              this.reCaptcha.execute();
            });
          }
        } else {
          method.expirationDate = exp;
        }
      });
  }

  public removePaymentMethod(method: IFirebasePaymentMethod): void {
    this.modalHelper.showConfirmMessageModal('Deleting Payment Method',
      `Are you sure you want to delete payment method with alias "${method.method} - ${!!method.alias ? method.alias : method.name}"`, 'Yes', 'No', 'confirm-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.appState.loading = true;
          this.userPlansService.userPlans.pipe(take(1)).subscribe((plans) => {
            this.appState.loading = false;
            const filteredPlansUsingSameMethodId = plans.filter((plan) => plan.paymentMethodId === method.id);
            if (filteredPlansUsingSameMethodId.length >= 1) {
              this.toastHelper.showWarning('This payment method is already used by other plan(s) for auto pay and can\'t be deleted');
              console.warn('Plans using same method: ', filteredPlansUsingSameMethodId);
            } else {
              const storedPaymentId = sessionStorage.getItem('payment_id');
              if (!!storedPaymentId && storedPaymentId === method.id) {
                sessionStorage.removeItem('payment_id');
              }
              this.appState.loading = true;
              this.accountPaymentService.deletePaymentMethod(method.id).then((data) => {
                this.appState.loading = false;
                if (!!this.user.duplicatePaymentId) {
                  this.user.duplicatePaymentId = this.user.duplicatePaymentId.filter((p) => !!p.id && p.id !== method.id);
                  this.user.paymentUpdateNeeded = this.user.duplicatePaymentId.length > 0 ? true : false;
                }
                if (!!data) {
                  this.toastHelper.showSuccess('Payment Method Deleted!');
                }
                this.userProfileService.updateUserProfile(this.user).then(() => {
                  this.appState.loading = false;
                }, (error) => {
                  this.appState.loading = false;
                  this.toastHelper.showAlert(error.message);
                })
              }, (error) => {
                this.appState.loading = false;
                this.toastHelper.showAlert(error.message);
              });
            }
          });
        }
      });
  }

  public editShippingMethod(addressId): void {
    const originalAddressIndex = this.shippingAddressList.findIndex((address) => address.id === addressId);
    let shippingAddress = {} as IFirebaseAddress;
    this.modalHelper.showShippingAddressModal('Edit Shipping Address', this.shippingAddressList[originalAddressIndex], 'shipping-address-modal').afterClosed().subscribe((address) => {
      if (!!address) {
        this.appState.loading = true;
        this.shippingService.verifyShippingAddress(address).then((addresses) => {
          if (!!addresses) {
            const customHtml =
              `<div class="flex-container">
              <div class="pop-header">
                <p><img src='/assets/img/location.svg' alt='location'><b> Current Customer Address:</b></p>
                <p class="sub-padding">` + address.address1 + ', ' + address.state + ' ' + address.postalCode + `</p>
              </div>
              <div class="pop-header">
                <p><img src='/assets/img/location.svg' alt='location'><b> Verified Address from USPS</b></p>
                <p class="sub-padding"> ` + addresses[0].address1 + ', ' + addresses[0].state + ' ' + addresses[0].postalCode + `</p>
              </div>
            </div>`;
            this.appState.loading = false;
            this.modalHelper.showInformationMessageModal('Verify your shipping address', '',
              'Keep current address', null, true, 'usp-pop-up-modal', customHtml, true, 'Use verified address','', 'verified')
              .afterClosed().subscribe((result) => {
                if (result) {
                  if(result === 'verified') { 
                    shippingAddress = addresses[0];
                    shippingAddress.name = address.name;
                  } else {
                    shippingAddress = address;
                  }
                  this.appState.loading = true;
                  // eslint-disable-next-line no-shadow
                  this.userAccountService.udpateShippingAddress(shippingAddress, addressId).then((result) => {
                    this.appState.loading = false;
                    this.shippingAddressList[originalAddressIndex] = shippingAddress;
                  }, (error) => {
                    this.appState.loading = false;
                    this.toastHelper.showAlert(error.message);
                    this.userPlansService.getShippingAddressById(addressId).then((response) => {
                      this.shippingAddressList[originalAddressIndex] = response;
                    });
                  });
                } 
              }, (error) => {
                this.appState.loading = false;
                this.toastHelper.showAlert(error);
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
              this.userPlansService.getShippingAddressById(addressId).then((response) => {
                this.shippingAddressList[originalAddressIndex] = response;
              });
            });
        });
      }
    });
  }

  public removeShippingAddress(address: IFirebaseAddress): void {
    this.modalHelper.showConfirmMessageModal('Deleting Address',
      `Are you sure you want to delete address with alias "${!!address.alias ? address.alias : address.name}", BEWARE this can't be undone`, 'Save', 'Cancel', 'confirm-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.appState.loading = true;
          this.userPlansService.userPlans.pipe(take(1)).subscribe((plans) => {
            this.appState.loading = false;
            const filteredPlansUsingSameShippingKey = plans.filter((plan) => plan.shippingAddressId === address.id);
            if (filteredPlansUsingSameShippingKey.length >= 1) {
              this.toastHelper.showWarning('This shipping address is used by other plan(s) and can\'t be deleted.');
              console.warn('Plans using same address: ', filteredPlansUsingSameShippingKey);
            } else {
              this.userProfileService.removeShippingAddress(address.id).then(() => {
                this.toastHelper.showSuccess('Address was removed successfully');
              });
            }
          });
        }
      });
  }

  public makeShippingAddressAsDefault(address: IFirebaseAddress): void {
    this.modalHelper.showConfirmMessageModal('Default Address',
      `Are you sure you want to make address with alias "${!!address.alias ? address.alias : address.name}" as your default shipping address?`, 'Save', 'Cancel', 'confirm-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.appState.loading = true;
          this.userProfileService.setDefaultShippingAddress(address.id).then(() => {
            this.appState.loading = false;
            this.selectedPlan.shippingAddressId = address.id;
            this.userPlansService.updateUserPlan(this.user.id, this.selectedPlan).catch((error) => console.warn(error));
          }, (error) => this.toastHelper.showAlert(error.message || error));
        }
      });
  }
  public makePaymentMethodAsDefault(method: IFirebasePaymentMethod): void {
    this.modalHelper.showConfirmMessageModal('Make Payment as default ', `Are you sure you want to make your ${method.method} - ${!!method.alias ? method.alias : method.name} as your default payment method`,
      'Save', 'Cancel', 'confirm-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.appState.loading = true;
          this.accountPaymentService.setDefaultPaymentMethod(method.id, true).then((payment) => {
            this.appState.loading = false;
            this.selectedPlan.paymentMethodId = method.id;
            this.paymentMethod = method;
            this.userPlansService.updateUserPlan(this.user.id, this.selectedPlan).then((plan) => {
              this.userPlansService.selectUserPlan(this.selectedPlan.id);
            }).catch((error) => console.warn(error));
          })
            .catch((error) => {
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message || error);
            });
        }
      });
  }
  public validateName(name?: string): void {
    if (name === 'first') {
      this.firstNameValidation = /^[A-Za-z]+[ \t]?[A-Za-z ]+?[ \t]*$/.test(this.firstName);
    } else {
      this.lastNameValidation = /^[A-Za-z]+[ \t]?[A-Za-z ]+?[ \t]*$/.test(this.lastName);
    }
  }
  public showOptions(): void {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  public updatePlanCC(plan: IUserPlan): void {
    const title = !plan.paymentMethodId ? 'Select preferred method of payment:' : 'Change preferred method of payment:';
    this.modalHelper.showSelectCreditCardModal(this.paymentMethodList, title, plan.mdn, 'Make Default Payment', 'select-cc-modal').afterClosed().subscribe((methodId) => {
      if (!!methodId) {
        this.appState.loading = true;
        this.accountPaymentService.updateAutoRenewPlan(plan.id, methodId, true).then((result) => {
          if (!!result) {
            this.appState.loading = false;
            this.toastHelper.showSuccess('Payment method is selected successfully!');
          }
        }, (error) => {
          this.appState.loading = false;
          this.toastHelper.showAlert(error.message);
        });
      }
    });
  }

  public updateUserEmail(): void {
    this.processUpdateProfile = true;
    this.appState.loading = true;
    const originalEmail = this.user.email;
    this.user.email = !!this.userForm.get('email').value ? this.userForm.get('email').value : this.user.email;
    if (this.user.email !== this.currentUserInfo.email) {
      this.getConfirmPassword().then((password) => {
        this.appState.loading = true;
        this.angularFireService.signInWithEmailAndPassword(originalEmail, password).then((userCred) => {
          setTimeout(() => {
            this.userProfileService.bffUpdateUserEmail(this.userForm.get('email').value)
              .then(() => {
                this.angularFireService.signInWithEmailAndPassword(this.userForm.get('email').value, password).then((cred) => {
                  setTimeout(() => {
                    this.toastHelper.showSuccess('Your profile was updated successfully');
                    this.appState.loading = false;
                    this.processUpdateProfile = false;
                    this.isEditingUserName = false;
                    this.isEditingEmail = false;
                  }, 1000);
                });
              }, (error) => {
                this.appState.loading = false;
                this.toastHelper.showAlert(error.message);
                this.processUpdateProfile = false;
              })
              .catch((error) => {
                this.appState.loading = false;
                this.user.email = this.currentUserInfo.email;
                this.toastHelper.showAlert(error.message);
                this.processUpdateProfile = false;
              });
          }, 1000);
        });
      });
    } else {
      this.appState.loading = false;
      this.toastHelper.showWarning('Please use a different email for the update');
    }
  }
  private clearChangePasswordFrom(): void {
    this.currentPassword = '';
    this.password = '';
    this.isEditingPassword = false;
  }

  private getConfirmPassword(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.user.email === this.currentUserInfo.email) {
        resolve('');
      } else {
        if (!!this.currentPassword && this.currentPassword.length > 0) {
          resolve(this.currentPassword);
        } else {
          this.appState.loading = false;
          this.modalHelper.showConfirmPasswordModal('Confirm password', `You have to provide your current password to change your email`, 'confirm-password-modal')
            .afterClosed().subscribe((result) => {
              resolve(result);
            }, (error) => {
              this.user.email = this.currentUserInfo.email;
            });
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}
