import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeloHorizonteComponent } from './belo-horizonte.component';

describe('BeloHorizonteComponent', () => {
  let component: BeloHorizonteComponent;
  let fixture: ComponentFixture<BeloHorizonteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeloHorizonteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeloHorizonteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
