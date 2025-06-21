
using API_pokedex_pokemon_card.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class PokedexService : IPokedexService
{
    private readonly AppDbContext _context;
    public PokedexService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(int userId, string name)
    {
        Pokedex pokedex = new Pokedex
        {
            UserId = userId,
            Name = name,
            ShareCode = GenerateShareCode()
        };

        await _context.Pokedexs.AddAsync(pokedex);
        await _context.SaveChangesAsync();
    }
    
    public async Task<Pokedex?> GetByIdAsync(int id)
    {
        return await _context.Pokedexs
            .Include(p => p.OwnedPokemonCards)
            .Include(p => p.WantedPokemonCards)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    private static string GenerateShareCode(int length = 10)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, length)
        .Select(s => s[random.Next(s.Length)]).ToArray());
    }

}