import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointUrl } from '@ztarmobile/zwp-service';
import { UserDeviceService } from '@ztarmobile/zwp-service-backend';
import { AuthHttp } from '@ztarmobile/zwp-services-auth';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';

import { CheckPhoneCoverageComponent } from './check-phone-coverage.component';

describe('CheckPhoneCoverageComponent', () => {
  let component: CheckPhoneCoverageComponent;
  let fixture: ComponentFixture<CheckPhoneCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckPhoneCoverageComponent, UiBlockButtonDirective],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: EndpointUrl },
        HttpHandler,
        HttpClient,
        AuthHttp,
        { provide: UserDeviceService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPhoneCoverageComponent);
    component = fixture.componentInstance;
    spyOn(component.router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check if the user selected current mobile number and he is on tmo then the form will not appear and the “You are covered” banner showed appear', () => {
    component.selectedPlanCoveredForTmo = true;
    fixture.detectChanges();
    const coveredBox = fixture.debugElement.query(By.css('#covered-box')).nativeElement;
    const coverageForm = fixture.debugElement.query(By.css('#coverage-form'));
    fixture.detectChanges();
    expect(component.checkCoverageForm.status).toEqual('INVALID');
    expect(coverageForm).toEqual(null);
    expect(coveredBox).toBeDefined();
  });
  it('should check if the user selects current mobile number and his network is not tmo then the check coverage form will appear without any banners', () => {
    component.selectedPlanCoveredForTmo = false;
    fixture.detectChanges();
    const coveredBox = fixture.debugElement.query(By.css('#covered-box'));
    const coverageForm = fixture.debugElement.query(By.css('#coverage-form')).nativeElement;
    fixture.detectChanges();
    expect(coveredBox).toEqual(null);
    expect(coverageForm).toBeDefined();
  });
  it('should check the validation of the check coverage input field (if invalid)', () => {
    component.selectedPlanCoveredForTmo = false;
    fixture.detectChanges();
    component.checkCoverageForm.controls.zipCode.setValue('abcde');
    fixture.detectChanges();
    const invalidZipcode = fixture.debugElement.query(By.css('#invalid-zipcode-msg')).nativeElement;
    fixture.detectChanges();
    expect(invalidZipcode).toBeDefined();
  });
  it('should check the validation of the check coverage input field (if required)', () => {
    component.selectedPlanCoveredForTmo = false;
    fixture.detectChanges();
    component.checkCoverageForm.controls.zipCode.markAsTouched();
    fixture.detectChanges();
    const requiredZipcode = fixture.debugElement.query(By.css('#required-zip-code-label')).nativeElement;
    fixture.detectChanges();
    expect(requiredZipcode).toBeDefined();
  });
  it('should check if the user selects current mobile number and his with tmo network but the coverage returned att then the “service limitation”  banner should appear', () => {
    component.selectedPlanCoveredForTmo = false;
    component.displayLimitationsForCurrent = true;
    fixture.detectChanges();
    const limitationWarning = fixture.debugElement.query(By.css('#limitation-warning')).nativeElement;
    fixture.detectChanges();
    expect(limitationWarning).toBeDefined();
  });
  it('should check if the user entered a non covered postal code then the no coverage banner should appear', () => {
    component.selectedPlanCoveredForTmo = false;
    component.noCoverage = true;
    spyOn(component, 'checkCoverage').and.callThrough();
    fixture.detectChanges();
    component.checkCoverageForm.controls.zipCode.setValue('12345');
    component.checkCoverageForm.controls.zipCode.markAsTouched();
    component.checkCoverageForm.controls.zipCode.markAsDirty();
    fixture.detectChanges();
    const checkCoverageButton = fixture.debugElement.query(By.css('#check-coverage-button')).nativeElement;
    fixture.detectChanges();
    checkCoverageButton.click();
    fixture.detectChanges();
    const noCoverageAlert = fixture.debugElement.query(By.css('#no-coverage-alert')).nativeElement;
    expect(component.noCoverage).toEqual(true);
    expect(component.checkCoverage).toHaveBeenCalled();
    expect(noCoverageAlert).toBeDefined();
  });
  it('should check if the user checks coverage and a the service returns success then the “You are covered” banner should appear', waitForAsync(() => {
    component.selectedPlanCoveredForTmo = false;
    spyOn(component, 'checkCoverage').and.callThrough();
    fixture.detectChanges();
    component.checkCoverageForm.controls.zipCode.setValue('10001');
    component.checkCoverageForm.controls.zipCode.markAsTouched();
    component.checkCoverageForm.controls.zipCode.markAsDirty();
    fixture.detectChanges();
    const checkCoverageButton = fixture.debugElement.query(By.css('#check-coverage-button')).nativeElement;
    fixture.detectChanges();
    checkCoverageButton.click();
    fixture.detectChanges();
    component.covered = true;
    fixture.detectChanges();
    const coveredAlert = fixture.debugElement.query(By.css('#covered-alert')).nativeElement;
    fixture.detectChanges();
    expect(coveredAlert).toBeDefined();
    expect(component.checkCoverage).toHaveBeenCalled();
  }));
  it('should check ff the user checks coverage and a banner appears then he changed the input field then the banner should disappear', waitForAsync(() => {
    component.selectedPlanCoveredForTmo = false;
    component.covered = true;
    spyOn(component, 'checkCoverage').and.callThrough();
    fixture.detectChanges();
    component.checkCoverageForm.controls.zipCode.setValue('10001');
    component.checkCoverageForm.controls.zipCode.markAsTouched();
    component.checkCoverageForm.controls.zipCode.markAsDirty();
    fixture.detectChanges();
    const checkCoverageButton = fixture.debugElement.query(By.css('#check-coverage-button')).nativeElement;
    fixture.detectChanges();
    checkCoverageButton.click();
    fixture.detectChanges();
    const coveredAlert = fixture.debugElement.query(By.css('#covered-alert'));
    fixture.detectChanges();
    component.checkCoverageForm.controls.zipCode.setValue('10001');
    component.checkCoverageForm.controls.zipCode.markAsTouched();
    component.checkCoverageForm.controls.zipCode.markAsDirty();
    fixture.detectChanges();
    expect(coveredAlert).toEqual(null);
    expect(component.checkCoverage).toHaveBeenCalled();
  }));
});
