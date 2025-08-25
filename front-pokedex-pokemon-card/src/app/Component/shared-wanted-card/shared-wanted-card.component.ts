import { Component, OnInit } from '@angular/core';
import { PokemonCard } from '../../Models/pokemonCard';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Device } from '../../Utils/device';
import { PokemonUtilsService } from '../../Services/pokemonUtilsService/pokemon-utils.service';

@Component({
  selector: 'app-shared-wanted-card',
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './shared-wanted-card.component.html',
  styleUrl: './shared-wanted-card.component.scss'
})
export class SharedWantedCardComponent implements OnInit {
  pokedexId: number = 0;
  pokemoncards: PokemonCard[] = [];
  isMobile = Device.isMobile();
  
  constructor(
    private route: ActivatedRoute,
    private pokemonCardService: PokemonCardService,
    private pokemonUtilsService: PokemonUtilsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pokedexId = Number(params.get('pokedexId'));

      this.pokemonCardService.getCardsWantedButNotOwned(this.pokedexId).subscribe((r) => {
        this.pokemoncards = r;
      })
    });
  }

  handleClick(card: PokemonCard): void {
    const url = this.pokemonUtilsService.getCardMarketUrl(card.name, card.set.cardMarketPrefix, card.localId);
    
    window.open(url, '_blank', 'noopener,noreferrer');
  } 
}
