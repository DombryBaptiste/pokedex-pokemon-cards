import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  InjectPokemonCardData,
  PokemonCard,
  PokemonCardTypeSelected,
} from '../../Models/pokemonCard';
import { MatDialogModule, MatDialogContent } from '@angular/material/dialog';
import { PokemonDetailsComponent } from '../pokemon-details/pokemon-details.component';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';
import { AuthService } from '../../Services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pick-pokemon-card',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './pick-pokemon-card.component.html',
  styleUrl: './pick-pokemon-card.component.scss',
})
export class PickPokemonCardComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PokemonDetailsComponent>);

  title: string = '';
  PokemonCardTypeSelected = PokemonCardTypeSelected;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InjectPokemonCardData,
    private pokemonCardService: PokemonCardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.data.type == PokemonCardTypeSelected.Wanted) {
      this.title = 'Carte Voulue';
    } else {
      this.title = 'Carte Possédée';
    }
  }

  handleClickImage(card: PokemonCard) {
    const request$ = this.data.type === PokemonCardTypeSelected.Wanted
      ? this.pokemonCardService.setWantedCard(card, this.data.pokedexId)
      : this.pokemonCardService.setOwnedCard(card, this.data.pokedexId);

    request$.subscribe(() => {
      this.dialogRef.close();
    });
  }


  handleSuppr() {
    this.pokemonCardService.delete(this.data.pokedexId, this.data.pokemonId, this.data.type).subscribe(() => {
      this.dialogRef.close();
    })
  }

  encodeImageUrl(url: string): string {
    return encodeURI(url);
  }
}
