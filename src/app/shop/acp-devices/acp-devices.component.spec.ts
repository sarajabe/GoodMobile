import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpDevicesComponent } from './acp-devices.component';

describe('AcpDevicesComponent', () => {
  let component: AcpDevicesComponent;
  let fixture: ComponentFixture<AcpDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpDevicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
