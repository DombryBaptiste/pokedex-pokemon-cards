public interface IPokemonCardService
{
    Task<List<PokemonCard>> GetAllByPokemonIdAsync(int pokemonId);
    Task SetChaseCardAsync(int pokedexId, string cardId, int pokemonId);
    Task<PokedexOwnedPokemonCard> SetOwnedCardAsync(int pokedexId, string cardId, int pokemonId, PrintingType? type);
    Task<PokemonOwnedWantedCard> GetCardByPokedexAndPokemonIdAsync(int pokedexId, int pokemonId);
    Task DeleteCard(int pokedexId, string pokemonCardId, PrintingType? printingType ,PokemonCardTypeSelected type);
    Task<PokedexOwnedPokemonCard?> UpdateOwnedCard(int cardId, PokedexOwnedPokemonCard card);
    Task<List<PokemonCard>> GetAllWantedButNotOwnedCardByPokedexId(int pokedexId);
    Task<List<PokedexOwnedPokemonCard>> GetAllOwnedCards(int pokedexId);
    Task SetTypeCard(string cardId, PrintingType type);
    Task DeleteTypeCard(string cardId, PrintingType type);
    
}