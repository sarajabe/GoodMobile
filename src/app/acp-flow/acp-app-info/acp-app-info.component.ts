import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUserProfileService, IUser } from '@ztarmobile/zwp-service-backend';
import { EbbService, IAcpDetails } from '@ztarmobile/zwp-service-backend-v2';
import { take } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACP_ROUTE_URLS } from 'src/app/app.routes.names';
import { AppState } from 'src/app/app.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';

@Component({
  selector: 'app-acp-app-info',
  templateUrl: './acp-app-info.component.html',
  styleUrls: ['./acp-app-info.component.scss']
})
export class AcpAppInfoComponent implements OnInit {
  public userProfile: IUser;
  public acpData: IAcpDetails;
  yesFlow: boolean;
  yesWithoutFlow: boolean;
  noFlow: boolean;
  eligibilityCodes: { code: string; description: string; }[];
  mappedCodes = [];

  constructor(private router: Router, private userProfileService: FirebaseUserProfileService, private ebbService: EbbService,
    private appState: AppState, private toastHelper: ToastrHelperService) { 
      this.userProfileService.userProfileObservable.pipe(take(1)).subscribe((user) => {
        this.userProfile = user;
        if (this.userProfile && !!this.userProfile.ebbId) {
          this.getAcpData();
        } else {
          this.toastHelper.showWarning('Something went wrong! we could not validate you ACP application info, please contact customer care.')
          this.router.navigate([ACP_ROUTE_URLS.BASE]);
        }
      });
    }

  ngOnInit(): void {
  }


  public getAcpData() {
    this.appState.loading = true;
    this.ebbService.getInternalApplication(this.userProfile.customerId, this.userProfile.ebbId).then(
      (res) => {
        if (!!res && !!res?.data) {
          this.acpData = res.data;
          this.yesFlow = !!this.acpData.providerApplicationId && !this.acpData.eligibilityCode ? true : false;
          this.yesWithoutFlow = !this.acpData.providerApplicationId && !this.acpData.eligibilityCode ? true : false;
          this.noFlow = !!this.acpData.eligibilityCode ? true : false;
          if (!!this.noFlow) {
            this.ebbService.getCodes().then((data) => {
              this.eligibilityCodes = data.eligibilityCodes;
              this.appState.loading = false;
              const codes = this.acpData.eligibilityCode.split(',');
              codes.map((c) => {
                this.mappedCodes.push({program : this.eligibilityCodes.find((a) => a.code === c).description, relatedValue: c=='E50' || c === 'E51' ? this.acpData.schoolName : null})
              });
            },
            (error) => {
              this.appState.loading = false;
            })
          } else {
            this.appState.loading = false;
          }
        } else {
          this.appState.loading = false;
          this.toastHelper.showAlert('Oops, something went wrong while trying to get your ACP application details! please try again later!!');
          this.router.navigate([ACP_ROUTE_URLS.BASE]);
        }
      },
      (error) => {
        this.appState.loading = false;
        // this.toastHelper.
      }
    );
  }
  public goToAcpSummary(): void {
    this.router.navigate([`${ACCOUNT_ROUTE_URLS.BASE}` + '/' + `${ACCOUNT_ROUTE_URLS.ACP_APPLICATION}`])
  }

}
