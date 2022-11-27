import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { IVoucherData, VoucherActivationService, CustomizableMobilePlan, MobileCustomPlansService, CART_TYPES } from '@ztarmobile/zwp-service-backend';
import { CUSTOMER_CARE_NUMBER } from '../../../../environments/environment';
import { FadeInOutAnimation } from '../../../../app/app.animations';
import { CheckoutService } from '../checkout.service';
import { ModalHelperService } from '../../../../services/modal-helper.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-voucher-payment-section',
  templateUrl: './voucher-payment-section.component.html',
  animations: [FadeInOutAnimation]
})
export class VoucherPaymentSectionComponent implements OnInit, OnDestroy{
  @Input() isVoucherPaymentAccepted: boolean;
  @Input() isVoucherPaymentSufficient: boolean;
  @Output() voucherData: EventEmitter<IVoucherData> = new EventEmitter<IVoucherData>();
  @Output() showCCardSectionChange = new EventEmitter(); // todo make use of it if the voucher didn't cover full payment

  public CART_TYPES = CART_TYPES;
  public showVoucherForm: boolean;
  public customerCareNumber: string = CUSTOMER_CARE_NUMBER;
  public voucherCode: string;
  public processingVoucherRequest: boolean;
  public invalidVoucherCode: boolean;
  public currentCart: CustomizableMobilePlan;
  public planPriceTotal: number;
  private alive = true;

  constructor(private voucherActivationService: VoucherActivationService, private modalHelper: ModalHelperService, private mobilePlanService: MobileCustomPlansService,
              private mobilePlansService: MobileCustomPlansService, private checkoutService: CheckoutService) {
  }
  ngOnInit(): void {
    this.mobilePlanService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      if (!!plan) {
        this.currentCart = plan;
        this.planPriceTotal = !!plan.basePlan ? plan.basePlan.price : 0;
        if (this.currentCart && this.currentCart.voucherData && this.currentCart.voucherData.code) {
          this.voucherCode = this.currentCart.voucherData.code;
          this.showVoucherForm = true;
        } else {
          this.voucherCode = '';
          this.showVoucherForm = false;
        }
      }
      });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public showHideVoucherForm(): void{
    this.showVoucherForm = !this.showVoucherForm;
  }

  public showVoucherModal(): void {
    this.modalHelper.showInformationMessageModal('Voucher usage', '', 'Got it!', null, true, 'voucher-info-modal',
      `<div class="text-content-holder">
                  <p class="text">  You can purchse your GoodMobile vouchers in stores:</p>
                </div>
                  <div class="text-content-holder">
                  You can add balance to your account and purchase items through the GoodMobile website.
                  You can also use both payment methods (&nbsp;card&nbsp;+&nbsp;voucher&nbsp;) to complete your GoodMobile purchase
                  </div>
                  <div class="image-container">
                  <span class="pointer-holder"></span>
                  <img src="assets/img/voucher-info.png"/>
                  <span class="image-pointer">Scratch this area on the back of your GoodMobile voucher for PIN</span>
                  </div>
`
    );
  }

  public checkVoucherCode(): void {
    this.processingVoucherRequest = true;
    this.voucherActivationService.checkVoucherCode(this.voucherCode).then((voucher: IVoucherData) => {
      if (!!voucher) {
        this.processingVoucherRequest = false;
        this.invalidVoucherCode = false;

        let userBalance = '';
        let itemsPrice = 0;
        if (!!this.currentCart.addOns && this.currentCart.addOns.length > 0){
          for (const addon of this.currentCart.addOns) {
            itemsPrice += addon.price * addon.quantity;
          }
        }
        if (this.currentCart.cartType !== CART_TYPES.PLAN_ITEMS) {
          const cartPrice = !this.currentCart.basePlan.specialPromotion ? this.currentCart.price :
          ((this.currentCart.basePlan.price * this.currentCart.basePlan.specialPromotion.promotionCycles) / 2);
          if (voucher.limit > cartPrice) {
            userBalance = '$' + Math.abs(voucher.limit - cartPrice);
          } else {
              userBalance = `<span class="text-color-alert">($0)</span>`;
          }
        } else {
          if (voucher.limit > itemsPrice) {
            userBalance = '$' + Math.abs(voucher.limit - itemsPrice);
          } else {
              userBalance = `<span class="text-color-alert">($0)</span>`;
          }
        }
        const customHtml = '<div><p class="message">Your GoodMobile voucher code was validated. </p><p class="message balance"> Your account balance is ' +  userBalance + '</p</div>';
        this.modalHelper.showInformationMessageModal('Your Voucher Code is valid',
          '',
          'Done',
          null, true, 'custom-modal-voucher-results',
          customHtml
        );

        this.voucherData.emit(voucher);
      }
      }, (error) => {
        console.warn(error);
        this.processingVoucherRequest = false;
        this.invalidVoucherCode = true;
      }
    );
  }
  public removeVoucher(): void {
    if (!!this.currentCart.voucherData) {
      this.modalHelper.showConfirmMessageModal('Remove Voucher', 'Are you sure you want to remove the voucher?', 'Remove', 'Cancel', 'custom-modal-voucher-results')
      .result.then((result) => {
        if (!!result) {
          this.mobilePlansService.setVoucherData({} as IVoucherData);
          this.voucherData.emit({code: '0'} as IVoucherData);
          this.voucherCode = '';
        }
      });
    }
  }

}

