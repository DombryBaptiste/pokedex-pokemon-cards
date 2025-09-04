import { CardPrinting } from "./cardPrinting";
import { Sets } from "./sets";

export interface PokemonCard {
    id: number;
    localId: number;
    extension: string;
    name: string;
    image: string;
    pokemonId: number;
    set: Sets;
    cardPrintings: CardPrinting[];
}


export enum PokemonCardTypeSelected {
    Owned,
    Wanted
}

export interface InjectPokemonCardData {
    cards: PokemonCard[];
    type: PokemonCardTypeSelected;
    pokedexId: number;
    pokemonId: number;
}