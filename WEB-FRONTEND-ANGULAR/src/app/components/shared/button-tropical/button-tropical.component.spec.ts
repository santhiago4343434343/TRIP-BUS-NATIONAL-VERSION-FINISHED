import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonTropicalComponent } from './button-tropical.component';

describe('ButtonTropical', () => {
  let component: ButtonTropicalComponent;
  let fixture: ComponentFixture<ButtonTropicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonTropicalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ButtonTropicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
