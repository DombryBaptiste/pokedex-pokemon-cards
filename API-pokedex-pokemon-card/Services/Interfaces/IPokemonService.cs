using API_pokedex_pokemon_card.Models;

public interface IPokemonService
{
    Task<List<Pokemon>> GetAllPokemon();
    Task<List<PokemonListDto>> GetAllPokemonFiltered(PokemonFilterDto filters, CancellationToken ct);
    Task<Pokemon?> GetPokemonById(int id);
    Task<List<Pokemon>> GetAllZarbi();
}