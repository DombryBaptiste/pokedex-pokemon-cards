import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../Models/pokemon';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PokemonUtilsService } from '../../Services/pokemonUtilsService/pokemon-utils.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../Services/userService/user.service';
import { AuthService } from '../../Services/auth.service';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PickPokemonCardComponent } from '../pick-pokemon-card/pick-pokemon-card.component';
import { InjectPokemonCardData, PokemonCard, PokemonCardTypeSelected } from '../../Models/pokemonCard';
import { CardState, OwnedPokemonCard, OwnedWantedPokemonCard, WantedPokemonCard } from '../../Models/OwnedChasePokemonCard';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../Services/snackbarService/snackbar.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-pokemon-details',
  imports: [CommonModule ,MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule, MatDialogModule, MatInputModule, FormsModule, MatFormFieldModule, MatSnackBarModule, MatTooltipModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss',
  providers: [ provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class PokemonDetailsComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  CardState = CardState;
  states = Object.values(CardState).filter(v => typeof v === 'number') as number[];


  pokemonId: number = 0;
  pokedexId: number = 0;
  pokemon: Pokemon | null = null;
  cardsSelected: OwnedWantedPokemonCard | null = null;
  hide: boolean = false;
  isReadOnly: boolean = true;

  PokemonCardTypeSelected = PokemonCardTypeSelected;

  constructor(private route: ActivatedRoute, private router: Router, private pokemonService: PokemonService, public pokemonUtilsService: PokemonUtilsService, private userService: UserService, private authService: AuthService, private pokemonCardService: PokemonCardService, private snackbar: SnackbarService, private adapter: DateAdapter<Date>) {
    this.adapter.setLocale('fr-FR');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const pokedexId = params.get('pokedexId');

      if (id && pokedexId) {
        this.pokemonId = parseInt(id, 10);
        this.pokedexId = parseInt(pokedexId, 10);
        this.initData();
      }
    });
  }

  handleBackPokedex()
  {
    this.router.navigate(['/pokedex', this.pokedexId ,this.pokemon?.generation]);
  }

  onToggleVisibility(checked: boolean) {
    this.hide = checked;
    this.userService.setPokemonVisibility(this.pokemon!.id, checked).subscribe(() => {
      this.authService.getCurrentUser().subscribe((user) => this.authService.user$.next(user));
    });
  }

  openListCard(type: PokemonCardTypeSelected)
  {
    if(this.isReadOnly) { return; }
    
    let data: InjectPokemonCardData =
    {
      cards: this.pokemon?.pokemonCards ?? [],
      type: type,
      pokedexId: this.pokedexId,
      pokemonId: this.pokemonId
    };

    const dialogRef =  this.dialog.open(PickPokemonCardComponent, { data: data, panelClass: 'classic-dialog' } );

    dialogRef.afterClosed().subscribe(result => {
      this.initCard();
    })
  }

  handleSave()
  {
    if(this.cardsSelected?.ownedPokemonCard)
    {
      this.pokemonCardService.updateOwned(this.cardsSelected?.ownedPokemonCard.id, this.cardsSelected?.ownedPokemonCard).subscribe(() => {
        this.snackbar.showSuccess('Les données ont été sauvgardés.');
      })
    }
    
  }

  hasPokemonBefore()
  {
    return this.pokemon?.previousPokemonId != null;
  }

  hasPokemonAfter()
  {
    return this.pokemon?.nextPokemonId != null;
  }

  handleNextPokemon()
  {
    this.router.navigate(['/pokedex', this.pokedexId, 'pokemon', this.pokemon?.nextPokemonId]);
  }

  handlePreviousPokemon()
  {
    this.router.navigate(['/pokedex', this.pokedexId, 'pokemon', this.pokemon?.previousPokemonId]);
  }

  getIdExtensionCard(card: WantedPokemonCard | OwnedPokemonCard | undefined)
  {
    if(card == undefined)
    {
      return "";
    }
    return  card.pokemonCard.set.name + " " + card.pokemonCard.localId
  }

  handleClickCM(card: PokemonCard)
  {
    if (!card) return;

    const url = this.pokemonUtilsService.getCardMarketUrl(card.name, card.set.cardMarketPrefix, card.localId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  stateToLabel(state: CardState): string
  {
    return CardState[state];
  }

  private initData()
  {
    this.initPokemon();
    this.loadUserContext();
    this.initCard();
  }

  private initPokemon() {
    this.pokemonService.getById(this.pokemonId).subscribe(pk => {
      this.pokemon = pk;
    });
  }

  private loadUserContext() {
    this.authService.user$.subscribe(u => {
      if (u && u.hiddenPokemonIds && this.pokemonId) {
        this.hide = u.hiddenPokemonIds.includes(this.pokemonId);
      } else {
        this.hide = false;
      }

      this.isReadOnly = u?.pokedexUsers.find(p => p.pokedex.id == this.pokedexId) == null
    });
  }

  private initCard()
  {
    this.pokemonCardService.getCardsByPokedexAndPokemonId(this.pokedexId, this.pokemonId).subscribe((result) =>{
      this.cardsSelected = result;
    })
  }
}
