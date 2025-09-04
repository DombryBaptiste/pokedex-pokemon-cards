
using API_pokedex_pokemon_card.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class PokemonCardService : IPokemonCardService
{
    AppDbContext _context;
    IPokedexValuationHistoryService _valuationService;
    public PokemonCardService(AppDbContext context, IPokedexValuationHistoryService valuationService)
    {
        _context = context;
        _valuationService = valuationService;
    }
    public async Task<List<PokemonCard>> GetAllByPokemonIdAsync(int pokemonId)
    {
        var result = await _context.PokemonCardPokemons
            .Where(pcp => pcp.PokemonId == pokemonId)
            .Include(pcp => pcp.PokemonCard).ThenInclude(pc => pc.Set)
            .Include(pcp => pcp.PokemonCard).ThenInclude(pc => pc.CardPrintings)
            .Select(pcp => pcp.PokemonCard)
            .OrderBy(pc => pc.Set.ReleaseDate)
            .ToListAsync();

        foreach (var pc in result)
        {
            pc.CardPrintings = pc.CardPrintings.OrderBy(cp => cp.Type).ToList();
        }

        return result;
    }


    public async Task SetChaseCardAsync(int pokedexId, string cardId, int pokemonId)
    {
        var existing = await _context.PokedexWantedPokemonCards.FirstOrDefaultAsync(x => x.PokedexId == pokedexId && x.PokemonId == pokemonId);

        if (existing != null)
        {
            existing.AddedDate = DateTime.UtcNow;
            existing.PokedexId = pokedexId;
            existing.PokemonCardId = cardId;
            existing.PokemonId = pokemonId;
            _context.Update(existing);
        }
        else
        {
            var newCard = new PokedexWantedPokemonCard
            {
                PokedexId = pokedexId,
                PokemonCardId = cardId,
                AddedDate = DateTime.UtcNow,
                PokemonId = pokemonId
            };
            _context.PokedexWantedPokemonCards.Add(newCard);
        }

        await _context.SaveChangesAsync();
    }

    public async Task<PokedexOwnedPokemonCard> SetOwnedCardAsync(int pokedexId, string cardId, int pokemonId, PrintingType? type)
    {
        var existing = await _context.PokedexOwnedPokemonCards.FirstOrDefaultAsync(x =>
            x.PokedexId == pokedexId && x.PokemonId == pokemonId &&
            x.PrintingType == type && x.PokemonCardId == cardId
        );

        if (existing != null)
        {
            existing.AcquiredDate = DateOnly.FromDateTime(DateTime.UtcNow);
            existing.PokedexId = pokedexId;
            existing.PokemonCardId = cardId;
            existing.PokemonId = pokemonId;
            existing.PrintingType = type;
            _context.Update(existing);
        }
        else
        {
            existing = new PokedexOwnedPokemonCard
            {
                PokedexId = pokedexId,
                PokemonCardId = cardId,
                AcquiredDate = DateOnly.FromDateTime(DateTime.UtcNow),
                PokemonId = pokemonId,
                State = CardState.NM,
                PrintingType = type
            };
            _context.PokedexOwnedPokemonCards.Add(existing);
        }

        await _context.SaveChangesAsync();

        await _context.Entry(existing).Reference(oc => oc.PokemonCard).LoadAsync();

        return existing;
    }

    public async Task<PokemonOwnedWantedCard> GetCardByPokedexAndPokemonIdAsync(int pokedexId, int pokemonId)
    {
        PokemonOwnedWantedCard result = new();

        result.OwnedPokemonCard = await _context.PokedexOwnedPokemonCards.Include(c => c.PokemonCard).ThenInclude(p => p.Set).FirstOrDefaultAsync(p => p.PokedexId == pokedexId && p.PokemonId == pokemonId);
        result.WantedPokemonCard = await _context.PokedexWantedPokemonCards.Include(c => c.PokemonCard).ThenInclude(p => p.Set).FirstOrDefaultAsync(p => p.PokedexId == pokedexId && p.PokemonId == pokemonId);

        return result;
    }

    public async Task DeleteCard(int pokedexId, string pokemonCardId, PrintingType? printingType, PokemonCardTypeSelected type)
    {
        if (type == PokemonCardTypeSelected.Owned)
        {
            var card = await _context.PokedexOwnedPokemonCards.FirstOrDefaultAsync(c => c.PokedexId == pokedexId && c.PokemonCardId == pokemonCardId && c.PrintingType == printingType);

            if (card != null)
            {
                _context.PokedexOwnedPokemonCards.Remove(card);
            }
        }
        else if (type == PokemonCardTypeSelected.Wanted)
        {
            var card = await _context.PokedexWantedPokemonCards.FirstOrDefaultAsync(c => c.PokedexId == pokedexId && c.PokemonCardId == pokemonCardId);

            if (card != null)
            {
                _context.PokedexWantedPokemonCards.Remove(card);
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task<PokedexOwnedPokemonCard?> UpdateOwnedCard(int cardId, PokedexOwnedPokemonCard card)
    {
        var existingCard = await _context.PokedexOwnedPokemonCards.FindAsync(cardId);
        if (existingCard == null)
            return null;

        existingCard.Price = card.Price;
        existingCard.AcquiredPrice = card.AcquiredPrice;
        existingCard.State = card.State;
        existingCard.AcquiredDate = card.AcquiredDate;

        await _context.SaveChangesAsync();

        await _valuationService.UpdateTodaySum(existingCard.PokedexId);
        return existingCard;
    }

    public async Task<List<PokemonCard>> GetAllWantedButNotOwnedCardByPokedexId(int pokedexId)
    {
        var allWanted = await _context.PokedexWantedPokemonCards
            .AsNoTracking()
            .Where(p => p.PokedexId == pokedexId)
            .ToListAsync();

        var allOwned = await _context.PokedexOwnedPokemonCards
            .AsNoTracking()
            .Where(p => p.PokedexId == pokedexId)
            .ToListAsync();

        var ownedCardIds = allOwned.Select(o => o.PokemonCardId).ToHashSet();

        var notOwnedCardIds = allWanted
            .Where(w => !ownedCardIds.Contains(w.PokemonCardId))
            .Select(w => w.PokemonCardId)
            .Distinct()
            .ToList();

        var notOwnedCards = await _context.PokemonCards
            .AsNoTracking()
            .Include(c => c.Set)
            .Where(c => notOwnedCardIds.Contains(c.Id))
            .OrderBy(c => c.Set.ReleaseDate)
            .ToListAsync();

        return notOwnedCards;
    }

    public async Task<List<PokedexOwnedPokemonCard>> GetAllOwnedCards(int pokedexId)
    {
        var allOwned = await _context.PokedexOwnedPokemonCards
            .Include(o => o.PokemonCard)
            .AsNoTracking()
            .Where(p => p.PokedexId == pokedexId)
            .OrderByDescending(p => p.AcquiredDate)
            .ToListAsync();

        return allOwned;
    }

    public async Task SetTypeCard(string cardId, PrintingType type)
    {
        var printingType = new CardPrinting()
        {
            PokemonCardId = cardId,
            Type = type
        };

        await _context.CardPrintings.AddAsync(printingType);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteTypeCard(string cardId, PrintingType type)
    {
        var printingType = await _context.CardPrintings.FirstOrDefaultAsync(cp => cp.PokemonCardId == cardId && cp.Type == type);
        if (printingType != null)
        {
            _context.CardPrintings.Remove(printingType);
            await _context.SaveChangesAsync();
        }

    }
}