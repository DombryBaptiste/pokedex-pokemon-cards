
using API_pokedex_pokemon_card.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class PokemonCardService : IPokemonCardService
{
    AppDbContext _context;
    public PokemonCardService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<PokemonCard>> GetAllByPokemonIdAsync(int pokemonId)
    {
        return await _context.PokemonCards.Where(c => c.PokemonId == pokemonId).ToListAsync();
    }
}