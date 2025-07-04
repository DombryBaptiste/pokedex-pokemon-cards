import { PokemonCard } from "./pokemonCard";

export interface OwnedPokemonCard{
    id: number;
    pokedexId: number;
    pokemonCardId: string;
    pokemonCard: PokemonCard;
    pokemonId: number;
    addeddate: Date;
    price: number;
    acquiredPrice: number
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