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