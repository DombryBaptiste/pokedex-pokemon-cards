import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickPokemonCardComponent } from './pick-pokemon-card.component';

describe('PickPokemonCardComponent', () => {
  let component: PickPokemonCardComponent;
  let fixture: ComponentFixture<PickPokemonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickPokemonCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickPokemonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
