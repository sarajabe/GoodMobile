import { Injectable } from '@angular/core';
import { DialogRef, Modal, overlayConfigFactory } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
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
import { MigrationStepsComponent } from '../modals/migration-steps/migration-steps.component';
import { IsLteModalComponent } from '../modals/is-lte-modal/is-lte-modal.component';
import { DynamicModalsComponent } from '../modals/dynamic-modals/dynamic-modals.component';
import { ReferralPromotionComponent } from 'src/modals/referral-promotion-modal/referral-promotion.component';
import { FiveGModalComponent } from '../modals/five-gmodal/five-gmodal.component';
import { OutOfStockItemModalComponent } from 'src/modals/out-of-stock-item-modal/out-of-stock-item-modal.component';
import { AcpModalComponent } from 'src/modals/acp-modal/acp-modal.component';
import { PhoneNotImpactedModalComponent } from 'src/modals/phone-not-impacted-modal/phone-not-impacted-modal.component';
import { IShipmentTracking } from '@ztarmobile/zwp-service-backend-v2';
import { TrackingModalComponent } from 'src/modals/tracking-details-modal/tracking-details-modal.component';
import { MdnsListModalComponent } from 'src/modals/mdns-list-modal/mdns-list-modal.component';
import { CompatibilitySkipModalComponent } from 'src/modals/compatibility-skip-modal/compatibility-skip-modal.component';
import { eSimReplacementModalComponent } from 'src/modals/esim-replacement-modal/esim-replacement-modal.component';
import { MigrationConfirmationModalComponent } from 'src/modals/migration-confirmation-modal/migration-confirmation-modal.component';

export interface ModalSetting {
  title?: string;
  okText?: string;
  cancelText?: string;
  customClass?: string;
  enableHTML?: boolean;
}
export interface IModalHelper {
  showManagePaymentModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, paymentId?: string, customClass?: string): DialogRef<any>;
  showManageShippingAddressesModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, addressId?: string, customClass?: string, accountSettingsRoute?: string): DialogRef<any>;
  showSpecificManagePaymentModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, paymentId?: string, customClass?: string): DialogRef<any>;
  showConfirmMessageModal(title: string, message: string, okText?: string, cancelText?: string, customClass?: string): DialogRef<any>;
  showConfirmMessage(message: string, settings?: ModalSetting): DialogRef<any>;
  showConfirmPasswordModal(title: string, message: string, customClass?: string): DialogRef<any>;
  showInformationMessageModal(title: string, message: string, btnText?: string, btnUrl?: string, hasCloseLink?: boolean, customClass?: string, customHTML?: string,
    cancelBtn?: boolean, cancelText?: string, noteText?: string): DialogRef<any>;
  showAddActivatedNumberModal(customClass?: string, title?: string, label?: string): DialogRef<any>;
  showInputModal(title: string, message: string, okText?: string, okBtnClass?: string, customClass?: string,
    isCancelable?: boolean, cancelText?: string, cancelBtnClass?: string, labelText?: string): DialogRef<any>;
  showRoutingModal(title: string, message: string, hasCloseLink?: boolean, yesButtonText?: string, noButtonText?: string,
    skipButtonText?: string, yesButtonLink?: string, noButtonLink?: string, skipButtonLink?: string, customClass?: string): DialogRef<any>;
  showEditCreditCardModal(paymentMethod: IFirebasePaymentMethod, title: string, note: string, noteLinkText: string, customClass?: string): DialogRef<any>;
  showSelectCreditCardModal(paymentList: Array<IFirebasePaymentMethod>, title: string, mdn: string, buttonText: string, customClass?: string): DialogRef<any>;
  showShippingAddressModal(title: string, shippingAddress?: IFirebaseAddress, customClass?: string): DialogRef<any>;
  showSIMModal(title: string, message: string, okText?: string, okBtnClass?: string, customClass?: string,
    network?: string, labelText?: string, showRecaptcha?: boolean): DialogRef<any>;
  showWifiCallingModal(title: string, termsRoute: string, customClass?: string, wifiAddress?: IFirebaseAddress): DialogRef<any>;
  showMigrationStepsModal(customClass?: string): DialogRef<any>;
  showReferralPromotionModal(customClass?: string): DialogRef<any>;
  showIsLteOptionsModal(title: string, customClass?: string): DialogRef<any>;
  showDynamicModal(title: string, message: string, btnText?: string, btnUrl?: string, hasCloseLink?: boolean, customClass?: string, customHTML?: string, contentfulModel?: string,
    renderElementId?: string, richTextId?: string, cancelBtn?: boolean, cancelText?: string, noteText?: string): DialogRef<any>;
  showFiveGModal(title: string, customHTML: string, linkText: string, linkRoute: any, customClass?: string, hasCloseLink?: boolean): DialogRef<any>;
  // tslint:disable-next-line:max-line-length
  showItemOutOFStockModal(title: string, customHTML: string, currentPlan: CustomizableMobilePlan, customClass?: string, hasCloseLink?: boolean): DialogRef<any>;
  showACPModal(title: string, customHTML: string, primaryButton?: string, secondaryButton?: string, customClass?: string, hasCloseLink?: boolean): DialogRef<any>;
  showNotImpactedModal(title: string, message: string, customClass?: string): DialogRef<any>;
  showTrackingModal(title: string, trackingDetails: IShipmentTracking, trackingNumber: string, customClass?: string): DialogRef<any>;
  showMdnsListModal(title: string, associatedPlans: Array<IUserPlan>, paymentId: string, customClass?: string): DialogRef<any>;
  showTMOSkipModal(title: string, hasCloseLink?: boolean, customClass?: string, notBeforeSkipping?: boolean): DialogRef<any>;
  showeSIMModal(iccid: string, mdn: string, customClass?: string): DialogRef<any>;
  showeMigrationConfirmationModal(phone: string, imei: string, customClass?: string): DialogRef<any>;
}
@Injectable({
  providedIn: 'root'
})
export class ModalHelperService {
  constructor(private modal: Modal) {
  }
  public showManagePaymentModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, paymentId?: string, customClass?: string): DialogRef<any> {
    return this.modal.open(ManagePaymentModalComponent, overlayConfigFactory({
      isManage,
      paymentId,
      userPlan,
      user,
      customClass
    }, BSModalContext));
  }

  public showManageShippingAddressesModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, addressId?: string, customClass?: string,
    accountSettingsRoute?: string): DialogRef<any> {
    return this.modal.open(ManageAddressModalComponent, overlayConfigFactory({
      isManage,
      userPlan,
      user,
      addressId,
      customClass,
      accountSettingsRoute
    }, BSModalContext));
  }
  public showACPModal(title: string, customHTML: string, primaryButton?: string, secondaryButton?: string, customClass?: string, hasCloseLink?: boolean): DialogRef<any> {
    return this.modal.open(AcpModalComponent, overlayConfigFactory({
      title,
      customHTML,
      primaryButton,
      secondaryButton,
      customClass,
      hasCloseLink
    }, BSModalContext));
  }
  public showSpecificManagePaymentModal(user: IUser, userPlan: IUserPlan, isManage?: boolean, paymentId?: string, customClass?: string,
    accountSettingsRoute?: string): DialogRef<any> {
    return this.modal.open(ManagePaymentSpecificModalComponent, overlayConfigFactory({
      isManage,
      paymentId,
      userPlan,
      user,
      customClass,
      accountSettingsRoute
    }, BSModalContext));
  }

  public showConfirmMessageModal(title: string, message: string, okText?: string, cancelText?: string, customClass?: string): DialogRef<any> {
    console.warn('You are using showConfirmMessageModal, please use showConfirmMessage instead');
    return this.showConfirmMessage(message, { title, okText, cancelText, customClass, enableHTML: false });
  }
  public showConfirmMessage(message: string, settings?: ModalSetting): DialogRef<any> {
    return this.modal.open(ConfirmMessageModalComponent, overlayConfigFactory({ message, settings }, BSModalContext));
  }

  public showConfirmPasswordModal(title: string, message: string, customClass?: string): DialogRef<any> {
    return this.modal.open(ConfirmPasswordModalComponent, overlayConfigFactory({
      title,
      message,
      customClass
    }, BSModalContext));
  }

  public showInformationMessageModal(title: string, message: string, btnText?: string, btnUrl?: string, hasCloseLink?: boolean, customClass?: string,
    customHTML?: string, cancelBtn?: boolean, cancelText?: string, noteText?: string): DialogRef<any> {
    return this.modal.open(InformationMessageModalComponent, overlayConfigFactory({
      title, message, btnText, btnUrl, hasCloseLink, customClass,
      customHTML, cancelBtn, cancelText, noteText
    }, BSModalContext));
  }
  public showFiveGModal(title: string, customHTML: string, linkText: string, linkRoute: any, customClass?: string, hasCloseLink?: boolean): DialogRef<any> {
    return this.modal.open(FiveGModalComponent, overlayConfigFactory({
      title, customHTML, linkText, linkRoute, customClass, hasCloseLink
    }, BSModalContext));
  }
  // tslint:disable-next-line:max-line-length
  public showItemOutOFStockModal(title: string, customHTML: string, currentPlan: CustomizableMobilePlan, customClass?: string, hasCloseLink?: boolean): DialogRef<any> {
    return this.modal.open(OutOfStockItemModalComponent, overlayConfigFactory({
      title, customHTML, currentPlan, customClass, hasCloseLink
    }, BSModalContext));
  }
  public showAddActivatedNumberModal(customClass?: string, title?: string, label?: string): DialogRef<any> {
    return this.modal.open(AddActivatedNumberModalComponent, overlayConfigFactory({ customClass, title, label }, BSModalContext));
  }
  public showInputModal(title: string, message: string, okText?: string, okBtnClass?: string, customClass?: string,
    isCancelable?: boolean, cancelText?: string, cancelBtnClass?: string, labelText?: string): DialogRef<any> {
    return this.modal.open(InputModalComponent, overlayConfigFactory({
      title, message, okText, okBtnClass, customClass,
      isCancelable, cancelText, cancelBtnClass, labelText
    }, BSModalContext));
  }
  public showRoutingModal(title: string, message: string, hasCloseLink?: boolean, yesButtonText?: string, noButtonText?: string,
    skipButtonText?: string, yesButtonLink?: string, noButtonLink?: string, skipButtonLink?: string, customClass?: string): DialogRef<any> {
    return this.modal.open(RoutingModalComponent, overlayConfigFactory({
      title, message, hasCloseLink, yesButtonText, noButtonText, skipButtonText, yesButtonLink, noButtonLink, skipButtonLink, customClass
    }, BSModalContext));
  }

  showEditCreditCardModal(paymentMethod: IFirebasePaymentMethod, title: string, note: string, noteLinkText: string, customClass?: string): DialogRef<any> {
    return this.modal.open(EditCcModalComponent, overlayConfigFactory({
      paymentMethod, title, note, noteLinkText, customClass
    }, BSModalContext));
  }

  showSelectCreditCardModal(paymentList: Array<IFirebasePaymentMethod>, title: string, mdn: string, buttonText: string, customClass?: string): DialogRef<any> {
    return this.modal.open(SelectPaymentModalComponent, overlayConfigFactory({
      paymentList, title, mdn, buttonText, customClass
    }, BSModalContext));
  }
  showShippingAddressModal(title: string, shippingAddress?: IFirebaseAddress, customClass?: string): DialogRef<any> {
    return this.modal.open(ShippingAddressModalComponent, overlayConfigFactory({
      title, shippingAddress, customClass
    }, BSModalContext));
  }

  showSIMModal(title: string, message: string, okText?: string, okBtnClass?: string, customClass?: string,
    network?: string, labelText?: string, showRecaptcha?: boolean): DialogRef<any> {
    return this.modal.open(SimReplacementModalComponent, overlayConfigFactory({
      title, message, okText, okBtnClass, customClass, network, labelText, showRecaptcha
    }, BSModalContext));
  }
  showeSIMModal(iccid: string, mdn: string, customClass?: string): DialogRef<any> {
    return this.modal.open(eSimReplacementModalComponent, overlayConfigFactory({
      iccid, mdn, customClass
    }, BSModalContext));
  }
  showWifiCallingModal(title: string, termsRoute: string, customClass?: string, wifiAddress?: IFirebaseAddress): DialogRef<any> {
    return this.modal.open(WifiCallingModalComponent, overlayConfigFactory({
      title, termsRoute, customClass, wifiAddress
    }, BSModalContext));
  }
  showMigrationStepsModal(customClass?: string): DialogRef<any> {
    return this.modal.open(MigrationStepsComponent, overlayConfigFactory({
      customClass,
    }, BSModalContext));
  }
  showReferralPromotionModal(customClass?: string): DialogRef<any> {
    return this.modal.open(ReferralPromotionComponent, overlayConfigFactory({
      customClass,
    }, BSModalContext));
  }
  showIsLteOptionsModal(title: string, customClass?: string): DialogRef<any> {
    return this.modal.open(IsLteModalComponent, overlayConfigFactory({
      title, customClass,
    }, BSModalContext));
  }

  showNotImpactedModal(title: string, message: string, customClass?: string): DialogRef<any> {
    return this.modal.open(PhoneNotImpactedModalComponent, overlayConfigFactory({
      title, message,
    }, BSModalContext));
  }
  public showDynamicModal(title: string, message: string, btnText?: string, btnUrl?: string, hasCloseLink?: boolean, customClass?: string,
    customHTML?: string, contentfulModel?: string, renderElementId?: string, richTextId?: string,
    cancelBtn?: boolean, cancelText?: string, noteText?: string): DialogRef<any> {
    return this.modal.open(DynamicModalsComponent, overlayConfigFactory({
      title, message, btnText, btnUrl, hasCloseLink, customClass,
      customHTML, contentfulModel, richTextId, renderElementId, cancelBtn, cancelText, noteText
    }, BSModalContext));
  }

  public showTrackingModal(title: string, trackingDetails: IShipmentTracking, trackingNumber: string, customClass?: string): DialogRef<any> {
    return this.modal.open(TrackingModalComponent, overlayConfigFactory({
      title, trackingDetails, trackingNumber, customClass
    }, BSModalContext));
  }
  public showMdnsListModal(title: string, associatedPlans: Array<IUserPlan>, paymentId: string, customClass?: string): DialogRef<any> {
    return this.modal.open(MdnsListModalComponent, overlayConfigFactory({
      title, associatedPlans, paymentId, customClass
    }, BSModalContext));
  }
  public showTMOSkipModal(title: string, hasCloseLink?: boolean, customClass?: string, notBeforeSkipping?:boolean): DialogRef<any> {
    return this.modal.open(CompatibilitySkipModalComponent, overlayConfigFactory({
      title, hasCloseLink, customClass, notBeforeSkipping
    }, BSModalContext));
  }
  public showeMigrationConfirmationModal(phone: string, imei: string, customClass?: string): DialogRef<any> {
    return this.modal.open(MigrationConfirmationModalComponent, overlayConfigFactory({
      phone, imei, customClass
    }, BSModalContext));
  }
}
