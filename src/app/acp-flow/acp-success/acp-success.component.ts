import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { IAcpDetails } from '@ztarmobile/zwp-service-backend-v2';
import { filter, takeWhile } from 'rxjs/operators';
import { ACP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { INVISIBLE_CAPTCHA_ID } from 'src/environments/environment';
import { InvisibleRecaptchaComponent } from 'src/widgets/invisible-recaptcha/invisible-recaptcha.component';

@Component({
  selector: 'app-acp-success',
  templateUrl: './acp-success.component.html',
  styleUrls: ['./acp-success.component.scss']
})
export class AcpSuccessComponent implements OnInit, OnDestroy {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  @Input() acpData: IAcpDetails;
  @Input() acpStatus: string;
  @Input() link: string;
  public userPlans: Array<IUserPlan>;
  public activePlans: Array<IUserPlan>;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public recaptchaResponse: any;
  public captchaValid = false;
  public title;
  private alive = true;
  
  constructor( private userPlansService: UserPlansService, private appState: AppState,
    private router:Router) { 
      window.scroll(0, 0);
    }

  ngOnInit(): void {
    this.title = !!this.acpStatus && this.acpStatus === 'pendingAction' ? 'Awesome, Almost Done!' : 'Congratulations!';
    this.userPlansService.userPlans
    .pipe(takeWhile(() => this.alive))
    .pipe(filter((plans) => !!plans))
    .subscribe((plans) => {
      if (!!plans) {
        this.userPlans = plans;
        this.activePlans = this.userPlans.filter(
          (plan) =>
            !!plan.mdn &&
            !plan.portInRequestNumber &&
            !plan.canceled
        );
      }
    });
    setInterval(() => {
      this.reCaptcha.resetReCaptcha(); // reset recaptcha every 2 minutes to avoid invalid or expired recaptcha error
    }, 1.8 * 60 * 1000);
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
  public goToNationalVerifier(): void {
    this.appState.loading = true;
    window.open(`${this.link}`, "_self");
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public addNewLine(): void {
     this.router.navigate([`${ACP_ROUTE_URLS.BASE}/${ACP_ROUTE_URLS.ENROLLMENT_NEW_LINE}`]);
  }
  public selectExistingLine(): void {
    this.router.navigate([`${ACP_ROUTE_URLS.BASE}/${ACP_ROUTE_URLS.ENROLLMENT_EXISTING_LINE}`]);
 }
}
