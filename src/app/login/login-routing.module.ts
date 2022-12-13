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
  { path: LOGIN_ROUTE_URLS.LOGIN, component: LoginComponent, data: {title: 'Login To Your Good Mobile Account | Good Mobile', description:
  'Login to your Good Mobile account to top up, renew, or edit your profile.'} as IPageMeta },
  { path: LOGIN_ROUTE_URLS.SIGN_UP, component: SignUpComponent, data: {title: 'Sign Up  | Good Mobile', description: 'Create your Good Mobile account'} as IPageMeta},
  { path: LOGIN_ROUTE_URLS.WELCOME, component: WelcomeNewUserComponent, data: {title: 'Welcome onboard!', description: `Welcome to Good Mobile, With Good Mobile you can purchase plans
  with a competitive price and high speed data`} as IPageMeta},
  { path: LOGIN_ROUTE_URLS.FORGOT_PASSWORD, component: ForgetPasswordComponent, data: {title: 'Forgot Password | Good Mobile',
  description: 'Forgot your password'} as IPageMeta},
  { path: LOGIN_ROUTE_URLS.RESET_PASSWORD, component: ResetPasswordComponent, data: {title: 'Reset Password | Good Mobile',
  description: 'Reset your Good Mobile account password'} as IPageMeta},
  { path: LOGIN_ROUTE_URLS.ACP_SIGNUP, component: AcpSignupComponent, data: {title: 'ACP signup | Good Mobile',
  description: 'Your Good Mobile account allows you to fill out the Affordable Connectivity Program form and sign the consent. Once your enrollment is confirmed, you will be able  to manage your service. Let’s get you signed up!'} as IPageMeta}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
