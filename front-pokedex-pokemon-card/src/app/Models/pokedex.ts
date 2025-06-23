export interface Pokedex {
    id: number;
    userId: number;
    name: string;
    shareCode: string;
}

export interface PokedexCreate {
    name: string;
    userId: number;
}

export interface PokedexUser {
    pokedexId: number;
    userId: number;
    isOwner: boolean;
    pokedex: Pokedex;
}

export interface PokedexCompletion {
    pokedexId: number
    maxPokemon: number
    ownedPokemonNb: number
}