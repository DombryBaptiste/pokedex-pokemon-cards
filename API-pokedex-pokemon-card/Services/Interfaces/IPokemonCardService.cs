public interface IPokemonCardService
{
    Task<List<PokemonCard>> GetAllByPokemonIdAsync(int pokemonId);
    Task SetChaseCardAsync(int pokedexId, string cardId, int pokemonId);
    Task SetOwnedCardAsync(int pokedexId, string cardId, int pokemonId);
    Task<PokemonOwnedWantedCard> GetCardByPokedexAndPokemonIdAsync(int pokedexId, int pokemonId);
    Task DeleteCard(int pokedexId, int pokemonId, PokemonCardTypeSelected type);
    Task<PokedexOwnedPokemonCard?> UpdateOwnedCard(int cardId, PokedexOwnedPokemonCard card);
    
}