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
import { MatDialog, MatDialogModule, MatDialogContent } from '@angular/material/dialog';
import { PickPokemonCardComponent } from '../pick-pokemon-card/pick-pokemon-card.component';
import { InjectPokemonCardData, PokemonCard, PokemonCardTypeSelected } from '../../Models/pokemonCard';
import { OwnedWantedPokemonCard } from '../../Models/OwnedChasePokemonCard';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-pokemon-details',
  imports: [CommonModule ,MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule, MatDialogModule, MatInputModule, FormsModule, MatFormFieldModule],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss'
})
export class PokemonDetailsComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  pokemonId: number = 0;
  pokedexId: number = 0;
  pokemon: Pokemon | null = null;
  cardsSelected: OwnedWantedPokemonCard | null = null;
  hide: boolean = false;
  isReadOnly: boolean = true;

  PokemonCardTypeSelected = PokemonCardTypeSelected;

  constructor(private route: ActivatedRoute, private router: Router, private pokemonService: PokemonService, public pokemonUtilsService: PokemonUtilsService, private userService: UserService, private authService: AuthService, private pokemonCardService: PokemonCardService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const pokedexId = this.route.snapshot.paramMap.get('pokedexId');

    if(id != null && pokedexId != null)
    {
      this.pokemonId = parseInt(id);
      this.pokedexId = parseInt(pokedexId);
      this.initData();
    }
    
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

  handleSavePrice()
  {
    if(this.cardsSelected?.ownedPokemonCard)
    { 
      this.pokemonCardService.updateOwned(this.cardsSelected?.ownedPokemonCard.id, this.cardsSelected?.ownedPokemonCard).subscribe(() => {
        
      })
    }
    
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
        console.log(this.pokemon);
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
