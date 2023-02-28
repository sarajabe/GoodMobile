import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterHelperService } from '@ztarmobile/zwp-services-util';
import { ToastrModule } from 'ngx-toastr';
import { ToastrHelperService } from 'src/services/toast-helper.service';

import { ConfirmMessageModalComponent, ConfirmMessageModalContext } from './confirm-message-modal.component';

describe('ConfirmMessageModalComponent', () => {
    let component: ConfirmMessageModalComponent;
    let fixture: ComponentFixture<ConfirmMessageModalComponent>;
    const mockedDialog = { result: true, context: {} as ConfirmMessageModalContext, setCloseGuard: () => { } };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmMessageModalComponent],
            imports: [
                RouterTestingModule,
                MatAutocompleteModule,
                ToastrModule.forRoot(),
                MatDialogModule],
            providers: [
                { provide: MatDialogRef },
                RouterHelperService,
                ToastrHelperService,
            ]
        });
        TestBed.overrideProvider(MatDialogRef, { useValue: mockedDialog });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmMessageModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should check that the popup disappear when delete button is clicked', () => {
        spyOn(component, 'OK').and.callThrough();
        fixture.detectChanges();
        const deleteBtn = fixture.debugElement.query(By.css('#confirm-btn')).nativeElement;
        fixture.detectChanges();
        deleteBtn.click();
        fixture.detectChanges();
        expect(deleteBtn).toBeDefined();
        expect(component.OK).toHaveBeenCalled();
    });
    it('should check that the popup disappear when no button is clicked', () => {
        spyOn(component, 'cancel').and.callThrough();
        fixture.detectChanges();
        const noBtn = fixture.debugElement.query(By.css('#cancel-btn')).nativeElement;
        fixture.detectChanges();
        noBtn.click();
        fixture.detectChanges();
        expect(noBtn).toBeDefined();
        expect(component.cancel).toHaveBeenCalled();
    });
    it('should check that the popup disappear when close icon is clicked', () => {
        spyOn(component, 'closeDialog').and.callThrough();
        fixture.detectChanges();
        const closePopupBtn = fixture.debugElement.query(By.css('#close-popup-btn')).nativeElement;
        fixture.detectChanges();
        closePopupBtn.click();
        fixture.detectChanges();
        expect(closePopupBtn).toBeDefined();
        expect(component.closeDialog).toHaveBeenCalled();
    });
});
