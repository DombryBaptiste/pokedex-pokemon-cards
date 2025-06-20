public interface IPokemonCardService
{
    Task<List<PokemonCard>> GetAllByPokemonIdAsync(int pokemonId);
}