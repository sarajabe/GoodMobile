import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpErrorComponent } from './acp-error.component';

describe('AcpErrorComponent', () => {
  let component: AcpErrorComponent;
  let fixture: ComponentFixture<AcpErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
