import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWantedCardComponent } from './shared-wanted-card.component';

describe('SharedWantedCardComponent', () => {
  let component: SharedWantedCardComponent;
  let fixture: ComponentFixture<SharedWantedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedWantedCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedWantedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
