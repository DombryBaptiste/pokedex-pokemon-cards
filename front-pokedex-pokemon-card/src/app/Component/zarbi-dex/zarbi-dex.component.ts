import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { Pokemon } from '../../Models/pokemon';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InjectPokemonCardData, PokemonCardTypeSelected } from '../../Models/pokemonCard';
import { Pokedex } from '../../Models/pokedex';
import { PickPokemonCardComponent } from '../pick-pokemon-card/pick-pokemon-card.component';
import { OwnedPokemonCard } from '../../Models/OwnedChasePokemonCard';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';

@Component({
  selector: 'app-zarbi-dex',
  imports: [MatIconModule, CommonModule],
  templateUrl: './zarbi-dex.component.html',
  styleUrl: './zarbi-dex.component.scss',
})
export class ZarbiDexComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  @Input() pokedex!: Pokedex;
  @Output() reloadCompletion = new EventEmitter<void>();

  zarbis: Pokemon[] = [];
  ownedCards: OwnedPokemonCard[] = [];

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly pokemonCardService: PokemonCardService
  ) {}

  ngOnInit(): void {
    this.InitData();
  }

  handleClickOpenUpdate(zarbi: Pokemon) {
    let data: InjectPokemonCardData = {
      cards: zarbi.pokemonCards ?? [],
      type: PokemonCardTypeSelected.Owned,
      pokedexId: this.pokedex.id,
      pokemonId: zarbi.id,
      pokemonCardId: this.getOwned(zarbi)?.pokemonCardId,
    };

    const dialogRef = this.dialog.open(PickPokemonCardComponent, {
      data: data,
      panelClass: 'classic-dialog',
    });

    dialogRef.afterClosed().subscribe(() => { 
      this.initCards()
      this.reloadCompletion.emit();
    });
  }

  getOwned(zarbi: Pokemon) {
    return this.ownedCards.find(oc => oc.pokemonId == zarbi.id)
  }

  private InitData() {
    this.initZarbi();
    this.initCards();
  }

  private initZarbi()
  {
    this.pokemonService.getAllZarbi().subscribe((res) => (this.zarbis = res));
  }
  private initCards()
  {
    this.pokemonCardService.getAllOwned(this.pokedex.id).subscribe(res => this.ownedCards = res);
  }
}
