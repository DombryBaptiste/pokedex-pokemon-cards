import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PokemonFilter } from '../../Models/pokemonFilter';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { Pokemon } from '../../Models/pokemon';
import { PokedexScrollService } from '../../Services/PokedexScrollService/pokedex-scroll.service';
import { debounceTime, Subject, take } from 'rxjs';
import { Router } from '@angular/router';
import { Pokedex } from '../../Models/pokedex';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-living-dex-pokedex',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    NgOptimizedImage,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './living-dex-pokedex.component.html',
  styleUrl: './living-dex-pokedex.component.scss',
})
export class LivingDexPokedexComponent implements OnInit {
  @Input() pokedex!: Pokedex;
  @Input() genSelected: number = 1;

  pokemons: Pokemon[] = [];
  showSearchInput: boolean = false;
  searchText: string = '';
  generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  private searchSubject = new Subject<string>();

  filters: PokemonFilter = {
    filterExceptWantedAndOwned: false,
    filterExceptHasNoWantedCard: false,
  };

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly ngZone: NgZone,
    private readonly scrollService: PokedexScrollService,
    private readonly router: Router
  ) {
    this.searchSubject.pipe(debounceTime(1000)).subscribe((searchText) => {
      this.doSearch(searchText);
    });
  }

  ngOnInit(): void {
    this.filters.filterGeneration = this.genSelected;
    this.filters.pokedexId = this.pokedex.id;

    this.setPokemons();
  }

  toggleSearch() {
    this.showSearchInput = !this.showSearchInput;
    if (this.searchText != '' && this.showSearchInput == false) {
      this.searchText = '';
      this.filters.filterName = undefined;
      this.setPokemons();
    }
  }

  getClassButton(gen: number): string {
    if (gen == this.genSelected) {
      return 'selected';
    } else {
      return 'unselected';
    }
  }

  selectGen(gen: number): void {
    this.scrollService.scrollPosition = 0;

    this.genSelected = gen;
    this.setPokemons();
  }

  handlePokemonClick(pokemonId: number): void {
    this.scrollService.scrollPosition = window.scrollY;
    this.router.navigate(['/pokedex', this.pokedex.id, 'pokemon', pokemonId]);
  }

  handleToggleWantedOwned(checked: boolean): void {
    this.filters.filterExceptWantedAndOwned = checked;
    this.setPokemons();
  }

  handleToggleHasNoWanted(checked: boolean): void {
    this.filters.filterExceptHasNoWantedCard = checked;
    this.setPokemons();
  }

  onSearchInputChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.searchSubject.next(input.value);
    }
  }

  private setPokemons(): void {
    this.filters.filterGeneration = this.genSelected;

    this.pokemonService.getFiltered(this.filters).subscribe((pokemons) => {
      this.pokemons = pokemons;

      this.ngZone.onStable.pipe(take(1)).subscribe(() => {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: this.scrollService.scrollPosition,
            behavior: 'auto',
          });
        });
      });
    });
  }

  private doSearch(value: string) {
    this.filters.filterName = value;
    this.setPokemons();
  }
}
