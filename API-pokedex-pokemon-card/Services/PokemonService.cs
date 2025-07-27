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

    public async Task<List<PokemonListDto>> GetAllPokemonFiltered(PokemonFilterDto filters)
    {
        IQueryable<Pokemon> query = _context.Pokemons.AsNoTracking();

        List<int> bothWantedAndOwnedIds = new();

        if (filters?.PokedexId != null)
        {
            var pokedex = await _context.Pokedexs
            .Include(p => p.OwnedPokemonCards)
                .ThenInclude(oPC => oPC.PokemonCard)
            .Include(p => p.WantedPokemonCards)
                .ThenInclude(oPC => oPC.PokemonCard)
            .FirstOrDefaultAsync(p => p.Id == filters.PokedexId);

            if (pokedex != null)
            {
                var ownedCardPokemonIds = pokedex.OwnedPokemonCards
                    .Select(o => o.PokemonId)
                    .Distinct().ToList();

                var wantedCardPokemonIds = pokedex.WantedPokemonCards
                    .Select(w => w.PokemonId)
                    .Distinct().ToList();

                bothWantedAndOwnedIds = ownedCardPokemonIds
                    .Intersect(wantedCardPokemonIds)
                    .ToList();

                if (filters.FilterExceptWantedAndOwned == true)
                {
                    query = query.Where(p => !bothWantedAndOwnedIds.Contains(p.Id));
                }
                if (filters?.FilterExceptHasNoWantedCard == true)
                {
                    query = query.Where(p => wantedCardPokemonIds.Contains(p.Id));
                }
            }
        }

        if (filters?.FilterGeneration != null)
        {
            var generation = (int)filters.FilterGeneration;
            query = query.Where(p => p.Generation == generation);
        }
        if (filters?.FilterHiddenActivated == false)
            {
                var hiddenIds = await _context.Users.Where(u => u.Id == _userContext.UserId).Select(u => u.HiddenPokemonIds).FirstOrDefaultAsync();
                if (hiddenIds != null && hiddenIds.Any())
                {
                    query = query.Where(p => !hiddenIds.Contains(p.Id));
                }
            }

        if (filters?.FilterName != null)
        {
            var filter = $"%{filters.FilterName}%";
            query = query.Where(p => EF.Functions.Like(p.Name, filter));
        }

        return await query
            .Select(p => new PokemonListDto
            {
                Id = p.Id,
                Name = p.Name,
                Generation = p.Generation,
                ImagePath = p.ImagePath,
                PokedexId = p.PokedexId,
                IsWantedAndOwned = bothWantedAndOwnedIds.Contains(p.Id)
            })
            .ToListAsync();

    }

    public async Task<Pokemon?> GetPokemonById(int id)
    {
        var pokemon = await _context.Pokemons
            .Include(p => p.PokemonCardPokemons)
                .ThenInclude(pcp => pcp.PokemonCard)
                    .ThenInclude(pc => pc.Set)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pokemon != null)
        {
            pokemon.PokemonCards = pokemon.PokemonCardPokemons
                .Select(pcp =>
                {
                    var card = pcp.PokemonCard;
                    card.PokemonId = pokemon.Id;
                    return card;
                })
                .OrderBy(card => card.Set.ReleaseDate)
                .ToList();
        }


        return pokemon;
    }

}