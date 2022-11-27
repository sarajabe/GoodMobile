import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IosFourthGenerationPageComponent } from './fourth-generation-page.component';

describe('FourthGenerationPageComponent', () => {
  let component: IosFourthGenerationPageComponent;
  let fixture: ComponentFixture<IosFourthGenerationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IosFourthGenerationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IosFourthGenerationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
