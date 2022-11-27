import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '@ztarmobile/zwp-services-auth';
import { FirebaseUserProfileService, IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { AppState } from '../app.service';
import { AccountHeaderService } from './account-header.service';
import { NavigationEnd, Router } from '@angular/router';
import { ACCOUNT_ROUTE_URLS } from '../app.routes.names';

@Component({
    selector: 'app-user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit, OnDestroy {
    public user: IUser;
    public pendingPlans: IUserPlan[];
    public headerTitle: string;
    public innerWidth;
    public isAccountMenuVisible = false;
    public ownConatiner = false;
    public removepadding = false;
    private alive = true;

    constructor(private userProfileService: FirebaseUserProfileService,
        private userPlansService: UserPlansService,
        public appState: AppState,
        public accountHeaderService: AccountHeaderService,
        private router: Router) {
        router.events.subscribe((val) => {
            if(val instanceof NavigationEnd) {
               if(!val?.url?.includes(ACCOUNT_ROUTE_URLS.ESIM_SETUP)) {
                this.accountHeaderService.setownContainer(false);
               }
            }
        });
        this.userProfileService.userProfileObservable.pipe(takeWhile(() => this.alive)).subscribe((user) => this.user = user);
        this.userPlansService.userPlans.pipe(takeWhile(() => this.alive)).subscribe((pendingPlans) => this.pendingPlans = pendingPlans.filter((plan) => !plan.mdn));
        this.accountHeaderService.isMenuVisible.pipe(takeWhile(() => this.alive)).subscribe((menuVisible) => this.isAccountMenuVisible = menuVisible);
        this.accountHeaderService.ownContainer.pipe(takeWhile(() => this.alive)).subscribe((ownConatiner) => this.ownConatiner = ownConatiner);
        this.accountHeaderService.pageTitle.pipe(takeWhile(() => this.alive)).subscribe((title) => this.headerTitle = title);
        this.accountHeaderService.removePadding.pipe(takeWhile(() => this.alive)).subscribe((remove) => this.removepadding = remove);
    }

    public ngOnInit(): void {
        this.innerWidth = window.screen.width;
    }

    public ngOnDestroy(): void {
        this.alive = false;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event): void {
        this.innerWidth = window.screen.width;
    }
}
