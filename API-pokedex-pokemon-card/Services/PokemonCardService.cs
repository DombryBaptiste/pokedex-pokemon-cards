
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

    public async Task SetChaseCardAsync(int pokedexId, string cardId, int pokemonId)
    {
        var existing = await _context.PokedexWantedPokemonCards.FirstOrDefaultAsync(x => x.PokedexId == pokedexId && x.PokemonId == pokemonId);

        if (existing != null)
        {
            existing.AddedDate = DateTime.UtcNow;
            existing.PokedexId = pokedexId;
            existing.PokemonCardId = cardId;
            existing.PokemonId = pokedexId;
            _context.Update(existing);
        }
        else
        {
            var newCard = new PokedexWantedPokemonCard
            {
                PokedexId = pokedexId,
                PokemonCardId = cardId,
                AddedDate = DateTime.UtcNow,
                PokemonId = pokedexId
            };
            _context.PokedexWantedPokemonCards.Add(newCard);
        }

        await _context.SaveChangesAsync();
    }

    public async Task SetOwnedCardAsync(int pokedexId, string cardId, int pokemonId)
    {
        var existing = await _context.PokedexOwnedPokemonCards.FirstOrDefaultAsync(x => x.PokedexId == pokedexId && x.PokemonId == pokemonId);

        if (existing != null)
        {
            existing.AcquiredDate = DateTime.UtcNow;
            existing.PokedexId = pokedexId;
            existing.PokemonCardId = cardId;
            existing.PokemonId = pokedexId;
            _context.Update(existing);
        }
        else
        {
            var newCard = new PokedexOwnedPokemonCard
            {
                PokedexId = pokedexId,
                PokemonCardId = cardId,
                AcquiredDate = DateTime.UtcNow,
                PokemonId = pokedexId
            };
            _context.PokedexOwnedPokemonCards.Add(newCard);
        }

        await _context.SaveChangesAsync();
    }

    public async Task<PokemonOwnedWantedCard> GetCardByPokedexAndPokemonIdAsync(int pokedexId, int pokemonId)
    {
        PokemonOwnedWantedCard result = new();

        result.OwnedPokemonCard = await _context.PokedexOwnedPokemonCards.Include(c => c.PokemonCard).FirstOrDefaultAsync(p => p.PokedexId == pokedexId && p.PokemonId == pokemonId);
        result.WantedPokemonCard = await _context.PokedexWantedPokemonCards.Include(c => c.PokemonCard).FirstOrDefaultAsync(p => p.PokedexId == pokedexId && p.PokemonId == pokemonId);

        return result;
    }

}