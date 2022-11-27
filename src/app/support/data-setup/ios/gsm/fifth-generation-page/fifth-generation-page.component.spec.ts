import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IosFifthGenerationPageComponent } from './fifth-generation-page.component';

describe('FifthGenerationPageComponent', () => {
  let component: IosFifthGenerationPageComponent;
  let fixture: ComponentFixture<IosFifthGenerationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IosFifthGenerationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IosFifthGenerationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
