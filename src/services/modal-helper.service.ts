import { Injectable } from '@angular/core';
import { IUserPlan, IFirebaseAddress, IFirebasePaymentMethod, CustomizableMobilePlan } from '@ztarmobile/zwp-service-backend';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { ManagePaymentModalComponent } from '../modals/manage-payment-modal/manage-payment-modal.component';
import { ManageAddressModalComponent } from '../modals/manage-address-modal/manage-address-modal.component';
import { ManagePaymentSpecificModalComponent } from '../modals/manage-payment-specific-modal/manage-payment-specific-modal.component';
import { ConfirmMessageModalComponent } from '../modals/confirm-message-modal/confirm-message-modal.component';
import { ConfirmPasswordModalComponent } from '../modals/confirm-password-modal/confirm-password-modal.component';
import { InformationMessageModalComponent } from '../modals/information-message-modal/information-message-modal.component';
import { AddActivatedNumberModalComponent } from '../modals/add-activated-number-modal/add-activated-number-modal.component';
import { InputModalComponent } from '../modals/input-modal/input-modal.component';
import { RoutingModalComponent } from '../modals/routing-modal/routing-modal.component';
import { EditCcModalComponent } from '../modals/edit-cc-modal/edit-cc-modal.component';
import { SelectPaymentModalComponent } from '../modals/select-payment-modal/select-payment-modal.component';
import { ShippingAddressModalComponent } from '../modals/shipping-address-modal/shipping-address-modal.component';
import { SimReplacementModalComponent } from '../modals/sim-replacement-modal/sim-replacement-modal.component';
import { WifiCallingModalComponent } from '../modals/wifi-calling-modal/wifi-calling-modal.component';
import { FiveGModalComponent } from '../modals/five-gmodal/five-gmodal.component';
import { OutOfStockItemModalComponent } from 'src/modals/out-of-stock-item-modal/out-of-stock-item-modal.component';
import { AcpModalComponent } from 'src/modals/acp-modal/acp-modal.component';
import { PhoneNotImpactedModalComponent } from 'src/modals/phone-not-impacted-modal/phone-not-impacted-modal.component';
import { IShipmentTracking } from '@ztarmobile/zwp-service-backend-v2';
import { TrackingModalComponent } from 'src/modals/tracking-details-modal/tracking-details-modal.component';
import { MdnsListModalComponent } from 'src/modals/mdns-list-modal/mdns-list-modal.component';
import { CompatibilitySkipModalComponent } from 'src/modals/compatibility-skip-modal/compatibility-skip-modal.component';
import { eSimReplacementModalComponent } from 'src/modals/esim-replacement-modal/esim-replacement-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BarCodeModalComponent } from 'src/modals/bar-code-modal/bar-code-modal.component';

export interface ModalSetting {
  title?: string;
  okText?: string;
  cancelText?: string;
  customClass?: string;
  enableHTML?: boolean;
}
export interface IModalHelper {
  showManagePaymentModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, paymentId?: string, customClass?: string): MatDialogRef<any>;
  showManageShippingAddressesModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, addressId?: string, customClass?: string, accountSettingsRoute?: string): MatDialogRef<any>;
  showSpecificManagePaymentModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, paymentId?: string, customClass?: string): MatDialogRef<any>;
  showConfirmMessageModal(title: string, message: string, okText?: string, cancelText?: string, customClass?: string): MatDialogRef<any>;
  showConfirmMessage(message: string, settings?: ModalSetting): MatDialogRef<any>;
  showConfirmPasswordModal(title: string, message: string, customClass?: string): MatDialogRef<any>;
  showInformationMessageModal(title: string, message: string, btnText?: string, btnUrl?: string, hasCloseLink?: boolean, customClass?: string, customHTML?: string,
    cancelBtn?: boolean, cancelText?: string, noteText?: string): MatDialogRef<any>;
  showAddActivatedNumberModal(customClass?: string, title?: string, label?: string): MatDialogRef<any>;
  showInputModal(title: string, message: string, okText?: string, okBtnClass?: string, customClass?: string,
    isCancelable?: boolean, cancelText?: string, cancelBtnClass?: string, labelText?: string): MatDialogRef<any>;
  showRoutingModal(title: string, message: string, hasCloseLink?: boolean, yesButtonText?: string, noButtonText?: string,
    skipButtonText?: string, yesButtonLink?: string, noButtonLink?: string, skipButtonLink?: string, customClass?: string): MatDialogRef<any>;
  showEditCreditCardModal(paymentMethod: IFirebasePaymentMethod, title: string, note: string, noteLinkText: string, customClass?: string): MatDialogRef<any>;
  showSelectCreditCardModal(paymentList: Array<IFirebasePaymentMethod>, title: string, mdn: string, buttonText: string, customClass?: string): MatDialogRef<any>;
  showShippingAddressModal(title: string, shippingAddress?: IFirebaseAddress, customClass?: string): MatDialogRef<any>;
  showSIMModal(title: string, message: string, okText?: string, okBtnClass?: string, customClass?: string,
    network?: string, labelText?: string, showRecaptcha?: boolean, disabledIccid?: boolean, iccid?: string): MatDialogRef<any>;
  showWifiCallingModal(title: string, termsRoute: string, customClass?: string, wifiAddress?: IFirebaseAddress): MatDialogRef<any>;
  showFiveGModal(title: string, customHTML: string, linkText: string, linkRoute: any, customClass?: string, hasCloseLink?: boolean): MatDialogRef<any>;
  // tslint:disable-next-line:max-line-length
  showItemOutOFStockModal(title: string, customHTML: string, currentPlan: CustomizableMobilePlan, customClass?: string, hasCloseLink?: boolean): MatDialogRef<any>;
  showACPModal(title: string, customHTML: string, primaryButton?: string, secondaryButton?: string, customClass?: string, hasCloseLink?: boolean): MatDialogRef<any>;
  showNotImpactedModal(title: string, message: string, customClass?: string): MatDialogRef<any>;
  showTrackingModal(title: string, trackingDetails: IShipmentTracking, trackingNumber: string, customClass?: string): MatDialogRef<any>;
  showMdnsListModal(title: string, associatedPlans: Array<IUserPlan>, paymentId: string, customClass?: string): MatDialogRef<any>;
  showTMOSkipModal(title: string, hasCloseLink?: boolean, customClass?: string, notBeforeSkipping?: boolean): MatDialogRef<any>;
  showeSIMModal(iccid: string, mdn: string, customClass?: string): MatDialogRef<any>;
  showBarcodeModal(title: string, message: string, bardcodeValue:any): MatDialogRef<any> ;
}
@Injectable({
  providedIn: 'root'
})
export class ModalHelperService {
  constructor(private dialog: MatDialog) {
  }
  public showManagePaymentModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, paymentId?: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(ManagePaymentModalComponent, {
      data: {
        isManage,
        paymentId,
        userPlan,
        user,
        customClass
      }
    });
  }

  public showManageShippingAddressesModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, addressId?: string, customClass?: string,
    accountSettingsRoute?: string): MatDialogRef<any> {
    return this.dialog.open(ManageAddressModalComponent, {
      data: {
        isManage,
        userPlan,
        user,
        addressId,
        customClass,
        accountSettingsRoute
      }
    });
  }
  public showACPModal(title: string, customHTML: string, primaryButton?: string, secondaryButton?: string, customClass?: string, hasCloseLink?: boolean): MatDialogRef<any> {
    return this.dialog.open(AcpModalComponent, {
      data: {
        title,
        customHTML,
        primaryButton,
        secondaryButton,
        customClass,
        hasCloseLink
      }
    });
  }
  public showSpecificManagePaymentModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, paymentId?: string, customClass?: string,
    accountSettingsRoute?: string): MatDialogRef<any> {
    return this.dialog.open(ManagePaymentSpecificModalComponent, {
      data: {
        isManage,
        paymentId,
        userPlan,
        user,
        customClass,
        accountSettingsRoute
      }
    });
  }

  public showConfirmMessageModal(title: string, message: string, okText?: string, cancelText?: string, customClass?: string): MatDialogRef<any> {
    console.warn('You are using showConfirmMessageModal, please use showConfirmMessage instead');
    return this.showConfirmMessage(message, { title, okText, cancelText, customClass, enableHTML: false });
  }
  public showConfirmMessage(message: string, settings?: ModalSetting): MatDialogRef<any> {
    return this.dialog.open(ConfirmMessageModalComponent, {
      data: {
        message, settings
      }
    });
  }

  public showConfirmPasswordModal(title: string, message: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(ConfirmPasswordModalComponent, {
      data: {
        title,
        message,
        customClass
      }
    });
  }
  public showInformationMessageModal(title: string, message: string, btnText?: string, btnUrl?: string, hasCloseLink?: boolean, customClass?: string,
    customHTML?: string, cancelBtn?: boolean, cancelText?: string, noteText?: string, specificCancelReturn?: string): MatDialogRef<any> {
    return this.dialog.open(InformationMessageModalComponent, {
      data: {
        title, message, btnText, btnUrl, hasCloseLink, customClass,
        customHTML, cancelBtn, cancelText, noteText, specificCancelReturn
      }
    });

  }
  public showFiveGModal(title: string, customHTML: string, linkText: string, linkRoute: any, customClass?: string, hasCloseLink?: boolean): MatDialogRef<any> {
    return this.dialog.open(FiveGModalComponent, {
      data: {
        title, customHTML, linkText, linkRoute, customClass, hasCloseLink
      }
    });
  }
  // tslint:disable-next-line:max-line-length
  public showItemOutOFStockModal(title: string, customHTML: string, currentPlan: CustomizableMobilePlan, customClass?: string, hasCloseLink?: boolean): MatDialogRef<any> {
    return this.dialog.open(OutOfStockItemModalComponent, {
      data: {
        title, customHTML, currentPlan, customClass, hasCloseLink
      }
    });
  }
  public showAddActivatedNumberModal(customClass?: string, title?: string, label?: string): MatDialogRef<any> {
    return this.dialog.open(AddActivatedNumberModalComponent, {
      data: {
        customClass, title, label
      }
    });
  }
  public showInputModal(title: string, message: string, okText?: string, okBtnClass?: string, customClass?: string,
    isCancelable?: boolean, cancelText?: string, cancelBtnClass?: string, labelText?: string): MatDialogRef<any> {
    return this.dialog.open(InputModalComponent, {
      data: {
        title, message, okText, okBtnClass, customClass,
        isCancelable, cancelText, cancelBtnClass, labelText
      }
    });
  }
  public showRoutingModal(title: string, message: string, hasCloseLink?: boolean, yesButtonText?: string, noButtonText?: string,
    skipButtonText?: string, yesButtonLink?: string, noButtonLink?: string, skipButtonLink?: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(RoutingModalComponent, {
      data: {
        title, message, hasCloseLink, yesButtonText, noButtonText, skipButtonText, yesButtonLink, noButtonLink, skipButtonLink, customClass
      }
    });
  }

  showEditCreditCardModal(paymentMethod: IFirebasePaymentMethod, title: string, note: string, noteLinkText: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(EditCcModalComponent, {
      data: {
        paymentMethod, title, note, noteLinkText, customClass
      }
    });
  }

  showSelectCreditCardModal(paymentList: Array<IFirebasePaymentMethod>, title: string, mdn: string, buttonText: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(SelectPaymentModalComponent, {
      data: {
        paymentList, title, mdn, buttonText, customClass
      }
    });
  }
  showShippingAddressModal(title: string, shippingAddress?: IFirebaseAddress, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(ShippingAddressModalComponent, {
      data: {
        title, shippingAddress, customClass
      }

    });
  }

  showSIMModal(title: string, message: string, okText?: string, okBtnClass?: string, customClass?: string,
    network?: string, labelText?: string, showRecaptcha?: boolean, disabledIccid?: boolean, iccid?: string): MatDialogRef<any> {
    return this.dialog.open(SimReplacementModalComponent, {
      data: {
        title, message, okText, okBtnClass, customClass, network, labelText, showRecaptcha, disabledIccid, iccid
      }
    });
  }
  showeSIMModal(iccid: string, mdn: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(eSimReplacementModalComponent, {
      data: {
        iccid, mdn, customClass
      }
    });
  }
  showWifiCallingModal(title: string, termsRoute: string, customClass?: string, wifiAddress?: IFirebaseAddress): MatDialogRef<any> {
    return this.dialog.open(WifiCallingModalComponent, {
      data: {
        title, termsRoute, customClass, wifiAddress
      }
    });
  }
  showNotImpactedModal(title: string, message: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(PhoneNotImpactedModalComponent, {
      data: {
        title, message,
      }
    });
  }

  public showTrackingModal(title: string, trackingDetails: IShipmentTracking, trackingNumber: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(TrackingModalComponent, {
      data: {
        title, trackingDetails, trackingNumber, customClass
      }
    });
  }
  public showMdnsListModal(title: string, associatedPlans: Array<IUserPlan>, paymentId: string, customClass?: string): MatDialogRef<any> {
    return this.dialog.open(MdnsListModalComponent, {
      data: {
        title, associatedPlans, paymentId, customClass
      }
    });
  }
  public showTMOSkipModal(title: string, hasCloseLink?: boolean, customClass?: string, notBeforeSkipping?: boolean): MatDialogRef<any> {
    return this.dialog.open(CompatibilitySkipModalComponent, {
      data: {
        title, hasCloseLink, customClass, notBeforeSkipping
      }
    });
  }
  public showBarcodeModal(title: string, message: string, bardcodeValue:any): MatDialogRef<any> {
    return this.dialog.open(BarCodeModalComponent, {
      data: {
        title, message, bardcodeValue
      }
    });
  }
}
