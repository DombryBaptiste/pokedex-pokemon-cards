import { Component, OnInit } from '@angular/core';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PokemonService } from '../../Services/pokemonService/pokemon.service';
import { Pokemon } from '../../Models/pokemon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PokemonCardService } from '../../Services/pokemonCardService/pokemon-card.service';
import { PokemonCard } from '../../Models/pokemonCard';
import { CardPrinting, PrintingTypeEnum } from '../../Models/cardPrinting';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-panel-admin',
  imports: [
    CommonModule,
    MatAutocompleteModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.scss',
})
export class PanelAdminComponent implements OnInit {
  pokemons: Pokemon[] = [];
  cards: PokemonCard[] = [];
  pokemonCtrl = new FormControl('');
  filteredPokemons: Pokemon[] = [];
  selectedPokemon?: Pokemon;
  selectedByCard: Record<string, Set<PrintingTypeEnum>> = {};

  PrintingTypeEnum = PrintingTypeEnum;
  printingTypes = Object.keys(PrintingTypeEnum).filter((key) =>
    isNaN(Number(key))
  ) as (keyof typeof PrintingTypeEnum)[];

  legendItems = [
    { label: 'Normal', class: 'Normal' },
    { label: 'Reverse', class: 'Reverse' },
    { label: 'Non Holo', class: 'NonHolo' },
    { label: 'Holo Cosmo', class: 'HoloCosmo' },
    { label: 'Holo Cracked Ice', class: 'HoloCrackedIce' },
    { label: 'Tampon League', class: 'TamponLeague' },
  ];

  constructor(
    private pokemonService: PokemonService,
    private pokemonCardService: PokemonCardService
  ) {}

  ngOnInit() {
    this.initData();

    this.pokemonCtrl.valueChanges.subscribe((value) => {
      const filterValue = (value ?? '').toLowerCase();
      this.filteredPokemons = this.pokemons.filter((p) =>
        p.name.toLowerCase().includes(filterValue)
      );
    });
  }

  handleSelect(event: MatAutocompleteSelectedEvent) {
    const name = event.option.value as string;
    const p = this.pokemons.find((x) => x.name === name);
    if (!p) return;

    this.selectedPokemon = p;

    this.pokemonCardService.getAllByPokemonId(p.id).subscribe((res) => {
      this.cards = res;
      this.initSelectedByCard(res);
    });
  }

  handleChangeCheckbox(
    event: MatCheckboxChange,
    cardId: string,
    type: PrintingTypeEnum
  ) {
    var isDelete = event.checked == false;

    this.pokemonCardService.setTypeCard(cardId, type, isDelete).subscribe();
  }

  private initData() {
    this.pokemonService.getAll().subscribe((res) => {
      this.pokemons = res;
    });
  }

  private initSelectedByCard(cards: any[]) {
    this.selectedByCard = {};
    for (const c of cards) {
      this.selectedByCard[c.id] = new Set(
        (c.cardPrintings ?? []).map((cp: CardPrinting) => cp.type)
      );
    }
  }
}
