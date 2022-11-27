import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PASSWORD_PATTERN } from '../../app.config';
import { AngularFireAuth } from '@angular/fire/auth';
import { LOGIN_ROUTE_URLS, ROUTE_URLS } from '../../app.routes.names';
import { MetaService } from '../../../services/meta-service.service';
import { ToastrHelperService } from '../../../services/toast-helper.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public processingRequest = false;
  public disableButton = false;
  public resetPasswordForm: FormGroup;
  public password;
  public oobCode;
  public passwordResetSuccess = false;
  public codeVerified = false;

  constructor(private userAuthService: AngularFireAuth, private formBuilder: FormBuilder, private toastHelper: ToastrHelperService,
              private router: Router, private route: ActivatedRoute, private metaService: MetaService) {
    this.resetPasswordForm = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12),
                  Validators.pattern(PASSWORD_PATTERN)])],
      confirmPassword: ['', Validators.required],
    }, {validator: this.matchingPasswords('password', 'confirmPassword')});
    this.route.params.subscribe((params) => {
      if (!!params && params[LOGIN_ROUTE_URLS.PARAMS.OOB_CODE]) {
        this.oobCode = params[LOGIN_ROUTE_URLS.PARAMS.OOB_CODE];
        this.verifyCode();
      } else {
        this.router.navigate([ROUTE_URLS.HOME]);
      }
    });
    this.metaService.createCanonicalUrl();
  }

  ngOnInit(): void {
  }

  public verifyCode(): void {
    this.userAuthService.verifyPasswordResetCode(this.oobCode).then((response) => {
      this.codeVerified = true;
    }).catch((error) => this.toastHelper.showAlert(error.message));
  }

  public resetPassword(): void {
    this.password = this.resetPasswordForm.get('password').value;
    this.userAuthService.confirmPasswordReset(this.oobCode, this.password).then((response) => {
      this.codeVerified = false;
      this.passwordResetSuccess = true;
    }).catch((error) => this.toastHelper.showAlert(error.message));
  }

  public goToLogin(): void {
    this.router.navigate([`${LOGIN_ROUTE_URLS.BASE}/${LOGIN_ROUTE_URLS.LOGIN}`]);
  }

  private matchingPasswords(passwordKey: string, confirmPasswordKey: string): any {
   return (group: FormGroup): { [key: string]: any } => {
     const password = group.controls[passwordKey];
     const confirmPassword = group.controls[confirmPasswordKey];

     if (password.value !== confirmPassword.value) {
       return {
         mismatchedPasswords: true
       };
     }
   };
 }
}
