import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUserProfileService, IUser, IUserAccount, IUserPlan, OrderInfo, UserAccountService, UserOrdersService, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { EbbService, IAcpDetails, IAppDetails, IVerificationRes, LookupsService } from '@ztarmobile/zwp-service-backend-v2';
import { filter, take, takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS, ACTIVATION_ROUTE_URLS, ROUTE_URLS, SHOP_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ACP_CALLBACK_URL } from 'src/environments/environment';
import { MetaService } from 'src/services/meta-service.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../account-header.service';
import * as _ from 'lodash';
import { PhonePipe } from 'src/widgets/pipes/phone.pipe';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-account-acp-application',
  templateUrl: './account-acp-application.component.html',
  styleUrls: ['./account-acp-application.component.scss']
})
export class AccountAcpApplicationComponent implements OnInit, AfterContentChecked, OnDestroy {
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public userProfile: IUser;
  public verificationDetails: IVerificationRes;
  public acpAppDetails: any = {};
  public nvStatus: string;
  public appStatus: string;
  public planActivationStatus: string;
  public ROUTE_URLS = ROUTE_URLS;
  public ACP_ROUTE_URLS = ACP_ROUTE_URLS;
  public isActivatedAcpPlan = false;
  public acpPlan: IUserPlan;
  public userAccount: IUserAccount;
  public processingRequest = false;
  public isRefreshClicked = false;
  public timeLeft = 300000; // 5 Minutes
  public interval = null;
  public seconds: any = 0;
  public minutes: any = 0;
  public showExpiredSection = false;
  public showMoreDocuments = false;
  public showValidDocs = false;
  public showProofDocs = false;
  public ACP_STATUS = {
    COMPLETE: 'COMPLETE',
    PENDING_RESOLUTION: 'PENDING_RESOLUTION',
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    PENDING_REVIEW: 'PENDING_REVIEW',
    PENDING_CERT: 'PENDING_CERT'
  };
  public STATUS_TITLE = {
    COMPLETE: 'Complete',
    IN_PROGRESS: 'In Progress',
    PENDING_REVIEW: 'Pending Review',
    PENDING_CERT: 'Pending Certification',
    PENDING_RESOLUTION: 'Pending Resolution',
    PENDING: 'Pending',
    PENDING_ELIGIBILITY: 'On Hold'
  };
  public ACP_PLAN_STATUS_TITLE = {
    PENDING: 'Pending',
    PENDING_WITH_MDN: 'Pending',
    ON_HOLD: 'On Hold',
    PENDING_ACTIVATION: 'Pending Activation',
    ENROLLED: 'Enrolled',
    WAITING_ACTIVATION_RESULT: 'Pending Activation'
  };
  public hideCardContentNV = false;
  public hideCardContentSP = false;
  public hideCardContentPA = false;
  public showNVOnHoldSection = false;
  public showNVErrorSection = false;
  public showGenericError = false;
  public showNVCard = false;
  public showSPCard = false;
  public showCardDesc = false;
  public showAlert = false;
  public ACP_DEVICE_DESCS = {};
  public ACP_DESCS = {};
  public ACP_PLAN_DESCS = {};
  public NV_DESCS = {};
  public showAcpApplicationCard = false;
  public showSuccessBanner = true;
  public isDisplayNone = false;
  public showAcpPlanActivationCard = false;
  public stores = [];
  public activePlans: Array<IUserPlan>;
  public appDetails: any = {};
  public showQrCode = false;
  public createdDate: any;
  public providerApplicationID;
  public barCodeValue;
  public fileUrls = [];
  public internalData: IVerificationRes;
  public acpDeviceCase: string;
  public oldUserData: IVerificationRes;
  public showAttentionBanner = false;
  public hideCardContentUI = false;
  public showDeviceOptions = false;
  public showDeviceCode = true;
  public showACPCodeSection = false;
  public isInPersonDelivery = false;
  public hideActionLink = false;

  private callBackUrl: string;
  private alive = true;
  acpDeviceOrder: OrderInfo;
  showStores: boolean;
  acpCancelled: boolean;
  deviceIMEI: any;
  option: any;
  showDeviceOptionError: boolean;
  pendingACPDevice: boolean;
  dataCollected = false;
  canPurchaseADevice: any;
  nextPurchaseDate: Date;

  constructor(
    private accountHeaderService: AccountHeaderService,
    private metaService: MetaService,
    private ebbService: EbbService,
    private userProfileService: FirebaseUserProfileService,
    private appState: AppState,
    private router: Router,
    private toastHelper: ToastrHelperService,
    private userPlansService: UserPlansService,
    private userAccountService: UserAccountService,
    private modalHelper: ModalHelperService,
    private accountOrderService: UserOrdersService,) {

    this.accountHeaderService.setPageTitle('Your ACP application');
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.accountHeaderService.setAccountMenuVisibility(true);

    this.callBackUrl = `${ACP_CALLBACK_URL}/${ACP_ROUTE_URLS.BASE}`;
    const time = JSON.parse(sessionStorage.getItem('refreshTime'));
    if (time > 0) {
      this.timeLeft = time;
      this.timer();
      this.refreshInterval();
      this.isRefreshClicked = true;
    }
    this.getVerificationDetails();
  }


  public hideSuccessBanner(): void {
    setInterval(() => {
      this.showSuccessBanner = false;
    }, 10000);
    setInterval(() => {
      this.isDisplayNone = true;
    }, 11000);
  }

  ngAfterContentChecked(): void {
    this.ACP_DEVICE_DESCS = {
      'ENROLLED_ACP_CASE': {
        imgPath1: `assets/icon/hooray-icon.svg`,
        imgPath2: `assets/icon/hooray2-icon.svg`,
        title: `Hooray!`,
        desc1: !!this.nextPurchaseDate ? `On <b>${this.nextPurchaseDate.getMonth() + 1}/${this.nextPurchaseDate.getDate()}/${this.nextPurchaseDate.getFullYear()}</b>, you may be eligible for a <b>$100</b> discount on a new device from our phone catalog. Please make sure to check again later!` : `You are eligible for a <b>$100</b> discount on a new device from our catalog! Hurry up and get yours today!`,
        desc2: null,
        buttonName: !!this.canPurchaseADevice ? 'Let’s get started!' : null,
        buttonAction: 'goToAcpDevices'
      },
      'PENDING_NV_CASE': {
        imgPath1: `assets/icon/looking-benefits-icon.svg`,
        imgPath2: null,
        title: `Looking for ACP device benefits?`,
        desc1: `Look no further!<br>Please finish your <b>ACP enrollment</b> and <b>activation</b> for a chance to claim up to <b>$100</b> discount on a new device!`,
        desc2: `Don’t miss out!`,
        buttonName: null,
        buttonAction: null
      },
      'PENDING_ACP_CASE': {
        imgPath1: `assets/icon/hooray-icon.svg`,
        imgPath2: `assets/icon/hooray2-icon.svg`,
        title: `Hurry up!`,
        desc1: `<b>Activate</b> your ACP plan now and check if you are eligible for up to <b>$100</b> discount on a new device from our catalog!`,
        desc2: null,
        buttonName: null,
        buttonAction: null
      }
    }
    this.ACP_DESCS = {
      'In Progress': {
        title: 'Application in progress',
        desc1: `Your ACP application has started with Good Mobile. Please complete your application
         as soon as possible and start enjoying your ACP Free Cell phone Service.`,
        desc2: null,
        buttonName: 'Complete Application',
        buttonAction: 'goToAcpForm',
        longClass: true
      },
      'On Hold': {
        title: 'We are Sorry!',
        desc1: 'We are unable to approve your Request at this time.',
        desc2: 'Please contact customer care for more help.',
        buttonName: 'Contact Us',
        buttonAction: 'goToContactUs',
        longClass: false
      }
    }
    this.ACP_PLAN_DESCS = {
      'PENDING': {
        title: 'Action Required:',
        desc1: 'Please add a new line in order to proceed with your ACP benefits',
        desc2: null,
        desc3: null,
        primaryButtonName: 'Add New Line',
        primaryButtonAction: 'addNewLine',
        secondaryButtonName: null,
        secondaryButtonAction: null,
        linkName: null,
        linkAction: null,
        pendingWidth: false,
        onHoldWidth: false,
        topBottomClass: false,
        longClass: false
      },
      'PENDING_WITH_MDN': {
        title: 'Action Required:',
        desc1: 'Please add a new line or choose an existing one in order to proceed with your ACP benefits',
        desc2: null,
        desc3: null,
        primaryButtonName: 'Add New Line',
        primaryButtonAction: 'addNewLine',
        secondaryButtonName: 'Select Existing Line',
        secondaryButtonAction: 'selectExistingLine',
        linkName: null,
        linkAction: null,
        pendingWidth: true,
        onHoldWidth: false,
        topBottomClass: false,
        longClass: true
      },
      'ON_HOLD': {
        title: 'Attention!',
        desc1: 'We are unable to activate your ACP plan at this time.',
        desc2: 'Please try again or call customer care for more help.',
        desc3: null,
        primaryButtonName: 'View Purchased Plan',
        primaryButtonAction: 'viewPurchasedPlan',
        secondaryButtonName: 'Contact Us',
        secondaryButtonAction: 'goToContactUs',
        linkName: null,
        linkAction: null,
        pendingWidth: false,
        onHoldWidth: true,
        topBottomClass: false,
        longClass: true
      },
      'PENDING_ACTIVATION': {
        title: 'Action Required:',
        desc1: 'Please Activate your line and start using your ACP plan',
        desc2: null,
        desc3: null,
        primaryButtonName: 'Activate Your Plan',
        primaryButtonAction: 'activatePlan',
        secondaryButtonName: null,
        secondaryButtonAction: null,
        linkName: !this.acpCancelled ? 'Cancel Order' : null,
        linkAction: 'cancelOrder',
        pendingWidth: false,
        onHoldWidth: false,
        topBottomClass: false,
        longClass: true
      },
      'WAITING_ACTIVATION_RESULT': {
        title: 'note',
        desc1: 'Your ACP plan is being activated. This might take few moments to process. Please refresh the page or check again later!',
        desc2: null,
        desc3: null,
        primaryButtonName: null,
        primaryButtonAction: null,
        secondaryButtonName: null,
        secondaryButtonAction: null,
      },
      'ENROLLED': {
        title: 'Note:',
        desc1: 'Your ACP plan is active.',
        desc2: 'This plan is linked to the following phone number:',
        desc3: `<b>Phone Number/MDN:</b><br> ${(new PhonePipe()).transform(this.acpPlan?.mdn)}`,
        desc4: !!this.acpDeviceOrder ? (this.acpDeviceOrder?.status === 'SHIPPED' ? ` <b>Your ACP Device:</b><br> <span>Device <b>successfully</b> collected!</span>` : this.acpDeviceOrder?.status === 'PENDING' ? ` <b>Your ACP Device:</b><br><span>Your device order has been <b>successfully</b> placed!<br>
        You may now proceed and <b>collect</b> your device at your nearest store.</span>`: null) : null,
        desc5: !!this.acpDeviceOrder && this.acpDeviceOrder?.status === 'PENDING' ? !!this.showStores ? `<span class="text-color-primary pointer tertiary"><b>Hide Stores<b></span>` : `<span class="text-color-primary pointer tertiary"><b> Show Stores</b></span>` : (!!this.acpDeviceOrder && (this.acpDeviceOrder?.status === 'SHIPPED')) ? `<span class="break"><b>Device IMEI</b><br><span>${this.deviceIMEI}</span></span>` : null,
        showSeparator: true,
        primaryButtonName: null,
        primaryButtonAction: null,
        secondaryButtonName: null,
        secondaryButtonAction: null,
        linkName: 'Manage ACP Plan',
        linkAction: 'showManageEnrollmentModal',
        pendingWidth: false,
        onHoldWidth: false,
        topBottomClass: true,
        longClass: true,
        descAction: 'toggleStoresView'
      }
    }
    this.NV_DESCS = {
      'COMPLETE': {
        title: null,
        desc1: 'Your application was successfully verified by the National Verifier.',
        desc2: null,
        desc3: null,
        desc4: null,
        buttonName: null,
        buttonAction: null,
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'PENDING_RESOLUTION': {
        title: 'Action Required:',
        desc1: `Upload copies of your proof documentation:`,
        desc2: `Please select <b>“Resume Filing”</b> to be redirected to the National Verifier.`,
        desc3: `Once you are done, the National Verifier will redirect you back to Good Mobile to complete the process.`,
        desc4: `<b>Please make sure to complete this step within 45 days.</b>`,
        buttonName: 'Resume Filing',
        buttonAction: 'goToAcp',
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'PENDING_CERT': {
        title: 'Action Required:',
        desc1: `Upload copies of your proof documentation:`,
        desc2: `Please select <b>“Resume Filing”</b> to be redirected to the National Verifier.`,
        desc3: `Once you are done, the National Verifier will redirect you back to Good Mobile to complete the process.`,
        desc4: `<b>Please make sure to complete this step within 45 days.</b>`,
        buttonName: 'Resume Filing',
        buttonAction: 'goToAcp',
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'IN_PROGRESS': {
        title: 'Please Check Back Soon!',
        desc1: `<b>You have submitted your ACP application successfully.</b> Updates on your
        application status will show up on this page.`,
        desc2: `<b>Please check again later!</b>`,
        desc3: null,
        desc4: null,
        buttonName: 'Refresh',
        buttonAction: 'refresh',
        linkName: null,
        linkAction: null,
        disabledCondition: 'isRefreshClicked',
        noteCondition: 'isRefreshClicked',
        note: `You can refresh again in ${this.minutes}:${this.seconds} minutes.`,
        longClass: false
      },
      'PENDING_REVIEW': {
        title: 'Under Review!',
        desc1: `Your ACP application is currently under review.`,
        desc2: `Please contact <a href="mailto:ACProgram@usac.org"><b>ACProgram@usac.org</b></a> to
        check on your application status before
        finish the enrollment with Good Mobile.`,
        desc3: null,
        desc4: null,
        buttonName: 'Refresh',
        buttonAction: 'refresh',
        linkName: null,
        linkAction: null,
        disabledCondition: 'isRefreshClicked',
        noteCondition: 'isRefreshClicked',
        note: `You can refresh again in ${this.minutes}:${this.seconds} minutes.`,
        longClass: false
      },
      'PENDING_ELIGIBILITY': {
        title: 'Action Required:',
        desc1: `Please check your information again or provide more details to the National Verifier
        to proceed with your ACP application.`,
        desc2: `Please select “Cancel Application” if you’d like to withdraw your application.`,
        desc3: null,
        desc4: null,
        buttonName: 'Go to National Verifier',
        buttonAction: 'goToNationalVerifier',
        linkName: 'Cancel Application',
        linkAction: 'cancelApplication',
        disabledCondition: 'isRefreshClicked',
        noteCondition: null,
        note: null,
        longClass: true
      },
      'PENDING': {
        title: 'Attention!',
        desc1: `It seems like you <b>have not completed your ACP application with the National
        Verifier</b> yet. Please visit <a href="https://www.affordableconnectivity.gov/"
        target="_blank"><b>ACPbenefit.org</b></a> to complete your application before
        finish the enrollment with Good Mobile.`,
        desc2: null,
        desc3: null,
        desc4: null,
        buttonName: null,
        buttonAction: null,
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'EXPIRED': {
        title: 'Expired ACP Application',
        desc1: `Sorry, <b>your ACP application isn’t available!</b>`,
        desc2: `It may have already been expired because it is too old.`,
        desc3: `<b>No problem!</b>`,
        desc4: `You can always try starting again and enjoy your <b>6GB</b> FREE Cell Phone Service
        with <span class="bold-nowrap">Good Mobile!</span>`,
        buttonName: 'Apply Now',
        buttonAction: 'applyNow',
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'NV_ERROR': {
        title: 'Sorry for the inconvenience!',
        desc1: `The National Verifier is currently unavailable. Please check back soon.`,
        desc2: null,
        desc3: null,
        desc4: null,
        buttonName: null,
        buttonAction: null,
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      },
      'GENERIC': {
        title: 'We are Sorry!',
        desc1: `We are unable to approve your Request at this time.`,
        desc2: `Please contact customer care for more help.`,
        desc3: null,
        desc4: null,
        buttonName: `Contact Us`,
        buttonAction: `goToContactUs`,
        linkName: null,
        linkAction: null,
        disabledCondition: null,
        noteCondition: null,
        note: null,
        longClass: false
      }
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public toggleStoresView(): void {
    this.showStores = !this.showStores;
  }
  public activatePlan(): void {
    if (!this.isActivatedAcpPlan && this.acpPlan) {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.acpPlan.id;
      if (!!this.acpPlan && !!this.acpPlan.planDevice && !!this.acpPlan.planDevice.id) {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHOOSE_ACTIVATION_PATH}`, params]);
      } else {
        this.router.navigate([`${ACTIVATION_ROUTE_URLS.BASE}/${ACTIVATION_ROUTE_URLS.CHECK_PHONE}`, params]);
      }
    }
  }

  public cancelApplication(): void {
    if (!!this.userProfile) {
      this.modalHelper.showConfirmMessageModal('Are you sure you want to cancel application?', 'By clicking yes you agree to cancel your ACP application.', 'Yes', 'Cancel', 'clear-cart-modal')
        .afterClosed().subscribe((res) => {
          if (!!res) {
            this.appState.loading = true;
            this.ebbService.getInternalApplication(this.userProfile.customerId, this.userProfile.ebbId).then((res) => {
              if (!!res) {
                this.ebbService.deleteAcpApplication(this.userProfile.customerId, res.data.applicationId).then(() => {
                  delete this.userProfile.ebbId;
                  this.userAccountService.deleteEbb().then(() => {
                    this.ebbService.deleteEbbData(this.userProfile?.id);
                    this.appState.loading = false;
                    this.toastHelper.showSuccess('Your application is cancelled successfully');
                    this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
                  }).catch((error) => {
                    this.appState.loading = false;
                    this.toastHelper.showAlert(error.message);
                  });
                }, (error) => {
                  this.appState.loading = false;
                  this.toastHelper.showAlert(error.message);
                });
              }
            }, (error) => {
              this.appState.loading = false;
              this.toastHelper.showAlert(error.message);
            });

          }
        });
    }
  }

  public refresh(): void {
    this.getVerificationDetails();
    this.isRefreshClicked = true;
    this.timer();
    this.refreshInterval();
  }

  public showManageEnrollmentModal(): void {
    const customHtml = `<p>You can always manage your ACP plan from your <b>Account Summary</b> Page.<br>
      Changing or Cancelling your ACP plan will cause immediate <b>termination</b> for your ACP benefits.</p>
      <p>Please proceed with caution.</p>`
    this.modalHelper.showInformationMessageModal('Heads up!', '',
      'Account Summary', null, true, 'manage-enrollment-modal', customHtml, false, null)
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.goToAccountSummary();
        }
      });
  }
  public cancelPlan(): void {
    if (!!this.userAccount && !!this.acpPlan && !this.acpPlan.portInRequestNumber && !this.acpPlan.canceledOnExpiry && !this.acpPlan.canceled) {
      const params = {};
      params[ROUTE_URLS.PARAMS.USER_PLAN_ID] = this.acpPlan.id;
      this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.CANCEL_PLAN}`, params]);
    }
  }

  public cancelOrder(): void {
    this.modalHelper.showConfirmMessageModal('Cancel order', 'Are you sure you want to cancel your order ?',
      'Yes', 'No', 'clean-cart-modal')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.appState.loading = true;
          this.accountOrderService.cancelWithRefund(this.acpPlan?.orderId).then((order) => {
            if (!!order) {
              this.appState.loading = false;
              this.toastHelper.showSuccess('Your order has been canceled successfully!');
              this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.ORDERS}`]);
            }
          }).catch((error) => {
            this.appState.loading = false;
            this.toastHelper.showAlert(error.message);
          });
        }
      });
  }

  public goToAccountSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }

  public goToNationalVerifier(): void {
    window.open('https://acpbenefit.org/do-i-qualify/', '_self');
    this.appState.loading = true;
  }

  public applyNow(): void {
    if (!!this.userProfile) {
      this.appState.loading = true;
      delete this.userProfile.ebbId;
      this.userAccountService.deleteEbb().then(() => {
        this.ebbService.deleteEbbData(this.userProfile?.id);
        this.appState.loading = false;
        this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
      }).catch((error) => {
        this.appState.loading = false;
        this.toastHelper.showAlert(error.message);
      });
    }
  }
  public addNewLine(): void {
    this.router.navigate([`${ACP_ROUTE_URLS.BASE}/${ACP_ROUTE_URLS.ENROLLMENT_NEW_LINE}`]);
  }
  public selectExistingLine(): void {
    this.router.navigate([`${ACP_ROUTE_URLS.BASE}/${ACP_ROUTE_URLS.ENROLLMENT_EXISTING_LINE}`]);
  }
  public goToAcp(): void {
    window.open(`${this.verificationDetails?.link}`, "_self");
  }
  public goToAcpForm(): void {
    this.router.navigate([`${ACP_ROUTE_URLS.BASE}`]);
  }
  public goToContactUs(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.CONTACT_US}`]);
  }
  public showBarCodePopup(): void {
    this.modalHelper.showBarcodeModal('Scan the barcode', 'Take this barcode with instructions below to your Goodwill store clerk to collect your Device.', this.barCodeValue, 'Your ACP ID:', this.barCodeValue);
  }
  public goToAcpDevices(): void {
    this.showDeviceOptionError = !!this.option ? false : true;
    if (!!this.option) {
      if (this.option === 'online') {
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.ACP_DEVICES}`]);
      } else {
        this.showBarCodePopup();
      }
    }
  }
  public downloadFiles(): void {
    if (this.fileUrls.length > 0) {
      for (const fileUrl of this.fileUrls) {
        const link = document.createElement('a');
        link.setAttribute('href', fileUrl);
        link.setAttribute('download', '');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  public selectDeviceOption(value): void {
    this.option = value;
    this.showDeviceOptionError = false;
  }

  public toggleDeviceCode(): void {
    this.showDeviceCode = !this.showDeviceCode;
    this.showACPCodeSection = !this.showDeviceCode ? true : false;
  }
  public toggleACPCode(): void {
    this.showACPCodeSection = !this.showACPCodeSection;
    this.showDeviceCode = false;
  }
  private checkDocGroups(data): void {
    const selectedCodes = data?.eligibilityCode.split(",");
    // check if some of the common codes related to generic group are selected 
    const commonCondition = selectedCodes.some(obj => obj === 'E54' || obj === 'E3' || obj === 'E4' || obj === 'E15' || obj === 'E8' || obj === 'E9' || obj === 'E10');
    // check the generic group
    if (commonCondition) {
      this.fileUrls.push('/assets/GM-Generic.pdf');
    }
    // another case for generic
    if (!commonCondition && selectedCodes.some(obj => obj === 'E1') && selectedCodes.some(obj => obj === 'E2')) {
      this.fileUrls.push('/assets/GM-Generic.pdf');
    }
    // check SNAP group
    if (!commonCondition && selectedCodes.some(obj => obj === 'E2') && !selectedCodes.some(obj => obj === 'E1')) {
      this.fileUrls.push('/assets/GM-SNAP.pdf');
    }
    // check Medicaid group
    if (!commonCondition && selectedCodes.some(obj => obj === 'E1') && !selectedCodes.some(obj => obj === 'E2')) {
      this.fileUrls.push('/assets/GM-Medicaid.pdf');
    }
    // check pell grant group
    if (selectedCodes.some(obj => obj === 'E50' || obj === 'E51')) {
      this.fileUrls.push('/assets/GM-PellGrant.pdf');
    }
    // check income group
    if (selectedCodes.some(obj => obj === 'E13')) {
      this.fileUrls.push('/assets/GM-Through Income copy.pdf');
    }
  }
  private getInternalData(): void {
    this.ebbService.getInternalApplication(this.userProfile.customerId, this.userProfile.ebbId).then((res) => {
      if (!!res) {
        this.internalData = res.data;
        this.checkDocGroups(this.internalData);
      }
    }, (error) => {
      this.appState.loading = false;
    });
  }
  private getVerificationDetails(): void {
    this.userProfileService.userProfileObservable.subscribe((user) => {
      this.userProfile = user;
      this.barCodeValue = !!this.userProfile?.ebbId ? `${this.userProfile?.ebbId}` : null;
      if (!!this.userProfile && !this.userProfile.ebbId && !this.acpPlan) {
        this.appState.loading = true;
        this.appState.acpActiveAppResObs.subscribe(res => {
          if (!!res) {
            this.acpAppDetails = res;
            this.createdDate = res.createdAt;
            this.appState.loading = false;
            this.appStatus = 'In Progress';
            this.showAcpApplicationCard = true;
          } else {
            this.appStatus = 'On Hold';
            this.showAlert = true;
            this.showAcpApplicationCard = true;
            this.appState.loading = false;
          }
        });
      } else if (!!this.userProfile && !!this.userProfile.ebbId) {
        this.appState.loading = true;
        this.barCodeValue = this.userProfile.ebbId;
        this.userPlansService.userPlans.pipe(takeWhile(() => this.alive), filter((plans) => !!plans)).subscribe((plans) => {
          if (!!plans) {
            this.acpPlan = plans.find((plan) => !!plan.basePlan.ebb && !plan.canceled);
            this.isActivatedAcpPlan = !!this.acpPlan?.mdn ? true : false;
            this.activePlans = plans.filter(
              (plan) =>
                !!plan.mdn &&
                !plan.portInRequestNumber &&
                !plan.canceled
            );
            if (!!this.acpPlan && this.acpPlan.mdn) {
              if (!!this.acpPlan.acpDevice && !!this.acpPlan.acpDevice.orderId) {
                this.appState.loading = true;
                this.getACPDeviceOrder(this.acpPlan.acpDevice.orderId);
                this.canPurchaseADevice = false;
              } else {
                this.appState.loading = true;
                if (!this.dataCollected) {
                  this.ebbService.getDeviceEligibility(this.userProfile.ebbId).then((data) => {
                    this.dataCollected = true;
                    this.canPurchaseADevice = data?.canPurchaseADevice;
                    this.nextPurchaseDate = !!data.nextEnrollmentTryDate ? new Date(data.nextEnrollmentTryDate) : null;
                    if (!!data?.canPurchaseADevice || (!data.canPurchaseADevice && !!data.nextEnrollmentTryDate)) {
                      this.acpDeviceCase = 'ENROLLED_ACP_CASE';
                      this.acpDeviceOrder = null;
                      this.appState.loading = false;
                    } else {
                      this.ebbService.getACPDeviceDetails(this.userProfile.ebbId, this.userProfile.customerId).then((devices) => {
                        if (!!devices) {
                          this.getACPDeviceOrder(devices[0].orderId);
                          this.appState.loading = false;
                          this.acpPlan.acpDevice = devices[0];
                          this.userPlansService.updateUserPlan(this.userProfile.id, this.acpPlan);
                        }
                      }, (error) => {
                        this.toastHelper.showAlert(error.error.errors[0].message);
                      })
                    }
                  })
                }
              }
            }
            if (!!this.isActivatedAcpPlan) {
              this.showAcpPlanActivationCard = true;
              this.ebbService.getInternalApplication(user.customerId, user.ebbId).then((res) => {
                if (!!res) {
                  this.verificationDetails = res.data;
                  this.createdDate = res.data.createdAt;
                  this.showNVCard = true;
                  this.nvStatus = this.ACP_STATUS.COMPLETE;
                  this.showSPCard = true;
                  this.hideSuccessBanner();
                  this.appState.loading = false;
                  this.hideCardContentSP = true;
                  this.hideCardContentNV = true;
                }
              }, (error) => {
                this.appState.loading = false;
              });
              this.userAccountService.userAccounts.pipe(take(1)).subscribe((accounts) => {
                const account = accounts.find((planAccount) => planAccount.mdn === this.acpPlan.mdn);
                if (!!account) {
                  this.userAccount = account;
                }
              });
              this.appDetails.updatedAt = this.acpPlan?.updatedAt;
              this.planActivationStatus = 'ENROLLED';
              this.hideActionLink = false;
              sessionStorage.removeItem('waitingAcpActivation');
            } else {
              this.appState.acpAppRes.subscribe(details => {
                this.appState.loading = false;
                if (!!details) {
                  this.appDetails = details;
                  this.createdDate = details.createdAt;
                  this.providerApplicationID = details.providerApplicationId;
                  if (details.status === this.ACP_STATUS.COMPLETE) {
                    this.showSPCard = true;
                    this.hideSuccessBanner();
                    this.hideCardContentSP = true;
                    this.hideCardContentNV = true;

                    if (!this.acpPlan) {
                      this.showAcpPlanActivationCard = true;
                      if (!!this.activePlans && this.activePlans.length > 0) {
                        this.planActivationStatus = 'PENDING_WITH_MDN';
                      } else {
                        this.planActivationStatus = 'PENDING';
                      }
                      this.hideActionLink = false;
                    } else {
                      if (!!this.acpPlan.orderId) {
                        this.appState.loading = true;
                        this.accountOrderService.getOrderById(this.acpPlan.orderId).then((order) => {
                          this.acpCancelled = !!order && order.status === 'CANCELED' ? true : false;
                          if (!!order?.deliveryMethod && order?.deliveryMethod === 'inPersonDelivery') {
                            this.isInPersonDelivery = true;
                          } else {
                            this.isInPersonDelivery = false;
                          }
                          this.showAttentionBanner = false;
                          this.planActivationStatus = 'PENDING_ACTIVATION';
                          if (!!this.isInPersonDelivery) {
                            this.hideActionLink = true;
                          } else {
                            this.hideActionLink = false;
                          }
                          this.showAcpPlanActivationCard = true;
                          // case specific for add existing plan flow
                          const isWaitingAcpActivationResponse = sessionStorage.getItem('waitingAcpActivation');
                          if (!!isWaitingAcpActivationResponse) {
                            this.showAttentionBanner = false;
                            this.planActivationStatus = 'WAITING_ACTIVATION_RESULT';
                            this.hideActionLink = false;
                            this.showAcpPlanActivationCard = true;
                          }
                          this.appState.loading = false;
                        }, (error) => {
                          this.acpCancelled = false;
                          this.appState.loading = false;
                        });
                      }
                    }
                    this.acpDeviceCase = 'PENDING_ACP_CASE';
                  }
                  this.showNVCard = true;
                  this.verificationDetails = details;
                  this.createdDate = details.createdAt;
                  this.nvStatus = this.verificationDetails?.status;
                  if (!!this.nvStatus && this.nvStatus !== this.ACP_STATUS.COMPLETE) {
                    this.acpDeviceCase = 'PENDING_NV_CASE';
                  }
                  if (this.verificationDetails?.status === this.ACP_STATUS.PENDING_CERT || this.verificationDetails?.status === this.ACP_STATUS.PENDING_RESOLUTION) {
                    this.showQrCode = true;
                    this.getInternalData();
                  } else {
                    this.showQrCode = false;
                  }
                  if (this.verificationDetails?.status === this.ACP_STATUS.PENDING_CERT || this.verificationDetails?.status === this.ACP_STATUS.IN_PROGRESS || this.verificationDetails?.status === 'PENDING_ELIGIBILITY') {
                    this.showCardDesc = true;
                    if (!!this.acpPlan) {
                      this.showAttentionBanner = true;
                      this.showAcpPlanActivationCard = false;
                    }
                  }
                  if (!!this.acpPlan && (this.verificationDetails?.status === this.ACP_STATUS.PENDING_RESOLUTION || this.verificationDetails?.status === this.ACP_STATUS.PENDING_REVIEW)) {
                    this.showAttentionBanner = true;
                    this.showAcpPlanActivationCard = false;
                  }
                  if (this.verificationDetails?.status === this.ACP_STATUS.PENDING_RESOLUTION && !this.verificationDetails?.link) {
                    this.nvStatus = this.ACP_STATUS.PENDING;
                  } else if (this.verificationDetails?.status === this.ACP_STATUS.PENDING_RESOLUTION && !!this.verificationDetails?.link) {
                    this.showCardDesc = true;
                  }
                  if (this.verificationDetails?.status === 'PENDING_ELIGIBILITY') {
                    this.showNVOnHoldSection = true;
                    this.showAlert = true;
                  } else {
                    this.showNVOnHoldSection = false;
                  }
                } else {
                  this.showNVCard = true;
                  this.showAlert = true;
                  this.appState.acpAppErrorObs.subscribe(error => {
                    if (!!error && error.error.errors[0].code === 'APP_CLOSED_OR_EXPIRED') {
                      this.showExpiredSection = true;
                      this.nvStatus = 'EXPIRED';
                      if (!!this.acpPlan) {
                        // Get old data
                        this.getInternalAppDataForExpiredApps();
                      }
                    } else if (!!error && error.error.errors[0].code === '1421') {
                      this.showNVErrorSection = true;
                      this.nvStatus = 'NV_ERROR';
                    } else {
                      this.showGenericError = true;
                      this.nvStatus = 'GENERIC';
                    }
                    this.appState.loading = false;
                  });
                }
              });
            }
          }
        });
      } else {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      }
    });
  }

  private getInternalAppDataForExpiredApps(): void {
    this.appState.loading = true;
    this.ebbService.getInternalApplication(this.userProfile.customerId, this.userProfile.ebbId).then((res) => {
      if (!!res && !!res?.data) {
        this.oldUserData = _.cloneDeep(res.data);
        if (!!this.oldUserData) {
          // Delete old ACP application
          this.deleteAndCreateAcpApplication(this.oldUserData, this.oldUserData?.applicationId);
        }
      }
    }, (error) => {
      this.appState.loading = false;
    });
  }

  private deleteAndCreateAcpApplication(oldUserData, appId): void {
    this.appState.loading = true;
    this.ebbService.deleteAcpApplication(this.userProfile.customerId, appId).then(() => {
      // Create a new ACP application
      this.createInternalApplication(oldUserData);
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message);
    });
  }

  private createInternalApplication(oldUserData): void {
    if (!!oldUserData) {
      this.appState.loading = true;
      const acpDetails = {
        brand: 'goodmobile',
        applicationId: oldUserData?.appId,
        customerId: this.userProfile?.customerId,
        eligibilityCode: oldUserData?.eligibilityCode,
        schoolName: oldUserData?.schoolName,
        publicHousingCode: oldUserData?.publicHousingCode,
        signature: oldUserData?.signature,
        user: oldUserData?.user,
        bqpUser: oldUserData?.bqpUser
      } as IAcpDetails;
      this.ebbService.createInternalApplication(acpDetails).then(
        (res) => {
          this.appState.loading = false;
          if (res?.applicationId) {
            const applicationId = res?.applicationId;
            // Call the verify ACP
            this.callVerifyAcp(applicationId);
          }
        },
        (error) => {
          this.appState.loading = false;
        }
      );
    }
  }

  private callVerifyAcp(appId): void {
    this.appState.loading = true;
    const appData: IAppDetails = {
      customerId: this.userProfile?.customerId,
      applicationId: appId,
      command: 'CreateNewACPCommand'
    };
    if (!!appData) {
      this.ebbService.verifyACPWithOrWithoutAppIdInternally(appData).then((result) => {
        this.appState.loading = false;
        // Post API, so we will use id not appId because its returned from the post API as id
        if (!!result && !!result?.ebbId) {
          this.userProfileService.userProfileObservable
            .pipe(take(1))
            .subscribe((profile) => {
              if (!!profile) {
                profile.ebbId = result.ebbId;
                // bff needs the eebid , and the user id ,so we must sent the profile data
                this.userProfileService.bffUpdateUserProfile(profile);
                this.showAcpPlanActivationCard = false;
                this.showAttentionBanner = true;
                this.showExpiredSection = false;
                // call get acp status again 
                this.getVerificationDetails();
              }
            });
        }
      },
        (error) => {
          this.appState.loading = false;
        }
      );
    }
  }

  private refreshInterval(): void {
    this.interval = setInterval(() => {
      this.timeLeft = this.timeLeft - 1000;
      sessionStorage.setItem('refreshTime', JSON.stringify(this.timeLeft));
      if (this.timeLeft > 0) {
        this.timer();
      } else if (this.timeLeft === 0) {
        this.isRefreshClicked = false;
        this.stopTimer();
        this.timeLeft = 300000; // 5 Minutes
      }
    }, 1000)
  }
  private stopTimer() {
    if (this.timer) {
      clearInterval(this.interval);
    }
  }
  private timer(): void {
    this.seconds = Math.floor(this.timeLeft / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.minutes %= 60;
    this.seconds %= 60;
    this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
  }

  private getACPDeviceOrder(orderID): void {
    this.accountOrderService.getOrderById(orderID).then((order) => {
      this.acpDeviceOrder = order;
      this.pendingACPDevice = !!this.acpDeviceOrder && this.acpDeviceOrder.status === 'PENDING' ? true : false;
      const deviceOrder: any = this.acpDeviceOrder;
      this.deviceIMEI = this.acpDeviceOrder.status === 'SHIPPED' && !!this.acpDeviceOrder.devices && this.acpDeviceOrder.devices.length > 0 ? deviceOrder.devices[0].imei : null;
    }, (error) => {
      this.acpDeviceOrder = null
    });
  }
}
