import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthGenerationPageComponent } from './fourth-generation-page.component';

describe('FourthGenerationPageComponent', () => {
  let component: FourthGenerationPageComponent;
  let fixture: ComponentFixture<FourthGenerationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourthGenerationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourthGenerationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
