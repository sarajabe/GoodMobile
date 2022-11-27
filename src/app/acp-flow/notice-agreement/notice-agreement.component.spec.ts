import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeAgreementComponent } from './notice-agreement.component';

describe('NoticeAgreementComponent', () => {
  let component: NoticeAgreementComponent;
  let fixture: ComponentFixture<NoticeAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticeAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
