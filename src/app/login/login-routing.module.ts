import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IPageMeta } from '@ztarmobile/zwp-service';
import { LOGIN_ROUTE_URLS } from '../app.routes.names';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserLoginComponent } from './user-login.component';
import { WelcomeNewUserComponent } from './welcome-new-user/welcome-new-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AcpSignupComponent } from './acp-signup/acp-signup.component';

const routes: Routes = [
  {path: '', component: UserLoginComponent, children: [
  { path: LOGIN_ROUTE_URLS.LOGIN, component: LoginComponent, data: {title: 'Login To Your GoodMobile Account | GoodMobile', description:
  'Login to your GoodMobile account to top up, renew, or edit your profile.'} as IPageMeta },
  { path: LOGIN_ROUTE_URLS.SIGN_UP, component: SignUpComponent, data: {title: 'Sign Up  | GoodMobile', description: 'Create your GoodMobile account'} as IPageMeta},
  { path: LOGIN_ROUTE_URLS.WELCOME, component: WelcomeNewUserComponent, data: {title: 'Welcome onboard!', description: `Welcome to GoodMobile, With GoodMobile you can purchase plans
  with a competitive price and high speed data`} as IPageMeta},
  { path: LOGIN_ROUTE_URLS.FORGOT_PASSWORD, component: ForgetPasswordComponent, data: {title: 'Forgot Password | GoodMobile',
  description: 'Forgot your password'} as IPageMeta},
  { path: LOGIN_ROUTE_URLS.RESET_PASSWORD, component: ResetPasswordComponent, data: {title: 'Reset Password | GoodMobile',
  description: 'Reset your GoodMobile account password'} as IPageMeta},
  { path: LOGIN_ROUTE_URLS.ACP_SIGNUP, component: AcpSignupComponent, data: {title: 'ACP signup | GoodMobile',
  description: 'Your GoodMobile account allows you to fill out the Affordable Connectivity Program form and sign the consent. Once your enrollment is confirmed, you will be able  to manage your service. Let’s get you signed up!'} as IPageMeta}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
