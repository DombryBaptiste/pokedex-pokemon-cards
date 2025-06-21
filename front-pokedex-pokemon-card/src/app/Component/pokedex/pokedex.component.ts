import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { Pokemon } from '../../Models/pokemon';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonUtilsService } from '../../Services/pokemonUtilsService/pokemon-utils.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { PokemonFilter } from '../../Models/pokemonFilter';
import { AuthService } from '../../Services/auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-pokedex',
  imports: [MatButtonModule, MatSlideToggleModule, FormsModule, MatIconModule],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})

export class PokedexComponent implements OnInit {

  generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  genSelected: number = 1;
  pokemons: Pokemon[] = [];
  hiddenPokemonIds: number[] = []
  
  filters: PokemonFilter = { filterHiddenActivated: false };

  constructor(private pokemonService: PokemonService, private router: Router, private route: ActivatedRoute, public pokemonUtilsService: PokemonUtilsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.genSelected = Number(params.get('gen'))
    });
    this.setPokemons(this.genSelected);
    this.initHidden();
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
    this.router.navigate(['pokedex', gen]);
    this.setPokemons(gen)
  }

  handlePokemonClick(pokemonId: number): void
  {
    this.router.navigate(['/pokedex/pokemon', pokemonId])
  }

  handleToggleHideSlide(checked: boolean) : void
  {
    this.filters.filterHiddenActivated = checked;
    this.setPokemons(this.genSelected);
  }

  isPokemonHidden(id: number)
  {
     return this.hiddenPokemonIds.includes(id);
  }

  private setPokemons(gen: number): void
  {
    this.pokemonService.getByGen(gen, this.filters).subscribe(pokemons => {
      this.pokemons = pokemons;
    })
  }

  private initHidden(): void
  {
    this.authService.user$.subscribe(user => {
      this.hiddenPokemonIds = user?.hiddenPokemonIds ?? [];
    })
  }
}
