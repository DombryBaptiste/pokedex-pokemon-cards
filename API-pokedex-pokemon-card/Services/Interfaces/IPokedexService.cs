public interface IPokedexService
{
    Task CreateAsync(int userId, string name);
    Task<Pokedex?> GetByIdAsync(int id);
    Task<Pokedex?> CreateByShareCode(string shareCode, int userId);
    Task<PokedexCompletion> GetCompletionPokedex(int pokedexId, int userId);
}