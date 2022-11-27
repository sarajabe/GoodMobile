import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIdValidationComponent } from './app-id-validation.component';

describe('AppIdValidationComponent', () => {
  let component: AppIdValidationComponent;
  let fixture: ComponentFixture<AppIdValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppIdValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIdValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
