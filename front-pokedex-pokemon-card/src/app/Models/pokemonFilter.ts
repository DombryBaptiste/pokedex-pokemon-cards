export interface PokemonFilter
{
    filterGeneration?: number;
    filterName?: string;
    pokedexId?: number;
    filterExceptWantedAndOwned?: boolean;
    filterExceptHasNoWantedCard?: boolean;
}