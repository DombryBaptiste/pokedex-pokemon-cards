import { Component, Input, OnInit } from '@angular/core';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';
import { OwnedPokemonCard } from '../../Models/OwnedChasePokemonCard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  @Input() pokedexId!: number;

  ownedCards!: OwnedPokemonCard[];

  constructor(private pokemonCardService: PokemonCardService) { }

  ngOnInit(): void {
    this.pokemonCardService.getAllOwned(this.pokedexId).subscribe(result => {
      this.ownedCards = result;
    })
  }

  isSameDate(first: string | Date, second: string | Date): boolean {
    const firstDate = new Date(first);
    const secondDate = new Date(second);

    return (
      firstDate.getDate() === secondDate.getDate() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getFullYear() === secondDate.getFullYear()
    );
  }

}
