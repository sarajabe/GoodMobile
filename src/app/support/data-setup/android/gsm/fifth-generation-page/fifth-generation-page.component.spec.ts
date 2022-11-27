import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifthGenerationPageComponent } from './fifth-generation-page.component';

describe('FifthGenerationPageComponent', () => {
  let component: FifthGenerationPageComponent;
  let fixture: ComponentFixture<FifthGenerationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FifthGenerationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FifthGenerationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
