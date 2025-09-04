export interface Pokedex {
    id: number;
    userId: number;
    name: string;
    shareCode: string;
    type: PokedexType;
    specificPokemons: PokedexSpecificPokemons[];
}

export interface PokedexCreate {
    name: string;
    userId: number;
    type: PokedexType;
}

export interface PokedexUser {
    pokedexId: number;
    userId: number;
    isOwner: boolean;
    pokedex: Pokedex;
    type: PokedexType;
}

export interface PokedexCompletion {
    pokedexId: number
    maxPokemon: number
    ownedPokemonNb: number
}

export interface PokedexStats {
    title: string;
    pokedexValuationHistory: PokedexValuationHistory[];
    acquiredPriceTotal: number;
}

export interface PokedexValuationHistory {
    id: number;
    pokedexId: number;
    recordedAt: Date;
    totalValue: number;
}

export interface PokedexSpecificPokemons {
    id: number;
    pokemonId: number;
    slot: number;
}

export enum PokedexType {
    LivingDex,
    SpecificPokemonsDex 
}