import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressInfoNonAppExisitngComponent } from './address-info.component';

describe('AddressInfoNonAppExisitngComponent', () => {
  let component: AddressInfoNonAppExisitngComponent;
  let fixture: ComponentFixture<AddressInfoNonAppExisitngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressInfoNonAppExisitngComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInfoNonAppExisitngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
