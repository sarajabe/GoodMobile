import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpSuccessComponent } from './acp-success.component';

describe('AcpSuccessComponent', () => {
  let component: AcpSuccessComponent;
  let fixture: ComponentFixture<AcpSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcpSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
