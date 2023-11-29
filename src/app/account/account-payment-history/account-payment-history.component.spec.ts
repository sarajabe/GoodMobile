import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthHttp } from '@ztarmobile/zwp-services-auth';
import {
    AccountPaymentService, ActionsAnalyticsService, CustomizableMobilePlan, FirebaseUserProfileService, IPaymentHistory,
    IPaymentRecord, IUser, IUserAccount, IUserDevice, IUserPlan,
    MobileCustomPlansService, UserAccountService, UserPlansService
} from '@ztarmobile/zwp-service-backend';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { ENV_FIREBASE_CONFIG } from 'src/environments/environment';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { AccountHeaderService } from '../account-header.service';
import { AccountPaymentHistoryComponent } from './account-payment-history.component';
import { AppState } from 'src/app/app.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { IGoogleTagManagerEventsConfig, ZMP_G2G_BFF_ENDPOINT_URL } from '@ztarmobile/zwp-service';
import { CommonModule } from '@angular/common';

fdescribe('AccountPaymentHistoryComponent', () => {
    let component: AccountPaymentHistoryComponent;
    let fixture: ComponentFixture<AccountPaymentHistoryComponent>;
    let mockUserProfileService;
    let mockUserAccountService;
    let mockAccountHeaderService;
    let mockUserPlansService;
    let mockMobileCustomPlansService;
    let mockAccountPaymentService;
    const USER = {
        customerId: 'MockedId', firstName: 'Rana', email: 'mirna.haddad@ztarmobile.com',
        lastName: 'Haddad', verified: true, id: '123456789', preferredLanguage: ''
    } as IUser;
    const ACCOUNT = {} as IUserAccount;
    const USER_PLAN = true;
    const HISTORY = { payments: null, totalItems: 0 } as IPaymentHistory;
    const mockUserDevice = {
        brand: 'Apple',
        equipmentType: '4GLTE',
        compatible: true,
        iccid: '8901240161103297611',
        iccidRequired: true,
        id: '353322079360104',
        manufacturer: 'Apple Inc',
        marketingName: 'Apple iPhone 6 (A1586)',
        migrationSimOrderDate: undefined,
        migrationSimOrderId: undefined,
        model: 'iPhone 6 (A1586)',
        network: 'tmo',
        networkType: 'GSM',
        os: 'ios',
        portRequired: false,
        postalCode: '73301',
        reCaptcha: undefined,
        serialType: 'imei',
        simNumber: undefined,
        skuIdentifier: 'T',
        skuNumber: 'SIMMGTTMO4GLTE',
        activationCode: '353322079360104',
        pendingNewSim: false,
        pendingMigrationSim: true,
        updatedAt: 1624971943671,
        updatedBy: 'ZRM'
    } as IUserDevice;
    const PLANS = [{ id: 'mockedPlanID', autoRenewPlan: true, planDevice: mockUserDevice } as IUserPlan];
    const CART = new CustomizableMobilePlan();
    const PAYMENT = {
        dateTime: '12-04-21',
        nextPaymentDate: '12-04-22',
        status: 'approved',
        confirmationNumber: '8078953028148190894',
        type: 'CC',
        amount: 50,
        method: '1111',
        details: [],
        orderId: 'AZCZLG8R3AYV217B',
        approved: true
    } as IPaymentRecord;
    const FILLED_HISTORY = { payments: Array(11).fill(PAYMENT), totalItems: 12 } as IPaymentHistory;
    const FILLED_HISTORY_1 = { payments: Array(1).fill(PAYMENT), totalItems: 1 } as IPaymentHistory;

    beforeEach(waitForAsync(() => {
        mockUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
        mockUserAccountService = jasmine.createSpyObj(['UserAccountService', 'selectedAccount', 'isSyncingAccount']);
        mockAccountHeaderService = jasmine.createSpyObj(['AccountHeaderService', 'setPageTitle', 'setPageDescription', 'setAccountMenuVisibility','setAccountWelcomeVisibility']);
        mockUserPlansService = jasmine.createSpyObj(['UserPlansService', 'isSelectedPlanReady', 'userPlans', 'selectFirstUserPlan', 'selectedUserPlanObservable']);
        mockMobileCustomPlansService = jasmine.createSpyObj(['MobileCustomPlansService', 'currentPlan']);
        mockAccountPaymentService = jasmine.createSpyObj(['AccountPaymentService', 'reloadPaymentHistory']);
        TestBed.configureTestingModule({
            declarations: [AccountPaymentHistoryComponent],
            imports: [
                AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                NgxPaginationModule,
                NgPipesModule,
                ToastrModule.forRoot(),
                MatDialogModule,
                CommonModule
            ],
            providers: [
                { provide: UserAccountService },
                { provide: AccountPaymentService },
                { provide: UserPlansService },
                { provide: AccountHeaderService },
                { provide: ModalHelperService },
                { provide: ActionsAnalyticsService, useValue: new InjectionToken<IGoogleTagManagerEventsConfig>('GoogleTagManagerEvents') },
                ToastrHelperService,
                { provide: MobileCustomPlansService },
                { provide: FirebaseUserProfileService },
                { provide: AuthHttp },
                { provide: AppState},
                { provide: HttpClient},
                HttpHandler,
                { provide: MatDialog },
                {provide: Overlay},
                {provide: ZMP_G2G_BFF_ENDPOINT_URL, useValue: true}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        TestBed.overrideProvider(FirebaseUserProfileService, { useValue: mockUserProfileService });
        TestBed.overrideProvider(UserAccountService, { useValue: mockUserAccountService });
        TestBed.overrideProvider(AccountHeaderService, { useValue: mockAccountHeaderService });
        TestBed.overrideProvider(UserPlansService, { useValue: mockUserPlansService });
        TestBed.overrideProvider(MobileCustomPlansService, { useValue: mockMobileCustomPlansService });
        TestBed.overrideProvider(AccountPaymentService, { useValue: mockAccountPaymentService });
        TestBed.compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AccountPaymentHistoryComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');
        mockUserProfileService.userProfileObservable.and.returnValue(USER);
        mockUserProfileService.userProfileObservable = of(USER);
        mockUserAccountService.selectedAccount.and.returnValue(ACCOUNT);
        mockUserAccountService.selectedAccount = of(ACCOUNT);
        mockUserAccountService.isSyncingAccount.and.returnValue(true);
        mockUserAccountService.isSyncingAccount = of(true);
        mockUserPlansService.isSelectedPlanReady.and.returnValue(USER_PLAN);
        mockUserPlansService.isSelectedPlanReady = of(true);
        mockUserPlansService.userPlans.and.returnValue(PLANS);
        mockUserPlansService.userPlans = of(PLANS);
        mockUserPlansService.selectedUserPlanObservable.and.returnValue(PLANS[0]);
        mockUserPlansService.selectedUserPlanObservable = of(PLANS[0]);
        mockMobileCustomPlansService.currentPlan.and.returnValue(CART);
        mockMobileCustomPlansService.currentPlan = of(CART);
        mockAccountPaymentService.reloadPaymentHistory.and.returnValue(Promise.resolve(HISTORY));
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should check the initial view of the page when the user has no active mdn and no payments (no table should be shown or note just the plan selector) ', waitForAsync(() => {
        component.userHasActivePlans = false;
        const accountStatusMessage = fixture.debugElement.query(By.css('#plan-selector-override')).nativeElement;
        fixture.detectChanges();
        expect(accountStatusMessage).toBeDefined();
    }));
    it('should check if there is no Payment History yet but have active mdns ', waitForAsync(() => {
        component.userHasActivePlans = true;
        fixture.detectChanges();
        const emptyTable = fixture.debugElement.query(By.css('.width-120')).nativeElement;
        fixture.detectChanges();
        expect(emptyTable).toBeDefined();
    }));
    it('should check if there is Payment History and user has no active mdns', waitForAsync(() => {
        component.userHasActivePlans = false;
        component.paymentHistory = FILLED_HISTORY_1;
        fixture.detectChanges();
        const tableSection = fixture.debugElement.query(By.css('#table-content')).nativeElement;
        fixture.detectChanges();
        expect(tableSection).toBeDefined();
    }));
    it('should check if the pagination is shown when we have > 10 payment history', waitForAsync(() => {
        component.userHasActivePlans = true;
        component.paymentHistory = FILLED_HISTORY;
        component.config.totalItems = FILLED_HISTORY.totalItems;
        fixture.detectChanges();
        const paginationBar = fixture.debugElement.query(By.css('.right-action')).nativeElement;
        fixture.detectChanges();
        expect(paginationBar).toBeDefined();

    }));
    it('should check the checks that the table is filled with the data and the reciept icon is shown', waitForAsync(() => {
        component.userHasActivePlans = true;
        component.paymentHistory = FILLED_HISTORY;
        component.config.totalItems = FILLED_HISTORY.totalItems;
        fixture.detectChanges();
        const tableContent = fixture.debugElement.query(By.css('#table-content')).nativeElement;
        const viewReceiptBtn = fixture.debugElement.query(By.css('#view-receipt-btn')).nativeElement;
        const date = fixture.debugElement.query(By.css('#date')).nativeElement;
        const status = fixture.debugElement.query(By.css('#status')).nativeElement;
        const paymentMethod = fixture.debugElement.query(By.css('#payment-method')).nativeElement;
        const confirmationNumber = fixture.debugElement.query(By.css('#confirmation-number')).nativeElement;
        fixture.detectChanges();
        expect(tableContent).toBeDefined();
        expect(viewReceiptBtn).toBeDefined();
        expect(date.innerHTML.includes(component.paymentHistory.payments[0].dateTime)).toBeTruthy();
        expect(status.innerHTML.includes(component.paymentHistory.payments[0].status)).toBeTruthy();
        expect(paymentMethod.innerHTML.includes(component.paymentHistory.payments[0].method)).toBeTruthy();
        expect(confirmationNumber.innerHTML.includes(component.paymentHistory.payments[0].confirmationNumber)).toBeTruthy();
    }));
    it('should check the click of the reciept icon functionality', waitForAsync(() => {
        component.userHasActivePlans = true;
        component.paymentHistory = FILLED_HISTORY;
        component.config.totalItems = FILLED_HISTORY.totalItems;
        spyOn(component, 'goToReceiptDetails').and.callThrough();
        fixture.detectChanges();
        const viewReceiptBtn = fixture.debugElement.query(By.css('#view-receipt-btn')).nativeElement;
        viewReceiptBtn.click();
        fixture.detectChanges();
        expect(component.goToReceiptDetails).toHaveBeenCalled();
        expect(viewReceiptBtn).toBeDefined();
    }));
});
