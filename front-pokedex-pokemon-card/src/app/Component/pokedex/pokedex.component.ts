import { Component, NgZone, OnInit } from '@angular/core';
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
import { Pokedex, PokedexCompletion } from '../../Models/pokedex';
import { PokedexService } from '../../Services/pokedexService/pokedex.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, Subject, take } from 'rxjs';
import { PokedexScrollService } from '../../Services/PokedexScrollService/pokedex-scroll.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pokedex',
  imports: [MatButtonModule, MatSlideToggleModule, FormsModule, MatIconModule, MatProgressBarModule, MatTooltipModule, MatTooltipModule, NgOptimizedImage],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})

export class PokedexComponent implements OnInit {

  private destroy$ = new Subject<void>();

  generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  genSelected: number = 1;
  pokedexId: number = 0;
  pokedex: Pokedex | null = null;
  pokemons: Pokemon[] = [];
  hiddenPokemonIds: number[] = []
  isPokedexOwner: boolean = false;
  completion: PokedexCompletion | null = null;
  showSearchInput: boolean = false;
  searchText: string = "";
  private searchSubject = new Subject<string>();
  
  filters: PokemonFilter = { filterHiddenActivated: false, filterExceptWantedAndOwned: false, filterExceptHasNoWantedCard: false };

  constructor(private pokemonService: PokemonService, private router: Router, private route: ActivatedRoute, private pokemonUtilsService: PokemonUtilsService, public authService: AuthService, public pokedexService: PokedexService, private scrollService: PokedexScrollService, private ngZone: NgZone) {

    this.searchSubject.pipe(
      debounceTime(1000)
    ).subscribe(searchText => {
      this.doSearch(searchText);
    });
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.genSelected = Number(params.get('gen'))
      this.pokedexId = Number(params.get('pokedexId'));
      this.filters.pokedexId = this.pokedexId;
      this.filters.filterGeneration = this.genSelected;
      this.initData();
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.scrollService.scrollPosition = 0;
    this.router.navigate(['pokedex', this.pokedexId, gen]);
  }

  handlePokemonClick(pokemonId: number): void
  {
    this.scrollService.scrollPosition = window.scrollY;
    this.router.navigate(['/pokedex', this.pokedexId, 'pokemon', pokemonId]);
  }

  handleToggleHideSlide(checked: boolean) : void
  {
    this.filters.filterHiddenActivated = checked;
    this.setPokemons();
  }

  handleToggleWantedOwned(checked: boolean) : void
  {
    this.filters.filterExceptWantedAndOwned = checked;
    this.setPokemons();
  }

  handleToggleHasNoWanted(checked: boolean) : void
  {
    this.filters.filterExceptHasNoWantedCard = checked;
    this.setPokemons();
  }

  isPokemonHidden(id: number)
  {
     return this.hiddenPokemonIds.includes(id);
  }

  handleShareCode()
  {
    if(this.pokedex)
    {
      navigator.clipboard.writeText(this.pokedex?.shareCode).then(() => {
        
      })
    }
  }

  getValueProgressBar()
  {
    if(this.completion?.maxPokemon == 0 || this.completion == null)
    {
      return 0;
    }
    return Math.round((this.completion.ownedPokemonNb / this.completion.maxPokemon) * 100);
  }

  toggleSearch() {
    this.showSearchInput = !this.showSearchInput;
    if(this.searchText != "" && this.showSearchInput == false)
    {
      this.searchText = "";
      this.filters.filterName = undefined;
      this.setPokemons();
    }
  }

  onSearchInputChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.searchSubject.next(input.value);
    }
  }


  private initData()
  {
    this.filters.filterGeneration = this.genSelected;
    this.setPokemons();
    this.loadUserContext();
    this.initPokedex();
  }

  private setPokemons(): void
  {
    this.pokemonService.getFiltered(this.filters).subscribe(pokemons => {
      this.pokemons = pokemons;

      this.ngZone.onStable.pipe(take(1)).subscribe(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: this.scrollService.scrollPosition, behavior: 'auto' });
        });
      });
    })
  }

  private loadUserContext(): void
  {
    this.authService.user$.subscribe(user => {
      if(user)
      {
        this.hiddenPokemonIds = user?.hiddenPokemonIds ?? [];
        this.isPokedexOwner = user?.pokedexUsers.find(pokedex => pokedex.userId == user.id)?.isOwner ?? false;
        this.pokedexService.getCompletion(this.pokedexId, user?.id ?? 0).subscribe(c => {
          this.completion = c;
        });
      }
    })
  }

  private initPokedex(): void
  {
    this.pokedexService.getById(this.pokedexId).subscribe((p) => {
      this.pokedex = p;
    });
  }

  private doSearch(value: string) {
    this.filters.filterName = value;
    this.setPokemons();
  }
}
