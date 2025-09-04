import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PickPokemonComponent } from '../pick-pokemon/pick-pokemon.component';
import { InjectPokemonData, Pokemon } from '../../Models/pokemon';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { PokedexService } from '../../Services/pokedexService/pokedex.service';
import { Pokedex } from '../../Models/pokedex';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';
import { PokemonCard } from '../../Models/pokemonCard';
import { OwnedPokemonCard } from '../../Models/OwnedChasePokemonCard';

@Component({
  selector: 'app-specific-pokemon-pokedex',
  imports: [MatIconModule],
  templateUrl: './specific-pokemon-pokedex.component.html',
  styleUrl: './specific-pokemon-pokedex.component.scss',
})
export class SpecificPokemonPokedexComponent implements OnInit {
  @Input() pokedex!: Pokedex;
  readonly dialog = inject(MatDialog);

  pokemons: Pokemon[] = [];

  slotCards: {slot: number; card: PokemonCard[]}[] = [];
  ownedCards: OwnedPokemonCard[] = [];

  constructor(
    private pokemonService: PokemonService,
    private pokedexService: PokedexService,
    private pokemonCardService: PokemonCardService,
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  handleAdd(n: number) {
    let sp = this.pokedex.specificPokemons.find(s => s.slot == n);
    let p = this.pokemons.find((p) => p.id === sp?.pokemonId);

    let data: InjectPokemonData = {
      number: n,
      pokemons: this.pokemons,
      pokemon: p
    };

    const dialogRef = this.dialog.open(PickPokemonComponent, {
      data: data,
      panelClass: 'classic-dialog',
    });
    dialogRef.afterClosed().subscribe((result: Pokemon) => {
      if(result == null) return;
      this.pokedexService
        .setSpecificPokemon(this.pokedex.id, n, result.id)
        .subscribe((sp) => {
          let i = this.pokedex.specificPokemons.findIndex((s) => s.slot === n);
          if (i !== -1) {
            this.pokedex.specificPokemons[i].pokemonId = result.id;
          } else {
            this.pokedex.specificPokemons.push(sp);
          }
          this.initCardBySlot(n, sp.pokemonId);
        });
    });
  }

  hasSlotWithPokemon(slot: number) {
    var result = this.pokedex.specificPokemons.find((s) => s.slot == slot);
    return result != null && result.pokemonId != null;
  }

  getSpecificPokemonBySlot(slot: number) {
    var specific = this.pokedex.specificPokemons.find((s) => s.slot == slot);
    var pokemon = this.pokemons.find((p) => p.id === specific?.pokemonId);
    return pokemon;
  }

  isCardOwned(cardId: number)
  {
    return this.ownedCards.findIndex(oc => oc.pokemonCard.id == cardId) !== -1;
  }

  private initData() {
    this.pokemonService
      .getAll()
      .subscribe((result) => (this.pokemons = result));
    
      this.initCards();
  }

  private initCards()
  {
    this.slotCards = [];
    this.pokedex.specificPokemons.forEach(sp => {
      this.pokemonCardService.getAllByPokemonId(sp.pokemonId).subscribe((r) => {
        var newItem = {slot: sp.slot, card: r}
        this.slotCards.push(newItem);
        this.slotCards.sort((a, b) => a.slot - b.slot);
      })
    })

    this.pokemonCardService.getAllOwned(this.pokedex.id).subscribe(res => this.ownedCards = res);
  }

  private initCardBySlot(n: number, pId: number){
    var sc = this.slotCards.findIndex(sc => sc.slot === n);
    this.pokemonCardService.getAllByPokemonId(pId).subscribe(res => {
      if(sc !== -1)
      {
        this.slotCards[sc].card = res;
      } else {
        var newItem = {slot: n, card: res}
        this.slotCards.push
      }
    })
  }
}
