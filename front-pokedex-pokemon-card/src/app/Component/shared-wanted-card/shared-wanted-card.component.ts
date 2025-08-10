import { Component, OnInit } from '@angular/core';
import { PokemonCard } from '../../Models/pokemonCard';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';

@Component({
  selector: 'app-shared-wanted-card',
  imports: [CommonModule],
  templateUrl: './shared-wanted-card.component.html',
  styleUrl: './shared-wanted-card.component.scss'
})
export class SharedWantedCardComponent implements OnInit {
  pokedexId: number = 0;
  pokemoncards: PokemonCard[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonCardService: PokemonCardService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pokedexId = Number(params.get('pokedexId'));

      this.pokemonCardService.getCardsWantedButNotOwned(this.pokedexId).subscribe((r) => {
        this.pokemoncards = r;
      })
    });
    
    
  }
}
