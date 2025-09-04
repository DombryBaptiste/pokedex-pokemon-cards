import { PrintingTypeEnum } from "./cardPrinting";
import { PokemonCard } from "./pokemonCard";

export interface OwnedPokemonCard{
    id: number;
    pokedexId: number;
    pokemonCardId: string;
    pokemonCard: PokemonCard;
    pokemonId: number;
    acquiredDate: Date;
    price: number;
    acquiredPrice: number;
    state: CardState;
    printingType: PrintingTypeEnum;
}

export interface WantedPokemonCard{
    id: number;
    pokedexId: number;
    pokemonCardId: string;
    pokemonCard: PokemonCard;
    pokemonId: number;
    addeddate: Date;
}

export interface OwnedWantedPokemonCard {
    ownedPokemonCard: OwnedPokemonCard;
    wantedPokemonCard: WantedPokemonCard;
}

export enum CardState {
    NM,
    EX,
    GD,
    LP,
    PL,
    PO
}