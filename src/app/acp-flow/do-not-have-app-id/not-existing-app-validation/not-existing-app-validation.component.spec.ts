import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotExistingAppValidationComponent } from './not-existing-app-validation.component';

describe('NotExistingAppValidationComponent', () => {
  let component: NotExistingAppValidationComponent;
  let fixture: ComponentFixture<NotExistingAppValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotExistingAppValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotExistingAppValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
