export interface PokemonCard {
    id: number;
    idLocal: number;
    extension: string;
    name: string;
    image: string;
    pokemonId: number;
}


export enum PokemonCardTypeSelected {
    myCard,
    chaseCard
}

export interface InjectPokemonCardData {
    cards: PokemonCard[];
    type: PokemonCardTypeSelected;
    pokedexId: number;
}