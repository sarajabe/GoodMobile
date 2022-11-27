import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng4-validators';

import { WidgetsModule } from 'src/widgets/widgets.module';
import { LoginRoutingModule } from './login-routing.module';
import { UserLoginComponent } from './user-login.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { WelcomeNewUserComponent } from './welcome-new-user/welcome-new-user.component';
import { LegacyLoginComponent } from './legacy-login/legacy-login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AcpSignupComponent } from './acp-signup/acp-signup.component';


@NgModule({
  declarations: [UserLoginComponent, LoginComponent, ForgetPasswordComponent, WelcomeNewUserComponent, LegacyLoginComponent, SignUpComponent, ResetPasswordComponent, AcpSignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetsModule,
    CustomFormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
