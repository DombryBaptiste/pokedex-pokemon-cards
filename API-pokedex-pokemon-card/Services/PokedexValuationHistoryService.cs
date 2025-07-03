using API_pokedex_pokemon_card.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class PokedexValuationHistoryService : IPokedexValuationHistoryService
{
    AppDbContext _context;
    public PokedexValuationHistoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PokedexStatsDto> GetStatsByPokedexId(int pokedexId)
    {
        var result = new PokedexStatsDto()
        {
            Title = "Prix",
            PokedexValuationHistory = await _context.PokedexValuationHistory.Where(p => p.PokedexId == pokedexId).OrderBy(p => p.RecordedAt).ToListAsync(),
            AcquiredPriceTotal = await _context.PokedexOwnedPokemonCards.Where(p => p.PokedexId == pokedexId).SumAsync(p => p.AcquiredPrice),
        };

        return result;
    }

    public async Task UpdateTodaySum(int pokedexId)
    {
        var today = DateTime.UtcNow.Date;

        var existing = await _context.PokedexValuationHistory.FirstOrDefaultAsync(x => x.PokedexId == pokedexId && x.RecordedAt == today);

        var totalValue = await _context.PokedexOwnedPokemonCards
            .Where(x => x.PokedexId == pokedexId)
            .SumAsync(x => (decimal) x.Price);

        if (existing == null)
        {
            _context.PokedexValuationHistory.Add(new PokedexValuationHistory
            {
                PokedexId = pokedexId,
                TotalValue = totalValue,
                RecordedAt = today
            });
        }
        else
        {
            existing.TotalValue = totalValue;
            _context.PokedexValuationHistory.Update(existing);
        }

        await _context.SaveChangesAsync();
    }
}