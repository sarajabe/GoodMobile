import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIdPersonalInfoComponent } from './app-id-personal-info.component';

describe('AppIdPersonalInfoComponent', () => {
  let component: AppIdPersonalInfoComponent;
  let fixture: ComponentFixture<AppIdPersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppIdPersonalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIdPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
