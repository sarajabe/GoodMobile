import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessSwapComponent } from './success-swap.component';

describe('SuccessSwapComponent', () => {
  let component: SuccessSwapComponent;
  let fixture: ComponentFixture<SuccessSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessSwapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
