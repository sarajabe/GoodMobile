import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPhonesList, ManufacturerConfigurationService, UserDeviceService } from '@ztarmobile/zwp-service-backend';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS } from 'src/app/app.routes.names';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { ContentfulService } from 'src/services/contentful.service';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { take } from 'rxjs/operators';
import { PageScrollService } from 'ngx-page-scroll-core';
@Component({
  selector: 'app-shutdown',
  templateUrl: './shutdown.component.html',
  styleUrls: ['./shutdown.component.scss']
})
export class ShutdownComponent implements OnInit {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;
  @ViewChild('reCaptchaImei') reCaptchaImei: ReCaptchaComponent;
  public shutdown3G: any;
  public checkMDNForm: FormGroup;
  public checkIMEIForm: FormGroup;
  public captchaValid = false;
  public secondcaptchaValid = false;
  public SITE_ID = CAPTCHA_SITE_ID;
  public processingRequest = false;
  public secondProcessingRequest = false;
  public zipCode = '';
  public IMEINumber = '';
  public phoneNumber = '';
  public phonesList: IPhonesList[];
  public uniqueManufacturer = [];
  public phonesModelNumber = [];
  public headerSection: any;
  public howToSwitchYourSimCard: any;
  public newPhones: any;
  public verifyingYour4gPhone: any;
  public whatAboutEbay: any;
  public whatAboutMySim: any;
  public whatItMeansSection: any;
  public whatToLook: any;
  public manufacturer: string;
  public captchaResponse: string;
  public showPhoneNotWorkingSection = false;
  public phoneNotWorking: any;
  private secondcaptchaResponse: string;

  constructor(
    public router: Router,
    private contentfulService: ContentfulService,
    private formBuilder: FormBuilder,
    public userDevice: UserDeviceService,
    private modalHelper: ModalHelperService,
    private toastHelper: ToastrHelperService,
    private manufacturerConfiguration: ManufacturerConfigurationService,
    private pageScrollService: PageScrollService) {
    this.checkMDNForm = formBuilder.group({
      checkMDN: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[1-9][0-9]*$/)])]
    });
    this.checkIMEIForm = formBuilder.group({
      zipCode: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10), Validators.pattern(/^\d{5}(-\d{4})?$/)])],
      checkIMEI: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(18), Validators.pattern(/(?=\d{11,18}$)/)])],
    });
  }
  ngOnInit(): void {
    this.shutdown3G = this.contentfulService.getContent('shutdownPage3g');
    this.contentfulService.getContent('shutdownPage3g').subscribe(result => {
      if (!!result) {
        this.headerSection = this.callRichTextContent(result[0].fields.headerSection);
        this.whatItMeansSection = this.callRichTextContent(result[0].fields.whatItMeansSection);
        this.newPhones = this.callRichTextContent(result[0].fields.newPhones);
        this.verifyingYour4gPhone = this.callRichTextContent(result[0].fields.verifyingYour4gPhone);
        this.whatAboutMySim = this.callRichTextContent(result[0].fields.whatAboutMySim);
        this.howToSwitchYourSimCard = this.callRichTextContent(result[0].fields.howToSwitchYourSimCard);
        this.whatToLook = this.callRichTextContent(result[0].fields.whatToLlokForBuyingANewPhone);
        this.phoneNotWorking = this.callRichTextContent(result[0].fields.myPhoneStillNotWorking);
      }
    });
    this.manufacturerConfiguration.phonesList.pipe(take(1)).subscribe(res => {
      if (!!res) {
        this.phonesList = res.filter(item => item.productType === 'Phone');
        this.uniqueManufacturer = [...new Set(this.phonesList.map(item => item.manufacturer))];
      }
    });
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public showWhatIsIMEI(): void {
    this.modalHelper.showInformationMessageModal('3 Ways to find your MEID or IMEI', '', 'Got it', null,
      true, 'compatibility-help-modal-IME ',
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
      </div>`);
  }
  public secondResolvedCaptcha(secondcaptchaResponse: string): void {
    this.secondcaptchaResponse = secondcaptchaResponse;
    this.secondcaptchaValid = !!secondcaptchaResponse;
  }
  public checkMDNValidation(): void {
    this.checkMDNForm.markAllAsTouched();
    this.phoneNumber = this.checkMDNForm.controls.checkMDN.value;
    if (this.checkMDNForm.valid && this.captchaValid) {
      this.processingRequest = true;
      this.userDevice.checkDeviceCompatabilityWithMdn(this.phoneNumber, this.captchaResponse).then((res) => {
        if (!!res) {
          this.processingRequest = false;
          this.modalHelper.showNotImpactedModal(`The Phone/Device for this phone number is not impacted, no action necessary!`,
            `Your current phone/device registered on the network is showing VoLTE capable, so this phone will continue to work after the 3G shutdown.`
            , 'impacted-modal').result.then(result => {
              if (!!result) {
                this.processingRequest = false;
                if (result === 'summary') {
                  this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
                } else {
                  this.showPhoneNotWorkingSection = true;
                  setTimeout(() => {
                    this.pageScrollService.scroll({
                      document,
                      scrollTarget: '.phone-not-working',
                      scrollOffset: 100,
                      speed: 200
                    });
                  }, 500);
                  this.checkMDNForm.reset();
                  this.captchaResponse = '';
                  this.reCaptcha.resetReCaptcha();
                }
              } else {
                this.checkMDNForm.reset();
                this.captchaResponse = '';
                this.reCaptcha.resetReCaptcha();
              }
            });
        }
      }, (error) => {
        this.processingRequest = false;
        if (error.error?.status === 4015) {
          this.modalHelper.showConfirmMessageModal(`The Phone/Device for this phone number IS impacted.`, `
          Network shows that your phone may be impacted by the AT&T 3G network shutdown and will cease to work after 2/22/22.
           If you think your phone is VoLTE capable, and want to enter your phone’s IMEI please select the ‘Check my IMEI’ button.
          To see a list of phone models which are VoLTE compatible and capable, select the ‘See what phone models will work’ button.
          When looking for a new phone, make sure the phone description is listed as ‘Unlocked’.`, 'See what phone models will work', 'Go back to the 3G shutdown page', 'impacted-modal')
            .result.then(result => {
              if (!!result) {
                this.pageScrollService.scroll({
                  document,
                  scrollTarget: '.cc-device-header',
                  scrollOffset: 541,
                  speed: 200
                });
                this.checkMDNForm.reset();
                this.captchaResponse = '';
                this.reCaptcha.resetReCaptcha();
              }
              else {
                this.checkMDNForm.reset();
                this.captchaResponse = '';
                this.reCaptcha.resetReCaptcha();
              }
            });
        }
        else {
          this.modalHelper.showInformationMessageModal('Invalid mobile number', '', 'Got it', null,
            false, 'compatibility-help-modal-IME ',
            `<div class="description-content">
      <div class="intro">
         <div class="note-dial"> <b>The number you entered is not a valid GoodMobile number, please enter a valid GoodMobile number</b></div>
        </div>`).result.then(result => {
              if (!!result) {
                this.checkMDNForm.reset();
                this.captchaResponse = '';
                this.reCaptcha.resetReCaptcha();
              }
              else {
                this.checkMDNForm.reset();
                this.captchaResponse = '';
                this.reCaptcha.resetReCaptcha();
              }
            });
        }
      });
    }
  }
  public checkIMEIValidation(): void {
    this.checkIMEIForm.markAllAsTouched();
    if (this.checkIMEIForm.valid && this.secondcaptchaValid) {
      this.secondProcessingRequest = true;
      this.zipCode = this.checkIMEIForm.controls.zipCode.value;
      this.IMEINumber = this.checkIMEIForm.controls.checkIMEI.value;
      this.userDevice.isSupportedDeviceWithZipCode(this.IMEINumber, this.zipCode, 'att', this.secondcaptchaResponse).then((result) => {
        if (!!result) {
          this.secondProcessingRequest = false;
          this.modalHelper.showInformationMessageModal('All good!', '', 'Continue', null, true, 'successPhoneModal', 'Your Device is compatible!');
        }
      }, (error) => {
        this.secondProcessingRequest = false;
        this.toastHelper.showAlert(error.error.message || error);
        console.error(error);
        this.checkIMEIForm.reset();
        this.secondcaptchaResponse = '';
        this.reCaptchaImei.resetReCaptcha();
      });
    }
  }
  public resetForm(formName): void {
    switch (formName) {
      case 'mdn':
        this.checkMDNForm.reset();
        break;
      case 'imei':
        this.checkIMEIForm.reset();
        break;
    }
  }
  public checkSelected(): void {
    if (!!this.manufacturer) {
      const selectedManufacturer = this.phonesList.filter(item => item.manufacturer === this.manufacturer);
      this.phonesModelNumber = selectedManufacturer.map(item => item.modelNumber);
    }
  }
  private callRichTextContent(richText): void {
    return this.contentfulService.getRichTextWithOptions(richText);
  }
}
