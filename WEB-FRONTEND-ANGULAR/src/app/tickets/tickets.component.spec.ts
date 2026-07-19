import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ticketscomponent } from './tickets.component';

describe('Tickets', () => {
  let component: ticketscomponent;
  let fixture: ComponentFixture<ticketscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ticketscomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ticketscomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
