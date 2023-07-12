import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIdAddressInfoComponent } from './app-id-address-info.component';

describe('AppIdAddressInfoComponent', () => {
  let component: AppIdAddressInfoComponent;
  let fixture: ComponentFixture<AppIdAddressInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppIdAddressInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppIdAddressInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
