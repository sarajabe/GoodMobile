import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCheckoutComponent } from './device-checkout.component';

describe('DeviceCheckoutComponent', () => {
  let component: DeviceCheckoutComponent;
  let fixture: ComponentFixture<DeviceCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceCheckoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
