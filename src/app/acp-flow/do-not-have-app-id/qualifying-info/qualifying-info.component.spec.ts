import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifyingInfoComponent } from './qualifying-info.component';

describe('QualifyingInfoComponent', () => {
  let component: QualifyingInfoComponent;
  let fixture: ComponentFixture<QualifyingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualifyingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifyingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
