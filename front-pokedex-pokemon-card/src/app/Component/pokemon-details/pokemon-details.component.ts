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

@Component({
  selector: 'app-pokemon-details',
  imports: [CommonModule ,MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule, MatDialogModule],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss'
})
export class PokemonDetailsComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  pokemonId: number = 0;
  pokemon: Pokemon | null = null;
  hide: boolean = false;

  PokemonCardTypeSelected = PokemonCardTypeSelected;

  constructor(private route: ActivatedRoute, private router: Router, private pokemonService: PokemonService, public pokemonUtilsService: PokemonUtilsService, private userService: UserService, private authService: AuthService, private pokemonCardService: PokemonCardService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if(id != null)
    {
      this.pokemonId = parseInt(id);
      this.initPokemon();
    }
    
  }

  handleBackPokedex()
  {
    this.router.navigate(['/pokedex', this.pokemon?.generation]);
  }

  onToggleVisibility(checked: boolean) {
    this.hide = checked;
    this.userService.setPokemonVisibility(this.pokemon!.pokedexId, checked).subscribe(() => {
      this.authService.getCurrentUser().subscribe((user) => this.authService.user$.next(user));
    });
  }

  openListCard(type: PokemonCardTypeSelected)
  {
    let data: InjectPokemonCardData =
    {
      cards: this.pokemon?.pokemonCards ?? [],
      type: type
    };

    const dialogRef =  this.dialog.open(PickPokemonCardComponent, { data: data, panelClass: 'classic-dialog' } );

    dialogRef.afterClosed().subscribe(result => {
      console.log("FIN");
    })
  }

  private initPokemon() {
    this.pokemonService.getById(this.pokemonId).subscribe(pk => {
      this.pokemon = pk;
      this.initHiddenPokemon();
    });
  }

private initHiddenPokemon() {
  this.authService.user$.subscribe(u => {
    if (u && u.hiddenPokemonIds && this.pokemon) {
      this.hide = u.hiddenPokemonIds.includes(this.pokemon.id);
    } else {
      this.hide = false;
    }
  });
}
}
