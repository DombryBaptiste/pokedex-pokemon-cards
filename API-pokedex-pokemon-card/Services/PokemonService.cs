using API_pokedex_pokemon_card.Infrastructure;
using API_pokedex_pokemon_card.Models;
using Microsoft.EntityFrameworkCore;

public class PokemonService : IPokemonService
{
    AppDbContext _context;
    public PokemonService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Pokemon>> GetAllPokemon()
    {
        return await _context.Pokemons.ToListAsync();
    }

    public async Task<List<Pokemon>> GetAllPokemonByGen(int gen)
    {
        return await _context.Pokemons.Where(p => p.Generation == gen).ToListAsync();
    }
}