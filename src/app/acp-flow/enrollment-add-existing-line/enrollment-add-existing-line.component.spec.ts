import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAddExistingLineComponent } from './enrollment-add-existing-line.component';

describe('EnrollmentAddExistingLineComponent', () => {
  let component: EnrollmentAddExistingLineComponent;
  let fixture: ComponentFixture<EnrollmentAddExistingLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentAddExistingLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAddExistingLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
