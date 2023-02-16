import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortSubmittedComponent } from './port-submitted.component';

describe('PortSubmittedComponent', () => {
  let component: PortSubmittedComponent;
  let fixture: ComponentFixture<PortSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortSubmittedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
