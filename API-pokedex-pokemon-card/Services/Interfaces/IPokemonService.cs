using API_pokedex_pokemon_card.Models;

public interface IPokemonService
{
    Task<List<Pokemon>> GetAllPokemon();
    Task<List<Pokemon>> GetAllPokemonFiltered(PokemonFilterDto? filters);
    Task<Pokemon?> GetPokemonById(int id);
}