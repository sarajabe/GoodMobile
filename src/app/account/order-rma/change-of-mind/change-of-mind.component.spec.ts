import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOfMindComponent } from './change-of-mind.component';

describe('ChangeOfMindComponent', () => {
  let component: ChangeOfMindComponent;
  let fixture: ComponentFixture<ChangeOfMindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeOfMindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOfMindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
