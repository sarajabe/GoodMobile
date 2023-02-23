import { Component, ViewChild, OnDestroy, OnInit, HostListener } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { Router } from '@angular/router';
import { ContactEmailService, FirebaseUserProfileService } from '@ztarmobile/zwp-service-backend';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { SUPPORT_ROUTE_URLS } from 'src/app/app.routes.names';
import { ReCaptchaComponent } from 'src/widgets/re-captcha/re-captcha.component';
import { MetaService } from 'src/services/meta-service.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { EMAIL_PATTERN } from 'src/app/app.config';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnDestroy, OnInit {
  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;

  public SITE_ID = CAPTCHA_SITE_ID;
  public contactUsForm: UntypedFormGroup;
  public processingRequest = false;
  public submittedRequest = true;
  public captchaValid = false;
  public userInfo: IUser = {} as IUser;
  public SUPPORT_ROUTE_URLS = SUPPORT_ROUTE_URLS;
  public innerWidth: any;
  public isOpened = false;
  public captchaClicked = false;

  private captchaResponse: string;
  private userObserver: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    private contactEmailService: ContactEmailService,
    private userProfileService: FirebaseUserProfileService,
    private toastHelper: ToastrHelperService,
    private metaService: MetaService) {

    this.contactUsForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,Validators.pattern(EMAIL_PATTERN)])],
      name: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Za-z]+[ \t]?[A-Za-z]+[ \t]?[A-Za-z ]*$')])],
      phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10)])],
      category: ['Billing'],
      message: ['', Validators.required],
      contact: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10)])]
    });
  }

  ngOnInit(): void {
    this.metaService.createCanonicalUrl();
    this.userObserver = this.userProfileService.userProfileObservable.subscribe((user) => {
      if (!!user) {
        this.userInfo = Object.assign({}, user);
        this.contactUsForm.controls.name.setValue(this.userInfo.firstName + ' ' + this.userInfo.lastName);
        this.contactUsForm.controls.email.setValue(this.userInfo.email);
      } else {
        this.userInfo.firstName = '';
        this.userInfo.lastName = '';
        this.userInfo.contactPhone = '';
        this.contactUsForm.controls.name.setValue('');
        this.contactUsForm.controls.email.setValue('');
      }
    });
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    if (!!this.userObserver) {
      this.userObserver.unsubscribe();
    }
  }

  public checkGMNumber(): void {
    if (!this.contactUsForm.controls.phone.value) {
      this.contactUsForm.controls.phone.markAsPristine();
    }
  }

  public checkContactNumber(): void {
    if (!this.contactUsForm.controls.contact.value) {
      this.contactUsForm.controls.contact.markAsPristine();
    }
  }

  public goToILDaddon(): void {
    this.router.navigate([`${SUPPORT_ROUTE_URLS.BASE}/${SUPPORT_ROUTE_URLS.INTERNATIONAL_CALLING}`]);
  }

  public sendMessage(): void {
    this.contactUsForm.markAllAsTouched();
    if (!!this.contactUsForm.valid && !!this.captchaResponse) {
      this.processingRequest = true;
      const nameArr = this.contactUsForm.get('name').value.split(/\s+/);
      const fname = nameArr.slice(0, -1).join(' ');
      const lname = nameArr.pop();
      this.contactEmailService.sendContactUsEmail({
        reCaptcha: this.captchaResponse,
        email: this.contactUsForm.get('email').value,
        message: this.contactUsForm.get('message').value,
        firstName: fname,
        lastName: lname,
        phoneNumber: this.contactUsForm.get('phone').value,
        category: this.contactUsForm.get('category').value,
        contactNumber: this.contactUsForm.get('contact').value,
      }).then(() => {
        this.processingRequest = false;
        this.submittedRequest = false;
        this.contactUsForm.reset();
        this.contactUsForm.controls.category.setValue('Billing');
      },
        (error) => {
          this.processingRequest = false;
          this.toastHelper.showAlert(error.message);
          this.reCaptcha.resetReCaptcha();
        });
    }
  }

  public resolvedCaptcha(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
    this.captchaClicked = true;
  }

  public goBack(): void {
    this.submittedRequest = true;
    this.captchaClicked = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
  }
}

