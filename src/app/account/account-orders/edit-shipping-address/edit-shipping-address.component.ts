import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IFirebaseAddress, ShippingService, OrderInfo, UserOrdersService, FirebaseUserProfileService, IAddress, UserAccountService, IUser } from '@ztarmobile/zwp-service-backend';
import { take, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../../account-header.service';
import * as _ from "lodash";

@Component({
  selector: 'app-edit-shipping-address',
  templateUrl: './edit-shipping-address.component.html',
  styleUrls: ['./edit-shipping-address.component.scss']
})
export class EditShippingAddressComponent implements OnInit, OnDestroy {
  @Output() showEditShippingAddress: EventEmitter<boolean> = new EventEmitter<boolean>();
  public orderInfo: OrderInfo;
  public address1: string;
  public shippingName: string;
  public city: string;
  public state: string;
  public postalCode: string;
  public currentShippingAddress: IFirebaseAddress;
  public addressUpdated = false;
  public orderId = '';
  public showContactForm = false;
  public addressesList: Array<IFirebaseAddress>;
  public showAllAddresses = false;
  public showNewAddress = false;
  public selectedAddress: IFirebaseAddress;
  public newAddress = {} as IFirebaseAddress;
  public newAddressName: string;
  public isValidAddress = false;
  public nameRequired = false;
  public touchShippimgForm = false;
  public canUpdateAddress = true;
  public editedAddress = {} as IFirebaseAddress;
  public isEditAddress = false;
  public isCurrent = false;
  public showErrorMessage = false;
  public resetAddressForm = false;
  public setSticky = false;
  private alive = true;

  constructor(private modalHelper: ModalHelperService,
              private appState: AppState,
              private shippingService: ShippingService,
              private accountOrderService: UserOrdersService,
              private router: Router,
              private userAccountService: UserAccountService,
              private userProfileService: FirebaseUserProfileService,
              private route: ActivatedRoute,
              private accountHeaderService: AccountHeaderService,
              private toastHelper: ToastrHelperService) { 
    this.accountHeaderService.setRemovePadding(true);
    this.route.params.subscribe(params => {
      if (!!params) {
        this.orderId = params.id;
      }
    });
    this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => {
      if (!!user) {
        this.addressesList = user.shippingAddresses.filter((address) => !!address.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.accountHeaderService.setRemovePadding(false);
    this.alive = false;
  }
  ngOnInit(): void {
    this.accountHeaderService.orderInfo.pipe(takeWhile(() => this.alive)).subscribe((order) => {
      this.orderInfo = order;
      if (!!this.orderInfo.shippingInfo && !!this.orderInfo.shippingInfo.shippingAddress && this.orderInfo.status === 'PENDING') {
        this.shippingName = this.orderInfo.shippingInfo.shippingAddress.shippingName;
        this.address1 = this.orderInfo.shippingInfo.shippingAddress.address1;
        this.city = this.orderInfo.shippingInfo.shippingAddress.city;
        this.state = this.orderInfo.shippingInfo.shippingAddress.state;
        this.postalCode = this.orderInfo.shippingInfo.shippingAddress.postalCode;
        this.canUpdateAddress = true;
      } else {
        this.canUpdateAddress = false;
      }
    });
    if (!this.orderInfo) {
      this.getOrderDetails(this.orderId);
    }
  }
  public editShippingAddress(): void {
    this.touchShippimgForm = true;
    this.nameRequired = !!this.showNewAddress && !this.newAddressName ? true : false;
    if (!!this.showNewAddress && !!this.isValidAddress && !this.nameRequired) {
      let selectedAddress = {} as IFirebaseAddress;
      this.appState.loading = true;
      this.shippingService.verifyShippingAddress(this.newAddress).then((addresses) => {
        if (!!addresses) {
          const customHtml =
            `<div class="flex-container">
          <div class="pop-header">
            <p><img src='/assets/img/location.svg'><b> Current Customer Address:</b></p>
            <p class="sub-padding">` + this.newAddress.address1 + ', ' + this.newAddress.state + ' ' + this.newAddress.postalCode + `</p>
          </div>
          <div class="pop-header">
            <p><img src='/assets/img/location.svg'><b> Verified Address from USPS</b></p>
            <p class="sub-padding"> ` + addresses[0].address1 + ', ' + addresses[0].state + ' ' + addresses[0].postalCode + `</p>
          </div>
        </div>`;
          this.appState.loading = false;
          this.modalHelper.showInformationMessageModal('Verify your shipping address', '',
          'Keep current address', null, true, 'usp-pop-up-modal', customHtml, true, 'Use verified address',
          '', 'verified'
          ).afterClosed().subscribe((result) => {
              if (result) {
                if(result === 'verified') {
                  selectedAddress = addresses[0];
                  selectedAddress.name = this.newAddressName;
                } else {
                  selectedAddress = this.newAddress;
                  selectedAddress.name = this.newAddressName;
                }
                this.addressesList.unshift(selectedAddress);
                this.toggleNewAddress();
                this.selectedAddress = selectedAddress;
                this.appState.loading = true;
                this.userAccountService.addShippingAddress(selectedAddress).then((newAddressId) => {
                  selectedAddress.id = newAddressId;
                 
                  this.appState.loading = false;
                }, (error) => {
                  this.appState.loading = false;
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
      });
    }
  }
  public cancel(): void {
    this.modalHelper.showConfirmMessageModal('Are you sure you want to cancel?', 'Shipping address has not been updated yet. Click "No" to stay on current page', 'Yes', 'No', 'clean-cart-modal')
    .afterClosed().subscribe((res) => {
      if (!!res) {
       this.goToReportIssue()
      }
    });
  }

  public goToReportIssue(): void {
    const params = {};
    params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.REPORT_ISSUE}`, params]);
  }

  public toggleNewAddress(): void{
    this.showNewAddress = !this.showNewAddress;
    this.selectedAddress = {} as IFirebaseAddress;
    this.newAddress = {} as IFirebaseAddress;
    this.newAddressName = '';
  }

  public updateSelectedAddress(): void {
    this.showErrorMessage = false;
    if (!!this.showNewAddress) {
      this.resetAddressForm = true;
      this.nameRequired = false;
      this.newAddressName = '';
    }
    this.showNewAddress = false;
  }

  public setValidAddress(isValid: boolean, isEdit?: boolean): void {
    if (!!isEdit) {
      this.isValidAddress = isValid;
    } else {
      this.isValidAddress = !!this.newAddress && !!this.newAddress.address1 && !!this.newAddress.city && !!this.newAddress.postalCode && !!this.newAddress.state;
    }
  }
  public editAddress(address, isCurrent): void {
    this.shippingName = !!isCurrent ? this.orderInfo.shippingInfo.shippingAddress.shippingName : (!!address.name ? address.name : address.alias);
    this.isEditAddress = true;
    this.isCurrent = isCurrent;
    let value = JSON.stringify(address);
    this.editedAddress = _.cloneDeep(address);
  }

  public updateAddress(): void {
    if (!this.addressUpdated) {
      if (!!this.isEditAddress) {
        this.touchShippimgForm = true;
        this.nameRequired = !!this.shippingName ? false : true;
        if (!!this.isValidAddress && !this.nameRequired) {
          let selectedAddress = {} as IFirebaseAddress;
          this.appState.loading = true;
          this.shippingService.verifyShippingAddress(this.editedAddress).then((addresses) => {
            if (!!addresses) {
              const customHtml =
                `<div class="flex-container">
              <div class="pop-header">
                <p><img src='/assets/img/location.svg'><b> Current Customer Address:</b></p>
                <p class="sub-padding">` + this.editedAddress.address1 + ', ' + this.editedAddress.state + ' ' + this.editedAddress.postalCode + `</p>
              </div>
              <div class="pop-header">
                <p><img src='/assets/img/location.svg'><b> Verified Address from USPS</b></p>
                <p class="sub-padding"> ` + addresses[0].address1 + ', ' + addresses[0].state + ' ' + addresses[0].postalCode + `</p>
              </div>
            </div>`;
              this.appState.loading = false;
              this.modalHelper.showInformationMessageModal('Verify your shipping address', '',
              'Keep current address', null, true, 'usp-pop-up-modal', customHtml, true, 'Use verified address',
              '', 'verified')
                .afterClosed().subscribe((result) => {
                  if (result) {
                    if(result === 'verified') { 
                      selectedAddress = addresses[0];
                      selectedAddress.name = this.shippingName;
                    } else {
                      selectedAddress = this.editedAddress;
                      selectedAddress.name = this.shippingName;
                    }
                    this.updateOrderAddrss(selectedAddress);
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
          });
        }
      } else {
        if (!!this.selectedAddress && !!this.selectedAddress.id) {
          this.updateOrderAddrss(this.selectedAddress);
          this.showErrorMessage = false;
        } else {
          this.showErrorMessage = true;
          let el = document.getElementById('title');
          el.scrollIntoView();
        }
      }
    } else {
      const params = {};
      params[ACCOUNT_ROUTE_URLS.PARAMS.ORDER_ID] = this.orderId;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDER_DETAILS}`, params]);
    }
  }
  public addressLookUpChanged(address: IAddress, isEdit?: boolean): void {
    if (!!isEdit) {
      let value = JSON.stringify(address);
      this.editedAddress = Object.assign(this.editedAddress, JSON.parse(value));
      this.appState.removeEmptyValues(this.editedAddress);
    } else {
      this.showErrorMessage = false;
      this.newAddress = Object.assign(this.newAddress, address);
      this.isValidAddress = !!this.newAddress.address1 && !!this.newAddress.city && !!this.newAddress.postalCode && !!this.newAddress.state && !this.nameRequired;
      this.appState.removeEmptyValues(this.newAddress);
    }
  }

  private updateOrderAddrss(selectedAddress): void {
    this.appState.loading = true;
    selectedAddress.shippingName = !!this.isEditAddress ? selectedAddress.shippingName : (!!selectedAddress.name ? selectedAddress.name : selectedAddress.alias);
    this.accountOrderService.updateOrderShippingAddress(this.orderId, selectedAddress).then(() => {
      this.appState.loading = false;
      this.currentShippingAddress = selectedAddress;
      this.isEditAddress = false;
      this.addressUpdated = true;
      let el = document.getElementById('title');
      el.scrollIntoView();
    }, (error) => {
      this.appState.loading = false;
      this.currentShippingAddress = {} as IFirebaseAddress;
      this.addressUpdated = false;
      this.toastHelper.showAlert(error.message);
    });
  }
  private getOrderDetails(orderId): void {
    this.appState.loading = true;
    this.accountOrderService.getOrderById(orderId).then((order) => {
      if (!!order) {
        this.orderInfo = order;
        this.accountHeaderService.setOrderInfo(this.orderInfo);
        if (!!this.orderInfo.shippingInfo && !!this.orderInfo.shippingInfo.shippingAddress && this.orderInfo.status === 'PENDING') {
          this.shippingName = this.orderInfo.shippingInfo.shippingAddress.shippingName;
          this.address1 = this.orderInfo.shippingInfo.shippingAddress.address1;
          this.city = this.orderInfo.shippingInfo.shippingAddress.city;
          this.state = this.orderInfo.shippingInfo.shippingAddress.state;
          this.postalCode = this.orderInfo.shippingInfo.shippingAddress.postalCode;
          this.canUpdateAddress = true;
        } else {
          this.canUpdateAddress = false;
        }
        this.appState.loading = false;
      }
    }).catch((error) => {
      console.error(error);
      this.appState.loading = false;
      this.goToReportIssue();
    });
  }

  // @HostListener('window:scroll', ['$event']) 
  // setStickfooter(event) {
  //   let footer = document.getElementById('footer');
  //   let offset = window.pageYOffset;
  //   if (window.innerWidth > 1024) {
  //     this.setSticky = window.pageYOffset >= (footer.offsetHeight - 92) ? false : true;
  //   } else {
  //     if (window.innerWidth > 639) {
  //       this.setSticky = window.pageYOffset >= (footer.offsetHeight - 170) ? false : true;
  //     } else {
  //         this.setSticky = window.pageYOffset >= (footer.offsetHeight - 350 ) ? false : true;
  //     }
  //   }
  // }
}
