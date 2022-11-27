import { Component, OnInit } from '@angular/core';
import { IUser } from '@ztarmobile/zwp-services-auth';
import {
  FirebaseUserProfileService,
  IFirebaseAddress,
  IUserPlan,
  UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { Router } from '@angular/router';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { PlatformLocation } from '@angular/common';

export class G2gAddressModalContext extends BSModalContext {
  public addressId: string;
  public isManage: boolean;
  public userPlan: IUserPlan;
  public user: IUser;
  public customClass?: string;
  public accountSettingsRoute?: string;
  public ROUTES_URL: any;
}

@Component({
  selector: 'app-manage-address-modal',
  templateUrl: './manage-address-modal.component.html'
})
export class ManageAddressModalComponent implements OnInit, CloseGuard, ModalComponent<G2gAddressModalContext> {
  public context: G2gAddressModalContext;
  public address: IFirebaseAddress;
  public addressesList: Array<IFirebaseAddress>;
  public isValidAddress: boolean;
  public processingRequest: boolean;
  public setDefaultRequest: boolean;
  public editMode: boolean;
  public selectedMethodId: string;

  private editedAddress: IFirebaseAddress = {} as IFirebaseAddress;

  constructor(private fbUserProfileService: FirebaseUserProfileService,
              private userPlansService: UserPlansService,
              private toastHelper: ToastrHelperService,
              private router: Router,
              public dialog: DialogRef<G2gAddressModalContext>,
              private location: PlatformLocation) {
    this.context = dialog.context;
    this.editMode = false;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
    this.address = {isDefault: false, name: ''} as IFirebaseAddress;
    this.addressesList = [];
  }

  public setValidAddress(isValid: boolean): void {
    setTimeout(() => {
      this.isValidAddress = isValid;
    });
  }

  ngOnInit(): void {
    this.addressesList = this.context.user.shippingAddresses;
    this.userPlansService.getUserPlan(this.context.userPlan.id).then((userPlan) => {
      this.context.userPlan = userPlan;
      this.selectedMethodId = this.context.userPlan.shippingAddressId;
      this.context.addressId = this.context.userPlan.shippingAddressId;
      if (!!this.context.addressId && this.context.addressId !== '') {
        this.address = !!this.addressesList ? this.addressesList.find((address) => address.id === this.context.addressId) : {} as IFirebaseAddress;
        delete this.address.main_text;
        this.address.isDefault = !!this.address.isDefault;
        this.editedAddress = Object.assign({}, this.address);
        this.editMode = true;
      }
    });
  }

  beforeClose(): boolean {
    if (!this.isValidAddress) {
      if (document.body.classList.contains('modal-open')) {
        document.body.classList.remove('modal-open');
      }
    }
    return this.isValidAddress;
  }

  closeDialog(): void {
    this.isValidAddress = false;
    this.dialog.close();
  }

  public addressChanged(address: IFirebaseAddress): void {
    this.editedAddress = Object.assign(this.editedAddress, address);
  }
  public goToSettings(): void {
    this.closeDialog();
    this.router.navigate([this.context.accountSettingsRoute]);
  }
  public setDefaultShippingAddress(key): void {
    this.setDefaultRequest = true;
    this.fbUserProfileService.setDefaultShippingAddress(key)
      .then(() => {
        this.userPlansService.getUserPlan(this.context.userPlan.id).then((plan) => {
          plan.shippingAddressId = key;
          this.userPlansService.updateUserPlan(this.context.user.id, plan).then(() => {
            this.userPlansService.selectUserPlan(this.context.userPlan.id);
            this.toastHelper.showSuccess('Default address was set successfully');
            this.setDefaultRequest = false;
            this.closeDialog();
          }, (error) => this.toastHelper.showAlert('Failed to set default address.'));
        });
      })
      .catch((error) => {
        console.warn('Failed to set default address. ' + error);
        this.setDefaultRequest = false;
        this.toastHelper.showAlert('Failed to set default address.');
      });
  }

  public saveAddress(): void {
    this.processingRequest = true;
    setTimeout(() => {
      Object.assign(this.address, this.editedAddress);
      this.address.address2 = (!!this.address.address2) ? this.address.address2 : '';
      this.fbUserProfileService.getExistShippingAddress(this.address).then((address) => {
        const editAlias = (!!address && (this.address.name !== address.name) || (this.address.alias !== address.alias)) && this.editMode;
        if (!!address && !editAlias) {
          this.processingRequest = false;
          this.toastHelper.showWarning('This shipping address already exists.');
        } else {
          if (this.editMode) {
            if (!!this.address.id) {
              this.fbUserProfileService.editShippingAddress(this.address).then(() => {
                this.toastHelper.showSuccess('Address was updated successfully.');
                this.processingRequest = false;
                this.closeDialog();
              }).catch((error) => {
                this.processingRequest = false;
                console.warn(error);
                this.toastHelper.showAlert('Failed to edit address.');
              });
            }
            this.processingRequest = false;
          } else {
            this.fbUserProfileService.addShippingAddress(this.address).then((newAddress) => {
              this.toastHelper.showSuccess('New address was added successfully.');
              if (!!this.context.userPlan && this.context.isManage) {
                this.setDefaultShippingAddress(newAddress.id);
              } else {
                this.closeDialog();
              }
            }).catch((error) => {
              this.processingRequest = false;
              console.warn(error);
              this.toastHelper.showAlert('Failed to add address.');
            });
          }
        }
      });
    });
  }
}

