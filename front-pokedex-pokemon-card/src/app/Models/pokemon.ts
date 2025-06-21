import { PokemonCard } from "./pokemonCard";

export interface Pokemon {
    id: number;
    pokedexId: number;
    name: string;
    generation: number;
    imagePath: string;
    pokemonCards: PokemonCard[];
}