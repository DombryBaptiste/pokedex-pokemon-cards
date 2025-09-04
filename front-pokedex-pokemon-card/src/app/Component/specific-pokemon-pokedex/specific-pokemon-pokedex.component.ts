import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PickPokemonComponent } from '../pick-pokemon/pick-pokemon.component';
import { InjectPokemonData, Pokemon } from '../../Models/pokemon';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { PokedexService } from '../../Services/pokedexService/pokedex.service';
import { Pokedex } from '../../Models/pokedex';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';
import { PokemonCard, PokemonCardTypeSelected } from '../../Models/pokemonCard';
import { OwnedPokemonCard } from '../../Models/OwnedChasePokemonCard';
import { PrintingTypeEnum } from '../../Models/cardPrinting';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-specific-pokemon-pokedex',
  imports: [MatIconModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './specific-pokemon-pokedex.component.html',
  styleUrl: './specific-pokemon-pokedex.component.scss',
})
export class SpecificPokemonPokedexComponent implements OnInit {
  @Input() pokedex!: Pokedex;
  readonly dialog = inject(MatDialog);

  pokemons: Pokemon[] = [];

  slotCards: {slot: number; card: PokemonCard[]}[] = [];
  ownedCards: OwnedPokemonCard[] = [];
  onlyNormal = false;

  PrintingType = PrintingTypeEnum;

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

    let pokemonChoosedId = this.pokedex.specificPokemons.map(s => s.pokemonId);
    let data: InjectPokemonData = {
      number: n,
      pokemons: this.pokemons.filter(p => !pokemonChoosedId.includes(p.id)),
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

  isCardOwned(cardId: string, type: PrintingTypeEnum)
  {
    return this.ownedCards.findIndex(oc => oc.pokemonCard.id == cardId && oc.printingType == type) !== -1;
  }

  handleClickImage(card: PokemonCard, type: PrintingTypeEnum, slot: number)
  {
    var p = this.pokedex.specificPokemons.find((s) => s.slot == slot)
    if(p == null) return;

    card.pokemonId = p.pokemonId

    if(this.ownedCards.findIndex(oc => oc.pokemonCard.id == card.id && oc.printingType == type) !== -1)
    {
      this.pokemonCardService.delete(this.pokedex.id, card.id, PokemonCardTypeSelected.Owned, type).subscribe(() => {
        this.ownedCards = this.ownedCards.filter(oc => !(oc.pokemonCardId == card.id && oc.printingType == type));
      })
    } else {
      this.pokemonCardService.setOwnedCard(card, this.pokedex.id, type).subscribe((res) => {
        this.ownedCards.push(res);
      });
    }
  }

  handleToggle(checked: boolean)
  {
    if(checked)
    {
      this.onlyNormal = true;
    } else {
      this.onlyNormal = false;
    }
    this.initCards();
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
        var cards = r;
        if(this.onlyNormal)
        {
          cards.forEach(c => {
            c.cardPrintings = c.cardPrintings.filter(cp => cp.type === PrintingTypeEnum.Normal);
          });
        } 
        var newItem = {slot: sp.slot, card: cards}
        this.slotCards.push(newItem);
        this.slotCards.sort((a, b) => a.slot - b.slot);
      })
    })

    this.pokemonCardService.getAllOwned(this.pokedex.id).subscribe(res => 
      {
        this.ownedCards = res
  });
  }

  private initCardBySlot(n: number, pId: number){
    var sc = this.slotCards.findIndex(sc => sc.slot === n);
    this.pokemonCardService.getAllByPokemonId(pId).subscribe(res => {
      if(this.onlyNormal)
      {
        res.forEach(c => {
          c.cardPrintings = c.cardPrintings.filter(cp => cp.type === PrintingTypeEnum.Normal);
        })
      }
      if(sc !== -1)
      {
        this.slotCards[sc].card = res;
      } else {
        var newItem = {slot: n, card: res}
        this.slotCards.push(newItem);
      }
    })
  }
}
