import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificPokemonPokedexComponent } from './specific-pokemon-pokedex.component';

describe('SpecificPokemonPokedexComponent', () => {
  let component: SpecificPokemonPokedexComponent;
  let fixture: ComponentFixture<SpecificPokemonPokedexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificPokemonPokedexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificPokemonPokedexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
