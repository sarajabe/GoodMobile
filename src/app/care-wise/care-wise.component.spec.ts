import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareWiseComponent } from './care-wise.component';

describe('CareWiseComponent', () => {
  let component: CareWiseComponent;
  let fixture: ComponentFixture<CareWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
