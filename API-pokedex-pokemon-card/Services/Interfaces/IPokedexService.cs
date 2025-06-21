public interface IPokedexService
{
    Task CreateAsync(int userId, string name);
    Task<Pokedex?> GetByIdAsync(int id);
}