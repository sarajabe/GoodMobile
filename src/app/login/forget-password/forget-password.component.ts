import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { EMAIL_PATTERN } from 'src/app/app.config';
import { LOGIN_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, AfterViewInit {
  public forgetPasswordForm: UntypedFormGroup;
  public email: string;
  public oobCode: string;
  public waitForCode = false;
  public codeVerified = false;
  public processingRequest = false;
  public disableButton = false;
  private alive = true;

  constructor(private angularAuthService: AngularFireAuth, private formBuilder: UntypedFormBuilder, private toastHelper: ToastrHelperService,
              private metaService: MetaService, private route: ActivatedRoute, private elRef: ElementRef) {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (params && params[LOGIN_ROUTE_URLS.PARAMS.EMAIL]) {
        this.email = params[LOGIN_ROUTE_URLS.PARAMS.EMAIL];
      }
    });
    this.forgetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])]
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnInit(): void {
    this.forgetPasswordForm.controls.email.setValue(this.email);
  }

  ngAfterViewInit(): void {
    if (!!this.email) {
      this.elRef.nativeElement.querySelector('.email').focus();
    }
  }

  public selectAllContent($event): void {
    $event.target.select();
  }

  public sendEmail(): void {
    this.processingRequest = true;
    this.email = this.forgetPasswordForm.get('email').value;
    this.angularAuthService.sendPasswordResetEmail(this.email).then((response) => {
      this.toastHelper.showSuccess('Please check your email that includes a reset password link.');
      this.processingRequest = false;
      this.disableButton = true;
      this.waitForCode = true;
    }).catch((error) => {
      this.processingRequest = false;
      this.toastHelper.showAlert(error.message);
    });
  }
}
