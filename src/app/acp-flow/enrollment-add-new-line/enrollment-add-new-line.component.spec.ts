import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAddNewLineComponent } from './enrollment-add-new-line.component';

describe('EnrollmentAddNewLineComponent', () => {
  let component: EnrollmentAddNewLineComponent;
  let fixture: ComponentFixture<EnrollmentAddNewLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentAddNewLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAddNewLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
