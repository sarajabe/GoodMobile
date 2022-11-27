import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FooterMainNavbarComponent } from './footer-main-navbar.component';

describe('FooterMainNavbarComponent', () => {
  let component: FooterMainNavbarComponent;
  let fixture: ComponentFixture<FooterMainNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterMainNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterMainNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
