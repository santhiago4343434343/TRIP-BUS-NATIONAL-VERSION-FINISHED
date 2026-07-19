import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalkToUsComponent } from './talk-to-us.component';

describe('TalkToUsComponent', () => {
  let component: TalkToUsComponent;
  let fixture: ComponentFixture<TalkToUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalkToUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalkToUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
