import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEsimSetupComponent } from './account-esim-setup.component';

describe('AccountEsimSetupComponent', () => {
  let component: AccountEsimSetupComponent;
  let fixture: ComponentFixture<AccountEsimSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountEsimSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountEsimSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
