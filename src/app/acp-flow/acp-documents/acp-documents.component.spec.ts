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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

fdescribe('No Flow - ACP Documents Component - Unit Testing', () => {
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
        FormsModule,
        ReactiveFormsModule,
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

    fixture.detectChanges();
  });

  it('Should create a component successfully', () => {
    expect(component).toBeTruthy();
  });

  // Test cases for common codes - generic group
  it('Should check if the user selects E3 then the document required is the generic group and the description should be ( Supplemental Security )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS]);
      mockEbbManager.eligibilityCodeDescs = of([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS]);

      component.internalData = ACP_MOCKS.INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      component.checkDocGroups(component.selectedCodesWithDescs);

      fixture.detectChanges();
      expect(component.selectedCodes).toEqual([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS.code]);
      expect(component.selectedCodesWithDescs).toEqual([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS]);
      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodesWithDescs);

    });
  });

  it('Should check that the common descriptions and documents categories arrays are set correctly depends on the internal data that is related to E3 ( Supplemental Security )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS]);
      mockEbbManager.eligibilityCodeDescs = of([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS]);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.commonDescs).toEqual([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS.description]);
      expect(component.docsCategories).toEqual([{ category: 'Generic Group', descs: component.commonDescs }]);
      expect(component.docsCategories.length).toEqual(1);
      expect(component.commonDescs.length).toEqual(1);
      expect(component.docDetails.length).toEqual(1);
    });
  });

  it('Should check that the document details array are published related to Generic-group', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS]);
      mockEbbManager.eligibilityCodeDescs = of([ACP_MOCKS.E3_GENERIC_ELIGIBILiTY_CODES_DESCS]);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docDetails.length).toEqual(1);
      expect(component.docDetails).toEqual([{ id: 'generic', closeTab: false, consent: false, category: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3.category, proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3.text }]);
    });
  });

  // Test cases for E1 and E2 - generic group
  it('Should check if the user selects E1 and E2 then the document required is the Medicaid and SNAP and the description should be ( New York Medicaid - Supplemental Nutrition Assistance Program (SNAP) )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS);

      component.internalData = ACP_MOCKS.E1_E2_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      component.checkDocGroups(component.selectedCodesWithDescs);

      fixture.detectChanges();
      expect(component.selectedCodes).toEqual(['E1', 'E2']);
      expect(component.selectedCodesWithDescs).toEqual(ACP_MOCKS.E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS);
      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodesWithDescs);

    });
  });

  it('Should check that the common descriptions and documents categories arrays are set correctly depends on internal data that is related to E1 - E2 ( New York Medicaid - Supplemental Nutrition Assistance Program (SNAP) )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E1_E2_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.commonDescs).toEqual(ACP_MOCKS.E1_E2_DESCS);
      expect(component.docsCategories).toEqual([{ category: 'Generic Group', descs: component.commonDescs }]);
      expect(component.docsCategories.length).toEqual(1);
      expect(component.commonDescs.length).toEqual(2);
      expect(component.e1E2Descs.length).toEqual(2);
      expect(component.docDetails.length).toEqual(1);
    });
  });

  it('Should check that docDetails array are published related to Generic-group', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E1_E2_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docDetails.length).toEqual(1);
      expect(component.docDetails).toEqual([{ id: 'generic', closeTab: false, consent: false, category: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E2_E1.category, proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E2_E1.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E2_E1.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E2_E1.text }]);
    });
  });

  // Test cases for E2 only - snap group
  it('Should check if the user selects E2 only then the document required is the SNAP and the description should be ( Supplemental Nutrition Assistance Program (SNAP) )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E2_SNAP_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E2_SNAP_ELIGIBILiTY_CODES_DESCS);

      component.internalData = ACP_MOCKS.E2_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      component.checkDocGroups(component.selectedCodesWithDescs);

      fixture.detectChanges();
      expect(component.selectedCodes).toEqual(['E2']);
      expect(component.selectedCodesWithDescs).toEqual(ACP_MOCKS.E2_SNAP_ELIGIBILiTY_CODES_DESCS);
      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodesWithDescs);

    });
  });

  it('Should check that the common descriptions and documents categories arrays are set correctly depends on internal data that is related to E2 ( Supplemental Nutrition Assistance Program (SNAP) )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E2_SNAP_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E2_SNAP_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E2_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.commonDescs).toEqual([ACP_MOCKS.E2_SNAP_ELIGIBILiTY_CODES_DESCS[0].description]);
      expect(component.docsCategories).toEqual([{ category: 'SNAP', descs: component.commonDescs }]);
      expect(component.docsCategories.length).toEqual(1);
      expect(component.commonDescs.length).toEqual(1);
      expect(component.e2Descs.length).toEqual(1);
      expect(component.docDetails.length).toEqual(1);
    });
  });

  it('Should check that docDetails array are published related to SNAP-group', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E2_SNAP_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E2_SNAP_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E2_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docDetails.length).toEqual(1);
      expect(component.docDetails).toEqual([{ id: 'snap', closeTab: false, consent: false, category: ACP_MOCKS.ACP_DOCUMENTS_MOCK_SNAP_GROUP_E2.category, proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK_SNAP_GROUP_E2.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK_SNAP_GROUP_E2.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK_SNAP_GROUP_E2.text }]);
    });
  });

  // Test cases for E1 only - Medicaid group
  it('Should check if the user selects E1 only then the document required is the Medicaid and the description should be ( New York Medicaid )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E1_MEDICAID_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E1_MEDICAID_ELIGIBILiTY_CODES_DESCS);

      component.internalData = ACP_MOCKS.E1_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      component.checkDocGroups(component.selectedCodesWithDescs);

      fixture.detectChanges();
      expect(component.selectedCodes).toEqual(['E1']);
      expect(component.selectedCodesWithDescs).toEqual(ACP_MOCKS.E1_MEDICAID_ELIGIBILiTY_CODES_DESCS);
      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodesWithDescs);

    });
  });

  it('Should check that the common descriptions and documents categories arrays are set correctly depends on internal data that is related to E1 ( New York Medicaid )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E1_MEDICAID_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E1_MEDICAID_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E1_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.commonDescs).toEqual([ACP_MOCKS.E1_MEDICAID_ELIGIBILiTY_CODES_DESCS[0].description]);
      expect(component.docsCategories).toEqual([{ category: 'Medicaid', descs: component.commonDescs }]);
      expect(component.docsCategories.length).toEqual(1);
      expect(component.commonDescs.length).toEqual(1);
      expect(component.e1Descs.length).toEqual(1);
      expect(component.docDetails.length).toEqual(1);
    });
  });

  it('Should check that the document details array are published related to Medicaid-group', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E1_MEDICAID_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E1_MEDICAID_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E1_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docDetails.length).toEqual(1);
      expect(component.docDetails).toEqual([{ id: 'medicaid', closeTab: false, consent: false, category: ACP_MOCKS.ACP_DOCUMENTS_MOCK_MEDICAID_GROUP_E1.category, proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK_MEDICAID_GROUP_E1.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK_MEDICAID_GROUP_E1.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK_MEDICAID_GROUP_E1.text }]);
    });
  });

  // Test cases for E13 only - Through income 
  it('Should check if the user selects E13 only then the document required is the Through income and the description should be ( Eligibility Based on Income )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E13_INCOME_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E13_INCOME_ELIGIBILiTY_CODES_DESCS);

      component.internalData = ACP_MOCKS.E13_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      component.checkDocGroups(component.selectedCodesWithDescs);

      fixture.detectChanges();
      expect(component.selectedCodes).toEqual(['E13']);
      expect(component.selectedCodesWithDescs).toEqual(ACP_MOCKS.E13_INCOME_ELIGIBILiTY_CODES_DESCS);
      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodesWithDescs);

    });
  });

  it('Should check that the common descriptions and documents categories arrays are set correctly depends on internal data that is related to E13 ( Eligibility Based on Income )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E13_INCOME_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E13_INCOME_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E13_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docsCategories).toEqual([{ category: 'Through income', descs: component.incomeDescs }]);
      expect(component.docsCategories.length).toEqual(1);
      expect(component.commonDescs.length).toEqual(0);
      expect(component.incomeDescs.length).toEqual(1);
      expect(component.docDetails.length).toEqual(1);
    });
  });

  it('Should check that the document details array are published related to Through income-group', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E13_INCOME_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E13_INCOME_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E13_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docDetails.length).toEqual(1);
      expect(component.docDetails).toEqual([{ id: 'income', closeTab: false, consent: false, category: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13.category, proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13.text }]);
    });
  });

  // Test cases for E50 or E51 only - Pell grant 
  it('Should check if the user selects E50 or E51 only then the document required is the Pell grant and the description should be ( School Lunch/Breakfast Program - Federal Pell Grant )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E50_E51_Pell_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E50_E51_Pell_ELIGIBILiTY_CODES_DESCS);

      component.internalData = ACP_MOCKS.E50_E51_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      component.checkDocGroups(component.selectedCodesWithDescs);

      fixture.detectChanges();
      expect(component.selectedCodes).toEqual(['E50', 'E51']);
      expect(component.selectedCodesWithDescs).toEqual(ACP_MOCKS.E50_E51_Pell_ELIGIBILiTY_CODES_DESCS);
      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodesWithDescs);

    });
  });

  it('Should check that the common descriptions and documents categories arrays are set correctly depends on internal data that is related to E50 - E51 ( School Lunch/Breakfast Program - Federal Pell Grant )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E50_E51_Pell_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E50_E51_Pell_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E50_E51_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docsCategories).toEqual([{ category: 'Pell Grant', descs: component.pellGrantDescs }]);
      expect(component.docsCategories.length).toEqual(1);
      expect(component.commonDescs.length).toEqual(0);
      expect(component.pellGrantDescs.length).toEqual(2);
      expect(component.docDetails.length).toEqual(1);
    });
  });

  it('Should check that the document details array are published related to Through Pell grant-group', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E50_E51_Pell_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E50_E51_Pell_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E50_E51_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docDetails.length).toEqual(1);
      expect(component.docDetails).toEqual([{ id: 'pell-grant', closeTab: false, consent: false, category: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E50_E51.category, proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E50_E51.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E50_E51.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E50_E51.text }]);
    });
  });

  // Test cases Through income and generic group
  it('Should check if the user selects E13 and E3 only then the document required is the Through income and generic group and the description should be ( Eligibility Based on Income - Supplemental Security )', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E13_E3_INCOME_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E13_E3_INCOME_ELIGIBILiTY_CODES_DESCS);

      component.internalData = ACP_MOCKS.E13_E3_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      component.checkDocGroups(component.selectedCodesWithDescs);

      fixture.detectChanges();
      expect(component.selectedCodes).toEqual(['E3', 'E13']);
      expect(component.selectedCodesWithDescs).toEqual(ACP_MOCKS.E13_E3_INCOME_ELIGIBILiTY_CODES_DESCS);
      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodesWithDescs);

    });
  });

  it('Should check that the common descriptions and documents categories arrays are set correctly depends on internal data that is related to E13 - Through income and E3-Generic group', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E13_E3_INCOME_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E13_E3_INCOME_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E13_E3_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docsCategories).toEqual([{ category: 'Generic Group', descs: component.commonDescs }, { category: 'Through income', descs: component.incomeDescs }]);
      expect(component.docsCategories.length).toEqual(2);
      expect(component.commonDescs.length).toEqual(1);
      expect(component.incomeDescs.length).toEqual(1);
      expect(component.docDetails.length).toEqual(2);
    });
  });

  it('Should check that the document details array are published related to Through income-group and Generic-group', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.E13_E3_INCOME_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.E13_E3_INCOME_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.E13_E3_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docDetails.length).toEqual(2);
      expect(component.docDetails).toEqual([{ id: 'generic', closeTab: false, consent: false, category: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3.category, proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3.text }, { id: 'income', closeTab: false, consent: false, category: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13.category, proofs: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13.proofs, slides: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13.slides, text: ACP_MOCKS.ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13.text }]);
    });
  });

  // Test cases for all groups all toghether 
  it('Should check if the user selects all groups all toghether', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.ALL_GROUPS_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.ALL_GROUPS_ELIGIBILiTY_CODES_DESCS);

      component.internalData = ACP_MOCKS.ALL_GROUPS_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups').and.callThrough();
      component.checkDocGroups(component.selectedCodesWithDescs);

      fixture.detectChanges();
      expect(component.selectedCodes).toEqual(['E1', 'E2', 'E4', 'E13', 'E50']);
      expect(component.selectedCodesWithDescs).toEqual(ACP_MOCKS.ALL_GROUPS_ELIGIBILiTY_CODES_DESCS);
      expect(component.checkDocGroups).toHaveBeenCalledWith(component.selectedCodesWithDescs);

    });
  });

  it('Should check that the common descriptions and documents categories arrays are set correctly depends on internal data that is related to all groups', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.ALL_GROUPS_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.ALL_GROUPS_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.ALL_GROUPS_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docsCategories).toEqual([{ category: 'Generic Group', descs: component.commonDescs }, { category: 'Pell Grant', descs: component.pellGrantDescs }, { category: 'Through income', descs: component.incomeDescs }]);
      expect(component.docsCategories.length).toEqual(3);
      expect(component.commonDescs.length).toEqual(3);
      expect(component.incomeDescs.length).toEqual(1);
      expect(component.pellGrantDescs.length).toEqual(1);
      expect(component.docDetails.length).toEqual(3);
    });
  });

  it('Should check that the document details array are published related to all groups', () => {
    fixture.whenStable().then(() => {
      mockEbbManager.eligibilityCodeDescs.and.returnValue(ACP_MOCKS.ALL_GROUPS_ELIGIBILiTY_CODES_DESCS);
      mockEbbManager.eligibilityCodeDescs = of(ACP_MOCKS.ALL_GROUPS_ELIGIBILiTY_CODES_DESCS);
      fixture.detectChanges();

      component.internalData = ACP_MOCKS.ALL_GROUPS_INTERNAL_DATA;
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'checkDocGroups');
      spyOn(component, 'checkDocsDescs');
      component.checkDocGroups(component.selectedCodesWithDescs);
      fixture.detectChanges();

      expect(component.docDetails.length).toEqual(3);
    });
  });
});
