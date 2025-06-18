import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { Pokemon } from '../../Models/pokemon';
import { environment } from '../../../environment';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-pokedex',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})

export class PokedexComponent implements OnInit {

  generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  genSelected: number = 1;
  pokemons: Pokemon[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.setPokemons(this.genSelected);
  }

  getClassButton(gen: number) : string{
    if(gen == this.genSelected)
    {
      return 'selected';
    } else {
      return 'unselected';
    }
  }

  selectGen(gen: number): void
  {
    this.genSelected = gen;
    this.setPokemons(gen)
  }

  formatPokedexId(id: number): string {
    return '#' + id.toString().padStart(3, '0');
  }

  private getFullImageUrl(relativePath: string): string {
    return environment.apiUrl + relativePath;
  }

  private setPokemons(gen: number): void
  {
    this.pokemonService.getByGen(gen).subscribe(pokemons => {
      this.pokemons = pokemons.map(p => ({
        ...p,
        imagePath: this.getFullImageUrl(p.imagePath)
      }));
    })
  }
}
