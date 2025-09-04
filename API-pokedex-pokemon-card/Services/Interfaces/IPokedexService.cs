public interface IPokedexService
{
    Task CreateAsync(int userId, string name, PokedexType type);
    Task<Pokedex?> GetByIdAsync(int id);
    Task<Pokedex?> CreateByShareCode(string shareCode, int userId);
    Task<PokedexCompletion> GetCompletionPokedex(int pokedexId, int userId);
    Task<PokedexSpecificPokemon> SetSpecificPokemon(int pokedexId, int slot, int pokemonId);
}