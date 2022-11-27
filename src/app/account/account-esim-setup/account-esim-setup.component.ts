import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { IccidService } from '@ztarmobile/zwp-service-backend-v2';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../account-header.service';

@Component({
  selector: 'app-account-esim-setup',
  templateUrl: './account-esim-setup.component.html',
  styleUrls: ['./account-esim-setup.component.scss']
})
export class AccountEsimSetupComponent implements OnInit, AfterContentChecked {
  @ViewChild('qrScanForm') qrScanForm: NgForm;
  public activeStep = 1;
  public categoriesDescs = {};
  public qr = {};
  public qrCode = false;
  public selectedPlan: IUserPlan;
  public device;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS;

  private planId;
  private iccid;
  private alive = true;
  constructor(private accountHeaderService: AccountHeaderService, private router: Router,
    private userPlansService: UserPlansService, private iccidService: IccidService,
    private route: ActivatedRoute, private toastHelper: ToastrHelperService,
    private appState: AppState) {
    this.accountHeaderService.setAccountMenuVisibility(false);
    this.accountHeaderService.setownContainer(true);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ACCOUNT_ROUTE_URLS.PARAMS.PLAN_ID]) {
        this.planId = params[ACCOUNT_ROUTE_URLS.PARAMS.PLAN_ID];
      } 
      else {
        this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
      }
    });
    if (!!this.planId) {
      this.userPlansService.getUserPlan(this.planId).then((plan) => {
        if (!!plan) {
          this.selectedPlan = plan;
          if (!plan?.eSIM) {
            this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
          } else {
            if (!!plan?.planDevice?.os) {
              if (plan?.planDevice?.os.toLocaleLowerCase() === 'android' && plan?.planDevice?.brand?.toLocaleLowerCase() === 'google') {
                this.device = 'pixel';
              } else {
                this.device = plan?.planDevice?.os?.toLocaleLowerCase();
              }
            }
            this.iccid = plan?.iccid;
            this.getQr();
          }
        } else {
          this.goToAccountSummary();
        }
      });
    }

  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  ngAfterContentChecked(): void {
    this.categoriesDescs = {
      'ios': {
        '1': {
          title: 'How to scan QR code:',
          desc: `<div class="descs"><p class="item"><b>1-</b><span>Go to your <b>Settings</b> and choose <b>Cellular</b>.</span></p>
          <p class="item"><b>2-</b> <span>Choose <b>Add Cellular Plan</b>.</span></p>
          <p class="item last"><b>3-</b> <span>Scan the QR code that will show in the next step on this page.</span></p></div>`,
        },
        '2': {
          title: 'Your QR code is ready to be scanned:',
          desc: null
        },
        '3': {
          title: 'Awesome!',
          subTitle: 'Your device will recognise the cellular plan, then:',
          desc: `
          <div class="descs">
          <p class="item"><b>4-</b> <span>Select <b>Add Cellular Plan</b>.</span></p>
          <p class="item"><b>5-</b> <span>You may choose the labels for each of your cellular plans, press <b>Continue</b>.</span></p>
          <p class="item"><b>6-</b> <span>Select your Default Line, press <b>Continue</b>.</span></p>
          <p class="item"><b>7-</b> <span>Select the Cellular Plan that will be used for iMessage & FaceTime. Press <b>Continue</b>.</span></p>
          <p class="item last"><b>8-</b> <span>Choose the Cellular Plan that will be your default for Cellular Data, or you can turn on 
          “Allow Cellular Data Switching”. Then, press <b>Done</b>.</span></p>
          </div>
          `,
        }
      },
      'android': {
        '1': {
          title: 'How to scan QR code:',
          desc: `<div class="descs"><p class="item"><b>1-</b> <span>Go to your <b>Settings</b> and choose <b>Connections</b>.</span></p>
          <p class="item"><b>2-</b> <span>Choose <b>SIM Card Manager</b>.</span></p>
          <p class="item"><b>3-</b> <span>Under eSIMs, press <b>Add Mobile Plan</b>.</span></p>
          <p class="item last"><b>4-</b> <span>Press <b>Scan Carrier QR Code</b>, to scan the QR Code, point the camera at the code.</span></p></div>`,
        },
        '2': {
          title: 'Your QR code is ready to be scanned:',
          desc: null,
        },
        '3': {
          title: 'Awesome!',
          subTitle: 'Your device will recognise the cellular plan, then:',
          desc: `
          <div class="descs">
          <p class="item"><b>4-</b> <span>Select Add Cellular Plan.</span></p>
          <p class="item"><b>5-</b> <span>You will be asked if you want to add the cellular plan to your phone, press <b>Confirm</b>.</span></p>
          <p class="item last"><b>6-</b> <span>The eSIM profile will start downloading, this step will take up to 5 mintues.</span></p>
          </div>
          `
        }
      },
      'pixel': {
        '1': {
          title: 'How to scan QR code:',
          desc: `<div class="descs"><p class="item"><b>1-</b> <span>Go to your <b>Settings</b> and choose <b>Connections</b>.</span></p>
          <p class="item"><b>2-</b> <span>Choose <b>SIM Card Manager</b>.</span></p>
          <p class="item"><b>3-</b> <span>Under eSIMs, press <b>Add Mobile Plan</b>.</span></p>
          <p class="item"><b>4-</b> <span>Press <b>Scan Carrier QR Code</b>, to scan the QR Code, point the camera at the code.</span></p>
          <p class="item"><b>5-</b> <span>Choose T-Mobile as your Network.</span></p>
          <p class="item last"><b>6-</b> <span>Scan the QR code that will show in the next step on this page.</span></p>
          </div>`
        },
        '2': {
          title: 'Your QR code is ready to be scanned:',
          desc: null
        },
        '3': {
          title: 'Awesome!',
          subTitle: 'Your device will recognise the cellular plan, then:',
          desc: `
          <div class="descs">
          <p class="item"><b>7-</b> <span>You will be asked if you want to use t-Mobile for this device, press <b>Download</b>.</span></p>
          <p class="item"><b>8-</b> <span>The eSIM profile will start downloading, this step will take up to 5 mintues.</span></p>
          <p class="item"><b>9-</b> <span>You have scanned your QR Code & added your prepaid plan. To activate the eSIM, press <b>Settings</b>.</span></p>
          <p class="item"><b>10-</b> <span>Under DOWNLOADED SIMS, choose <b>T-Mobile</b>.</span></p>
          <p class="item"><b>11-</b> <span>Turn on <b>Use SIM</b>.</span></p>
          <p class="item"><b>12-</b> <span>You will get a pop-up to confirm if you want to switch to T-Mobile, press Switch to T-Mobile.</span></p>
          </div>
          `
        }
      }
    }
  }
  public goToAccountSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}/${ACCOUNT_ROUTE_URLS.SUMMARY}`]);
  }
  public goToNextStep(): void {
    if (this.activeStep === 2) {
      this.qrScanForm.form.markAllAsTouched();
      if (!!this.qrScanForm.valid) {
        this.activeStep = this.activeStep + 1;
      }
    } else {
      this.activeStep = this.activeStep + 1;
      if (this.activeStep === 4) {
        this.selectedPlan.qrScanned = true;
        this.selectedPlan.eSimDetails = null;
        this.userPlansService.updateUserPlan(this.selectedPlan.userId, this.selectedPlan);
      }
    }
  }
  public goBack(): void {
    this.activeStep = this.activeStep - 1;
  }
  public setupData(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.DATA_SETUP}`]);
  }

  private getQr(): void {
    if (this.iccid) {
      this.appState.loading = true;
      this.iccidService.getQrCode(this.iccid).subscribe(img => {
        this.qr = img;
        this.appState.loading = false;
      }, error => {
        this.appState.loading = false;
        this.toastHelper.showAlert('Error while getting QR code');
        this.goToAccountSummary();

      });
    }
  }
}
