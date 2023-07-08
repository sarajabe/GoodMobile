import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoNonExisitngAppComponent } from './personal-info.component';

describe('PersonalInfoNonExisitngAppComponent', () => {
  let component: PersonalInfoNonExisitngAppComponent;
  let fixture: ComponentFixture<PersonalInfoNonExisitngAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalInfoNonExisitngAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoNonExisitngAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
