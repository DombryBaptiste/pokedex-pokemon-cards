using API_pokedex_pokemon_card.Infrastructure;
using API_pokedex_pokemon_card.Models;
using Microsoft.EntityFrameworkCore;

public class PokemonService : IPokemonService
{
    private readonly AppDbContext _context;
    private readonly IUserContext _userContext;
    public PokemonService(AppDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    public async Task<List<Pokemon>> GetAllPokemon()
    {
        return await _context.Pokemons.ToListAsync();
    }

    public async Task<List<Pokemon>> GetAllPokemonByGen(int gen, PokemonFilterDto? filters)
    {
        IQueryable<Pokemon> query = _context.Pokemons.AsQueryable();

        query = query.Where(p => p.Generation == gen);

        if (filters?.FilterHiddenActivated == false)
        {
            var hiddenIds = await _context.Users.Where(u => u.Id == _userContext.UserId).Select(u => u.HiddenPokemonIds).FirstOrDefaultAsync();
            if (hiddenIds != null && hiddenIds.Any())
            {
                query = query.Where(p => !hiddenIds.Contains(p.Id));
            }
        }

        return await query.ToListAsync();
    }

    public async Task<Pokemon?> GetPokemonById(int id)
    {
        return await _context.Pokemons.Where(p => p.Id == id).FirstOrDefaultAsync();
    }
}