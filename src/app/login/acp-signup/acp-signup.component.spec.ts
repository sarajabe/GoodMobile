import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpSignupComponent } from './acp-signup.component';

describe('AcpSignupComponent', () => {
  let component: AcpSignupComponent;
  let fixture: ComponentFixture<AcpSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcpSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
