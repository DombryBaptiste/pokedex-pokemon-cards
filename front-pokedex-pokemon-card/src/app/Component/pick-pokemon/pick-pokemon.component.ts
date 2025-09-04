import { Component, Inject, inject, OnInit } from '@angular/core';
import { SpecificPokemonPokedexComponent } from '../specific-pokemon-pokedex/specific-pokemon-pokedex.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InjectPokemonData, Pokemon } from '../../Models/pokemon';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-pick-pokemon',
  imports: [MatDialogModule, CommonModule, MatAutocompleteModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './pick-pokemon.component.html',
  styleUrl: './pick-pokemon.component.scss'
})
export class PickPokemonComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SpecificPokemonPokedexComponent>);

  title!: string;
  pokemonCtrl = new FormControl('');
  filteredPokemons: Pokemon[] = [];
  selectedPokemon?: Pokemon;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InjectPokemonData,
  ) { }

  ngOnInit(): void {
    if(this.data.pokemon)
    {
      this.title = "Modifier le Pokémon";
    } else {
      this.title = "Ajouter un Pokémon";
    }
    

    this.pokemonCtrl.valueChanges.subscribe(value => {
    const filterValue = (value ?? '').toLowerCase();
    this.filteredPokemons = this.data.pokemons.filter(p =>
      p.name.toLowerCase().includes(filterValue)
    );
  });

  }

  handleSelect(event: MatAutocompleteSelectedEvent)
  {
    const name = event.option.value as string;
    const p = this.data.pokemons.find(x => x.name === name);
    if(!p) return;

    this.selectedPokemon = p;

    this.dialogRef.close(p)
  }
}
