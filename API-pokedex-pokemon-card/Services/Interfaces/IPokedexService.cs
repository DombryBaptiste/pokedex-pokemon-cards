public interface IPokedexService
{
    Task CreateAsync(int userId, string name, PokedexType type);
    Task<Pokedex?> GetByIdAsync(int id);
    Task<Pokedex?> CreateByShareCode(string shareCode, int userId);
    Task<PokedexCompletion?> GetCompletionPokedex(int pokedexId);
    Task<PokedexSpecificPokemon> SetSpecificPokemon(int pokedexId, int slot, int pokemonId);
    Task DeleteAsync(int pokedexId);
}