import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { ModalHelperService } from '../../../../../services/modal-helper.service';

@Component({
  selector: 'app-ios-gsm',
  templateUrl: './gsm.component.html',
  styleUrls: ['./gsm.component.scss']
})
export class IosGsmComponent {
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;
  @Output() backToMain: EventEmitter<boolean> = new EventEmitter();
  public customHTML = '<div class="flex-phone-display"><div class="steps"><p>1. Click on the highlighted link shown below.</p></div> ' +
    '<div><img class="step-image" src="assets/img/step1.png"></div></div>';
  public customHTML2 = '<div class="flex-phone-display"><div class="steps">' +
    '<p>2. After approving the configuration profile to download, a file will be downloaded to your iPhone device. </p></div>' +
    '<div><img class="step-image" src="assets/img/step2.png"></div></div>';
  public customHTML3 = '<div class="flex-phone-display"><div class="steps"><p>3. Go to your iPhone’s Settings and Click on ‘General’. </p></div>' +
    '<div><img class="step-image" src="assets/img/step3.png"></div></div>';
  public customHTML4 = '<div class="flex-phone-display"><div class="steps"><p>4. Go to ‘Profile’ from your General Settings. </p></div>' +
    '<div><img class="step-image" src="assets/img/step4.png"></div></div>';
  public customHTML5 = `<div class="flex-phone-display"><div class="steps"><p>5. Next,
  click on the Good Mobile LTE Data Settings tab to configure your iPhone LTE settings.</p></div>` +
    '<div><img class="step-image" src="assets/img/step5.png"></div></div>';
  public customHTML6 = '<div class="flex-phone-display"><div class="steps"><p>6. Click on ‘Install’ to install the LTE iPhone configuration settings on your device.</p></div>' +
    '<div><img class="step-image" src="assets/img/step6.png"></div></div>';
  public customHTML7 = '<div class="flex-phone-display"><div class="steps"><p>7. You will be asked for your device password.</p></div>' +
    '<div><img class="step-image" src="assets/img/step7.png"></div></div>';
  public customHTML8 = '<div class="flex-phone-display"><div class="steps"><p>8. Click ‘Install’ on the top right.</p></div>' +
    '<div><img class="step-image" src="assets/img/step8.png"></div></div>';
  public customHTML9 = '<div class="flex-phone-display"><div class="steps"><p>9. Click ‘Install’ again to confirm.</p></div>' +
    '<div><img class="step-image" src="assets/img/step9.png"></div></div>';
  public customHTML10 = '<div class="flex-phone-display">' +
    '<div class="steps"><p>10. You’re done! The iPhone LTE Data Settings have been successfully downloaded to your device, you can now enjoy your Good Mobile service.</p></div>' +
    '<div><img class="step-image" src="assets/img/step10.png"></div></div>';
  constructor(private modalHelper: ModalHelperService, private router: Router) { }
  public done(): void {
    this.backToMain.emit(true);
  }
  public showLTEsettingPopUp(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML, true, 'Next')
      .result.then((result) => {
        if (result) {
          // nothing to do in first step for back button
        }
        else {
          this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
            '',
            'Back', null, true, 'ios-setup-modal', this.customHTML2, true, 'Next')
            // tslint:disable-next-line:no-shadowed-variable
            .result.then((result) => {
              if (result) {
                this.showStep1(this.customHTML);
              }
              else {
                this.showStep3();

              }
            }, (error) => {
              console.error('error step', error);
            });
        }
      }, (error) => {
        console.error('error', error);
      });
  }
  public showStep1(customHTMLStep1): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', customHTMLStep1, true, 'Next')
      .result.then((result) => {
        if (result) {
          // nothing to do in first step for back button
        }
        else {
          this.showStep2();
        }
      }, (error) => {
        console.error('error', error);
      });
  }
  public showStep2(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML2, true, 'Next')
      .result.then((result) => {
        if (result) {
          this.showStep1(this.customHTML);
        }
        else {
          this.showStep3();
        }
      }, (error) => {
        console.error('error step', error);
      });
  }
  public showStep3(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML3, true, 'Next')
      .result.then((result) => {
        if (result) {
          this.showStep2();
        }
        else {
          this.showStep4();
        }
      }, (error) => {
        console.error('error step', error);
      });
  }

  public showStep4(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML4, true, 'Next')
      .result.then((result) => {
        if (result) {
          this.showStep3();
        }
        else {
          this.showStep5();
        }
      }, (error) => {
        console.error('error step', error);
      });
  }


  public showStep5(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML5, true, 'Next')
      .result.then((result) => {
        if (result) {
          this.showStep4();
        }
        else {
          this.showStep6();
        }
      }, (error) => {
        console.error('error step', error);
      });
  }
  public showStep6(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML6, true, 'Next')
      .result.then((result) => {
        if (result) {
          this.showStep5();
        }
        else {
          this.showStep7();
        }
      }, (error) => {
        console.error('error step', error);
      });
  }
  public showStep7(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML7, true, 'Next')
      .result.then((result) => {
        if (result) {
          this.showStep6();
        }
        else {
          this.showStep8();
        }
      }, (error) => {
        console.error('error step', error);
      });
  }
  public showStep8(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML8, true, 'Next')
      .result.then((result) => {
        if (result) {
          this.showStep7();
        }
        else {
          this.showStep9();
        }
      }, (error) => {
        console.error('error step', error);
      });
  }
  public showStep9(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML9, true, 'Next')
      .result.then((result) => {
        if (result) {
          this.showStep8();
        }
        else {
          this.showStep10();
        }
      }, (error) => {
        console.error('error step', error);
      });
  }
  public showStep10(): void {
    this.modalHelper.showInformationMessageModal('How to download your iPhone LTE settings',
      '',
      'Back', null, true, 'ios-setup-modal', this.customHTML10, true, 'Done')
      .result.then((result) => {
        if (result) {
          this.showStep9();
        }
        else {
          this.backToMain.emit(true);
        }
      }, (error) => {
        console.error('error step', error);
      });
  }
  // public fourthGen(): void {
  //   this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.IPHONE4G}`]);
  // }
  // public fifthGen(): void {
  //   this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.IPHONE5G}`]);
  // }
}
