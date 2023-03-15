import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpDocumentsComponent } from './acp-documents.component';

describe('AcpDocumentsComponent', () => {
  let component: AcpDocumentsComponent;
  let fixture: ComponentFixture<AcpDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
