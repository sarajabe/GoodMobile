import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { AccountAcpApplicationComponent } from "./account-acp-application.component";
import { EbbService, IAcpUser } from "@ztarmobile/zwp-service-backend-v2";
import { FirebaseUserProfileService, IUser, IUserDevice, IUserPlan, UserAccountService, UserOrdersService, UserPlansService } from "@ztarmobile/zwp-service-backend";
import { AppState } from "src/app/app.service";
import { ToastrHelperService } from "src/services/toast-helper.service";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ReplaySubject, of } from "rxjs";
import { By } from "@angular/platform-browser";
import { USER_WITH_EBBID } from "src/mocks/user-profile";
import { PLANS } from "src/mocks/user-plans";

fdescribe('Account ACP Application Component - Unit Test', () => {
    let component: AccountAcpApplicationComponent;
    let fixture: ComponentFixture<AccountAcpApplicationComponent>;

    let mockEbbService;
    let mockUserProfileService;
    let mockUserPlansService;
    let mockUserAccountService;
    let mockUserOrdersService;
    let mockAppState;

    beforeEach(async () => {
        mockEbbService = jasmine.createSpy('EBBService');
        mockUserProfileService = jasmine.createSpyObj(['FirebaseUserProfileService', 'userProfileObservable']);
        mockUserPlansService = jasmine.createSpyObj(['UserPlansService', 'userPlans']);
        mockUserAccountService = jasmine.createSpyObj(['UserAccountService', 'userAccounts']);
        mockUserOrdersService = jasmine.createSpyObj(['UserOrdersService']);
        mockAppState = jasmine.createSpyObj(['AppState', 'acpActiveAppResObs', 'acpAppRes']);

        await TestBed.configureTestingModule({
            declarations: [
                AccountAcpApplicationComponent
            ],
            imports: [
                MatDialogModule
            ],
            providers: [
                { provide: ToastrHelperService, useValue: true },
                MatDialog
            ]
        });
        TestBed.overrideProvider(EbbService, { useValue: mockEbbService });
        TestBed.overrideProvider(FirebaseUserProfileService, { useValue: mockUserProfileService });
        TestBed.overrideProvider(UserPlansService, { useValue: mockUserPlansService });
        TestBed.overrideProvider(UserAccountService, { useValue: mockUserAccountService });
        TestBed.overrideProvider(UserOrdersService, { useValue: mockUserOrdersService });
        TestBed.overrideProvider(AppState, { useValue: mockAppState });
        TestBed.compileComponents();

        fixture = TestBed.createComponent(AccountAcpApplicationComponent);
        component = fixture.componentInstance;

        spyOn(component.router, 'navigate');

        mockUserProfileService.userProfileObservable.and.returnValue(USER_WITH_EBBID);
        mockUserProfileService.userProfileObservable = of(USER_WITH_EBBID);

        mockUserPlansService.userPlans.and.returnValue(PLANS);
        mockUserPlansService.userPlans = of(PLANS);

        mockAppState.acpActiveAppResObs.and.returnValue({ createdAt: '12333' });
        mockAppState.acpActiveAppResObs = of({ createdAt: '12333' });

        mockAppState.acpAppRes = new ReplaySubject<any>(1); // Create a ReplaySubject with buffer size 1

        fixture.detectChanges();
    });

    it('Should create component', () => {
        expect(component).toBeTruthy();
    });

    it('Should check intial values for showCoECardNoFlow and showCoECardYesFlow are false because user does not have an ebbId', () => {
        expect(component.showCoECardNoFlow).toBeFalsy();
        expect(component.showCoECardYesFlow).toBeFalsy();
    });

    it('Should check the value of showCoECardNoFlow when user have ebbId in his profile and the status is expired or closed and acpProvider inetrnal', fakeAsync(() => {
        const res = { status: component.ACP_STATUS.APP_CLOSED_OR_EXPIRED, acpProvider: 'internal', user: {} as IAcpUser };
        mockAppState.acpAppRes.next(res);
        fixture.detectChanges();

        component.getVerificationDetails();

        tick();

        const CoEnoCardFlow = fixture.debugElement.query(By.css('#coEcard-noflow')).nativeElement;
        fixture.detectChanges();

        expect(component.verificationDetails).toEqual(res);
        expect(component.showCoECardNoFlow).toBeTruthy();
        expect(component.showCoECardYesFlow).toBeFalsy();
        expect(CoEnoCardFlow).toBeDefined();
    }));

    it('Should check the value of showCoECardNoFlow when user have ebbId in his profile and the status is expired or closed and acpProvider external', fakeAsync(() => {
        const res = { status: component.ACP_STATUS.APP_CLOSED_OR_EXPIRED, acpProvider: 'external', user: {} as IAcpUser };
        mockAppState.acpAppRes.next(res);
        fixture.detectChanges();

        component.getVerificationDetails();

        tick();

        const CoEyesCardFlow = fixture.debugElement.query(By.css('#coEcard-yesflow')).nativeElement;
        fixture.detectChanges();

        expect(component.verificationDetails).toEqual(res);
        expect(component.showCoECardNoFlow).toBeFalsy();
        expect(component.showCoECardYesFlow).toBeTruthy();
        expect(CoEyesCardFlow).toBeDefined();
    }));

    it('Should check the value of showCoECardNoFlow when user have ebbId in his profile and the status is not found and acpProvider inetrnal', fakeAsync(() => {
        const res = { status: component.ACP_STATUS.APPLICATON_NOT_FOUND, acpProvider: 'internal', user: {} as IAcpUser };
        mockAppState.acpAppRes.next(res);
        fixture.detectChanges();

        component.getVerificationDetails();

        tick();

        const CoEnoCardFlow = fixture.debugElement.query(By.css('#coEcard-noflow')).nativeElement;
        fixture.detectChanges();

        expect(component.verificationDetails).toEqual(res);
        expect(component.showCoECardNoFlow).toBeTruthy();
        expect(component.showCoECardYesFlow).toBeFalsy();
        expect(CoEnoCardFlow).toBeDefined();
    }));

    it('Should check the value of showCoECardNoFlow when user have ebbId in his profile and the status is not found and acpProvider external', fakeAsync(() => {
        const res = { status: component.ACP_STATUS.APPLICATON_NOT_FOUND, acpProvider: 'external', user: {} as IAcpUser };
        mockAppState.acpAppRes.next(res);
        fixture.detectChanges();

        component.getVerificationDetails();
        
        tick();

        const CoEyesCardFlow = fixture.debugElement.query(By.css('#coEcard-yesflow')).nativeElement;
        fixture.detectChanges();

        expect(component.verificationDetails).toEqual(res);
        expect(component.showCoECardNoFlow).toBeFalsy();
        expect(component.showCoECardYesFlow).toBeTruthy();
        expect(CoEyesCardFlow).toBeDefined();
    }));
});