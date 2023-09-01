import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { INVISIBLE_CAPTCHA_ID } from '../../environments/environment';
import { InvisibleRecaptchaComponent } from '../../widgets/invisible-recaptcha/invisible-recaptcha.component';
import { SUPPORT_ROUTE_URLS } from '../app.routes.names';
import { NewsletterService } from '@ztarmobile/zwp-service-backend-v2';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { EMAIL_PATTERN } from '../app.config';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {
  @ViewChild('reCaptcha') reCaptcha: InvisibleRecaptchaComponent;
  public SITE_ID = INVISIBLE_CAPTCHA_ID;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public newsletterForm: UntypedFormGroup;
  public processingRequest = false;
  public captchaValid = false;
  public recaptchaResponse: any;
  constructor( private formBuilder: FormBuilder, private newsletterService: NewsletterService,
               private toastHelper: ToastrHelperService) { }

  ngOnInit(): void {
    this.newsletterForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])],
    });
  }
  public submitEmail(): void {
    this.newsletterForm.markAllAsTouched();
    this.newsletterForm.get('email').enable();
    const email = this.newsletterForm.get('email').value;
    if (!!this.newsletterForm.valid && !!email && !!this.recaptchaResponse) {
      this.processingRequest = true;
      this.newsletterForm.get('email').disable();
      this.newsletterService.register({email} ,this.recaptchaResponse).then(() => {
          this.newsletterForm.get('email').enable();
          this.processingRequest = false;
          this.reCaptcha.resetReCaptcha();
          this.reCaptcha.execute();
          this.toastHelper.showSuccess('Congrats, you have been registered successfully!!');
          this.newsletterForm.reset();
      }, (error)=>{
        this.processingRequest = false;
        this.newsletterForm.get('email').enable();
        this.reCaptcha.resetReCaptcha();
        this.reCaptcha.execute();
        this.toastHelper.showAlert('Oops, something went wrong, please try again later!!');
        console.error('error', error);
        this.newsletterForm.reset();
      });
    }
   
  }
  public resolvedCaptcha(captchaResponse: string): void {
    this.recaptchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
}
