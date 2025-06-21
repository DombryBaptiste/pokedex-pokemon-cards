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