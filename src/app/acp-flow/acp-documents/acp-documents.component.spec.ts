import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpDocumentsComponent } from './acp-documents.component';
import { EbbManager } from 'src/services/ebb.service';
import { AppState } from 'src/app/app.service';
import { RouterTestingModule } from '@angular/router/testing';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { FirebaseUserProfileService } from '@ztarmobile/zwp-service-backend';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { NgxPageScrollCoreModule, PageScrollService } from 'ngx-page-scroll-core';
import { ACP_MOCKS } from 'src/mocks';
import { of } from 'rxjs';

fdescribe('AcpDocumentsComponent', () => {
  let component: AcpDocumentsComponent;
  let fixture: ComponentFixture<AcpDocumentsComponent>;

  let mockEbbService;
  let mockEbbManager;

  beforeEach(async () => {
    mockEbbService = jasmine.createSpy('EBBService');
    mockEbbManager = jasmine.createSpyObj(['EbbManager', 'eligibilityCodeDescs', 'activeStep']);

    await TestBed.configureTestingModule({
      declarations: [
        AcpDocumentsComponent
      ],
      imports: [
        RouterTestingModule,
        NgxPageScrollCoreModule.forRoot({ duration: 200 }),
      ],
      providers: [
        { provide: AppState },
        { provide: EbbManager },
        { provide: FirebaseUserProfileService, useValue: AngularFireDatabase },
        { provide: PageScrollService },
      ]
    });
    TestBed.overrideProvider(EbbService, { useValue: mockEbbService });
    TestBed.overrideProvider(EbbManager, { useValue: mockEbbManager });
    TestBed.compileComponents();

    fixture = TestBed.createComponent(AcpDocumentsComponent);
    component = fixture.componentInstance;

    mockEbbManager.activeStep.and.returnValue(4);
    mockEbbManager.activeStep = of(4);

    // mockEbbManager.eligibilityCodeDescs.and.returnValue([ACP_MOCKS.ELIGIBILiTY_CODES_DESCS]);
    // mockEbbManager.eligibilityCodeDescs = of([ACP_MOCKS.ELIGIBILiTY_CODES_DESCS]);

    mockEbbManager.eligibilityCodeDescs.and.returnValue([ACP_MOCKS.GENERIC_ELIGIBILiTY_CODES_DESCS]);
    mockEbbManager.eligibilityCodeDescs = of([ACP_MOCKS.GENERIC_ELIGIBILiTY_CODES_DESCS]);

    fixture.detectChanges();
  });

  it('Should create a component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('Should show a document related to generic type when the eligibilty codes is one of the [ E54, E3, E4, E15, E8, E9, E10 ]', () => {
    fixture.whenStable().then(() => {

      component.internalData = ACP_MOCKS.INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      fixture.detectChanges();

      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodes);
    });
  });
});
