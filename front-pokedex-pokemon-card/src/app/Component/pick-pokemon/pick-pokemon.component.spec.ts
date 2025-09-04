import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickPokemonComponent } from './pick-pokemon.component';

describe('PickPokemonComponent', () => {
  let component: PickPokemonComponent;
  let fixture: ComponentFixture<PickPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickPokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
