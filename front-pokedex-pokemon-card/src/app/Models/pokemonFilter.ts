export interface PokemonFilter
{
    filterGeneration?: number;
    filterHiddenActivated?: boolean;
    filterName?: string;
    pokedexId?: number;
    filterExceptWantedAndOwned?: boolean;
}