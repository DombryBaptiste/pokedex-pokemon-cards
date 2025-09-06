
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
        return await _context.Pokedexs.Include(p => p.SpecificPokemons).FirstOrDefaultAsync(p => p.Id == id);
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

    public async Task<PokedexCompletion?> GetCompletionPokedex(int pokedexId, int userId)
    {
        var pokedexData = await _context.Pokedexs
            .Where(p => p.Id == pokedexId)
            .Select(p => new PokedexCompletionData
            {
                Type = p.Type,
                WantedPairs = p.WantedPokemonCards
                    .Select(w => new Pair(w.PokemonId, w.PokemonCardId)).Distinct().ToList(),
                OwnedPairs = p.OwnedPokemonCards
                    .Select(o => new Pair(o.PokemonId, o.PokemonCardId)).Distinct().ToList()
            })
            .FirstOrDefaultAsync();

        if (pokedexData == null)
        {
            throw new KeyNotFoundException($"Le pokédex d'id : {pokedexId} est introuvable");
        }

        switch (pokedexData.Type)
        {
            case PokedexType.LivingDex:
                return GetLivingDexCompletion(pokedexData);
            default:
                return null;  
        }    
    }

    public async Task<PokedexSpecificPokemon> SetSpecificPokemon(int pokedexId, int slot, int pokemonId)
    {
        var pokedex = await _context.Pokedexs.Include(p => p.SpecificPokemons).FirstOrDefaultAsync(p => p.Id == pokedexId);

        if (pokedex == null)
        {
            throw new ArgumentException($"Le pokedex d'id : {pokedexId} n'existe pas.");
        }
        if (pokedex.Type != PokedexType.SpecificPokemonsDex)
        {
            throw new InvalidOperationException("Ce pokedex n'est pas du bon type.");
        }

        var specific = pokedex.SpecificPokemons.Find(s => s.Slot == slot);

        if (specific == null)
        {
            specific = new PokedexSpecificPokemon()
            {
                Slot = slot,
                PokedexId = pokedexId,
                PokemonId = pokemonId

            };
            _context.Add(specific);
        }
        else
        {
            specific.Slot = slot;
            specific.PokemonId = pokemonId;
        }

        await _context.SaveChangesAsync();

        return specific;
    }


    private static string GenerateShareCode(int length = 10)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, length)
        .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    private PokedexCompletion GetLivingDexCompletion(PokedexCompletionData data)
    {
        var maxPokemon = data.WantedPairs.Count();
        var ownedWantedCount = data.OwnedPairs
            .Intersect(data.WantedPairs)
            .Count();

        return new PokedexCompletion
        {
            MaxPokemon = maxPokemon,
            OwnedPokemonNb = ownedWantedCount
        };
    }
}