import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InjectPokemonCardData, PokemonCard, PokemonCardTypeSelected } from '../../Models/pokemonCard';
import { MatDialogModule, MatDialogContent } from '@angular/material/dialog';
import { PokemonDetailsComponent } from '../pokemon-details/pokemon-details.component';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-pick-pokemon-card',
  imports: [MatDialogModule],
  templateUrl: './pick-pokemon-card.component.html',
  styleUrl: './pick-pokemon-card.component.scss'
})
export class PickPokemonCardComponent {

  readonly dialogRef = inject(MatDialogRef<PokemonDetailsComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: InjectPokemonCardData, private pokemonCardService: PokemonCardService, private authService: AuthService) {}

  handleClickImage(card: PokemonCard){
    if(this.data.type == PokemonCardTypeSelected.chaseCard)
    {
      console.log("chasecarte", card)
      this.pokemonCardService.setWantedCard(card, this.data.pokedexId).subscribe();
      
    } else {
      console.log("mycard", card);
      this.pokemonCardService.setOwnedCard(card, this.data.pokedexId).subscribe();
    }
    
    this.dialogRef.close();
  }


}
