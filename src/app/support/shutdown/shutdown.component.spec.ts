import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IDeviceCompatibility, IPhonesList, ManufacturerConfigurationService, UserDeviceService } from '@ztarmobile/zwp-service-backend';
import { CustomFormsModule } from 'ng4-validators';
import { DialogRef, ModalContext } from 'ngx-modialog-7';
import { PageScrollService } from 'ngx-page-scroll-core';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { CAPTCHA_SITE_ID } from 'src/environments/environment';
import { ConfirmMessageModalComponent, ConfirmMessageModalContext } from 'src/modals/confirm-message-modal/confirm-message-modal.component';
import { ModalHelperService, ModalSetting } from 'src/services/modal-helper.service';
import { ToastrHelperService } from 'src/services/toast-helper.service';
import { UiBlockButtonDirective } from 'src/widgets/directives/ui-block-button.directive';

import { ShutdownComponent } from './shutdown.component';

describe('ShutdownComponent', () => {
  let component: ShutdownComponent;
  let fixture: ComponentFixture<ShutdownComponent>;
  let component2: ConfirmMessageModalComponent;
  let fixture2: ComponentFixture<ConfirmMessageModalComponent>;
  let mockManufacturerConfigurationService;
  let mockUserDeviceService;
  let mockModalHelperService;
  let MDNInputField: AbstractControl;
  let equipmentNumberInputField: AbstractControl;
  let zipCodeInputField: AbstractControl;
  const PHONES_LIST = [
    {
      manufacturer: 'Alcatel',
      modelNumber: 'A3X (A600DL)',
      productType: 'Phone'
    } as IPhonesList,
    {
      manufacturer: 'Alcatel',
      modelNumber: 'A3 (A509DL)',
      productType: 'Phone'
    } as IPhonesList,
    {
      manufacturer: 'ZTE',
      modelNumber: 'AT&T TREK 2 HD (K88)',
      productType: 'Phone'
    } as IPhonesList,
    {
      manufacturer: 'ZTE',
      modelNumber: 'AT&T Primetime (K92)',
      productType: 'Phone'
    } as IPhonesList
  ];
  const MODAL_CONTEXT = {
    title: true,
    message: 'Your current phone/device registered on the network is showing VoLTE capable, so this phone will continue to work after the 3G shutdown.',
    settings: {
      title: 'The Phone/Device for this phone number is not impacted, no action necessary!',
      okText: 'Go to my Account Summary',
      cancelText: 'Check another phone number',
      customClass: 'impacted-modal',
    } as ModalSetting
  } as ConfirmMessageModalContext;
  const mockedDialog = { result: true, context: MODAL_CONTEXT, setCloseGuard: () => { } };
  const MDN = {
    meta: {
      count: 1
    },
    carrierValidity: [
      {
        brand: 'Apple',
        compatible: true,
        equipmentType: '4GLTE',
        iccidRequired: false,
        id: '354389069854429',
        manufacturer: 'Apple',
        marketingName: 'iPhone 6 Plus',
        model: 'iPhone 6 Plus (A1522)',
        network: 'att',
        networkType: 'GSM',
        os: 'iOS',
        portRequired: false,
        serialType: 'imei',
        skuIdentifier: 'G',
        skuNumber: 'SIMG2G4GLTE'
      }
    ]
  } as IDeviceCompatibility;
  @Component({ selector: 'app-re-captcha', template: '' })
  class MockRecaptchaComponent { }
  beforeEach(async () => {
    mockManufacturerConfigurationService = jasmine.createSpyObj(['ManufacturerConfigurationService', 'phonesList']);
    mockUserDeviceService = jasmine.createSpyObj(['UserDeviceService', 'checkDeviceCompatabilityWithMdn']);
    mockModalHelperService = jasmine.createSpyObj(['ModalHelperService', 'showConfirmMessageModal', 'setCloseGuard']);
    TestBed.configureTestingModule({
      declarations: [ShutdownComponent,
        UiBlockButtonDirective,
        MockRecaptchaComponent,
        ConfirmMessageModalComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        CustomFormsModule,
        NgxPrintModule,
        ToastrModule.forRoot()
      ],
      providers: [
      { provide: ToastrHelperService },
      { provide: ManufacturerConfigurationService },
      { provide: PageScrollService },
      { provide: DialogRef }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    TestBed.overrideProvider(ManufacturerConfigurationService, { useValue: mockManufacturerConfigurationService });
    TestBed.overrideProvider(UserDeviceService, { useValue: mockUserDeviceService });
    TestBed.overrideProvider(ModalHelperService, { useValue: mockModalHelperService });
    TestBed.overrideProvider(DialogRef, { useValue: mockedDialog });
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShutdownComponent);
    component = fixture.componentInstance;
    fixture2 = TestBed.createComponent(ConfirmMessageModalComponent);
    component2 = fixture2.componentInstance;
    spyOn(component.router, 'navigate');
    component.captchaValid = true;
    component.secondcaptchaValid = true;
    component.SITE_ID = CAPTCHA_SITE_ID;
    mockManufacturerConfigurationService.phonesList.and.returnValue(PHONES_LIST);
    mockManufacturerConfigurationService.phonesList = of(PHONES_LIST);
    mockUserDeviceService.checkDeviceCompatabilityWithMdn.and.resolveTo(MDN);
    mockModalHelperService.setCloseGuard.and.resolveTo(mockedDialog);
    mockModalHelperService.showConfirmMessageModal.and.resolveTo(mockedDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should check initial form values for checkMDNForm form group', () => {
    MDNInputField = component.checkMDNForm.controls.checkMDN;
    fixture.detectChanges();
    expect(MDNInputField.value).toEqual('');
    expect(component.checkMDNForm.valid).toBeFalsy();
  });
  it('Should check initial form values for checkIMEIForm form group', () => {
    equipmentNumberInputField = component.checkIMEIForm.controls.checkIMEI;
    zipCodeInputField = component.checkIMEIForm.controls.zipCode;
    fixture.detectChanges();
    expect(equipmentNumberInputField.value).toEqual('');
    expect(zipCodeInputField.value).toEqual('');
    expect(component.checkIMEIForm.valid).toBeFalsy();
  });
  it('Should check initial form values for manufacturer group', () => {
    const manufacturerInput = fixture.debugElement.query(By.css('#manufacturer'));
    const availableDevicesSection = fixture.debugElement.query(By.css('#availableDevicesSection'));
    fixture.detectChanges();
    expect(manufacturerInput.nativeElement.value).toEqual('');
    expect(availableDevicesSection).toEqual(null);
  });
  it('Should show validation messages when values are empty in checkMDNForm', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      MDNInputField = component.checkMDNForm.controls.checkMDN;
      fixture.detectChanges();
      MDNInputField.setValue('');
      MDNInputField.markAsTouched();
      fixture.detectChanges();
      const requiredcheckMDNMsg = fixture.debugElement.query(By.css('#required-checkMDN-msg'));
      const firstCaptchaMsg = fixture.debugElement.query(By.css('#first-captcha-msg'));
      fixture.detectChanges();
      expect(MDNInputField.errors.required).toBeTruthy();
      expect(requiredcheckMDNMsg.nativeElement).toBeDefined();
      expect(firstCaptchaMsg).toEqual(null);
      expect(component.checkMDNForm.valid).toBeFalsy();
    });
  }));
  it('Should show validation messages when values are empty in checkIMEIForm', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      equipmentNumberInputField = component.checkIMEIForm.controls.checkIMEI;
      zipCodeInputField = component.checkIMEIForm.controls.zipCode;
      fixture.detectChanges();
      equipmentNumberInputField.setValue('');
      equipmentNumberInputField.markAsTouched();
      fixture.detectChanges();
      zipCodeInputField.setValue('');
      zipCodeInputField.markAsTouched();
      fixture.detectChanges();
      const requiredCheckIMEIMsg = fixture.debugElement.query(By.css('#required-checkIMEI-msg'));
      const requiredZipcodeMsg = fixture.debugElement.query(By.css('#required-zipcode-msg'));
      const secondCaptchaMsg = fixture.debugElement.query(By.css('#second-captcha-msg'));
      expect(equipmentNumberInputField.errors.required).toBeTruthy();
      expect(zipCodeInputField.errors.required).toBeTruthy();
      expect(requiredCheckIMEIMsg.nativeElement).toBeDefined();
      expect(requiredZipcodeMsg.nativeElement).toBeDefined();
      expect(secondCaptchaMsg).toEqual(null);
      expect(component.checkIMEIForm.valid).toBeFalsy();
    });
  }));
  it('Should show validation messages when values are invalid in checkMDNForm', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      MDNInputField = component.checkMDNForm.controls.checkMDN;
      fixture.detectChanges();
      MDNInputField.setValue('000000');
      MDNInputField.markAsTouched();
      MDNInputField.markAsDirty();
      fixture.detectChanges();
      const invalidcheckMDNMsg = fixture.debugElement.query(By.css('#invalid-checkMDN-msg'));
      fixture.detectChanges();
      expect(MDNInputField.errors.minlength).toBeTruthy();
      expect(invalidcheckMDNMsg.nativeElement).toBeDefined();
      fixture.detectChanges();
      MDNInputField.setValue('0000000000');
      MDNInputField.markAsTouched();
      MDNInputField.markAsDirty();
      fixture.detectChanges();
      expect(MDNInputField.errors.pattern).toBeTruthy();
      expect(invalidcheckMDNMsg.nativeElement).toBeDefined();
      expect(component.checkMDNForm.valid).toBeFalsy();
    });
  }));
  it('Should show validation messages when values are invalid in checkIMEIForm', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      equipmentNumberInputField = component.checkIMEIForm.controls.checkIMEI;
      zipCodeInputField = component.checkIMEIForm.controls.zipCode;
      fixture.detectChanges();
      equipmentNumberInputField.setValue('353260');
      equipmentNumberInputField.markAsTouched();
      equipmentNumberInputField.markAsDirty();
      zipCodeInputField.setValue('260');
      zipCodeInputField.markAsTouched();
      zipCodeInputField.markAsDirty();
      fixture.detectChanges();
      const invalidCheckIMEIMsg = fixture.debugElement.query(By.css('#invalid-checkIMEI-msg'));
      const invalidZipcodeMsg = fixture.debugElement.query(By.css('#invalid-zipcode-msg'));
      fixture.detectChanges();
      expect(equipmentNumberInputField.errors.minlength).toBeTruthy();
      expect(zipCodeInputField.errors.minlength).toBeTruthy();
      expect(invalidCheckIMEIMsg.nativeElement).toBeDefined();
      expect(invalidZipcodeMsg.nativeElement).toBeDefined();
      equipmentNumberInputField.setValue('3532600000abc');
      equipmentNumberInputField.markAsTouched();
      equipmentNumberInputField.markAsDirty();
      zipCodeInputField.setValue('35abc');
      zipCodeInputField.markAsTouched();
      zipCodeInputField.markAsDirty();
      fixture.detectChanges();
      expect(equipmentNumberInputField.errors.pattern).toBeTruthy();
      expect(zipCodeInputField.errors.pattern).toBeTruthy();
      expect(invalidCheckIMEIMsg.nativeElement).toBeDefined();
      expect(invalidZipcodeMsg.nativeElement).toBeDefined();
      expect(component.checkIMEIForm.valid).toBeFalsy();
    });
  }));
  it('Should check if the checkMDNForm is valid when inserting valid cardinals', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      MDNInputField = component.checkMDNForm.controls.checkMDN;
      fixture.detectChanges();
      MDNInputField.setValue('2142070607');
      MDNInputField.markAsTouched();
      MDNInputField.markAsDirty();
      fixture.detectChanges();
      spyOn(component, 'resolvedCaptcha');
      const captchaClick: DebugElement = fixture.debugElement.query(By.css('#captcha-box'));
      captchaClick.nativeElement.click();
      fixture.detectChanges();
      const invalidcheckMDNMsg = fixture.debugElement.query(By.css('#invalid-checkMDN-msg'));
      fixture.detectChanges();
      spyOn(component, 'checkMDNValidation');
      const checkMDNbtn: DebugElement = fixture.debugElement.query(By.css('#checkMDNbtn'));
      checkMDNbtn.nativeElement.click();
      fixture.detectChanges();
      expect(component.checkMDNValidation).toHaveBeenCalled();
      expect(invalidcheckMDNMsg).toEqual(null);
      expect(component.checkMDNForm.valid).toBeTruthy();
      expect(component.processingRequest).toBeFalsy();
    });
  }));
  it('Should check if the checkIMEIForm is valid when inserting valid cardinals', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      equipmentNumberInputField = component.checkIMEIForm.controls.checkIMEI;
      zipCodeInputField = component.checkIMEIForm.controls.zipCode;
      fixture.detectChanges();
      equipmentNumberInputField.setValue('32112332112332');
      equipmentNumberInputField.markAsTouched();
      equipmentNumberInputField.markAsDirty();
      zipCodeInputField.setValue('00962');
      zipCodeInputField.markAsTouched();
      zipCodeInputField.markAsDirty();
      fixture.detectChanges();
      spyOn(component, 'secondResolvedCaptcha');
      const captchaClick: DebugElement = fixture.debugElement.query(By.css('#captcha-box2'));
      captchaClick.nativeElement.click();
      fixture.detectChanges();
      const invalidCheckIMEIMsg = fixture.debugElement.query(By.css('#invalid-checkIMEI-msg'));
      const invalidZipcodeMsg = fixture.debugElement.query(By.css('#invalid-zipcode-msg'));
      fixture.detectChanges();
      spyOn(component, 'checkIMEIValidation');
      const checkIMEIbtn: DebugElement = fixture.debugElement.query(By.css('#checkIMEIbtn'));
      checkIMEIbtn.nativeElement.click();
      fixture.detectChanges();
      expect(component.checkIMEIValidation).toHaveBeenCalled();
      expect(invalidCheckIMEIMsg).toEqual(null);
      expect(invalidZipcodeMsg).toEqual(null);
      expect(component.checkIMEIForm.valid).toBeTruthy();
      expect(component.secondProcessingRequest).toBeFalsy();
    });
  }));
  it('Should check if the phone dropdown list shows on manufacturer selection', waitForAsync(() => {
    const select: HTMLSelectElement = fixture.debugElement.query(By.css('#manufacturer')).nativeElement;
    spyOn(component, 'checkSelected').and.callThrough();
    fixture.detectChanges();
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const availableDevicesSection = fixture.debugElement.query(By.css('#availableDevicesSection'));
    fixture.detectChanges();
    expect(select.value).toEqual('ZTE');
    expect(component.checkSelected).toHaveBeenCalled();
    expect(availableDevicesSection.nativeElement).toBeDefined();
  }));
  it('Should show that the number is NOT impacted when inserting a G2G ATT valid number', async () => {
      spyOn(component, 'checkMDNValidation').and.callThrough();
      spyOn(component2.dialog, 'setCloseGuard').and.callThrough();
      spyOn(component2, 'OK').and.callThrough();
      fixture.detectChanges();
      fixture2.detectChanges();
      MDNInputField = component.checkMDNForm.controls.checkMDN;
      fixture.detectChanges();
      MDNInputField.setValue('3322149632');
      MDNInputField.markAsTouched();
      MDNInputField.markAsDirty();
      fixture.detectChanges();
      fixture2.detectChanges();
      spyOn(component, 'resolvedCaptcha');
      const captchaClick: DebugElement = fixture.debugElement.query(By.css('#captcha-box'));
      captchaClick.nativeElement.click();
      fixture.detectChanges();
      const checkMDNbtn: DebugElement = fixture.debugElement.query(By.css('#checkMDNbtn'));
      checkMDNbtn.nativeElement.click();
      fixture.detectChanges();
      fixture2.detectChanges();
      const modalConfirmBtn: DebugElement = fixture2.debugElement.query(By.css('#cancel-btn'));
      fixture2.detectChanges();
      modalConfirmBtn.nativeElement.click();
      fixture.detectChanges();
      fixture2.detectChanges();
      expect(mockUserDeviceService.checkDeviceCompatabilityWithMdn).toHaveBeenCalled();
  });
});
