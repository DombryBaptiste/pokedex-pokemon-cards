
using API_pokedex_pokemon_card.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class PokedexService : IPokedexService
{
    private readonly AppDbContext _context;
    public PokedexService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(int userId, string name, PokedexType type)
    {
        Pokedex pokedex = new Pokedex
        {
            Name = name,
            ShareCode = GenerateShareCode(),
            Type = type,
        };

        await _context.Pokedexs.AddAsync(pokedex);
        await _context.SaveChangesAsync();

        var pokedexUser = new PokedexUser
        {
            PokedexId = pokedex.Id,
            UserId = userId,
            IsOwner = true
        };

        await _context.PokedexUsers.AddAsync(pokedexUser);
        await _context.SaveChangesAsync();
    
    }
    
    public async Task<Pokedex?> GetByIdAsync(int id)
    {
        return await _context.Pokedexs.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Pokedex?> CreateByShareCode(string shareCode, int userId)
    {
        var pokedex = await _context.Pokedexs
            .FirstOrDefaultAsync(p => p.ShareCode == shareCode);

        if (pokedex == null)
        {
            return null;
        }

        // Vérifier si l'utilisateur est déjà lié à ce pokedex
        var alreadyExists = await _context.PokedexUsers
            .AnyAsync(pu => pu.PokedexId == pokedex.Id && pu.UserId == userId);

        if (alreadyExists)
        {
            throw new InvalidOperationException("L'utilisateur est déjà dans ce Pokédex.");
        }

        // Ajouter l'utilisateur au pokedex
        var pokedexUser = new PokedexUser
        {
            PokedexId = pokedex.Id,
            UserId = userId,
            IsOwner = false
        };

        _context.PokedexUsers.Add(pokedexUser);
        
        pokedex.ShareCode = GenerateShareCode();
        _context.Update(pokedex);

        await _context.SaveChangesAsync();

        return pokedex;
    }

    public async Task<PokedexCompletion> GetCompletionPokedex(int pokedexId, int userId)
    {
        // Récupère uniquement les données nécessaires du pokédex
        var pokedexData = await _context.Pokedexs
            .Where(p => p.Id == pokedexId)
            .Select(p => new
            {
                WantedPairs = p.WantedPokemonCards
                    .Select(w => new { w.PokemonId, w.PokemonCardId })
                    .Distinct(),
                OwnedPairs = p.OwnedPokemonCards
                    .Select(o => new { o.PokemonId, o.PokemonCardId })
                    .Distinct()
            })
            .FirstOrDefaultAsync();

        if (pokedexData == null)
        {
            return new PokedexCompletion { MaxPokemon = 0, OwnedPokemonNb = 0 };
        }

        // Nombre total de Pokémon visibles
        var maxPokemon = await _context.Pokemons.CountAsync();

        // Intersection des paires (PokemonId + PokemonCardId)
        var ownedWantedCount = pokedexData.OwnedPairs
            .Intersect(pokedexData.WantedPairs)
            .Count();

        return new PokedexCompletion
        {
            MaxPokemon = maxPokemon,
            OwnedPokemonNb = ownedWantedCount
        };
    }


    private static string GenerateShareCode(int length = 10)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, length)
        .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}