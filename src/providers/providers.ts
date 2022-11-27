import { NgModule } from '@angular/core';
import { AuthGuardService } from './user-auth-service/auth-guard.service';
import { AuthEmailGuardService } from './user-auth-service/auth-email-guard.service';

@NgModule({
  imports: [
    // FIXME this should be working for now, but should be fixed https://github.com/AngularClass/angular-starter/issues/1902 later.
  ],
  providers: [
    AuthGuardService, // Auth
    AuthEmailGuardService // Auth
  ]
})
export class TelecomsServicesModule {
}
